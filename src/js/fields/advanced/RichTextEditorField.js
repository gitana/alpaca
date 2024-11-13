(function ($) {
    var Alpaca = $.alpaca;

    console.log("rich text editor");
    Alpaca.Fields.RichTextEditorField = Alpaca.Fields.TextAreaField.extend(
        /**
         * @lends Alpaca.Fields.RichTextEditorField.prototype
         */
        {
            /**
             * @see Alpaca.Fields.TextAreaField#getFieldType
             */
            getFieldType: function () {
                return "richtexteditor";
            },

            setValue: function (value) {
                // be sure to call into base method
                this.base(value);

                // trigger re-render
                this.control[0].dispatchEvent(new Event("input"));
            },

            /* builder_helpers */

            /**
             * @see Alpaca.Fields.TextAreaField#getTitle
             */
            getTitle: function () {
                return "Rich text editor";
            },

            /**
             * @see Alpaca.Fields.TextAreaField#getDescription
             */
            getDescription: function () {
                return "Provides an instance of a rich text editor control for use in editing HTML.";
            },

            /**
             * @private
             * @see Alpaca.Fields.TextAreaField#getSchemaOfOptions
             */
            getSchemaOfOptions: function () {
                const options = Alpaca.merge(this.base(), {
                    properties: {
                        height: {
                            title: "Height",
                            description: "The height of the field",
                            type: "text",
                            default: "300px",
                        },
                        hideToolbar: {
                            title: "Hide toolbar",
                            description:
                                "Hide the editor toolbar on first load",
                            type: "boolean",
                            default: false,
                        },
                        stringInsert: {
                            type: "object",
                            properties: {
                                label: {
                                    title: "Label",
                                    description:
                                        "The label of the string insert selector.",
                                    type: "string",
                                },
                                trigger: {
                                    title: "Trigger",
                                    description: "The autocompletion trigger.",
                                    type: "string",
                                },
                                endTrigger: {
                                    title: "End trigger",
                                    description:
                                        "The autocompletion end trigger.",
                                    type: "string",
                                },
                                options: {
                                    title: "Options",
                                    description:
                                        "A collection of strings which can be inserted.",
                                    type: "array",
                                    items: {
                                        type: "object",
                                        required: ["id", "text"],
                                        properties: {
                                            id: {
                                                title: "Id",
                                                type: "string",
                                            },
                                            text: {
                                                title: "Text",
                                                type: "string",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                });
                delete options.properties.rows;
                delete options.properties.cols;
                return options;
            },

            /**
             * @private
             * @see Alpaca.Fields.TextAreaField#getOptionsForOptions
             */
            getOptionsForOptions: function () {
                const options = Alpaca.merge(this.base(), {
                    fields: {
                        height: {
                            type: "text",
                            helper: "Height in css units such as px, %, rem ...",
                        },
                        hideToolbar: {
                            type: "checkbox",
                            label: "Hide the editor toolbar on first load",
                        },
                        stringInsert: {
                            type: "object",
                            label: "String insert configuration",
                            properties: {
                                label: {
                                    title: "Label",
                                    label: "Selector label",
                                    type: "text",
                                },
                                trigger: {
                                    title: "Trigger",
                                    label: "Autocompletion trigger.",
                                    type: "text",
                                },
                                endTrigger: {
                                    title: "End trigger",
                                    label: "Autocompletion end trigger.",
                                    type: "text",
                                },
                                options: {
                                    title: "Options",
                                    type: "array",
                                    items: {
                                        type: "object",
                                        // required: ["id", "text"],
                                        properties: {
                                            id: {
                                                title: "Id",
                                                type: "text",
                                            },
                                            text: {
                                                title: "Text",
                                                type: "text",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                });
                delete options.fields.rows;
                delete options.fields.cols;
                return options;
            },
        }
    );

    Alpaca.registerFieldClass(
        "richtexteditor",
        Alpaca.Fields.RichTextEditorField
    );
    Alpaca.registerFieldClass("ckeditor", Alpaca.Fields.RichTextEditorField);
})(jQuery);
