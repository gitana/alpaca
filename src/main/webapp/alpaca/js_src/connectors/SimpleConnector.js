(function($) {

    var Alpaca = $.alpaca;

    /**
     * Simple Local File System Connector that loads files from local file systems.
     *
     * Files are placed and named according to following conventions
     *
     * root
     *  |
     *  |---- schema    [schema_key].json (e.g. profile.json)
     *  |
     *  |---- forms     [schema_key]-[form_key].json (e.g. profile-simple.json)
     *  |
     *  |---- views     [view_key].json (e.g. mobile.json)
     *  |
     *  |---- templates [template_key].tmpl (e.g. two_column.tmpl)
     *  |
     *  |---- data      [data_key].json (e.g. taylor_swift.json)
     *
     * The connector takes a single configuration variable, root, for root folder.
     * The default value for root folder is "/".
     *
     *
     * The loadAll method is for loading schema, form, view and data in a single call.
     * Its dataSource parameter should have following format
     *
     *  {
     *   "data": [data_key],
     *   "schema": [schema_key],
     *   "options": [form_key],
     *   "view": [view_key]
     *  }
     *
     *  e.g.
     *
     *  {
     *   "data": "taylor_swift",
     *   "schema": "profile",
     *   "options": "profile-simple",
     *   "view": "mobile"
     *  }
     *
     *
     * The load method is for loading single item such as schema, form, view , data or template.
     * Its dataSource parameter should have following format
     *
     *  {
     *   "key":"data|schema|options|view|template",
     *   "dataSource":dataSource,
     *   "isJson":true|false
     *  }
     *
     *  e.g.
     *
     *  {
     *      "key": template,
     *      "dataSource" : "two_column"
     *  }
     *
     */
    Alpaca.Connectors.SimpleConnector = Alpaca.Connector.extend({

        constructor: function(id, configs) {
            this.base(id, configs);
        },

        /**
         *
         */
        connect: function (onSuccess, onError) {
            var _this = this;
            this.root = this.configs.root ? this.configs.root : "/";
            if (!Alpaca.endsWith(this.root, "/")) {
                this.root = this.root + "/";
            }
            // TODO: It might not be a good idea to check root?
            // Test the root availability
            this.loadUri(this.root, false, function(success) {

                _this.prefixMappings = {
                    "data": _this.root + "data",
                    "schema": _this.root + "schema",
                    "options": _this.root + "forms",
                    "view": _this.root + "views",
                    "template": _this.root + "templates"
                };

                _this.postfixMappings = {
                    "data": ".json",
                    "schema": ".json",
                    "options":".json",
                    "view": ".json",
                    "template": ".tmpl"
                };

                if (onSuccess && Alpaca.isFunction(onSuccess)) {
                    onSuccess(success);
                }
            }, function(error) {
                if (onError && Alpaca.isFunction(onError)) {
                    onError(error);
                }
            });
        },

        /**
         *
         * @param dataSource
         * @param onSuccess
         * @param onError
         */
        loadAll : function (dataSource, onSuccess, onError) {

            var _this = this;
            var schema = dataSource.schema;
            var options = dataSource.options;
            var view = dataSource.view;
            var data = dataSource.data;

            var base = this.base;


            var processView = function () {
                if (view && Alpaca.isString(view) && !Alpaca.isUri(view) && !Alpaca.isValidViewId(view)) {
                    var tmp = _this.prefixMappings["view"] + "/" + schema + "-" + options + "-" + view + _this.postfixMappings["view"];
                    _this.loadUri(tmp, true, function(loadedView) {
                        dataSource.view = loadedView;
                        base(dataSource, onSuccess, onError);
                    }, function(loadedError) {
                        base(dataSource, onSuccess, onError);
                    })
                } else {
                    _this.base(dataSource, onSuccess, onError);
                }
            };

            var processOptions = function () {
                if (options && Alpaca.isString(options) && !Alpaca.isUri(options)) {
                    var tmp = _this.prefixMappings["options"] + "/" + schema + "-" + options + _this.postfixMappings["options"];
                    _this.loadUri(tmp, true, function(loadedOptions) {
                        dataSource.options = loadedOptions;
                        processView();
                    }, function(loadedError) {
                        base(dataSource, onSuccess, onError);
                    })
                } else {
                    base(dataSource, onSuccess, onError);
                }
            };

            var processSchema = function () {
                if (schema && Alpaca.isString(schema) && !Alpaca.isUri(schema)) {
                    var tmp = _this.prefixMappings["schema"] + "/" + schema + _this.postfixMappings["schema"];
                    _this.loadUri(tmp, true, function(loadedSchema) {
                        dataSource.schema = loadedSchema;
                        processOptions();
                    }, function(loadedError) {
                        base(dataSource, onSuccess, onError);
                    })
                } else {
                    base(dataSource, onSuccess, onError);
                }
            };

            var processData = function () {
                if (data && Alpaca.isString(data)) {
                    var tmp = _this.prefixMappings["data"] + "/" + data + _this.postfixMappings["schema"];
                    _this.loadUri(tmp, true, function(loadedData) {
                        dataSource.data = loadedData;
                        processSchema();
                    }, function(loadedError) {
                        processSchema();
                    });
                } else {
                    processSchema();
                }
            };

            processData();
        },

        /**
         *
         * @param callback
         */
        loadTemplate : function (dataSource, onSuccess, onError) {

            var _this = this;
            var base = this.base;

            if (Alpaca.isString(dataSource) && !Alpaca.isUri(dataSource)
                    && !Alpaca.isValidViewId(dataSource) && dataSource.match(/^[a-zA-Z0-9_\s-]+$/)) {
                var tmp = dataSource = this.prefixMappings["template"] + "/" + dataSource + this.postfixMappings["template"];
                _this.loadUri(tmp, false, function(loadedTemplate) {
                    dataSource = loadedTemplate;
                    base(dataSource, onSuccess, onError);
                }, function(loadedError) {
                    base(dataSource, onSuccess, onError);
                })
            } else {
                base(dataSource, onSuccess, onError);
            }
        }
    });

    Alpaca.registerConnectorClass("simple", Alpaca.Connectors.SimpleConnector);

})(jQuery);