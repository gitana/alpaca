/*jshint -W004 */ // duplicate variables
(function($) {

    var Alpaca = $.alpaca;

    Alpaca.RuntimeView = Base.extend(
    /**
     * @lends Alpaca.RuntimeView.prototype
     */
    {
        /**
         * Runtime implementation of a view as applied to a field.
         *
         * This provides accessors into the nested behaviors of views and also takes into account field-level attributes
         * of the currently rendering dom element.
         *
         * @constructs
         *
         * @class Class for managing view components such as layout, template, message etc.
         *
         * @param {String} the view id
         * @param {Object} field the field control
         */
        constructor: function(viewId, field) {
            this.field = field;
            this.setView(viewId);
        },

        /**
         * Sets the view that this runtime view adapters should consult during render.
         *
         * @param {String} the view id
         */
        setView: function (viewId)
        {
            // TODO: should field classes ever really be instantiated directly?
            // TODO: this is left in to support Alpaca docs generation (need to clean this up)s
            // if a view is not set at this point it probably means they instantiated a field directly
            // in which case, we'll just pick the default view
            if (!viewId)
            {
                viewId =  "web-edit";
            }

            // the normalized view
            var normalizedView = Alpaca.getNormalizedView(viewId);
            if (!normalizedView)
            {
                // this should never be the case
                throw new Error("Runtime view for view id: " + viewId + " could not find a normalized view");
            }

            // copy compiled properties into this object
            for (var k in normalizedView)
            {
                if (normalizedView.hasOwnProperty(k)) {
                    this[k] = normalizedView[k];
                }
            }
        },

        /**
         * Gets view wizard settings.
         *
         * @returns {Object} View wizard settings.
         */
        getWizard : function () {
            return this.getViewParam("wizard");
        },

        /**
         * Gets the global layout template.
         *
         * @returns {Object|String} Global layout template setting of the view.
         */
        getGlobalTemplateDescriptor : function ()
        {
            return this.getTemplateDescriptor("globalTemplate");
        },

        /**
         * Gets layout template and bindings.
         *
         * @returns {Object} Layout template and bindings setting of the view.
         */
        getLayout: function ()
        {
            var self = this;

            return {
                "templateDescriptor": this.getTemplateDescriptor("layoutTemplate", self),
                "bindings": this.getViewParam(["layout","bindings"], true)
            };
        },

        /**
         * Hands back the compiled template id for a given template.
         *
         * @param templateId
         * @param field (optional)
         */
        getTemplateDescriptor: function(templateId, field)
        {
            return Alpaca.getTemplateDescriptor(this, templateId, field);
        },

        /**
         * Gets message for the given id
         *
         * @param {String} messageId Message id
         * @param {String} locale locale
         *
         * @returns {String} Message mapped to the given id.
         */
        getMessage : function (messageId, locale)
        {
            if (!locale) {
                locale = Alpaca.defaultLocale;
            }

            var messageForLocale = this.getViewParam(["messages", locale, messageId]);
            if (Alpaca.isEmpty(messageForLocale)) {
                messageForLocale = this.getViewParam(["messages", messageId]);
            }

            return messageForLocale;
        },

        /**
         * Retrieves view parameter based on configuration Id or Id array.
         *
         * @param {String|Array} configId Configuration id or array.
         *
         * @returns {Any} View parameter mapped to configuration Id or Id array.
         */
        getViewParam: function (configId, topLevelOnly) {

            var self = this;

            // look for exact match
            var fieldPath = this.field.path;
            if (this.fields && this.fields[fieldPath]) {
                var configVal = this._getConfigVal(this.fields[fieldPath], configId);
                if (!Alpaca.isEmpty(configVal)) {
                    return configVal;
                }
            }

            // array related field path (using [*] syntax)  i.e.  /a/b[*]/c/d[*]/e
            if (fieldPath && fieldPath.indexOf('[') !== -1 && fieldPath.indexOf(']') !== -1) {
                var newFieldPath = fieldPath.replace(/\[\d+\]/g,"[*]");
                if (this.fields && this.fields[newFieldPath]) {
                    var configVal = this._getConfigVal(this.fields[newFieldPath], configId);
                    if (!Alpaca.isEmpty(configVal)) {
                        return configVal;
                    }
                }
            }

            // array related field path (using pure path syntax)   i.e. /a/b/c/d/e
            if (fieldPath && fieldPath.indexOf('[') !== -1 && fieldPath.indexOf(']') !== -1) {
                var newFieldPath = fieldPath.replace(/\[\d+\]/g,"");
                if (this.fields && this.fields[newFieldPath]) {
                    var configVal = this._getConfigVal(this.fields[newFieldPath], configId);
                    if (!Alpaca.isEmpty(configVal)) {
                        return configVal;
                    }
                }
            }

            if (!Alpaca.isEmpty(topLevelOnly) && topLevelOnly && this.field.path !== "/") {
                return null;
            }

            return this._getConfigVal(this, configId);
        },

        /**
         * Internal method for getting configuration.
         *
         * @private
         *
         * @param {Any} configVal configuration value.
         * @param {String} configId configuration id.
         *
         * @returns {Any} configuration mapping to the given id
         */
        _getConfigVal : function (configVal, configId) {
            if (Alpaca.isArray(configId)) {
                for (var i = 0; i < configId.length && !Alpaca.isEmpty(configVal); i++) {
                    configVal = configVal[configId[i]];
                }
            } else {
                if (!Alpaca.isEmpty(configVal)) {
                    configVal = configVal[configId];
                }
            }
            return configVal;
        },

        fireCallback: function(field, id, arg1, arg2, arg3, arg4, arg5)
        {
            var self = this;

            if (this.callbacks && this.callbacks[id])
            {
                this.callbacks[id].call(field, arg1, arg2, arg3, arg4, arg5);
            }
        },

        applyStyle: function(id, fieldOrEl)
        {
            var el = fieldOrEl;
            if (el && el.getFieldEl) {
                el = el.getFieldEl();
            }

            if (el)
            {
                if (this.styles && this.styles[id])
                {
                    $(el).addClass(this.styles[id]);
                }
            }
        },

        getStyle: function(id)
        {
            return this.styles[id] ? this.styles[id] : "";
        }


    });
})(jQuery);
