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
                    var text = _this.getEnum()[index];
                    if (_this.options.optionLabels && _this.options.optionLabels[index]) {
                        text = _this.options.optionLabels[index];
                    }
                    _this.selectOptions.push({
                        "value": _this.getEnum()[index],
                        "text": text
                    })
                });
            }
        },
        
        /**
         * Utility function for getting enum
         */
        getEnum: function() {
            if (this.schema && this.schema["enum"]) {
                return this.schema["enum"];
            }
        }
        
    });
})(jQuery);
