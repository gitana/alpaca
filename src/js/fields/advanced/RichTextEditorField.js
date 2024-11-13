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
        }
    );

    Alpaca.registerFieldClass(
        "richtexteditor",
        Alpaca.Fields.RichTextEditorField
    );
})(jQuery);
