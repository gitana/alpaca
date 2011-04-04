(function($) {

    var Alpaca = $.alpaca;

    /**
     * View class
     */
    Alpaca.View = Base.extend({

        constructor: function(view, field) {
            this.field = field;
            this.setView(view);
        },

        /**
         *
         * @param view
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
         *
         */
        getWizard : function () {
            return this.getViewParam("wizard");
        },

        /**
         *
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
         *
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
         *
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
                    Alpaca.mergeWithNullChecking(styles, parents[i].styles);
                }
                if (this.field.path && parents[i].fields && parents[i].fields[this.field.path] && parents[i].fields[this.field.path].styles) {
                    Alpaca.mergeWithNullChecking(styles, parents[i].fields[this.field.path].styles);
                }
            }
            return styles;
        },

        /**
         *
         * @param templateId
         */
        getTemplate : function (templateId) {
            return this.getViewParam(["templates",templateId]);
        },

        /**
         *
         * @param messageId
         */
        getMessage : function (messageId) {
            var messageForLocale = this.getViewParam(["messages",Alpaca.defaultLocale,messageId]);
            return Alpaca.isEmpty(messageForLocale) ? this.getViewParam(["messages",messageId]): messageForLocale;
        },

        /**
         * Retrieves view parameter based on configuration Id or Id array
         *
         * @param configId
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
         * @param configId
         * @param viewObject
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
         * @param configVal
         * @param configId
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