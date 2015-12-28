/*jshint -W004 */ // duplicate variables
/*jshint -W083 */ // inline functions are used safely
/**
 * Alpaca forms engine for jQuery
 */
(function($) {

    /**
     * Renders an Alpaca field instance that is bound to a DOM element.
     *
     * The basic syntax is:
     *
     * <code>
     *     <pre>
     *         Alpaca(el, config);
     *     </pre>
     * </code>
     *
     * The full syntax is:
     *
     * <code>
     *     <pre>
     *         Alpaca(el, {
     *              "data" : {Any} field data (optional),
     *              "schema": {Object} field schema (optional),
     *              "options" : {Object} field options (optional),
     *              "view": {Object|String} field view (object or id reference) (optional),
     *              "render": {Function} callback function for replacing default rendering method (optional),
     *              "postRender": {Function} callback function for post-rendering  (optional),
     *              "error": {Function} callback function for error handling  (optional),
     *              "connector": {Alpaca.Connector} connector for retrieving or storing data, schema, options, view and templates. (optional)
     *         });
     *     </pre>
     * </code>
     *
     * @returns {*}
     */
    var Alpaca = function()
    {
        var args = Alpaca.makeArray(arguments);
        if (args.length === 0) {
            // illegal
            return Alpaca.throwDefaultError("You must supply at least one argument.  This argument can either be a DOM element against which Alpaca will generate a form or it can be a function name.  See http://www.alpacajs.org for more details.");
        }

        // element is the first argument (either a string or a DOM element)
        var el = args[0];
        if (el && Alpaca.isString(el)) {
            el = $("#" + el);
        }

        // other arguments we may want to figure out
        var data = null;
        var schema = null;
        var options = null;
        var view = null;
        var callback = null;
        var renderedCallback = null;
        var errorCallback = null;
        var connector = null;
        var notTopLevel = false;
        var initialSettings = {};

        // if these options are provided, then data, schema, options and source are loaded via connector
        var dataSource = null;
        var schemaSource = null;
        var optionsSource = null;
        var viewSource = null;

        // hands back the field instance that is bound directly under the element el
        var findExistingAlpacaBinding = function()
        {
            var existing = null;

            var topElements = $(el).find(":first");
            if (topElements.length > 0)
            {
                // does a field binding exist?
                var fieldId = $(topElements[0]).attr("data-alpaca-field-id");
                if (fieldId)
                {
                    var _existing = Alpaca.fieldInstances[fieldId];
                    if (_existing) {
                        existing = _existing;
                    }
                }
                else
                {
                    // does a form binding exist?
                    var formId = $(topElements[0]).attr("data-alpaca-form-id");
                    if (formId)
                    {
                        var subElements = $(topElements[0]).find(":first");
                        if (subElements.length > 0)
                        {
                            var subFieldId = $(subElements[0]).attr("data-alpaca-field-id");
                            if (subFieldId)
                            {
                                var _existing = Alpaca.fieldInstances[subFieldId];
                                if (_existing) {
                                    existing = _existing;
                                }
                            }
                        }
                    }
                }
            }

            return existing;
        };

        var specialFunctionNames = ["get", "exists", "destroy"];
        var isSpecialFunction = (args.length > 1 && Alpaca.isString(args[1]) && (specialFunctionNames.indexOf(args[1]) > -1));

        var existing = findExistingAlpacaBinding();
        if (existing || isSpecialFunction)
        {
            if (isSpecialFunction)
            {
                // second argument must be a special function name
                var specialFunctionName = args[1];
                if ("get" === specialFunctionName) {
                    return existing;
                }
                else if ("exists" === specialFunctionName) {
                    return (existing ? true : false);
                }
                else if ("destroy" === specialFunctionName) {
                    if (existing) {
                        existing.destroy();
                    }
                    return;
                }

                return Alpaca.throwDefaultError("Unknown special function: " + specialFunctionName);
            }

            return existing;
        }
        else
        {
            var config = null;

            // just a dom element, no other args?
            if (args.length === 1)
            {
                // grab the data inside of the element and use that for config
                var jsonString = $(el).text();

                config = JSON.parse(jsonString);
                $(el).html("");
            }
            else
            {
                if (Alpaca.isObject(args[1]))
                {
                    config = args[1];
                }
                else if (Alpaca.isFunction(args[1]))
                {
                    config = args[1]();
                }
                else
                {
                    config = {
                        "data": args[1]
                    };
                }
            }

            if (!config)
            {
                return Alpaca.throwDefaultError("Unable to determine Alpaca configuration");
            }

            data = config.data;
            schema = config.schema;
            options = config.options;
            view = config.view;
            callback = config.render;
            if (config.callback) {
                callback = config.callback;
            }
            renderedCallback = config.postRender;
            errorCallback = config.error;
            connector = config.connector;

            // sources
            dataSource = config.dataSource;
            schemaSource = config.schemaSource;
            optionsSource = config.optionsSource;
            viewSource = config.viewSource;

            // other
            if (config.ui) {
                initialSettings["ui"] = config.ui;
            }
            if (config.type) {
                initialSettings["type"] = config.type;
            }
            if (!Alpaca.isEmpty(config.notTopLevel)) {
                notTopLevel = config.notTopLevel;
            }
        }

        // if no error callback is provided, we fall back to a browser alert
        if (Alpaca.isEmpty(errorCallback)) {
            errorCallback = Alpaca.defaultErrorCallback;
        }

        // instantiate the connector (if not already instantiated)
        // if config is passed in (as object), we instantiate
        if (!connector || !connector.connect)
        {
            var connectorId = "default";
            var connectorConfig = {};
            if (Alpaca.isString(connector)) {
                connectorId = connector;
            }
            else if (Alpaca.isObject(connector) && connector.id) {
                connectorId = connector.id;
                if (connector.config) {
                    connectorConfig = connector.config;
                }
            }

            var ConnectorClass = Alpaca.getConnectorClass(connectorId);
            if (!ConnectorClass) {
                ConnectorClass = Alpaca.getConnectorClass("default");
            }
            connector = new ConnectorClass(connectorId, connectorConfig);
        }

        // For second or deeper level of fields, default loader should be the one to do loadAll
        // since schema, data, options and view should have already been loaded.
        // Unless we want to load individual fields (other than the templates) using the provided
        // loader, this should be good enough. The benefit is saving time on loader format checking.

        var loadAllConnector = connector;

        if (notTopLevel) {
            var LoadAllConnectorClass = Alpaca.getConnectorClass("default");
            loadAllConnector = new LoadAllConnectorClass("default");
        }

        if (!options) {
            options = {};
        }

        // resets the hideInitValidationError back to default state after first render
        var _resetInitValidationError = function(field)
        {
            // if this is the top-level alpaca field, then we call for validation state to be recalculated across
            // all child fields
            if (!field.parent)
            {
                // final call to update validation state
                // only do this if we're not supposed to suspend initial validation errors
                if (!field.hideInitValidationError)
                {
                    field.refreshValidationState(true);
                }

                // force hideInitValidationError to false for field and all children
                if (field.view.type !== 'view')
                {
                    Alpaca.fieldApplyFieldAndChildren(field, function(field) {

                        // set to false after first validation (even if in CREATE mode, we only force init validation error false on first render)
                        field.hideInitValidationError = false;

                    });
                }
            }
        };

        // wrap rendered callback to allow for UI treatment (dom focus, etc)
        var _renderedCallback = function(field)
        {
            // if top level, apply a unique observable scope id
            if (!field.parent)
            {
                field.observableScope = Alpaca.generateId();
            }

            // if we are the top-most control
            // fire "ready" event on every control
            // go down depth first and fire to lowest controls before trickling back up
            var fireReady = function(_field)
            {
                if (_field.children && _field.children.length > 0)
                {
                    for (var g = 0; g < _field.children.length; g++)
                    {
                        fireReady(_field.children[g]);
                    }
                }

                _field.trigger("ready");
            };
            if (!field.parent)
            {
                fireReady(field);

                // field.triggerWithPropagation.call(field, "ready", "down");
            }

            // if top level and focus has not been specified, then auto-set
            if (Alpaca.isUndefined(options.focus) && !field.parent) {
                options.focus = Alpaca.defaultFocus;
            }

            // auto-set the focus?
            if (options && options.focus)
            {
                window.setTimeout(function() {

                    var doFocus = function(__field)
                    {
                        __field.suspendBlurFocus = true;
                        __field.focus();
                        __field.suspendBlurFocus = false;
                    };

                    if (options.focus)
                    {
                        if (field.isControlField && field.isAutoFocusable())
                        {
                            // just focus on this one
                            doFocus(field);
                        }
                        else if (field.isContainerField)
                        {
                            // if focus = true, then focus on the first child control if it is auto-focusable
                            // and not read-only
                            if (options.focus === true)
                            {
                                // pick first element in form
                                if (field.children && field.children.length > 0)
                                {
                                    /*
                                    for (var z = 0; z < field.children.length; z++)
                                    {
                                        if (field.children[z].isControlField)
                                        {
                                            if (field.children[z].isAutoFocusable() && !field.children[z].options.readonly)
                                            {
                                                doFocus(field.children[z]);
                                                break;
                                            }
                                        }
                                    }
                                    */

                                    doFocus(field);
                                }
                            }
                            else if (typeof(options.focus) === "string")
                            {
                                // assume it is a path to the child
                                var child = field.getControlByPath(options.focus);
                                if (child && child.isControlField && child.isAutoFocusable())
                                {
                                    doFocus(child);
                                }
                            }
                        }

                        _resetInitValidationError(field);
                    }
                }, 500);
            }
            else
            {
                _resetInitValidationError(field);
            }

            if (renderedCallback)
            {
                renderedCallback(field);
            }
        };

        loadAllConnector.loadAll({
            "data": data,
            "schema": schema,
            "options": options,
            "view": view,
            "dataSource": dataSource,
            "schemaSource": schemaSource,
            "optionsSource": optionsSource,
            "viewSource": viewSource
        }, function(loadedData, loadedOptions, loadedSchema, loadedView) {

            // for cases where things could not be loaded via source loaders, fall back to what may have been passed
            // in directly as values

            loadedData = loadedData ? loadedData : data;
            loadedSchema = loadedSchema ? loadedSchema: schema;
            loadedOptions = loadedOptions ? loadedOptions : options;
            loadedView = loadedView ? loadedView : view;

            // some defaults for the case where data is null
            // if schema + options are not provided, we assume a text field

            if (Alpaca.isEmpty(loadedData))
            {
                if (Alpaca.isEmpty(loadedSchema) && (Alpaca.isEmpty(loadedOptions) || Alpaca.isEmpty(loadedOptions.type)))
                {
                    loadedData = "";

                    if (Alpaca.isEmpty(loadedOptions))
                    {
                        loadedOptions = "text";
                    }
                    else if (options && Alpaca.isObject(options))
                    {
                        loadedOptions.type = "text";
                    }
                }
            }

            if (loadedOptions.view)
            {
                loadedView = loadedOptions.view;
            }

            // init alpaca
            return Alpaca.init(el, loadedData, loadedOptions, loadedSchema, loadedView, initialSettings, callback, _renderedCallback, connector, errorCallback);

        }, function (loadError) {
            errorCallback(loadError);
            return null;
        });
    };

    /**
     * @namespace Namespace for all Alpaca Field Class Implementations.
     */
    Alpaca.Fields = { };

    /**
     * @namespace Namespace for all Alpaca Connector Class Implementations.
     */
    Alpaca.Connectors = { };

    Alpaca.Extend = $.extend;

    Alpaca.Create = function()
    {
        var args = Array.prototype.slice.call(arguments);
        args.unshift({});

        return $.extend.apply(this, args);
    };

    // static methods and properties
    Alpaca.Extend(Alpaca,
    /** @lends Alpaca */
    {
        /**
         * Makes an array.
         *
         * @param {Any} nonArray A non-array variable.
         * @returns {Array} Array out of the non-array variable.
         */
        makeArray : function(nonArray) {
            return Array.prototype.slice.call(nonArray);
        },

        /**
         * Finds whether the type of a variable is function.
         * @param {Any} obj The variable being evaluated.
         * @returns {Boolean} True if the variable is a function, false otherwise.
         */
        isFunction: function(obj) {
            return Object.prototype.toString.call(obj) === "[object Function]";
        },

        /**
         * Finds whether the type of a variable is string.
         * @param {Any} obj The variable being evaluated.
         * @returns {Boolean} True if the variable is a string, false otherwise.
         */
        isString: function(obj) {
            return (typeof obj === "string");
        },

        /**
         * Finds whether the type of a variable is object.
         * @param {Any} obj The variable being evaluated.
         * @returns {Boolean} True if the variable is an object, false otherwise.
         */
        isObject: function(obj) {
            return !Alpaca.isUndefined(obj) && Object.prototype.toString.call(obj) === '[object Object]';
        },

        /**
         * Finds whether the type of a variable is a plain, non-prototyped object.
         * @param {Any} obj The variable being evaluated.
         * @returns {Boolean} True if the variable is a plain object, false otherwise.
         */
        isPlainObject: function(obj) {
            return $.isPlainObject(obj);
        },

        /**
         * Finds whether the type of a variable is number.
         * @param {Any} obj The variable being evaluated.
         * @returns {Boolean} True if the variable is a number, false otherwise.
         */
        isNumber: function(obj) {
            return (typeof obj === "number");
        },

        /**
         * Finds whether the type of a variable is array.
         * @param {Any} obj The variable being evaluated.
         * @returns {Boolean} True if the variable is an array, false otherwise.
         */
        isArray: function(obj) {
            return obj instanceof Array;
        },

        /**
         * Finds whether the type of a variable is boolean.
         * @param {Any} obj The variable being evaluated.
         * @returns {Boolean} True if the variable is a boolean, false otherwise.
         */
        isBoolean: function(obj) {
            return (typeof obj === "boolean");
        },

        /**
         * Finds whether the type of a variable is undefined.
         * @param {Any} obj The variable being evaluated.
         * @returns {Boolean} True if the variable is a undefined, false otherwise.
         */
        isUndefined: function(obj) {
            return (typeof obj == "undefined");
        },

        /**
         * Strips any excess whitespace characters from the given text.
         * Returns the trimmed string.
         *
         * @param str
         *
         * @return trimmed string
         */
        trim: function(text)
        {
            var trimmed = text;

            if (trimmed && Alpaca.isString(trimmed))
            {
                trimmed = trimmed.replace(/^\s+|\s+$/g, '');
            }

            return trimmed;
        },

        /**
         * Provides a safe conversion of an HTML textual string into a DOM object.
         *
         * @param x
         * @return {*}
         */
        safeDomParse: function(x)
        {
            if (x && Alpaca.isString(x))
            {
                x = Alpaca.trim(x);

                // convert to dom
                var converted = null;
                try
                {
                    converted = $(x);
                }
                catch (e)
                {
                    // make another attempt to account for safety in some browsers
                    x = "<div>" + x + "</div>";

                    converted = $(x).children();
                }

                return converted;
            }

            return x;
        },

        /**
         * Finds whether a variable is empty.
         * @param {Any} obj The variable being evaluated.
         * @param [boolean] includeFunctions whether to include functions in any counts
         * @returns {Boolean} True if the variable is empty, false otherwise.
         */
        isEmpty: function(obj, includeFunctions) {

            var self = this;

            if (Alpaca.isUndefined(obj))
            {
                return true;
            }
            else if (obj === null)
            {
                return true;
            }

            if (obj && Alpaca.isObject(obj))
            {
                var count = self.countProperties(obj, includeFunctions);
                if (count === 0)
                {
                    return true;
                }
            }

            return false;
        },

        /**
         * Counts the number of properties in an object.
         *
         * @param obj
         * @param includeFunctions
         *
         * @returns {number}
         */
        countProperties: function(obj, includeFunctions) {
            var count = 0;

            if (obj && Alpaca.isObject(obj))
            {
                for (var k in obj)
                {
                    if (obj.hasOwnProperty(k))
                    {
                        if (includeFunctions) {
                            count++;
                        } else {
                            if (typeof(obj[k]) !== "function") {
                                count++;
                            }
                        }
                    }
                }
            }

            return count;
        },

        /**
         * Produces a copy of the given JS value.
         *
         * If the value is a simple array or a simple object, then a pure copy is produced.
         *
         * If it's a complex object or a function, then the reference is copied (i.e. not truly a copy).
         *
         * @param thing
         * @return {*}
         */
        copyOf: function(thing)
        {
            var copy = thing;

            if (Alpaca.isArray(thing))
            {
                copy = [];

                for (var i = 0; i < thing.length; i++)
                {
                    copy.push(Alpaca.copyOf(thing[i]));
                }
            }
            else if (Alpaca.isObject(thing))
            {
                if (thing instanceof Date)
                {
                    // date
                    return new Date(thing.getTime());
                }
                else if (thing instanceof RegExp)
                {
                    // regular expression
                    return new RegExp(thing);
                }
                else if (thing.nodeType && "cloneNode" in thing)
                {
                    // DOM node
                    copy = thing.cloneNode(true);
                }
                else if ($.isPlainObject(thing))
                {
                    copy = {};

                    for (var k in thing)
                    {
                        if (thing.hasOwnProperty(k))
                        {
                            copy[k] = Alpaca.copyOf(thing[k]);
                        }
                    }
                }
                else
                {
                    // otherwise, it's some other kind of object so we just do a referential copy
                    // in other words, not a copy
                }
            }

            return copy;
        },

        copyInto: function(target, source)
        {
            for (var i in source)
            {
                if (source.hasOwnProperty(i) && !this.isFunction(this[i]))
                {
                    target[i] = source[i];
                }
            }
        },


        /**
         * Retained for legacy purposes.  Alias for copyOf().
         *
         * @param object
         * @returns {*}
         */
        cloneObject: function(object)
        {
            return Alpaca.copyOf(object);
        },

        /**
         * Splices a string.
         *
         * @param {String} source Source string to be spliced.
         * @param {Integer} splicePoint Splice location.
         * @param {String} splice String to be spliced in.
         * @returns {String} Spliced string
         */
        spliceIn: function(source, splicePoint, splice) {
            return source.substring(0, splicePoint) + splice + source.substring(splicePoint, source.length);
        },

        /**
         * Compacts an array.
         *
         * @param {Array} arr Source array to be compacted.
         * @returns {Array} Compacted array.
         */
        compactArray: function(arr) {
            var n = [], l = arr.length,i;
            for (i = 0; i < l; i++) {
                if (!lang.isNull(arr[i]) && !lang.isUndefined(arr[i])) {
                    n.push(arr[i]);
                }
            }
            return n;
        },

        /**
         * Removes accents from a string.
         *
         * @param {String} str Source string.
         * @returns {String} Cleaned string without accents.
         */
        removeAccents: function(str) {
            return str.replace(/[àáâãäå]/g, "a").replace(/[èéêë]/g, "e").replace(/[ìíîï]/g, "i").replace(/[òóôõö]/g, "o").replace(/[ùúûü]/g, "u").replace(/[ýÿ]/g, "y").replace(/[ñ]/g, "n").replace(/[ç]/g, "c").replace(/[œ]/g, "oe").replace(/[æ]/g, "ae");
        },

        /**
         * @private
         * @param el
         * @param arr
         * @param fn
         */
        indexOf: function(el, arr, fn) {
            var l = arr.length,i;

            if (!Alpaca.isFunction(fn)) {
                /**
                 * @ignore
                 * @param elt
                 * @param arrElt
                 */
                fn = function(elt, arrElt) {
                    return elt === arrElt;
                };
            }

            for (i = 0; i < l; i++) {
                if (fn.call({}, el, arr[i])) {
                    return i;
                }
            }

            return -1;
        },

        /**
         * Static counter for generating a unique ID.
         */
        uniqueIdCounter: 0,

        /**
         * Default Locale.
         */
        defaultLocale: "en_US",

        /**
         * Whether to set focus by default
         */
        defaultFocus: true,

        /**
         * Sets the default Locale.
         *
         * @param {String} locale New default locale.
         */
        setDefaultLocale: function(locale) {
            this.defaultLocale = locale;
        },

        /**
         * Field Type to Schema Type Mappings.
         */
        defaultSchemaFieldMapping: {},

        /**
         * Registers a field type to schema data type mapping.
         *
         * @param {String} schemaType Schema data type.
         * @param {String} fieldType Field type.
         */
        registerDefaultSchemaFieldMapping: function(schemaType, fieldType) {
            if (schemaType && fieldType) {
                this.defaultSchemaFieldMapping[schemaType] = fieldType;
            }
        },

        /**
         * Field Type to Schema Format Mappings.
         */
        defaultFormatFieldMapping: {},

        /**
         * Registers a field type to schema format mapping.
         *
         * @param {String} format Schema format.
         * @param {String} fieldType Field type.
         */
        registerDefaultFormatFieldMapping: function(format, fieldType) {
            if (format && fieldType) {
                this.defaultFormatFieldMapping[format] = fieldType;
            }
        },

        /**
         * Gets schema type of a variable.
         *
         * @param {Any} data The variable.
         * @returns {String} Schema type of the variable.
         */
        getSchemaType: function(data) {

            var schemaType = null;

            // map data types to default field types
            if (Alpaca.isEmpty(data)) {
                schemaType = "string";
            }
            else if (Alpaca.isArray(data)) {
                schemaType = "array";
            }
            else if (Alpaca.isObject(data)) {
                schemaType = "object";
            }
            else if (Alpaca.isString(data)) {
                schemaType = "string";
            }
            else if (Alpaca.isNumber(data)) {
                schemaType = "number";
            }
            else if (Alpaca.isBoolean(data)) {
                schemaType = "boolean";
            }
            // Last check for data that carries functions -- GitanaConnector case.
            if (!schemaType && (typeof data === 'object')) {
                schemaType = "object";
            }

            return schemaType;
        },

        /**
         * Makes a best guess at the options field type if none provided.
         *
         * @param schema
         * @returns {string} the field type
         */
        guessOptionsType: function(schema)
        {
            var type = null;

            if (schema && typeof(schema["enum"]) !== "undefined")
            {
                if (schema["enum"].length > 3)
                {
                    type = "select";
                }
                else
                {
                    type = "radio";
                }
            }
            else
            {
                type = Alpaca.defaultSchemaFieldMapping[schema.type];
            }

            // check if it has format defined
            if (schema.format && Alpaca.defaultFormatFieldMapping[schema.format])
            {
                type = Alpaca.defaultFormatFieldMapping[schema.format];
            }

            return type;
        },

        /**
         * Alpaca Views.
         */
        views: {},

        /**
         * Generates a valid view id.
         *
         * @returns {String} A valid unique view id.
         */
        generateViewId : function () {
            return "view-" + this.generateId();
        },

        /**
         * Registers a view with the framework.
         *
         * @param viewObject
         */
        registerView: function(viewObject)
        {
            var viewId = viewObject.id;

            if (!viewId)
            {
                return Alpaca.throwDefaultError("Cannot register view with missing view id: " + viewId);
            }

            var existingView = this.views[viewId];
            if (existingView)
            {
                Alpaca.mergeObject(existingView, viewObject);
            }
            else
            {
                this.views[viewId] = viewObject;

                if (!viewObject.templates)
                {
                    viewObject.templates = {};
                }

                // if we have any precompiled views, flag them
                var engineIds = Alpaca.TemplateEngineRegistry.ids();
                for (var i = 0; i < engineIds.length; i++)
                {
                    var engineId = engineIds[i];

                    var engine = Alpaca.TemplateEngineRegistry.find(engineId);
                    if (engine)
                    {
                        // ask the engine if it has any cache keys for view templates for this view
                        var cacheKeys = engine.findCacheKeys(viewId);
                        for (var z = 0; z < cacheKeys.length; z++)
                        {
                            var parts = Alpaca.splitCacheKey(cacheKeys[z]);

                            // mark as precompiled
                            viewObject.templates[parts.templateId] = {
                                "type": engineId,
                                "template": true,
                                "cacheKey": cacheKeys[z]
                            };
                        }
                    }
                }
            }
        },

        /**
         * Retrieves a normalized view by view id.
         *
         * @param viewId
         * @return {*}
         */
        getNormalizedView: function(viewId)
        {
            return this.normalizedViews[viewId];
        },

        /**
         * Resolves which view handles a given theme and type of operation.
         *
         * @param {String} ui
         * @param {String} type
         *
         * @returns {String} the view id
         */
        lookupNormalizedView: function(ui, type)
        {
            var theViewId = null;

            for (var viewId in this.normalizedViews)
            {
                var view = this.normalizedViews[viewId];

                if (view.ui === ui && view.type === type)
                {
                    theViewId = viewId;
                    break;
                }
            }

            return theViewId;
        },

        /**
         * Registers a template to a view.
         *
         * @param {String} templateId Template id.
         * @param {String|Object} template Either the text of the template or an object containing { "type": "<templateEngineIdentifier>", "template": "<markup>" }
         * @param [String] viewId the optional view id.  If none is provided, then all registrations are to the default view.
         */
        registerTemplate: function(templateId, template, viewId)
        {
            // if no view specified, fall back to the base view which is "base"
            if (!viewId)
            {
                viewId = "base";
            }

            if (!this.views[viewId])
            {
                this.views[viewId] = {};
                this.views[viewId].id = viewId;
            }

            if (!this.views[viewId].templates)
            {
                this.views[viewId].templates = {};
            }

            this.views[viewId].templates[templateId] = template;

        },

        /**
         * Registers list of templates to a view.
         *
         * @param {Array} templates Templates being registered
         * @param {String} viewId Id of the view that the templates being registered to.
         */
        registerTemplates: function(templates, viewId) {
            for (var templateId in templates) {
                this.registerTemplate(templateId, templates[templateId], viewId);
            }
        },

        /**
         * Registers a message to a view.
         *
         * @param {String} messageId Id of the message being registered.
         * @param {String} message Message to be registered
         * @param {String} viewId Id of the view that the message being registered to.
         */
        registerMessage: function(messageId, message, viewId)
        {
            // if no view specified, fall back to the base view which is "base"
            if (!viewId)
            {
                viewId = "base";
            }

            if (!this.views[viewId])
            {
                this.views[viewId] = {};
                this.views[viewId].id = viewId;
            }

            if (!this.views[viewId].messages)
            {
                this.views[viewId].messages = {};
            }

            this.views[viewId].messages[messageId] = message;
        },

        /**
         * Registers messages with a view.
         *
         * @param {Array} messages Messages to be registered.
         * @param {String} viewId Id of the view that the messages being registered to.
         */
        registerMessages: function(messages, viewId) {
            for (var messageId in messages) {
                if (messages.hasOwnProperty(messageId)) {
                    this.registerMessage(messageId, messages[messageId], viewId);
                }
            }
        },

        /**
         * Default date format.
         */
        defaultDateFormat: "MM/DD/YYYY",

        /**
         * Default time format.
         */
        defaultTimeFormat: "HH:SS",

        /**
         * Regular expressions for fields.
         */
        regexps:
        {
            "email": /^[a-z0-9!\#\$%&'\*\-\/=\?\+\-\^_`\{\|\}~]+(?:\.[a-z0-9!\#\$%&'\*\-\/=\?\+\-\^_`\{\|\}~]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,6}$/i,
            "url": /^(http|https|ftp):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(\:[0-9]{1,5})?(\/.*)?$/i,
            "intranet-url": /^(http|https|ftp):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*(\:[0-9]{1,5})?(\/.*)?$/i,
            "password": /^[0-9a-zA-Z\x20-\x7E]*$/,
            "date": /^(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.]\d\d$/,
            "integer": /^([\+\-]?([1-9]\d*)|0)$/,
            "number":/^([\+\-]?((([0-9]+(\.)?)|([0-9]*\.[0-9]+))([eE][+-]?[0-9]+)?))$/,
            "phone":/^(\D?(\d{3})\D?\D?(\d{3})\D?(\d{4}))?$/,
            "ipv4":/^(?:1\d?\d?|2(?:[0-4]\d?|[6789]|5[0-5]?)?|[3-9]\d?|0)(?:\.(?:1\d?\d?|2(?:[0-4]\d?|[6789]|5[0-5]?)?|[3-9]\d?|0)){3}$/,
            "zipcode-five": /^(\d{5})?$/,
            "zipcode-nine": /^(\d{5}(-\d{4})?)?$/,
            "whitespace": /^\s+$/
        },

        /**
         * Map of instantiated fields.
         */
        fieldInstances: {},

        /**
         * Maps of field types to field class implementations.
         */
        fieldClassRegistry: {},

        /**
         * Registers an implementation class for a type of field.
         *
         * @param {String} type Field type.
         * @param {Alpaca.Field} fieldClass Field class.
         */
        registerFieldClass: function(type, fieldClass) {
            this.fieldClassRegistry[type] = fieldClass;
        },

        /**
         * Returns the implementation class for a type of field.
         *
         * @param {String} type Field type.
         *
         * @returns {Alpaca.Field} Field class mapped to field type.
         */
        getFieldClass: function(type) {
            return this.fieldClassRegistry[type];
        },

        /**
         * Gets the field type id for a given field implementation class.
         *
         * @param {Alpaca.Field} fieldClass Field class.
         *
         * @returns {String} Field type of the field class.
         */
        getFieldClassType: function(fieldClass) {
            for (var type in this.fieldClassRegistry) {
                if (this.fieldClassRegistry.hasOwnProperty(type)) {
                    if (this.fieldClassRegistry[type] === fieldClass) {
                        return type;
                    }
                }
            }
            return null;
        },

        /**
         * Maps of connector types to connector class implementations.
         */
        connectorClassRegistry: {},

        /**
         * Registers an implementation class for a connector type.
         *
         * @param {String} type cConnect type
         * @param {Alpaca.Connector} connectorClass Connector class.
         */
        registerConnectorClass: function(type, connectorClass) {
            this.connectorClassRegistry[type] = connectorClass;
        },

        /**
         * Returns the implementation class for a connector type.
         *
         * @param {String} type Connect type.
         * @returns {Alpaca.Connector} Connector class mapped to connect type.
         */
        getConnectorClass: function(type) {
            return this.connectorClassRegistry[type];
        },

        /**
         * Replaces each substring of this string that matches the given regular expression with the given replacement.
         *
         * @param {String} text Source string being replaced.
         * @param {String} replace Regular expression for replacing.
         * @param {String} with_this Replacement.
         *
         * @returns {String} Replaced string.
         */
        replaceAll: function(text, replace, with_this) {
            return text.replace(new RegExp(replace, 'g'), with_this);
        },

        /**
         * Creates an element with a given tag name, dom/style attributes and class names.
         *
         * @param {String} tag Tag name.
         * @param {Array} domAttributes DOM attributes.
         * @param {Array} styleAttributes Style attributes.
         * @param {Array} classNames Class names.
         *
         * @returns {Object} New element with the tag name and all other provided attributes.
         */
        element: function(tag, domAttributes, styleAttributes, classNames) {
            var el = $("<" + tag + "/>");

            if (domAttributes) {
                el.attr(domAttributes);
            }
            if (styleAttributes) {
                el.css(styleAttributes);
            }
            if (classNames) {
                for (var className in classNames) {
                    el.addClass(className);
                }
            }
        },

        /**
         * Replaces a template with list of replacements.
         *
         * @param {String} template Template being processed.
         * @param {String} substitutions List of substitutions.
         *
         * @returns {String} Replaced template.
         */
        elementFromTemplate: function(template, substitutions) {
            var html = template;
            if (substitutions) {
                for (var x in substitutions) {
                    html = Alpaca.replaceAll(html, "${" + x + "}", substitutions[x]);
                }
            }
            return $(html);
        },

        /**
         * Generates a unique alpaca id.
         *
         * @returns {String} The unique alpaca id.
         */
        generateId: function() {
            Alpaca.uniqueIdCounter++;
            return "alpaca" + Alpaca.uniqueIdCounter;
        },

        /**
         * Helper function to provide YAHOO later like capabilities.
         */
        later: function(when, o, fn, data, periodic) {
            when = when || 0;
            o = o || {};
            var m = fn, d = $.makeArray(data), f, r;

            if (typeof fn === "string") {
                m = o[fn];
            }

            if (!m) {
                // Throw an error about the method
                throw {
                    name: 'TypeError',
                    message: "The function is undefined."
                };
            }

            /**
             * @ignore
             */
            f = function() {
                m.apply(o, d);
            };

            r = (periodic) ? setInterval(f, when) : setTimeout(f, when);

            return {
                id: r,
                interval: periodic,
                cancel: function() {
                    if (this.interval) {
                        clearInterval(r);
                    } else {
                        clearTimeout(r);
                    }
                }
            };
        },

        /**
         * Finds if an string ends with a given suffix.
         *
         * @param {String} text The string being evaluated.
         * @param {String} suffix Suffix.
         * @returns {Boolean} True if the string ends with the given suffix, false otherwise.
         */
        endsWith : function(text, suffix) {
            return text.indexOf(suffix, text.length - suffix.length) !== -1;
        },

        /**
         * Finds if an string starts with a given prefix.
         *
         * @param {String} text The string being evaluated.
         * @param {String} prefix Prefix
         * @returns {Boolean} True if the string starts with the given prefix, false otherwise.
         */
        startsWith : function(text, prefix) {
            //return (text.match("^" + prefix) == prefix);
            return text.substr(0, prefix.length) === prefix;
        },

        /**
         * Finds if a variable is a URI.
         *
         * @param {Object} obj The variable being evaluated.
         * @returns {Boolean} True if the variable is a URI, false otherwise.
         */
        isUri : function(obj) {
            return Alpaca.isString(obj) && (Alpaca.startsWith(obj, "http://") ||
                    Alpaca.startsWith(obj, "https://") ||
                    Alpaca.startsWith(obj, "/") ||
                    Alpaca.startsWith(obj, "./") ||
                    Alpaca.startsWith(obj, "../"));
        },

        /**
         * Picks a sub-element from an object using a keys array.
         *
         * @param {Object} object Object to be traversed
         * @param {String|Array} keys Either an array of tokens or a dot-delimited string (i.e. "data.user.firstname")
         * @param {String} subprop Optional subproperty to traverse (i.e.. "data.properties.user.properties.firstname")
         *
         * @returns {Object} Sub element mapped to the given key path
         */
        traverseObject : function(object, keys, subprop) {
            if (Alpaca.isString(keys)) {
                keys = keys.split(".");
            }

            var element = null;
            var current = object;

            var key = null;
            do {
                key = keys.shift();
                if (subprop && key === subprop) {
                    key = keys.shift();
                }
                if (!Alpaca.isEmpty(current[key])) {
                    current = current[key];
                    if (keys.length === 0) {
                        element = current;
                    }
                } else {
                    keys = [];
                }
            } while (keys.length > 0);

            return element;
        },

        /**
         * Helper function that executes the given function upon each element in the array
         * The element of the array becomes the "this" variable in the function
         *
         * @param {Array|Object} data Either an array or an object
         * @param {Function} func Function to be executed.
         */
        each : function(data, func) {
            if (Alpaca.isArray(data)) {
                for (var i = 0; i < data.length; i++) {
                    func.apply(data[i]);
                }
            } else if (Alpaca.isObject(data)) {
                for (var key in data) {
                    func.apply(data[key]);
                }
            }
        },

        /**
         * Merges json obj2 into obj1 using a recursive approach.
         *
         * @param {Object} obj1 Destination object.
         * @param {Object} obj2 Source object.
         * @param {Function} validKeyFunction Function used to determine whether to include a given key or not.
         *
         * @returns {Object} Merged object.
         */
        merge : function(obj1, obj2, validKeyFunction) {
            if (!obj1) {
                obj1 = {};
            }
            for (var key in obj2) {
                var valid = true;

                if (validKeyFunction) {
                    valid = validKeyFunction(key);
                }

                if (valid) {
                    if (Alpaca.isEmpty(obj2[key])) {
                        obj1[key] = obj2[key];
                    } else {
                        if (Alpaca.isObject(obj2[key])) {
                            if (!obj1[key]) {
                                obj1[key] = {};
                            }
                            obj1[key] = Alpaca.merge(obj1[key], obj2[key]);
                        } else {
                            obj1[key] = obj2[key];
                        }
                    }
                }
            }

            return obj1;
        },

        /**
         * Merges json "source" into "target" using a recursive approach. The merge will include empty values
         * of obj2 properties.
         *
         * @param {Object} target Target object.
         * @param {Object} source Source object.
         *
         * @returns {Object} Merged object
         */
        mergeObject : function(target, source) {

            if (!target) {
                target = {};
            }

            if (!source) {
                source = {};
            }

            this.mergeObject2(source, target);

            return target;
        },

        mergeObject2: function(source, target)
        {
            var isArray = Alpaca.isArray;
            var isObject = Alpaca.isObject;
            var isUndefined = Alpaca.isUndefined;
            var copyOf = Alpaca.copyOf;

            var _merge = function(source, target)
            {
                if (isArray(source))
                {
                    if (isArray(target))
                    {
                        // merge array elements
                        $.each(source, function(index) {
                            target.push(copyOf(source[index]));
                        });
                    }
                    else
                    {
                        // something is already in the target that isn't an ARRAY
                        // skip
                    }
                }
                else if (isObject(source))
                {
                    if (isObject(target))
                    {
                        // merge object properties
                        $.each(source, function(key) {

                            if (isUndefined(target[key])) {
                                target[key] = copyOf(source[key]);
                            } else {
                                target[key] = _merge(source[key], target[key]);
                            }

                        });
                    }
                    else
                    {
                        // something is already in the target that isn't an OBJECT
                        // skip
                    }

                }
                else
                {
                    // otherwise, it's a scalar, always overwrite
                    target = copyOf(source);
                }

                return target;
            };

            _merge(source, target);

            return target;
        },

        /**
         * Substitutes a string with a list of tokens.
         *
         * @param text Source string.
         * @param args List of tokens.
         *
         * @returns Substituted string.
         */
        substituteTokens : function(text, args) {

            if (!Alpaca.isEmpty(text)) {
                for (var i = 0; i < args.length; i++) {
                    var token = "{" + i + "}";

                    var x = text.indexOf(token);
                    if (x > -1) {
                        var nt = text.substring(0, x) + args[i] + text.substring(x + 3);
                        text = nt;
                        //text = Alpaca.replaceAll(text, token, args[i]);
                    }
                }
            }
            return text;
        },

        /**
         * Compares two objects.
         *
         * @param {Object} obj1 First object.
         * @param {Object} obj2 Second object.
         *
         * @returns {Boolean} True if two objects are same, false otherwise.
         */
        compareObject : function(obj1, obj2) {
            return equiv(obj1, obj2);
        },

        /**
         * Compares content of two arrays.
         *
         * @param {Array} arr_1 First array.
         * @param {Array} arr_2 Second array.
         * @returns {Boolean} True if two arrays have same content, false otherwise.
         */
        compareArrayContent : function(a, b) {
            var equal = a && b && (a.length === b.length);

            if (equal) {
                for (var i = a.length - 1; i >= 0; i--) {
                    var v = a[i];
                    if ($.inArray(v, b) < 0) {
                        return false;
                    }
                }
            }

            return equal;
        },

        testRegex: function(expression, textValue)
        {
            var regex = new RegExp(expression);

            return regex.test(textValue);
        },

        /**
         * Finds whether a variable has empty value or not.
         *
         * @param {Any} val Variable to be evaluated.
         * @param [boolean] includeFunctions whether to include function in any counts
         *
         * @returns {Boolean} True if the variable has empty value, false otherwise.
         */
        isValEmpty : function(val, includeFunctions) {
            var empty = false;
            if (Alpaca.isEmpty(val, includeFunctions)) {
                empty = true;
            } else {
                if (Alpaca.isString(val) && val === "") {
                    empty = true;
                }
                if (Alpaca.isObject(val) && $.isEmptyObject(val)) {
                    empty = true;
                }
                if (Alpaca.isArray(val) && val.length === 0) {
                    empty = true;
                }

                /*
                if (Alpaca.isNumber(val) && isNaN(val)) {
                    empty = true;
                }
                */
            }
            return empty;
        },

        /**
         * Initial function for setting up field instance and executing callbacks if needed.
         *
         * @param {Object} el Container element.
         * @param {Object} data Field data.
         * @param {Object} options Field options.
         * @param {Object} schema Field schema.
         * @param {Object|String} view Field view.
         * @param {Object} initialSettings any additional settings provided to the top-level Alpaca object
         * @param {Function} callback Render callback.
         * @param {Function} renderedCallback Post-render callback.
         * @param {Alpaca.connector} connector Field connector.
         * @param {Function} errorCallback Error callback.
         *
         * @returns {Alpaca.Field} New field instance.
         */
        init: function(el, data, options, schema, view, initialSettings, callback, renderedCallback, connector, errorCallback) {

            var self = this;

            ///////////////////////////////////////////////////////////////////////////////////////////////////
            //
            // COMPILATION
            //
            ///////////////////////////////////////////////////////////////////////////////////////////////////

            // if they provided an inline view object, we assign an id and store onto views map
            // so that it gets compiled along with the rest
            if (Alpaca.isObject(view)) {
                var viewId = view.id;
                if (!viewId) {
                    view.id = this.generateViewId();
                }
                var parentId = view.parent;
                if (!parentId)
                {
                    view.parent = "bootstrap-edit";
                }
                this.registerView(view);
                view = view.id;
            }

            // compile all of the views and templates
            this.compile(function(report) {

                if (report.errors && report.errors.length > 0)
                {
                    var messages = [];

                    for (var i = 0; i < report.errors.length; i++)
                    {
                        var viewId = report.errors[i].view;
                        var cacheKey = report.errors[i].cacheKey
                        var err = report.errors[i].err;

                        var text = "The template with cache key: " + cacheKey + " for view: " + viewId + " failed to compile";
                        if (err && err.message) {
                            text += ", message: " + err.message;

                            messages.push(err.message);
                        }
                        if (err) {
                            text += ", err: " + JSON.stringify(err);
                        }
                        Alpaca.logError(text);

                        delete self.normalizedViews[viewId];
                        delete self.views[viewId];
                    }

                    return Alpaca.throwErrorWithCallback("View compilation failed, cannot initialize Alpaca. " + messages.join(", "), errorCallback);
                }

                self._init(el, data, options, schema, view, initialSettings, callback, renderedCallback, connector, errorCallback);
            }, errorCallback);
        },

        _init: function(el, data, options, schema, view, initialSettings, callback, renderedCallback, connector, errorCallback)
        {
            var self = this;

            ///////////////////////////////////////////////////////////////////////////////////////////////////
            //
            // VIEW RESOLUTION
            //
            ///////////////////////////////////////////////////////////////////////////////////////////////////


            // make some intelligent guesses about what view id we might default to in case they want to use
            // auto-view selection.  We detect jquery-ui, bootstrap and jquerymobile.  If nothing can be detected,
            // we fall back to straight web views.
            var fallbackUI   = Alpaca.defaultView || null;
            var fallbackType = null;

            // detect jQuery Mobile
            if ($.mobile && !fallbackUI) {
                fallbackUI = "jquerymobile";
            }

            // detect twitter bootstrap
            var bootstrapDetected = (typeof $.fn.modal === 'function');
            if (bootstrapDetected && !fallbackUI) {
                fallbackUI = "bootstrap";
            }

            // detect jquery ui
            var jQueryUIDetected = (typeof($.ui) !== "undefined");
            if (jQueryUIDetected && !fallbackUI) {
                fallbackUI = "jqueryui";
            }

            if (fallbackUI)
            {
                if (data) {
                    fallbackType = "edit";
                } else {
                    fallbackType = "create";
                }
            }

            // if no view provided, but they provided "ui" and optionally "type", then we try to auto-select the view
            if (!view)
            {
                var ui = initialSettings.ui;
                var type = initialSettings.type;

                if (!ui)
                {
                    if (!fallbackUI) {
                        fallbackUI = Alpaca.defaultUI;
                    }
                    if (fallbackUI) {
                        ui = fallbackUI;
                    }
                }

                if (ui) {
                    if (!type) {
                        type = fallbackType ? fallbackType : "edit";
                    }

                    Alpaca.logDebug("No view provided but found request for UI: " + ui + " and type: " + type);

                    // see if we can auto-select a view
                    view = this.lookupNormalizedView(ui, type);
                    if (view) {
                        Alpaca.logDebug("Found view: " + view);
                    } else {
                        Alpaca.logDebug("No view found for UI: " + ui + " and type: " + type);
                    }
                }
            }

            // NOTE: at this point view is a string (the view id) or it is empty/null

            // if still no view, then default fallback to our detected view or the default
            if (!view)
            {
                return Alpaca.throwErrorWithCallback("A view was not specified and could not be automatically determined.", errorCallback);
            }
            else
            {
                // debugging: if the view isn't available, we want to report it right away
                if (Alpaca.isString(view))
                {
                    if (!this.normalizedViews[view])
                    {
                        return Alpaca.throwErrorWithCallback("The desired view: " + view + " could not be loaded.  Please make sure it is loaded and not misspelled.", errorCallback);
                    }
                }


                ///////////////////////////////////////////////////////////////////////////////////////////////////
                //
                // FIELD INSTANTIATION
                //
                ///////////////////////////////////////////////////////////////////////////////////////////////////

                // TEST - swap code
                // swap el -> placeholder
                //var tempHolder = $("<div></div>");
                //$(el).before(tempHolder);
                //$(el).remove();

                var field = Alpaca.createFieldInstance(el, data, options, schema, view, connector, errorCallback);
                if (field)
                {
                    // hide field while rendering
                    $(el).addClass("alpaca-field-rendering");
                    $(el).addClass("alpaca-hidden");

                    Alpaca.fieldInstances[field.getId()] = field;

                    // mechanism for looking up field instances by id
                    field.allFieldInstances = function()
                    {
                        return Alpaca.fieldInstances;
                    };

                    // allow callbacks defined through view
                    if (Alpaca.isEmpty(callback)) {
                        callback = field.view.render;
                    }
                    if (Alpaca.isEmpty(renderedCallback)) {
                        renderedCallback = field.view.postRender;
                    }

                    var fin = function()
                    {
                        // if this is the top-level alpaca field, we apply some additional CSS classes
                        if (!field.parent)
                        {
                            field.getFieldEl().addClass("alpaca-" + self.getNormalizedView(view).type);
                        }

                        // if this is the top-level alpaca field, we mark as top
                        if (!field.parent)
                        {
                            field.getFieldEl().addClass("alpaca-top");
                        }

                        /*
                        // if this is the top-level alpaca field, then we call for validation state to be recalculated across
                        // all child fields
                        if (!field.parent)
                        {
                            // final call to update validation state
                            // only do this if we're not supposed to suspend initial validation errors
                            if (!field.hideInitValidationError)
                            {
                                field.refreshValidationState(true);
                            }

                            // force hideInitValidationError to false for field and all children
                            if (field.view.type !== 'view')
                            {
                                Alpaca.fieldApplyFieldAndChildren(field, function(field) {

                                    // set to false after first validation (even if in CREATE mode, we only force init validation error false on first render)
                                    field.hideInitValidationError = false;

                                });
                            }
                        }
                        */

                        // TEST - swap code
                        // swap placeholder -> el
                        //$(tempHolder).before(el);
                        //$(tempHolder).remove();

                        // reveal field after rendering
                        $(el).removeClass("alpaca-field-rendering");
                        $(el).removeClass("alpaca-hidden");

                        // if there was a previous field that needs to be cleaned up, do so now
                        if (field._oldFieldEl)
                        {
                            $(field._oldFieldEl).remove();
                        }


                        renderedCallback(field);
                    };

                    if (!Alpaca.isEmpty(callback)) {
                        callback(field, function() {
                            fin();
                        });
                    } else {
                        field.render(function() {
                            fin();
                        });
                    }

                    field.callback = callback;
                    field.renderedCallback = renderedCallback;
                }
            }

            // NOTE: this can be null if an error was thrown or if a view wasn't found
            // Actually it'd always be undefined because field is in another scope.
            // return field;
        },

        /**
         * Internal method for constructing a field instance.
         *
         * @param {Object} el The dom element to act as the container of the constructed field.
         * @param {Object} data The data to be bound into the field.
         * @param {Object} options The configuration for the field.
         * @param {Object} schema The schema for the field.
         * @param {Object|String} view The view for the field.
         * @param {Alpaca.connector} connector The field connector to be bound into the field.
         * @param {Function} errorCallback Error callback.
         *
         * @returns {Alpaca.Field} New field instance.
         */
        createFieldInstance : function(el, data, options, schema, view, connector, errorCallback) {

            // make sure options and schema are not empty
            if (Alpaca.isValEmpty(options, true)) {
                options = {};
            }
            if (Alpaca.isValEmpty(schema, true)) {
                schema = {};
            }

            // options can be a string that identifies the kind of field to construct (i.e. "text")
            if (options && Alpaca.isString(options)) {
                var fieldType = options;
                options = {};
                options.type = fieldType;
            }
            if (!options.type)
            {
                // if nothing passed in, we can try to make a guess based on the type of data
                if (!schema.type) {
                    schema.type = Alpaca.getSchemaType(data);
                }
                if (!schema.type) {
                    if (data && Alpaca.isArray(data)) {
                        schema.type = "array";
                    }
                    else {
                        schema.type = "object"; // fallback
                    }
                }

                // using what we now about schema, try to guess the type
                options.type = Alpaca.guessOptionsType(schema);
            }
            // find the field class registered for this field type
            var FieldClass = Alpaca.getFieldClass(options.type);
            if (!FieldClass) {
                errorCallback({
                    "message":"Unable to find field class for type: " + options.type,
                    "reason": "FIELD_INSTANTIATION_ERROR"
                });
                return null;
            }
            // if we have data, bind it in
            return new FieldClass(el, data, options, schema, view, connector, errorCallback);
        },

        /**
         * Provides a backwards-compatible version of the former jQuery 1.8.3 parseJSON function (this was changed
         * for jQuery 1.9.0 and introduces all kinds of issues).
         *
         * @param text
         */
        parseJSON: function(text)
        {
            if (!text) {
                return null;
            }

            return $.parseJSON(text);
        },

        /**
         * Compiles all of the views, normalizing them for use by Alpaca.
         * Also compiles any templates that the views may reference.
         *
         * @param cb the callback that gets fired once compilation has ended
         */
        compile: function(cb, errorCallback)
        {
            var self = this;

            // var t1 = new Date().getTime();

            var report = {
                "errors": [],
                "count": 0,
                "successCount": 0
            };

            var finalCallback = function(normalizedViews)
            {
                // var t2 = new Date().getTime();
                // console.log("Compilation Exited with " + report.errors.length + " errors in: " + (t2-t1)+ " ms");

                if (report.errors.length === 0)
                {
                    // success!

                    // copy our views into the normalized set
                    for (var k in normalizedViews)
                    {
                        self.normalizedViews[k] = normalizedViews[k];
                    }
                }

                cb(report);
            };



            ////////////////////////////////////////////////////////////////////////////////////////////////
            //
            // VIEW TEMPLATE COMPILATION
            //
            ////////////////////////////////////////////////////////////////////////////////////////////////

            // for all of the views (the original ones, not the compiled ones), walk through them and find any
            // and all templates that need to be compiled, compile them, etc.

            // this callback is fired when a compilation either fails or succeeds
            // if it fails, err is set, otherwise cacheKey has the
            var viewCompileCallback = function(normalizedViews, err, view, cacheKey, totalCalls)
            {
                var viewId = view.id;

                report.count++;
                if (err)
                {
                    report.errors.push({
                        "view": viewId,
                        "cacheKey": cacheKey,
                        "err": err
                    });
                }
                else
                {
                    report.successCount++;
                }

                if (report.count == totalCalls) // jshint ignore:line
                {
                    finalCallback(normalizedViews);
                }
            };

            var compileViewTemplate = function(normalizedViews, view, scopeType, scopeId, templateId, template, totalCalls)
            {
                var cacheKey = Alpaca.makeCacheKey(view.id, scopeType, scopeId, templateId);

                // assume handlebars as the engine we'll use
                var engineType = "text/x-handlebars-template";

                /**
                 * The template can be specified as an object to explicitly define the type of engine to use.
                 */
                if (template && Alpaca.isObject(template))
                {
                    engineType = template.type;

                    // if this is a precompiled template, swap cache keys
                    if (template.cacheKey) {
                        cacheKey = template.cacheKey;
                    }

                    template = template.template;
                }

                /**
                 * If template is a string, then it is either some text that we can treat as a template or it is
                 * a URL that we should dynamically load and treat the result as a template.  It may also be a
                 * CSS selector used to locate something within the document that we should load text from.
                 */
                if (template && typeof(template) === "string")
                {
                    var x = template.toLowerCase();
                    if (Alpaca.isUri(x))
                    {
                        // we assume this is a URL and let the template engine deal with it
                    }
                    else if (template && ((template.indexOf("#") === 0) || (template.indexOf(".") === 0)))
                    {
                        // support for jQuery selectors
                        var domEl = $(template);

                        engineType = $(domEl).attr("type");
                        template = $(domEl).html();
                    }
                    else if (template)
                    {
                        // check if it is an existing template referenced by template name
                        var existingTemplate = view.templates[template];
                        if (existingTemplate)
                        {
                            template = existingTemplate;
                        }
                    }
                }

                // if we don't have an engine type here, throw
                if (!engineType)
                {
                    Alpaca.logError("Engine type was empty");

                    var err = new Error("Engine type was empty");
                    viewCompileCallback(normalizedViews, err, view, cacheKey, totalCalls);

                    return;
                }

                // look up the engine
                var engine = Alpaca.TemplateEngineRegistry.find(engineType);
                if (!engine)
                {
                    Alpaca.logError("Cannot find template engine for type: " + type);

                    var err = new Error("Cannot find template engine for type: " + type);
                    viewCompileCallback(normalizedViews, err, view, cacheKey, totalCalls);

                    return;
                }

                // if template === true, then this indicates that the template is pre-compiled.
                if (template === true)
                {
                    if (engine.isCached(cacheKey))
                    {
                        // all good
                        viewCompileCallback(normalizedViews, null, view, cacheKey, totalCalls);
                        return;
                    }
                    else
                    {
                        // uh oh, claims to be precompiled, but the templating engine doesn't know about it
                        var errString = "View configuration for view: " + view.id + " claims to have precompiled template for cacheKey: " + cacheKey + " but it could not be found";
                        Alpaca.logError(errString);

                        viewCompileCallback(normalizedViews, new Error(errString), view, cacheKey, totalCalls);

                        return;
                    }
                }

                // check if engine already has this cached
                // this might be from a previous compilation step
                if (engine.isCached(cacheKey))
                {
                    // already compiled, so skip
                    viewCompileCallback(normalizedViews, null, view, cacheKey, totalCalls);
                    return;
                }

                // compile the template
                engine.compile(cacheKey, template, function(err) {
                    viewCompileCallback(normalizedViews, err, view, cacheKey, totalCalls);
                });
            };

            var compileTemplates = function(normalizedViews)
            {
                // walk through all normalized views that we're interested in and compile the templates within
                var functionArray = [];
                for (var viewId in normalizedViews)
                {
                    var view = normalizedViews[viewId];

                    // view templates
                    if (view.templates)
                    {
                        for (var templateId in view.templates)
                        {
                            var template = view.templates[templateId];

                            functionArray.push((function(normalizedViews, view, scopeType, scopeId, templateId, template) {
                                return function(totalCalls) {
                                    compileViewTemplate(normalizedViews, view, scopeType, scopeId, templateId, template, totalCalls);
                                };
                            })(normalizedViews, view, "view", view.id, templateId, template));
                        }
                    }

                    // field level templates
                    if (view.fields)
                    {
                        for (var path in view.fields)
                        {
                            if (view.fields[path].templates)
                            {
                                for (var templateId in view.fields[path].templates)
                                {
                                    var template = view.fields[path].templates[templateId];

                                    functionArray.push((function(normalizedViews, view, scopeType, scopeId, templateId, template) {
                                        return function(totalCalls) {
                                            compileViewTemplate(normalizedViews, view, scopeType, scopeId, templateId, template, totalCalls);
                                        };
                                    })(normalizedViews, view, "field", path, templateId, template));
                                }
                            }
                        }
                    }

                    // layout template
                    if (view.layout && view.layout.template)
                    {
                        var template = view.layout.template;

                        functionArray.push((function(normalizedViews, view, scopeType, scopeId, templateId, template) {
                            return function(totalCalls) {
                                compileViewTemplate(normalizedViews, view, scopeType, scopeId, templateId, template, totalCalls);
                            };
                        })(normalizedViews, view, "layout", "layout", "layoutTemplate", template));
                    }

                    // global template
                    if (view.globalTemplate)
                    {
                        var template = view.globalTemplate;

                        functionArray.push((function(normalizedViews, view, scopeType, scopeId, templateId, template) {
                            return function(totalCalls) {
                                compileViewTemplate(normalizedViews, view, scopeType, scopeId, templateId, template, totalCalls);
                            };
                        })(normalizedViews, view, "global", "global", "globalTemplate", template));
                    }
                }

                // now invoke all of the functions
                // this tells each template to compile
                var totalCalls = functionArray.length;
                for (var i = 0; i < functionArray.length; i++)
                {
                    functionArray[i](totalCalls);
                }
            };

            var normalizeViews = function()
            {
                // the views that we're going to normalize
                var normalizedViews = {};
                var normalizedViewCount = 0;

                // some initial self-assurance to make sure we have the normalizedViews map set up
                if (!Alpaca.normalizedViews) {
                    Alpaca.normalizedViews = {};
                }
                self.normalizedViews = Alpaca.normalizedViews;

                // walk through all of our views
                for (var viewId in self.views)
                {
                    // if the view is already normalized on the Alpaca global, we do not bother
                    if (!Alpaca.normalizedViews[viewId])
                    {
                        var normalizedView = new Alpaca.NormalizedView(viewId);
                        if (normalizedView.normalize(self.views))
                        {
                            normalizedViews[viewId] = normalizedView;
                            normalizedViewCount++;
                        }
                        else
                        {
                            return Alpaca.throwErrorWithCallback("View normalization failed, cannot initialize Alpaca.  Please check the error logs.", errorCallback);
                        }
                    }
                }

                if (normalizedViewCount > 0)
                {
                    compileTemplates(normalizedViews);
                }
                else
                {
                    finalCallback(normalizedViews);
                }
            };

            normalizeViews();
        },

        /**
         * Looks up the proper template to be used to handle a requested template id for a view and a field.
         * Performs an override lookup to find the proper template.
         *
         * Hands back a descriptor of everything that is known about the resolved template.
         *
         * @param view
         * @param templateId
         * @param field
         * @return {Object}
         */
        getTemplateDescriptor: function(view, templateId, field)
        {
            var descriptor = null;

            //////////////////////////////////////////////////////////////////////////////////////////////////
            //
            // FIGURE OUT WHERE THE TEMPLATE IS IN THE VIEW CONFIGURATION (RESPECTING FIELD OVERRIDES)
            //
            //////////////////////////////////////////////////////////////////////////////////////////////////

            var _engineId = null;
            var _cacheKey = null;

            // is this template defined at the view level?
            if (view.templates && view.templates[templateId])
            {
                _cacheKey = Alpaca.makeCacheKey(view.id, "view", view.id, templateId);

                // is this a precompiled template?
                var t = view.templates[templateId];
                if (Alpaca.isObject(t) && t.cacheKey)
                {
                    _cacheKey = t.cacheKey;
                }
            }

            // OVERRIDE: is this template overridden at the field level?
            if (field && field.path)
            {
                var path = field.path;

                if (view && view.fields)
                {
                    // let's try different
                    // combinations of permutated and generalized lookups to see if we can find a best fit
                    //
                    // for example, if they path is: /first[1]/second[2]/third
                    // we can look for the following generalized permutations in descending order of applicability:
                    //
                    //    /first[1]/second[2]/third
                    //    /first[1]/second/third
                    //    /first/second[2]/third
                    //    /first/second/third
                    //
                    if (path && path.length > 1)
                    {
                        var collectMatches = function(tokens, index, matches)
                        {
                            // if we hit the end of the array, we're done
                            if (index == tokens.length)
                            {
                                return;
                            }

                            // copy the tokens
                            var newTokens = tokens.slice();

                            // if we have an array in the path at this element, update newTokens to reflect
                            var toggled = false;
                            var token = tokens[index];
                            var x1 = token.indexOf("[");
                            if (x1 > -1)
                            {
                                token = token.substring(0, x1);
                                toggled = true;
                            }
                            newTokens[index] = token;

                            // see if we can find a match for this path
                            var _path = newTokens.join("/");

                            if (view.fields[_path] && view.fields[_path].templates && view.fields[_path].templates[templateId])
                            {
                                var _ck = Alpaca.makeCacheKey(view.id, "field", _path, templateId);
                                if (_ck)
                                {
                                    matches.push({
                                        "path": _path,
                                        "cacheKey": _ck
                                    });
                                }
                            }

                            // proceed down the token array
                            collectMatches(tokens, index + 1, matches);

                            // if we toggled, proceed with that as well
                            if (toggled) {
                                collectMatches(newTokens, index + 1, matches);
                            }
                        };

                        var tokens = path.split("/");
                        var matches = [];
                        collectMatches(tokens, 0, matches);

                        if (matches.length > 0)
                        {
                            _cacheKey = matches[0].cacheKey;
                        }
                    }
                }
            }

            /*
            // OVERRIDE: is this template defined at the field level?
            if (field && field.path)
            {
                var path = field.path;

                if (view && view.fields && view.fields[path] && view.fields[path].templates && view.fields[path].templates[templateId])
                {
                    _cacheKey = Alpaca.makeCacheKey(view.id, "field", path, templateId);
                }
            }
            */

            // OVERRIDE: is this template defined at the global level?
            if (templateId === "globalTemplate" || templateId === "global")
            {
                _cacheKey = Alpaca.makeCacheKey(view.id, "global", "global", "globalTemplate");
            }

            // OVERRIDE: is this template defined at the layout level?
            if (templateId === "layoutTemplate" || templateId === "layout")
            {
                _cacheKey = Alpaca.makeCacheKey(view.id, "layout", "layout", "layoutTemplate");
            }

            if (_cacheKey)
            {
                // figure out which engine has this
                var engineIds = Alpaca.TemplateEngineRegistry.ids();
                for (var i = 0; i < engineIds.length; i++)
                {
                    var engineId = engineIds[i];

                    var engine = Alpaca.TemplateEngineRegistry.find(engineId);
                    if (engine.isCached(_cacheKey))
                    {
                        _engineId = engineId;
                        break;
                    }
                }

                if (_engineId)
                {
                    descriptor = {
                        "engine": _engineId,
                        "cacheKey": _cacheKey
                    };
                }
            }

            return descriptor;
        },

        /**
         * Executes a template and returns a DOM element.
         *
         * @param templateDescriptor
         * @param model
         */
        tmpl: function(templateDescriptor, model)
        {
            var html = Alpaca.tmplHtml(templateDescriptor, model);

            return Alpaca.safeDomParse(html);
        },

        /**
         * Executes a template and returns HTML.
         *
         * @param templateDescriptor
         * @param model
         */
        tmplHtml: function(templateDescriptor, model)
        {
            if (!model)
            {
                model = {};
            }

            var engineType = templateDescriptor.engine;

            var engine = Alpaca.TemplateEngineRegistry.find(engineType);
            if (!engine)
            {
                return Alpaca.throwDefaultError("Cannot find template engine for type: " + engineType);
            }

            // execute the template
            var cacheKey = templateDescriptor.cacheKey;
            var html = engine.execute(cacheKey, model, function(err) {

                var str = JSON.stringify(err);
                if (err.message) {
                    str = err.message;
                }
                return Alpaca.throwDefaultError("The compiled template: " + cacheKey + " failed to execute: " + str);
            });

            return html;
        }

    });


    ///////////////////////////////////////////////////////////////////////////////////////////
    //
    // LOGGER
    //
    ///////////////////////////////////////////////////////////////////////////////////////////

    Alpaca.DEBUG = 0;
    Alpaca.INFO = 1;
    Alpaca.WARN = 2;
    Alpaca.ERROR = 3;

    // by default, logging only shows warnings and above
    // to debug, set Alpaca.logLevel = Alpaca.DEBUG
    Alpaca.logLevel = Alpaca.WARN;

    Alpaca.logDebug = function(obj) {
        Alpaca.log(Alpaca.DEBUG, obj);
    };
    Alpaca.logInfo = function(obj) {
        Alpaca.log(Alpaca.INFO, obj);
    };
    Alpaca.logWarn = function(obj) {
        Alpaca.log(Alpaca.WARN, obj);
    };
    Alpaca.logError = function(obj) {
        Alpaca.log(Alpaca.ERROR, obj);
    };

    Alpaca.LOG_METHOD_MAP = {
        0: 'debug',
        1: 'info',
        2: 'warn',
        3: 'error'
    };

    Alpaca.log = function(level, obj) {

        if (Alpaca.logLevel <= level)
        {
            var method = Alpaca.LOG_METHOD_MAP[level];

            if (typeof console !== 'undefined' && console[method])
            {
                if ("debug" === method) {
                    console.debug(obj);
                }
                else if ("info" === method) {
                    console.info(obj);
                }
                else if ("warn" === method) {
                    console.warn(obj);
                }
                else if ("error" === method) {
                    console.error(obj);
                }
                else {
                    console.log(obj);
                }
            }
        }
    };

    Alpaca.checked = function(el, value)
    {
        return Alpaca.attrProp(el, "checked", value);
    };

    Alpaca.disabled = function(el, value)
    {
        return Alpaca.attrProp(el, "disabled", value);
    };

    Alpaca.attrProp = function(el, name, value)
    {
        if (typeof(value) !== "undefined")
        {
            // jQuery 1.6+
            if ($(el).prop)
            {
                $(el).prop(name, value);
            }
            else
            {
                if (value) {
                    $(el).attr(name, value);
                } else {
                    $(el).removeAttr(name);
                }
            }
        }

        // now return the correct value

        // jQuery 1.6+
        if ($(el).prop) {
            return $(el).prop(name);
        }

        return $(el).attr(name);
    };

    Alpaca.loadRefSchemaOptions = function(topField, referenceId, callback)
    {
        if (!referenceId)
        {
            callback();
        }
        else if (referenceId === "#")
        {
            // this is the uri of the current schema document
            callback(topField.schema, topField.options);
        }
        else if (referenceId.indexOf("#/") === 0)
        {
            // this is a property path relative to the root of the current schema
            var defId = referenceId.substring(2);

            // split into tokens
            var tokens = defId.split("/");

            var defSchema = topField.schema;
            for (var i = 0; i < tokens.length; i++)
            {
                var token = tokens[i];

                // schema
                if (defSchema[token])
                {
                    defSchema = defSchema[token];
                }
                else if (defSchema.properties && defSchema.properties[token])
                {
                    defSchema = defSchema.properties[token];
                }
                else if (defSchema.definitions && defSchema.definitions[token])
                {
                    defSchema = defSchema.definitions[token];
                }
                else
                {
                    defSchema = null;
                    break;
                }
            }

            var defOptions = topField.options;
            for (var i = 0; i < tokens.length; i++)
            {
                var token = tokens[i];

                // options
                if (defOptions[token])
                {
                    defOptions = defOptions[token];
                }
                else if (defOptions.fields && defOptions.fields[token])
                {
                    defOptions = defOptions.fields[token];
                }
                else if (defOptions.definitions && defOptions.definitions[token])
                {
                    defOptions = defOptions.definitions[token];
                }
                else
                {
                    defOptions = null;
                    break;
                }
            }

            callback(defSchema, defOptions);
        }
        else if (referenceId.indexOf("#") === 0)
        {
            // this is the ID of a node in the current schema document

            // walk the current document schema until we find the referenced node (using id property)
            var resolution = Alpaca.resolveReference(topField.schema, topField.options, referenceId);
            if (resolution)
            {
                callback(resolution.schema, resolution.options);
            }
            else
            {
                // nothing
                callback();
            }
        }
        else
        {
            // the reference is considered to be a URI with or without a "#" in it to point to a specific location in
            // the target schema

            var referenceParts = Alpaca.pathParts(referenceId);

            topField.connector.loadReferenceSchema(referenceParts.path, function(schema) {
                topField.connector.loadReferenceOptions(referenceParts.path, function(options) {

                    if (referenceParts.id)
                    {
                        var resolution = Alpaca.resolveReference(schema, options, referenceParts.id);
                        if (resolution)
                        {
                            schema = resolution.schema;
                            options = resolution.options;
                        }
                    }

                    callback(schema, options);

                }, function() {
                    callback(schema);
                });
            }, function() {
                callback();
            });
        }
    };

    Alpaca.DEFAULT_ERROR_CALLBACK = function(error)
    {
        if (error && error.message)
        {
            // log to debug
            Alpaca.logError(JSON.stringify(error));

            // error out
            throw new Error("Alpaca caught an error with the default error handler: " + JSON.stringify(error));

        }
    };

    /**
     * Default error callback handler for Alpaca.
     *
     * This error handler will be used if an "error" argument isn't passed in to the constructor for an Alpaca field.
     *
     * @param error
     */
    Alpaca.defaultErrorCallback = Alpaca.DEFAULT_ERROR_CALLBACK;

    /**
     * Utility method that throws a general error and dispatches to the default error handler.
     *
     * @param message
     */
    Alpaca.throwDefaultError = function(message)
    {
        if (message && Alpaca.isObject(message))
        {
            message = JSON.stringify(message);
        }

        var err = {
            "message": message
        };

        Alpaca.defaultErrorCallback(err);
    };

    /**
     * Utility method that throws an error back to the given callback handler.
     *
     * @param message
     * @param errorCallback
     */
    Alpaca.throwErrorWithCallback = function(message, errorCallback)
    {
        if (message && Alpaca.isObject(message))
        {
            message = JSON.stringify(message);
        }

        var err = {
            "message": message
        };

        if (errorCallback)
        {
            errorCallback(err);
        }
        else
        {
            Alpaca.defaultErrorCallback(err);
        }
    };


    /**
     * Given a base field, walks the schema, options and data forward until it
     * discovers the given reference.
     *
     * @param schema
     * @param options
     * @param referenceId
     */
    Alpaca.resolveReference = function(schema, options, referenceId)
    {
        if ((schema.id === referenceId) || (("#" + schema.id) === referenceId)) // jshint ignore:line
        {
            var result = {};
            if (schema) {
                result.schema = schema;
            }
            if (options) {
                result.options = options;
            }

            return result;
        }
        else
        {
            if (schema.properties)
            {
                for (var propertyId in schema.properties)
                {
                    var subSchema = schema.properties[propertyId];
                    var subOptions = null;
                    if (options && options.fields && options.fields[propertyId])
                    {
                        subOptions = options.fields[propertyId];
                    }

                    var x = Alpaca.resolveReference(subSchema, subOptions, referenceId);
                    if (x)
                    {
                        return x;
                    }
                }
            }
            else if (schema.items)
            {
                var subSchema = schema.items;
                var subOptions = null;
                if (options && options.items)
                {
                    subOptions = options.items;
                }

                var x = Alpaca.resolveReference(subSchema, subOptions, referenceId);
                if (x)
                {
                    return x;
                }
            }
        }

        return null;
    };

    $.alpaca = window.Alpaca = Alpaca;

    /**
     * jQuery friendly method for binding a field to a DOM element.
     * @ignore
     */
    $.fn.alpaca = function() {
        var args = Alpaca.makeArray(arguments);

        // append this into the front of args
        var newArgs = [].concat(this, args);

        // invoke Alpaca against current element
        var ret = Alpaca.apply(this, newArgs);
        if (typeof(ret) === "undefined") {
            // as per jQuery's pattern, assume we hand back $el
            ret = $(this);
        }

        return ret;
    };

    /**
     * @ignore
     * @param nocloning
     */
    $.fn.outerHTML = function(nocloning) {
        if (nocloning) {
            return $("<div></div>").append(this).html();
        } else {
            return $("<div></div>").append(this.clone()).html();
        }
    };

    /**
     * @ignore
     * @param to
     */
    $.fn.swapWith = function(to) {
        return this.each(function() {
            var copy_to = $(to).clone();
            var copy_from = $(this).clone();
            $(to).replaceWith(copy_from);
            $(this).replaceWith(copy_to);
        });
    };

    $.fn.attrProp = function(name, value) {
        return Alpaca.attrProp($(this), name, value);
    };

    /**
     * When dom elements are removed, we fire the special "destroyed" event to allow for late cleanup of any Alpaca code
     * that might be in-memory and linked to the dom element.
     *
     * @type {Object}
     */
    $.event.special.destroyed = {
        remove: function(o) {
            if (o.handler) {
                o.handler();
            }
        }
    };

    Alpaca.pathParts = function(resource)
    {
        if (typeof(resource) !== "string")
        {
            return resource;
        }

        // convert string to object
        var resourcePath = resource;
        var resourceId = null;
        var i = resourcePath.indexOf("#");
        if (i > -1)
        {
            resourceId = resourcePath.substring(i + 1);
            resourcePath = resourcePath.substring(0, i);
        }

        if (Alpaca.endsWith(resourcePath, "/")) {
            resourcePath = resourcePath.substring(0, resourcePath.length - 1);
        }

        var parts = {};
        parts.path = resourcePath;

        if (resourceId)
        {
            parts.id = resourceId;
        }

        return parts;
    };

    /**
     * Resolves a field by its property id.
     *
     * @param containerField
     * @param propertyId
     * @returns {null}
     */
    Alpaca.resolveField = function(containerField, propertyIdOrReferenceId)
    {
        var resolvedField = null;

        if (typeof(propertyIdOrReferenceId) === "string")
        {
            if (propertyIdOrReferenceId.indexOf("#/") === 0 && propertyId.length > 2)
            {
                // TODO: path based lookup?
            }
            else if (propertyIdOrReferenceId === "#" || propertyIdOrReferenceId === "#/")
            {
                resolvedField = containerField;
            }
            else if (propertyIdOrReferenceId.indexOf("#") === 0)
            {
                // reference id lookup

                // find the top field
                var topField = containerField;
                while (topField.parent)
                {
                    topField = topField.parent;
                }

                var referenceId = propertyIdOrReferenceId.substring(1);

                resolvedField = Alpaca.resolveFieldByReference(topField, referenceId);

            }
            else
            {
                // property lookup
                resolvedField = containerField.childrenByPropertyId[propertyIdOrReferenceId];
            }
        }

        return resolvedField;
    };

    /**
     * Resolves a field based on its "reference id" relative to a top level field.  This walks down the field tree and
     * looks for matching schema.id references to find the matching field.
     *
     * @param field
     * @param referenceId
     */
    Alpaca.resolveFieldByReference = function(field, referenceId)
    {
        if (field.schema && field.schema.id == referenceId) // jshint ignore:line
        {
            return field;
        }
        else
        {
            if (field.children && field.children.length > 0)
            {
                for (var i = 0; i < field.children.length; i++)
                {
                    var child = field.children[i];

                    var resolved = Alpaca.resolveFieldByReference(child, referenceId);
                    if (resolved)
                    {
                        return resolved;
                    }
                }
            }
        }

        return null;
    };

    /**
     * Determines whether any of the elements of the first argument are equal to the elements of the second argument.
     *
     * @param first either a scalar value or a container (object or array) of values
     * @param second either a scalar value or a container (object or array) of values
     * @returns whether at least one match is found
     */
    Alpaca.anyEquality = function(first, second)
    {
        // copy values from first into a values lookup map
        var values = {};
        if (typeof(first) === "object" || Alpaca.isArray(first))
        {
            for (var k in first)
            {
                values[first[k]] = true;
            }
        }
        else
        {
            values[first] = true;
        }

        var result = false;

        // check values from second against the lookup map
        if (typeof(second) === "object" || Alpaca.isArray(second))
        {
            for (var k in second)
            {
                var v = second[k];

                if (values[v])
                {
                    result = true;
                    break;
                }
            }
        }
        else
        {
            result = values[second];
        }

        return result;
    };

    Alpaca.series = function(funcs, callback)
    {
        async.series(funcs, function() {
            callback();
        });
    };

    Alpaca.parallel = function(funcs, callback)
    {
        async.parallel(funcs, function() {
            callback();
        });
    };

    Alpaca.nextTick = function(f)
    {
        async.nextTick(function() {
            f();
        });
    };

    /**
     * Compiles the validation context for the chain of fields from the top-most down to the given field.
     * Each validation context entry is a field in the chain which describes the following:
     *
     *    {
     *       "field": the field instance,
     *       "before": the before value (boolean)
     *       "after": the after value (boolean)
     *       "validated": (optional) if the field validated (switches state from invalid to valid)
     *       "invalidated": (optional) if the field invalidated (switches state from valid to invalid)
     *    }
     *
     * This hands back an array of entries with the child field first and continuing up the parent chain.
     * The last entry in the array is the top most parent field.
     *
     * The callback is fired with the assembled context, allowing for asynchronous validation to run.
     *
     * @param field
     * @param callback
     *
     * @returns {Array}
     */
    Alpaca.compileValidationContext = function(field, callback)
    {
        // walk up the parent tree until we find the top-most control
        // this serves as our starting point for downward validation
        var chain = [];
        var parent = field;
        do
        {
            if (!parent.isValidationParticipant())
            {
                parent = null;
            }

            if (parent)
            {
                chain.push(parent);
            }

            if (parent)
            {
                parent = parent.parent;
            }
        }
        while (parent);

        // reverse so top most parent is first
        chain.reverse();

        // compilation context
        var context = [];

        // internal method that sets validation for a single field
        var f = function(chain, context, done)
        {
            if (!chain || chain.length === 0)
            {
                return done();
            }

            var current = chain[0];

            var entry = {};
            entry.id = current.getId();
            entry.field = current;
            entry.path = current.path;

            // BEFORE field validation status
            var beforeStatus = current.isValid();
            if (current.isContainer())
            {
                beforeStatus = current.isValid(true);
            }

            entry.before = beforeStatus;

            var ourselvesHandler = function(current, entry, weFinished)
            {
                var previouslyValidated = current._previouslyValidated;

                // now run the validation for just this one field
                current.validate();

                // apply custom validation (if exists) for just this one field
                // if it doesn't exist, this just fires the callback
                current._validateCustomValidator(function() {

                    // AFTER field validation state
                    var afterStatus = current.isValid();
                    if (current.isContainer())
                    {
                        afterStatus = current.isValid(true);
                    }

                    entry.after = afterStatus;

                    // if this field's validation status flipped, fire triggers
                    entry.validated = false;
                    entry.invalidated = false;
                    if (!beforeStatus && afterStatus)
                    {
                        entry.validated = true;
                    }
                    else if (beforeStatus && !afterStatus)
                    {
                        entry.invalidated = true;
                    }
                    // special case for fields that have not yet been validated
                    else if (!previouslyValidated && !afterStatus)
                    {
                        entry.invalidated = true;
                    }

                    entry.container = current.isContainer();
                    entry.valid = entry.after;

                    context.push(entry);

                    weFinished();
                });
            };

            // step down into chain
            // we do children before ourselves
            if (chain.length > 1)
            {
                // copy array
                var childChain = chain.slice(0);
                childChain.shift();
                f(childChain, context, function() {
                    ourselvesHandler(current, entry, function() {
                        done();
                    });
                });
            }
            else
            {
                ourselvesHandler(current, entry, function() {
                    done();
                })
            }
        };

        f(chain, context, function() {
            callback(context);
        });
    };

    Alpaca.updateValidationStateForContext = function(view, context)
    {
        // walk through each and flip any DOM UI based on entry state
        for (var i = 0; i < context.length; i++)
        {
            var entry = context[i];
            var field = entry.field;

            // clear out previous validation UI markers
            field.getFieldEl().removeClass("alpaca-invalid alpaca-invalid-hidden alpaca-valid");
            field.fireCallback("clearValidity");

            // valid?
            if (entry.valid)
            {
                field.getFieldEl().addClass("alpaca-field-valid");
                field.fireCallback("valid");
            }
            else
            {
                // we don't markup invalidation state for readonly fields
                if (!field.options.readonly || Alpaca.showReadOnlyInvalidState)
                {
                    var hidden = false;
                    if (field.hideInitValidationError) {
                        hidden = true;
                    }

                    field.fireCallback("invalid", hidden);

                    field.getFieldEl().addClass("alpaca-invalid");
                    if (hidden)
                    {
                        field.getFieldEl().addClass("alpaca-invalid-hidden");
                    }
                }
                else
                {
                    // this field is invalid and is also read-only, so we're not supposed to inform the end-user
                    // within the UI (since there is nothing we can do about it)
                    // here, we log a message to debug to inform the developer
                    Alpaca.logWarn("The field (id=" + field.getId() + ", title=" + field.getTitle() + ", path=" + field.path + ") is invalid and also read-only");
                }
            }

            // TRIGGERS
            if (entry.validated)
            {
                Alpaca.later(25, this, function() {
                    field.trigger("validated");
                });
            }
            else if (entry.invalidated)
            {
                Alpaca.later(25, this, function() {
                    field.trigger("invalidated");
                });
            }

            // Allow for the message to change
            if (field.options.showMessages)
            {
                if (!field.initializing)
                {
                    // we don't markup invalidation state for readonly fields
                    if (!field.options.readonly || Alpaca.showReadOnlyInvalidState)
                    {
                        // messages
                        var messages = [];
                        for (var messageId in field.validation)
                        {
                            if (!field.validation[messageId]["status"])
                            {
                                messages.push({
                                    "id": messageId,
                                    "message": field.validation[messageId]["message"]
                                });
                            }
                        }

                        field.displayMessage(messages, field.valid);
                    }
                }
            }
        }
    };

    /**
     * Runs the given function over the field and all of its children recursively.
     *
     * @param field
     * @param fn
     */
    Alpaca.fieldApplyFieldAndChildren = function(field, fn)
    {
        fn(field);

        // if the field has children, go depth first
        if (field.children && field.children.length > 0)
        {
            for (var i = 0; i < field.children.length; i++)
            {
                Alpaca.fieldApplyFieldAndChildren(field.children[i], fn);
            }
        }
    };

    /**
     * Replaces all instances of the string <find> with the replacement text <replace>.
     *
     * @param text
     * @param find
     * @param replace
     * @returns {*}
     */
    Alpaca.replaceAll = function(text, find, replace)
    {
        return text.replace(new RegExp(find, 'g'), replace);
    };

    Alpaca.asArray = function(thing)
    {
        if (!Alpaca.isArray(thing))
        {
            var array = [];
            array.push(thing);

            return array;
        }

        return thing;
    };














    /////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // ASYNC
    //
    // Here we provide a reduced version of the wonderful async library.  This is entirely inline and
    // will have no bearing on any external dependencies on async.
    //
    // https://github.com/caolan/async
    // Copyright (c) 2010 Caolan McMahon
    //
    /////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////

    /*global setImmediate: false, setTimeout: false, console: false */
    (function () {

        var async = {};

        // global on the server, window in the browser
        var root, previous_async;

        root = this;
        if (root != null) {
            previous_async = root.async;
        }

        async.noConflict = function () {
            root.async = previous_async;
            return async;
        };

        function only_once(fn) {
            var called = false;
            return function() {
                if (called) {
                    throw new Error("Callback was already called.");
                }
                called = true;
                fn.apply(root, arguments);
            };
        }

        //// cross-browser compatiblity functions ////

        var _each = function (arr, iterator) {
            if (arr.forEach) {
                return arr.forEach(iterator);
            }
            for (var i = 0; i < arr.length; i += 1) {
                iterator(arr[i], i, arr);
            }
        };

        var _map = function (arr, iterator) {
            if (arr.map) {
                return arr.map(iterator);
            }
            var results = [];
            _each(arr, function (x, i, a) {
                results.push(iterator(x, i, a));
            });
            return results;
        };

        var _reduce = function (arr, iterator, memo) {
            if (arr.reduce) {
                return arr.reduce(iterator, memo);
            }
            _each(arr, function (x, i, a) {
                memo = iterator(memo, x, i, a);
            });
            return memo;
        };

        var _keys = function (obj) {
            if (Object.keys) {
                return Object.keys(obj);
            }
            var keys = [];
            for (var k in obj) {
                if (obj.hasOwnProperty(k)) {
                    keys.push(k);
                }
            }
            return keys;
        };

        //// exported async module functions ////

        //// nextTick implementation with browser-compatible fallback ////
        if (typeof process === 'undefined' || !(process.nextTick)) {
            if (typeof setImmediate === 'function') {
                async.nextTick = function (fn) {
                    // not a direct alias for IE10 compatibility
                    setImmediate(fn);
                };
                async.setImmediate = async.nextTick;
            }
            else {
                async.nextTick = function (fn) {
                    setTimeout(fn, 0); // jshint ignore:line
                };
                async.setImmediate = async.nextTick;
            }
        }
        else {
            async.nextTick = process.nextTick;
            if (typeof setImmediate !== 'undefined') {
                async.setImmediate = function (fn) {
                    // not a direct alias for IE10 compatibility
                    setImmediate(fn);
                };
            }
            else {
                async.setImmediate = async.nextTick;
            }
        }

        async.each = function (arr, iterator, callback) {
            callback = callback || function () {};
            if (!arr.length) {
                return callback();
            }
            var completed = 0;
            _each(arr, function (x) {
                iterator(x, only_once(function (err) {
                    if (err) {
                        callback(err);
                        callback = function () {};
                    }
                    else {
                        completed += 1;
                        if (completed >= arr.length) {
                            callback(null);
                        }
                    }
                }));
            });
        };
        async.forEach = async.each;

        async.eachSeries = function (arr, iterator, callback) {
            callback = callback || function () {};
            if (!arr.length) {
                return callback();
            }
            var completed = 0;
            var iterate = function () {
                iterator(arr[completed], function (err) {
                    if (err) {
                        callback(err);
                        callback = function () {};
                    }
                    else {
                        completed += 1;
                        if (completed >= arr.length) {
                            callback(null);
                        }
                        else {
                            iterate();
                        }
                    }
                });
            };
            iterate();
        };
        async.forEachSeries = async.eachSeries;

        async.eachLimit = function (arr, limit, iterator, callback) {
            var fn = _eachLimit(limit);
            fn.apply(null, [arr, iterator, callback]);
        };
        async.forEachLimit = async.eachLimit;

        var _eachLimit = function (limit) {

            return function (arr, iterator, callback) {
                callback = callback || function () {};
                if (!arr.length || limit <= 0) {
                    return callback();
                }
                var completed = 0;
                var started = 0;
                var running = 0;

                (function replenish () {
                    if (completed >= arr.length) {
                        return callback();
                    }

                    while (running < limit && started < arr.length) {
                        started += 1;
                        running += 1;
                        iterator(arr[started - 1], function (err) {
                            if (err) {
                                callback(err);
                                callback = function () {};
                            }
                            else {
                                completed += 1;
                                running -= 1;
                                if (completed >= arr.length) {
                                    callback();
                                }
                                else {
                                    replenish();
                                }
                            }
                        });
                    }
                })();
            };
        };


        var doParallel = function (fn) {
            return function () {
                var args = Array.prototype.slice.call(arguments);
                return fn.apply(null, [async.each].concat(args));
            };
        };
        var doParallelLimit = function(limit, fn) {
            return function () {
                var args = Array.prototype.slice.call(arguments);
                return fn.apply(null, [_eachLimit(limit)].concat(args));
            };
        };
        var doSeries = function (fn) {
            return function () {
                var args = Array.prototype.slice.call(arguments);
                return fn.apply(null, [async.eachSeries].concat(args));
            };
        };


        var _asyncMap = function (eachfn, arr, iterator, callback) {
            var results = [];
            arr = _map(arr, function (x, i) {
                return {index: i, value: x};
            });
            eachfn(arr, function (x, callback) {
                iterator(x.value, function (err, v) {
                    results[x.index] = v;
                    callback(err);
                });
            }, function (err) {
                callback(err, results);
            });
        };
        async.map = doParallel(_asyncMap);
        async.mapSeries = doSeries(_asyncMap);
        async.mapLimit = function (arr, limit, iterator, callback) {
            return _mapLimit(limit)(arr, iterator, callback);
        };

        var _mapLimit = function(limit) {
            return doParallelLimit(limit, _asyncMap);
        };

        // reduce only has a series version, as doing reduce in parallel won't
        // work in many situations.
        async.reduce = function (arr, memo, iterator, callback) {
            async.eachSeries(arr, function (x, callback) {
                iterator(memo, x, function (err, v) {
                    memo = v;
                    callback(err);
                });
            }, function (err) {
                callback(err, memo);
            });
        };
        // inject alias
        async.inject = async.reduce;
        // foldl alias
        async.foldl = async.reduce;

        async.reduceRight = function (arr, memo, iterator, callback) {
            var reversed = _map(arr, function (x) {
                return x;
            }).reverse();
            async.reduce(reversed, memo, iterator, callback);
        };
        // foldr alias
        async.foldr = async.reduceRight;

        var _filter = function (eachfn, arr, iterator, callback) {
            var results = [];
            arr = _map(arr, function (x, i) {
                return {index: i, value: x};
            });
            eachfn(arr, function (x, callback) {
                iterator(x.value, function (v) {
                    if (v) {
                        results.push(x);
                    }
                    callback();
                });
            }, function (err) {
                callback(_map(results.sort(function (a, b) {
                    return a.index - b.index;
                }), function (x) {
                    return x.value;
                }));
            });
        };
        async.filter = doParallel(_filter);
        async.filterSeries = doSeries(_filter);
        // select alias
        async.select = async.filter;
        async.selectSeries = async.filterSeries;

        var _reject = function (eachfn, arr, iterator, callback) {
            var results = [];
            arr = _map(arr, function (x, i) {
                return {index: i, value: x};
            });
            eachfn(arr, function (x, callback) {
                iterator(x.value, function (v) {
                    if (!v) {
                        results.push(x);
                    }
                    callback();
                });
            }, function (err) {
                callback(_map(results.sort(function (a, b) {
                    return a.index - b.index;
                }), function (x) {
                    return x.value;
                }));
            });
        };
        async.reject = doParallel(_reject);
        async.rejectSeries = doSeries(_reject);

        var _detect = function (eachfn, arr, iterator, main_callback) {
            eachfn(arr, function (x, callback) {
                iterator(x, function (result) {
                    if (result) {
                        main_callback(x);
                        main_callback = function () {};
                    }
                    else {
                        callback();
                    }
                });
            }, function (err) {
                main_callback();
            });
        };
        async.detect = doParallel(_detect);
        async.detectSeries = doSeries(_detect);

        async.some = function (arr, iterator, main_callback) {
            async.each(arr, function (x, callback) {
                iterator(x, function (v) {
                    if (v) {
                        main_callback(true);
                        main_callback = function () {};
                    }
                    callback();
                });
            }, function (err) {
                main_callback(false);
            });
        };
        // any alias
        async.any = async.some;

        async.every = function (arr, iterator, main_callback) {
            async.each(arr, function (x, callback) {
                iterator(x, function (v) {
                    if (!v) {
                        main_callback(false);
                        main_callback = function () {};
                    }
                    callback();
                });
            }, function (err) {
                main_callback(true);
            });
        };
        // all alias
        async.all = async.every;

        async.sortBy = function (arr, iterator, callback) {
            async.map(arr, function (x, callback) {
                iterator(x, function (err, criteria) {
                    if (err) {
                        callback(err);
                    }
                    else {
                        callback(null, {value: x, criteria: criteria});
                    }
                });
            }, function (err, results) {
                if (err) {
                    return callback(err);
                }
                else {
                    var fn = function (left, right) {
                        var a = left.criteria, b = right.criteria;
                        return a < b ? -1 : a > b ? 1 : 0;
                    };
                    callback(null, _map(results.sort(fn), function (x) {
                        return x.value;
                    }));
                }
            });
        };

        async.auto = function (tasks, callback) {
            callback = callback || function () {};
            var keys = _keys(tasks);
            if (!keys.length) {
                return callback(null);
            }

            var results = {};

            var listeners = [];
            var addListener = function (fn) {
                listeners.unshift(fn);
            };
            var removeListener = function (fn) {
                for (var i = 0; i < listeners.length; i += 1) {
                    if (listeners[i] === fn) {
                        listeners.splice(i, 1);
                        return;
                    }
                }
            };
            var taskComplete = function () {
                _each(listeners.slice(0), function (fn) {
                    fn();
                });
            };

            addListener(function () {
                if (_keys(results).length === keys.length) {
                    callback(null, results);
                    callback = function () {};
                }
            });

            _each(keys, function (k) {
                var task = (tasks[k] instanceof Function) ? [tasks[k]]: tasks[k];
                var taskCallback = function (err) {
                    var args = Array.prototype.slice.call(arguments, 1);
                    if (args.length <= 1) {
                        args = args[0];
                    }
                    if (err) {
                        var safeResults = {};
                        _each(_keys(results), function(rkey) {
                            safeResults[rkey] = results[rkey];
                        });
                        safeResults[k] = args;
                        callback(err, safeResults);
                        // stop subsequent errors hitting callback multiple times
                        callback = function () {};
                    }
                    else {
                        results[k] = args;
                        async.setImmediate(taskComplete);
                    }
                };
                var requires = task.slice(0, Math.abs(task.length - 1)) || [];
                var ready = function () {
                    return _reduce(requires, function (a, x) {
                        return (a && results.hasOwnProperty(x));
                    }, true) && !results.hasOwnProperty(k);
                };
                if (ready()) {
                    task[task.length - 1](taskCallback, results);
                }
                else {
                    var listener = function () {
                        if (ready()) {
                            removeListener(listener);
                            task[task.length - 1](taskCallback, results);
                        }
                    };
                    addListener(listener);
                }
            });
        };

        async.waterfall = function (tasks, callback) {
            callback = callback || function () {};
            if (tasks.constructor !== Array) {
                var err = new Error('First argument to waterfall must be an array of functions');
                return callback(err);
            }
            if (!tasks.length) {
                return callback();
            }
            var wrapIterator = function (iterator) {
                return function (err) {
                    if (err) {
                        callback.apply(null, arguments);
                        callback = function () {};
                    }
                    else {
                        var args = Array.prototype.slice.call(arguments, 1);
                        var next = iterator.next();
                        if (next) {
                            args.push(wrapIterator(next));
                        }
                        else {
                            args.push(callback);
                        }
                        async.setImmediate(function () {
                            iterator.apply(null, args);
                        });
                    }
                };
            };
            wrapIterator(async.iterator(tasks))();
        };

        var _parallel = function(eachfn, tasks, callback) {
            callback = callback || function () {};
            if (tasks.constructor === Array) {
                eachfn.map(tasks, function (fn, callback) {
                    if (fn) {
                        fn(function (err) {
                            var args = Array.prototype.slice.call(arguments, 1);
                            if (args.length <= 1) {
                                args = args[0];
                            }
                            callback.call(null, err, args);
                        });
                    }
                }, callback);
            }
            else {
                var results = {};
                eachfn.each(_keys(tasks), function (k, callback) {
                    tasks[k](function (err) {
                        var args = Array.prototype.slice.call(arguments, 1);
                        if (args.length <= 1) {
                            args = args[0];
                        }
                        results[k] = args;
                        callback(err);
                    });
                }, function (err) {
                    callback(err, results);
                });
            }
        };

        async.parallel = function (tasks, callback) {
            _parallel({ map: async.map, each: async.each }, tasks, callback);
        };

        async.parallelLimit = function(tasks, limit, callback) {
            _parallel({ map: _mapLimit(limit), each: _eachLimit(limit) }, tasks, callback);
        };

        async.series = function (tasks, callback) {
            callback = callback || function () {};
            if (tasks.constructor === Array) {
                async.mapSeries(tasks, function (fn, callback) {
                    if (fn) {
                        fn(function (err) {
                            var args = Array.prototype.slice.call(arguments, 1);
                            if (args.length <= 1) {
                                args = args[0];
                            }
                            callback.call(null, err, args);
                        });
                    }
                }, callback);
            }
            else {
                var results = {};
                async.eachSeries(_keys(tasks), function (k, callback) {
                    tasks[k](function (err) {
                        var args = Array.prototype.slice.call(arguments, 1);
                        if (args.length <= 1) {
                            args = args[0];
                        }
                        results[k] = args;
                        callback(err);
                    });
                }, function (err) {
                    callback(err, results);
                });
            }
        };

        async.iterator = function (tasks) {
            var makeCallback = function (index) {
                var fn = function () {
                    if (tasks.length) {
                        tasks[index].apply(null, arguments);
                    }
                    return fn.next();
                };
                fn.next = function () {
                    return (index < tasks.length - 1) ? makeCallback(index + 1): null;
                };
                return fn;
            };
            return makeCallback(0);
        };

        async.apply = function (fn) {
            var args = Array.prototype.slice.call(arguments, 1);
            return function () {
                return fn.apply(
                    null, args.concat(Array.prototype.slice.call(arguments))
                );
            };
        };

        var _concat = function (eachfn, arr, fn, callback) {
            var r = [];
            eachfn(arr, function (x, cb) {
                fn(x, function (err, y) {
                    r = r.concat(y || []);
                    cb(err);
                });
            }, function (err) {
                callback(err, r);
            });
        };
        async.concat = doParallel(_concat);
        async.concatSeries = doSeries(_concat);

        async.whilst = function (test, iterator, callback) {
            if (test()) {
                iterator(function (err) {
                    if (err) {
                        return callback(err);
                    }
                    async.whilst(test, iterator, callback);
                });
            }
            else {
                callback();
            }
        };

        async.doWhilst = function (iterator, test, callback) {
            iterator(function (err) {
                if (err) {
                    return callback(err);
                }
                if (test()) {
                    async.doWhilst(iterator, test, callback);
                }
                else {
                    callback();
                }
            });
        };

        async.until = function (test, iterator, callback) {
            if (!test()) {
                iterator(function (err) {
                    if (err) {
                        return callback(err);
                    }
                    async.until(test, iterator, callback);
                });
            }
            else {
                callback();
            }
        };

        async.doUntil = function (iterator, test, callback) {
            iterator(function (err) {
                if (err) {
                    return callback(err);
                }
                if (!test()) {
                    async.doUntil(iterator, test, callback);
                }
                else {
                    callback();
                }
            });
        };

        async.queue = function (worker, concurrency) {
            if (concurrency === undefined) {
                concurrency = 1;
            }
            function _insert(q, data, pos, callback) {
                if(data.constructor !== Array) {
                    data = [data];
                }
                _each(data, function(task) {
                    var item = {
                        data: task,
                        callback: typeof callback === 'function' ? callback : null
                    };

                    if (pos) {
                        q.tasks.unshift(item);
                    } else {
                        q.tasks.push(item);
                    }

                    if (q.saturated && q.tasks.length === concurrency) {
                        q.saturated();
                    }
                    async.setImmediate(q.process);
                });
            }

            var workers = 0;
            var q = {
                tasks: [],
                concurrency: concurrency,
                saturated: null,
                empty: null,
                drain: null,
                push: function (data, callback) {
                    _insert(q, data, false, callback);
                },
                unshift: function (data, callback) {
                    _insert(q, data, true, callback);
                },
                process: function () {
                    if (workers < q.concurrency && q.tasks.length) {
                        var task = q.tasks.shift();
                        if (q.empty && q.tasks.length === 0) {
                            q.empty();
                        }
                        workers += 1;
                        var next = function () {
                            workers -= 1;
                            if (task.callback) {
                                task.callback.apply(task, arguments);
                            }
                            if (q.drain && q.tasks.length + workers === 0) {
                                q.drain();
                            }
                            q.process();
                        };
                        var cb = only_once(next);
                        worker(task.data, cb);
                    }
                },
                length: function () {
                    return q.tasks.length;
                },
                running: function () {
                    return workers;
                }
            };
            return q;
        };

        async.cargo = function (worker, payload) {
            var working     = false,
                tasks       = [];

            var cargo = {
                tasks: tasks,
                payload: payload,
                saturated: null,
                empty: null,
                drain: null,
                push: function (data, callback) {
                    if(data.constructor !== Array) {
                        data = [data];
                    }
                    _each(data, function(task) {
                        tasks.push({
                            data: task,
                            callback: typeof callback === 'function' ? callback : null
                        });
                        if (cargo.saturated && tasks.length === payload) {
                            cargo.saturated();
                        }
                    });
                    async.setImmediate(cargo.process);
                },
                process: function process() {
                    if (working) {
                        return;
                    }
                    if (tasks.length === 0) {
                        if(cargo.drain) {
                            cargo.drain();
                        }
                        return;
                    }

                    var ts = typeof payload === 'number' ?
                        tasks.splice(0, payload) :
                        tasks.splice(0);

                    var ds = _map(ts, function (task) {
                        return task.data;
                    });

                    if(cargo.empty) {
                        cargo.empty();
                    }
                    working = true;
                    worker(ds, function () {
                        working = false;

                        var args = arguments;
                        _each(ts, function (data) {
                            if (data.callback) {
                                data.callback.apply(null, args);
                            }
                        });

                        process();
                    });
                },
                length: function () {
                    return tasks.length;
                },
                running: function () {
                    return working;
                }
            };
            return cargo;
        };

        /* jshint ignore:start */
        var _console_fn = function (name) {
            return function (fn) {
                var args = Array.prototype.slice.call(arguments, 1);
                fn.apply(null, args.concat([function (err) {
                    var args = Array.prototype.slice.call(arguments, 1);
                    if (typeof console !== 'undefined') {
                        if (err) {
                            if (console.error) {
                                console.error(err);
                            }
                        }
                        else if (console[name]) {
                            _each(args, function (x) {
                                console[name](x);
                            });
                        }
                    }
                }]));
            };
        };
        /* jshint ignore:end */

        async.log = _console_fn('log');
        async.dir = _console_fn('dir');
        /*async.info = _console_fn('info');
         async.warn = _console_fn('warn');
         async.error = _console_fn('error');*/

        async.memoize = function (fn, hasher) {
            var memo = {};
            var queues = {};
            hasher = hasher || function (x) {
                return x;
            };
            var memoized = function () {
                var args = Array.prototype.slice.call(arguments);
                var callback = args.pop();
                var key = hasher.apply(null, args);
                if (key in memo) {
                    callback.apply(null, memo[key]);
                }
                else if (key in queues) {
                    queues[key].push(callback);
                }
                else {
                    queues[key] = [callback];
                    fn.apply(null, args.concat([function () {
                        memo[key] = arguments;
                        var q = queues[key];
                        delete queues[key];
                        for (var i = 0, l = q.length; i < l; i++) {
                            q[i].apply(null, arguments);
                        }
                    }]));
                }
            };
            memoized.memo = memo;
            memoized.unmemoized = fn;
            return memoized;
        };

        async.unmemoize = function (fn) {
            return function () {
                return (fn.unmemoized || fn).apply(null, arguments);
            };
        };

        async.times = function (count, iterator, callback) {
            var counter = [];
            for (var i = 0; i < count; i++) {
                counter.push(i);
            }
            return async.map(counter, iterator, callback);
        };

        async.timesSeries = function (count, iterator, callback) {
            var counter = [];
            for (var i = 0; i < count; i++) {
                counter.push(i);
            }
            return async.mapSeries(counter, iterator, callback);
        };

        async.compose = function (/* functions... */) {
            var fns = Array.prototype.reverse.call(arguments);
            return function () {
                var that = this;
                var args = Array.prototype.slice.call(arguments);
                var callback = args.pop();
                async.reduce(fns, args, function (newargs, fn, cb) {
                        fn.apply(that, newargs.concat([function () {
                            var err = arguments[0];
                            var nextargs = Array.prototype.slice.call(arguments, 1);
                            cb(err, nextargs);
                        }]));
                    },
                    function (err, results) {
                        callback.apply(that, [err].concat(results));
                    });
            };
        };

        var _applyEach = function (eachfn, fns /*args...*/) {
            var go = function () {
                var that = this;
                var args = Array.prototype.slice.call(arguments);
                var callback = args.pop();
                return eachfn(fns, function (fn, cb) {
                        fn.apply(that, args.concat([cb]));
                    },
                    callback);
            };
            if (arguments.length > 2) {
                var args = Array.prototype.slice.call(arguments, 2);
                return go.apply(this, args);
            }
            else {
                return go;
            }
        };
        async.applyEach = doParallel(_applyEach);
        async.applyEachSeries = doSeries(_applyEach);

        async.forever = function (fn, callback) {
            function next(err) {
                if (err) {
                    if (callback) {
                        return callback(err);
                    }
                    throw err;
                }
                fn(next);
            }
            next();
        };

        /*
        // AMD / RequireJS
        if (typeof define !== 'undefined' && define.amd) {
            define([], function () {
                return async;
            });
        }
        // Node.js
        else if (typeof module !== 'undefined' && module.exports) {
            module.exports = async;
        }
        // included directly via <script> tag
        else {
            root.async = async;
        }
        */

        root.async = async;





        //////////////////////////////////////////////////////////////////////////////////////
        //
        // EQUIV AND HOOZIT
        //
        //////////////////////////////////////////////////////////////////////////////////////

        // Determine what is o.
        function hoozit(o) {
            if (o.constructor === String) {
                return "string";

            } else if (o.constructor === Boolean) {
                return "boolean";

            } else if (o.constructor === Number) {

                if (isNaN(o)) {
                    return "nan";
                } else {
                    return "number";
                }

            } else if (typeof o === "undefined") {
                return "undefined";

                // consider: typeof null === object
            } else if (o === null) {
                return "null";

                // consider: typeof [] === object
            } else if (o instanceof Array) {
                return "array";

                // consider: typeof new Date() === object
            } else if (o instanceof Date) {
                return "date";

                // consider: /./ instanceof Object;
                //           /./ instanceof RegExp;
                //          typeof /./ === "function"; // => false in IE and Opera,
                //                                          true in FF and Safari
            } else if (o instanceof RegExp) {
                return "regexp";

            } else if (typeof o === "object") {
                return "object";

            } else if (o instanceof Function) {
                return "function";
            } else {
                return undefined;
            }
        }

        // Call the o related callback with the given arguments.
        function bindCallbacks(o, callbacks, args) {
            var prop = hoozit(o);
            if (prop) {
                if (hoozit(callbacks[prop]) === "function") {
                    return callbacks[prop].apply(callbacks, args);
                } else {
                    return callbacks[prop]; // or undefined
                }
            }
        }

        // Test for equality any JavaScript type.
        var equiv = root.equiv = function ()
        {
            var innerEquiv; // the real equiv function
            var callers = []; // stack to decide between skip/abort functions

            var callbacks = function () {

                // for string, boolean, number and null
                function useStrictEquality(b, a) {
                    if (b instanceof a.constructor || a instanceof b.constructor) {
                        // to catch short annotaion VS 'new' annotation of a declaration
                        // e.g. var i = 1;
                        //      var j = new Number(1);
                        return a == b;
                    } else {
                        return a === b;
                    }
                }

                return {
                    "string": useStrictEquality,
                    "boolean": useStrictEquality,
                    "number": useStrictEquality,
                    "null": useStrictEquality,
                    "undefined": useStrictEquality,

                    "nan": function (b) {
                        return isNaN(b);
                    },

                    "date": function (b, a) {
                        return hoozit(b) === "date" && a.valueOf() === b.valueOf();
                    },

                    "regexp": function (b, a) {
                        return hoozit(b) === "regexp" &&
                            a.source === b.source && // the regex itself
                            a.global === b.global && // and its modifers (gmi) ...
                            a.ignoreCase === b.ignoreCase &&
                            a.multiline === b.multiline;
                    },

                    // - skip when the property is a method of an instance (OOP)
                    // - abort otherwise,
                    //   initial === would have catch identical references anyway
                    "function": function () {
                        var caller = callers[callers.length - 1];
                        return caller !== Object &&
                            typeof caller !== "undefined";
                    },

                    "array": function (b, a) {
                        var i;
                        var len;

                        // b could be an object literal here
                        if ( ! (hoozit(b) === "array")) {
                            return false;
                        }

                        len = a.length;
                        if (len !== b.length) { // safe and faster
                            return false;
                        }
                        for (i = 0; i < len; i++) {
                            if( ! innerEquiv(a[i], b[i])) {
                                return false;
                            }
                        }
                        return true;
                    },

                    "object": function (b, a) {
                        var i;
                        var eq = true; // unless we can proove it
                        var aProperties = [], bProperties = []; // collection of strings

                        // comparing constructors is more strict than using instanceof
                        if ( a.constructor !== b.constructor) {
                            return false;
                        }

                        // stack constructor before traversing properties
                        callers.push(a.constructor);

                        for (i in a) { // be strict: don't ensures hasOwnProperty and go deep

                            aProperties.push(i); // collect a's properties

                            if ( ! innerEquiv(a[i], b[i])) {
                                eq = false;
                            }
                        }

                        callers.pop(); // unstack, we are done

                        for (i in b) {
                            bProperties.push(i); // collect b's properties
                        }

                        // Ensures identical properties name
                        return eq && innerEquiv(aProperties.sort(), bProperties.sort());
                    }
                };
            }();

            innerEquiv = function () { // can take multiple arguments
                var args = Array.prototype.slice.apply(arguments);
                if (args.length < 2) {
                    return true; // end transition
                }

                return (function (a, b) {
                    if (a === b) {
                        return true; // catch the most you can
                    } else if (a === null || b === null || typeof a === "undefined" || typeof b === "undefined" || hoozit(a) !== hoozit(b)) {
                        return false; // don't lose time with error prone cases
                    } else {
                        return bindCallbacks(a, callbacks, [b, a]);
                    }

                    // apply transition with (1..n) arguments
                })(args[0], args[1]) && arguments.callee.apply(this, args.splice(1, args.length -1));
            };

            return innerEquiv;

        }();

    }());

    Alpaca.MARKER_CLASS_CONTROL_FIELD = "alpaca-marker-control-field";
    Alpaca.MARKER_CLASS_CONTAINER_FIELD = "alpaca-marker-container-field";
    Alpaca.MARKER_CLASS_CONTAINER_FIELD_ITEM = "alpaca-marker-control-field-item";
    Alpaca.MARKER_DATA_CONTAINER_FIELD_ITEM_KEY = "data-alpaca-container-field-item-key";
    Alpaca.MARKER_CLASS_FORM_ITEMS_FIELD = "alpaca-marker-form-items-field";
    Alpaca.CLASS_CONTAINER = "alpaca-container";
    Alpaca.CLASS_CONTROL = "alpaca-control";
    Alpaca.MARKER_CLASS_INSERT = "alpaca-marker-insert";
    Alpaca.MARKER_DATA_INSERT_KEY = "data-alpaca-marker-insert-key";
    Alpaca.MARKER_CLASS_ARRAY_TOOLBAR = "alpaca-marker-array-field-toolbar";
    Alpaca.MARKER_DATA_ARRAY_TOOLBAR_FIELD_ID = "data-alpaca-array-field-toolbar-field-id";
    Alpaca.MARKER_CLASS_ARRAY_ITEM_ACTIONBAR = "alpaca-marker-array-field-item-actionbar";
    Alpaca.MARKER_DATA_ARRAY_ITEM_KEY = "data-alpaca-marker-array-field-item-key";
    Alpaca.MARKER_DATA_ARRAY_ITEM_PARENT_FIELD_ID = "data-alpaca-marker-array-field-item-parent-field-id";
    Alpaca.MARKER_CLASS_CONTAINER_FIELD_ITEM_FIELD = "alpaca-marker-container-field-item-field";

    Alpaca.makeCacheKey = function(viewId, scopeType, scopeId, templateId)
    {
        return viewId + ":" + scopeType + ":" + scopeId + ":" + templateId;
    };

    /**
     * Splits a cache key into its parts - viewId, scopeType, scopeId and templateId.
     *
     * @param cacheKey
     * @returns {{}}
     */
    Alpaca.splitCacheKey = function(cacheKey)
    {
        var parts = {};

        var x = cacheKey.indexOf(":");
        var y = cacheKey.lastIndexOf(":");

        parts.viewId = cacheKey.substring(0, x);
        parts.templateId = cacheKey.substring(y + 1);

        var scopeIdentifier = cacheKey.substring(x + 1, y);

        var z = scopeIdentifier.indexOf(":");

        parts.scopeType = scopeIdentifier.substring(0, z);
        parts.scopeId = scopeIdentifier.substring(z+1);

        return parts;
    };

    /**
     * Creates an empty data object for a given JSON schema.
     *
     * @param schema
     * @returns {string}
     */
    Alpaca.createEmptyDataInstance = function(schema)
    {
        if (!schema) {
            return "";
        }

        if (schema.type === "object") {
            return {};
        }

        if (schema.type === "array") {
            return [];
        }

        if (schema.type === "number") {
            return -1;
        }

        if (schema.type === "boolean") {
            return false;
        }

        return "";
    };

    /**
     * Swaps two divs visually and then fires a callback.
     *
     * @param source
     * @param target
     * @param duration
     * @param callback
     */
    Alpaca.animatedSwap = function(source, target, duration, callback)
    {
        if (typeof(duration) === "function") {
            callback = duration;
            duration = 500;
        }

        var _swap = function(a, b, duration, callback)
        {
            var from = $(a),
                dest = $(b),
                from_pos = from.offset(),
                dest_pos = dest.offset(),
                from_clone = from.clone(),
                dest_clone = dest.clone(),
                total_route_vertical   = dest_pos.top + dest.height() - from_pos.top,
                route_from_vertical    = 0,
                route_dest_vertical    = 0,
                total_route_horizontal = dest_pos.left + dest.width() - from_pos.left,
                route_from_horizontal  = 0,
                route_dest_horizontal  = 0;

            from.css("opacity", 0);
            dest.css("opacity", 0);

            from_clone.insertAfter(from).css({position: "absolute", width: from.outerWidth(), height: from.outerHeight()}).offset(from_pos).css("z-index", "999");
            dest_clone.insertAfter(dest).css({position: "absolute", width: dest.outerWidth(), height: dest.outerHeight()}).offset(dest_pos).css("z-index", "999");

            if(from_pos.top !== dest_pos.top) {
                route_from_vertical = total_route_vertical - from.height();
            }
            route_dest_vertical = total_route_vertical - dest.height();
            if(from_pos.left !== dest_pos.left) {
                route_from_horizontal = total_route_horizontal - from.width();
            }
            route_dest_horizontal = total_route_horizontal - dest.width();

            from_clone.animate({
                top: "+=" + route_from_vertical + "px",
                left: "+=" + route_from_horizontal + "px"
            }, duration, function(){
                dest.css("opacity", 1);
                $(this).remove();
            });

            dest_clone.animate({
                top: "-=" + route_dest_vertical + "px",
                left: "-=" + route_dest_horizontal + "px"
            }, duration, function(){
                from.css("opacity", 1);
                $(this).remove();
            });

            window.setTimeout(function() {
                from_clone.remove();
                dest_clone.remove();
                callback();
            }, duration + 1);
        };

        _swap(source, target, duration, callback);
    };

    Alpaca.readCookie = function(name)
    {
        function _readCookie(name)
        {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++)
            {
                var c = ca[i];
                while (c.charAt(0)==' ')
                {
                    c = c.substring(1,c.length);
                }

                if (c.indexOf(nameEQ) == 0)
                {
                    return c.substring(nameEQ.length,c.length);
                }
            }
            return null;
        }

        var value = null;

        if (typeof(document) !== "undefined")
        {
            value = _readCookie(name);
        }

        return value;
    };

    ////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // Moment.js static
    //
    ////////////////////////////////////////////////////////////////////////////////////////////////

    Alpaca.moment = function() {

        if (!Alpaca._moment) {
            if (window.moment) {
                Alpaca._moment = window.moment;
            }
        }

        if (!Alpaca._moment) {
            throw new Error("The moment.js library has not been included, cannot produce moment object");
        }

        return Alpaca._moment.call(this, arguments);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // CSRF Support
    //
    ////////////////////////////////////////////////////////////////////////////////////////////////

    Alpaca.CSRF_TOKEN = null;
    Alpaca.CSRF_COOKIE_NAMES = ["CSRF-TOKEN", "XSRF-TOKEN"];
    Alpaca.CSRF_HEADER_NAME = "X-CSRF-TOKEN";

    ////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // STATIC DEFAULTS
    //
    ////////////////////////////////////////////////////////////////////////////////////////////////

    // use this to set the default "sticky" toolbar behavior
    // set to true to have toolbars always stick or undefined to have them appear on hover
    Alpaca.defaultToolbarSticky = undefined;

    // use this to have invalid messages show up for read-only fields
    Alpaca.showReadOnlyInvalidState = false;

})(jQuery);
