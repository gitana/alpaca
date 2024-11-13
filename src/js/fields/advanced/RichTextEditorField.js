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
                            description: "Hide the editor toolbar on first load",
                            type: "boolean",
                            default: false,
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
})(jQuery);
