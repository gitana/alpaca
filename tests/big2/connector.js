var connector = Alpaca.Connector.extend({

    /**
     * When resources are loaded by name, convert to uri.
     *
     * @param resource
     * @param successCallback
     * @param errorCallback
     * @returns {*}
     */
	loadReferenceSchema: function(resource, successCallback, errorCallback) {
		if (typeof(resource) == "string") {
			arr = resource.split("#")
			arr[0] = this.adjustPath(arr[0], "./schema/")
		}
		return this.base(arr.join("#"), successCallback, errorCallback);
	},

    /**
     * When resources are loaded by name, convert to uri.
     *
     * @param resource
     * @param successCallback
     * @param errorCallback
     * @returns {*}
     */
	loadReferenceOptions: function(resource, successCallback, errorCallback) {
		if (typeof(resource) == "string") {
			arr = resource.split("#")
			arr[0] = this.adjustPath(arr[0], "./options/")
		}
		return this.base(arr.join("#"), successCallback, errorCallback);
	},

	adjustPath: function(res, base) {
		res = base + res;
		if (res.indexOf(".json") == -1) {
			res += ".json"
		}
		return res;
	}

});

Alpaca.registerConnectorClass("default", connector);
