(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.TinyMCEField = Alpaca.Fields.TextAreaField.extend(
        /**
         * @lends Alpaca.Fields.tinyMCEField.prototype
         */
        {
            /**
             * @see Alpaca.Fields.TextAreaField#getFieldType
             */
            getFieldType: function() {
                return "tinymce";
            },

            /**
             * @see Alpaca.Fields.TextAreaField#setup
             */
            setup: function()
            {
                var self=this;

                if (!this.data)  {
                    this.data = "";
                }

                var standardToolbar="insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image";
                if (!self.options.toolbar) {
                    self.options.toolbar = standardToolbar;
                }

                this.base();
            },

            getValue:function()
            {
                var self = this;

                var rteFieldID = self.control[0].id;
                var rteRef = tinymce.get(rteFieldID);
                var returnVal = "";

                //when page intially loads and tinyMCE not yet initialized, this check prevents an error
                if (!rteRef)
                {
                    returnVal = rteRef.getContent()
                }

                return returnVal;
            },

            afterRenderControl: function(model, callback)
            {
                //"insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image"
                var self = this;
                this.base(model, function() {

                    if (!this.data) {
                        if (!self.isDisplayOnly() && self.control) {
                            var rteFieldID = self.control[0].id;

                            setTimeout(function () {
                                tinyMCE.init({
                                    selector: "#" + rteFieldID,
                                    toolbar: self.options.toolbar
                                });
                            }, 250); //There may be a better/more proper way to wait to be able to call tinymce, but calling it in a setTimeout seems to be reliable
                        }
                    }

                    callback();
                });
            },


            /* builder_helpers */

            /**
             * @see Alpaca.Fields.TextAreaField#getTitle
             */
            getTitle: function() {
                return "TinyMCE Editor";
            },

            /**
             * @see Alpaca.Fields.TextAreaField#getDescription
             */
            getDescription: function() {
                return "Provides an instance of a TinyMCE control for use in editing HTML.";
            },

            /**
             * @private
             * @see Alpaca.ControlField#getSchemaOfOptions
             */
            getSchemaOfOptions: function() {
                return Alpaca.merge(this.base(), {
                    "properties": {
                        "toolbar": {
                            "title": "TinyMCE toolbar options",
                            "description": "Toolbar options for TinyMCE plugin.",
                            "type": "string"
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
                        "toolbar": {
                            "type": "text"
                        }
                    }
                });
            }

            /* end_builder_helpers */
        });

    Alpaca.registerFieldClass("tinymce", Alpaca.Fields.TinyMCEField);

})(jQuery);