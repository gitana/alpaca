(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.WysiwygField = Alpaca.Fields.TextAreaField.extend(
    /**
     * @lends Alpaca.Fields.WysiwygField.prototype
     */
    {
        /**
         * @constructs
         * @augments Alpaca.Fields.TextAreaField
         *
         * @class WYSIWYG control for chunk of text.
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
         * @see Alpaca.Fields.TextAreaField#setup
         */
        setup: function() {
            this.base();
            this.isWyswygLoaded = false;
        },
        
        /**
         * @see Alpaca.Fields.TextAreaField#postRender
         */
    	postRender: function() {
            this.base();            
			// see if we can render jWysiwyg
            var wysiwygOptions = this.options.wysiwyg ? this.options.wysiwyg : {};
			if (this.field.wysiwyg) {
				if (this.options.onDemand && !this.isWyswygLoaded) {
                    this.field.hover(function() {
                        $(this).wysiwyg(wysiwygOptions);
                        this.isWyswygLoaded = true;
                    });
                } else {
                    this.field.wysiwyg(wysiwygOptions);
                    this.isWyswygLoaded = true;
                }
			}
			if (this.fieldContainer) {
				this.fieldContainer.addClass('alpaca-controlfield-wysiwyg');
			}			
        },//__BUILDER_HELPERS
		
		/**
         * @see Alpaca.Fields.TextAreaField#getTitle
		 */
		getTitle: function() {
			return "Wysiwyg Editor";
		},
		
		/**
         * @see Alpaca.Fields.TextAreaField#getDescription
		 */
		getDescription: function() {
			return "Wysiwyd editor for multi-line text.";
		},

		/**
         * @see Alpaca.Fields.TextAreaField#getFieldType
         */
        getFieldType: function() {
            return "wysiwyg";
        }//__END_OF_BUILDER_HELPERS
    });
    
    Alpaca.registerFieldClass("wysiwyg", Alpaca.Fields.WysiwygField);
    
})(jQuery);
