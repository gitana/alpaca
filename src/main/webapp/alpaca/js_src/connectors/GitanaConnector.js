(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Connectors.GitanaConnector = Alpaca.Connector.extend(
    /**
     * @lends Alpaca.Connectors.GitanaConnector.prototype
     */
    {
        /**
         * @constructs
         * @augments Alpaca.Connector
         *
         * @class Connector that loads JSONs from or stores data to a remote Gitana repository though Gitana JavaScript
         * driver APIs.
         *<p>
         * The dataSource parameters for load/save methods take following format
         *</p>
         *<code>
         *     <pre>
         *  {
         *   "data": [Gitana ID | Gitana QName Reference],
         *   "schema": [Gitana ID | Gitana QName Reference],
         *   "options": [Gitana Form Key],
         *   "view": [Gitana View Key]
         *  }
         *  </pre>
         *</code>
         * @param {String} id Connector ID.
         * @param {Object} configs Connector Configurations.
         */
        constructor: function(id, configs) {
            this.base(id, configs);
        },

        /**
         * @see Alpaca.Connector#connect
         */
        connect: function (onSuccess, onError) {
            var _this = this;
            this.userName = this.configs.userName;
            this.password = this.configs.password;

            this.repositoryId = this.configs.repositoryId;
            this.branchId = this.configs.branchId ? this.configs.branchId : "master";

            this.gitanaDriver = new Gitana.Driver();

            this.gitanaDriver.security().authenticate(this.userName, this.password, function(success) {
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
         * @see Alpaca.Connector#saveData
         */
        saveData : function (dataSource, successCallback, errorCallback) {
            var _this = this;
            var data = dataSource.data;
            var schema = dataSource.schema;
            if (!Alpaca.isEmpty(data) && !Alpaca.isEmpty(data._doc)) {
                // Update
                data.update(function(status) {
                    var nodeId = status.getId();
                    _this.branch.nodes().read(nodeId, successCallback);
                }, function(saveError) {
                    errorCallback(saveError);
                });
            } else {
                if (!Alpaca.isEmpty(schema) && !Alpaca.isEmpty(schema._qname)) {
                    data._type = schema._qname;
                    // Create
                    this.branch.nodes().create(data, function(status) {
                        var nodeId = status.getId();
                        _this.branch.nodes().read(nodeId, successCallback);
                    }, function(saveError) {
                        errorCallback(saveError);
                    });
                }
            }

        },

        /**
         * @see Alpaca.Connector#loadData
         */
        loadData : function (dataSource, successCallback, errorCallback) {
            var _this = this;
            var base = this.base;
            var data = dataSource.data;
            var branch = this.branch;

            var isValidData = function () {
                return !Alpaca.isEmpty(data) && Alpaca.isString(data) && !Alpaca.isUri(data)
                        && (_this.isValidGitanaId(data) || _this.isValidQName(data));
            };

            if (isValidData()) {
                branch.nodes().read(data, function(loadedData) {
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
            var branch = this.branch;

            var isValidView = function () {
                return !Alpaca.isEmpty(view) && Alpaca.isString(view) && !Alpaca.isUri(view) && !Alpaca.isValidViewId(view);
            };
            if (isValidView()) {
                //TODO: need to add view handling piece
                this.loadData(dataSource, successCallback, errorCallback);
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
            var schema = dataSource.schema;
            var options = dataSource.options;
            var branch = this.branch;

            var isValidOptions = function () {
                return !Alpaca.isEmpty(options) && Alpaca.isString(options) && !Alpaca.isUri(options);
            };
            if (isValidOptions()) {
                schema.forms().read(options, function(loadedOptions) {
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
            var branch = this.branch;
            var isValidSchema = function () {
                return !Alpaca.isEmpty(schema) && Alpaca.isString(schema) && !Alpaca.isUri(schema)
                        && (_this.isValidGitanaId(schema) || _this.isValidQName(schema));
            };
            if (isValidSchema()) {
                branch.definitions().read(schema, function(loadedSchema) {
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
            var _this = this;

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

            this.gitanaDriver.repositories().read(this.repositoryId, function(repository) {
                _this.repository = repository;
                repository.branches().read(_this.branchId, function(branch) {
                    _this.branch = branch;
                    _this.loadSchema(dataSource, successCallback, errorCallback);
                }, function(error) {
                    errorCallback(error);
                })
            }, function(error) {
                errorCallback(error);
            });
        },

        /**
         * @see Alpaca.Connector#loadTemplate
         */
        loadTemplate : function (dataSource, onSuccess, onError) {
            this.base(dataSource, onSuccess, onError);
        },

        /**
         * Finds if a variable is a valid Gitana QName.
         *
         * @param {String} data The variable to be evaluated.
         * @returns {Boolean} True if the variable is a valid Gitana QName, false otherwise.
         */
        isValidQName: function (data) {
            return !Alpaca.isEmpty(data) && Alpaca.isString(data) && data.match(/^[0-9a-zA-Z-_]+:[0-9a-zA-Z-_]+$/);
        },

        /**
         * Finds if a variable is a valid Gitana ID.
         *
         * @param {String} data The variable to be evaluated.
         * @returns {Boolean} True if the variable is a valid Gitana ID, false otherwise.
         */
        isValidGitanaId: function (data) {
            return !Alpaca.isEmpty(data) && Alpaca.isString(data) && data.match(/^[0-9a-z]{32}$/);
        }
    });

    Alpaca.registerConnectorClass("gitana", Alpaca.Connectors.GitanaConnector);

})(jQuery);