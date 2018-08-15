(function($) {

    var Alpaca = $.alpaca;

    Alpaca.updateRiskScoreColor = function (circle, risk) {
        if (circle.length) {
            // want to "==" check for null below to also check for undefined
            // eslint-disable-next-line 
            if (risk == null) {
                circle.css("color", "grey");
            }
            else if (risk >= 0.51) {
                circle.css("color", "red");
            } else if (risk >= 0.3) {
                circle.css("color", "#FDEE00");
            } else if (risk >= 0) {
                circle.css("color", "green");
            }
        }
    };

    Alpaca.Fields.RiskScoreField = Alpaca.ControlField.extend({

        getFieldType: function () {
            return "RiskScore";
        },

        getType: function () {
            return "string";
        },

        getTitle: function () {
            return "Risk Score";
        },

        getDescription: function () {
            return "Provides a radio button that associates options with risks.";
        },
        getValue: function () {
            return this.data;
        },

        updateStepRisk: function () {
            var wizardStepInt = null;
            if (this.view.wizard && this.view.wizard.bindings && this.view.wizard.bindings[this.propertyId]) {
                wizardStepInt = this.view.wizard.bindings[this.propertyId] - 1;
            }
            this.parent.updateRiskScoreForStep(wizardStepInt);
            
        },
        prepareControlModel: function (callback) {
            var self = this;
            this.base(function (model) {
                if (self.data) {
                    for (var i = 0; i < self.options.riskOptions.length; i++) {
                        if (self.options.riskOptions[i].value === self.data) {
                            self.options.riskOptions[i].selected = true;
                        } else {
                            self.options.riskOptions[i].selected = false;
                        }
                    }
                }
                callback(model);
            });
        },

        updateRadioButtons: function () {
            var self = this;
            Alpaca.checked($(self.control).find("input:radio"), false);
            if (self.data) {
                var radio = $(self.control).find("input:radio[value='" + self.data + "']");
                if (radio.length > 0) {
                    Alpaca.checked(radio, true);
                }
            }
        },

        getRisk: function () {
            var risk = null;
            var self = this;
            if (self.data) {
                var selectedOptions = self.options.riskOptions.filter(function (riskOption) {
                    return riskOption.value === self.data;
                });
                if (selectedOptions.length) {
                    risk = selectedOptions[0].risk;
                }
            }
            return risk;
        },

        updateCircleColor: function () {
            var self = this;
            var circle = $(self.field).find("i.fa-circle");
            if (self.data) {
                //Update circle color:
                Alpaca.updateRiskScoreColor(circle, self.getRisk());
            } else {
                Alpaca.updateRiskScoreColor(circle, null);
            }
        },

        afterSetValue: function () {
            this.updateRadioButtons();
            this.updateCircleColor();
        },

        afterRenderControl: function (model, callback) {
            var self = this;
            this.base(model, function () {
                var afterChangeHandler = function () {
                    var newData = {};

                    var checkedButton = $(self.control).find("input:radio:checked")[0];
                    if (checkedButton) {
                        var value = $(checkedButton).attr("value");
                        for (var i = 0; i < self.options.riskOptions.length; i++) {
                            if (self.options.riskOptions[i].value === value) {
                                newData = value;
                                self.options.riskOptions[i].selected = true;
                            } else {
                                self.options.riskOptions[i].selected = false;
                            }
                        }
                    }

                    self.setValue(newData);
                    self.afterSetValue();
                    self.updateStepRisk();
                    self.refreshValidationState();
                    self.triggerWithPropagation("change");
                };

                $(self.control).find("input:radio").change(function (e) {

                    e.preventDefault();

                    afterChangeHandler();
                });
                self.updateCircleColor();
                callback();
            });
        },

        getSchemaOfSchema: function () {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "enum": {
                        "title": "Enumeration",
                        "description": "List of field value options",
                        "type": "array",
                        "required": true
                    }
                }
            });
        },

        getSchemaOfOptions: function () {
            var schema = Alpaca.merge(this.base(), {
                properties: {
                    riskOptions: {
                        title: "Risk Options",
                        description: "An array of risk options",
                        type: "array",
                        items: {
                            title: "Risk Option",
                            type: "object",
                            properties: {
                                label: {
                                    title: "Label",
                                    type: "string",
                                    required: true
                                },
                                value: {
                                    title: "Value",
                                    type: "string",
                                    required: false
                                },
                                risk: {
                                    title: "Risk",
                                    type: "number",
                                    minimum: 0,
                                    maximum: 1
                                }
                            }
                        }
                    }
                }
            });
            delete schema.properties.sort;
            return schema;
        },
        getOptionsForOptions: function () {
            var optionsForOptions = Alpaca.merge(this.base(), {
                fields: {
                    riskOptions: {
                        type: "array",
                        items: {
                            fields: {
                                value: {
                                    helper: "If you do not give a Value, it is set to same as Label. Value is the technical name of the option and is used to allow changing the option labels without losing data.",
                                },
                                risk: {
                                    helper: "Empty: grey, [0, 0.3): green, [0.30, 0.5]: yellow, (0.5, 1]: red",
                                    type: "number"
                                }
                            }
                        }
                    }
                }
            });
            delete optionsForOptions.fields.sort;
            return optionsForOptions;
        }
    });

    Alpaca.registerFieldClass("RiskScore", Alpaca.Fields.RiskScoreField);

})(jQuery);