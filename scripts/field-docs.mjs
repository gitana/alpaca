/**
 * Generates the schema / options reference tables for field documentation pages.
 *
 * Field pages contain a marker like <!-- INCLUDE_API_DOCS: text --> which gets replaced with tables describing the
 * field's type, schema and options.  These are introspected from the built Alpaca bundle (dist/alpaca/web/alpaca.js)
 * loaded into a jsdom window.
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MARKER = /<!-- INCLUDE_API_DOCS:([\s\S]*?)-->/;

const sortProperties = (properties = {}) => Object.fromEntries(Object.keys(properties).sort().map((k) => [k, properties[k]]));

const row = (name, value, link) => `<tr><td>${name}</td><td>${link ? `<a href='${link}'>${value}</a>` : value}</td></tr>`;

function propertiesTable(schema)
{
    let table = "<table class='table table-bordered table-responsive table-hover table-condensed'>";
    table += "<thead><tr><th>Property</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>";
    table += "<tbody>";
    for (const [name, property] of Object.entries(sortProperties(schema.properties)))
    {
        table += "<tr>";
        table += `<td>${name}</td>`;
        table += `<td>${property.type || ""}</td>`;
        table += `<td>${property.default || ""}</td>`;
        table += `<td>${property.description || ""}</td>`;
        table += "</tr>";
    }
    table += "</tbody></table>";
    return table;
}

function fieldDocs(field)
{
    const schemaType = field.getType();
    const fieldType = field.getFieldType();
    const baseFieldType = field.getBaseFieldType();

    let html = "<h3>Properties</h3>";
    html += "<table class='table table-bordered table-responsive table-hover table-condensed'><tbody>";
    html += row("Title", field.getTitle());
    html += row("Description", field.getDescription());
    if (schemaType) {
        html += row("JSON Schema Type(s)", schemaType);
    }
    html += row("Field Type", fieldType, `/docs/fields/${fieldType}.html`);
    html += baseFieldType ? row("Base Field Type", baseFieldType, `/docs/fields/${baseFieldType}.html`) : row("Base Field Type", "None");
    html += "</tbody></table>";

    html += "<h3>Schema</h3>" + propertiesTable(field.getSchemaOfSchema());
    html += "<h3>Options</h3>" + propertiesTable(field.getSchemaOfOptions());
    return html;
}

/**
 * Loads the Alpaca bundle and returns the documentation HTML for every registered field type, keyed by type.
 */
export async function generateFieldDocs()
{
    const { window } = new JSDOM('<!DOCTYPE html><body><div id="form"></div></body>', { runScripts: "outside-only" });
    try
    {
        window.eval(fs.readFileSync(require.resolve("jquery/dist/jquery.js"), "utf8"));
        window.eval(fs.readFileSync(require.resolve("handlebars/dist/handlebars.js"), "utf8"));
        window.eval(fs.readFileSync(path.join(ROOT, "dist", "alpaca", "web", "alpaca.js"), "utf8"));
        const { Alpaca, jQuery: $ } = window;

        // render a form first so that views are compiled and normalized
        await new Promise((resolve, reject) => $("#form").alpaca({
            data: "",
            view: "web-edit",
            postRender: resolve,
            error: reject
        }));

        const docs = {};
        for (const [type, constructor] of Object.entries(Alpaca.fieldClassRegistry))
        {
            try {
                docs[type] = fieldDocs(new constructor());
            } catch (err) {
                console.warn(`[field-docs] Could not document field type: ${type} (${err.message})`);
            }
        }
        return docs;
    }
    finally
    {
        window.close();
    }
}

/**
 * Replaces an INCLUDE_API_DOCS marker in the given HTML (if present) using docs from generateFieldDocs().
 */
export function applyFieldDocs(html, docs)
{
    const match = html.match(MARKER);
    if (!match) {
        return html;
    }
    const type = match[1].trim();
    if (!docs[type])
    {
        console.warn(`[field-docs] Could not find field type: ${type}`);
        return html;
    }
    return html.replace(MARKER, () => docs[type]);
}
