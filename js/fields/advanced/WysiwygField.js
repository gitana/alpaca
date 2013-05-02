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

            this.controlsConfig = {};
            this.controlsConfig.simple = {
                "html": { "visible": true },
                "createLink": { "visible": false },
                "unLink": { "visible": false },
                "h1": { "visible": false },
                "h2": { "visible": false },
                "h3": { "visible": false },
                "indent": { "visible": false },
                "insertHorizontalRule": { "visible": false },
                "insertImage": { "visible": false },
                "insertOrderedList": { "visible": false },
                "insertTable": { "visible": false },
                "insertUnorderedList": { "visible": false },
                "justifyCenter": { "visible": false },
                "justifyFull": { "visible": false },
                "justifyLeft": { "visible": false },
                "justifyRight": { "visible": false },
                "outdent": { "visible": false },
                "redo": { "visible": false },
                "removeFormat": { "visible": false },
                "subscript": { "visible": false },
                "superscript": { "visible": false },
                "undo": { "visible": false },
                "code": { "visible": false },
                "strikeThrough": { "visible": false }
            };
        },

        /**
         * @see Alpaca.Fields.TextAreaField#setup
         */
        setup: function() {
            this.base();

            // instantiated plugin reference
            this.plugin = null;
        },
        
        /**
         * @see Alpaca.Fields.TextAreaField#postRender
         */
        postRender: function() {
            this.base();            
			// see if we can render jWysiwyg
            var _this = this;

            if (this.field && $.wysiwyg)
            {
                var wysiwygOptions = this.options.wysiwyg ? this.options.wysiwyg : {};

                if (wysiwygOptions.controls)
                {
                    if (typeof(wysiwygOptions.controls) === "string")
                    {
                        wysiwygOptions.controls = this.controlsConfig[wysiwygOptions.controls];
                        if (!wysiwygOptions.controls)
                        {
                            wysiwygOptions.controls = {};
                        }
                    }
                }

                if (this.options.onDemand)
                {
                    this.outerEl.find("textarea").mouseover(function() {

                        if (!_this.plugin)
                        {
                            _this.plugin = $(this).wysiwyg(wysiwygOptions);

                            _this.outerEl.find(".wysiwyg").mouseout(function() {

                                if (_this.plugin) {
                                    _this.plugin.wysiwyg('destroy');
                                }

                                _this.plugin = null;

                            });
                        }
                    });
                }
                else
                {
                    this.plugin = this.field.wysiwyg(wysiwygOptions);
                }

                this.outerEl.find(".wysiwyg").mouseout(function() {
                    _this.data = _this.getValue();
                    _this.renderValidationState();
                });
            }

			if (this.fieldContainer) {
				this.fieldContainer.addClass('alpaca-controlfield-wysiwyg');
			}
        },//__BUILDER_HELPERS
		
        /**
         * @private
         * @see Alpaca.ControlField#getSchemaOfOptions
         */
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "wysiwyg": {
                        "title": "Editor options",
                        "description": "Options that are supported by the <a href='https://github.com/akzhan/jwysiwyg'>jQuery WYSIWYG plugin</a>.",
                        "type": "any"
                    },
                    "onDemand": {
                        "title": "On Demand",
                        "description": "If true, WYSIWYG editor will only be enabled when the field is hovered.",
                        "type": "boolean",
                        "default": false
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.ControlField#getOptionsForOptions
         */
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "wysiwyg": {
                        "type": "any"
                    },
                    "onDemand": {
                        "type": "checkbox",
                        "rightLabel": "Make the editor on-demand?"
                    }
                }
            });
        },

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
			return "Wysiwyg editor for multi-line text which is based on Akzhan Abdulin's <a href='https://github.com/akzhan/jwysiwyg'>jQuery WYSIWYG plugin</a>.";
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
