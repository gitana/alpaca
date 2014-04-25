(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.FileField = Alpaca.Fields.TextField.extend(
    /**
     * @lends Alpaca.Fields.FileField.prototype
     */
    {
        /**
         * @see Alpaca.ControlField#getFieldType
         */
        getFieldType: function()
        {
            return "file";
        },

        /**
         * @see Alpaca.Fields.TextField#setValue
         */
        setValue: function(value)
        {
            /*
            // be sure to call into base method
            // We won't be able to actually set the value for file input field so we use the mask input
            var tmp = this.getControlEl();
            this.field = $('.alpaca-filefield-control',this.fieldContainer);
            this.base(value);

            // switch it back to actual file input
            this.field = tmp;
            */
            this.base(value);
        },

        onChange: function(e)
        {
            this.base(e);

            if (this.options.selectionHandler)
            {
                this.processSelectionHandler(e.target.files);
            }
        },

        processSelectionHandler: function(files)
        {
            if (files && files.length > 0)
            {
                // if the browser supports HTML5 FileReader, we can pull in the stream for preview
                if (typeof(FileReader) !== "undefined")
                {
                    // clear out previous loaded data
                    var loadedData = [];
                    var loadCount = 0;

                    var fileReader = new FileReader();
                    fileReader.onload = (function() {
                        var field = this;
                        return function(event)
                        {
                            var dataUri = event.target.result;

                            loadedData.push(dataUri);
                            loadCount++;

                            if (loadCount === files.length)
                            {
                                field.options.selectionHandler.call(field, files, loadedData);
                            }
                        }
                    }).call(this);

                    for (var i = 0; i < files.length; i++)
                    {
                        fileReader.readAsDataURL(files[i]);
                    }
                }
            }
        }

        //__BUILDER_HELPERS
        ,

        /**
         * @private
         * @see Alpaca.ControlField#getSchemaOfOptions
         */
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "selectionHandler": {
                        "title": "Selection Handler",
                        "description": "Function that should be called when files are selected.  Requires HTML5.",
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
                    "selectionHandler": {
                        "type": "checkbox"
                    }
                }
            });
        },

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
		}
		//__END_OF_BUILDER_HELPERS
    });

    Alpaca.registerFieldClass("file", Alpaca.Fields.FileField);

})(jQuery);
