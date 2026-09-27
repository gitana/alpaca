#!/usr/bin/env node
/**
 * Rendering benchmark for Alpaca, using the same jsdom harness as the tests (so it measures dist/alpaca).
 *
 *   npm run bench                              run all scenarios
 *   npm run bench -- --runs 10                 more runs per scenario (default 5, plus a warm-up run)
 *   npm run bench -- --only big-form           run a single scenario
 *   npm run bench -- --save before.json        save the results
 *   npm run bench -- --compare before.json     show the change against saved results
 *
 * For a CPU profile, run: node --cpu-prof --cpu-prof-dir=build/profiles scripts/bench.mjs
 *
 * Timings are medians, in milliseconds.  jsdom does no layout, so absolute numbers differ from a real browser,
 * but relative changes are meaningful.
 */
import fs from "node:fs";
import { createAlpaca, fixture, loaded } from "../tests/harness.js";

const args = process.argv.slice(2);
const arg = (name, fallback) => {
    const i = args.indexOf(name);
    return i > -1 ? args[i + 1] : fallback;
};
const RUNS = Number(arg("--runs", 5));
const ONLY = arg("--only");
const SAVE = arg("--save");
const COMPARE = arg("--compare");
const FLAVOR = arg("--flavor", "bootstrap");

// a large array of objects, each with a nested array
function largeArray(count)
{
    const data = [];
    for (let i = 0; i < count; i++) {
        data.push({ name: `Person ${i}`, email: `person${i}@example.com`, age: 20 + (i % 50), active: i % 2 === 0, tags: ["a", "b", "c"] });
    }
    return {
        data,
        schema: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    name: { type: "string", required: true },
                    email: { type: "string", format: "email" },
                    age: { type: "integer", minimum: 0 },
                    active: { type: "boolean" },
                    tags: { type: "array", items: { type: "string" } }
                }
            }
        }
    };
}

// a map whose entries are nested objects
function largeMap(count)
{
    const data = {};
    for (let i = 0; i < count; i++) {
        data[`key${i}`] = { title: `Entry ${i}`, details: { a: "x", b: "y", c: "z" }, values: [1, 2, 3] };
    }
    return {
        data,
        schema: {
            type: "object",
            properties: {
                title: { type: "string" },
                details: { type: "object", properties: { a: { type: "string" }, b: { type: "string" }, c: { type: "string" } } },
                values: { type: "array", items: { type: "number" } }
            }
        },
        options: { type: "map" }
    };
}

const scenarios = {
    "big-form": () => ({ schema: fixture("big-form/schema.json"), options: fixture("big-form/options.json"), data: fixture("big-form/data.json") }),
    "large-array": () => largeArray(300),
    "large-map": () => largeMap(150)
};

async function measure(config)
{
    const alpaca = createAlpaca({ flavor: FLAVOR });
    try
    {
        const t0 = performance.now();
        const field = await alpaca.render(config);
        const tRendered = performance.now();
        await loaded(field);
        const tLoaded = performance.now();
        const fields = alpaca.$("#form .alpaca-field").length;

        const t1 = performance.now();
        await new Promise((resolve) => field.refreshValidationState(true, resolve));
        const tValidated = performance.now();

        const t2 = performance.now();
        await new Promise((resolve) => field.refresh(resolve));
        await loaded(field);
        const tRefreshed = performance.now();

        return { render: tRendered - t0, loaded: tLoaded - t0, validate: tValidated - t1, refresh: tRefreshed - t2, fields };
    }
    finally
    {
        alpaca.close();
    }
}

const median = (values) => {
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

const METRICS = ["render", "loaded", "validate", "refresh"];
const results = {};

for (const [name, make] of Object.entries(scenarios))
{
    if (ONLY && ONLY !== name) {
        continue;
    }
    await measure(make()); // warm-up
    const runs = [];
    for (let i = 0; i < RUNS; i++) {
        runs.push(await measure(make()));
    }
    results[name] = { fields: runs[0].fields };
    for (const metric of METRICS) {
        results[name][metric] = Math.round(median(runs.map((r) => r[metric])));
    }
}

const baseline = COMPARE ? JSON.parse(fs.readFileSync(COMPARE, "utf8")) : null;
const cell = (name, metric) => {
    const now = results[name][metric];
    const before = baseline && baseline[name] && baseline[name][metric];
    if (!before) {
        return String(now);
    }
    const pct = Math.round(100 * (now - before) / before);
    return `${before} → ${now} (${pct > 0 ? "+" : ""}${pct}%)`;
};

console.log(`\nAlpaca ${FLAVOR} bundle - median of ${RUNS} runs (ms)${baseline ? `, compared to ${COMPARE}` : ""}\n`);
console.table(Object.fromEntries(Object.keys(results).map((name) => [
    name,
    { fields: results[name].fields, ...Object.fromEntries(METRICS.map((m) => [m, cell(name, m)])) }
])));

if (SAVE)
{
    fs.writeFileSync(SAVE, JSON.stringify(results, null, 2) + "\n");
    console.log(`Saved results to ${SAVE}`);
}

process.exit(0);
