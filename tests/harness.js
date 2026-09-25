/**
 * Test harness for Alpaca.
 *
 * Each call to createAlpaca() boots a fresh jsdom window with jQuery, Handlebars and the built Alpaca bundle
 * (from dist/alpaca/<flavor>/alpaca.js) loaded as plain browser globals, exactly like a <script> tag would.
 * Run `npm run build` first (`npm test` does this for you).
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const cache = {};
const source = (file) => (cache[file] ??= fs.readFileSync(file, "utf8"));

const JQUERY = require.resolve("jquery/dist/jquery.js");
const HANDLEBARS = require.resolve("handlebars/dist/handlebars.js");
const alpacaBundle = (flavor) => {
    const file = path.join(ROOT, "dist", "alpaca", flavor, "alpaca.js");
    if (!fs.existsSync(file)) {
        throw new Error(`Missing ${path.relative(ROOT, file)} - run "npm run build" first`);
    }
    return file;
};

export function fixture(name)
{
    return JSON.parse(fs.readFileSync(path.join(ROOT, "tests", "fixtures", name), "utf8"));
}

export function createAlpaca({ flavor = "web", body = '<div id="form"></div>' } = {})
{
    const dom = new JSDOM(`<!DOCTYPE html><html><head></head><body>${body}</body></html>`, {
        url: "http://localhost/",
        runScripts: "outside-only",
        pretendToBeVisual: true
    });
    const { window } = dom;

    window.eval(source(JQUERY));
    window.eval(source(HANDLEBARS));
    window.eval(source(alpacaBundle(flavor)));

    const $ = window.jQuery;

    /**
     * Renders a form into `selector` and resolves with the top-level field once postRender fires.
     * Rejects if Alpaca reports an error or rendering doesn't finish in time.
     */
    const render = (config = {}, selector = "#form") => new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error("Timed out waiting for postRender")), 5000);
        $(selector).alpaca({
            ...config,
            postRender(control) {
                clearTimeout(timer);
                if (config.postRender) {
                    config.postRender(control);
                }
                resolve(control);
            },
            error(err) {
                clearTimeout(timer);
                reject(err instanceof Error ? err : new Error(JSON.stringify(err)));
            }
        });
    });

    return {
        window,
        document: window.document,
        $,
        Alpaca: window.Alpaca,
        render,
        close: () => window.close()
    };
}

/**
 * Waits for pending Alpaca work (microtasks and zero-delay timers) to flush.
 */
export const settle = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Array fields render their items in pieces after postRender (showing a spinner meanwhile).
 * Resolves once the field and all of its descendants have finished loading.
 */
export async function loaded(field, timeout = 5000)
{
    const busy = (f) => f.loading || f.initializing || (f.children || []).some(busy);
    const start = Date.now();
    while (busy(field))
    {
        if (Date.now() - start > timeout) {
            throw new Error("Timed out waiting for field to finish loading");
        }
        await settle(5);
    }
    return field;
}
