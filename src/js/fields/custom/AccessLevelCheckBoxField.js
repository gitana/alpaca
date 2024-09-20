(function ($) {
    var Alpaca = $.alpaca;

    Alpaca.Fields.AccessLevelCheckBoxField = Alpaca.Fields.CheckBoxField.extend(
        {
            getFieldType: function () {
                return "AccessLevelCheckBox";
            },

            getTitle: function () {
                return "Checkbox Field with Access Level";
            },

            getDescription: function () {
                return "Checkbox field linked to an access level.";
            },

            getSchemaOfOptions: function () {
                const schemaOfOptions = Alpaca.merge(this.base(), {
                    properties: {
                        addAccessLevel: {
                            title: "Add access Level",
                            description: "Pick the access level to add when the check box is selected."
                        }
                    }
                });
                delete schemaOfOptions.properties.multiple;
                return schemaOfOptions;
            },

            getOptionsForOptions: function () {
                const optionsForOptions = Alpaca.merge(this.base(), {
                    fields: {
                        addAccessLevel: {
                            type: "Select2EntityPicker",
                            entityType: "AccessLevelEntity",
                            watermarkLabel: " - Finn tilgangsnivå - ",
                            helper: "Select the access level to add when the check box is selected.",
                            label: "Add access level",
                        }
                    }
                });
                delete optionsForOptions.fields.multiple;
                return optionsForOptions;
            }
        });

    Alpaca.registerFieldClass("AccessLevelCheckBox", Alpaca.Fields.AccessLevelCheckBoxField);
    Alpaca.registerDefaultSchemaFieldMapping("boolean", "AccessLevelCheckBox");
})(jQuery);