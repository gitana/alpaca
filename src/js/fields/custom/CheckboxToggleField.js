(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.CheckBoxToggleField = Alpaca.Fields.CheckBoxField.extend({

        getFieldType: function () {
            return "CheckBoxToggle";
        },

        getTitle: function () {
            return "Checkbox toggle";
        },

        getDescription: function () {
            return "Renders check box as toggle button.";
        },

        afterRenderControl: function (model, callback) {
            var self = this;
            this.base(model, function () {
                $(self.control).find("input:checkbox").bootstrapToggle();
                callback();
            });
        }        
    });

    Alpaca.registerFieldClass("CheckBoxToggle", Alpaca.Fields.CheckBoxToggleField);

})(jQuery);