import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";
import { describe, it, expect, afterEach } from "vitest";
import { createAlpaca } from "./harness.js";

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));

describe.each(["web", "bootstrap"])("%s bundle", (flavor) => {
    const dir = path.join(ROOT, "dist", "alpaca", flavor);
    let alpaca;

    afterEach(() => alpaca && alpaca.close());

    it("produces js, css, minified variants and images", () => {
        for (const file of ["alpaca.js", "alpaca.min.js", "alpaca.css", "alpaca.min.css"]) {
            expect(fs.statSync(path.join(dir, file)).size, file).toBeGreaterThan(1000);
        }
        expect(fs.readdirSync(path.join(dir, "images")).length).toBeGreaterThan(0);
    });

    it("carries the license banner with the current version", () => {
        const js = fs.readFileSync(path.join(dir, "alpaca.min.js"), "utf8");
        expect(js.startsWith("/*!")).toBe(true);
        expect(js).toContain(`Alpaca ${pkg.version}`);
    });

    it("exposes Alpaca as a global with its default view", () => {
        alpaca = createAlpaca({ flavor });
        expect(typeof alpaca.Alpaca).toBe("function");
        expect(typeof alpaca.$.fn.alpaca).toBe("function");
        expect(alpaca.Alpaca.defaultView).toBe(flavor);
    });

    it("registers only web and bootstrap views", () => {
        alpaca = createAlpaca({ flavor });
        const views = Object.keys(alpaca.Alpaca.views);
        expect(views).toContain("web-edit");
        expect(views).toContain("web-display");
        expect(views).toContain("web-create");
        expect(views.some((v) => v.startsWith("bootstrap-"))).toBe(flavor === "bootstrap");
        expect(views.some((v) => /jquery(ui|mobile)/.test(v))).toBe(false);
    });

    it("includes the precompiled templates", () => {
        alpaca = createAlpaca({ flavor });
        const precompiled = alpaca.window.HandlebarsPrecompiled;
        expect(Object.keys(precompiled["web-edit"])).toContain("control-text");
        expect(typeof precompiled["web-edit"]["control-text"]).toBe("function");
        if (flavor === "bootstrap") {
            expect(Object.keys(precompiled["bootstrap-edit"])).toContain("control");
        }
    });

    it("registers the core field types", () => {
        alpaca = createAlpaca({ flavor });
        const types = Object.keys(alpaca.Alpaca.fieldClassRegistry);
        for (const type of ["text", "textarea", "number", "integer", "checkbox", "radio", "select", "array", "object", "email", "hidden", "password"]) {
            expect(types).toContain(type);
        }
    });

    it("minified bundle renders a form", async () => {
        const dom = new JSDOM('<!DOCTYPE html><body><div id="form"></div></body>', { runScripts: "outside-only" });
        const { window } = dom;
        window.eval(fs.readFileSync(require.resolve("jquery/dist/jquery.min.js"), "utf8"));
        window.eval(fs.readFileSync(require.resolve("handlebars/dist/handlebars.min.js"), "utf8"));
        window.eval(fs.readFileSync(path.join(dir, "alpaca.min.js"), "utf8"));

        await new Promise((resolve, reject) => window.jQuery("#form").alpaca({
            data: "hello",
            postRender: resolve,
            error: reject
        }));
        expect(window.jQuery("#form input").val()).toBe("hello");
        window.close();
    });

    it("registers as a named AMD module", () => {
        const dom = new JSDOM("<!DOCTYPE html><body></body>", { runScripts: "outside-only" });
        const { window } = dom;
        const defined = [];
        window.define = (name, deps, factory) => defined.push({ name, deps, factory });
        window.define.amd = {};
        window.eval(fs.readFileSync(path.join(dir, "alpaca.js"), "utf8"));

        expect(defined).toHaveLength(1);
        expect(defined[0].name).toBe("alpaca");
        expect(defined[0].deps.slice(0, 2)).toEqual(["jquery", "handlebars"]);
        expect(window.Alpaca).toBeUndefined();
        window.close();
    });
});
