// Site-wide data, available in templates as {{ site.* }} (formerly Jekyll's _config.yml).
import fs from "node:fs";

const pkg = JSON.parse(fs.readFileSync(new URL("../../package.json", import.meta.url), "utf8"));

export default {
    title: "Alpaca Forms",
    tagline: "Web Forms for jQuery",
    production_url: "http://www.alpacajs.org",
    author: {
        name: "Gitana Software, Inc.",
        email: "info@gitana.io",
        github: "gitana/alpaca",
        twitter: "alpacajs"
    },
    meta: {
        description: "Easily create forms for your web site using jQuery, Bootstrap and JSON Schema",
        keywords: "alpaca,forms,jquery,bootstrap,json,json-schema,schema,form,html,html5,angular,builder,cms"
    },
    JB: {
        rss_path: "/rss.xml",
        atom_path: "/atom.xml"
    },

    alpaca_version: pkg.version,
    alpaca_date: "5/14/2019",
    time: new Date()
};
