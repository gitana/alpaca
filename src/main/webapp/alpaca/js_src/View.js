(function($) {

    var Alpaca = $.alpaca;

    Alpaca.View = Base.extend(
    /**
     * @lends Alpaca.View.prototype
     */
    {
        /**
         * @constructs
         *
         * @class Class for managing view components such as layout, template, message etc.
         *
         * @param {Object} filed Field control.
         * @param {Object|String} view Field view.
         */
        constructor: function(view, field) {
            this.field = field;
            this.setView(view);
        },

        /**
         * Sets field control.
         *
         * @param {Object|String} view View to be set.
         */
        setView : function (view) {

            this.viewObject = Alpaca.isObject(view) ? view : Alpaca.getView(view);

            //TODO: need to rethink about it
            if (Alpaca.isObject(view) && Alpaca.isEmpty(this.viewObject.parent) && Alpaca.isEmpty(this.viewObject.id)/*this.viewObject.id != Alpaca.defaultView*/) {
                this.viewObject.parent = Alpaca.defaultView;
                if (this.getGlobalTemplate()) {
                   this.viewObject.parent = 'VIEW::WEB_DISPLAY';
                }
            }

            this.id = this.viewObject.id;
            this.parent = this.viewObject.parent;

            this.type = this.getViewParam("type");
            this.displayReadonly = this.getViewParam("displayReadonly");
            this.platform = this.getViewParam("platform");
            this.device = this.getViewParam("device");
            this.render = this.getViewParam("render");
            this.postRender = this.getViewParam("postRender");
            this.collapsible = this.getViewParam("collapsible");
            this.legendStyle = this.getViewParam("legendStyle");
            this.toolbarStyle = this.getViewParam("toolbarStyle");
            this.buttonStyle = this.getViewParam("buttonStyle");
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
         * Gets global template.
         *
         * @returns {Object|String} Global template setting of the view.
         */
        getGlobalTemplate : function () {
            var globalTemplate = this.getViewParam("globalTemplate");
            var tmp = this.getTemplate(globalTemplate);
            // Template reference
            if (!Alpaca.isEmpty(tmp)) {
                globalTemplate = tmp;
            }
            return globalTemplate;
        },

        /**
         * Gets layout template and bindings.
         *
         * @returns {Object} Layout template and bindings setting of the view.
         */
        getLayout : function () {
            var layoutTemplate = this.getViewParam(["layout","template"],true);
            var tmp = this.getTemplate(layoutTemplate);
            // Template reference
            if (!Alpaca.isEmpty(tmp)) {
                layoutTemplate = tmp;
            }
            return {
                "template" : layoutTemplate,
                "bindings" : this.getViewParam(["layout","bindings"],true)
            };
        },

        /**
         * Gets style injection lists.
         *
         * @returns {Object} styles style injection list settings of the view.
         */
        getStyles : function () {
            var parents = [];
            var tmp = this.viewObject;
            while (tmp) {
                parents.push(tmp)
                tmp = Alpaca.views[tmp.parent];
            }
            var styles = {};
            for (var i = parents.length - 1; i >= 0; i--) {
                if (parents[i].styles) {
                    Alpaca.mergeObject(styles, parents[i].styles);
                }
                if (this.field.path && parents[i].fields && parents[i].fields[this.field.path] && parents[i].fields[this.field.path].styles) {
                    Alpaca.mergeObject(styles, parents[i].fields[this.field.path].styles);
                }
            }
            return styles;
        },

        /**
         * Gets template for the given id.
         *
         * @param {String} templateId template id.
         *
         * @returns {Object|String} The template mapped to the given id.
         */
        getTemplate : function (templateId) {
            // add support for script wrapper tag
            var tmp = this.getViewParam(["templates",templateId]);
            if ($(tmp)[0] && $(tmp)[0].tagName.toLowerCase() == 'script' && $(tmp).attr('type') == 'text/x-jquery-tmpl') {
                tmp = $(tmp).html();
            }
            return tmp;
        },

        /**
         * Gets message for the given id.
         *
         * @param {String} messageId Message id.
         *
         * @returns {String} Message mapped to the given id.
         */
        getMessage : function (messageId) {
            var messageForLocale = this.getViewParam(["messages",Alpaca.defaultLocale,messageId]);
            return Alpaca.isEmpty(messageForLocale) ? this.getViewParam(["messages",messageId]): messageForLocale;
        },

        /**
         * Retrieves view parameter based on configuration Id or Id array.
         *
         * @param {String|Array} configId Configuration id or array.
         *
         * @returns {Any} View parameter mapped to configuration Id or Id array.
         */
        getViewParam : function (configId,topLevelOnly) {
            // Try the fields
            var fieldPath = this.field.path;
            if (this.viewObject.fields && this.viewObject.fields[fieldPath]) {
                var configVal = this._getConfigVal(this.viewObject.fields[fieldPath], configId);
                if (!Alpaca.isEmpty(configVal)) {
                    return configVal;
                }
            }

            if (!Alpaca.isEmpty(topLevelOnly) && topLevelOnly && this.field.path != "/") {
                return null;
            }
            return this._getViewParam(this.viewObject, configId)
        },

        /**
         * Internal method for retrieving view parameter
         *
         * @private
         * @param {String}configId Configuration id.
         * @param {Object|String}viewObject View object.
         *
         * @returns {Any} parameter view parameter mapping to given id of the given view object.
         */
        _getViewParam : function (viewObject, configId) {
            var configVal = this._getConfigVal(viewObject, configId);
            if (viewObject && !Alpaca.isEmpty(configVal)) {
                return configVal;
            } else {
                if (viewObject && viewObject.parent) {
                    return this._getViewParam(Alpaca.views[viewObject.parent], configId);
                } else {
                    return null;
                }
            }
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
                configVal = configVal[configId];
            }
            return configVal;
        }
    });
})(jQuery);