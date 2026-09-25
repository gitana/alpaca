#!/usr/bin/env node
/**
 * Local development: builds Alpaca, rebuilds it whenever src/ changes, and serves the web site with live reload.
 * The site is served at http://localhost:9999 and picks up library rebuilds automatically.
 */
import { spawn } from "node:child_process";
import { build, watch } from "./build.mjs";

await build();
watch();

const eleventy = spawn("npx", ["@11ty/eleventy", "--serve", "--port=9999"], { stdio: "inherit" });
eleventy.on("exit", (code) => process.exit(code ?? 0));
for (const signal of ["SIGINT", "SIGTERM"]) {
    process.on(signal, () => eleventy.kill(signal));
}
