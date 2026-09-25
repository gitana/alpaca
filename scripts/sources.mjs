// Ordered list of source files that make up the Alpaca core.
// These are plain (non-module) scripts that get concatenated in this order, so order matters.
export const core = [
    "thirdparty/base/Base.js",

    "src/js/Alpaca.js",
    "src/js/Alpaca-async.js",
    "src/js/ObservableUtils.js",
    "src/js/Observables.js",
    "src/js/Observable.js",
    "src/js/ScopedObservables.js",
    "src/js/TemplateEngineRegistry.js",
    "src/js/AbstractTemplateEngine.js",
    "src/js/HandlebarsTemplateEngine.js",
    "src/js/NormalizedView.js",
    "src/js/RuntimeView.js",
    "src/js/Field.js",
    "src/js/ControlField.js",
    "src/js/ContainerField.js",
    "src/js/Form.js",

    // cache implementations
    "src/js/cache/memory.js",
    "src/js/cache/null.js",

    // connectors
    "src/js/connectors/default.js",
    "src/js/connectors/cloudcms.js",

    // fields
    "src/js/fields/basic/TextField.js",
    "src/js/fields/basic/TextAreaField.js",
    "src/js/fields/basic/FileField.js",
    "src/js/fields/basic/NumberField.js",
    "src/js/fields/basic/ArrayField.js",
    "src/js/fields/basic/ObjectField.js",
    "src/js/fields/basic/AnyField.js",
    "src/js/fields/basic/HiddenField.js",

    "src/js/fields/list/ListField.js",
    "src/js/fields/list/CheckBoxField.js",
    "src/js/fields/list/RadioField.js",
    "src/js/fields/list/SelectField.js",
    "src/js/fields/list/ChooserField.js",

    "src/js/fields/advanced/AddressField.js",
    "src/js/fields/advanced/CKEditorField.js",
    "src/js/fields/advanced/ColorField.js",
    "src/js/fields/advanced/ColorPickerField.js",
    "src/js/fields/advanced/CountryField.js",
    "src/js/fields/advanced/CountryCallingCodeField.js",
    "src/js/fields/advanced/CurrencyField.js",
    "src/js/fields/advanced/DateField.js",
    "src/js/fields/advanced/DatetimeField.js",
    "src/js/fields/advanced/EditorField.js",
    "src/js/fields/advanced/EmailField.js",
    "src/js/fields/advanced/GridField.js",
    "src/js/fields/advanced/ImageField.js",
    "src/js/fields/advanced/IntegerField.js",
    "src/js/fields/advanced/IPv4Field.js",
    "src/js/fields/advanced/JSONField.js",
    "src/js/fields/advanced/LowerCaseField.js",
    "src/js/fields/advanced/MapField.js",
    "src/js/fields/advanced/MarkdownField.js",
    "src/js/fields/advanced/OptionTree.js",
    "src/js/fields/advanced/PasswordField.js",
    "src/js/fields/advanced/PersonalNameField.js",
    "src/js/fields/advanced/PhoneField.js",
    "src/js/fields/advanced/PickAColorField.js",
    "src/js/fields/advanced/SearchField.js",
    "src/js/fields/advanced/StateField.js",
    "src/js/fields/advanced/SummernoteField.js",
    "src/js/fields/advanced/TableField.js",
    "src/js/fields/advanced/TableRowField.js",
    "src/js/fields/advanced/TagField.js",
    "src/js/fields/advanced/TimeField.js",
    "src/js/fields/advanced/TinyMCEField.js",
    "src/js/fields/advanced/TokenField.js",
    "src/js/fields/advanced/UploadField.js",
    "src/js/fields/advanced/UpperCaseField.js",
    "src/js/fields/advanced/URLField.js",
    "src/js/fields/advanced/ZipcodeField.js",

    // base view
    "src/js/views/base.js",

    // i18n
    "src/js/messages/i18n/cs_CZ.js",
    "src/js/messages/i18n/de_AT.js",
    "src/js/messages/i18n/de_DE.js",
    "src/js/messages/i18n/el_GR.js",
    "src/js/messages/i18n/es_ES.js",
    "src/js/messages/i18n/fi_FI.js",
    "src/js/messages/i18n/fr_FR.js",
    "src/js/messages/i18n/hr_HR.js",
    "src/js/messages/i18n/it_IT.js",
    "src/js/messages/i18n/ja_JP.js",
    "src/js/messages/i18n/nb_NO.js",
    "src/js/messages/i18n/nl_BE.js",
    "src/js/messages/i18n/pl_PL.js",
    "src/js/messages/i18n/pt_BR.js",
    "src/js/messages/i18n/sv_SE.js",
    "src/js/messages/i18n/zh_CN.js"
];

// Each flavor is a standalone distribution under dist/alpaca/<name>.
export const flavors = {
    web: {
        views: ["src/js/views/web.js"],
        templates: ["web-display", "web-edit", "web-create"],
        styles: ["src/css/alpaca-core.css", "src/css/alpaca-fields.css", "src/css/alpaca-web.css"],
        deps: [
            { name: "jquery", global: "jQuery", param: "$" },
            { name: "handlebars", global: "Handlebars", param: "Handlebars" }
        ],
        defaultView: "web"
    },
    bootstrap: {
        views: ["src/js/views/web.js", "src/js/views/bootstrap.js"],
        templates: ["web-display", "web-edit", "web-create", "bootstrap-display", "bootstrap-edit", "bootstrap-create"],
        styles: ["src/css/alpaca-core.css", "src/css/alpaca-fields.css", "src/css/alpaca-bootstrap.css"],
        deps: [
            { name: "jquery", global: "jQuery", param: "$" },
            { name: "handlebars", global: "Handlebars", param: "Handlebars" },
            { name: "bootstrap", global: "Bootstrap", param: "Bootstrap" }
        ],
        defaultView: "bootstrap"
    }
};
