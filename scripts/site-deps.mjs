#!/usr/bin/env node
/**
 * Installs the web site's third-party libraries (site/package.json -> site/node_modules) when they're missing
 * or site/package.json has changed since the last install.  These are published under /lib by the site build.
 */
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "site");
const manifest = path.join(SITE, "package.json");
const marker = path.join(SITE, "node_modules", ".package-lock.json");

const force = process.argv.includes("--force");
if (force || !fs.existsSync(marker) || fs.statSync(manifest).mtimeMs > fs.statSync(marker).mtimeMs)
{
    console.log("Installing site libraries (site/package.json)...");
    execSync("npm install --no-audit --no-fund --no-package-lock", { cwd: SITE, stdio: "inherit" });
}
