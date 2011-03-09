/**
 * Basic list control
 *
 * The following additional settings are permitted:
 *
 * {
 *    optionLabels: <arrary>						lables for select options
 *    readonly: <boolean>                           whether to mark the input control as readonly
 *    formName: <string>                            form field name
 * }
 *
 * This field obeys JSON Schema for:
 *
 * {
 *    enum: <array>,                          [optional]
 * }
 */
(function($) {

    var Alpaca = $.alpaca;
    
    /**
     * List field
     */
    Alpaca.Fields.ListField = Alpaca.ControlField.extend({
    
        /**
         * @Override
         *
         * Setup the select options
         */
        setup: function() {
			var _this = this;
			_this.base();
			_this.selectOptions = [];
			if (_this.getEnum()) {
				$.each(_this.getEnum(), function(index, value) {
					var text = value;
					if (_this.options.optionLabels && _this.options.optionLabels[index]) {
						text = _this.options.optionLabels[index];
					}
					_this.selectOptions.push({
						"value": value,
						"text": text
					});
				});
			} else {
				if (this.options.dataSource) {
					if (Alpaca.isFunction(this.options.dataSource)) {
						this.options.dataSource(this);
					}
					if (Alpaca.isUri(this.options.dataSource)) {
						var _this = this;
						$.ajax({
							url: this.options.dataSource,
							type: "get",
							dataType: "json",
							success: function(jsonDocument) {
								var ds = jsonDocument;
								if (_this.options.dsTransformer && Alpaca.isFunction(_this.options.dsTransformer)) {
									ds = _this.options.dsTransformer(ds);
									if (ds) {
										if (Alpaca.isArray(ds)) {
											$.each(ds, function(index, value) {
												_this.selectOptions.push({
													"value": value,
													"text": value
												});
											});
										}
										if (Alpaca.isObject(ds)) {
											$.each(ds, function(index, value) {
												_this.selectOptions.push({
													"value": index,
													"text": value
												});
											});
										}
									}
								}
							},
							error: function(error) {
							}
						});
					}					
				}
			}
		},
        
        /**
         * Utility function for getting enum
         */
        getEnum: function() {
            if (this.schema && this.schema["enum"]) {
                return this.schema["enum"];
            }
        },
		
        /**
         * @Override
         */
		getSchemaOfSchema: function() {
            return Alpaca.merge(this.base(),{
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
		
        /**
         * @Override
         */
        getType: function() {
            return "any";
        },
		
        /**
         * @Override
         */
		getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(),{
				"properties": {
					"optionLabels": {
						"title": "Option Labels",
						"description": "Lables for options",
						"type": "array"
					},
					"dataSource": {
						"title": "Option Datasource",
						"description": "Datasource for generating options",
						"type": "string"
					},
				}
			});
		},
		
        /**
         * @Override
         */
		getOptionsForOptions: function() {
            return Alpaca.merge(this.base(),{
				"fields": {
					"optionLabels": {
						"itemLabel":"Label",
						"type": "array"
					},
					"dataSource": {
						"type": "text"
					},
				}
			});
		}			             
    });
})(jQuery);
