(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Connectors.SimpleConnector = Alpaca.Connector.extend(
    /**
     * @lends Alpaca.Connectors.SimpleConnector.prototype
     */
    {
        /**
         * @constructs
         * @augments Alpaca.Connector
         *
         * @class Simple Connector that loads files from local web server directories.
         * <p>
         * Files are placed and named according to following conventions:
         * </p>
         * <p>
         * root -- Root directory<br/>
         *  |<br/>
         *  |---- schema    [schema_key].json (e.g. profile.json)<br/>
         *  |<br/>
         *  |---- forms     [schema_key]-[form_key].json (e.g. profile-simple.json)<br/>
         *  |<br/>
         *  |---- views     [view_key].json (e.g. mobile.json)<br/>
         *  |<br/>
         *  |---- templates [template_key].tmpl (e.g. two_column.tmpl)<br/>
         *  |<br/>
         *  |---- data      [data_key].json (e.g. taylor_swift.json)<br/>
         *
         * </p>
         * <p>
         * The connector takes a single configuration variable, root, for root folder.
         * The default value for the root folder is "/".
         * </p>
         *
         * <p>
         * The dataSource parameters for load/save methods take following format:
         * </p>
         * <code>
         *     <pre>
         * {
         *   "data": [data_key],
         *   "schema": [schema_key],
         *   "options": [form_key],
         *   "view": [view_key]
         *  }
         *
         * e.g.
         *
         *  {
         *   "data": "taylor_swift",
         *   "schema": "profile",
         *   "options": "profile-simple",
         *   "view": "mobile"
         *  }
         *  </pre>
         *</code>
         * @param {String} id Connector ID.
         * @param {Object} configs Connector Configurations.
         */
        constructor: function(id, configs) {
            this.base(id, configs);
            this.root = this.configs.root ? this.configs.root : "/";
            if (!Alpaca.endsWith(this.root, "/")) {
                this.root = this.root + "/";
            }
            this.prefixMappings = {
                "data": this.root + "data",
                "schema": this.root + "schema",
                "options": this.root + "forms",
                "view": this.root + "views",
                "template": this.root + "templates"
            };

            this.postfixMappings = {
                "data": ".json",
                "schema": ".json",
                "options":".json",
                "view": ".json",
                "template": ".tmpl"
            };
        },

        /**
         * @see Alpaca.Connector#connect
         */
        connect: function (onSuccess, onError) {
            this.base(onSuccess, onError);
        },

        /**
         * @see Alpaca.Connector#loadData
         */
        loadData : function (dataSource, successCallback, errorCallback) {
            var _this = this;
            var base = this.base;
            var data = dataSource.data;
            var isValidData = function () {
                return !Alpaca.isEmpty(data) && Alpaca.isString(data) && !Alpaca.isUri(data);
            };

            if (isValidData()) {
                var tmp = this.prefixMappings["data"] + "/" + data + this.postfixMappings["data"];
                this.loadUri(tmp, true, function(loadedData) {
                    dataSource.data = loadedData;
                    successCallback(dataSource);
                }, function(loadedError) {
                    base(dataSource, function(dataSource) {
                        successCallback(dataSource);
                    }, function(error) {
                        errorCallback(error);
                    });
                });
            } else {
                this.base(dataSource, function(dataSource) {
                    successCallback(dataSource);
                }, function(error) {
                    errorCallback(error);
                });
            }
        },

        /**
         * @see Alpaca.Connector#loadView
         */
        loadView : function (dataSource, successCallback, errorCallback) {
            var _this = this;
            var base = this.base;
            var view = dataSource.view;
            var isValidView = function () {
                return !Alpaca.isEmpty(view) && Alpaca.isString(view) && !Alpaca.isUri(view) && !Alpaca.isValidViewId(view);
            };
            if (isValidView()) {
                var tmp = this.prefixMappings["view"] + "/" + this.originalDataSource.schema + "-" + this.originalDataSource.options + "-" + view + this.postfixMappings["view"];
                this.loadUri(tmp, true, function(loadedView) {
                    dataSource.view = loadedView;
                    _this.loadData(dataSource, successCallback, errorCallback);
                }, function(loadedError) {
                    base(dataSource, function(dataSource) {
                        _this.loadData(dataSource, successCallback, errorCallback);
                    }, function(error) {
                        _this.loadData(dataSource, successCallback, errorCallback);
                    });
                });
            } else {
                this.base(dataSource, function(dataSource) {
                    _this.loadData(dataSource, successCallback, errorCallback);
                }, function(error) {
                    _this.loadData(dataSource, successCallback, errorCallback);
                });
            }
        },

        /**
         * @see Alpaca.Connector#loadOptions
         */
        loadOptions : function (dataSource, successCallback, errorCallback) {
            var _this = this;
            var base = this.base;
            var options = dataSource.options;
            var isValidOptions = function () {
                return !Alpaca.isEmpty(options) && Alpaca.isString(options) && !Alpaca.isUri(options);
            };
            if (isValidOptions()) {
                var tmp = this.prefixMappings["options"] + "/" + this.originalDataSource.schema + "-" + options + this.postfixMappings["options"];
                this.loadUri(tmp, true, function(loadedOptions) {
                    dataSource.options = loadedOptions;
                    _this.loadView(dataSource, successCallback, errorCallback);
                }, function(loadedError) {
                    base(dataSource, function(dataSource) {
                        _this.loadView(dataSource, successCallback, errorCallback);
                    }, function(error) {
                        _this.loadView(dataSource, successCallback, errorCallback);
                    });
                });
            } else {
                this.base(dataSource, function(dataSource) {
                    _this.loadView(dataSource, successCallback, errorCallback);
                }, function(error) {
                    _this.loadView(dataSource, successCallback, errorCallback);
                });
            }
        },

        /**
         * @see Alpaca.Connector#loadSchema
         */
        loadSchema : function (dataSource, successCallback, errorCallback) {
            var _this = this;
            var base = this.base;
            var schema = dataSource.schema;
            var isValidSchema = function () {
                return !Alpaca.isEmpty(schema) && Alpaca.isString(schema) && !Alpaca.isUri(schema);
            };
            if (isValidSchema()) {
                var tmp = this.prefixMappings["schema"] + "/" + schema + this.postfixMappings["schema"];
                this.loadUri(tmp, true, function(loadedSchema) {
                    dataSource.schema = loadedSchema;
                    _this.loadOptions(dataSource, successCallback, errorCallback);
                }, function(loadedError) {
                    base(dataSource, function(dataSource) {
                        _this.loadOptions(dataSource, successCallback, errorCallback);
                    }, function(error) {
                        _this.loadOptions(dataSource, successCallback, errorCallback);
                    });
                });
            } else {
                this.base(dataSource, function(dataSource) {
                    _this.loadOptions(dataSource, successCallback, errorCallback);
                }, function(error) {
                    _this.loadOptions(dataSource, successCallback, errorCallback);
                });
            }
        },

        /**
         * @see Alpaca.Connector#loadAll
         */
        loadAll : function (dataSource, onSuccess, onError) {
            var loadCounter = 0;
            var data = dataSource.data;
            var options = dataSource.options;
            var schema = dataSource.schema;
            var view = dataSource.view;
            this.originalDataSource = Alpaca.cloneObject(dataSource);

            var successCallback = function (dataSource) {
                if (onSuccess && Alpaca.isFunction(onSuccess)) {
                    onSuccess(dataSource.data, dataSource.options, dataSource.schema, dataSource.view);
                }
            };

            var errorCallback = function (loadError) {
                if (onError && Alpaca.isFunction(onError)) {
                    onError(loadError);
                }
            };

            this.loadSchema(dataSource, successCallback, errorCallback);
        },

        /**
         * @see Alpaca.Connector#loadTemplate
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