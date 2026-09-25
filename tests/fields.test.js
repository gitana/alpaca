import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createAlpaca, settle, loaded } from "./harness.js";

describe.each(["web", "bootstrap"])("fields (%s)", (flavor) => {
    let alpaca, $, render;

    beforeEach(() => {
        alpaca = createAlpaca({ flavor });
        ({ $, render } = alpaca);
    });
    afterEach(() => alpaca.close());

    describe("text", () => {
        it("renders a text input with its value", async () => {
            const field = await render({ data: "I Love Alpaca Ice Cream!" });
            expect(field.getFieldType()).toBe("text");
            expect($("#form input[type=text]").val()).toBe("I Love Alpaca Ice Cream!");
            expect(field.getValue()).toBe("I Love Alpaca Ice Cream!");
        });

        it("renders label, helper, placeholder and size", async () => {
            await render({
                data: "Mint",
                options: { label: "Ice Cream", helper: "Your favorite ice cream?", placeholder: "Enter a flavor", size: 30 }
            });
            const input = $("#form input[type=text]");
            expect(input.attr("placeholder")).toBe("Enter a flavor");
            expect(input.attr("size")).toBe("30");
            expect($("#form label.alpaca-control-label").text().trim()).toBe("Ice Cream");
            expect($("#form").text()).toContain("Your favorite ice cream?");
        });

        it("round-trips setValue / getValue", async () => {
            const field = await render({ data: "one" });
            field.setValue("two");
            expect(field.getValue()).toBe("two");
            expect($("#form input").val()).toBe("two");
        });

        it("fires change events", async () => {
            const field = await render({ data: "one" });
            const values = [];
            field.on("change", function() { values.push(this.getValue()); });
            $("#form input").val("typed").trigger("change");
            // ControlField defers change propagation by 200ms so that it runs after click handlers
            await settle(250);
            expect(values).toContain("typed");
        });
    });

    it("textarea renders rows and cols", async () => {
        await render({ data: "Some text", options: { type: "textarea", rows: 6, cols: 60 } });
        const textarea = $("#form textarea");
        expect(textarea.val()).toBe("Some text");
        expect(textarea.attr("rows")).toBe("6");
        expect(textarea.attr("cols")).toBe("60");
    });

    it("number returns numeric values", async () => {
        const field = await render({ data: 42, schema: { type: "number" } });
        expect(field.getFieldType()).toBe("number");
        expect(field.getValue()).toBe(42);
        field.setValue(3.5);
        expect(field.getValue()).toBe(3.5);
    });

    it("integer field is selected for integer schemas", async () => {
        const field = await render({ data: 7, schema: { type: "integer" } });
        expect(field.getFieldType()).toBe("integer");
        expect(field.getValue()).toBe(7);
    });

    it("checkbox renders a boolean", async () => {
        const field = await render({ data: true, schema: { type: "boolean" }, options: { rightLabel: "Subscribe?" } });
        expect(field.getFieldType()).toBe("checkbox");
        expect($("#form input[type=checkbox]").prop("checked")).toBe(true);
        expect($("#form").text()).toContain("Subscribe?");
        field.setValue(false);
        expect(field.getValue()).toBe(false);
    });

    it("radio renders one option per enum value", async () => {
        const field = await render({
            data: "Vanilla",
            schema: { enum: ["Vanilla", "Chocolate", "Coffee"] },
            options: { type: "radio" }
        });
        const radios = $("#form input[type=radio]");
        expect(radios.map((i, r) => $(r).val()).get()).toEqual(expect.arrayContaining(["Vanilla", "Chocolate", "Coffee"]));
        expect(radios.filter(":checked").val()).toBe("Vanilla");
        expect(field.getValue()).toBe("Vanilla");
    });

    it("select renders options with labels", async () => {
        const field = await render({
            data: "coffee",
            schema: { enum: ["vanilla", "chocolate", "coffee"] },
            options: { type: "select", optionLabels: ["Vanilla Flavor", "Chocolate Flavor", "Coffee Flavor"] }
        });
        expect(field.getFieldType()).toBe("select");
        const labels = $("#form select option").map((i, o) => $(o).text().trim()).get();
        expect(labels).toEqual(expect.arrayContaining(["Vanilla Flavor", "Chocolate Flavor", "Coffee Flavor"]));
        expect($("#form select").val()).toBe("coffee");
        expect(field.getValue()).toBe("coffee");
    });

    it("hidden and password fields render the right input types", async () => {
        const field = await render({
            data: { secret: "s3cr3t", token: "abc" },
            schema: { type: "object", properties: { secret: { type: "string" }, token: { type: "string" } } },
            options: { fields: { secret: { type: "password" }, token: { type: "hidden" } } }
        });
        expect($("#form input[type=password]").val()).toBe("s3cr3t");
        expect($("#form input[type=hidden]").val()).toBe("abc");
        expect(field.getValue()).toEqual({ secret: "s3cr3t", token: "abc" });
    });

    it("uppercase and lowercase fields transform their values", async () => {
        const field = await render({
            data: { up: "shout", down: "WHISPER" },
            schema: { type: "object", properties: { up: { type: "string" }, down: { type: "string" } } },
            options: { fields: { up: { type: "uppercase" }, down: { type: "lowercase" } } }
        });
        expect(field.getValue()).toEqual({ up: "SHOUT", down: "whisper" });
    });

    describe("object", () => {
        const schema = {
            type: "object",
            properties: {
                name: { type: "string", title: "Name" },
                age: { type: "number", title: "Age" },
                subscribed: { type: "boolean" }
            }
        };

        it("renders a child per property and assembles the value", async () => {
            const field = await render({ data: { name: "Joe", age: 30, subscribed: true }, schema });
            expect(field.children).toHaveLength(3);
            expect(Object.keys(field.childrenByPropertyId)).toEqual(["name", "age", "subscribed"]);
            expect(field.getValue()).toEqual({ name: "Joe", age: 30, subscribed: true });
            expect($("#form").text()).toContain("Name");
        });

        it("respects options.order", async () => {
            const field = await render({
                schema,
                options: { fields: { name: { order: 3 }, age: { order: 1 }, subscribed: { order: 2 } } }
            });
            expect(field.children.map((c) => c.propertyId)).toEqual(["age", "subscribed", "name"]);
        });

        it("shows dependent fields only when the dependency is satisfied", async () => {
            const field = await render({
                data: { wantsIceCream: false },
                schema: {
                    type: "object",
                    properties: {
                        wantsIceCream: { type: "boolean" },
                        flavor: { type: "string" }
                    },
                    dependencies: { flavor: ["wantsIceCream"] }
                },
                options: { fields: { flavor: { dependencies: { wantsIceCream: true } } } }
            });
            const flavorField = field.childrenByPropertyId.flavor;
            expect(flavorField.isHidden()).toBe(true);

            field.childrenByPropertyId.wantsIceCream.setValue(true);
            field.childrenByPropertyId.wantsIceCream.triggerUpdate();
            await settle(10);
            expect(flavorField.isHidden()).toBe(false);
        });
    });

    describe("array", () => {
        const schema = { type: "array", items: { type: "string" } };

        it("renders an item per value", async () => {
            const field = await loaded(await render({ data: ["a", "b", "c"], schema }));
            expect(field.getFieldType()).toBe("array");
            expect(field.children).toHaveLength(3);
            expect(field.getValue()).toEqual(["a", "b", "c"]);
        });

        it("adds, moves and removes items", async () => {
            const field = await loaded(await render({ data: ["a", "b"], schema }));

            await new Promise((resolve) => field.addItem(2, null, null, "c", resolve));
            await loaded(field);
            expect(field.getValue()).toEqual(["a", "b", "c"]);

            await new Promise((resolve) => field.moveItem(2, 1, false, resolve));
            await loaded(field);
            expect(field.getValue()).toEqual(["a", "c", "b"]);

            await new Promise((resolve) => field.removeItem(1, resolve));
            await loaded(field);
            expect(field.getValue()).toEqual(["a", "b"]);
            expect(field.getSize()).toBe(2);
        });

        it("arrays of objects produce arrays of objects", async () => {
            const field = await loaded(await render({
                data: [{ flavor: "vanilla", scoops: 1 }, { flavor: "mint", scoops: 2 }],
                schema: {
                    type: "array",
                    items: { type: "object", properties: { flavor: { type: "string" }, scoops: { type: "integer" } } }
                }
            }));
            expect(field.getValue()).toEqual([{ flavor: "vanilla", scoops: 1 }, { flavor: "mint", scoops: 2 }]);
        });
    });
});
