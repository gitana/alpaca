(function($) {

    var Alpaca = $.alpaca;

    /**
     * Gitana Connector
     *
     *  {
     *   "data": [data_key],
     *   "schema": gitana:repository:branch,
     *   "options": [form_key],
     *   "view": [view_key]
     *  }
     *
     */
    Alpaca.Connectors.GitanaConnector = Alpaca.Connector.extend({

        constructor: function(id, configs) {
            this.base(id, configs);
            this.namespace = "gitana";
        },

        /**
         *
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
         *
         * @param dataSource
         */
        processDataSource: function (dataSource) {
            // options
            for (var key in dataSource) {
                if (this.isConnectorFormat(dataSource[key])) {
                    dataSource[key] = Alpaca.replaceAll(dataSource[key], this.namespace + ":", '');
                }
            }
            return dataSource;
        },

        /**
         *
         * @param dataSource
         * @param onSuccess
         * @param onError
         */
        loadAll : function (dataSource, onSuccess, onError) {
            var _this = this;
            dataSource = this.processDataSource(dataSource);
            var loadCounter = 0;
            var data = dataSource.data;
            var options = dataSource.options;
            var schema = dataSource.schema;
            var view = dataSource.view;

            var successCallback = function (data, options, schema, view) {
                loadCounter ++;
                if (loadCounter == 3/*4*/) {
                    if (onSuccess && Alpaca.isFunction(onSuccess)) {
                        onSuccess(data, options, schema, view);
                    }
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

                    branch.definitions().read(schema, function(schemaNode) {
                        schema = schemaNode;
                        loadCounter ++;
                        schema.forms().read(options, function(formNode) {
                            options = formNode;
                            successCallback(data, options, schema, view);
                        }, errorCallback);
                    });

                    if (data) {
                        if (_this.isConnectorFormat(data)) {
                            data = Alpaca.replaceAll(data, _this.namespace + ":", '');
                            _this.getBranch().nodes().read(data, function(contentNode) {
                                data = contentNode;
                                successCallback(data, options, schema, view);
                            }, errorCallback);

                        } else {
                            if (Alpaca.isUri(data)) {
                                this.loadJson(data, function(loadedData) {
                                    data = loadedData;
                                    successCallback(data, options, schema, view);
                                }, errorCallback);
                            } else {
                                successCallback(data, options, schema, view);
                            }
                        }
                    } else {
                        successCallback(data, options, schema, view);
                    }

                }, function(error) {

                })
            }, function(error) {

            });
        }
        ,

        /**
         *
         * @param callback
         */
        load : function (dataSource, onSuccess, onError) {
            var key = dataSource.key;
            if (key && this.prefixMappings[key]) {
                if (this.isConnectorFormat(dataSource.dataSource)) {
                    dataSource.dataSource = this.prefixMappings[key] + "/" + Alpaca.replaceAll(dataSource.dataSource, this.namespace + ":", '') + this.postfixMappings[key];
                }
            }
            this.base(dataSource, onSuccess, onError);
        }
    });

    Alpaca.registerConnectorClass("gitana", Alpaca.Connectors.GitanaConnector);

})(jQuery);