(function($) {

    var Alpaca = $.alpaca;
    
    /**
     * Date field
     */
    Alpaca.Fields.DateField = Alpaca.Fields.TextField.extend({
    
        /**
         * @Override
         *
         */
        setup: function() {
            this.base();
            
            if (!this.options.dateFormat) {
                this.options.dateFormat = Alpaca.defaultDateFormat;
            }
        },
        
        /**
         * @Override
         */
        postRender: function() {
            this.base();            
			$('<span class="ui-icon ui-icon-calendar"></span>').prependTo(this.fieldContainer);
			this.field.datepicker({
				"dateFormat":  this.options.dateFormat
			});
			if (this.fieldContainer) {
				this.fieldContainer.addClass('alpaca-controlfield-date');
			}			
        },
		
        /**
         * @Override
         */
        onChange: function(e) {
            this.base();
			this.renderValidationState();
        },
                
        /**
         * @Override
         *
         */
        handleValidate: function() {			
			var baseStatus = this.base();
			
			var valInfo = this.validation;
			
			var status = this._validateDateFormat();
			valInfo["invalidDate"] = {
				"message": status ? "" : Alpaca.substituteTokens(Alpaca.getMessage("invalidDate", this), [this.options.dateFormat]),
				"status": status
			};
			
			return baseStatus && valInfo["invalidDate"]["status"];			
        },
        
        /**
         * Validates date format
         *
         */
        _validateDateFormat: function() {
            var value = this.field.val();
            
			try {
				$.datepicker.parseDate(this.options.dateFormat, value);
				return true;
			} catch(e) {
				return false;
			}

/*
            var separator = this.options.dateFormat.match(/[^Ymd ]/g)[0];
            
            var ladate = value.split(separator);
            if (ladate.length != 3) {
                return false;
            }
            
            if (isNaN(parseInt(ladate[0], 10)) || isNaN(parseInt(ladate[1], 10)) || isNaN(parseInt(ladate[2], 10))) {
                return false;
            }
            
            if (!ladate[0].match(/^\d+$/) || !ladate[1].match(/^\d+$/) || !ladate[2].match(/^\d+$/)) {
                return false;
            }
            
            var formatSplit = this.options.dateFormat.split(separator);
            
            var yearIndex = Alpaca.indexOf("Y", formatSplit);
            if (ladate[yearIndex].length != 4) {
                return false;
            } // Avoid 3-digits years...
            var d = parseInt(ladate[Alpaca.indexOf('d', formatSplit)], 10);
            var Y = parseInt(ladate[yearIndex], 10);
            var m = parseInt(ladate[Alpaca.indexOf('m', formatSplit)], 10) - 1;
            var unedate = new Date(Y, m, d);
            var annee = unedate.getFullYear();
            
            return ((unedate.getDate() == d) && (unedate.getMonth() == m) && (annee == Y));
*/
        },
        
        /**
         * @Override
         *
         */
        setValue: function(val, stopUpdateTrigger) {
            // skip out if no date
            if (val == "") {
                this.base(val, stopUpdateTrigger);
                return;
            }
            
/*
            var str = "";
            if (val instanceof Date) {
                str = Alpaca.Fields.DateField.formatDate(val, this.form.dateFormat);
            } else {
                if (this.options.valueFormat) {
                    var dateVal = Alpaca.Fields.DateField.parseWithFormat(val, this.options.valueFormat);
                    str = Alpaca.Fields.DateField.formatDate(dateVal, this.options.valueFormat);
                } else {
                    str = val;
                }
            }
            this.base(str, stopUpdateTrigger);
*/
            this.base(val, stopUpdateTrigger);
        },
		
        /**
         * @Override
         */
        getSchemaOfSchema: function() {
            return Alpaca.merge(this.base(), {
				"properties": {
                    "format": {
                        "title": "Format",
                        "description": "Property data format",
                        "type": "string",
						"default":"date",
                        "enum" : ["date"],
						"readonly":true
                    }			
				}
            });
        },

        /**
         * @Override
         */
		getOptionsForSchema: function() {
            return Alpaca.merge(this.base(),{
				"fields": {
					"format": {
						"type": "text"
					}
				}
			});
        },

		/**
         * @Override
		 */
		getTitle: function() {
			return "Date Field";
		},
		
		/**
         * @Override
		 */
		getDescription: function() {
			return "Date Field.";
		},
		
        /**
         * @Override
         */
		getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(),{
				"properties": {
					"dateFormat": {
						"title": "Date Format",
						"description": "Date format",
						"type": "string",
						"default": Alpaca.defaultDateFormat
					}
				}
			});
		},

        /**
         * @Override
         */
		getOptionsForOptions: function() {
            return Alpaca.merge(this.base(),{
				"fields": {
					"dateFormat": {
						"type": "text"
					}
				}
			});
		},
		
		/**
         * @Override
         */
        getFieldType: function() {
            return "date";
        }		
    });
    
    Alpaca.Fields.DateField.parseWithFormat = function(sDate, format) {
        var separator = format.match(/[^Ymd ]/g)[0];
        var ladate = sDate.split(separator);
        var formatSplit = format.split(separator);
        var d = parseInt(ladate[Alpaca.indexOf('d', formatSplit)], 10);
        var Y = parseInt(ladate[Alpaca.indexOf('Y', formatSplit)], 10);
        var m = parseInt(ladate[Alpaca.indexOf('m', formatSplit)], 10) - 1;
        return (new Date(Y, m, d));
    };
    
    Alpaca.Fields.DateField.formatDate = function(d, format) {
        var str = format.replace('Y', d.getFullYear());
        var m = d.getMonth() + 1;
        str = str.replace('m', ((m < 10) ? '0' : '') + m);
        var day = d.getDate();
        str = str.replace('d', ((day < 10) ? '0' : '') + day);
        return str;
    };
    
    Alpaca.registerMessages({
        "invalidDate": "Invalid date for format {0}"
    });
    Alpaca.registerFieldClass("date", Alpaca.Fields.DateField);
    Alpaca.registerDefaultFormatFieldMapping("date", "date");
})(jQuery);
