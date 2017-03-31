(function($) {

    var Alpaca = $.alpaca;

    Alpaca.CloudCmsConnector = Alpaca.Connector.extend(
    /**
     * @lends Alpaca.CloudCmsConnector.prototype
     */
    {
        /**
         * @constructs
         * @class Connects Alpaca to Cloud CMS

         * @param {String} id Connector ID
         * @param {Object} config Connector Config
         */
        constructor: function(id, config)
        {
            if (!config) {
                config = {};
            }

            // if we're not otherwise configured to use a cache, we default to a memory cache with a 5 minute TTL
            if (!config.cache) {
                config.cache = {
                    "type": "memory",
                    "config": {
                        "ttl": 1000 * 60 * 5 // five minutes
                    }
                };
            }

            this.base(id, config);
        },

        /**
         * Makes initial connections to data source.
         *
         * @param {Function} onSuccess onSuccess callback.
         * @param {Function} onError onError callback.
         */
        connect: function (onSuccess, onError)
        {
            var self = this;

            var cfn = function(err, branch)
            {
                if (err)
                {
                    onError(err);
                    return;
                }

                if (branch)
                {
                    self.branch = Chain(branch);

                    self.bindHelperFunctions(self.branch);
                }

                onSuccess();
            };

            if (Alpaca.globalContext && Alpaca.globalContext.branch)
            {
                cfn(null, Alpaca.globalContext.branch);
            }
            else
            {
                self.branch = null;

                self.doConnect(function (err, branch) {
                    cfn(err, branch);
                });
            }
        },

        doConnect: function(callback)
        {
            var self = this;

            if (!this.config.key) {
                this.config.key = "default";
            }

            Gitana.connect(this.config, function(err) {

                if (err) {
                    callback(err);
                    return;
                }

                if (this.getDriver().getOriginalConfiguration().loadAppHelper)
                {
                    this.datastore("content").readBranch("master").then(function() {
                        callback(null, this);
                    });
                }
                else
                {
                    callback();
                }
            });
        },

        bindHelperFunctions: function(branch)
        {
            var self = this;

            if (!branch.loadAlpacaSchema)
            {
                branch.loadAlpacaSchema = function(schemaIdentifier, resources, callback)
                {
                    var cachedDocument = self.cache(schemaIdentifier);
                    if (cachedDocument) {
                        return callback.call(this, null, cachedDocument);
                    }

                    var uriFunction = function()
                    {
                        return branch.getUri() + "/alpaca/schema";
                    };

                    var params = {};
                    params["id"] = schemaIdentifier;

                    return this.chainGetResponse(this, uriFunction, params).then(function(response) {
                        self.cache(schemaIdentifier, response);
                        callback.call(this, null, response);
                    });
                };
            }

            if (!branch.loadAlpacaOptions)
            {
                branch.loadAlpacaOptions = function(optionsIdentifier, resources, callback)
                {
                    var cachedDocument = self.cache(optionsIdentifier);
                    if (cachedDocument) {
                        return callback.call(this, null, cachedDocument);
                    }

                    var uriFunction = function()
                    {
                        return branch.getUri() + "/alpaca/options";
                    };

                    var params = {};
                    params["schemaId"] = resources.schemaSource;
                    params["id"] = optionsIdentifier;

                    return this.chainGetResponse(this, uriFunction, params).then(function(response) {
                        self.cache(optionsIdentifier, response);
                        callback.call(this, null, response);
                    });
                };
            }

            if (!branch.loadAlpacaData)
            {
                branch.loadAlpacaData = function(dataIdentifier, resources, callback)
                {
                    var uriFunction = function()
                    {
                        return branch.getUri() + "/alpaca/data";
                    };

                    var params = {};
                    params["id"] = dataIdentifier;

                    return this.chainGetResponse(this, uriFunction, params).then(function(response) {
                        callback.call(this, null, response);
                    });
                };
            }

            if (!branch.loadAlpacaDataSource)
            {
                branch.loadAlpacaDataSource = function(config, pagination, callback)
                {
                    var params = {};
                    if (pagination)
                    {
                        Alpaca.copyInto(params, pagination);
                    }

                    var uriFunction = function()
                    {
                        return branch.getUri() + "/alpaca/datasource";
                    };

                    return this.chainPostResponse(this, uriFunction, params, config).then(function(response) {
                        callback.call(this, null, response.datasource);
                    });
                };
            }

        },

        /**
         * Loads data from Cloud CMS.
         *
         * @param {String} nodeId the node id to load
         * @param {Object} resources Map of resources
         * @param {Function} onSuccess onSuccess callback
         * @param {Function} onError onError callback
         */
        loadData: function (nodeId, resources, successCallback, errorCallback)
        {
            var self = this;

            // if we didn't connect to a branch, then use the default method
            if (!self.branch)
            {
                return this.base(nodeId, resources, successCallback, errorCallback);
            }

            // load from cloud cms
            self.branch.loadAlpacaData(nodeId, resources, function(err, data) {

                if (err)
                {
                    errorCallback(err);
                    return;
                }

                var obj = null;

                if (data)
                {
                    obj = JSON.parse(JSON.stringify(data));
                }

                successCallback(obj);
            });
        },

        /**
         * Loads json schema from Cloud CMS.
         *
         * @param {Object|String} schemaIdentifier the definition qname to load
         * @param {Object} resources Map of resources
         * @param {Function} onSuccess onSuccess callback.
         * @param {Function} onError onError callback.
         */
        loadSchema: function (schemaIdentifier, resources, successCallback, errorCallback)
        {
            var self = this;

            // if we didn't connect to a branch, then use the default method
            if (!self.branch)
            {
                return this.base(schemaIdentifier, resources, successCallback, errorCallback);
            }

            // load from cloud cms
            self.branch.loadAlpacaSchema(schemaIdentifier, resources, function(err, schema) {

                if (err)
                {
                    return errorCallback(err);
                }

                // TODO: cleanup schema

                successCallback(schema);
            });
        },

        /**
         * Loads json options from Cloud CMS.
         *
         * @param {Object|String} optionsIdentifier the form key to load
         * @param {Object} resources Map of resources
         * @param {Function} onSuccess onSuccess callback.
         * @param {Function} onError onError callback.
         */
        loadOptions: function (optionsIdentifier, resources, successCallback, errorCallback)
        {
            var self = this;

            // if we didn't connect to a branch, then use the default method
            if (!self.branch)
            {
                return this.base(optionsIdentifier, resources, successCallback, errorCallback);
            }

            // load from cloud cms
            self.branch.loadAlpacaOptions(optionsIdentifier, resources, function(err, options) {

                if (err)
                {
                    return errorCallback(err);
                }

                if (!options) {
                    options = {};
                }

                // TODO: cleanup options

                // mix in buttons onto form
                options.form.buttons = {
                    "submit": {
                        "title": "Submit",
                        "click": function(e) {

                            var form = this;

                            var value = this.getValue();
                            if (!value) {
                                value = {};
                            }

                            var promise = this.ajaxSubmit({
                                "xhrFields": {
                                    "withCredentials": true
                                },
                                "crossDomain": true,
                                "processData": false,
                                "data": JSON.stringify(value),
                                "contentType": "application/json; charset=utf-8"
                            });
                            promise.done(function () {
                                form.topControl.trigger("formSubmitSuccess");
                            });
                            promise.fail(function () {
                                form.topControl.trigger("formSubmitFail");
                            });
                        }
                    }
                };

                if (typeof(options.focus) === "undefined")
                {
                    options.focus = Alpaca.defaultFocus;
                }

                // adjust the action handler relative to baseURL
                options.form.attributes.action = self.config.baseURL + options.form.attributes.action;

                successCallback(options);
            });
        },

        /**
         * Loads a referenced JSON schema.
         *
         * Supports qname://{namespace}/{localName}
         *
         * Otherwise, falls back to default implementation.
         *
         * @param {Object|String} schemaIdentifier schema to load
         * @param {Function} onSuccess onSuccess callback.
         * @param {Function} onError onError callback.
         */
        loadReferenceSchema: function (schemaIdentifier, successCallback, errorCallback)
        {
            var self = this;

            // if the reference comes in form "qname://{namespace}/{localName}" (which is the Cloud CMS official format)
            // then convert to basic QName which we support here within Alpaca Cloud CMS connector
            if (schemaIdentifier.indexOf("qname://") === 0)
            {
                var parts = schemaIdentifier.substring(8).split("/");

                schemaIdentifier = parts[0] + ":" + parts[1];
            }

            // is it HTTP or HTTPS?
            if ((schemaIdentifier.toLowerCase().indexOf("http://") === 0) || (schemaIdentifier.toLowerCase().indexOf("https://") === 0))
            {
                // load JSON from endpoint
                return this._handleLoadJsonResource(schemaIdentifier, successCallback, errorCallback);
            }

            var resources = null;

            // otherwise assume it is a QName
            return self.loadSchema(schemaIdentifier, resources, successCallback, errorCallback);
        },

        /**
         * Loads referenced JSON options.
         *
         * // Supports qname://{namespace}/{localName}/{formKey}
         *
         * At present, this ignores QName.
         *
         * Otherwise, falls back to default implementation.
         *
         * @param {Object|String} optionsIdentifier form to load.
         * @param {Function} onSuccess onSuccess callback.
         * @param {Function} onError onError callback.
         */
        loadReferenceOptions: function (optionsIdentifier, successCallback, errorCallback)
        {
            var self = this;

            // is it HTTP or HTTPS?
            if ((optionsIdentifier.toLowerCase().indexOf("http://") === 0) || (optionsIdentifier.toLowerCase().indexOf("https://") === 0))
            {
                // load JSON from endpoint
                return this._handleLoadJsonResource(optionsIdentifier, successCallback, errorCallback);
            }

            var resources = null;

            // if the reference comes in form "qname://{namespace}/{localName}/{formKey}" (which is the Cloud CMS official format)
            // then convert to basic QName which we support here within Alpaca Cloud CMS connector
            if (optionsIdentifier.indexOf("qname://") === 0)
            {
                var parts = optionsIdentifier.substring(8).split("/");
                if (parts.length > 2)
                {
                    // qname
                    resources = {};
                    resources.schemaSource = parts[0] + ":" + parts[1];

                    // form id
                    optionsIdentifier = parts[2];

                    return self.loadOptions(optionsIdentifier, resources, successCallback, errorCallback);
                }
            }

            successCallback(null);
        },

        /**
         * Loads data source elements based on a content query to Cloud CMS.
         *
         * @param config
         * @param successCallback
         * @param errorCallback
         * @returns {*}
         */
        loadDataSource: function (config, successCallback, errorCallback)
        {
            var self = this;

            // if we didn't connect to a branch, then use the default method
            if (!self.branch)
            {
                return this.base(config, successCallback, errorCallback);
            }

            var pagination = config.pagination;
            delete config.pagination;

            return self.branch.loadAlpacaDataSource(config, pagination, function(err, array) {
                if (err) {
                    errorCallback(err);
                    return;
                }

                successCallback(array);
            });
        }

    });

    Alpaca.registerConnectorClass("cloudcms", Alpaca.CloudCmsConnector);

})(jQuery);
