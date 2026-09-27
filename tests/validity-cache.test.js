/**
 * The validity cache (Alpaca.beginValidityCache) must never change the outcome of a validation pass.
 *
 * Each scenario runs the same sequence of edits and validation passes twice - once normally and once with the
 * cache disabled - and checks that validity, validation state, DOM markup, messages and validated / invalidated
 * events are identical.
 */
import { describe, it, expect } from "vitest";
import { createAlpaca, loaded, settle } from "./harness.js";

const refresh = (field) => new Promise((resolve) => field.refreshValidationState(true, resolve));

function walk(field, fn)
{
    fn(field);
    (field.children || []).forEach((child) => walk(child, fn));
}

const findByPath = (top, path) => {
    let found = null;
    walk(top, (f) => { if (f.path === path) found = f; });
    return found;
};

function capture(alpaca, top, events)
{
    const $ = alpaca.$;
    const state = [];
    walk(top, (f) => {
        const el = $(f.getFieldEl());
        state.push({
            path: f.path,
            valid: f.isValid(),
            validDeep: f.isValid(true),
            validation: Object.fromEntries(Object.entries(f.validation || {}).map(([k, v]) => [k, v.status])),
            invalid: el.hasClass("alpaca-invalid"),
            invalidHidden: el.hasClass("alpaca-invalid-hidden"),
            valid2: el.hasClass("alpaca-field-valid"),
            messages: el.children(".alpaca-message").map((i, m) => $(m).text().trim()).get()
        });
    });
    return { state, events: events.splice(0) };
}

async function run(makeConfig, steps, useCache)
{
    const alpaca = createAlpaca({ flavor: "bootstrap" });
    if (!useCache) {
        alpaca.Alpaca.beginValidityCache = () => () => {};
    }
    try
    {
        const events = [];
        const top = await loaded(await alpaca.render(makeConfig()));
        walk(top, (f) => {
            f.on("validated", () => events.push(`validated ${f.path}`));
            f.on("invalidated", () => events.push(`invalidated ${f.path}`));
        });
        await settle(700); // initial (deferred) validation and its events
        events.splice(0);

        const results = [];
        for (const step of steps)
        {
            await step(top);
            await settle(60); // validated / invalidated events fire after a short delay
            results.push(capture(alpaca, top, events));
        }
        return results;
    }
    finally
    {
        alpaca.close();
    }
}

async function expectSameWithAndWithoutCache(makeConfig, steps)
{
    const cached = await run(makeConfig, steps, true);
    const uncached = await run(makeConfig, steps, false);
    expect(cached).toEqual(uncached);
    return cached;
}

describe("validity cache", () => {

    it("is scoped to a validation pass", async () => {
        const alpaca = createAlpaca({ flavor: "bootstrap" });
        const top = await alpaca.render({ data: ["a"], schema: { type: "array", items: { type: "string" } } });
        expect(alpaca.Alpaca._validityCache).toBeNull();
        await refresh(top);
        expect(alpaca.Alpaca._validityCache).toBeNull();
        alpaca.close();
    });

    it("gives identical results for arrays of objects with dependencies", async () => {
        const results = await expectSameWithAndWithoutCache(() => ({
            data: Array.from({ length: 30 }, (_, i) => ({
                name: i % 7 ? `P${i}` : "",
                email: i % 5 ? `p${i}@x.io` : "bad",
                age: i % 9 ? 30 : -1,
                kind: i % 2 ? "a" : "b",
                extra: i % 3 ? "" : "zz"
            })),
            schema: {
                type: "array", minItems: 2, maxItems: 100,
                items: {
                    type: "object",
                    properties: {
                        name: { type: "string", required: true },
                        email: { type: "string", format: "email" },
                        age: { type: "integer", minimum: 0 },
                        kind: { type: "string", enum: ["a", "b"] },
                        extra: { type: "string", minLength: 3 }
                    },
                    dependencies: { extra: ["kind"] }
                }
            },
            options: { items: { fields: { extra: { dependencies: { kind: "a" } } } } }
        }), [
            (top) => refresh(top),
            async (top) => {
                // fix some values, break others, and flip dependencies (which hides / shows fields)
                top.children.forEach((item, i) => {
                    if (i % 4 === 0) item.childrenByPropertyId.name.setValue("fixed");
                    if (i % 6 === 0) item.childrenByPropertyId.email.setValue("nope");
                    if (i % 5 === 0) {
                        item.childrenByPropertyId.kind.setValue(i % 10 ? "a" : "b");
                        item.childrenByPropertyId.kind.triggerUpdate();
                    }
                });
                await settle(20);
                await refresh(top);
            },
            (top) => refresh(top.children[3]),
            async (top) => {
                top.children.forEach((item) => item.childrenByPropertyId.age.setValue(10));
                await refresh(top);
            }
        ]);

        // sanity check that the scenario exercises both valid and invalid fields and fires events
        const last = results[results.length - 1];
        expect(last.state.some((s) => !s.validDeep)).toBe(true);
        expect(last.state.some((s) => s.validDeep)).toBe(true);
        expect(results.some((r) => r.events.length > 0)).toBe(true);
    });

    it("gives identical results with nested arrays, hidden fields and custom validators", async () => {
        await expectSameWithAndWithoutCache(() => ({
            data: { groups: [{ title: "g1", members: ["a"] }, { title: "", members: ["b", "c", "d", "e"] }], note: "no" },
            schema: {
                type: "object",
                properties: {
                    groups: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                title: { type: "string", required: true },
                                members: { type: "array", minItems: 2, maxItems: 3, items: { type: "string" } }
                            }
                        }
                    },
                    note: { type: "string" }
                }
            },
            options: {
                fields: {
                    note: {
                        validator(callback) {
                            const ok = this.getValue() !== "no";
                            callback({ status: ok, message: ok ? "" : "no is not allowed" });
                        }
                    }
                }
            }
        }), [
            (top) => refresh(top),
            async (top) => {
                top.childrenByPropertyId.note.setValue("yes");
                findByPath(top, "/groups[1]/title").setValue("g2");
                await refresh(top);
            },
            async (top) => {
                findByPath(top, "/groups[0]/members").hide();
                await refresh(top);
            },
            async (top) => {
                findByPath(top, "/groups[0]/members").show();
                await refresh(top.childrenByPropertyId.groups);
            },
            (top) => refresh(top)
        ]);
    });

    it("gives identical results for maps", async () => {
        await expectSameWithAndWithoutCache(() => ({
            data: { a: { t: "1" }, b: { t: "2" }, c: { t: "" } },
            schema: { type: "object", properties: { t: { type: "string", required: true } } },
            options: { type: "map" }
        }), [
            (top) => refresh(top),
            async (top) => {
                top.children[1].childrenByPropertyId._key.setValue("a");
                await refresh(top);
            },
            async (top) => {
                top.children[1].childrenByPropertyId._key.setValue("b");
                top.children[2].childrenByPropertyId.t.setValue("x");
                await refresh(top);
            }
        ]);
    });
});
