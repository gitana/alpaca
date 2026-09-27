import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createAlpaca, loaded, settle } from "./harness.js";

const refresh = (field) => new Promise((resolve) => field.refreshValidationState(true, resolve));

describe.each(["web", "bootstrap"])("containers (%s)", (flavor) => {
    let alpaca, $, render;

    beforeEach(() => {
        alpaca = createAlpaca({ flavor });
        ({ $, render } = alpaca);
    });
    afterEach(() => alpaca.close());

    describe("array action bars", () => {
        const schema = { type: "array", items: { type: "string" } };

        // action bars belonging directly to the given array field (not to nested arrays)
        const actionbars = (field) => $(`.alpaca-array-actionbar[data-alpaca-array-actionbar-parent-field-id='${field.getId()}']`);
        const button = (field, index, action) => actionbars(field)
            .filter(`[data-alpaca-array-actionbar-item-index='${index}']`)
            .find(`[data-alpaca-array-actionbar-action='${action}']`);

        it("renders one action bar per item, in order", async () => {
            const field = await loaded(await render({ data: ["a", "b", "c"], schema }));
            const bars = actionbars(field);
            expect(bars).toHaveLength(3);
            expect(bars.map((i, el) => $(el).attr("data-alpaca-array-actionbar-item-index")).get()).toEqual(["0", "1", "2"]);
            // each item's bar sits inside that item
            field.children.forEach((child, i) => {
                expect($(bars[i]).closest(".alpaca-container-item").attr("data-alpaca-container-item-index")).toBe(String(i));
            });
        });

        it("disables move up on the first item and move down on the last", async () => {
            const field = await loaded(await render({ data: ["a", "b", "c"], schema }));
            expect(button(field, 0, "up").hasClass("alpaca-button-disabled")).toBe(true);
            expect(button(field, 2, "down").hasClass("alpaca-button-disabled")).toBe(true);
            expect(button(field, 1, "up").hasClass("alpaca-button-disabled")).toBe(false);
            expect(button(field, 1, "down").hasClass("alpaca-button-disabled")).toBe(false);
        });

        it("removes an item when its remove button is clicked", async () => {
            const field = await loaded(await render({ data: ["a", "b", "c"], schema }));
            button(field, 1, "remove").trigger("click");
            await settle(50);
            await loaded(field);
            expect(field.getValue()).toEqual(["a", "c"]);
            expect(actionbars(field)).toHaveLength(2);
        });

        it("adds an item after the clicked item", async () => {
            const field = await loaded(await render({ data: ["a", "b"], schema }));
            button(field, 0, "add").trigger("click");
            await settle(50);
            await loaded(field);
            expect(field.children).toHaveLength(3);
            expect(field.children[0].getValue()).toBe("a");
            expect(field.children[2].getValue()).toBe("b");
            expect(actionbars(field)).toHaveLength(3);
        });

        it("keeps nested arrays' action bars separate from their parent's", async () => {
            const field = await loaded(await render({
                data: [{ tags: ["x", "y"] }, { tags: ["z"] }],
                schema: { type: "array", items: { type: "object", properties: { tags: { type: "array", items: { type: "string" } } } } }
            }));
            expect(actionbars(field)).toHaveLength(2);
            expect(actionbars(field.children[0].childrenByPropertyId.tags)).toHaveLength(2);
            expect(actionbars(field.children[1].childrenByPropertyId.tags)).toHaveLength(1);
        });

        it("renders item fields in order for object properties", async () => {
            const field = await render({
                data: { first: "1", second: "2", third: "3" },
                schema: { type: "object", properties: { first: { type: "string" }, second: { type: "string" }, third: { type: "string" } } }
            });
            const names = $("#form .alpaca-container-item").map((i, el) => $(el).attr("data-alpaca-container-item-name")).get();
            expect(names).toEqual(["first", "second", "third"]);
            expect($("#form input").map((i, el) => $(el).val()).get()).toEqual(["1", "2", "3"]);
        });
    });

    describe("map", () => {
        const config = () => ({
            data: { alpha: { title: "A" }, beta: { title: "B" } },
            schema: { type: "object", properties: { title: { type: "string" } } },
            options: { type: "map" }
        });

        it("converts to and from an object keyed by _key", async () => {
            const field = await loaded(await render(config()));
            expect(field.getFieldType()).toBe("map");
            expect(field.getValue()).toEqual({ alpha: { title: "A" }, beta: { title: "B" } });
        });

        it("is valid with unique, non-empty keys", async () => {
            const field = await loaded(await render(config()));
            await refresh(field);
            expect(field.validation.keyMissing.status).toBe(true);
            expect(field.validation.keyNotUnique.status).toBe(true);
        });

        it("flags duplicate keys", async () => {
            const field = await loaded(await render(config()));
            field.children[1].childrenByPropertyId._key.setValue("alpha");
            await refresh(field);
            expect(field.validation.keyNotUnique.status).toBe(false);
            expect(field.isValid()).toBe(false);
        });

        it("flags empty keys", async () => {
            const field = await loaded(await render(config()));
            field.children[0].childrenByPropertyId._key.setValue("");
            await refresh(field);
            expect(field.validation.keyMissing.status).toBe(false);
            expect(field.isValid()).toBe(false);
        });
    });
});
