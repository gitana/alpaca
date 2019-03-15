(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.Select2Field = Alpaca.Fields.SelectFieldBase.extend(
    /**
     * @lends Alpaca.Fields.SelectField.prototype
     */
    {
        setup: function () {
            this.options.hideNone = true;
            this.options.skipRequiredSelectFirst = true;
            this.options.noneLabel = "";
            this.base();
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

        /**
         * @see Alpaca.Field#getFieldType
         */
        getFieldType: function()
        {
            return "select2";
        },

        resolveControlTemplateType: function () {
            return "select";
        },

        beforeRenderControl: function (model, callback) {
            var self = this;
            this.base(model, function() { 
                if (self.data) {
                    model.displayableText = self.data.map(function (option) { return option.text; }).join(", ");
                } else {
                    model.displayableText = "";
                }
                callback()
            });
        },

        afterRenderControl: function(model, callback)
        {
            var self = this;
            
            if (!self.isDisplayOnly()){
                
                var $selectElement = $(self.getControlEl());
                if (!this.options.watermarkLabel) {
                    this.options.watermarkLabel = " -Velg verdi - ";
                }  
                var select2Options = {
                    placeholder: self.options.watermarkLabel,
                    allowClear: true
                };
                if (self.options.useProxy && self.options.dataSource && self.options.dataSource.length > 1) {
                    select2Options.ajax = {
                        url: "/api/selectlist/proxysearch",
                        contentType: "application/json; charset=utf-8",
                        dataType: 'json',
                        type: "POST",
                        delay: 250,
                        data: function (params) {
                            return JSON.stringify({
                                externalUrl: self.options.dataSource,
                                term: params.term ? params.term : "", // search term
                                page: params.page || 1,
                                pageSize: self.options.size || 30
                            });
                        },
                        processData: true,
                        processResults: function (data, params) {
                            var results = data.results;
                            if (self.options.multiple) {
                                results = results.filter(function (result) {
                                    if (!$selectElement.val()) {
                                        return true;
                                    }
                                    return !$selectElement.val().includes(result.id);
                                });
                            }
                            params.page = params.page || 1;
                            return {
                                results: results,
                                pagination: data.pagination
                            };
                        },
                        cache: false,
                        error: function (xhr) {
                            if (xhr.statusText !== "abort") {
                                var errorMessage = xhr && xhr.responseJSON && xhr.responseJSON.exceptionMessage;
                                toastr.error(errorMessage || "Det skjedde en feil i søket.", xhr.statusText);
                            }
                        }
                    }
                }
                if (self.options.minimumInputLength) {
                    select2Options.minimumInputLength = self.options.minimumInputLength;
                }                               

                $selectElement.select2(select2Options);

                if (self.options.multiple) {
                    // fixes issue with search field losing focus after selecting item in multiselect
                    $selectElement.on('select2:close', function (e) {
                        var $searchfield = $(this).parent().find('.select2-search__field');
                        setTimeout(function() {$searchfield.focus();}, 100);
                    });
                }

                if (self.data) {
                    var selectedItems = [];
                    Alpaca.isArray(self.data) && self.data.forEach(function (selectedItem) {
                        // add option if it is missing in select element 
                        if ($selectElement.find("option[value='" + selectedItem.value + "']").length) {
                            selectedItems.push(selectedItem.value); 
                        } else { 
                            var newOption = new Option(selectedItem.text, selectedItem.value, true, true);
                            $selectElement.append(newOption);
                            selectedItems.push(selectedItem.value);
                        } 
                    });

                    $selectElement.val(selectedItems);
                    $selectElement.trigger('change');
                }
            }

            var afterChangeHandler = function()
            {
                var newData = [];
                var data =  $(self.getControlEl()).select2('data');
                Alpaca.isArray(data) && data.forEach(function (selectedItem) {
                    newData.push({value: selectedItem.id, text: selectedItem.text});
                });
                self.setValue(newData, true);
                self.refreshValidationState();
                self.triggerWithPropagation("change");
            };

            $(self.control).change(function(e) {
                afterChangeHandler();
            });

            callback();
        },


        /**
         * @see Alpaca.SelectFieldBase#focus
         */
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

        /* builder_helpers */
        /**
         * @see Alpaca.Field#getTitle
         */
        getTitle: function() {
            return "Select Field";
        },

        /**
         * @see Alpaca.Field#getDescription
         */
        getDescription: function() {
            return "Select Field";
        },

        /**
         * @private
         * @see Alpaca.Fields.ListField#getSchemaOfOptions
         */
        getSchemaOfOptions: function() {
            var schemaOfOptions = Alpaca.merge(this.base(), {
                "properties": {
                    "multiple": {
                        "title": "Multiple Selection",
                        "description": "Allow multiple selection if true.",
                        "type": "boolean",
                        "default": false
                    },
                    "minimumInputLength": {
                        "title": "Minimum Input Length",
                        "description": "Minimum characters enteren in search box before search is performed",
                        "type": "number",
                        "minimum": 0
                    },
                    "useProxy": {
                        "title": "Use proxy",
                        "type": "boolean",
                        "default": false
                    },
                    "size": {
                        "title": "Displayed Options",
                        "description": "Number of options to be shown per page. Scroll to show more pages.",
                        "type": "number"
                    },
                    "watermarkLabel": {
                        "title": "Watermark label",
                        "description": "The label to use for the watermark.",
                        "type": "string",
                        "default": " - Velg verdi - "
                    }
                }
            });
            delete schemaOfOptions.properties.multiselect;
            delete schemaOfOptions.properties.emptySelectFirst;
            delete schemaOfOptions.properties.noneLabel;
            delete schemaOfOptions.properties.hideNone;
            delete schemaOfOptions.properties.removeDefaultNone;
            return schemaOfOptions;
        },

        /**
         * @private
         * @see Alpaca.Fields.ListField#getOptionsForOptions
         */
        getOptionsForOptions: function() {
            var optionsForOptions =  Alpaca.merge(this.base(), {
                "fields": {
                    "dataSource": {
                        "order": 101
                    },
                    "multiple": {
                        "rightLabel": "Allow multiple selection ?",
                        "helper": "Allow multiple selection if checked",
                        "type": "checkbox"
                    },
                    "minimumInputLength": {
                        "rightLabel": "Minimum Input Length",
                        "type": "integer",
                        "order": 103
                    },
                    "useProxy": {
                        "rightLabel": "Use proxy for datasource",
                        "type": "checkbox",
                        "order": 102
                    },
                    "size": {
                        "type": "integer"
                    },
                    "watermarkLabel": {
                        "rightLabel": "Watermark label",
                        "helper": "Label to use on option displayed when user has not selected a value",
                        "type": "text"
                    }
                }
            });
            delete optionsForOptions.fields.multiselect;
            delete optionsForOptions.fields.emptySelectFirst;
            delete optionsForOptions.fields.noneLabel;
            delete optionsForOptions.fields.hideNone;
            delete optionsForOptions.fields.removeDefaultNone;
            delete optionsForOptions.fields.useDataSourceAsEnum;

            return optionsForOptions;
        }

        /* end_builder_helpers */

    });

    Alpaca.registerFieldClass("select2", Alpaca.Fields.Select2Field);

})(jQuery);
