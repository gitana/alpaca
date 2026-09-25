import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createAlpaca, fixture, loaded } from "./harness.js";

describe.each(["web", "bootstrap"])("views (%s)", (flavor) => {
    let alpaca, $, render;

    beforeEach(() => {
        alpaca = createAlpaca({ flavor });
        ({ $, render } = alpaca);
    });
    afterEach(() => alpaca.close());

    it("defaults to an edit view when data is provided", async () => {
        const field = await render({ data: "x" });
        expect(field.view.id).toBe(`${flavor}-edit`);
    });

    it("defaults to a create view when no data is provided", async () => {
        const field = await render({ schema: { type: "string" } });
        expect(field.view.id).toBe(`${flavor}-create`);
    });

    it("display views render read-only output", async () => {
        const field = await render({ data: "Read me", view: `${flavor}-display` });
        expect(field.view.type).toBe("display");
        expect($("#form input")).toHaveLength(0);
        expect($("#form").text()).toContain("Read me");
    });

    it("horizontal views flag the view as horizontal", async () => {
        const field = await render({ data: "x", view: `${flavor}-edit-horizontal` });
        expect(field.view.horizontal).toBe(true);
    });

    it("custom views inherit from their parent", async () => {
        alpaca.Alpaca.registerView({ id: "my-view", parent: `${flavor}-edit`, messages: { stringTooLong: "Way too long!" } });
        const field = await render({ data: "x", view: "my-view" });
        expect(field.view.id).toBe("my-view");
        expect(field.view.type).toBe("edit");
        expect(field.view.getMessage("stringTooLong")).toBe("Way too long!");
    });

    it("renders form buttons", async () => {
        await render({
            data: { name: "Joe" },
            schema: { type: "object", properties: { name: { type: "string" } } },
            options: { form: { buttons: { submit: { title: "Send It" } } } }
        });
        expect($("#form form")).toHaveLength(1);
        expect($("#form button").text()).toContain("Send It");
    });

    it("renders a large, deeply nested form", async () => {
        const field = await loaded(await render({
            schema: fixture("big-form/schema.json"),
            options: fixture("big-form/options.json"),
            data: fixture("big-form/data.json")
        }));
        expect(field.children.length).toBeGreaterThan(5);
        expect($("#form .alpaca-field").length).toBeGreaterThan(50);
    });
});

describe("bootstrap view styling", () => {
    it("applies Bootstrap classes", async () => {
        const alpaca = createAlpaca({ flavor: "bootstrap" });
        await alpaca.render({ data: "x", options: { label: "Name" } });
        const $ = alpaca.$;
        expect($("#form .form-group")).toHaveLength(1);
        expect($("#form input").hasClass("form-control")).toBe(true);
        expect($("#form label").hasClass("control-label")).toBe(true);
        alpaca.close();
    });
});
