(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.Select2Field = Alpaca.Fields.SelectFieldBase.extend(
    /**
     * @lends Alpaca.Fields.SelectField.prototype
     */
    {
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
                var select2Options = {};
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
                                pageSize: 30,
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
                                toastr.error("Det skjedde en feil i søket.", xhr.statusText);
                            }
                        }
                    }
                }
                if (self.options.minimumInputLength) {
                    select2Options.minimumInputLength = self.options.minimumInputLength;
                }
                $selectElement.select2(select2Options);
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
            return Alpaca.merge(this.base(), {
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
                        "title": "Use proxy for datasource",
                        "type": "boolean",
                        "default": false
                    },
                    "size": {
                        "title": "Displayed Options",
                        "description": "Number of options to be shown.",
                        "type": "number"
                    },
                    "emptySelectFirst": {
                        "title": "Empty Select First",
                        "description": "If the data is empty, then automatically select the first item in the list.",
                        "type": "boolean",
                        "default": false
                    },
                    "multiselect": {
                        "title": "Multiselect Plugin Settings",
                        "description": "Multiselect plugin properties - http://davidstutz.github.io/bootstrap-multiselect",
                        "type": "any"
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.Fields.ListField#getOptionsForOptions
         */
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "multiple": {
                        "rightLabel": "Allow multiple selection ?",
                        "helper": "Allow multiple selection if checked",
                        "type": "checkbox"
                    },
                    "minimumInputLength": {
                        "rightLabel": "Minimum Input Length",
                        "type": "integer",
                    },
                    "useProxy": {
                        "rightLabel": "Use proxy for datasource",
                        "type": "checkbox",
                    },
                    "size": {
                        "type": "integer"
                    },
                    "emptySelectFirst": {
                        "type": "checkbox",
                        "rightLabel": "Empty Select First"
                    },
                    "multiselect": {

                        "type": "object",
                        "rightLabel": "Multiselect plugin properties - http://davidstutz.github.io/bootstrap-multiselect"
                    }
                }
            });
        }

        /* end_builder_helpers */

    });

    Alpaca.registerFieldClass("select2", Alpaca.Fields.Select2Field);

})(jQuery);
