#!/usr/bin/env node
/**
 * Builds the Alpaca library into dist/alpaca/<flavor>/ (which is what gets published).
 *
 *   node scripts/build.mjs           build once
 *   node scripts/build.mjs --watch   build, then rebuild on changes to src/, thirdparty/ or config/
 *
 * For each flavor (see scripts/sources.mjs) this:
 *   1. precompiles the Handlebars templates into HandlebarsPrecompiled[<view>][<template>]
 *   2. concatenates templates + core + view scripts and wraps them in a UMD (CommonJS / AMD / global) wrapper
 *   3. concatenates the CSS and copies images
 *   4. minifies JS and CSS with esbuild
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as esbuild from "esbuild";
import Handlebars from "handlebars";

import { core, flavors } from "./sources.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "dist", "alpaca");

// strips any UTF-8 BOM so that it doesn't end up in the middle of a concatenated file
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), "utf8").replace(/^﻿/, "");
const pkg = () => JSON.parse(read("package.json"));

function license(version)
{
    return read("config/license.txt.template").replace(/<%=\s*version\s*%>/g, version);
}

function compileTemplates(views)
{
    const lines = ['this["HandlebarsPrecompiled"] = this["HandlebarsPrecompiled"] || {};'];
    for (const view of views)
    {
        const dir = path.join(ROOT, "src", "templates", view);
        if (!fs.existsSync(dir)) {
            continue;
        }

        const ns = `this["HandlebarsPrecompiled"][${JSON.stringify(view)}]`;
        lines.push(`${ns} = ${ns} || {};`);

        for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".html")).sort())
        {
            const name = file.slice(0, -".html".length);
            const spec = Handlebars.precompile(fs.readFileSync(path.join(dir, file), "utf8"));
            lines.push(`${ns}[${JSON.stringify(name)}] = Handlebars.template(${spec});`);
        }
    }
    return lines.join("\n");
}

function umd(contents, { deps, defaultView })
{
    const cjs = deps.map((d) => `require('${d.name}')`).join(", ");
    const amd = JSON.stringify(deps.map((d) => d.name));
    const globals = deps.map((d) => `root["${d.global}"]`).join(", ");
    const params = deps.map((d) => d.param).join(", ");

    return `(function(root, factory)
{
    var umdEnabled = true;
    if (root && typeof(root.umd) != "undefined") {
        umdEnabled = root.umd;
    }

    if (umdEnabled && typeof exports === 'object')
    {
        // common js
        module.exports = factory(${cjs});
    }
    else if (umdEnabled && typeof define === 'function' && define.amd)
    {
        // amd
        define("alpaca", ${amd}, factory);
    }
    else
    {
        // global
        root["Alpaca"] = factory(${globals});
    }

}(this, function (${params}) {

${contents}
${defaultView ? `\nAlpaca.defaultView = '${defaultView}';\n` : ""}
return Alpaca;

}));
`;
}

async function buildFlavor(name, flavor, banner)
{
    const outDir = path.join(OUT_DIR, name);
    fs.mkdirSync(outDir, { recursive: true });

    // js
    const contents = [
        compileTemplates(flavor.templates),
        ...core.map(read),
        ...flavor.views.map(read)
    ].join("\n");
    const js = banner + "\n" + umd(contents, flavor);
    fs.writeFileSync(path.join(outDir, "alpaca.js"), js);

    const minJs = await esbuild.transform(js, {
        loader: "js",
        minify: true,
        target: "es2018", // src/js/Alpaca-async.js uses async iteration; lower targets inject helpers outside the UMD wrapper
        legalComments: "inline",
        logLevel: "error"
    });
    fs.writeFileSync(path.join(outDir, "alpaca.min.js"), minJs.code);

    // css
    const css = flavor.styles.map(read).join("\n");
    fs.writeFileSync(path.join(outDir, "alpaca.css"), css);

    const minCss = await esbuild.transform(css, { loader: "css", minify: true, logLevel: "error" });
    fs.writeFileSync(path.join(outDir, "alpaca.min.css"), minCss.code);

    // images
    fs.cpSync(path.join(ROOT, "src", "css", "images"), path.join(outDir, "images"), { recursive: true });
}

export async function build()
{
    const start = Date.now();
    const { version } = pkg();
    const text = license(version);

    const licenseFile = path.join(ROOT, "license.txt");
    if (!fs.existsSync(licenseFile) || fs.readFileSync(licenseFile, "utf8") !== text) {
        fs.writeFileSync(licenseFile, text);
    }

    // clear out anything that isn't a current flavor (rather than wiping the folder, which would disrupt a running dev server)
    if (fs.existsSync(OUT_DIR))
    {
        for (const entry of fs.readdirSync(OUT_DIR)) {
            if (!flavors[entry]) {
                fs.rmSync(path.join(OUT_DIR, entry), { recursive: true, force: true });
            }
        }
    }

    await Promise.all(Object.entries(flavors).map(([name, flavor]) => buildFlavor(name, flavor, text)));

    console.log(`Built Alpaca ${version} [${Object.keys(flavors).join(", ")}] in ${Date.now() - start}ms`);
}

export function watch()
{
    let timer = null;
    const rebuild = () => {
        clearTimeout(timer);
        timer = setTimeout(() => build().catch((err) => console.error(err)), 100);
    };
    for (const dir of ["src", "thirdparty", "config"]) {
        fs.watch(path.join(ROOT, dir), { recursive: true }, rebuild);
    }
    console.log("Watching src/, thirdparty/ and config/ for changes...");
}

// run as script
if (process.argv[1] === fileURLToPath(import.meta.url))
{
    const args = process.argv.slice(2);
    try {
        await build();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }

    if (args.includes("--watch")) {
        watch();
    }
}
