(function($) {

    var Alpaca = $.alpaca;

    Alpaca.CloudCmsConnector = Alpaca.Connector.extend(
    /**
     * @lends Alpaca.CloudCmsConnector.prototype
     */
    {
        /**
         * Makes initial connections to data source.
         *
         * @param {Function} onSuccess onSuccess callback.
         * @param {Function} onError onError callback.
         */
        connect: function (onSuccess, onError)
        {
            var self = this;

            Gitana.connect(this.config, function(err) {

                if (err) {
                    onError(err);
                    return;
                }

                self.gitana = this;

                self.gitana.datastore("content").readBranch("master").then(function() {

                    self.branch = this;

                    onSuccess();
                });
            });
        },

        /**
         * Loads data from Cloud CMS.
         *
         * @param {String} nodeId the node id to load
         * @param {Function} onSuccess onSuccess callback
         * @param {Function} onError onError callback
         */
        loadData: function (nodeId, successCallback, errorCallback)
        {
            Chain(this.branch).trap(function(err) {
                errorCallback(err);
                return false;
            }).readNode(nodeId).then(function() {

                var obj = JSON.parse(JSON.stringify(this));

                successCallback(obj);
            });
        },

        /**
         * Loads json schema from Cloud CMS.
         *
         * @param {Object|String} qname the definition qname to load
         * @param {Function} onSuccess onSuccess callback.
         * @param {Function} onError onError callback.
         */
        loadSchema: function (qname, successCallback, errorCallback)
        {
            Chain(this.branch).trap(function(err) {
                errorCallback(err);
                return false;
            }).readDefinition(qname).then(function() {

                var obj = JSON.parse(JSON.stringify(this));

                successCallback(obj);
            });
        },

        /**
         * Loads json options from Cloud CMS.
         *
         * @param {Object|String} formNodeId the form to load
         * @param {Function} onSuccess onSuccess callback.
         * @param {Function} onError onError callback.
         */
        loadOptions: function (formNodeId, successCallback, errorCallback)
        {
            Chain(this.branch).trap(function(err) {
                errorCallback(err);
                return false;
            }).readNode(formNodeId).then(function() {

                var obj = JSON.parse(JSON.stringify(this));

                successCallback(obj);
            });
        },

        /**
         * Loads a referenced JSON schema by it's qname from Cloud CMS.
         *
         * @param {Object|String} qname schema to load
         * @param {Function} onSuccess onSuccess callback.
         * @param {Function} onError onError callback.
         */
        loadReferenceSchema: function (qname, successCallback, errorCallback)
        {
            Chain(this.branch).trap(function(err) {
                errorCallback(err);
                return false;
            }).readDefinition(qname).then(function() {

                var obj = JSON.parse(JSON.stringify(this));

                successCallback(obj);
            });
        },

        /**
         * Loads referenced JSON options by it's form key from Cloud CMS.
         *
         * @param {Object|String} formKey form to load.
         * @param {Function} onSuccess onSuccess callback.
         * @param {Function} onError onError callback.
         */
        loadReferenceOptions: function (formKey, successCallback, errorCallback)
        {
            successCallback({});
        }

    });

    Alpaca.registerConnectorClass("cloudcms", Alpaca.CloudCmsConnector);

})(jQuery);
