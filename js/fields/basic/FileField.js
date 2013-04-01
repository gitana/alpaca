(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.FileField = Alpaca.Fields.TextField.extend(
    /**
     * @lends Alpaca.Fields.FileField.prototype
     */
    {
        /**
         * @constructs
         * @augments Alpaca.Fields.TextField
         *
         * @class File control with nice custom styles.
         *
         * @param {Object} container Field container.
         * @param {Any} data Field data.
         * @param {Object} options Field options.
         * @param {Object} schema Field schema.
         * @param {Object|String} view Field view.
         * @param {Alpaca.Connector} connector Field connector.
         * @param {Function} errorCallback Error callback.
         */
        constructor: function(container, data, options, schema, view, connector, errorCallback) {
            this.base(container, data, options, schema, view, connector, errorCallback);
        },

        /**
         * @see Alpaca.Fields.TextField#setup
         */
        setup: function() {
            this.base();            
            this.controlFieldTemplateDescriptor = this.view.getTemplateDescriptor("controlFieldFile");
        },
                
        /**
         * @see Alpaca.Fields.TextField#setValue
         */
        setValue: function(value) {
            // be sure to call into base method
            // We won't be able to actually set the value for file input field so we use the mask input
            var tmp = this.field;
            this.field = $('.alpaca-filefield-control',this.fieldContainer);
            this.base(value);

            // switch it back to actual file input
            this.field = tmp;
        },
        
        /**
         * @see Alpaca.Fields.TextField#postRender
         */
        postRender: function() {
            this.base();
            // apply additional css
			if (this.fieldContainer) {
				this.fieldContainer.addClass("alpaca-controlfield-file");
            }
        },//__BUILDER_HELPERS
		
		/**
         * @see Alpaca.Fields.TextField#getTitle
		 */
		getTitle: function() {
			return "File Field";
		},
		
		/**
         * @see Alpaca.Fields.TextField#getDescription
		 */
		getDescription: function() {
			return "Field for uploading files.";
		},

		/**
         * @see Alpaca.Fields.TextField#getFieldType
         */
        getFieldType: function() {
            return "file";
        }//__END_OF_BUILDER_HELPERS
    });
    
    Alpaca.registerTemplate("controlFieldFile", '<input type="file" id="${id}" {{if options.size}}size="${options.size}"{{/if}} {{if options.readonly}}readonly="readonly"{{/if}} {{if name}}name="${name}"{{/if}} {{each(i,v) options.data}}data-${i}="${v}"{{/each}}/>');
    Alpaca.registerFieldClass("file", Alpaca.Fields.FileField);
})(jQuery);
