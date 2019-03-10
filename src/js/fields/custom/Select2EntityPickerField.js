(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.Select2EntityPicker = Alpaca.Fields.SelectFieldBase.extend({
        setup: function () {
            this.options.hideNone = true;
            this.options.skipRequiredSelectFirst = true;
            this.base();
            if (this.data) {
                this.selectOptions = this.data;
            } else {
                this.selectOptions = [];
            }
            this.selectOptions.forEach(function (option) { option.selected = true; });
        },

        getControlValue: function () {
            return $(":selected", this.control).map(function () {
                return {
                    "value": $(this).val(),
                    "text": $(this).text()
                }
            }).get();
        },

        getValue: function () {
            return this.data;
        },

        isEmpty: function () {
            return (this.isDisplayOnly() ? this.data : this.getControlValue()).length === 0;
        },

        getFieldType: function () {
            return "Select2EntityPicker";
        },

        onChange: function (e) {
            this.data = this.getControlValue();
        },

        beforeRenderControl: function (model, callback) {
            if (this.data) {
                model.displayableText = this.data.map(function (option) { return option.text; }).join(", ");
            } else {
                model.displayableText = "";
            }
            callback();
        },

        afterRenderControl: function (model, callback) {
            if (!this.isDisplayOnly()) {
                var $select = $(this.getControlEl());
                if (!this.options.entityType) {
                    this.options.entityType = "UserEntity";
                }
                $select.attr('data-entity-type', this.options.entityType);
                $select.attr('data-filter', this.options.typeFilter);
                $select.attr('data-minimum-input-length', this.options.minimumInputLength);
                if (!this.isRequired()) {
                    $select.attr('data-allow-clear', true);
                }
                if (!this.options.watermarkLabel) {
                    this.options.watermarkLabel = " - Finn medarbeider - ";
                }
                SetupEntitySelect2Control($select, this.options.crossTenantSelection ? null : -1, this.options.watermarkLabel, false, true, false);
            }
            callback();
        },

        focus: function (onFocusCallback) {
            if (this.control) {
                var $ddl = $(this.control);
                if ($ddl.data('select2')) {
                    $ddl.select2("focus");
                    if (onFocusCallback) {
                        onFocusCallback(this);
                    }
                }
            }
        },

        _validateEnum: function () {
            return true;
        },

        getTitle: function () {
            return "Entity picker";
        },

        getDescription: function () {
            return "Provides a select control for picking entities such as people, companies, departments, computers and so forth.";
        },

        getSchemaOfOptions: function () {
            var schemaOfOptions = Alpaca.merge(this.base(), {
                "properties": {
                    "crossTenantSelection": {
                        "title": "Cross tenant selection",
                        "description": "Allow cross tenant selection if true. Note that this option applies only if entity type is Person.",
                        "type": "boolean",
                        "default": false
                    },
                    "watermarkLabel": {
                        "title": "Watermark label",
                        "description": "The label to use for the watermark.",
                        "type": "string",
                        "default": " - Finn medarbeider - "
                    },
                    "minimumInputLength": {
                        "title": "Minimum Input length before search",
                        "description": "The number of characters the user must enter before a search is fired",
                        "type": "int",
                        "default": 0
                    },
                    "entityType": {
                        "title": "Entity type",
                        "description": "The type of entity to pick.",
                        "type": "string",
                        "default": "UserEntity",
                        "enum": ["CompanyEntity", "ComputerEntity", "DepartmentEntity", "JobTitleEntity", "KeywordEntity", "ServiceEntity", "UserEntity", "ProcessEntity", "Supplier", "PersonalDataProcessingActivity", "RoleEntity"]
                    },
                    "typeFilter": {
                        "title": "Ekstra typefilter",
                        "description": "The type of entity to pick.",
                        "type": "string",
                        "enum": ["Causality", "EstablishImprovementMeasureAssessment", "CreditAuthorizationBreachCausality", "Product", "AppealsBody", "AuditScore", "ExtentProposedImprovementSuggestionIsTakenIntoAccount", "EducationalLevel", "EducationalDirection", "CompetenceLevel", "RecruitmentRequirementsAnalysisStatus", "EducationalEstablishment", "PersonalDataCategory", "PersonalDataProcessingArea", "CustomerChannel", "CustomerComplaintCategory"]
                    },
                    "actionType": {
                        "title": "Action type",
                        "description": "The type of action to perform with the entity picked.",
                        "type": "string",
                        "enum": ["Approver1", "Approver2", "Approver3", "Approver4", "Approver5", "Approver6", "Approver7", "Approver8", "Approver9", "Approver10"]
                    }
                }
            });
            delete schemaOfOptions.properties.multiselect;
            delete schemaOfOptions.properties.noneLabel;
            delete schemaOfOptions.properties.hideNone;
            delete schemaOfOptions.properties.removeDefaultNone;
            delete schemaOfOptions.properties.dataSource;
            delete schemaOfOptions.properties.useDataSourceAsEnum;
            delete schemaOfOptions.properties.size;
            delete schemaOfOptions.properties.emptySelectFirst;
            return schemaOfOptions;
        },

        getOptionsForOptions: function () {
            var optionsForOptions = Alpaca.merge(this.base(), {
                "fields": {
                    "crossTenantSelection": {
                        "rightLabel": "Allow select people in all tenants ?",
                        "helper": "Allow select people in all tenants if checked. Note that this option applies only if entity type is Person.",
                        "type": "checkbox"
                    },
                    "watermarkLabel": {
                        "rightLabel": "Watermark label",
                        "helper": "Label to use on option displayed when user has not selected a value",
                        "type": "text"
                    },
                    "minimumInputLength": {
                        "rightLabel": "Minimum Input length before search",
                        "helper": "The number of characters the user must enter before a search is fired",
                        "type": "text"
                    },
                    "entityType": {
                        "hideNone": true,
                        "rightLabel": "Entity type",
                        "helper": "The type of entity to pick",
                        "type": "select",
                        "optionLabels": ["Company", "Machine", "Department", "Job title", "Keyword", "Service", "Person", "Process", "Supplier", "Personal data processing activity", "Role"]
                    },
                    "typeFilter": {
                        "hideNone": false,
                        "noneLabel": " - Don't use extra type filter - ",
                        "rightLabel": "Extra type filter",
                        "helper": "Filter for types within the selection entity type",
                        "type": "select",
                        "optionLabels": ["Årsakssammenheng", "Vurdering av behov for tiltak", "Årsak til brudd på kredittfullmakt", "Produkt", "Klageinstans", "Revisjonsresultat", "I hvilken grad foreslått forbedringsforslag tas til følge", "Utdanningsnivå", "Utdanningsretning", "Realkompetanse", "Status for behovsanalyse ved rekruttering", "Utdanningsinstitusjon", "Kategori av personopplysninger", "Personopplysningsbehandlingsområde", "Kundekanal", "Kundeklagekategori"]
                    },
                    "actionType": {
                        "hideNone": false,
                        "noneLabel": " - Don't use action type - ",
                        "rightLabel": "Action type",
                        "helper": "The type of action to perform with the entity picked.",
                        "type": "select",
                        "optionLabels": ["Approver 01", "Approver 02", "Approver 03", "Approver 04", "Approver 05", "Approver 06", "Approver 07", "Approver 08", "Approver 09", "Approver 10"]
                    }
                }
            });
            delete optionsForOptions.fields.multiselect;
            delete optionsForOptions.fields.noneLabel;
            delete optionsForOptions.fields.hideNone;
            delete optionsForOptions.fields.removeDefaultNone;
            delete optionsForOptions.fields.size;
            delete optionsForOptions.fields.emptySelectFirst;
            return optionsForOptions;
        }
    });

    Alpaca.registerFieldClass("Select2EntityPicker", Alpaca.Fields.Select2EntityPicker);

})(jQuery);