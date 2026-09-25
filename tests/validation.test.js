import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createAlpaca, loaded } from "./harness.js";

const refresh = (field) => new Promise((resolve) => field.refreshValidationState(true, resolve));

describe.each(["web", "bootstrap"])("validation (%s)", (flavor) => {
    let alpaca, $, render;

    beforeEach(() => {
        alpaca = createAlpaca({ flavor });
        ({ $, render } = alpaca);
    });
    afterEach(() => alpaca.close());

    const messages = () => $("#form .alpaca-message").map((i, el) => $(el).text().trim()).get();

    it("valid data passes", async () => {
        const field = await render({ data: "Mint", schema: { type: "string", minLength: 3, maxLength: 8 } });
        await refresh(field);
        expect(field.isValid(true)).toBe(true);
        expect($("#form .alpaca-invalid")).toHaveLength(0);
    });

    it("maxLength / minLength", async () => {
        const field = await render({ data: "Mint Chocolate", schema: { type: "string", maxLength: 8 } });
        await refresh(field);
        expect(field.isValid(true)).toBe(false);
        expect(field.validation.stringTooLong.status).toBe(false);
        expect($("#form .alpaca-invalid").length).toBeGreaterThan(0);
        expect(messages().join()).toContain("at most 8");

        field.setValue("ab");
        field.schema.minLength = 3;
        await refresh(field);
        expect(field.validation.stringTooShort.status).toBe(false);
    });

    it("required properties", async () => {
        const field = await render({
            data: {},
            schema: { type: "object", properties: { name: { type: "string", required: true } } }
        });
        await refresh(field);
        expect(field.isValid(true)).toBe(false);
        expect(field.childrenByPropertyId.name.validation.notOptional.status).toBe(false);

        field.childrenByPropertyId.name.setValue("Joe");
        await refresh(field);
        expect(field.isValid(true)).toBe(true);
    });

    it("numeric minimum / maximum", async () => {
        const field = await render({ data: 5, schema: { type: "number", minimum: 10, maximum: 20 } });
        await refresh(field);
        expect(field.isValid()).toBe(false);
        expect(messages().join()).toContain("10");

        field.setValue(15);
        await refresh(field);
        expect(field.isValid()).toBe(true);

        field.setValue(25);
        await refresh(field);
        expect(field.isValid()).toBe(false);
    });

    it("pattern", async () => {
        const field = await render({ data: "abc", schema: { type: "string", pattern: "^[0-9]+$" } });
        await refresh(field);
        expect(field.validation.invalidPattern.status).toBe(false);
        field.setValue("123");
        await refresh(field);
        expect(field.isValid()).toBe(true);
    });

    it("email format", async () => {
        const field = await render({ data: "nope", schema: { type: "string", format: "email" } });
        expect(field.getFieldType()).toBe("email");
        await refresh(field);
        expect(field.isValid()).toBe(false);
        field.setValue("info@gitana.io");
        await refresh(field);
        expect(field.isValid()).toBe(true);
    });

    it("array minItems / maxItems", async () => {
        const field = await loaded(await render({ data: ["a"], schema: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 3 } }));
        await refresh(field);
        expect(field.isValid()).toBe(false);
        await new Promise((resolve) => field.addItem(1, null, null, "b", resolve));
        await refresh(field);
        expect(field.isValid()).toBe(true);
    });

    it("custom validators", async () => {
        const field = await render({
            data: "chocolate",
            options: {
                validator(callback) {
                    const ok = this.getValue() !== "chocolate";
                    callback({ status: ok, message: ok ? "" : "No chocolate allowed" });
                }
            }
        });
        await refresh(field);
        expect(field.isValid()).toBe(false);
        expect(messages()).toContain("No chocolate allowed");
    });

    it("localized messages", async () => {
        const field = await render({
            data: "Mint Chocolate",
            schema: { type: "string", maxLength: 8 },
            view: { parent: `${flavor}-edit`, locale: "de_DE" }
        });
        await refresh(field);
        expect(messages()).toContain("Dieses Feld sollte höchstens 8 Zeichen enthalten");
    });
});
