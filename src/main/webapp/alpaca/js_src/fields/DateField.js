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
            
            if (Alpaca.isEmpty(this.options.mask)) {
                this.options.mask = true;
            }
            
            if (Alpaca.isEmpty(this.options.maskString)) {
                this.options.maskString = "9999-99-99";
            }
            
            if (!this.options.dateFormat) {
                this.options.dateFormat = Alpaca.defaultDateFormat;
            }
        },
        
        /**
         * @Override
         */
        postRender: function() {
            this.base();            
            // apply additional css
            $(this.fieldContainer).addClass("alpaca-datefield");
        },
        
        /**
         * @Override
         *
         */
        handleValidate: function() {			
			var baseStatus = this.base();
			
			var valInfo = this.validation;
			valInfo["invalidDate"] = {
				"message": "",
				"status": this._validateDateFormat()
			};
			if (!this._validateMaxLength()) {
				valInfo["invalidDate"]["message"] = Alpaca.substituteTokens(Alpaca.getMessage("invalidDate", this), [this.options.dateFormat]);
			}
			
			return baseStatus && valInfo["invalidDate"]["status"];			
        },
        
        /**
         * Validates date format
         *
         */
        _validateDateFormat: function() {
            var value = $(this.inputElement).val();
            
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
