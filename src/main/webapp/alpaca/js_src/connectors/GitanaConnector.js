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
            this.gitanaNodes = {};
            this.gitanaContext = configs.gitanaContext;
        },

        /**
         * @see Alpaca.Connector#connect
         */
        connect: function (onSuccess, onError) {
            this.base(onSuccess, onError);
        },

        /**
         * @see Alpaca.Connector#saveData
         */
        saveData : function (dataSource, onSuccess, onError) {
            var _this = this;
            var data = dataSource.data;

            var errorCallback = function (loadError) {
                // Handle ticket expiration.
                if (_this.isInvalidTicketError(loadError)) {
                    _this.gitanaContext.init().then(function() {
                        _this.saveData(dataSource, onSuccess, onError);
                    });
                } else {
                    // Other errors
                    if (onError && Alpaca.isFunction(onError)) {
                        onError({
                            "message":"Gitana Connector Error : " + loadError.message,
                            "reason": "GITANA_SAVE_ERROR",
                            "details": {
                                "error" : loadError
                            }
                        });
                    }
                }
            };

            var dataNode = this.getGitanaNode(data);
            if (!Alpaca.isEmpty(dataNode)) {
                // Update
                Alpaca.mergeObject(dataNode.object, data);
                dataNode.trap(function(saveError) {
                    errorCallback(saveError);
                }).update().reload().then(function() {
                    _this.gitanaNodes[dataNode.getId()] = this;
                    dataSource.data = this.object;
                    if (onSuccess) {
                        onSuccess(this.object);
                    }
                });
            } else {
                var schema = dataSource.schema;
                if (!Alpaca.isEmpty(schema) && !Alpaca.isEmpty(schema._qname)) {
                    data._type = schema._qname;
                }
                // Create
                this.gitanaContext.then(function() {
                    this.branch().trap(function(createError) {
                        errorCallback(createError);
                    }).createNode(data).then(function() {
                        _this.gitanaNodes[dataNode.getId()] = this;
                        dataSource.data = this.object;
                        if (onSuccess) {
                            onSuccess(this.object);
                        }
                    });
                });
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
                this.gitanaContext.then(function() {
                    this.branch().trap(function(loadedError) {
                        errorCallback(loadedError);
                    }).readNode(data).then(function() {
                        _this.gitanaNodes[this.getId()] = this;
                        dataSource.data = this.object;
                       dataSource.data.attachments = {};
                        this.listAttachments().each(function() {
                            dataSource.data.attachments[this.getId()] = this.getDownloadUri();
                        }).then(function(){
                            successCallback(dataSource);
                        });
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
                    errorCallback(error);
                });
            }
        },

        /**
         * @see Alpaca.Connector#loadOptions
         */
        loadOptions : function (dataSource, successCallback, errorCallback) {
            var _this = this;
            var base = this.base;
            var schema = dataSource.schemaNode;
            var options = dataSource.options;
            var branch = this.branch;

            var isValidOptions = function () {
                return !Alpaca.isEmpty(schema) && !Alpaca.isEmpty(options) && Alpaca.isString(options) && !Alpaca.isUri(options);
            };
            if (isValidOptions()) {
                if (schema) {
                    schema.trap(function(loadedError) {
                        errorCallback(loadedError);
                    }).readForm(options).then(function() {
                        dataSource.optionsNode = this;
                        dataSource.options = this.object;
                        _this.gitanaNodes[this.getId()] = this;
                        _this.loadView(dataSource, successCallback, errorCallback);
                    });
                } else {
                    base(dataSource, function(dataSource) {
                        _this.loadView(dataSource, successCallback, errorCallback);
                    }, function(error) {
                        errorCallback(error);
                    });
                }
            } else {
                this.base(dataSource, function(dataSource) {
                    _this.loadView(dataSource, successCallback, errorCallback);
                }, function(error) {
                    errorCallback(error);
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
                this.gitanaContext.then(function() {
                    this.branch().trap( function(loadedError) {
                        errorCallback(loadedError);
                    }).readDefinition(schema).then(function() {
                        dataSource.schemaNode = this;
                        dataSource.schema = this.object;
                        _this.gitanaNodes[this.getId()] = this;
                        _this.loadOptions(dataSource, successCallback, errorCallback);
                    });
                });
            } else {
                this.base(dataSource, function(dataSource) {
                    _this.loadOptions(dataSource, successCallback, errorCallback);
                }, function(error) {
                    errorCallback(error);
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
                // Handle ticket expiration.
                if (_this.isInvalidTicketError(loadError)) {
                    _this.gitanaContext.init().then(function() {
                        _this.loadAll(dataSource, onSuccess, onError);
                    });
                } else {
                    // Other errors
                    if (onError && Alpaca.isFunction(onError)) {
                        onError({
                            "message":"Gitana Connector Error : " + loadError.message,
                            "reason": "GITANA_LOAD_ERROR",
                            "details": {
                                "error" : loadError
                            }
                        });
                    }
                }
            };
            this.loadSchema(dataSource, successCallback, errorCallback);
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
        },

        /**
         * Finds if an error is INVALID_TICKET error.
         *
         * @param {Object} err0r The error to be evaluated.
         * @returns {Boolean} True if the  error is INVALID_TICKET error, false otherwise.
         */
        isInvalidTicketError: function (error) {
            return error.http && error.http.status && error.http.status == 403 && error.http.reason == 'INVALID_TICKET';
        },

        /**
         * Returns loaded Gitana node based on its ID.
         *
         * @param data Data source that contains node ID.
         * @returns {Object} Gitana node that mapped to the given ID.
         */
        getGitanaNode: function (data) {
          if (this.gitanaNodes && data && this.gitanaNodes[data._doc]) {
              return this.gitanaNodes[data._doc];
          }
        }
    });

    Alpaca.registerConnectorClass("gitana", Alpaca.Connectors.GitanaConnector);

})(jQuery);