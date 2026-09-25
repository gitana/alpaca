/**
 * Eleventy config for the Alpaca web site (site/ -> dist/site/).
 *
 * The site was originally a Jekyll site, so this keeps Jekyll's conventions:
 *   - only files with front matter are templates (Liquid + Markdown), everything else is copied as-is
 *   - files and folders starting with "_" or "." are not published
 *   - pages are written to <name>.html rather than <name>/index.html
 *
 * Third-party libraries are published to /lib from site/node_modules (see site/package.json) and site/_vendor
 * (libraries not available from npm), and the Alpaca build (dist/alpaca) to /lib/alpaca.
 */
import fs from "node:fs";
import path from "node:path";
import { applyFieldDocs, generateFieldDocs } from "./scripts/field-docs.mjs";
import jekyllMarkdown from "./scripts/markdown.mjs";

const INPUT = "site";

// site-level files that belong to the build rather than the published site
const UNPUBLISHED = new Set(["node_modules", "package.json", "package-lock.json"]);

function hasFrontMatter(file)
{
    const fd = fs.openSync(file, "r");
    const buf = Buffer.alloc(3);
    fs.readSync(fd, buf, 0, 3, 0);
    fs.closeSync(fd);
    return buf.toString() === "---";
}

// every publishable file under site/ that isn't a template
function staticFiles(dir = INPUT)
{
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        if (entry.name.startsWith("_") || entry.name.startsWith(".") || (dir === INPUT && UNPUBLISHED.has(entry.name))) {
            return [];
        }
        const file = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            return staticFiles(file);
        }
        return hasFrontMatter(file) ? [] : [file];
    });
}

export default function(eleventyConfig)
{
    // static files
    for (const file of staticFiles()) {
        eleventyConfig.addPassthroughCopy(file);
    }

    // third-party libraries and the alpaca build
    if (!fs.existsSync("site/node_modules")) {
        console.warn("[site] site/node_modules not found - run `npm run site:install` to install the site's third-party libraries");
    }
    eleventyConfig.addPassthroughCopy({ "site/node_modules": "lib", "site/_vendor": "lib", "dist/alpaca": "lib/alpaca" });
    eleventyConfig.ignores.add("site/node_modules/**");
    eleventyConfig.addWatchTarget("dist/alpaca/");
    eleventyConfig.setUseGitIgnore(false); // dist/ is gitignored, which would otherwise stop the watch above

    // Jekyll-style liquid: {% include file.html %} with unquoted names, variables shared with the including template
    eleventyConfig.setLiquidOptions({
        dynamicPartials: false,
        jekyllInclude: true,
        strictFilters: false
    });

    // render markdown the way kramdown did
    eleventyConfig.amendLibrary("md", jekyllMarkdown);

    // Jekyll-style output paths (foo.md -> foo.html)
    eleventyConfig.addGlobalData("permalink", () => (data) => `${data.page.filePathStem}.html`);

    // field documentation tables (regenerated each build so that they track the latest alpaca build)
    let fieldDocs = {};
    eleventyConfig.on("eleventy.before", async () => {
        fieldDocs = await generateFieldDocs();
    });
    eleventyConfig.addTransform("field-docs", function(content) {
        if ((this.page.outputPath || "").endsWith(".html")) {
            return applyFieldDocs(content, fieldDocs);
        }
        return content;
    });

    return {
        dir: {
            input: INPUT,
            output: "dist/site",
            includes: "_includes",
            layouts: "_layouts",
            data: "_data"
        },
        templateFormats: ["md", "liquid"],
        markdownTemplateEngine: "liquid"
    };
}
