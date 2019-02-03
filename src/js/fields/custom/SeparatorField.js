(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.SeparatorField = Alpaca.ControlField.extend({

        resolveControlTemplateType: function () {
            return "ControlField";
        },

        getFieldType: function () {
            return "SeparatorField";
        },

        getTitle: function () {
            return "Separator Field";
        },

        getDescription: function () {
            return "Provides a separator for different sections in the form.";
        },

        getTemplateDescriptorId: function () {
            return "control";
        },

        _validateOptional: function() {
            return true;
        }
    });

    Alpaca.registerFieldClass("SeparatorField", Alpaca.Fields.SeparatorField);

})(jQuery);