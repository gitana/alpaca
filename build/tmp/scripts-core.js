/**
 * Using fork:
 * https://github.com/kcmoot/Base.js-Fork/blob/master/build/base.js
 */
(function (root, factory) {
    /*
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], function () {
            return (root.returnExportsGlobal = factory());
        });
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
    */
        root['Base'] = factory();
    /*
    }
    */
}(this, function () {

    /**
     *   Base.js, version 1.1a
     *   Copyright 2006-2010, Dean Edwards
     *   License: http://www.opensource.org/licenses/mit-license.php
     *
     *   Modified by the Nerdery for improved performance and various bugfixes
     */

    /**
     * Function type
     *
     * @type String
     * @ignore
     * @final
     */
    var TYPE_FUNCTION = 'function';

    /**
     * Object type
     *
     * @type String
     * @ignore
     * @final
     */
    var TYPE_OBJECT = 'object';

    /**
     * String type
     *
     * @type String
     * @ignore
     * @final
     */
    var TYPE_STRING = 'string';

    /**
     * Flag to determine if we are currently creating a clean prototype of a class
     *
     * @type Boolean
     * @private
     * @ignore
     */
    var _prototyping = false;

    /**
     * Method to extend manually - do not do automatically
     *
     * @type Array
     * @private
     * @ignore
     */
    var _hiddenMethods = ['constructor', 'toString', 'valueOf'];

    /**
     * Lenth of hidden methods array
     *
     * @type Number
     * @private
     * @ignore
     */
    var _hiddenMethodsLength = _hiddenMethods.length;

    /**
     * Regex to find any calls to a parent method
     *
     * @type RegExp
     * @private
     * @ignore
     */
    var _superMethodRegex = /\bbase\b/;

    /**
     * Blank function
     *
     * @type Function
     * @private
     * @ignore
     */
    var _blankFunction = function() {};

    /**
     * Prototype default values. When extending methods, if both sources have these values, do not copy them.
     *
     * @type Object
     * @private
     * @ignore
     */
    var _prototypeDefaults = { toSource: null, base: _blankFunction };

    /**
     * BaseLib class
     *
     * A library to create a more traditional OOP interface for developers to work with
     *
     * @class Lib.Base.Base
     *
     * @constructor
     */
    var Base = function() {};

    /**
     * Subclass a class
     *
     * @method extend
     * @param {Object} [instanceMethods] Instance members/methods
     * @param {Object} [staticMethods] Static members/methods
     * @return {Function}
     * @static
     */
    Base.extend = function(instanceMethods, staticMethods) { // subclass
        var extend = Base.prototype.extend;

        // build the prototype
        _prototyping = true;

        var proto = new this();
        extend.call(proto, instanceMethods);

        // call this method from any other method to invoke that method's ancestor
        proto.base = _prototypeDefaults.base;

        _prototyping = false;

        // create the wrapper for the constructor function
        var constructor = proto.constructor;
        var klass = proto.constructor = function() {
            if (!_prototyping) {
                // instantiation
                if (this && (this._constructing || this.constructor === klass)) {
                    this._constructing = true;
                    constructor.apply(this, arguments);
                    this._constructing = false;

                    // casting
                } else if (arguments.length) {
                    Base.cast.apply(klass, arguments);
                }
            }
        };
        // build the class interface
        extend.call(klass, this);
        klass.ancestor = this;
        klass.prototype = proto;

        /**
         * Return original method
         *
         * @method valueOf
         * @param {String} [type]
         * @return Function
         * @static
         */
        klass.valueOf = function(type) {
            return (type === TYPE_OBJECT) ? klass : constructor.valueOf();
        };
        extend.call(klass, staticMethods);

        // if static init method exists, call it
        if (typeof klass.init === TYPE_FUNCTION) {
            klass.init();
        }

        return klass;
    };

    /**
     * @method extend
     * @param {String|Object} source
     * @param {Function} [value]
     * @chainable
     */
    Base.prototype.extend = function(source, value) {
        // extending with a name/value pair
        if (typeof source === TYPE_STRING && arguments.length > 1) {
            var ancestor = this[source];
            if (
                ancestor &&
                    // overriding a method?
                (typeof value === TYPE_FUNCTION) &&
                    // the valueOf() comparison is to avoid circular references
                (!ancestor.valueOf || ancestor.valueOf() !== value.valueOf()) &&
                _superMethodRegex.test(value)
            ) {
                // get the underlying method
                var method = value.valueOf();

                // override
                value = function() {
                    var returnValue;
                    var previous = this.base || _prototypeDefaults.base;
                    this.base = ancestor;
                    if (arguments.length === 0) {
                        returnValue = method.call(this);
                    } else {
                        returnValue = method.apply(this, arguments);
                    }
                    this.base = previous;
                    return returnValue;
                };

                // point to the underlying method
                value.valueOf = function(type) {
                    return (type === TYPE_OBJECT) ? value : method;
                };
                value.toString = Base.toString;
            }
            this[source] = value;

            // extending with an object literal
        } else if (source) {
            var extend = Base.prototype.extend;

            // if this object has a customised extend method then use it
            if (!_prototyping && typeof this !== TYPE_FUNCTION) {
                extend = this.extend || extend;
            }

            // do hidden methods separately
            // if we are prototyping then include the constructor
            var i = _prototyping ? 0 : 1;
            var key;
            for (; i < _hiddenMethodsLength; i++) {
                key = _hiddenMethods[i];
                if (source[key] !== _prototypeDefaults[key]) {
                    extend.call(this, key, source[key]);
                }
            }

            // copy each of the source object's properties to this object
            for (key in source) {
                if (!_prototypeDefaults[key]) {
                    extend.call(this, key, source[key]);
                }
            }
        }

        return this;
    };

    // initialise
    Base = Base.extend({

        /**
         * Default static base method
         *
         * @method base
         * @ignore
         */
        base: _prototypeDefaults.base

    }, {

        /**
         * Parent object/class
         *
         * @property ancestor
         * @type Object
         * @static
         * @ignore
         */
        ancestor: Object,

        /**
         * Base.js version
         *
         * @property version
         * @type String
         * @static
         * @ignore
         */
        version: '1.1',

        /**
         * Extend current class into another object or class.
         *
         * If an object with no prototype is passed, only prototype methods
         * will be cast EXCEPT for the constructor.
         *
         * If an a class (with constructor) is passed, both static and
         * prototype methods will be cast EXCEPT for the constructor.
         *
         * @method cast
         * @param {Object|Function} class* Classes or objects to cast
         * @chainable
         * @static
         */
        cast: function() {
            var i = 0;
            var length = arguments.length;
            var extend;
            var caster;

            for (; i < length; i++) {
                caster = arguments[i];
                extend = caster.extend || Base.prototype.extend;

                // cast prototype and static methods
                if (typeof caster === TYPE_FUNCTION) {
                    extend = caster.prototype.extend || Base.prototype.extend;
                    extend.call(caster.prototype, this.prototype);
                    extend.call(caster, this);
                    caster.ancestor = this;

                    // cast only prototype methods
                } else {
                    extend.call(caster, this.prototype);
                }
            }

            return this;
        },

        /**
         * Implement a class into the current class.
         *
         * All prototype and static properties will be extended into
         * `this` EXCEPT for the constructor.
         *
         * @method implement
         * @param {Object|Function} class* Classes or objects to cast
         * @chainable
         * @static
         */
        implement: function() {
            for (var i = 0; i < arguments.length; i++) {
                this.cast.call(arguments[i], this);
            }

            return this;
        },

        /**
         * Get string value of class
         *
         * @method toString
         * @return String
         * @static
         */
        toString: function() {
            return this.valueOf() + '';
        }

    });

    return Base;


}));
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

        /**
         * Finds the Alpaca field instance bound to the dom element.
         *
         * First considers the immediate dom element and then looks 1 level deep to children and then up to parent.
         *
         * @returns {*}
         */
        var findExistingAlpacaBinding = function(domElement, skipPivot)
        {
            var existing = null;

            // look at "data-alpaca-field-id"
            var alpacaFieldId = $(domElement).attr("data-alpaca-field-id");
            if (alpacaFieldId)
            {
                var alpacaField = Alpaca.fieldInstances[alpacaFieldId];
                if (alpacaField)
                {
                    existing = alpacaField;
                }
            }

            // if not found, look at "data-alpaca-form-id"
            if (!existing)
            {
                var formId = $(domElement).attr("data-alpaca-form-id");
                if (formId)
                {
                    var subElements = $(domElement).find(":first");
                    if (subElements.length > 0)
                    {
                        var subFieldId = $(subElements[0]).attr("data-alpaca-field-id");
                        if (subFieldId)
                        {
                            var subField = Alpaca.fieldInstances[subFieldId];
                            if (subField)
                            {
                                existing = subField;
                            }
                        }
                    }
                }
            }

            // if not found, check for children 0th element
            if (!existing && !skipPivot)
            {
                var childDomElements = $(el).find(":first");
                if (childDomElements.length > 0)
                {
                    var childField = findExistingAlpacaBinding(childDomElements[0], true);
                    if (childField)
                    {
                        existing = childField;
                    }
                }
            }

            // if not found, check parent
            if (!existing && !skipPivot)
            {
                var parentEl = $(el).parent();
                if (parentEl)
                {
                    var parentField = findExistingAlpacaBinding(parentEl, true);
                    if (parentField)
                    {
                        existing = parentField;
                    }
                }
            }

            return existing;
        };

        var specialFunctionNames = ["get", "exists", "destroy"];
        var isSpecialFunction = (args.length > 1 && Alpaca.isString(args[1]) && (specialFunctionNames.indexOf(args[1]) > -1));

        var existing = findExistingAlpacaBinding(el);
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
            if (!field.parent)
            {
                Alpaca.fireReady(field);
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

            if (loadedOptions.view && !view)
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
            return Object.prototype.toString.call(obj) == "[object Array]";
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
         * The default sort function to use for enumerations.
         */
        defaultSort: function(a, b) {

            if (a.text > b.text) {
                return 1;
            }
            else if (a.text < b.text) {
                return -1;
            }

            return 0;
        },

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

            // if normalized views have already been computed, then wipe them down
            // this allows them to be re-computed on the next render and allows this template to participate
            if (Alpaca.countProperties(Alpaca.normalizedViews) > 0)
            {
                Alpaca.normalizedViews = {};
            }
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
        defaultTimeFormat: "HH:mm:ss",

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
            this.compile(connector, function(report) {

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
         * @param connector the connector
         * @param cb the callback that gets fired once compilation has ended
         * @param errorCallback fired if the compile fails for any reason
         */
        compile: function(connector, cb, errorCallback)
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
                engine.compile(cacheKey, template, connector, function(err) {
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

    Alpaca.loadRefSchemaOptions = function(topField, schemaReferenceId, optionsReferenceId, callback)
    {
        var fns = [];

        // holds resolution information
        var resolution = {};

        // schema loading function
        var fn1 = function(schema, schemaReferenceId, resolution)
        {
            return function(done)
            {
                if (!schemaReferenceId)
                {
                    done();
                }
                else if (schemaReferenceId === "#")
                {
                    resolution.schema = schema;

                    done();
                }
                else if (schemaReferenceId.indexOf("#/") === 0)
                {
                    // this is a property path relative to the root of the current schema
                    schemaReferenceId = schemaReferenceId.substring(2);

                    // split into tokens
                    var tokens = schemaReferenceId.split("/");

                    var defSchema = schema;
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

                    resolution.schema = defSchema;

                    done();
                }
                else if (schemaReferenceId.indexOf("#") === 0)
                {
                    // this is the ID of a node in the current schema document

                    // walk the current document schema until we find the referenced node (using id property)
                    var resolvedSchema = Alpaca.resolveSchemaReference(schema, schemaReferenceId);
                    if (resolvedSchema)
                    {
                        resolution.schema = resolvedSchema;
                    }

                    done();
                }
                else
                {
                    // the reference is considered to be a URI with or without a "#" in it to point to a specific location in
                    // the target schema

                    var referenceParts = Alpaca.pathParts(schemaReferenceId);

                    topField.connector.loadReferenceSchema(referenceParts.path, function (schema) {

                        if (referenceParts.id)
                        {
                            var resolvedSchema = Alpaca.resolveSchemaReference(schema, referenceParts.id);
                            if (resolvedSchema)
                            {
                                resolution.schema = resolvedSchema;
                            }
                        }
                        else
                        {
                            resolution.schema = schema;
                        }

                        done();
                    }, function(err) {
                        done();
                    });
                }
            };
        };
        fns.push(fn1(topField.schema, schemaReferenceId, resolution));

        var fn2 = function(options, optionsReferenceId, resolution)
        {
            return function(done)
            {
                if (!optionsReferenceId)
                {
                    done();
                }
                else if (optionsReferenceId === "#")
                {
                    resolution.options = options;

                    done();
                }
                else if (optionsReferenceId.indexOf("#/") === 0)
                {
                    // this is a property path relative to the root of the current schema
                    optionsReferenceId = optionsReferenceId.substring(2);

                    // split into tokens
                    var tokens = optionsReferenceId.split("/");

                    var defOptions = options;
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

                    resolution.options = defOptions;

                    done();
                }
                else if (optionsReferenceId.indexOf("#") === 0)
                {
                    // this is the ID of a node in the current schema document

                    // walk the current document schema until we find the referenced node (using id property)
                    var resolvedOptions = Alpaca.resolveOptionsReference(options, optionsReferenceId);
                    if (resolvedOptions)
                    {
                        resolution.options = resolvedOptions;
                    }

                    done();
                }
                else
                {
                    // the reference is considered to be a URI with or without a "#" in it to point to a specific location in
                    // the target schema

                    var optionReferenceParts = Alpaca.pathParts(optionsReferenceId);

                    topField.connector.loadReferenceOptions(optionReferenceParts.path, function (options) {

                        if (optionReferenceParts.id)
                        {
                            var resolvedOptions = Alpaca.resolveOptionsReference(options, optionReferenceParts.id);
                            if (resolvedOptions)
                            {
                                resolution.options = resolvedOptions;
                            }
                        }
                        else
                        {
                            resolution.options = options;
                        }

                        done();
                    }, function(err) {
                        done();
                    });
                }
            };
        };
        fns.push(fn2(topField.options, optionsReferenceId, resolution));

        // run loads in parallel
        Alpaca.parallel(fns, function() {
            callback(resolution.schema, resolution.options);
        });
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
     * Resolves a schema path reference to the given sub-schema.
     *
     * @param schema
     * @param referenceId
     * @returns {*}
     */
    Alpaca.resolveSchemaReference = function(schema, referenceId)
    {
        if ((schema.id === referenceId) || (("#" + schema.id) === referenceId)) // jshint ignore:line
        {
            return schema;
        }

        if (schema.properties)
        {
            for (var propertyId in schema.properties)
            {
                var subSchema = schema.properties[propertyId];

                var x = Alpaca.resolveSchemaReference(subSchema, referenceId);
                if (x)
                {
                    return x;
                }
            }
        }
        else if (schema.items)
        {
            var subSchema = schema.items;

            var x = Alpaca.resolveSchemaReference(subSchema, referenceId);
            if (x)
            {
                return x;
            }
        }

        return null;
    };

    Alpaca.resolveOptionsReference = function(options, referenceId)
    {
        if ((options.id === referenceId) || (("#" + options.id) === referenceId)) // jshint ignore:line
        {
            return options;
        }

        if (options.fields)
        {
            for (var fieldId in options.fields)
            {
                var subOptions = options.fields[fieldId];

                var x = Alpaca.resolveOptionsReference(subOptions, referenceId);
                if (x)
                {
                    return x;
                }
            }
        }
        else if (options.items)
        {
            var subOptions = options.items;

            var x = Alpaca.resolveOptionsReference(subOptions, referenceId);
            if (x)
            {
                return x;
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

    Alpaca.series = Alpaca.serial = function(funcs, callback)
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
    Alpaca.MARKER_DATA_ARRAY_ITEM_FIELD_ID = "data-alpaca-marker-array-field-item-field-id";
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

        var _animate = function(a, b, duration, callback)
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

        _animate(source, target, duration, callback);
    };

    /**
     * Animates the movement of a div visually and then fires callback.
     *
     * @param source
     * @param target
     * @param duration
     * @param callback
     */
    Alpaca.animatedMove = function(source, target, duration, callback)
    {
        if (typeof(duration) === "function") {
            callback = duration;
            duration = 500;
        }

        var _animate = function(a, b, duration, callback)
        {
            var from = $(a),
                dest = $(b),
                from_pos = from.offset(),
                dest_pos = dest.offset(),
                from_clone = from.clone(),
                //dest_clone = dest.clone(),
                total_route_vertical   = dest_pos.top + dest.height() - from_pos.top,
                route_from_vertical    = 0,
                route_dest_vertical    = 0,
                total_route_horizontal = dest_pos.left + dest.width() - from_pos.left,
                route_from_horizontal  = 0,
                route_dest_horizontal  = 0;

            from.css("opacity", 0);
            dest.css("opacity", 0);

            from_clone.insertAfter(from).css({position: "absolute", width: from.outerWidth(), height: from.outerHeight()}).offset(from_pos).css("z-index", "999");
            //dest_clone.insertAfter(dest).css({position: "absolute", width: dest.outerWidth(), height: dest.outerHeight()}).offset(dest_pos).css("z-index", "999");

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

            /*
            dest_clone.animate({
                top: "-=" + route_dest_vertical + "px",
                left: "-=" + route_dest_horizontal + "px"
            }, duration, function(){
                from.css("opacity", 1);
                $(this).remove();
            });
            */

            window.setTimeout(function() {
                from_clone.remove();
                //dest_clone.remove();
                callback();
            }, duration + 1);
        };

        _animate(source, target, duration, callback);
    };


    Alpaca.fireReady = function(_field)
    {
        if (_field.children && _field.children.length > 0)
        {
            for (var g = 0; g < _field.children.length; g++)
            {
                Alpaca.fireReady(_field.children[g]);
            }
        }

        _field.trigger("ready");
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

    Alpaca.safeSetObjectArray = function(baseObject, propertyName, values) {

        if (typeof(baseObject[propertyName]) === "undefined" || baseObject[propertyName] === null)
        {
            baseObject[propertyName] = [];
        }
        else
        {
            baseObject[propertyName].length = 0;
        }

        for (var i = 0; i < values.length; i++)
        {
            baseObject[propertyName].push(values[i]);
        }
    };

    Alpaca.inArray = function(array, val)
    {
        return ($.inArray(val, array) > -1);
    };

    Alpaca.indexOf = function(array, val)
    {
        return $.inArray(val, array);
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
    };

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

    // use this to globally control the position of helper text
    Alpaca.defaultHelpersPosition = "below";


    ////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // CACHE IMPLEMENTATIONS
    //
    ////////////////////////////////////////////////////////////////////////////////////////////////

    Alpaca.caches = {};
    Alpaca.registerCache = function(id, cacheFn)
    {
        Alpaca.caches[id] = cacheFn;
    };
    Alpaca.getCache = function(id)
    {
        return Alpaca.caches[id];
    };


    ////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // EXTERNAL MESSAGE SUPPORT
    //
    ////////////////////////////////////////////////////////////////////////////////////////////////

    // hook to support external message bundles
    Alpaca.externalMessage = function(key)
    {
        return undefined;
    };


})(jQuery);

/*jshint -W014 */ // bad line breaking
/*jshint -W004 */ // duplicate variables
(function($)
{
    var Alpaca = $.alpaca;

    Alpaca.listenerId = function()
    {
        var x = 0;

        return function()
        {
            return "listener-" + (x++);
        };
    }();

    /**
     * Subscribes a function handler to an observable.
     *
     * @param [String] scope optional scope
     * @param {String} id the variable id
     * @param {Function} callbackFunction the callback function
     *
     * @return descriptor
     */
    Alpaca.subscribe = function()
    {
        var args = Alpaca.makeArray(arguments);

        var scope = null;
        var id = null;
        var listener = null;

        if (args.length == 2)
        {
            scope = "global";
            id = args.shift();
            listener = args.shift();
        }
        else
        {
            scope = args.shift();
            id = args.shift();
            listener = args.shift();
        }

        // pick off path if id is a field
        if (id && Alpaca.isObject(id))
        {
            id = id.path;
        }

        if (!id)
        {
            Alpaca.logError("Missing observable subscribe id: " + id);
            return null;
        }

        // function identifier
        var listenerId = listener._lfid;
        if (!listenerId) {
            listenerId = Alpaca.listenerId();
            listener._lfid = listenerId;
        }

        // wrap function into a closure
        var func = function(that) {
            return function() {
                return listener.apply(that, arguments);
            };
        }(this);
        func._lfid = listener._lfid;

        var observables = Alpaca.ScopedObservables.get(scope);
        var observable = observables.observable(id);

        // tell the observable to subscribe
        observable.subscribe(listenerId, func);

        return {
            "scope": scope,
            "id": id,
            "listenerId": listenerId
        };
    };

    /**
     * Unsubscribes a function handler from an observable.
     *
     * @param [String] scope optional scope
     * @param {String} id the variable id
     * @param {String|Function} listener either the function or listener id
     * @return descriptor
     */
    Alpaca.unsubscribe = function()
    {
        var args = Alpaca.makeArray(arguments);

        var scope = null;
        var id = null;
        var listenerOrId = null;

        if (args.length == 2)
        {
            scope = "global";
            id = args.shift();
            listenerOrId = args.shift();
        }
        else if (args.length == 3)
        {
            scope = args.shift();
            id = args.shift();
            listenerOrId = args.shift();
        }

        var listenerId = listenerOrId;
        if (Alpaca.isFunction(listenerId))
        {
            listenerId = listenerId._lfid;
        }

        // pick off path if id is a field
        if (id && Alpaca.isObject(id))
        {
            id = id.path;
        }

        if (!id)
        {
            Alpaca.logError("Missing observable id: " + id);
            return null;
        }

        var observables = Alpaca.ScopedObservables.get(scope);
        var observable = observables.observable(id);

        // tell the observable to unsubscribe
        observable.unsubscribe(listenerId);

        return {
            "scope": scope,
            "id": id,
            "listenerId": listenerId
        };
    };

    /**
     * Gets or sets an observable in the given scope.
     *
     * @param [String] scope optional scope
     * @param {String} id the variable id
     */
    Alpaca.observable = function()
    {
        var scope;
        var id;

        var args = Alpaca.makeArray(arguments);
        if (args.length == 1)
        {
            scope = "global";
            id = args.shift();
        }
        else if (args.length == 2)
        {
            scope = args.shift();
            id = args.shift();
        }

        // pick off path if id is a field
        if (id && Alpaca.isObject(id))
        {
            id = id.path;
        }

        if (!id)
        {
            Alpaca.logError("Missing observable id: " + JSON.stringify(args));
        }
        else
        {
            var observables = Alpaca.ScopedObservables.get(scope);
            observable = observables.observable(id);
        }

        return observable;
    };

    Alpaca.clearObservable = function()
    {
        var scope;
        var id;

        var args = Alpaca.makeArray(arguments);
        if (args.length == 1)
        {
            scope = "global";
            id = args.shift();
        }
        else if (args.length == 2)
        {
            scope = args.shift();
            id = args.shift();
        }

        // pick off path if id is a field
        if (id && Alpaca.isObject(id))
        {
            id = id.path;
        }

        if (!id)
        {
            Alpaca.logError("Missing observable id: " + JSON.stringify(args));
        }

        var observables = Alpaca.ScopedObservables.get(scope);
        var observable = observables.observable(id);

        observable.clear();
    };

    /**
     * Declares and gets a dependent observable in a given scope
     *
     * @param scope
     * @param id
     * @param func
     */
    Alpaca.dependentObservable = function()
    {
        var scope = null;
        var id = null;
        var func = null;

        var args = Alpaca.makeArray(arguments);
        if (args.length == 2)
        {
            scope = "global";
            id = args.shift();
            func = args.shift();
        }
        else if (args.length == 3)
        {
            scope = args.shift();
            id = args.shift();
            func = args.shift();
        }
        else
        {
            Alpaca.error("Wrong number of arguments");
            return;
        }

        // pick off path if id is a field
        if (id && Alpaca.isObject(id))
        {
            id = id.path;
        }

        if (!id)
        {
            Alpaca.logError("Missing observable id: " + JSON.stringify(args));
        }

        var observables = Alpaca.ScopedObservables.get(scope);

        return observables.dependentObservable(id, func);
    };

})(jQuery);
(function($)
{
    var Alpaca = $.alpaca;

    /**
     * Collection of observables.
     */
    Alpaca.Observables = Base.extend(
    {
        constructor: function(scope)
        {
            this.base();

            this.scope = scope;

            this.observables = {};
        },

        observable: function(id, initialValue)
        {
            if (!this.observables[id])
            {
                var observable = new Alpaca.Observable(this.scope, id);

                if (initialValue)
                {
                    observable.set(initialValue);
                }

                this.observables[id] = observable;
            }

            // hand back from map
            return this.observables[id];
        },

        dependentObservable: function(id, func)
        {
            var _this = this;

            if (!this.observables[id])
            {
                var observable = this.observable(id);

                // wrap the model
                var m = new Alpaca.Observables(this.scope);
                m.observable = function(x, y)
                {
                    //Ratchet.debug("Observable: " + observable.id + " depends on observable: " + x);
                    var o = _this.observable(x, y);
                    o.markDependentOnUs(observable);

                    return o;
                };

                // create the value function (where "this" = the model)
                var valueFunction = function() {
                    return func.call(m);
                };

                observable.setValueFunction(valueFunction);
            }

            return this.observables[id];
        },

        observables: function()
        {
            return this.observables;
        }

    });

})(jQuery);
(function($)
{
    var Alpaca = $.alpaca;

    Alpaca.Observable = Base.extend(
    {
        constructor: function(scope, id)
        {
            var _this = this;

            this.base();

            this.id = scope + "-" + id;

            this.value = null;
            this.subscribers = {};

            // array that contains observable whose value is dependent on our value
            this.dependentOnUs = {};


            // privileged functions

            this.notifySubscribers = function(prior)
            {
                var _this = this;

                $.each(this.subscribers, function(id, handler) {
                    handler(_this.value, prior);
                });
            };

            this.notifyDependents = function(prior)
            {
                $.each(this.dependentOnUs, function(key, observer) {
                    observer.onDependencyChange();
                });
            };

            // assume null value function
            this.valueFunction = null;
        },

        setValueFunction: function(valueFunction)
        {
            this.valueFunction = valueFunction;
            this.onDependencyChange();
        },

        /**
         * Registers a handler which acts as a subscriber.  When this observable value changes,
         * the handler method is raised.
         *
         * @param f
         */
        subscribe: function(id, handler)
        {
            if (!this.isSubscribed(id))
            {
                this.subscribers[id] = handler;
            }
        },

        unsubscribe: function(id)
        {
            delete this.subscribers[id];
        },

        isSubscribed: function(id)
        {
            return (this.subscribers[id] ? true: false);
        },

        markDependentOnUs: function(observable)
        {
            this.dependentOnUs[observable.id] = observable;
        },

        /**
         * Fired when one of our dependents has changed its value.
         */
        onDependencyChange: function()
        {
            var prior = this.get();

            // if we have a value calculation function, fire it
            if (this.valueFunction)
            {
                var current = this.valueFunction();

                // if the value changed, notify
                if (prior != current)
                {
                    this.set(current);
                }
            }
        },

        set: function(value)
        {
            var prior = this.value;
            this.value = value;

            // notify all dependents (observers that depend on our value)
            this.notifyDependents(prior);

            // notify all subscribers of the updated value
            this.notifySubscribers(prior);
        },

        get: function(_default)
        {
            var v = this.value;
            if (!v)
            {
                v = _default;
            }
            return v;
        },

        clear: function()
        {
            var prior = this.value;
            delete this.value;

            // notify all dependents (observers that depend on our value)
            this.notifyDependents(prior);

            // notify all subscribers of the updated value
            this.notifySubscribers(prior);
        }

    });

})(jQuery);
(function($)
{
    var Alpaca = $.alpaca;

    Alpaca.ScopedObservables = {};
    Alpaca.ScopedObservables.map = {};

    Alpaca.ScopedObservables.get = function(scope)
    {
        if (!Alpaca.ScopedObservables.map[scope])
        {
            Alpaca.ScopedObservables.map[scope] = new Alpaca.Observables(scope);
        }

        return Alpaca.ScopedObservables.map[scope];
    };

})(jQuery);

(function()
{
    Alpaca.TemplateEngineRegistry = (function() {

        var registry = {};

        return {

            register: function(id, engine)
            {
                registry[id] = engine;

                engine.init();
            },

            find: function(idOrType)
            {
                var engine = null;

                if (registry[idOrType])
                {
                    engine = registry[idOrType];
                }
                else
                {
                    // inspect by type
                    for (var id in registry)
                    {
                        var supportedMimetypes = registry[id].supportedMimetypes();
                        for (var i = 0; i < supportedMimetypes.length; i++)
                        {
                            if (idOrType.toLowerCase() === supportedMimetypes[i].toLowerCase())
                            {
                                engine = registry[id];
                                break;
                            }
                        }
                    }
                }

                return engine;
            },

            ids: function()
            {
                var ids = [];

                for (var id in registry)
                {
                    ids.push(id);
                }

                return ids;
            }
        };
    })();

})();

(function($)
{
    Alpaca.AbstractTemplateEngine = Base.extend(
    {
        constructor: function(id)
        {
            this.base();

            this.id = id;

            this.cleanup = function(html)
            {
                if (html)
                {
                    // if if starts with a script tag, then we strip that out
                    if ($(html).length === 1)
                    {
                        if ($(html)[0].nodeName.toLowerCase() === "script")
                        {
                            return $(html).html();

                        }
                    }
                }

                return html;
            };
        },

        /**
         * Compiles the given template (or URI or dom selector)
         *
         * The callback is fired once the compile completes and has signature callback(err).
         *
         * @param cacheKey
         * @param template
         * @param connector
         * @param callback
         */
        compile: function(cacheKey, template, connector, callback)
        {
            var self = this;

            // the value being compiled can be
            //   HTML
            //   URL (http, ./ or /)
            //   dom selector (#abc, .classname)
            //   dom element

            // here we try to determine what type of value it is
            var type = "html";
            if (Alpaca.isString(template))
            {
                var lc = template.toLowerCase();
                if (Alpaca.isUri(lc))
                {
                    type = "uri";
                }
                else if (template.indexOf("#") === 0 || template.indexOf(".") === 0 || template.indexOf("[") === 0)
                {
                    type = "selector";
                }
            }
            else
            {
                // it's a dom element, we flow through
            }

            // now extract html and compile
            if (type === "selector")
            {
                self._compile(cacheKey, template, function(err) {
                    callback(err);
                });
            }
            else if (type === "uri")
            {
                var fileExtension = self.fileExtension();

                var url = template;
                if (url.indexOf("." + fileExtension) === -1) {
                    url += "." + fileExtension;
                }

                // load the template using the connector
                connector.loadTemplate(url, function(html) {

                    // cleanup html
                    html = self.cleanup(html);

                    self._compile(cacheKey, html, function(err) {
                        callback(err);
                    });

                }, function(err) {
                    callback(err);
                });
            }
            else if (type === "html")
            {
                var html = template;
                if (html instanceof jQuery)
                {
                    html = $(html).outerHTML();
                }

                self._compile(cacheKey, html, function(err) {
                    callback(err);
                });
            }
            else
            {
                callback(new Error("Template engine cannot determine how to handle type: " + type));
            }
        },

        _compile: function(cacheKey, html, callback)
        {
            // for null templates, set to empty string
            if (Alpaca.isEmpty(html)) {
                html = "";
            }

            // trim the html
            html = Alpaca.trim(html);

            if (html.toLowerCase().indexOf("<script") === 0)
            {
                // already has script tag
            }
            else
            {
                // apply script tag
                html = "<script type='" + this.supportedMimetypes()[0] + "'>" + html + "</script>";
            }

            Alpaca.logDebug("Compiling template: " + this.id + ", cacheKey: " + cacheKey + ", template: " + html);

            this.doCompile(cacheKey, html, callback);
        },

        /**
         * @extension_point
         *
         * @param cacheKey
         * @param html
         * @param callback
         */
        doCompile: function(cacheKey, html, callback)
        {

        },

        /**
         * @extension_point
         *
         * @param cacheKey
         * @param model
         * @param errorCallback
         */
        execute: function(cacheKey, model, errorCallback)
        {
            Alpaca.logDebug("Executing template for cache key: " + cacheKey);

            var html = this.doExecute(cacheKey, model, errorCallback);

            // removes wrapping <script/> tag
            html = this.cleanup(html);

            return html;
        },

        /**
         * Execute a template and hand back a text string.
         *
         * @extension_point
         *
         * @param cacheKey
         * @param model
         * @param errorCallback
         */
        doExecute: function(cacheKey, model, errorCallback)
        {
            return null;
        },

        /**
         * Hands back the expected file extension for templates loaded via URI.
         *
         * @return {String}
         */
        fileExtension: function() {
            return "html";
        },

        /**
         * Hands back the list of associated script tag types for templates loaded from the DOM.
         *
         * @return {Array}
         */
        supportedMimetypes: function()
        {
            return [];
        },

        /**
         * Determines whether an existing template is already in cache.
         *
         * @param cacheKey
         */
        isCached: function(cacheKey)
        {
            return false;
        },

        /**
         * Acquires an array of cache keys matching the view.
         *
         * @param viewId
         */
        findCacheKeys: function(viewId)
        {
            return [];
        }

    });

})(jQuery);

(function($, Handlebars, HandlebarsPrecompiled)
{
    // runtime cache of precompiled templates keyed by cacheKey
    var COMPILED_TEMPLATES = {};

    var helpers = {};
    helpers["compare"] = function(lvalue, rvalue, options)
    {
        if (arguments.length < 3) {
            throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
        }

        var operator = options.hash.operator || "==";

        var operators = {
            '==':       function(l,r) { return l == r; }, // jshint ignore:line
            '===':      function(l,r) { return l === r; },
            '!=':       function(l,r) { return l != r; }, // jshint ignore:line
            '!==':      function(l,r) { return l !== r; },
            '<':        function(l,r) { return l < r; },
            '>':        function(l,r) { return l > r; },
            '<=':       function(l,r) { return l <= r; },
            '>=':       function(l,r) { return l >= r; },
            'typeof':   function(l,r) { return typeof l == r; } // jshint ignore:line
        };

        if (!operators[operator]) {
            throw new Error("Handlerbars Helper 'compare' doesn't know the operator "+operator);
        }

        var result = operators[operator](lvalue,rvalue);

        if( result ) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    };
    helpers["ifnot"] = function(value, options)
    {
        if (!value)
        {
            return options.fn(this);
        }
        else
        {
            return options.inverse(this);
        }
    };
    helpers["times"] = function(n, block) {
        var accum = '';
        for(var i = 0; i < n; ++i)
        {
            accum += block.fn(i);
        }
        return accum;
    };
    helpers["control"] = function(options)
    {
        return "<div class='" + Alpaca.MARKER_CLASS_CONTROL_FIELD + "'></div>";
    };
    helpers["container"] = function(options)
    {
        return "<div class='" + Alpaca.MARKER_CLASS_CONTAINER_FIELD + "'></div>";
    };
    helpers["item"] = function(tag, options)
    {
        if (Alpaca.isObject(tag))
        {
            options = tag;
            tag = "div";
        }

        return "<" + tag + " class='" + Alpaca.MARKER_CLASS_CONTAINER_FIELD_ITEM + "' " + Alpaca.MARKER_DATA_CONTAINER_FIELD_ITEM_KEY + "='" + this.name + "'></" + tag + ">";
    };
    helpers["itemField"] = function(tag, options)
    {
        if (Alpaca.isObject(tag))
        {
            options = tag;
            tag = "div";
        }

        return "<" + tag + " class='" + Alpaca.MARKER_CLASS_CONTAINER_FIELD_ITEM_FIELD + "'></" + tag + ">";
    };
    helpers["formItems"] = function(options)
    {
        return "<div class='" + Alpaca.MARKER_CLASS_FORM_ITEMS_FIELD + "'></div>";
    };
    helpers["insert"] = function(key)
    {
        return "<div class='" + Alpaca.MARKER_CLASS_INSERT + "' " + Alpaca.MARKER_DATA_INSERT_KEY + "='" + key + "'></div>";
    };
    helpers["str"] = function(data)
    {
        if (data === false)
        {
            return "false";
        }
        else if (data === true)
        {
            return "true";
        }
        else if (data === 0)
        {
            return "0";
        }
        else if (typeof(data) == "undefined")
        {
            return "";
        }
        else if (data === null)
        {
            return "";
        }
        else if (Alpaca.isString(data))
        {
            return data;
        }
        else if (Alpaca.isNumber(data))
        {
            return data;
        }
        else if (Alpaca.isObject(data))
        {
            return JSON.stringify(data, null, "  ");
        }
        else if (Alpaca.isArray(data))
        {
            return JSON.stringify(data, null, "  ");
        }

        return data;
    };
    helpers["arrayToolbar"] = function(options)
    {
        return "<div class='" + Alpaca.MARKER_CLASS_ARRAY_TOOLBAR + "' " + Alpaca.MARKER_DATA_ARRAY_TOOLBAR_FIELD_ID + "='" + this.id + "'></div>";
    };
    helpers["arrayActionbar"] = function(options)
    {
        var html = "<div class='" + Alpaca.MARKER_CLASS_ARRAY_ITEM_ACTIONBAR + "' " + Alpaca.MARKER_DATA_ARRAY_ITEM_KEY + "='" + this.name + "'";
        html += " " + Alpaca.MARKER_DATA_ARRAY_ITEM_FIELD_ID + "='" + this.id + "'";
        if (this.parentFieldId)
        {
            html += " " + Alpaca.MARKER_DATA_ARRAY_ITEM_PARENT_FIELD_ID + "='" + this.parentFieldId + "'"
        }
        html += "></div>";

        return html;
    };
    helpers["showMessage"] = function(key, options)
    {
        var value = key;

        // if the key starts with "msg:", then load external
        if (key && key.indexOf("msg:") === 0)
        {
            value = key = key.substring(4);

            // can we load the value externally?
            var externalValue = Alpaca.externalMessage(key);
            if (externalValue)
            {
                value = externalValue;
            }
        }

        return new Handlebars.SafeString(value);
    };
    Handlebars.registerHelper("arrayToolbar", helpers["arrayToolbar"]);
    Handlebars.registerHelper("arrayActionbar", helpers["arrayActionbar"]);

    Handlebars.registerHelper("setIndex", function(value){
        this.index = Number(value);
    });

    Handlebars.registerHelper("eachProperty", function(context, options) {
        var ret = "";
        for(var prop in context)
        {
            ret = ret + options.fn({key:prop,value:context[prop]});
        }
        return ret;
    });


    Handlebars.registerHelper("uploadErrorMessage", function(error) {

        var message = error;

        if (error === 1)
        {
            message = "File exceeds upload_max_filesize";
        }
        else if (error === 2)
        {
            message = "File exceeds MAX_FILE_SIZE";
        }
        else if (error === 3)
        {
            message = "File was only partially uploaded";
        }
        else if (error === 4)
        {
            message = "No File was uploaded";
        }
        else if (error === 5)
        {
            message = "Missing a temporary folder";
        }
        else if (error === 6)
        {
            message = "Failed to write file to disk";
        }
        else if (error === 7)
        {
            message = "File upload stopped by extension";
        }
        else if (error === "maxFileSize")
        {
            message = "File is too big";
        }
        else if (error === "minFileSize")
        {
            message = "File is too small";
        }
        else if (error === "acceptFileTypes")
        {
            message = "Filetype not allowed";
        }
        else if (error === "maxNumberOfFiles")
        {
            message = "Max number of files exceeded";
        }
        else if (error === "uploadedBytes")
        {
            message = "Uploaded bytes exceed file size";
        }
        else if (error === "emptyResult")
        {
            message = "Empty file upload result";
        }

        return message;
    });

    Handlebars.registerHelper("disguise", function(text, character) {

        var replaced = "";
        for (var i = 0; i < text.length; i++) {
            replaced += character;
        }

        return replaced;

    });

    //Handlebars.registerHelper("each", helpers["each"]);
    Handlebars.registerHelper("compare", helpers["compare"]);
    Handlebars.registerHelper("control", helpers["control"]);
    Handlebars.registerHelper("container", helpers["container"]);
    Handlebars.registerHelper("item", helpers["item"]);
    Handlebars.registerHelper("itemField", helpers["itemField"]);
    Handlebars.registerHelper("formItems", helpers["formItems"]);
    Handlebars.registerHelper("times", helpers["times"]);
    Handlebars.registerHelper("str", helpers["str"]);

    // with
    Handlebars.registerHelper('with', function(context, options) {
        return options.fn(context);
    });

    // ifnot
    Handlebars.registerHelper("ifnot", helpers["ifnot"]);

    // message
    Handlebars.registerHelper("showMessage", helpers["showMessage"]);

    Alpaca.HandlebarsTemplateEngine = Alpaca.AbstractTemplateEngine.extend(
    {
        fileExtension: function() {
            return "html";
        },

        supportedMimetypes: function()
        {
            return [
                "text/x-handlebars-template",
                "text/x-handlebars-tmpl"
            ];
        },

        init: function()
        {
            // auto discover any precompiled templates and store them by cache key here
            if (HandlebarsPrecompiled)
            {
                for (var viewId in HandlebarsPrecompiled)
                {
                    var viewTemplates = HandlebarsPrecompiled[viewId];
                    for (var templateId in viewTemplates)
                    {
                        var template = viewTemplates[templateId];
                        if (typeof(template) === "function")
                        {
                            // cache key
                            var cacheKey = Alpaca.makeCacheKey(viewId, "view", viewId, templateId);

                            // cache
                            COMPILED_TEMPLATES[cacheKey] = template;
                        }
                    }
                }
            }
        },

        doCompile: function(cacheKey, html, callback)
        {
            var self = this;

            var template = null;
            try
            {
                var functionString = Handlebars.precompile(html);
                template = eval("(" + functionString + ")"); // jshint ignore:line

                // convert to function - fn(model)
                template = Handlebars.template(template);

                // CACHE: write
                COMPILED_TEMPLATES[cacheKey] = template;
            }
            catch (e)
            {
                return callback(e);
            }

            callback();
        },

        doExecute: function(cacheKey, model, errorCallback)
        {
            var self = this;

            // CACHE: read
            var templateFunction = COMPILED_TEMPLATES[cacheKey];
            if (!templateFunction)
            {
                errorCallback(new Error("Could not find handlebars cached template for key: " + cacheKey));
                return;
            }

            // render template
            var html = null;
            try
            {
                html = templateFunction(model);
            }
            catch (e)
            {
                errorCallback(e);
                return null;
            }

            return html;
        },

        isCached: function(cacheKey)
        {
            return (COMPILED_TEMPLATES[cacheKey] ? true  : false);
        },

        findCacheKeys: function(viewId)
        {
            var cacheKeys = [];

            for (var cacheKey in COMPILED_TEMPLATES)
            {
                if (cacheKey.indexOf(viewId + ":") === 0)
                {
                    cacheKeys.push(cacheKey);
                }
            }

            return cacheKeys;
        }

    });

    // auto register
    Alpaca.TemplateEngineRegistry.register("handlebars", new Alpaca.HandlebarsTemplateEngine("handlebars"));

})(jQuery, ((typeof(Handlebars) != "undefined") ? Handlebars : window.Handlebars), ((typeof(HandlebarsPrecompiled) != "undefined") ? HandlebarsPrecompiled : window.HandlebarsPrecompiled));

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.NormalizedView = Base.extend(
    /**
     * @lends Alpaca.NormalizedView.prototype
     */
    {
        /**
         * Once all of the Alpaca views are registered with the framework, each is normalized so that parent-chain
         * references and overrides are normalized into a single, fast lookup object.
         *
         * @constructs
         *
         * @class Normalized view.
         *
         * @param {String} the view id
         */
        constructor: function(viewId) {
            this.id = viewId;
        },

        /**
         * Normalization occurs once per view upon startup of Alpaca.
         */
        normalize: function(views)
        {
            // load the view object
            var viewObject  = views[this.id];
            if (!viewObject)
            {
                Alpaca.logError("View compilation failed - view not found: " + this.id);
                return false;
            }

            // collect the inheritance chain
            var chain = [];
            var current = viewObject;
            while (current) {
                chain.push(current);

                var parentId = current.parent;
                if (parentId) {
                    var parent = views[current.parent];
                    if (!parent) {
                        Alpaca.logError("View compilation failed - cannot find parent view: " + parentId + " for view: " + current.id);
                        return false;
                    }
                    current = parent;
                }
                else
                {
                    current = null;
                }
            }

            // reverse the chain
            chain = chain.reverse();

            var setScalar = function(target, source, propertyId)
            {
                var value = source[propertyId];

                var currentValue = target[propertyId];
                if (!Alpaca.isUndefined(currentValue) && !Alpaca.isUndefined(value))
                {
                    Alpaca.logDebug("View property: " + propertyId + " already has value: " + currentValue + " and overwriting to: " + value);
                }

                if (!Alpaca.isUndefined(value)) {
                    target[propertyId] = value;
                }
            };

            var setFunction = function(target, source, propertyId)
            {
                var value = source[propertyId];

                var currentValue = target[propertyId];
                if (!Alpaca.isUndefined(currentValue) && !Alpaca.isUndefined(value))
                {
                    Alpaca.logDebug("View property: " + propertyId + " already has function, overwriting");
                }

                if (!Alpaca.isUndefined(value)) {
                    target[propertyId] = value;
                }
            };

            var mergeMap = function(target, source, propertyId)
            {
                var sourceMap = source[propertyId];
                if (sourceMap)
                {
                    if (!target[propertyId])
                    {
                        target[propertyId] = {};
                    }

                    Alpaca.mergeObject2(sourceMap, target[propertyId]);
                }
            };

            // walk forward and apply
            for (var i = 0; i < chain.length; i++)
            {
                var element = chain[i];

                // core properties
                setScalar(this, element, "type"); // view, edit, create
                setScalar(this, element, "ui"); // bootstrap, jqueryui, jquerymobile, web

                // whether the view is readonly
                setScalar(this, element, "displayReadonly");

                // locale
                setScalar(this, element, "locale");

                // functions
                setFunction(this, element, "render");
                setFunction(this, element, "postRender");

                // view templates
                mergeMap(this, element, "templates");

                // field templates
                mergeMap(this, element, "fields");

                // layout
                mergeMap(this, element, "layout");

                // styles
                mergeMap(this, element, "styles");

                // callbacks
                mergeMap(this, element, "callbacks");

                // messages
                mergeMap(this, element, "messages");

                // horizontal
                setScalar(this, element, "horizontal");

                // TODO: remove some of these?
                setScalar(this, element, "collapsible");
                setScalar(this, element, "legendStyle");
                setScalar(this, element, "toolbarStyle");
                setScalar(this, element, "buttonStyle");
                setScalar(this, element, "toolbarSticky");
                setScalar(this, element, "globalTemplate");

                // TODO: remove wizard?
                mergeMap(this, element, "wizard");
            }

            Alpaca.logDebug("View compilation complete for view: " + this.id);
            Alpaca.logDebug("Final view: ");
            Alpaca.logDebug(JSON.stringify(this, null, "   "));

            return true;
        }
    });
})(jQuery);
/*jshint -W004 */ // duplicate variables
(function($) {

    var Alpaca = $.alpaca;

    Alpaca.RuntimeView = Base.extend(
    /**
     * @lends Alpaca.RuntimeView.prototype
     */
    {
        /**
         * Runtime implementation of a view as applied to a field.
         *
         * This provides accessors into the nested behaviors of views and also takes into account field-level attributes
         * of the currently rendering dom element.
         *
         * @constructs
         *
         * @class Class for managing view components such as layout, template, message etc.
         *
         * @param {String} the view id
         * @param {Object} field the field control
         */
        constructor: function(viewId, field) {
            this.field = field;
            this.setView(viewId);
        },

        /**
         * Sets the view that this runtime view adapters should consult during render.
         *
         * @param {String} the view id
         */
        setView: function (viewId)
        {
            // TODO: should field classes ever really be instantiated directly?
            // TODO: this is left in to support Alpaca docs generation (need to clean this up)s
            // if a view is not set at this point it probably means they instantiated a field directly
            // in which case, we'll just pick the default view
            if (!viewId)
            {
                viewId =  "web-edit";
            }

            // the normalized view
            var normalizedView = Alpaca.getNormalizedView(viewId);
            if (!normalizedView)
            {
                // this should never be the case
                throw new Error("Runtime view for view id: " + viewId + " could not find a normalized view");
            }

            // copy compiled properties into this object
            for (var k in normalizedView)
            {
                if (normalizedView.hasOwnProperty(k)) {
                    this[k] = normalizedView[k];
                }
            }
        },

        /**
         * Gets view wizard settings.
         *
         * @returns {Object} View wizard settings.
         */
        getWizard : function () {
            return this.getViewParam("wizard");
        },

        /**
         * Gets the global layout template.
         *
         * @returns {Object|String} Global layout template setting of the view.
         */
        getGlobalTemplateDescriptor : function ()
        {
            return this.getTemplateDescriptor("globalTemplate");
        },

        /**
         * Gets layout template and bindings.
         *
         * @returns {Object} Layout template and bindings setting of the view.
         */
        getLayout: function ()
        {
            var self = this;

            return {
                "templateDescriptor": this.getTemplateDescriptor("layoutTemplate", self),
                "bindings": this.getViewParam(["layout","bindings"], true)
            };
        },

        /**
         * Hands back the compiled template id for a given template.
         *
         * @param templateId
         * @param field (optional)
         */
        getTemplateDescriptor: function(templateId, field)
        {
            return Alpaca.getTemplateDescriptor(this, templateId, field);
        },

        /**
         * Gets message for the given id
         *
         * @param {String} messageId Message id
         * @param {String} locale locale
         *
         * @returns {String} Message mapped to the given id.
         */
        getMessage : function (messageId, locale)
        {
            if (!locale) {
                locale = Alpaca.defaultLocale;
            }

            var messageForLocale = this.getViewParam(["messages", locale, messageId]);
            if (Alpaca.isEmpty(messageForLocale)) {
                messageForLocale = this.getViewParam(["messages", messageId]);
            }

            return messageForLocale;
        },

        /**
         * Retrieves view parameter based on configuration Id or Id array.
         *
         * @param {String|Array} configId Configuration id or array.
         *
         * @returns {Any} View parameter mapped to configuration Id or Id array.
         */
        getViewParam: function (configId, topLevelOnly) {

            var self = this;

            // look for exact match
            var fieldPath = this.field.path;
            if (this.fields && this.fields[fieldPath]) {
                var configVal = this._getConfigVal(this.fields[fieldPath], configId);
                if (!Alpaca.isEmpty(configVal)) {
                    return configVal;
                }
            }

            // array related field path (using [*] syntax)  i.e.  /a/b[*]/c/d[*]/e
            if (fieldPath && fieldPath.indexOf('[') !== -1 && fieldPath.indexOf(']') !== -1) {
                var newFieldPath = fieldPath.replace(/\[\d+\]/g,"[*]");
                if (this.fields && this.fields[newFieldPath]) {
                    var configVal = this._getConfigVal(this.fields[newFieldPath], configId);
                    if (!Alpaca.isEmpty(configVal)) {
                        return configVal;
                    }
                }
            }

            // array related field path (using pure path syntax)   i.e. /a/b/c/d/e
            if (fieldPath && fieldPath.indexOf('[') !== -1 && fieldPath.indexOf(']') !== -1) {
                var newFieldPath = fieldPath.replace(/\[\d+\]/g,"");
                if (this.fields && this.fields[newFieldPath]) {
                    var configVal = this._getConfigVal(this.fields[newFieldPath], configId);
                    if (!Alpaca.isEmpty(configVal)) {
                        return configVal;
                    }
                }
            }

            if (!Alpaca.isEmpty(topLevelOnly) && topLevelOnly && this.field.path !== "/") {
                return null;
            }

            return this._getConfigVal(this, configId);
        },

        /**
         * Internal method for getting configuration.
         *
         * @private
         *
         * @param {Any} configVal configuration value.
         * @param {String} configId configuration id.
         *
         * @returns {Any} configuration mapping to the given id
         */
        _getConfigVal : function (configVal, configId) {
            if (Alpaca.isArray(configId)) {
                for (var i = 0; i < configId.length && !Alpaca.isEmpty(configVal); i++) {
                    configVal = configVal[configId[i]];
                }
            } else {
                if (!Alpaca.isEmpty(configVal)) {
                    configVal = configVal[configId];
                }
            }
            return configVal;
        },

        fireCallback: function(field, id, arg1, arg2, arg3, arg4, arg5)
        {
            var self = this;

            if (this.callbacks && this.callbacks[id])
            {
                this.callbacks[id].call(field, arg1, arg2, arg3, arg4, arg5);
            }
        },

        applyStyle: function(id, fieldOrEl)
        {
            var el = fieldOrEl;
            if (el && el.getFieldEl) {
                el = el.getFieldEl();
            }

            if (el)
            {
                if (this.styles && this.styles[id])
                {
                    $(el).addClass(this.styles[id]);
                }
            }
        },

        getStyle: function(id)
        {
            return this.styles[id] ? this.styles[id] : "";
        }


    });
})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Field = Base.extend(
    /**
     * @lends Alpaca.Field.prototype
     */
    {
        /**
         * @constructs
         *
         * @class Abstract class that served as base for all Alpaca field classes that provide actual implementation.
         *
         * @param {Object} domEl The dom element to which this field is ultimately rendering.
         * @param {Any} data Field data
         * @param {Object} options Field options.
         * @param {Object} schema Field schema.
         * @param {String} viewId view id
         * @param {Alpaca.Connector} connector Field connector.
         * @param {Function} errorCallback Error callback.
         */
        constructor: function(domEl, data, options, schema, viewId, connector, errorCallback) {

            var self = this;

            // mark that we are initializing
            this.initializing = true;

            // domEl
            this.domEl = domEl;

            // parent
            this.parent = null;

            // config
            this.data = data;
            this.options = options;
            this.schema = schema;
            this.connector = connector;
            this.errorCallback = function(err)
            {
                if (errorCallback)
                {
                    errorCallback(err);
                }
                else
                {
                    Alpaca.defaultErrorCallback.call(self, err);
                }
            };

            // check if this field rendering is single-level or not
            this.singleLevelRendering = false;

            // set a runtime view
            this.view = new Alpaca.RuntimeView(viewId, this);

            // things we can draw off the options
            var noOptions = false;
            if (!this.options) {
                this.options = {};
                noOptions = true;
            }
            this.id = this.options.id;
            this.type = this.options.type;

            // setup defaults
            if (!this.id) {
                this.id = Alpaca.generateId();
            }
            var noSchema = false;
            if (!this.schema) {
                this.schema = {};
                noSchema = true;
            }
            if (!this.options.label && this.schema.title !== null) {
                this.options.label = this.schema.title;
            }

            /*
            if (!this.options.helper && this.schema.description !== null) {
                this.options.helper = this.schema.description;
            }
            */

            // legacy support: options.helper -> convert to options.helpers
            if (!this.options.helpers) {
                this.options.helpers = [];
            }
            if (this.options.helper) {
                if (!Alpaca.isArray(this.options.helper)) {
                    this.options.helpers.push(this.options.helper);
                } else {
                    for (var i = 0; i < this.options.helper.length; i++) {
                        this.options.helpers.push(this.options.helper[i]);
                    }
                }

                // remove legacy value
                delete this.options.helper;
            }

            // options.helpersPosition defaults to above
            if (!this.options.helpersPosition) {
                this.options.helpersPosition = this.options.helperPosition
            }
            if (!this.options.helpersPosition) {
                this.options.helpersPosition = Alpaca.defaultHelpersPosition;
            }

            if (Alpaca.isEmpty(this.options.readonly) && !Alpaca.isEmpty(this.schema.readonly)) {
                this.options.readonly = this.schema.readonly;
            }

            // in case they put "default" on options
            if (typeof(this.schema.default) === "undefined")
            {
                if (typeof(this.options.default) !== "undefined")
                {
                    this.schema.default = this.options.default;
                    delete this.options.default;
                }
            }

            // if data is empty, then we check whether we can fall back to a default value
            if (Alpaca.isValEmpty(this.data) && !Alpaca.isEmpty(this.schema["default"])) {
                this.data = this.schema["default"];
                this.showingDefaultData = true;
            }

            // default path
            this.path = "/";

            // validation status
            this.validation = {};

            // events
            this._events = {};



            // helper function to determine if we're in a display-only mode
            this.isDisplayOnly = function()
            {
                return (self.view.type === "view" || self.view.type == "display");
            };

            // schema id cleanup
            if (this.schema && this.schema.id && this.schema.id.indexOf("#") === 0)
            {
                this.schema.id = this.schema.id.substring(1);
            }

            // has this field been previously validated?
            this._previouslyValidated = false;

            this.updateObservable = function()
            {
                // update observable
                if (this.getValue())
                {
                    this.observable(this.path).set(this.getValue());
                }
                else
                {
                    this.observable(this.path).clear();
                }
            };

            this.getObservableScope = function()
            {
                var top = this;
                while (!top.isTop()) {
                    top = top.parent;
                }

                var observableScope = top.observableScope;
                if (!observableScope)
                {
                    observableScope = "global";
                }

                return observableScope;
            };

            this.ensureProperType = function(val)
            {
                var self = this;

                var _ensure = function(v, type)
                {
                    if (Alpaca.isString(v))
                    {
                        if (type === "number")
                        {
                            v = parseFloat(v);
                        }
                        else if (type === "integer")
                        {
                            v = parseInt(v);
                        }
                        else if (type === "boolean")
                        {
                            if (v === "" || v.toLowerCase() === "false")
                            {
                                v = false;
                            }
                            else
                            {
                                v = true;
                            }
                        }
                    }
                    else if (Alpaca.isNumber(v))
                    {
                        if (type === "string")
                        {
                            v = "" + v;
                        }
                        else if (type === "boolean")
                        {
                            if (v === -1 || v === 0)
                            {
                                v = false;
                            }
                            else {
                                v = true;
                            }
                        }
                    }

                    return v;
                };

                if (typeof(val) !== "undefined")
                {
                    if (Alpaca.isArray(val))
                    {
                        for (var i = 0; i < val.length; i++)
                        {
                            if (self.schema.items && self.schema.items.type)
                            {
                                val[i] = _ensure(val[i], self.schema.items.type);
                            }
                        }
                    }
                    else if (Alpaca.isString(val) || Alpaca.isNumber(val))
                    {
                        if (self.schema.type)
                        {
                            val = _ensure(val, self.schema.type);
                        }
                    }
                }

                return val;
            };

            this.onConstruct();
        },

        onConstruct: function()
        {

        },

        isTop: function()
        {
            return !this.parent;
        },

        /**
         * Get the id of the outer field template.
         *
         * For control fields, this is "control".
         * For container fields, this is "container".
         *
         * @returns {String} field template descriptor id
         */
        getTemplateDescriptorId : function () {
            throw new Error("Template descriptor ID was not specified");
        },

        /**
         * Sets up default rendition template from view.
         */
        initTemplateDescriptor: function()
        {
            var self = this;

            var viewTemplateDescriptor = this.view.getTemplateDescriptor(this.getTemplateDescriptorId(), this);
            var globalTemplateDescriptor = this.view.getGlobalTemplateDescriptor();
            var layout = this.view.getLayout();

            // we only allow the global or layout template to be applied to the top-most field
            var trip = false;
            if (this.isTop())
            {
                if (globalTemplateDescriptor)
                {
                    this.setTemplateDescriptor(globalTemplateDescriptor);
                    this.singleLevelRendering = true;
                    trip = true;
                }
                else if (layout && layout.templateDescriptor)
                {
                    this.setTemplateDescriptor(layout.templateDescriptor);
                    trip = true;
                }
            }

            if (!trip && viewTemplateDescriptor)
            {
                this.setTemplateDescriptor(viewTemplateDescriptor);
            }

            // ensure we have a template descriptor
            var t = this.getTemplateDescriptor();
            if (!t)
            {
                return Alpaca.throwErrorWithCallback("Unable to find template descriptor for field: " + self.getFieldType());
            }
        },

        /**
         * This method will be called right after the field instance is created. It will initialize
         * the field to get it ready for rendition.
         */
        setup: function() {

            /*
            if (!this.initializing)
            {
                this.data = this.getValue();
            }
            */

            // ensures that we have a template descriptor picked for this field
            this.initTemplateDescriptor();

            // JSON SCHEMA
            if (Alpaca.isUndefined(this.schema.required)) {
                this.schema.required = false;
            }

            // VALIDATION
            if (Alpaca.isUndefined(this.options.validate)) {
                this.options.validate = true;
            }

            // OPTIONS
            if (Alpaca.isUndefined(this.options.disabled)) {
                this.options.disabled = false;
            }

            // MESSAGES
            if (Alpaca.isUndefined(this.options.showMessages)) {
                this.options.showMessages = true;
            }

            // support for "hidden" field on schema
            if (typeof(this.options.hidden) === "undefined")
            {
                if (typeof(this.schema.hidden) !== "undefined") {
                    this.options.hidden = this.schema.hidden;
                }
            }
        },

        setupField: function(callback)
        {
            callback();
        },

        /**
         * Registers an event listener.
         *
         * @param name
         * @param fn
         * @returns {*}
         */
        on: function(name, fn)
        {
            Alpaca.logDebug("Adding listener for event: " + name);

            if (!this._events[name]) {
                this._events[name] = [];
            }

            this._events[name].push(fn);
            return this;
        },

        /**
         * Unregisters all listeners for an event.
         *
         * @param name
         */
        off: function(name)
        {
            if (this._events[name]) {
                this._events[name].length = 0;
            }
        },

        /**
         * Triggers an event and propagates the event.
         *
         * By default, the behavior is to propagate up to the parent chain (bubble up).
         *
         * If "direction" is set to "down" and the field is a container, then the event is propagated down
         * to children (trickle down).
         *
         * If "direction" is set to "both", then both up and down are triggered.
         *
         * @param name
         * @param event
         * @param direction (optional) see above
         */
        triggerWithPropagation: function(name, event, direction)
        {
            if (typeof(event) === "string") {
                direction = event;
                event = null;
            }

            if (!direction) {
                direction = "up";
            }

            if (direction === "up")
            {
                // we trigger ourselves first
                this.trigger.call(this, name, event);

                // then we trigger parents
                if (this.parent)
                {
                    this.parent.triggerWithPropagation.call(this.parent, name, event, direction);
                }
            }
            else if (direction === "down")
            {
                // do any children first
                if (this.children && this.children.length > 0)
                {
                    for (var i = 0; i < this.children.length; i++)
                    {
                        var child = this.children[i];

                        child.triggerWithPropagation.call(child, name, event, direction);
                    }
                }

                // do ourselves last
                this.trigger.call(this, name, event);
            }
            else if (direction === "both")
            {
                // do any children first
                if (this.children && this.children.length > 0)
                {
                    for (var i = 0; i < this.children.length; i++)
                    {
                        var child = this.children[i];

                        child.triggerWithPropagation.call(child, name, event, "down");
                    }
                }

                // then do ourselves
                this.trigger.call(this, name, event);

                // then we trigger parents
                if (this.parent)
                {
                    this.parent.triggerWithPropagation.call(this.parent, name, event, "up");
                }
            }
        },

        /**
         * Triggers an event
         *
         * @param name
         * @param event
         *
         * Remainder of arguments will be passed to the event handler.
         *
         * @returns {null}
         */
        trigger: function(name, event, arg1, arg2, arg3)
        {
            // NOTE: this == control

            var handlers = this._events[name];
            if (handlers)
            {
                for (var i = 0; i < handlers.length; i++)
                {
                    var handler = handlers[i];

                    var ret = null;
                    if (typeof(handler) === "function")
                    {
                        Alpaca.logDebug("Firing event: " + name);
                        try
                        {
                            ret = handler.call(this, event, arg1, arg2, arg3);
                        }
                        catch (e)
                        {
                            Alpaca.logDebug("The event handler caught an exception: " + name);
                            Alpaca.logDebug(e);
                        }
                    }
                }
            }
        },

        /**
         * Binds the data into the field.  Called at the very end of construction.
         */
        bindData: function()
        {
            if (!Alpaca.isEmpty(this.data))
            {
                this.setValue(this.data);
            }
        },

        /**
         * This is the entry point method into the field.  It is called by Alpaca for each field being rendered.
         *
         * Renders this field into the container and creates a DOM element which is bound into the container.
         *
         * @param {Object|String} view View to be used for rendering field (optional).
         * @param {Function} callback Post-Render callback (optional).
         */
        render: function(view, callback)
        {
            var self = this;

            if (view && (Alpaca.isString(view) || Alpaca.isObject(view)))
            {
                this.view.setView(view);
            }
            else
            {
                if (Alpaca.isEmpty(callback) && Alpaca.isFunction(view))
                {
                    callback = view;
                }
            }

            // last try to see if we can populate the label from propertyId
            if (this.options.label === null && this.propertyId)
            {
                this.options.label = this.propertyId;
            }

            // make a copy of name field
            if (this.options.name)
            {
                this.name = this.options.name;
            }

            // calculate name
            this.calculateName();

            this.setup();

            this.setupField(function() {

                self._render(function() {

                    // trigger the render event
                    self.trigger("render");

                    callback();
                });

            });
        },

        calculateName: function()
        {
            if (!this.name || (this.name && this.nameCalculated))
            {
                // has path?
                if (this.parent && this.parent.name && this.path)
                {
                    var lastSegment = this.path.substring(this.path.lastIndexOf('/') + 1);
                    if (lastSegment.indexOf("[") !== -1 && lastSegment.indexOf("]") !== -1)
                    {
                        lastSegment = lastSegment.substring(lastSegment.indexOf("[") + 1, lastSegment.indexOf("]"));
                    }

                    if (lastSegment)
                    {
                        this.name = this.parent.name + "_" + lastSegment;
                        this.nameCalculated = true;
                    }
                }
                else
                {
                    // generate name from the path
                    if (this.path)
                    {
                        this.name = this.path.replace(/\//g,"").replace(/\[/g,"_").replace(/\]/g,"");
                        this.nameCalculated = true;
                    }
                }
            }
        },

        /**
         * Internal method for processing the render.
         *
         * @private
         * @param {Function} callback Post-render callback.
         */
        _render: function(callback)
        {
            var self = this;

            // check if it needs to be wrapped in a form
            if (self.options.form && Alpaca.isObject(self.options.form))
            {
                self.options.form.viewType = this.view.type;

                var form = self.form;
                if (!form)
                {
                    form = new Alpaca.Form(self.domEl, this.options.form, self.view.id, self.connector, self.errorCallback);
                }
                form.render(function(form) {

                    // NOTE: form is the form instance (not the jquery element)

                    var tempFieldHolder = $("<div></div>");

                    // load the appropriate template and render it
                    self._processRender(tempFieldHolder, function() {

                        // insert the field before our form fields container
                        form.formFieldsContainer.before(self.field);

                        // remove the formFieldsContainer marker
                        form.formFieldsContainer.remove();

                        // bind the top field to the form
                        form.topControl = self;
                        if (self.view.type && self.view.type !== 'view')
                        {
                            form.initEvents();
                        }

                        self.form = form;
                        var me = self;

                        // allow any post-rendering facilities to kick in
                        self.postRender(function() {

                            // finished initializing
                            self.initializing = false;

                            // allow for form to do some late updates
                            self.form.afterInitialize();

                            // when the field removes, remove the form as well
                            $(self.field).bind('destroyed', function (e) {
                                self.form.destroy();
                            });

                            // callback
                            if (callback && Alpaca.isFunction(callback))
                            {
                                callback(self);
                            }

                        });
                    });
                });
            }
            else
            {
                // load the appropriate template and render it
                this._processRender(self.domEl, function() {

                    // add "field" element to the domEl
                    //$(self.field).appendTo(self.domEl);

                    // allow any post-rendering facilities to kick in
                    self.postRender(function() {

                        // finished initializing
                        self.initializing = false;

                        // callback
                        if (callback && Alpaca.isFunction(callback))
                        {
                            callback(self);
                        }

                    });
                });
            }
        },

        /**
         * Renders the field into the given parent element.
         *
         * Once completed, the callback method is called.
         *
         * @private
         *
         * @param {Object} parentEl Field container.
         * @param {Function} callback callback.
         */
        _processRender: function(parentEl, callback)
        {
            var self = this;

            // render the field (outer element)
            self.renderField(parentEl, function() {

                // CALLBACK: "field"
                self.fireCallback("field");

                // render any field elements
                self.renderFieldElements(function() {

                    callback();

                });
            });
        },

        renderFieldDomElement: function(data)
        {
            var templateDescriptor = this.getTemplateDescriptor();

            // render the field
            return Alpaca.tmpl(templateDescriptor, {
                "id": this.getId(),
                "options": this.options,
                "schema": this.schema,
                "data": data,
                "view": this.view,
                "path": this.path,
                "name": this.name
            });
        },

        /**
         * Renders the "field" outer element.  This is usually the control or container.
         *
         * @param parentEl
         * @param onSuccess
         */
        renderField: function(parentEl, onSuccess)
        {
            var self = this;

            // the data we'll render
            var theData = this.data;

            // if we're in display-only mode, and theData is an object, convert to string
            if (this.isDisplayOnly() && typeof(theData) === "object")
            {
                theData = JSON.stringify(theData);
            }

            var renderedDomElement = self.renderFieldDomElement(theData);

            // if we got back multiple elements, try to pick at the first DIV
            if ($(renderedDomElement).length > 0)
            {
                var single = null;
                for (var i = 0; i < $(renderedDomElement).length; i++)
                {
                    var name = $(renderedDomElement)[i].nodeName;
                    if (name)
                    {
                        name = name.toLowerCase();

                        if ("div" === name || "span" === name)
                        {
                            single = $($(renderedDomElement)[i]);
                            break;
                        }
                    }
                }
                if (!single)
                {
                    single = $($(renderedDomElement).last());
                }
                if (single)
                {
                    renderedDomElement = single;
                }
            }

            this.field = renderedDomElement;
            this.field.appendTo(parentEl);

            onSuccess();
        },

        /**
         * Renders any field elements.
         *
         * For controls or containers, this hook is used to inject additional dom elements into the outer field
         * dom element.  Simple field types may choose not to implement this.
         *
         * @param callback {Function} callback
         */
        renderFieldElements: function(callback)
        {
            callback();
        },

        /**
         * This gets called typically once per render.  If a DOM element is moved within a container and it's indexing
         * changes, this will get called against to ensure that DOM properties are kept in sync.
         */
        updateDOMElement: function()
        {
            // all fields get their path
            this.field.attr("data-alpaca-field-path", this.getPath());

            // all fields get their name
            this.field.attr("data-alpaca-field-name", this.getName());

            // name should not appear on field
            this.field.removeAttr("name");
        },

        /**
         * This method will be called after the field rendition is complete. It is served as a way to make final
         * modifications to the dom elements that were produced.
         */
        postRender: function(callback)
        {
            var self = this;

            // all fields get the "alpaca-field" class which marks the outer element
            this.field.addClass("alpaca-field");

            // all fields get marked by type as well
            this.field.addClass("alpaca-field-" + this.getFieldType());

            // all fields get field id data attribute
            this.field.attr("data-alpaca-field-id", this.getId());

            this.updateDOMElement();

            // try to avoid adding unnecessary injections for display view.
            if (this.view.type !== 'view') {

                // optional
                if (this.isRequired())
                {
                    $(this.field).addClass("alpaca-required");

                    // CALLBACK: "required"
                    self.fireCallback("required");
                }
                else
                {
                    $(this.field).addClass("alpaca-optional");

                    // CALLBACK: "optional"
                    self.fireCallback("optional");
                }

                var doDisableField = function()
                {
                    // mark "disabled" attribute onto underlying element
                    Alpaca.disabled($('input', self.field), true);
                    Alpaca.disabled($('select', self.field), true);
                    Alpaca.disabled($(':radio', self.field), true);
                    Alpaca.disabled($(':checkbox', self.field), true);

                    // special case for radio buttons (prevent clicks)
                    $(":radio", self.field).off().click(function(e) {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        return false;
                    });
                    $(".radio label", self.field).off().click(function(e) {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        return false;
                    });

                    // special case (input field)
                    $("input", self.field).off().click(function(e) {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        return false;
                    });

                    // fire disable function
                    if (self.disable) {
                        self.disable();
                    }

                };

                // readonly
                if (this.options.readonly)
                {
                    $(this.field).addClass("alpaca-readonly");

                    $('input', this.field).attr('readonly', 'readonly');

                    // disable the field
                    doDisableField();

                    // CALLBACK: "readonly"
                    self.fireCallback("readonly");
                }

                // disabled
                if (this.options.disabled)
                {
                    $(this.field).addClass("alpaca-disabled");

                    // disable the field
                    doDisableField();

                    // CALLBACK: "disabled"
                    self.fireCallback("disabled");
                }

                // allow single or multiple field classes to be specified via the "fieldClass"
                // or "fieldClasses" options
                var applyFieldClass = function(el, thing)
                {
                    if (thing) {

                        var i = 0;
                        var tokens = null;

                        if (Alpaca.isArray(thing)) {
                            for (i = 0; i < thing.length; i++) {
                                el.addClass(thing[i]);
                            }
                        }
                        else {
                            if (thing.indexOf(",") > -1) {
                                tokens = thing.split(",");
                                for (i = 0; i < tokens.length; i++) {
                                    el.addClass(tokens[i]);
                                }
                            } else if (thing.indexOf(" ") > -1) {
                                tokens = thing.split(" ");
                                for (i = 0; i < tokens.length; i++) {
                                    el.addClass(tokens[i]);
                                }
                            }
                            else {
                                el.addClass(thing);
                            }
                        }
                    }
                };
                applyFieldClass(this.field, this.options["fieldClass"]);

                /*
                // Support for custom styles provided by custom view
                var customStyles = this.view.getStyles();
                if (customStyles)
                {
                    for (var styleClass in customStyles)
                    {
                        $(styleClass, this.domEl).css(customStyles[styleClass]);
                    }
                }
                */

                // after render
                if (this.options.disabled)
                {
                    this.disable();

                    // CALLBACK: "disable"
                    self.fireCallback("disable");
                }

                // we bind data if we're in "edit" mode
                // typically, we don't bind data if we're in "create" or any other mode
                if (this.view.type && this.view.type === 'edit')
                {
                    this.bindData();
                }
                else if (this.showingDefaultData)
                {
                    // if this control is showing default data, then we render the control anyway
                    this.bindData();
                }

                // some logging to be useful
                if (this.view.type === "create")
                {
                    Alpaca.logDebug("Skipping data binding for field: " + this.id + " since view mode is 'create'");
                }

                // initialize dom-level events
                if (this.view.type && this.view.type !== 'view')
                {
                    this.initEvents();
                }
            }

            // hidden
            if (this.options.hidden)
            {
                this.field.hide();
            }

            var defaultHideInitValidationError = (this.view.type === 'create') && !this.refreshed;
            this.hideInitValidationError = Alpaca.isValEmpty(this.options.hideInitValidationError) ? defaultHideInitValidationError : this.options.hideInitValidationError;

            // for create view, hide all readonly fields
            if (!this.view.displayReadonly)
            {
                $(this.field).find(".alpaca-readonly").hide();
            }

            // field level post render
            if (this.options.postRender)
            {
                this.options.postRender.call(this, function() {

                    callback();

                });
            }
            else
            {
                callback();
            }
        },

        /**
         * Redraws the field using the currently bound DOM element and view.
         *
         * @param callback
         */
        refresh: function(callback)
        {
            var self = this;

            // store back data
            var _externalData = self.getValue();
            this.data = self.getValue();

            // remember this stuff
            var oldDomEl = self.domEl;
            var oldField = self.field;
            //var oldControl = self.control;
            //var oldContainer = self.container;
            //var oldForm = self.form;

            // insert marker element before current field to mark where we'll render
            var markerEl = $("<div></div>");
            $(oldField).before(markerEl);

            // temp domEl
            self.domEl = $("<div style='display: none'></div>");
            // clear this stuff out
            self.field = undefined;
            self.control = undefined;
            self.container = undefined;
            self.form = undefined;

            // disable all buttons on our current field
            // we do this because repeated clicks could cause trouble while the field is in some half-state
            // during refresh
            $(oldField).find("button").prop("disabled", true);

            // mark that we are initializing
            this.initializing = true;

            // re-setup the field
            self.setup();

            self.setupField(function() {

                // render
                self._render(function() {

                    // move ahead of marker
                    $(markerEl).before(self.field);

                    // reset the domEl
                    self.domEl = oldDomEl;

                    // copy classes from oldField onto field
                    var oldClasses = $(oldField).attr("class");
                    if (oldClasses) {
                        $.each(oldClasses.split(" "), function(i, v) {
                            if (v && !v.indexOf("alpaca-") === 0) {
                                $(self.field).addClass(v);
                            }
                        });
                    }

                    // hide the old field
                    $(oldField).hide();

                    // remove marker
                    $(markerEl).remove();

                    // mark that we're refreshed
                    self.refreshed = true;

                    /*
                    // this is apparently needed for objects and arrays
                    if (typeof(_externalData) !== "undefined")
                    {
                        if (Alpaca.isObject(_externalData) || Alpaca.isArray(_externalData))
                        {
                            self.setValue(_externalData, true);
                        }
                    }
                    */

                    // fire the "ready" event
                    Alpaca.fireReady(self);

                    if (callback)
                    {
                        callback.call(self);
                    }

                    // afterwards...

                    // now clean up old field elements
                    // the trick here is that we want to make sure we don't trigger the bound "destroyed" event handler
                    // for the old dom el.
                    //
                    // the reason is that we have oldForm -> Field (with oldDomEl)
                    //                        and form -> Field (with domEl)
                    //
                    // cleaning up "oldDomEl" causes "Field" to cleanup which causes "oldForm" to cleanup
                    // which causes "Field" to cleanup which causes "domEl" to clean up (and also "form")
                    //
                    // here we just want to remove the dom elements for "oldDomEl" and "oldForm" without triggering
                    // the special destroyer event
                    //
                    // appears that we can do this with a second argument...?
                    //
                    $(oldField).remove(undefined, {
                        "nodestroy": true
                    });

                });
            });
        },


        /**
         * Applies a view style to a dom element.
         *
         * @param id
         * @param target
         */
        applyStyle: function(id, target)
        {
            this.view.applyStyle(id, target);
        },

        /**
         * Fires a view callback for the current field.
         *
         * @param id
         * @param arg1
         * @param arg2
         * @param arg3
         * @param arg4
         * @param arg5
         */
        fireCallback: function(id, arg1, arg2, arg3, arg4, arg5)
        {
            this.view.fireCallback(this, id, arg1, arg2, arg3, arg4, arg5);
        },

        /**
         * Retrieves the outer "field" rendered DOM element.
         *
         * If this field is a control field or a container field, this DOM element will wrap the inner "control"
         * and "container" elements respectively.  In some cases, the wrapping might not exist in which case this
         * field may be the "control" or "container" field itself.
         *
         * @returns {Object} The rendered DOM element.
         */
        getFieldEl: function() {
            return this.field;
        },

        /**
         * Returns the id of the field.
         *
         * @returns Field id.
         */
        getId: function() {
            return this.id;
        },

        /**
         * Returns this field's parent.
         *
         * @returns {Alpaca.Field} Field parent.
         */
        getParent: function() {
            return this.parent;
        },

        /**
         * Retrieves the path to this element in the graph of JSON data.
         *
         * @returns {string} the path to this element
         */
        getPath: function() {
            return this.path;
        },

        /**
         * Retrieves the name of this element at the current level of JSON data.
         *
         * @returns {*}
         */
        getName: function() {
            return this.name;
        },

        /**
         * Finds if this field is top level.
         *
         * @returns {Boolean} True if this field is the top level one, false otherwise.
         */
        isTopLevel: function() {
            return Alpaca.isEmpty(this.parent);
        },

        /**
         * Walks up the parent chain and returns the top most control.  If no parents, then current control is top control.
         *
         * @returns {Control} top most control
         */
        top: function()
        {
            var top = this;

            while (top.parent) {
                top = top.parent;
            }

            return top;
        },

        /**
         * Returns the value of this field.
         *
         * @returns {Any} value Field value.
         */
        getValue: function()
        {
            var self = this;

            return self.ensureProperType(this.data);
        },

        /**
         * Sets the value of the field.
         *
         * @param {Any} value Value to be set.
         */
        setValue: function(value) {
            this.data = value;

            this.updateObservable();

            this.triggerUpdate();

            // special case - if we're in a display mode and not first render, then do a refresh here
            if (this.isDisplayOnly() && !this.initializing)
            {
                if (this.top && this.top() && this.top().initializing)
                {
                    // if we're rendering under a top most control that isn't finished initializing, then don't refresh
                }
                else
                {
                    this.refresh();
                }
            }
        },

        /**
         * Resets value to default.
         */
        setDefault: function() {
        },

        /**
         * Returns the field template descriptor.
         *
         * @returns {Object} template descriptor
         */
        getTemplateDescriptor: function() {
            return this.templateDescriptor;
        },

        /**
         * Sets the field template descriptor.
         *
         * @param {Object} template descriptor
         */
        setTemplateDescriptor: function(templateDescriptor) {
            this.templateDescriptor = templateDescriptor;
        },

        /**
         * Sets the validation state messages to show for a given field.
         *
         * @param {Object|Array} messages either a message object {id, message} or an array of message objects
         * @param {Boolean} beforeStatus Previous validation status.
         */
        displayMessage: function(messages, beforeStatus) {

            var self = this;

            // if object, convert to array
            if (messages && Alpaca.isObject(messages))
            {
                messages = [messages];
            }

            // if string, convert
            if (messages && Alpaca.isString(messages))
            {
                messages = [{
                    "id": "custom",
                    "message": messages
                }];
            }

            // remove any alpaca messages for this field
            $(this.getFieldEl()).children(".alpaca-message").remove();

            // maxMessage
            if (messages && messages.length > 0) {
                if(this.options.maxMessages && Alpaca.isNumber(this.options.maxMessages) && this.options.maxMessages > -1) {
                    messages = messages.slice(0,this.options.maxMessages);
                }
            }

            // CALLBACK: "removeMessages"
            self.fireCallback("removeMessages");

            // add message and generate it
            if (messages && messages.length > 0)
            {
                $.each(messages, function(index, messageObject) {

                    var hidden = false;
                    if (self.hideInitValidationError)
                    {
                        hidden = true;
                    }

                    // add message to the field
                    var messageTemplateDescriptor = self.view.getTemplateDescriptor("message");
                    if (messageTemplateDescriptor)
                    {
                        var messageElement = Alpaca.tmpl(messageTemplateDescriptor, {
                            "id": messageObject.id,
                            "message": messageObject.message,
                            "view": self.view
                        });
                        messageElement.addClass("alpaca-message");
                        if (hidden)
                        {
                            messageElement.addClass("alpaca-message-hidden");
                        }
                        $(self.getFieldEl()).append(messageElement);
                    }

                    // CALLBACK: "addMessage"
                    self.fireCallback("addMessage", index, messageObject.id, messageObject.message, hidden);
                });
            }
        },

        /**
         * Forces the validation for a field to be refreshed or redrawn to the screen.
         *
         * If told to check children, then all children of the container field will be refreshed as well.
         *
         * @param {Boolean} validateChildren whether to refresh validation for children
         * @param [Function] optional callback when validation completes
         */
        refreshValidationState: function(validateChildren, cb)
        {
            // console.log("Call refreshValidationState: " + this.path);

            var self = this;

            // run validation context compilation for ourselves and optionally any children
            var contexts = [];
            var functions = [];

            // constructs an async function to validate context for a given field
            var functionBuilder = function(field, contexts)
            {
                return function(callback)
                {
                    // run on the next tick
                    Alpaca.nextTick(function() {
                        Alpaca.compileValidationContext(field, function(context) {
                            contexts.push(context);
                            callback();
                        });
                    });
                };
            };

            // wrap up everything we need to do into async callback methods
            if (validateChildren)
            {
                // depth first crawl across all children
                var crawl = function(field, contexts)
                {
                    if (field.isValidationParticipant())
                    {
                        // if the field has children, go depth first
                        if (field.children && field.children.length > 0)
                        {
                            for (var i = 0; i < field.children.length; i++)
                            {
                                crawl(field.children[i], contexts);
                            }
                        }

                        functions.push(functionBuilder(field, contexts));
                    }
                };
                crawl(this, contexts);
            }

            // add ourselves in last
            functions.push(functionBuilder(this, contexts));

            // now run all of the functions in parallel
            Alpaca.parallel(functions, function(err) {

                // contexts now contains all of the validation results

                // merge all contexts into a single validation context for this field
                var mergedMap = {};
                var mergedContext = [];
                for (var i = 0; i < contexts.length; i++)
                {
                    var context = contexts[i];

                    // NOTE: context is already in order [child, parent, ...]

                    var mIndex = mergedContext.length;

                    // walk forward
                    for (var j = 0; j < context.length; j++)
                    {
                        var entry = context[j];

                        var existing = mergedMap[entry.id];
                        if (!existing)
                        {
                            // just add to end
                            var newEntry = {};
                            newEntry.id = entry.id;
                            newEntry.path = entry.path;
                            newEntry.domEl = entry.domEl;
                            newEntry.field = entry.field;
                            newEntry.validated = entry.validated;
                            newEntry.invalidated = entry.invalidated;
                            newEntry.valid = entry.valid;
                            mergedContext.splice(mIndex, 0, newEntry);

                            // mark in map
                            mergedMap[newEntry.id] = newEntry;
                        }
                        else
                        {
                            if (entry.validated && !existing.invalidated)
                            {
                                existing.validated = true;
                                existing.invalidated = false;
                                existing.valid = entry.valid;
                            }

                            if (entry.invalidated)
                            {
                                existing.invalidated = true;
                                existing.validated = false;
                                existing.valid = entry.valid;
                            }
                        }
                    }
                }

                // now reverse it so that context is normalized with child fields first
                mergedContext.reverse();

                // update validation state
                if (!self.hideInitValidationError)
                {
                    Alpaca.updateValidationStateForContext(self.view, mergedContext);
                }

                if (cb)
                {
                    cb();
                }
            });
        },

        /**
         * View and locale friendly retrieval of messages.
         *
         * @param key
         */
        getMessage: function(key)
        {
            return this.view.getMessage(key, this.view.locale);
        },

        /**
         * Validates this field and returns whether it is in a valid state.
         *
         * @param [Boolean] validateChildren whether to child controls.
         *
         * @returns {Boolean} True if value of this field is valid, false otherwise.
         */
        validate: function(validateChildren)
        {
            // skip out if we haven't yet bound any data into this control
            // the control can still be considered to be initializing
            var status = true;

            if (!this.initializing && this.options.validate)
            {
                // if validateChildren, then walk recursively down into child elements
                if (this.children && validateChildren)
                {
                    for (var i = 0; i < this.children.length; i++)
                    {
                        var child = this.children[i];
                        if (child.isValidationParticipant())
                        {
                            child.validate(validateChildren);
                        }
                    }
                }

                // evaluate ourselves
                status = this.handleValidate();

                // support for some debugging
                if (!status && Alpaca.logLevel == Alpaca.DEBUG) // jshint ignore:line
                {
                    // messages
                    var messages = [];
                    for (var messageId in this.validation)
                    {
                        if (!this.validation[messageId]["status"])
                        {
                            messages.push(this.validation[messageId]["message"]);
                        }
                    }

                    Alpaca.logDebug("Validation failure for field (id=" + this.getId() + ", path=" + this.path + "), messages: " + JSON.stringify(messages));
                }
            }

            this._previouslyValidated = true;

            return status;
        },

        /**
         * Performs validation.
         */
        handleValidate: function() {
            var valInfo = this.validation;

            var status = this._validateOptional();
            valInfo["notOptional"] = {
                "message": status ? "" : this.getMessage("notOptional"),
                "status": status
            };

            status = this._validateDisallow();
            valInfo["disallowValue"] = {
                "message": status ? "" : Alpaca.substituteTokens(this.getMessage("disallowValue"), [this.schema["disallow"].join(', ')]),
                "status": status
            };

            return valInfo["notOptional"]["status"] && valInfo["disallowValue"]["status"];
        },

        /**
         * Validates using user provided validator.
         */
        _validateCustomValidator: function(callback) {

            var _this = this;

            if (this.options.validator && Alpaca.isFunction(this.options.validator))
            {
                this.options.validator.call(this, function(valInfo) {

                    // always store in "custom"
                    _this.validation["custom"] = valInfo;

                    callback();
                });
            }
            else
            {
                callback();
            }
        },

        /**
         * Validates against required property.
         *
         * @returns {Boolean} False if this field value is empty but required, true otherwise.
         */
        _validateOptional: function() {

            if (this.isRequired() && this.isEmpty()) {
                return false;
            }

            if (this.options.disallowOnlyEmptySpaces && Alpaca.testRegex(Alpaca.regexps.whitespace, this.getValue())) {
                return false;
            }

            return true;
        },


        /**
         * Checks whether the field value is allowed or not.
         *
         * @returns {Boolean} True if the field value is allowed, false otherwise.
         */
        _validateDisallow: function() {
            if (!Alpaca.isValEmpty(this.schema.disallow)) {
                var val = this.getValue();
                var disallow = this.schema.disallow;
                if (Alpaca.isArray(disallow)) {
                    var isAllowed = true;
                    $.each(disallow, function(index, value) {
                        if ((Alpaca.isObject(val) || (Alpaca.isArray(val)) && Alpaca.isString(value))) {
                            value = Alpaca.parseJSON(value);
                        }
                        if (Alpaca.compareObject(val, value)) {
                            isAllowed = false;
                        }
                    });
                    return isAllowed;
                } else {
                    if ((Alpaca.isObject(val) || (Alpaca.isArray(val)) && Alpaca.isString(disallow))) {
                        disallow = Alpaca.parseJSON(disallow);
                    }
                    return !Alpaca.compareObject(val, disallow);
                }
            }

            return true;
        },

        /**
         * Triggers any event handlers that listens to the update event of this field.
         */
        triggerUpdate: function() {
            $(this.field).trigger("fieldupdate");
        },

        /**
         * @EXTENSION_POINT
         *
         * Disables the field.
         */
        disable: function() {
            // OVERRIDE
        },

        /**
         * Enables the field.
         */
        enable: function() {
            // OVERRIDE
        },

        /**
         * @returns {boolean} whether the field is disabled
         */
        isDisabled: function()
        {
            // OVERRIDE
            return false;
        },

        /**
         * @returns {boolean} whether the field is enabled
         */
        isEnabled: function()
        {
            return !this.isDisabled();
        },

        /**
         * Focuses on the field.
         *
         * If a callback is provided, the callback receives the control focused upon.
         */
        focus: function(onFocusCallback) {
            // OVERRIDE

            if (onFocusCallback)
            {
                onFocusCallback(this);
            }

        },

        /**
         * Purges any event listeners and remove this field from the DOM.
         */
        destroy: function() {

            // remove observable
            Alpaca.observable(this.path).clear();

            // clean up Alpaca.fieldInstances static reference (used for convenience access to previous rendered fields)
            if (Alpaca && Alpaca.fieldInstances) {
                if (Alpaca.fieldInstances[this.getId()]) {
                    delete Alpaca.fieldInstances[this.getId()];
                }
            }

            // clean up DOM
            $(this.field).remove();
        },

        /**
         * Shows the field.
         */
        show: function()
        {
            if (this.options && this.options.hidden)
            {
                // if the hidden option is on, we're always hidden
                return;
            }
            else
            {
                // show the field
                $(this.field).css({
                    "display": ""
                });

                this.onShow();

                // CALLBACK: "show"
                this.fireCallback("show");
            }
        },

        onShow: function()
        {

        },

        /**
         * Hides the field.
         */
        hide: function()
        {
            $(this.field).css({
                "display": "none"
            });

            this.onHide();

            // CALLBACK: "hide"
            this.fireCallback("hide");
        },

        onHide: function()
        {

        },

        isValidationParticipant: function()
        {
            return this.isShown();
        },

        isShown: function() {
            return !this.isHidden();
        },

        isVisible: function() {
            return !this.isHidden();
        },

        isHidden: function() {
            return ("none" === $(this.field).css("display"));
        },

        /**
         * Prints the field.
         */
        print: function()
        {
            if (this.getFieldEl().printArea)
            {
                this.getFieldEl().printArea();
            }
        },

        /**
         * Triggered when the field is being revealed as the result of a dependency or conditional calculation
         * that has determined that the field should be shown.
         */
        onDependentReveal: function()
        {

        },

        /**
         * Triggered when the field is being concealed as the result of a dependency or conditional calculation
         * that has determined that the field should be hidden.
         */
        onDependentConceal: function()
        {

        },

        /**
         * Reloads the field.
         */
        reload: function()
        {
            this.initializing = true;

            if (!Alpaca.isEmpty(this.callback))
            {
                this.callback(this, this.renderedCallback);
            }
            else
            {
                this.render(this.renderedCallback);
            }
        },

        /**
         * Clears the field and resets the field to its original value.
         */
        clear: function()
        {
            var newValue = null;

            if (this.data)
            {
                newValue = this.data;
            }

            this.setValue(newValue);
        },

        /**
         * Finds if the value of this field is empty.
         *
         * @return {Boolean} True if the field value is empty, false otherwise.
         */
        isEmpty: function()
        {
            return Alpaca.isValEmpty(this.getValue());
        },

        /**
         * Finds if this field is valid.
         *
         * @return {Boolean} True if the field is valid, false otherwise.
         */
        isValid: function(checkChildren)
        {
            if (checkChildren && this.children)
            {
                for (var i = 0; i < this.children.length; i++) {
                    var child = this.children[i];
                    if (child.isValidationParticipant())
                    {
                        if (!child.isValid(checkChildren)) {
                            return false;
                        }
                    }
                }
            }

            if ($.isEmptyObject(this.validation)) {
                return true;
            } else {
                for (var key in this.validation) {
                    if (!this.validation[key].status) {
                        return false;
                    }
                }
                return true;
            }
        },

        /**
         * Initializes event handling.
         */
        initEvents: function()
        {
            var _this = this;

            if (this.field)
            {
                this.field.mouseover(function(e) {
                    _this.onMouseOver.call(_this, e);
                    _this.trigger("mouseover", e);
                });

                this.field.mouseout(function(e) {
                    _this.onMouseOut.call(_this, e);
                    _this.trigger("mouseout", e);
                });

                // legacy support - specify events via options.onField<FieldName> = fn
                $.each(this.options, function(key, func) {

                    if (Alpaca.startsWith(key,'onField') && Alpaca.isFunction(func))
                    {
                        var event = key.substring(7).toLowerCase();
                        _this.field.on(event, function(e) {
                            func.call(_this,e);
                        });
                    }
                });

                // future support - specify events via options.events.<eventName> = fn
                if (this.options && this.options.events)
                {
                    $.each(this.options.events, function(event, func) {

                        if (Alpaca.isFunction(func))
                        {
                            if (event === "render" || event === "ready" || event === "blur" || event === "focus")
                            {
                                _this.on(event, function(e, a, b, c) {
                                    func.call(_this, e, a, b, c);
                                })
                            }
                            else
                            {
                                // legacy support
                                _this.field.on(event, function(e) {
                                    func.call(_this,e);
                                });
                            }
                        }
                    });
                }
            }
        },

        /**
         * Callback for when the field receives focus.
         *
         * Default behavior is for the entire field to highlight.
         *
         * @param e dom event
         */
        onFocus: function(e) {
            $(this.field).removeClass("alpaca-field-empty");
            $(this.field).addClass("alpaca-field-focused");
        },

        /**
         * Callback for when the field loses focus (blurs).
         *
         * Default behavior is for the entire field to un-highlight.
         *
         * @param e dom event
         */
        onBlur: function(e) {

            var wasFocused = $(this.field).hasClass("alpaca-field-focused");

            $(this.field).removeClass("alpaca-field-focused");

            // update the UI validation state
            if (wasFocused)
            {
                this.refreshValidationState();
            }

            // trigger "fieldblur"
            $(this.field).trigger("fieldblur");
        },

        /**
         * Callback for when the field's value changes.
         *
         * Default behavior is to update the control's value and notify.
         *
         * @param e Event.
         */
        onChange: function(e) {
            // store back into data element
            //this.data = this.getValue();
            this.updateObservable();
            this.triggerUpdate();
        },

        /**
         * Callbeack for when the mouse moves over a field.
         *
         * @param e
         */
        onMouseOver: function(e) {

        },

        /**
         * Callback for when the mouse moves out of the field.
         *
         * @param e
         */
        onMouseOut: function(e) {

        },

        /**
         * Finds a field control by its path.
         *
         * @param {String} path Field control path.
         * @returns {Alpaca.Field} Field control mapped to the path.
         */
        getControlByPath: function(path) {

            var result = null;

            if (path)
            {
                // strip off the leading "/" if it is there
                if (path.indexOf("/") === 0) {
                    path = path.substring(1);
                }

                // strip off the trailing "/" if it is there
                if (Alpaca.endsWith(path, "/")) {
                    path = path.substring(0, path.length - 1);
                }

                var current = this;

                var pathArray = path.split('/');
                for (var i = 0; i < pathArray.length; i++)
                {
                    var pathElement = pathArray[i];

                    var _name = pathElement;
                    var _index = -1;

                    var z1 = pathElement.indexOf("[");
                    if (z1 >= 0)
                    {
                        var z2 = pathElement.indexOf("]", z1 + 1);
                        if (z2 >= 0)
                        {
                            _index = parseInt(pathElement.substring(z1 + 1, z2));
                            _name = pathElement.substring(0, z1);
                        }
                    }

                    if (_name)
                    {
                        current = current.childrenByPropertyId[_name];

                        if (_index > -1)
                        {
                            current = current.children[_index];
                        }
                    }
                }

                result = current;
            }

            return result;
        },

        /**
         * Retrieves an array of Alpaca controls by their Alpaca field type (i.e. "text", "checkbox", "ckeditor")
         * This does a deep traversal across the graph of Alpaca field instances.
         *
         * @param fieldType
         * @returns {Array}
         */
        getControlsByFieldType: function(fieldType) {

            var array = [];

            if (fieldType)
            {
                var f = function(parent, fieldType, array)
                {
                    for (var i = 0; i < parent.children.length; i++)
                    {
                        if (parent.children[i].getFieldType() === fieldType)
                        {
                            array.push(parent.children[i]);
                        }

                        if (parent.children[i].isContainer())
                        {
                            f(parent.children[i], fieldType, array);
                        }
                    }
                };
                f(this, fieldType, array);
            }

            return array;
        },

        /**
         * Retrieves an array of Alpaca controls by their schema type (i.e. "string", "number").
         * This does a deep traversal across the graph of Alpaca field instances.
         *
         * @param schemaType
         * @returns {Array}
         */
        getControlsBySchemaType: function(schemaType) {

            var array = [];

            if (schemaType)
            {
                var f = function(parent, schemaType, array)
                {
                    for (var i = 0; i < parent.children.length; i++)
                    {
                        if (parent.children[i].getType() === schemaType)
                        {
                            array.push(parent.children[i]);
                        }

                        if (parent.children[i].isContainer())
                        {
                            f(parent.children[i], schemaType, array);
                        }
                    }
                };
                f(this, schemaType, array);
            }

            return array;
        },

        /////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // OBSERVABLES
        //
        /////////////////////////////////////////////////////////////////////////////////////////////////

        subscribe: function()
        {
            var args = Alpaca.makeArray(arguments);
            args.unshift(this.getObservableScope());

            return Alpaca.subscribe.apply(this, args);
        },

        unsubscribe: function()
        {
            var args = Alpaca.makeArray(arguments);
            args.unshift(this.getObservableScope());

            return Alpaca.unsubscribe.apply(this, args);
        },

        observable: function()
        {
            var args = Alpaca.makeArray(arguments);
            args.unshift(this.getObservableScope());

            return Alpaca.observable.apply(this, args);
        },

        clearObservable: function()
        {
            var args = Alpaca.makeArray(arguments);
            args.unshift(this.getObservableScope());

            return Alpaca.clearObservable.apply(this, args);
        },

        dependentObservable: function()
        {
            var args = Alpaca.makeArray(arguments);
            args.unshift(this.getObservableScope());

            return Alpaca.dependentObservable.apply(this, args);
        },


        // Utility Functions for Form Builder

        /**
         * Returns schema data type.
         *
         * @returns {String} Schema data type.
         */
        getType: function() {

        },

        /**
         * Returns a string that identifies the type of field.
         *
         * @required
         * @extension-point
         *
         * Identifies the type of control field.
         *
         * @returns {string}
         */
        getFieldType: function()
        {
            return "";
        },

        /**
         * @returns {String} the type of the base class (or null if none)
         */
        getBaseFieldType: function()
        {
            var baseFieldType = null;

            var x = this.constructor.ancestor.prototype;
            if (x && x.getFieldType)
            {
                baseFieldType = x.getFieldType();
            }

            return baseFieldType;
        },

        /**
         * Finds if this field is a container of other fields.
         *
         * @returns {Boolean} True if it is a container, false otherwise.
         */
        isContainer: function() {
            return false;
        },

        /**
         * Determines whether the current field is required.
         *
         * A field can be specified as required by either specifying required: true on the schema for a field or by
         * specifying a required array on the parent object with the name of the child field (as per json schema v 04).
         *
         * @returns {boolean}
         */
        isRequired: function()
        {
            // assume not required
            var required = false;

            if (typeof(this.schema.required) === "boolean")
            {
                required = this.schema.required;
            }

            // support for json-schema draft 04
            if (this.parent && this.parent.schema.required)
            {
                if (Alpaca.isArray(this.parent.schema.required))
                {
                    var requiredArray = this.parent.schema.required;
                    if (requiredArray)
                    {
                        for (var i = 0; i < requiredArray.length; i++)
                        {
                            if (requiredArray[i] === this.propertyId)
                            {
                                required = true;
                                break;
                            }
                        }
                    }
                }
            }

            return required;
        }

        /* builder_helpers */
        ,

        /**
         * Returns field title.
         *
         * @returns {String} Field title.
         */
        getTitle: function() {

        },

        /**
         * Returns field description.
         *
         * @returns {String} Field description.
         */
        getDescription: function() {

        },

        /**
         * Returns JSON schema of the schema properties that are managed by this class.
         *
         * @private
         * @returns {Object} JSON schema of the schema properties that are managed by this class.
         */
        getSchemaOfSchema: function() {
            var schemaOfSchema = {
                "title": this.getTitle(),
                "description": this.getDescription(),
                "type": "object",
                "properties": {
                    "title": {
                        "title": "Title",
                        "description": "Short description of the property.",
                        "type": "string"
                    },
                    "description": {
                        "title": "Description",
                        "description": "Detailed description of the property.",
                        "type": "string"
                    },
                    "readonly": {
                        "title": "Readonly",
                        "description": "Indicates that the field is read-only.  A read-only field cannot have it's value changed.  Read-only fields render in a grayed-out or disabled control.  If the field is rendered using a view with the <code>displayReadonly</code> attribute set to false, the read-only field will not appear.",
                        "type": "boolean",
                        "default": false
                    },
                    "required": {
                        "title": "Required",
                        "description": "Indicates whether the field's value is required.  If set to true, the field must take on a valid value and cannnot be left empty or unassigned.",
                        "type": "boolean",
                        "default": false
                    },
                    "default": {
                        "title": "Default",
                        "description": "The default value to be assigned for this property.  If the data for the field is empty or not provided, this default value will be plugged in for you.  Specify a default value when you want to pre-populate the field's value ahead of time.",
                        "type": "any"
                    },
                    "type": {
                        "title": "Type",
                        "description": "Data type of the property.",
                        "type": "string",
                        "readonly": true
                    },
                    "format": {
                        "title": "Format",
                        "description": "Data format of the property.",
                        "type": "string"
                    },
                    "disallow": {
                        "title": "Disallowed Values",
                        "description": "List of disallowed values for the property.",
                        "type": "array"
                    },
                    "dependencies": {
                        "title": "Dependencies",
                        "description": "List of property dependencies.",
                        "type": "array"
                    }
                }
            };
            if (this.getType && !Alpaca.isValEmpty(this.getType())) {
                schemaOfSchema.properties.type['default'] = this.getType();
                schemaOfSchema.properties.type['enum'] = [this.getType()];
            }
            return schemaOfSchema;
        },

        /**
         * Returns Alpaca options for the schema properties that managed by this class.
         *
         * @private
         * @returns {Object} Alpaca options for the schema properties that are managed by this class.
         */
        getOptionsForSchema: function() {
            return {
                "fields": {
                    "title": {
                        "helper": "Field short description",
                        "type": "text"
                    },
                    "description": {
                        "helper": "Field detailed description",
                        "type": "textarea"
                    },
                    "readonly": {
                        "helper": "Field will be read only if checked",
                        "rightLabel": "This field is read-only",
                        "type": "checkbox"
                    },
                    "required": {
                        "helper": "Field value must be set if checked",
                        "rightLabel": "This field is required",
                        "type": "checkbox"
                    },
                    "default": {
                        "helper": "Field default value",
                        "type": "textarea"
                    },
                    "type": {
                        "helper": "Field data type",
                        "type": "text"
                    },
                    "format": {
                        "type": "select",
                        "dataSource": function(callback) {
                            for (var key in Alpaca.defaultFormatFieldMapping)
                            {
                                this.selectOptions.push({
                                    "value": key,
                                    "text": key
                                });
                            }

                            callback();
                        }
                    },
                    "disallow": {
                        "helper": "Disallowed values for the field",
                        "itemLabel":"Value",
                        "type": "array"
                    },
                    "dependencies": {
                        "helper": "Field Dependencies",
                        "multiple":true,
                        "size":3,
                        "type": "select",
                        "dataSource": function (field, callback) {
                            if (field.parent && field.parent.schemaParent && field.parent.schemaParent.parent) {
                                for (var key in field.parent.schemaParent.parent.childrenByPropertyId) {
                                    if (key != field.parent.schemaParent.propertyId) { // jshint ignore:line
                                        field.selectOptions.push({
                                            "value": key,
                                            "text": key
                                        });
                                    }
                                }
                            }
                            if (callback) {
                                callback();
                            }
                        }
                    }
                }
            };
        },

        /**
         * Returns JSON schema of the Alpaca options that are managed by this class.
         *
         * @private
         * @returns {Object} JSON schema of the Alpaca options that are managed by this class.
         */
        getSchemaOfOptions: function() {
            var schemaOfOptions = {
                "title": "Options for " + this.getTitle(),
                "description": this.getDescription() + " (Options)",
                "type": "object",
                "properties": {
                    "form":{},
                    "id": {
                        "title": "Field Id",
                        "description": "Unique field id. Auto-generated if not provided.",
                        "type": "string"
                    },
                    "type": {
                        "title": "Field Type",
                        "description": "Field type.",
                        "type": "string",
                        "default": this.getFieldType(),
                        "readonly": true
                    },
                    "validate": {
                        "title": "Validation",
                        "description": "Field validation is required if true.",
                        "type": "boolean",
                        "default": true
                    },
                    "showMessages": {
                        "title": "Show Messages",
                        "description": "Display validation messages if true.",
                        "type": "boolean",
                        "default": true
                    },
                    "disabled": {
                        "title": "Disabled",
                        "description": "Field will be disabled if true.",
                        "type": "boolean",
                        "default": false
                    },
                    "readonly": {
                        "title": "Readonly",
                        "description": "Field will be readonly if true.",
                        "type": "boolean",
                        "default": false
                    },
                    "hidden": {
                        "title": "Hidden",
                        "description": "Field will be hidden if true.",
                        "type": "boolean",
                        "default": false
                    },
                    "label": {
                        "title": "Label",
                        "description": "Field label.",
                        "type": "string"
                    },
                    "helper": {
                        "title": "Helper",
                        "description": "Field help message.",
                        "type": "string"
                    },
                    "helpers": {
                        "title": "Helpers",
                        "description": "An array of field help messages.  Each message will be displayed on it's own line.",
                        "type": "array",
                        "items": {
                            "type": "string"
                        }
                    },
                    "helpersPosition": {
                        "title": "Helpers Position",
                        "description": "Defines the placement location of the helper text relative to the control (either 'above' or 'below')",
                        "type": "string",
                        "enum": ["above", "below"],
                        "default": "below"
                    },
                    "fieldClass": {
                        "title": "CSS class",
                        "description": "Specifies one or more CSS classes that should be applied to the dom element for this field once it is rendered.  Supports a single value, comma-delimited values, space-delimited values or values passed in as an array.",
                        "type": "string"
                    },
                    "hideInitValidationError" : {
                        "title": "Hide Initial Validation Errors",
                        "description" : "Hide initial validation errors if true.",
                        "type": "boolean",
                        "default": false
                    },
                    "focus": {
                        "title": "Focus",
                        "description": "If true, the initial focus for the form will be set to the first child element (usually the first field in the form).  If a field name or path is provided, then the specified child field will receive focus.  For example, you might set focus to 'name' (selecting the 'name' field) or you might set it to 'client/name' which picks the 'name' field on the 'client' object.",
                        "type": "checkbox",
                        "default": true
                    },
                    "optionLabels": {
                        "title": "Enumerated Value Labels",
                        "description": "An array of string labels for items in the enum array",
                        "type": "array"
                    },
                    "view": {
                        "title": "Override of the view for this field",
                        "description": "Allows for this field to be rendered with a different view (such as 'display' or 'create')",
                        "type": "string"
                    }
                }
            };
            if (this.isTopLevel()) {

                schemaOfOptions.properties.form = {
                    "title": "Form",
                    "description": "Options for rendering the FORM tag.",
                    "type": "object",
                    "properties": {
                        "attributes": {
                            "title": "Form Attributes",
                            "description": "List of attributes for the FORM tag.",
                            "type": "object",
                            "properties": {
                                "id": {
                                    "title": "Id",
                                    "description": "Unique form id. Auto-generated if not provided.",
                                    "type": "string"
                                },
                                "action": {
                                    "title": "Action",
                                    "description": "Form submission endpoint",
                                    "type": "string"
                                },
                                "method": {
                                    "title": "Method",
                                    "description": "Form submission method",
                                    "enum":["post","get"],
                                    "type": "string"
                                },
                                "rubyrails": {
                                    "title": "Ruby On Rails",
                                    "description": "Ruby on Rails Name Standard",
                                    "enum": ["true", "false"],
                                    "type": "string"
                                },
                                "name": {
                                    "title": "Name",
                                    "description": "Form name",
                                    "type": "string"
                                },
                                "focus": {
                                    "title": "Focus",
                                    "description": "Focus Setting",
                                    "type": "any"
                                }
                            }
                        },
                        "buttons": {
                            "title": "Form Buttons",
                            "description": "Configuration for form-bound buttons",
                            "type": "object",
                            "properties": {
                                "submit": {
                                    "type": "object",
                                    "title": "Submit Button",
                                    "required": false
                                },
                                "reset": {
                                    "type": "object",
                                    "title": "Reset button",
                                    "required": false
                                }
                            }
                        },
                        "toggleSubmitValidState": {
                            "title": "Toggle Submit Valid State",
                            "description": "Toggle the validity state of the Submit button",
                            "type": "boolean",
                            "default": true
                        }
                    }
                };

            } else {
                delete schemaOfOptions.properties.form;
            }

            return schemaOfOptions;
        },

        /**
         * Returns Alpaca options for the Alpaca options that are managed by this class.
         *
         * @private
         * @returns {Object} Alpaca options for the Alpaca options that are managed by this class.
         */
        getOptionsForOptions: function() {
            var optionsForOptions = {
                "type": "object",
                "fields": {
                    "id": {
                        "type": "text",
                        "readonly": true
                    },
                    "type": {
                        "type": "text"
                    },
                    "validate": {
                        "rightLabel": "Enforce validation",
                        "type": "checkbox"
                    },
                    "showMessages": {
                        "rightLabel":"Show validation messages",
                        "type": "checkbox"
                    },
                    "disabled": {
                        "rightLabel":"Disable this field",
                        "type": "checkbox"
                    },
                    "hidden": {
                        "type": "checkbox",
                        "rightLabel": "Hide this field"
                    },
                    "label": {
                        "type": "text"
                    },
                    "helper": {
                        "type": "textarea"
                    },
                    "helpers": {
                        "type": "array",
                        "items": {
                            "type": "textarea"
                        }
                    },
                    "helpersPosition": {
                        "type": "text",
                        "optionLabels": ["Above", "Below"]
                    },
                    "fieldClass": {
                        "type": "text"
                    },
                    "hideInitValidationError": {
                        "rightLabel": "Hide initial validation errors",
                        "type": "checkbox"
                    },
                    "focus": {
                        "type": "checkbox",
                        "rightLabel": "Auto-focus first child field"
                    },
                    "optionLabels": {
                        "type": "array",
                        "items": {
                            "type": "text"
                        }
                    },
                    "view": {
                        "type": "text"
                    }
                }
            };
            if (this.isTopLevel()) {
                optionsForOptions.fields.form = {
                    "type": "object",
                    "fields": {
                        "attributes": {
                            "type": "object",
                            "fields": {
                                "id": {
                                    "type": "text",
                                    "readonly": true
                                },
                                "action": {
                                    "type": "text"
                                },
                                "method": {
                                    "type": "select"
                                },
                                "name": {
                                    "type": "text"
                                }
                            }
                        }
                    }
                };
            }

            return optionsForOptions;
        }
        /* end_builder_helpers */
    });

    // Registers additional messages
    Alpaca.registerMessages({
        "disallowValue": "{0} are disallowed values.",
        "notOptional": "This field is not optional."
    });

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.ControlField = Alpaca.Field.extend(
        /**
         * @lends Alpaca.ControlField.prototype
         */
        {
            /**
             * Called during construction to signal that this field is a control field.
             */
            onConstruct: function()
            {
                var _this = this;

                this.isControlField = true;

                // helper method for getting val() from the control
                // handles conversion to the correct scalar type
                this._getControlVal = function(ensureProperType) {
                    var val = null;

                    if (this.control)
                    {
                        val = $(this.control).val();

                        if (ensureProperType)
                        {
                            val = _this.ensureProperType(val);
                        }
                    }

                    return val;
                };
            },

            /**
             * @see Alpaca.Field#setup
             */
            setup: function()
            {
                var self = this;

                this.base();

                var controlTemplateType = self.resolveControlTemplateType();
                if (!controlTemplateType)
                {
                    return Alpaca.throwErrorWithCallback("Unable to find template descriptor for control: " + self.getFieldType());
                }

                this.controlDescriptor = this.view.getTemplateDescriptor("control-" + controlTemplateType, self);

                // buttons
                if (typeof(this.options.renderButtons) === "undefined")
                {
                    this.options.renderButtons = true;
                }
                if (this.options.buttons)
                {
                    for (var k in this.options.buttons)
                    {
                        if (this.options.buttons[k].label)
                        {
                            this.options.buttons[k].value = this.options.buttons[k].label;
                        }
                        if (this.options.buttons[k].title)
                        {
                            this.options.buttons[k].value = this.options.buttons[k].title;
                        }
                        if (!this.options.buttons[k].type)
                        {
                            this.options.buttons[k].type = "button";
                        }
                        if (!this.options.buttons[k].styles)
                        {
                            this.options.buttons[k].styles = this.view.styles.button;
                        }
                    }
                }
            },

            getControlEl: function()
            {
                return this.control;
            },

            resolveControlTemplateType: function()
            {
                var self = this;

                // we assume the field type and then check the view to see if there is a template for this view
                // if not, we walk the parent chain until we find a template type

                var finished = false;
                var selectedType = null;

                var b = this;
                do
                {
                    if (!b.getFieldType)
                    {
                        finished = true;
                    }
                    else
                    {
                        var d = this.view.getTemplateDescriptor("control-" + b.getFieldType(), self);
                        if (d)
                        {
                            selectedType = b.getFieldType();
                            finished = true;
                        }
                        else
                        {
                            b = b.constructor.ancestor.prototype;
                        }
                    }
                }
                while (!finished);

                return selectedType;
            },

            onSetup: function()
            {

            },

            isAutoFocusable: function()
            {
                return true;
            },

            /**
             * For control fields, we use the "control" template as the primary.
             *
             * @see Alpaca.Field#getTemplateDescriptorId
             * @returns {string}
             */
            getTemplateDescriptorId : function ()
            {
                return "control";
            },

            /**
             * Add a "control" dom element inside of the field which houses our custom control.
             *
             * @see Alpaca.Field#renderField
             */
            renderFieldElements: function(callback) {

                var self = this;

                // find our insertion point
                // this is marked by the handlebars helper
                this.control = $(this.field).find("." + Alpaca.MARKER_CLASS_CONTROL_FIELD);
                this.control.removeClass(Alpaca.MARKER_CLASS_CONTROL_FIELD);

                // render
                self.prepareControlModel(function(model) {
                    self.beforeRenderControl(model, function() {
                        self.renderControl(model, function(controlField) {

                            if (controlField)
                            {
                                self.control.replaceWith(controlField);
                                self.control = controlField;

                                self.control.addClass(Alpaca.CLASS_CONTROL);
                            }

                            // CALLBACK: "control"
                            self.fireCallback("control");

                            self.afterRenderControl(model, function() {

                                callback();
                            });

                        });
                    });
                });
            },

            /**
             * Prepares the model for use in rendering the control.
             *
             * @param callback function(model)
             */
            prepareControlModel: function(callback)
            {
                var self = this;

                var model = {};
                model.id = this.getId();
                model.name = this.name;
                model.options = this.options;
                model.schema = this.schema;
                model.data = this.data;
                model.required = this.isRequired();
                model.view = this.view;

                callback(model);
            },

            /**
             * Called before the control is rendered.
             *
             * @extension-point
             *
             * @param callback
             */
            beforeRenderControl: function(model, callback)
            {
                var self = this;

                callback();
            },

            /**
             * Called after the control is rendered.
             *
             * @extension-point
             *
             * @param model
             * @param callback
             */
            afterRenderControl: function(model, callback)
            {
                var self = this;

                if (!self.firstUpdateObservableFire)
                {
                    if (Alpaca.isEmpty(self.data))
                    {
                        // do not handle
                    }
                    else
                    {
                        self.firstUpdateObservableFire = true;
                        self.updateObservable();
                    }
                }

                // buttons
                $(this.getFieldEl()).find(".alpaca-control-button").each(function() {

                    $(this).click(function(e) {
                        $(this).attr("button-pushed", true);
                    });

                    // custom click handler?
                    var key = $(this).attr("data-key");
                    if (key)
                    {
                        var buttonConfig = self.options.buttons[key];
                        if (buttonConfig)
                        {
                            if (buttonConfig.click)
                            {
                                $(this).click(function(control, handler) {
                                    return function(e) {
                                        e.preventDefault();
                                        handler.call(control, e);
                                    }
                                }(self, buttonConfig.click));
                            }
                        }
                    }
                });


                callback();
            },

            /**
             * Renders the control into the field container.
             *
             * @extension-point
             *
             * @param model
             * @param callback
             */
            renderControl: function(model, callback)
            {
                var control = null;

                if (this.controlDescriptor)
                {
                    control = Alpaca.tmpl(this.controlDescriptor, model);
                }

                callback(control);
            },

            /**
             * @see Alpaca.Field#postRender
             */
            postRender: function(callback)
            {
                var self = this;

                this.base(function() {

                    callback();

                });
            },

            /**
             * Ensures that the "name" property on the control is kept in sync.
             */
            updateDOMElement: function()
            {
                this.base();

                // update the name field
                this.control.attr("name", this.getName());
            },

            /**
             * @see Alpaca.Field#setDefault
             */
            setDefault: function() {
                var defaultData = Alpaca.isEmpty(this.schema['default']) ? "" : this.schema['default'];
                this.setValue(defaultData);
            },

            /**
             * Returns the value of this field.
             *
             * @returns {Any} value Field value.
             */
            getValue: function()
            {
                var self = this;

                var value = this.base();

                if (!this.isDisplayOnly())
                {
                    value = self.getControlValue();
                }

                // some correction for type
                value = self.ensureProperType(value);

                return value;
            },

            /**
             * Gets the current value from the control value.
             *
             * Extension point
             */
            getControlValue: function()
            {
                return this._getControlVal(true);
            },

            /**
             * Validate against enum property.
             *
             * @returns {Boolean} True if the element value is part of the enum list, false otherwise.
             */
            _validateEnum: function()
            {
                if (!this.getEnum()) {
                    return true;
                }

                var val = this.getValue();

                if (!this.isRequired() && Alpaca.isValEmpty(val)) {
                    return true;
                }

                return Alpaca.inArray(this.getEnum(), val);
            },

            /**
             * @see Alpaca.Field#handleValidate
             */
            handleValidate: function()
            {
                var baseStatus = this.base();

                var valInfo = this.validation;

                var status = this._validateEnum();

                // Use the values presented to the user in the validation
                // error message. If there are optionLabels, use them in
                // preference to the raw enum values.
                var messageValues = this.getEnum();
                // use option labels if those are available
                var optionLabels = this.getOptionLabels();
                if (optionLabels && optionLabels.length > 0) {
                    messageValues = optionLabels;
                }

                valInfo["invalidValueOfEnum"] = {
                    "message": status ? "" : Alpaca.substituteTokens(this.getMessage("invalidValueOfEnum"), [messageValues.join(', '), this.getValue()]),
                    "status": status
                };

                return baseStatus && valInfo["invalidValueOfEnum"]["status"];
            },

            /**
             * @see Alpaca.Field#initEvents
             */
            initEvents: function()
            {
                this.base();

                if (this.control && this.control.length > 0)
                {
                    this.initControlEvents();
                }
            },

            initControlEvents: function()
            {
                var self = this;

                var control = this.control;

                control.click(function(e) {
                    self.onClick.call(self, e);
                    self.trigger("click", e);
                });

                // trigger control level handlers for things that happen to input element
                control.change(function(e) {

                    // we use a timeout here because we want this to run AFTER control click handlers
                    setTimeout(function() {
                        self.onChange.call(self, e);
                        self.triggerWithPropagation("change", e);
                    }, 200);
                });

                control.focus(function(e) {

                    self.wasFocused = true;

                    if (!self.suspendBlurFocus)
                    {
                        var x = self.onFocus.call(self, e);
                        if (x !== false) {
                            x = self.trigger("focus", e);
                        }

                        return x;
                    }
                });

                control.blur(function(e) {

                    self.wasBlurred = true;

                    if (!self.suspendBlurFocus)
                    {
                        var x = self.onBlur.call(self, e);
                        if (x !== false) {
                            x = self.trigger("blur", e);
                        }

                        return x;
                    }
                });

                control.keypress(function(e) {
                    var x = self.onKeyPress.call(self, e);
                    if (x !== false) {
                        x = self.trigger("keypress", e);
                    }

                    return x;
                });

                control.keyup(function(e) {
                    var x = self.onKeyUp.call(self, e);
                    if (x !== false) {
                        x = self.trigger("keyup", e);
                    }

                    // propagate up with "after_nested_change"
                    self.triggerWithPropagation("after_nested_change", e);

                    return x;
                });

                control.keydown(function(e) {
                    var x = self.onKeyDown.call(self, e);
                    if (x !== false) {
                        x = self.trigger("keydown", e);

                        // propagate up with "before_nested_change"
                        self.triggerWithPropagation("before_nested_change", e);
                    }

                    return x;
                });

            },

            /**
             * Callback for when a key press event is received for the field control.
             *
             * @param {Object} e keypress event
             */
            onKeyPress: function(e)
            {
                var self = this;

                var refresh = false;

                // if we're in edit mode
                if (self.view.type && self.view.type === 'edit')
                {
                    // if the field is currently invalid, then we provide early feedback to the user as to when they enter
                    // if the field was valid, we don't render invalidation feedback until they blur the field

                    // was the control valid previously?
                    var wasValid = this.isValid();
                    if (!wasValid)
                    {
                        refresh = true;
                    }
                }
                else if (self.view.type && self.view.type === 'create')
                {
                    var wasValid = this.isValid();
                    if (!wasValid && self.wasBlurred)
                    {
                        refresh = true;
                    }
                }

                if (refresh)
                {
                    // we use a timeout because at this exact moment, the value of the control is still the old value
                    // jQuery raises the keypress event ahead of the input receiving the new data which would incorporate
                    // the key that was pressed
                    //
                    // this timeout provides the browser with enough time to plug the value into the input control
                    // which the validation logic uses to determine whether the control is now in a valid state
                    //
                    window.setTimeout(function () {
                        self.refreshValidationState();
                    }, 50);
                }

            },

            /**
             * Callback for when a key down event is received for the field control.
             *
             * @param {Object} e keydown event
             */
            onKeyDown: function(e)
            {
            },

            /**
             * Callback for when a key up event is received for the field control.
             *
             * @param {Object} e keyup event
             */
            onKeyUp: function(e)
            {
            },

            /**
             * Handler for click event.
             *
             * @param {Object} e Click event.
             */
            onClick: function(e)
            {
            },

            /**
             * @see Alpaca.Field#disable
             */
            disable: function()
            {
                if (this.options.readonly) {
                    return;
                }

                this.base();

                if (this.control && this.control.length > 0)
                {
                    $(this.control).addClass("disabled");
                    $(this.control).prop("disabled", true);
                }
            },

            /**
             * @see Alpaca.Field#enable
             */
            enable: function()
            {
                if (this.options.readonly) {
                    return;
                }

                this.base();

                if (this.control && this.control.length > 0)
                {
                    $(this.control).removeClass("disabled");
                    $(this.control).prop("disabled", false);
                }
            },

            /**
             * @see Alpaca.Field#isDisabled
             */
            isDisabled: function()
            {
                return $(this.control).prop("disabled");
            },

            /**
             * @returns {array} the enum value to use for this field
             */
            getEnum: function()
            {
                var array = null;

                if (this.schema["enum"])
                {
                    array = this.schema["enum"];
                }
                else if (this.schema.type === "array" && this.schema.items && this.schema.items.enum)
                {
                    array = this.schema.items.enum;
                }

                return array;
            },

            /**
             * Sets the enum value to use for this field
             *
             * @param {array} enumArray
             */
            setEnum: function(enumArray)
            {
                Alpaca.safeSetObjectArray(this.schema, "enum", enumArray);
            },

            /**
             * @returns {array} the option labels to use for this field
             */
            getOptionLabels: function()
            {
                var array = null;

                if (this.options && this.options["optionLabels"])
                {
                    array = this.options["optionLabels"];
                }

                return array;
            },

            /**
             * Sets the option labels to use for this field.
             *
             * @param {array} optionLabelsArray
             */
            setOptionLabels: function(optionLabelsArray)
            {
                Alpaca.safeSetObjectArray(this.options, "optionLabels", optionLabelsArray);
            },

            /**
             * Sorts the given enumerated values using the local sortSelectableOptions method.
             */
            sortEnum: function()
            {
                var enumValues = this.getEnum();
                if (enumValues && enumValues.length > 0)
                {
                    var optionLabels = this.getOptionLabels();

                    var selectableOptions = [];
                    for (var i = 0; i < enumValues.length; i++)
                    {
                        var value = enumValues[i];
                        var text = enumValues[i];

                        if (optionLabels && optionLabels.length >= i + 1)
                        {
                            text = optionLabels[i];
                        }

                        selectableOptions.push({
                            "value": value,
                            "text": text
                        });
                    }

                    // sort the options
                    this.sortSelectableOptions(selectableOptions);

                    // now set back
                    var newEnumValues = [];
                    var newOptionLabels = [];
                    for (var i = 0; i < selectableOptions.length; i++)
                    {
                        newEnumValues.push(selectableOptions[i].value);

                        if (Alpaca.isArray(optionLabels)) {
                            newOptionLabels.push(selectableOptions[i].text);
                        }
                    }

                    this.setEnum(newEnumValues);
                    this.setOptionLabels(newOptionLabels);
                }
            },

            /**
             * Sorts a select options array by order of displayable text.
             *
             * If you're looking to provide a custom sort order, you may wish to override this function.
             * Alternatively, you can provide an options.sort function - fn(a, b).
             *
             * @param selectableOptions
             */
            sortSelectableOptions: function(selectableOptions)
            {
                var self = this;

                // if sort is false, just return
                if (self.options.sort === false)
                {
                    return;
                }

                // assume a default sort function
                var sortFn = Alpaca.defaultSort;

                // if they provide a custom sort function, use that instead
                if (self.options.sort) {
                    if (typeof(self.options.sort) === "function") {
                        sortFn = self.options.sort;
                    }
                }

                // sort it
                selectableOptions.sort(sortFn);
            },

            /**
             * Helper function that invokes a datasource configured for this control.  The results are written into the
             * given array and the onFinish method is then called with (err, array).
             *
             * @param array
             * @param onFinish
             */
            invokeDataSource: function(array, model, onFinish)
            {
                var self = this;

                var completionFunction = function(err)
                {
                    var self = this;

                    if (err) {
                        return onFinish(err);
                    }

                    self.afterLoadDataSourceOptions(array, model, function(err, array) {

                        if (err) {
                            return onFinish(err);
                        }

                        // apply sorting to whatever we produce
                        self.sortSelectableOptions(array);

                        onFinish(null, array);

                    });

                }.bind(self);

                if (Alpaca.isFunction(self.options.dataSource))
                {
                    self.options.dataSource.call(self, function(values) {

                        if (Alpaca.isArray(values))
                        {
                            for (var i = 0; i < values.length; i++)
                            {
                                if (typeof(values[i]) === "string")
                                {
                                    array.push({
                                        "text": values[i],
                                        "value": values[i]
                                    });
                                }
                                else if (Alpaca.isObject(values[i]))
                                {
                                    array.push(values[i]);
                                }
                            }

                            completionFunction();
                        }
                        else if (Alpaca.isObject(values))
                        {
                            for (var k in values)
                            {
                                array.push({
                                    "text": k,
                                    "value": values[k]
                                });
                            }

                            completionFunction();
                        }
                        else
                        {
                            completionFunction();
                        }
                    });
                }
                else if (Alpaca.isUri(self.options.dataSource))
                {
                    var locale = self.view.locale;

                    var url = "" + self.options.dataSource;

                    if (locale)
                    {
                        url += ((url.indexOf("?") === -1) ? "?" : "&");
                        url += "locale=" + locale;
                    }


                    $.ajax({
                        url: url,
                        type: "get",
                        dataType: "json",
                        success: function(jsonDocument) {

                            var ds = jsonDocument;
                            if (self.options.dsTransformer && Alpaca.isFunction(self.options.dsTransformer))
                            {
                                ds = self.options.dsTransformer(ds);
                            }

                            if (ds)
                            {
                                if (Alpaca.isObject(ds))
                                {
                                    // for objects, we walk through one key at a time
                                    // the insertion order is the order of the keys from the map
                                    // to preserve order, consider using an array as below
                                    $.each(ds, function(key, value) {
                                        array.push({
                                            "value": key,
                                            "text": value
                                        });
                                    });

                                    completionFunction();
                                }
                                else if (Alpaca.isArray(ds))
                                {
                                    // for arrays, we walk through one index at a time
                                    // the insertion order is dictated by the order of the indices into the array
                                    // this preserves order
                                    $.each(ds, function(index, value) {
                                        array.push({
                                            "value": value.value,
                                            "text": value.text
                                        });
                                    });

                                    completionFunction();
                                }
                            }
                        },
                        "error": function(jqXHR, textStatus, errorThrown) {

                            self.errorCallback({
                                "message":"Unable to load data from uri : " + self.options.dataSource,
                                "stage": "DATASOURCE_LOADING_ERROR",
                                "details": {
                                    "jqXHR" : jqXHR,
                                    "textStatus" : textStatus,
                                    "errorThrown" : errorThrown
                                }
                            });
                        }
                    });
                }
                else if (Alpaca.isArray(self.options.dataSource))
                {
                    var ds = self.options.dataSource;

                    for (var i = 0; i < ds.length; i++)
                    {
                        if (typeof(ds[i]) === "string")
                        {
                            array.push({
                                "text": ds[i],
                                "value": ds[i]
                            });
                        }
                        else if (Alpaca.isObject(ds[i]))
                        {
                            array.push(ds[i]);
                        }
                    }

                    completionFunction();
                }
                else if (Alpaca.isObject(self.options.dataSource))
                {
                    if (self.options.dataSource.connector)
                    {
                        var connector = self.connector;

                        if (Alpaca.isObject(self.options.dataSource.connector))
                        {
                            var connectorId = self.options.dataSource.connector.id;
                            var connectorConfig = self.options.dataSource.connector.config;
                            if (!connectorConfig) {
                                connectorConfig = {};
                            }

                            var ConnectorClass = Alpaca.getConnectorClass(connectorId);
                            if (ConnectorClass) {
                                connector = new ConnectorClass(connectorId, connectorConfig);
                            }
                        }

                        var config = self.options.dataSource.config;
                        if (!config) {
                            config = {};
                        }

                        // load using connector
                        connector.loadDataSource(config, function(values) {

                            for (var i = 0; i < values.length; i++)
                            {
                                if (typeof(values[i]) === "string")
                                {
                                    array.push({
                                        "text": values[i],
                                        "value": values[i]
                                    });
                                }
                                else if (Alpaca.isObject(values[i]))
                                {
                                    array.push(values[i]);
                                }
                            }

                            completionFunction();
                        });
                    }
                    else
                    {
                        // load from standard object
                        for (var k in self.options.dataSource)
                        {
                            array.push({
                                "text": self.options.dataSource[k],
                                "value": k
                            });
                        }

                        completionFunction();
                    }

                }
                else
                {
                    onFinish();
                }
            },

            afterLoadDataSourceOptions: function(array, model, callback)
            {
                callback(null, array);
            }


            /* builder_helpers */
            ,

            /**
             * @private
             * @see Alpaca.Field#getSchemaOfSchema
             */
            getSchemaOfSchema: function() {
                return Alpaca.merge(this.base(), {
                    "properties": {
                        "enum": {
                            "title": "Enumerated Values",
                            "description": "List of specific values for this property",
                            "type": "array"
                        }
                    }
                });
            },

            /**
             * @private
             * @see Alpaca.Field#getOptionsForSchema
             */
            getOptionsForSchema: function() {
                return Alpaca.merge(this.base(), {
                    "fields": {
                        "enum": {
                            "itemLabel":"Value",
                            "type": "array"
                        }
                    }
                });
            },

            /**
             * @private
             * @see Alpaca.Field#getSchemaOfOptions
             */
            getSchemaOfOptions: function() {
                return Alpaca.merge(this.base(), {
                    "properties": {
                        "name": {
                            "title": "Field Name",
                            "description": "Field Name.",
                            "type": "string"
                        },
                        "sort": {
                            "title": "Sort Function",
                            "description": "Defines an f(a,b) sort function for the array of enumerated values [{text, value}].  This is used to sort enum and optionLabels as well as results that come back from any data sources (for select and radio controls).  By default the items are sorted alphabetically.   Don't apply any sorting if false.",
                            "type": "function"
                        }
                    }
                });
            },

            /**
             * @private
             * @see Alpaca.Field#getOptionsForOptions
             */
            getOptionsForOptions: function() {
                return Alpaca.merge(this.base(), {
                    "fields": {
                        "name": {
                            "type": "text"
                        }
                    }
                });
            }
            /* end_builder_helpers */
        });

    // Registers additional messages
    Alpaca.registerMessages({
        "invalidValueOfEnum": "This field should have one of the values in {0}.  Current value is: {1}"
    });

})(jQuery);
(function($) {

    var Alpaca = $.alpaca;

    Alpaca.ContainerField = Alpaca.Field.extend(
    /**
     * @lends Alpaca.ContainerField.prototype
     */
    {
        /**
         * Called during construction to signal that this field is a container field.
         */
        onConstruct: function()
        {
            this.isContainerField = true;
        },

        /**
         * @see Alpaca.Field#isContainer
         */
        isContainer: function()
        {
            return true;
        },

        getContainerEl: function()
        {
            return this.container;
        },

        /**
         * For container fields, we use the "container" template as the primary.
         *
         * @see Alpaca.Field#getTemplateDescriptorId
         * @returns {string}
         */
        getTemplateDescriptorId : function ()
        {
            return "container";
        },

        resolveContainerTemplateType: function()
        {
            // we assume the field type and then check the view to see if there is a template for this view
            // if not, we walk the parent chain until we find a template type

            var finished = false;
            var selectedType = null;

            var b = this;
            do
            {
                if (!b.getFieldType)
                {
                    finished = true;
                }
                else
                {
                    var d = this.view.getTemplateDescriptor("container-" + b.getFieldType(), this);
                    if (d)
                    {
                        selectedType = b.getFieldType();
                        finished = true;
                    }
                    else
                    {
                        b = b.constructor.ancestor.prototype;
                    }
                }
            }
            while (!finished);

            return selectedType;
        },

        resolveContainerItemTemplateType: function()
        {
            // we assume the field type and then check the view to see if there is a template for this view
            // if not, we walk the parent chain until we find a template type

            var finished = false;
            var selectedType = null;

            var b = this;
            do
            {
                if (!b.getFieldType)
                {
                    finished = true;
                }
                else
                {
                    var d = this.view.getTemplateDescriptor("container-" + b.getFieldType() + "-item", this);
                    if (d)
                    {
                        selectedType = b.getFieldType();
                        finished = true;
                    }
                    else
                    {
                        b = b.constructor.ancestor.prototype;
                    }
                }
            }
            while (!finished);

            return selectedType;
        },

        /**
         * @see Alpaca.Field#setup
         */
        setup: function()
        {
            var self = this;

            this.base();

            var containerTemplateType = self.resolveContainerTemplateType();
            if (!containerTemplateType)
            {
                return Alpaca.throwErrorWithCallback("Unable to find template descriptor for container: " + self.getFieldType());
            }

            this.containerDescriptor = this.view.getTemplateDescriptor("container-" + containerTemplateType, self);

            // default to false
            var collapsible = false;

            if (!Alpaca.isEmpty(this.view.collapsible)) {
                collapsible = this.view.collapsible;
            }

            if (!Alpaca.isEmpty(this.options.collapsible)) {
                collapsible = this.options.collapsible;
            }

            this.options.collapsible = collapsible;

            var legendStyle = "button";

            if (!Alpaca.isEmpty(this.view.legendStyle)) {
                legendStyle = this.view.legendStyle;
            }

            if (!Alpaca.isEmpty(this.options.legendStyle)) {
                legendStyle = this.options.legendStyle;
            }

            this.options.legendStyle = legendStyle;

            //Lazy loading
            this.lazyLoading = false;
            if (!Alpaca.isEmpty(this.options.lazyLoading)) {
                this.lazyLoading = this.options.lazyLoading;
                if (this.lazyLoading) {
                    this.options.collapsed = true;
                }
                //delete this.options.lazyLoading;
            }
            // holders of references to children
            this.children = [];
            this.childrenById = {};
            this.childrenByPropertyId = {};
        },

        /**
         * @see Alpaca.Field#destroy
         */
        destroy: function()
        {
            // if this container is DOM-wrapped with a form, then release the form
            if (this.form)
            {
                this.form.destroy(true); // pass in true so that we don't call back recursively
                delete this.form;
            }

            // destroy any child controls
            Alpaca.each(this.children, function () {
                this.destroy();
            });

            // call up to base method
            this.base();
        },

        // @Override
        bindData: function()
        {
        },

        /**
         * Add a "container" dom element inside of the field which houses our custom container.
         *
         * @see Alpaca.Field#renderField
         */
        renderFieldElements: function(callback) {

            var self = this;

            // find our insertion point
            // this is marked by the handlebars helper
            this.container = $(this.field).find("." + Alpaca.MARKER_CLASS_CONTAINER_FIELD);
            this.container.removeClass(Alpaca.MARKER_CLASS_CONTAINER_FIELD);

            // render
            self.prepareContainerModel(function(model) {
                self.beforeRenderContainer(model, function() {
                    self.renderContainer(model, function(containerField) {

                        if (containerField)
                        {
                            self.container.replaceWith(containerField);
                            self.container = containerField;

                            self.container.addClass(Alpaca.CLASS_CONTAINER);
                        }

                        // mark the form field with "alpaca-horizontal" or "alpaca-vertical"
                        if (self.view.horizontal)
                        {
                            self.container.addClass("alpaca-horizontal");
                        }
                        else
                        {
                            self.container.addClass("alpaca-vertical");
                        }

                        // CALLBACK: "container"
                        self.fireCallback("container");

                        self.afterRenderContainer(model, function() {

                            callback();
                        });

                    });
                });
            });
        },

        /**
         * Prepares the model for use in rendering the container.
         *
         * @param callback function(model)
         */
        prepareContainerModel: function(callback)
        {
            var self = this;

            var model = {
                "id": this.getId(),
                "name": this.name,
                "schema": this.schema,
                "options": this.options,
                "view": this.view
            };

            // load items into array and store on model for future use
            self.createItems(function(items) {

                if (!items)
                {
                    items = [];
                }

                // legacy support: assume containerItemEl = fieldEl
                for (var i = 0; i < items.length; i++)
                {
                    if (!items[i].containerItemEl) {
                        items[i].containerItemEl = items[i].getFieldEl();
                    }
                }

                model.items = items;

                callback(model);

            });
        },

        /**
         * Called before the container is rendered.
         *
         * @extension-point
         *
         * @param model
         * @param callback
         */
        beforeRenderContainer: function(model, callback)
        {
            var self = this;

            callback();
        },

        /**
         * Renders the container into the field container.
         *
         * @extension-point
         *
         * @param model
         * @param callback
         */
        renderContainer: function(model, callback)
        {
            var container = null;

            if (this.containerDescriptor)
            {
                container = Alpaca.tmpl(this.containerDescriptor, model);
            }

            callback(container);
        },

        /**
         * Called after the container is rendered.
         *
         * @extension-point
         *
         * @param model
         * @param callback
         */
        afterRenderContainer: function(model, callback)
        {
            var self = this;

            self.beforeApplyCreatedItems(model, function() {
                self.applyCreatedItems(model, function () {
                    self.afterApplyCreatedItems(model, function () {
                        callback();
                    });
                });
            });
        },

        /**
         * @see Alpaca.Field#postRender
         */
        postRender: function(callback)
        {
            var self = this;

            this.base(function() {

                callback();

            });
        },

        /**
         * @see Alpaca.Field#initEvents
         */
        initEvents: function()
        {
            var self = this;

            this.base();

            /*
            if (self.options.collapsible)
            {
                // CALLBACK: "collapsible"
                self.fireCallback("collapsible");
            }
            */
        },

        /**
         * Creates any sub-items for this container.
         *
         * @extension_point
         *
         * @param callback
         */
        createItems: function(callback)
        {
            callback();
        },

        beforeApplyCreatedItems: function(model, callback)
        {
            callback();
        },

        applyCreatedItems: function(model, callback)
        {
            var self = this;

            var layoutBindings = null;
            if (self.isTopLevel() && self.view.getLayout())
            {
                layoutBindings = self.view.getLayout().bindings;

                // if layout and bindings not provided, assume a default strategy
                if (!layoutBindings && self.view.getLayout().templateDescriptor && model.items.length > 0)
                {
                    layoutBindings = {};

                    for (var i = 0; i < model.items.length; i++)
                    {
                        var name = model.items[i].name;

                        layoutBindings[name] = "[data-alpaca-layout-binding='" + name + "']";
                    }
                }

            }

            if (model.items.length > 0)
            {
                $(self.container).addClass("alpaca-container-has-items");
                $(self.container).attr("data-alpaca-container-item-count", model.items.length);
            }
            else
            {
                $(self.container).removeClass("alpaca-container-has-items");
                $(self.container).removeAttr("data-alpaca-container-item-count");
            }

            for (var i = 0; i < model.items.length; i++)
            {
                var item = model.items[i];

                // find the insertion point
                var insertionPoint = $(self.container).find("." + Alpaca.MARKER_CLASS_CONTAINER_FIELD_ITEM + "[" + Alpaca.MARKER_DATA_CONTAINER_FIELD_ITEM_KEY + "='" + item.name + "']");
                if (!layoutBindings)
                {
                    var holder = $(insertionPoint).parent();

                    $(insertionPoint).replaceWith(item.containerItemEl);

                    // reset domEl to allow for refresh
                    item.domEl = holder;
                }
                else
                {
                    // use a layout
                    var bindingId = layoutBindings[item.name];
                    if (bindingId)
                    {
                        var holder = $(bindingId, self.field);
                        if (holder.length == 0)
                        {
                            // legacy support, fallback to ID based
                            try {
                                holder = $('#' + bindingId, self.field);
                            } catch (e) { }
                        }
                        if (holder.length > 0)
                        {
                            // create a wrapper (which will serve as the domEl)
                            item.domEl = $("<div></div>");
                            $(item.domEl).addClass("alpaca-layout-binding-holder");
                            $(item.domEl).attr("alpaca-layout-binding-field-name", item.name);
                            holder.append(item.domEl);
                            item.domEl.append(item.containerItemEl);
                        }
                    }

                    // remove insertion point
                    $(insertionPoint).remove();
                }

                $(item.containerItemEl).addClass("alpaca-container-item");

                if (i === 0)
                {
                    $(item.containerItemEl).addClass("alpaca-container-item-first");
                }

                if (i + 1 === model.items.length)
                {
                    $(item.containerItemEl).addClass("alpaca-container-item-last");
                }

                $(item.containerItemEl).attr("data-alpaca-container-item-index", i);
                $(item.containerItemEl).attr("data-alpaca-container-item-name", item.name);
                $(item.containerItemEl).attr("data-alpaca-container-item-parent-field-id", self.getId());

                // register the child
                self.registerChild(item, i);
            }

            if (self.options.collapsible)
            {
                // CALLBACK: "collapsible"
                self.fireCallback("collapsible");
            }

            self.triggerUpdate();

            callback();
        },

        afterApplyCreatedItems: function(model, callback)
        {
            callback();
        },

        /**
         * Helper method to add child field.
         *
         * @param {Alpaca.Control} child Child field to be added.
         * @param {Integer} index Index of the new child.
         */
        registerChild: function(child, index)
        {
            if (!Alpaca.isEmpty(index))
            {
                this.children.splice(index, 0, child);
            }
            else
            {
                this.children.push(child);
            }

            this.childrenById[child.getId()] = child;
            if (child.propertyId)
            {
                this.childrenByPropertyId[child.propertyId] = child;
            }

            child.parent = this;
        },

        /**
         * Helper method to remove child field.
         *
         * @param index
         */
        unregisterChild: function(index)
        {
            var child = this.children[index];
            if (!child)
            {
                return;
            }

            if (!Alpaca.isEmpty(index))
            {
                this.children.splice(index, 1);
            }

            delete this.childrenById[child.getId()];
            if (child.propertyId)
            {
                delete this.childrenByPropertyId[child.propertyId];
            }

            child.parent = null;
        },

        /**
         * This method gets invoked after items are dynamically added, removed or moved around in the child chain.
         * It adjusts classes on child DOM elements to make sure they're correct.
         */
        updateDOMElement: function()
        {
            var self = this;

            this.base();

            if (self.children.length > 0)
            {
                $(self.getContainerEl()).addClass("alpaca-container-has-items");
                $(self.getContainerEl()).attr("data-alpaca-container-item-count", self.children.length);
            }
            else
            {
                $(self.getContainerEl()).removeClass("alpaca-container-has-items");
                $(self.getContainerEl()).removeAttr("data-alpaca-container-item-count");
            }

            for (var i = 0; i < self.children.length; i++)
            {
                var child = self.children[i];

                // set path if not set
                if (!child.path)
                {
                    if (child.schema.type === "array")
                    {
                        child.path = self.path + "[" + i + "]";
                    }
                    else
                    {
                        child.path = self.path + "/" + child.propertyId;
                    }
                }

                child.calculateName();

                $(child.containerItemEl).removeClass("alpaca-container-item-first");
                $(child.containerItemEl).removeClass("alpaca-container-item-last");
                $(child.containerItemEl).removeClass("alpaca-container-item-index");
                $(child.containerItemEl).removeClass("alpaca-container-item-key");

                $(child.containerItemEl).addClass("alpaca-container-item");

                if (i === 0)
                {
                    $(child.containerItemEl).addClass("alpaca-container-item-first");
                }
                if (i + 1 === self.children.length)
                {
                    $(child.containerItemEl).addClass("alpaca-container-item-last");
                }

                $(child.containerItemEl).attr("data-alpaca-container-item-index", i);
                $(child.containerItemEl).attr("data-alpaca-container-item-name", child.name);
                $(child.containerItemEl).attr("data-alpaca-container-item-parent-field-id", self.getId());

                self.updateChildDOMWrapperElement(i, child);

                child.updateDOMElement();
            }
        },

        /**
         * EXTENSION POINT that allows containers to update any custom wrapper elements for child controls.
         *
         * @param i
         * @param child
         */
        updateChildDOMWrapperElement: function(i, child)
        {

        },

        /**
         * Gets called whenever an item is dynamically added or removed from a container.  This allows all of the
         * container markers to refresh on the DOM.
         */
        handleRepositionDOMRefresh: function()
        {
            var self = this;

            if (self.getParent())
            {
                // call update dom markers for parent which will trickle down to to cover this field and our siblings
                self.getParent().updateDOMElement();
            }
            else
            {
                // just ourselves
                self.updateDOMElement();
            }
        },

        /**
         * Propagates signal down to all children.
         * @override
         */
        onDependentReveal: function()
        {
            for (var i = 0; i < this.children.length; i++)
            {
                this.children[i].onDependentReveal();
            }
        },

        /**
         * Propagates signal down to all children.
         * @override
         */
        onDependentConceal: function()
        {
            for (var i = 0; i < this.children.length; i++)
            {
                this.children[i].onDependentConceal();
            }
        },

        /**
         * Focus an element in the container.  Find the first invalid element or if no invalid elements, pick
         * the first child.  If a callback is provided, the callback is fired and passed the control element
         * that received the focus.
         */
        focus: function(onFocusCallback)
        {
            var self = this;

            if (this.isDisplayOnly())
            {
                if (onFocusCallback) {
                    onFocusCallback();
                }
                return;
            }

            this.base();

            var invalidIndex = -1;

            // use the dom to create an array that orders things as they are laid out on the page
            var pageOrderedChildren = [];
            var el = this.getContainerEl();
            if (this.form) {
                el = this.form.getFormEl();
            }
            $(el).find(".alpaca-container-item[data-alpaca-container-item-parent-field-id='" + this.getId() + "']").each(function() {
                var childIndex = $(this).attr("data-alpaca-container-item-index");
                pageOrderedChildren.push(self.children[childIndex]);
            });

            // walk the ordered children and find first invalid
            for (var i = 0; i < pageOrderedChildren.length; i++)
            {
                if (pageOrderedChildren[i])
                {
                    if (!pageOrderedChildren[i].isValid(true) &&
                        pageOrderedChildren[i].isControlField &&
                        pageOrderedChildren[i].isAutoFocusable() &&
                        !pageOrderedChildren[i].options.readonly)
                    {
                        invalidIndex = i;
                        break;
                    }
                }
            }

            // if we didn't find anything invalid, just focus on first item
            if (invalidIndex === -1 && pageOrderedChildren.length > 0)
            {
                invalidIndex = 0;
            }

            // do the focus if we found something
            if (invalidIndex > -1)
            {
                pageOrderedChildren[invalidIndex].focus();

                if (onFocusCallback)
                {
                    onFocusCallback(pageOrderedChildren[invalidIndex]);
                }
            }
        },

        /**
         * @see Alpaca.Field#disable
         */
        disable: function()
        {
            if (this.options.readonly) {
                return;
            }

            this.base();

            for (var i = 0; i < this.children.length; i++)
            {
                this.children[i].disable();
            }
        },

        /**
         * @see Alpaca.Field#enable
         */
        enable: function()
        {
            if (this.options.readonly) {
                return;
            }

            this.base();

            for (var i = 0; i < this.children.length; i++)
            {
                this.children[i].enable();
            }
        },

        /**
         * Returns the value of this field.
         *
         * @returns {Any} value Field value.
         */
        getValue: function()
        {
            var self = this;

            var value = self.getContainerValue();

            /*
            if (self.isDisplayOnly())
            {
                if (value)
                {
                    value = JSON.stringify(value, null, "  ");
                }
            }
            */

            return value;
        },

        /**
         * Extension point
         */
        getContainerValue: function()
        {
            return null;
        },

        firstChild: function() {
            var child = null;

            if (this.children.length > 0) {
                child = this.children[0];
            }

            return child;
        },

        lastChild: function() {
            var child = null;

            if (this.children.length > 0) {
                child = this.children[this.children.length - 1];
            }

            return child;
        }

        /* builder_helpers */
        ,

        /**
         * @private
         * @see Alpaca.Field#getSchemaOfOptions
         */
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "lazyLoading": {
                        "title": "Lazy Loading",
                        "description": "Child fields will only be rendered when the fieldset is expanded if this option is set true.",
                        "type": "boolean",
                        "default": false
                    },
                    "collapsible": {
                        "title": "Collapsible",
                        "description": "Field set is collapsible if true.",
                        "type": "boolean",
                        "default": false
                    },
                    "collapsed": {
                        "title": "Collapsed",
                        "description": "Field set is initially collapsed if true.",
                        "type": "boolean",
                        "default": false
                    },
                    "legendStyle": {
                        "title": "Legend Style",
                        "description": "Field set legend style.",
                        "type": "string",
                        "enum":["button","link"],
                        "default": "button"
                    },
                    "animate": {
                        "title": "Animate movements and transitions",
                        "description": "Up and down transitions will be animated",
                        "type": "boolean",
                        "default": true
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.Field#getOptionsForOptions
         */
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "lazyLoading": {
                        "rightLabel": "Lazy loading child fields ?",
                        "helper": "Lazy loading will be enabled if checked.",
                        "type": "checkbox"
                    },
                    "collapsible": {
                        "rightLabel": "Field set collapsible ?",
                        "helper": "Field set is collapsible if checked.",
                        "type": "checkbox"
                    },
                    "collapsed": {
                        "rightLabel": "Field set initially collapsed ?",
                        "description": "Field set is initially collapsed if checked.",
                        "type": "checkbox"
                    },
                    "legendStyle": {
                        "type":"select"
                    },
                    "animate": {
                        "rightLabel": "Animate movements and transitions",
                        "type": "checkbox"
                    }
                }
            });
        }
        /* end_builder_helpers */
    });

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Form = Base.extend(
    /**
     * @lends Alpaca.Form.prototype
     */
    {
        /**
         * @constructs
         *
         * @class This class is for managing HTML form control.
         *
         * @param {Object} domEl Field container.
         * @param {Object} options Field options.
         * @param {Object|String} view Field view.
         * @param {Alpaca.Connector} connector Field connector.
         * @param {Function} errorCallback Error callback.
         */
        constructor: function(domEl, options, viewId, connector, errorCallback) {

            // container
            this.domEl = domEl;

            // parent
            this.parent = null;

            this.connector = connector;
            this.errorCallback = errorCallback;

            // options
            this.options = options;

            if (this.options.attributes)
            {
                this.attributes = this.options.attributes;
            }
            else
            {
                this.attributes = {};
            }

            if (this.options.buttons)
            {
                if (this.options.buttons.submit)
                {
                    if (!this.options.buttons.submit.type)
                    {
                        this.options.buttons.submit.type = 'submit';
                    }

                    if (!this.options.buttons.submit.name)
                    {
                        this.options.buttons.submit.name = 'submit';
                    }

                    if (!this.options.buttons.submit.value)
                    {
                        this.options.buttons.submit.value = 'Submit';
                    }
                }

                if (this.options.buttons.reset)
                {
                    if (!this.options.buttons.reset.type)
                    {
                        this.options.buttons.reset.type = 'reset';
                    }
                    if (!this.options.buttons.reset.name)
                    {
                        this.options.buttons.reset.name = 'reset';
                    }
                    if (!this.options.buttons.reset.value)
                    {
                        this.options.buttons.reset.value = 'Reset';
                    }
                }

                // some general correction
                for (var k in this.options.buttons)
                {
                    if (this.options.buttons[k].label)
                    {
                        this.options.buttons[k].value = this.options.buttons[k].label;
                    }
                    if (this.options.buttons[k].title)
                    {
                        this.options.buttons[k].value = this.options.buttons[k].title;
                    }
                    if (!this.options.buttons[k].type)
                    {
                        this.options.buttons[k].type = "button";
                    }
                }
            }

            if (this.attributes.id)
            {
                this.id = this.attributes.id;
            }
            else
            {
                this.id = Alpaca.generateId();
                this.attributes.id = this.id;
            }

            // if we have a submit button specified, and toggleSubmitValidState isn't defined, set to true by default
            // don't allow the form to submit unless valid
            if (this.options.buttons && this.options.buttons.submit && Alpaca.isUndefined(this.options.toggleSubmitValidState))
            {
                this.options.toggleSubmitValidState = true;
            }

            this.viewType = options.viewType;

            // set a runtime view
            this.view = new Alpaca.RuntimeView(viewId, this);

            // for each button, make sure that classes is set minimally to view.styles.button
            for (var k in this.options.buttons)
            {
                if (!this.options.buttons[k].styles) {
                    this.options.buttons[k].styles = this.view.styles.button;
                }
            }

        },

        /**
         * Renders this form into the container.
         *
         * @param {Function} callback
         */
        render: function(callback)
        {
            var self = this;

            // load the appropriate template and render it
            this.processRender(this.domEl, function() {

                // bind our field dom element into the domEl
                self.form.appendTo(self.domEl);

                // add default class
                self.form.addClass("alpaca-form");

                // CALLBACK: "form"
                self.fireCallback("form");

                // execute callback
                callback(self);
            });
        },

        afterInitialize: function()
        {
            var self = this;

            if (self.options.toggleSubmitValidState) {

                // adjust submit button state
                self.adjustSubmitButtonState();

            }

        },

        /**
         * Determines whether the top control is entirely valid.
         *
         * @return {*}
         */
        isFormValid: function()
        {
            // re-compute validation for the full control set
            this.topControl.validate(true);

            var valid = this.topControl.isValid(true);
            //this.refreshValidationState(true);

            return valid;
        },

        isValid: function()
        {
            return this.isFormValid();
        },

        validate: function(children)
        {
            return this.topControl.validate(children);
        },

        enableSubmitButton: function()
        {
            $(".alpaca-form-button-submit").attrProp("disabled", false);

            if ($.mobile)
            {
                try { $(".alpaca-form-button-submit").button('refresh'); } catch (e) { }
            }
        },

        disableSubmitButton: function()
        {
            $(".alpaca-form-button-submit").attrProp("disabled", true);

            if ($.mobile)
            {
                try { $(".alpaca-form-button-submit").button('refresh'); } catch (e) { }
            }
        },

        adjustSubmitButtonState: function()
        {
            this.disableSubmitButton();

            if (this.isFormValid())
            {
                this.enableSubmitButton();
            }
        },

        /**
         * Responsible for fetching any templates needed so as to render the
         * current mode for this field.
         *
         * Once completed, the onSuccess method is called.
         *
         * @param {Object} parentEl Field container.
         * @param {Function} callback
         */
        processRender: function(parentEl, callback)
        {
            var self = this;

            // lookup the template we should use to render
            this.formDescriptor = this.view.getTemplateDescriptor("form");
            if (!this.formDescriptor)
            {
                return Alpaca.throwErrorWithCallback("Could not find template descriptor: form");
            }

            var renderedDomElement = Alpaca.tmpl(this.formDescriptor, {
                id: this.getId(),
                options: this.options,
                view: this.view
            });
            renderedDomElement.appendTo(parentEl);

            this.form = renderedDomElement;

            // find our insertion point
            // this is marked by the handlebars helper
            this.formFieldsContainer = $(this.form).find("." + Alpaca.MARKER_CLASS_FORM_ITEMS_FIELD);
            this.formFieldsContainer.removeClass(Alpaca.MARKER_CLASS_FORM_ITEMS_FIELD);

            if (Alpaca.isEmpty(this.form.attr("id")))
            {
                this.form.attr("id", this.getId() + "-form-outer");
            }
            if (Alpaca.isEmpty(this.form.attr("data-alpaca-form-id")))
            {
                this.form.attr("data-alpaca-form-id", this.getId());
            }

            // the form field
            $(parentEl).find("form").attr(this.attributes);

            // populate the buttons as well
            this.buttons = {};
            $(parentEl).find(".alpaca-form-button").each(function() {

                $(this).click(function(e) {
                    $(this).attr("button-pushed", true);
                });

                // custom click handler?
                var key = $(this).attr("data-key");
                if (key)
                {
                    var buttonConfig = self.options.buttons[key];
                    if (buttonConfig)
                    {
                        if (buttonConfig.click)
                        {
                            $(this).click(function(form, handler) {
                                return function(e) {
                                    e.preventDefault();
                                    handler.call(form, e);
                                }
                            }(self, buttonConfig.click));
                        }
                    }
                }
            });

            callback();
        },

        /**
         * Returns the id of the form.
         *
         * @returns {String} Form id
         */
        getId: function()
        {
            return this.id;
        },

        /**
         * Returns form type.
         *
         * @returns {String} Form type.
         */
        getType: function()
        {
            return this.type;
        },

        /**
         * Returns this form's parent.
         *
         * @returns {Object} Form parent.
         */
        getParent: function()
        {
            return this.parent;
        },

        /**
         * Returns the value of the JSON rendered by this form.
         *
         * @returns {Any} Value of the JSON rendered by this form.
         */
        getValue: function()
        {
            return this.topControl.getValue();
        },

        /**
         * Sets the value of the JSON to be rendered by this form.
         *
         * @param {Any} value Value to be set.
         */
        setValue: function(value)
        {
            this.topControl.setValue(value);
        },

        /**
         * Initializes events handling (Form Submission) for this form.
         */
        initEvents: function()
        {
            var _this = this;

            var formTag = $(this.domEl).find("form");

            var v = this.getValue();
            $(formTag).submit(v, function(e) {
                return _this.onSubmit(e, _this);
            });

            // listen for fieldupdates and determine whether the form is valid.
            // if so, enable the submit button...
            // otherwise, disable it
            if (this.options.toggleSubmitValidState)
            {
                $(_this.topControl.getFieldEl()).bind("fieldupdate", function() {
                    _this.adjustSubmitButtonState();
                });

                $(_this.topControl.getFieldEl()).bind("fieldkeyup", function() {
                    _this.adjustSubmitButtonState();
                });

                $(_this.topControl.getFieldEl()).bind("fieldblur", function() {
                    _this.adjustSubmitButtonState();
                });

            }
        },

        getButtonEl: function(buttonId)
        {
            return $(this.domEl).find(".alpaca-form-button-" + buttonId);
        },

        /**
         * Handles form submit events.
         *
         * @param {Object} e Submit event.
         * @param {Object} form the form
         */
        onSubmit: function(e, form)
        {
            if (!this.isFormValid())
            {
                e.stopPropagation();

                this.refreshValidationState(true);

                return false;
            }

            if (this.submitHandler)
            {
                e.stopPropagation();

                var v = this.submitHandler(e, form);
                if (Alpaca.isUndefined(v)) {
                    v = false;
                }

                return v;
            }
        },

        /**
         * Registers a custom submit handler.
         *
         * @param {Object} func Submit handler to be registered.
         */
        registerSubmitHandler: function (func)
        {
            if (Alpaca.isFunction(func))
            {
                this.submitHandler = func;
            }
        },

        /**
         * Displays validation information of all fields of this form.
         *
         * @param {Boolean} children whether to render validation state for child fields
         *
         * @returns {Object} Form validation state.
         */
        refreshValidationState: function(children, callback)
        {
            this.topControl.refreshValidationState(children, callback);
        },

        /**
         * Disables this form.
         */
        disable: function()
        {
            this.topControl.disable();
        },

        /**
         * Enables this form.
         */
        enable: function()
        {
            this.topControl.enable();
        },

        /**
         * Focuses on this form.
         *
         * If a callback is provided, the callback receives the focused control.
         */
        focus: function(onFocusCallback)
        {
            this.topControl.focus(function(controlWithFocus) {
                if (onFocusCallback)
                {
                    onFocusCallback(controlWithFocus);
                }
            });
        },

        /**
         * Purge any event listeners and remove the form from the DOM.
         *
         * @param [Boolean] skipParent when true, the form cleans up without traversing through parent child controls
         */
        destroy: function(skipParent)
        {
            this.getFormEl().remove();

            // we allow form.destroy() which tells parent control to destroy
            // if skipParent == true, then we do not call up (invoked from container)
            if (!skipParent && this.parent)
            {
                this.parent.destroy();
            }
        },

        /**
         * Shows the form.
         */
        show: function()
        {
            this.getFormEl().css({
                "display": ""
            });
        },

        /**
         * Hides the form.
         */
        hide: function()
        {
            this.getFormEl().css({
                "display": "none"
            });
        },

        /**
         * Clears the form and resets values of its fields.
         *
         * @param stopUpdateTrigger If false, triggers the update event of this event.
         */
        clear: function(stopUpdateTrigger)
        {
            this.topControl.clear(stopUpdateTrigger);
        },

        /**
         * Checks if form is empty.
         *
         * @returns {Boolean} True if the form is empty, false otherwise.
         */
        isEmpty: function()
        {
            return this.topControl.isEmpty();
        },

        /**
         * Fires a view callback for the current form.
         *
         * @param id
         * @param arg1
         * @param arg2
         * @param arg3
         * @param arg4
         * @param arg5
         */
        fireCallback: function(id, arg1, arg2, arg3, arg4, arg5)
        {
            this.view.fireCallback(this, id, arg1, arg2, arg3, arg4, arg5);
        },

        /**
         * Retrieves the form element.
         *
         * @returns {Object} The rendered DOM element.
         */
        getFormEl: function() {
            return this.form;
        },

        /**
         * Performs a regular old submit.
         */
        submit: function()
        {
            this.form.submit();
        },

        /**
         * Fires the submit in the background and hands back the jQuery promise.
         *
         * An optional config can be passed in to control the underlying jQuery ajax XHR.
         *
         * @returns {*}
         */
        ajaxSubmit: function(config)
        {
            var self = this;

            if (!config) {
                config = {};
            }

            config.url = self.options.attributes.action;
            config.type = self.options.attributes.method;

            if (!config.data) {
                config.data = this.getValue();
            }

            if (!config.dataType) {
                config.dataType = "json";
            }
            if (!config.headers) {
                config.headers = {};
            }

            // support CSRF here
            var csrfToken = self.determineCsrfToken();
            if (csrfToken) {
                config.headers[Alpaca.CSRF_HEADER_NAME] = csrfToken;
            }

            return $.ajax(config);
        },

        determineCsrfToken: function()
        {
            // is there a direct token specified?
            var csrfToken = Alpaca.CSRF_TOKEN;
            if (!csrfToken)
            {
                // is there a cookie that we can pull the value from?
                for (var t = 0; t < Alpaca.CSRF_COOKIE_NAMES.length; t++)
                {
                    var cookieName = Alpaca.CSRF_COOKIE_NAMES[t];

                    var cookieValue = Alpaca.readCookie(cookieName);
                    if (cookieValue)
                    {
                        csrfToken = cookieValue;
                        break;
                    }
                }
            }

            return csrfToken;
        }

    });

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.MemoryCache = function(config)
    {
        if (!config) {
            config = {};
        }

        var cache = {};

        return function(k, v, ttl)
        {
            if (!Alpaca.isUndefined(v))
            {
                if (v)
                {
                    cache[k] = {
                        v: v
                    };

                    if (!ttl && config.ttl) {
                        ttl = config.ttl;
                    }

                    if (ttl) {
                        cache[k].expires = new Date().getTime() + ttl;
                    }
                }
                else
                {
                    delete cache[k];
                }
            }

            // support for "clear" method - removes everything from cache
            if (k == "clear")
            {
                var za = [];
                for (var z in cache)
                {
                    za.push(z);
                }
                for (var i = 0; i < za.length; i++)
                {
                    delete cache[za[i]];
                }
            }

            var d = cache[k];
            if (!d) {
                return undefined;
            }

            var now = new Date().getTime();
            if (d.expires && d.expires < now)
            {
                delete cache[k];
                return undefined;
            }

            return d.v;
        };
    };

    Alpaca.registerCache("memory", Alpaca.MemoryCache);

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.NullCache = function(config)
    {
        return function(k, v, ttl)
        {
            if (v) {
                return v;
            }

            return undefined;
        };
    };

    Alpaca.registerCache("null", Alpaca.NullCache);

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Connector = Base.extend(
    /**
     * @lends Alpaca.Connector.prototype
     */
    {
        /**
         * @constructs
         * @class Connects Alpaca to remote data stores.

         * @param {String} id Connector ID
         * @param {Object} config Connector Config
         */
        constructor: function(id, config)
        {
            if (!config) {
                config = {};
            }

            this.id = id;
            this.config = config;

            // helper function to determine if a resource is a uri
            this.isUri = function(resource)
            {
                return !Alpaca.isEmpty(resource) && Alpaca.isUri(resource);
            };

            if (!config.cache) {
                config.cache = {
                    "type": "null",
                    "config": {}
                };
            }
            if (!config.cache.type) {
                config.cache.type = "null";
                config.cache.config = {};
            }

            this.cache = Alpaca.getCache(config.cache.type)(config.cache.config);
        },

        /**
         * Makes initial connections to data source.
         *
         * @param {Function} onSuccess onSuccess callback.
         * @param {Function} onError onError callback.
         */
        connect: function (onSuccess, onError)
        {
            onSuccess();
        },

        /**
         * Loads a template (HTML or Text).
         *
         * If the source is a URI, then it is loaded.
         * If it is not a URI, then the source is simply handed back.
         *
         * @param {Object|String} source Source to be loaded.
         * @param {Function} onSuccess onSuccess callback.
         * @param {Function} onError onError callback.
         */
        loadTemplate: function (source, onSuccess, onError)
        {
            if (!Alpaca.isEmpty(source))
            {
                if (Alpaca.isUri(source))
                {
                    this.loadUri(source, false, function(loadedData) {

                        if (onSuccess && Alpaca.isFunction(onSuccess))
                        {
                            onSuccess(loadedData);
                        }

                    }, function (loadError) {

                        if (onError && Alpaca.isFunction(onError))
                        {
                            onError(loadError);
                        }
                    });
                }
                else
                {
                    onSuccess(source);
                }
            }
            else
            {
                onError({
                    "message":"Empty data source.",
                    "reason": "TEMPLATE_LOADING_ERROR"
                });
            }
        },

        /**
         * Loads JSON data.
         *
         * @param {Object|String} resource Resource to be loaded
         * @param {Object} resources Map of resources
         * @param {Function} onSuccess onSuccess callback
         * @param {Function} onError onError callback
         */
        loadData: function (resource, resources, successCallback, errorCallback)
        {
            return this._handleLoadJsonResource(resource, successCallback, errorCallback);
        },

        /**
         * Loads JSON schema.
         *
         * @param {Object|String} resource Resource to be loaded
         * @param {Object} resources Map of resources
         * @param {Function} onSuccess onSuccess callback
         * @param {Function} onError onError callback
         */
        loadSchema: function (resource, resources, successCallback, errorCallback)
        {
            return this._handleLoadJsonResource(resource, successCallback, errorCallback);
        },

        /**
         * Loads JSON options.
         *
         * @param {Object|String} resource Resource to be loaded
         * @param {Object} resources Map of resources
         * @param {Function} onSuccess onSuccess callback
         * @param {Function} onError onError callback
         */
        loadOptions: function (resource, resources, successCallback, errorCallback)
        {
            return this._handleLoadJsonResource(resource, successCallback, errorCallback);
        },

        /**
         * Loads JSON view.
         *
         * @param {Object|String} resource Resource to be loaded
         * @param {Object} resources Map of resources
         * @param {Function} onSuccess onSuccess callback
         * @param {Function} onError onError callback
         */
        loadView: function (resource, resources, successCallback, errorCallback)
        {
            return this._handleLoadJsonResource(resource, successCallback, errorCallback);
        },

        /**
         * Loads schema, form, view and data in a single call.
         *
         * @param {Object} resources resources
         * @param {Function} onSuccess onSuccess callback.
         * @param {Function} onError onError callback.
         */
        loadAll: function (resources, onSuccess, onError)
        {
            var self = this;

            var onConnectSuccess = function() {

                var dataSource = resources.dataSource;
                var schemaSource = resources.schemaSource;
                var optionsSource = resources.optionsSource;
                var viewSource = resources.viewSource;

                // we allow "schema" to contain a URI as well (backwards-compatibility)
                if (!schemaSource && typeof(resources.schema) === "string")
                {
                    schemaSource = resources.schema;
                }

                // we allow "options" to contain a URI as well (backwards-compatibility)
                if (!optionsSource && typeof(resources.options) === "string")
                {
                    optionsSource = resources.options;
                }

                // we allow "view" to contain a URI as well (backwards-compatibility)
                if (!viewSource && typeof(resources.view) === "string")
                {
                    viewSource = resources.view;
                }

                var loaded = {};

                var loadCounter = 0;
                var invocationCount = 0;

                var successCallback = function()
                {
                    if (loadCounter === invocationCount)
                    {
                        if (onSuccess && Alpaca.isFunction(onSuccess))
                        {
                            onSuccess(loaded.data, loaded.options, loaded.schema, loaded.view);
                        }
                    }
                };

                var errorCallback = function (loadError)
                {
                    if (onError && Alpaca.isFunction(onError))
                    {
                        onError(loadError);
                    }
                };

                // count out the total # of invokes we're going to fire off
                if (dataSource)
                {
                    invocationCount++;
                }
                if (schemaSource)
                {
                    invocationCount++;
                }
                if (optionsSource)
                {
                    invocationCount++;
                }
                if (viewSource)
                {
                    invocationCount++;
                }
                if (invocationCount === 0)
                {
                    // nothing to invoke, so just hand back
                    successCallback();
                    return;
                }

                var doMerge = function(p, v1, v2)
                {
                    loaded[p] = v1;

                    if (v2)
                    {
                        if ((typeof(loaded[p]) === "object") && (typeof(v2) === "object"))
                        {
                            Alpaca.mergeObject(loaded[p], v2);
                        }
                        else
                        {
                            loaded[p] = v2;
                        }
                    }
                };

                // fire off all of the invokes
                if (dataSource)
                {
                    self.loadData(dataSource, resources, function(data) {

                        doMerge("data", resources.data, data);

                        loadCounter++;
                        successCallback();
                    }, errorCallback);
                }
                if (schemaSource)
                {
                    self.loadSchema(schemaSource, resources, function(schema) {

                        doMerge("schema", resources.schema, schema);

                        loadCounter++;
                        successCallback();
                    }, errorCallback);
                }
                if (optionsSource)
                {
                    self.loadOptions(optionsSource, resources, function(options) {

                        doMerge("options", resources.options, options);

                        loadCounter++;
                        successCallback();
                    }, errorCallback);
                }
                if (viewSource)
                {
                    self.loadView(viewSource, resources, function(view) {

                        doMerge("view", resources.view, view);

                        loadCounter++;
                        successCallback();
                    }, errorCallback);
                }

            };

            var onConnectError  = function(err) {
                if (onError && Alpaca.isFunction(onError)) {
                    onError(err);
                }
            };

            self.connect(onConnectSuccess, onConnectError);
        },

        /**
         * Loads a JSON through Ajax call.
         *
         * @param {String} uri location of the json document
         * @param {Function} onSuccess onSuccess callback.
         * @param {Function} onError onError callback.
         */
        loadJson : function(uri, onSuccess, onError) {
            this.loadUri(uri, true, onSuccess, onError);
        } ,

        /**
         * Extension point.  Set up default ajax configuration for URL retrieval.
         *
         * @param uri
         * @param isJson
         * @returns {{url: *, type: string}}
         */
        buildAjaxConfig: function(uri, isJson)
        {
            var ajaxConfig = {
                "url": uri,
                "type": "get"
            };

            if (isJson) {
                ajaxConfig.dataType = "json";
            } else {
                ajaxConfig.dataType = "text";
                if (uri && uri.toLowerCase().indexOf(".html") > -1) {
                    ajaxConfig.dataType = "html";
                }
            }

            return ajaxConfig;
        },

        /**
         * Loads a general document through Ajax call.
         *
         * This uses jQuery to perform the Ajax call.  If you need to customize connectivity to your own remote server,
         * this would be the appropriate place to do so.
         *
         * @param {String} uri uri to be loaded
         * @param {Boolean} isJson Whether the document is a JSON or not.
         * @param {Function} onSuccess onSuccess callback.
         * @param {Function} onError onError callback.
         */
        loadUri : function(uri, isJson, onSuccess, onError) {

            var self = this;

            var ajaxConfig = self.buildAjaxConfig(uri, isJson);

            ajaxConfig["success"] = function(jsonDocument) {

                self.cache(uri, jsonDocument);

                if (onSuccess && Alpaca.isFunction(onSuccess)) {
                    onSuccess(jsonDocument);
                }
            };
            ajaxConfig["error"] = function(jqXHR, textStatus, errorThrown) {
                if (onError && Alpaca.isFunction(onError)) {
                    onError({
                        "message":"Unable to load data from uri : " + uri,
                        "stage": "DATA_LOADING_ERROR",
                        "details": {
                            "jqXHR" : jqXHR,
                            "textStatus" : textStatus,
                            "errorThrown" : errorThrown
                        }
                    });
                }
            };

            var cachedDocument = self.cache(uri);

            if (cachedDocument && onSuccess && Alpaca.isFunction(onSuccess)) {
                onSuccess(cachedDocument);
            } else {
                $.ajax(ajaxConfig);
            }
        },

        /**
         * Loads referenced JSON schema.
         *
         * @param {Object|String} resource Resource to be loaded.
         * @param {Function} onSuccess onSuccess callback.
         * @param {Function} onError onError callback.
         */
        loadReferenceSchema: function (resource, successCallback, errorCallback)
        {
            return this._handleLoadJsonResource(resource, successCallback, errorCallback);
        },

        /**
         * Loads referenced JSON options.
         *
         * @param {Object|String} resource Resource to be loaded.
         * @param {Function} onSuccess onSuccess callback.
         * @param {Function} onError onError callback.
         */
        loadReferenceOptions: function (resource, successCallback, errorCallback)
        {
            return this._handleLoadJsonResource(resource, successCallback, errorCallback);
        },

        _handleLoadJsonResource: function (resource, successCallback, errorCallback)
        {
            if (this.isUri(resource))
            {
                this.loadJson(resource, function(loadedResource) {
                    successCallback(loadedResource);
                }, errorCallback);
            }
            else
            {
                successCallback(resource);
            }
        },

        /**
         * Loads data source (value/text) pairs from a remote source.
         * This default implementation allows for config to be a string identifying a URL.
         *
         * @param config
         * @param successCallback
         * @param errorCallback
         * @returns {*}
         */
        loadDataSource: function (config, successCallback, errorCallback)
        {
            return this._handleLoadDataSource(config, successCallback, errorCallback);
        },

        _handleLoadDataSource: function(config, successCallback, errorCallback)
        {
            var url = config;
            if (Alpaca.isObject(url)) {
                url = config.url;
            }

            return this._handleLoadJsonResource(url, successCallback, errorCallback);
        }

    });

    Alpaca.registerConnectorClass("default", Alpaca.Connector);

})(jQuery);

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

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.TextField = Alpaca.ControlField.extend(
    /**
     * @lends Alpaca.Fields.TextField.prototype
     */
    {
        /**
         * @see Alpaca.ControlField#getFieldType
         */
        getFieldType: function()
        {
            return "text";
        },

        /**
         * @see Alpaca.Field#setup
         */
        setup: function()
        {
            this.base();

            /*
            if (!this.options.size) {
                this.options.size = 40;
            }
            */

            // assume html5 input type = "text"
            if (!this.inputType)
            {
                this.inputType = "text";
            }

            if (this.options.inputType)
            {
                this.inputType = this.options.inputType;
            }

            // DOM data-* attributes support
            if (!this.options.data)
            {
                this.options.data = {};
            }

            // DOM * attributes support
            if (!this.options.attributes)
            {
                this.options.attributes = {};
            }

            if (typeof(this.options.allowOptionalEmpty) === "undefined")
            {
                this.options.allowOptionalEmpty = true;
            }

            // DOM "autocomplete"
            if (this.options.autocomplete && typeof(this.options.autocomplete) === "string")
            {
                if (this.options.autocomplete.toLowerCase() === "on")
                {
                    this.options.autocomplete = true;
                }
                else if (this.options.autocomplete.toLowerCase() === "true")
                {
                    this.options.autocomplete = true;
                }
                else if (this.options.autocomplete.toLowerCase() === "yes")
                {
                    this.options.autocomplete = true;
                }
                else
                {
                    this.options.autocomplete = false;
                }
            }

            if (typeof(this.options.autocomplete) === "undefined")
            {
                this.options.autocomplete = false;
            }

            if (typeof(this.options.disallowEmptySpaces) === "undefined")
            {
                this.options.disallowEmptySpaces = false;
            }

            if (typeof(this.options.disallowOnlyEmptySpaces) === "undefined")
            {
                this.options.disallowOnlyEmptySpaces = false;
            }
        },

        /**
         * @see Alpaca.Field#destroy
         */
        destroy: function()
        {
            this.base();

            // clean up typeahead
            if ( this.control && this.control.typeahead && this.options.typeahead)
            {
                $(this.control).typeahead('destroy');
            }
        },

        /**
         * @see Alpaca.ControlField#postRender
         */
        postRender: function(callback) {

            var self = this;

            this.base(function() {

                if (self.control)
                {
                    // autocomplete
                    self.applyAutocomplete();

                    // mask
                    self.applyMask();

                    // typeahead
                    self.applyTypeAhead();

                    // update max length indicator
                    self.updateMaxLengthIndicator();
                }

                callback();
            });
        },

        applyAutocomplete: function()
        {
            var self = this;

            // autocomplete
            if (typeof(self.options.autocomplete) !== "undefined")
            {
                $(self.field).addClass("alpaca-autocomplete");
                $(self.control).attr("autocomplete", (self.options.autocomplete ? "on" : "off"));

                // CALLBACK: "autocomplete"
                self.fireCallback("autocomplete");
            }
        },

        applyMask: function()
        {
            var self = this;

            // mask it
            if (self.control.mask && self.options.maskString)
            {
                self.control.mask(self.options.maskString);
            }
        },

        applyTypeAhead: function()
        {
            var self = this;

            if (self.control.typeahead && self.options.typeahead && !Alpaca.isEmpty(self.options.typeahead))
            {
                var tConfig = self.options.typeahead.config;
                if (!tConfig) {
                    tConfig = {};
                }

                var tDatasets = self.options.typeahead.datasets;
                if (!tDatasets) {
                    tDatasets = {};
                }

                if (!tDatasets.name) {
                    tDatasets.name = self.getId();
                }

                var tEvents = self.options.typeahead.events;
                if (!tEvents) {
                    tEvents = {};
                }

                // support for each datasets (local, remote, prefetch)
                if (!tDatasets.init)
                {
                    if (tDatasets.type === "local" || tDatasets.type === "remote" || tDatasets.type === "prefetch")
                    {
                        var bloodHoundConfig = {
                            datumTokenizer: function(d) {
                                var tokens = "";
                                for (var k in d) {
                                    if (d.hasOwnProperty(k) || d[k]) {
                                        tokens += " " + d[k];
                                    }
                                }
                                return Bloodhound.tokenizers.whitespace(tokens);
                            },
                            queryTokenizer: Bloodhound.tokenizers.whitespace
                        };
    
                        if (tDatasets.type === "local" )
                        {
                            var local = [];
    
                            if (typeof(tDatasets.source) === "function")
                            {
                                bloodHoundConfig.local = tDatasets.source;
                            }
                            else
                            {
                                // array
                                for (var i = 0; i < tDatasets.source.length; i++)
                                {
                                    var localElement = tDatasets.source[i];
                                    if (typeof(localElement) === "string")
                                    {
                                        localElement = {
                                            "value": localElement
                                        };
                                    }
    
                                    local.push(localElement);
                                }
    
                                bloodHoundConfig.local = local;
                            }
    
                            if (tDatasets.local)
                            {
                                bloodHoundConfig.local = tDatasets.local;
                            }
                        }
    
                        if (tDatasets.type === "prefetch")
                        {
                            bloodHoundConfig.prefetch = {
                                url: tDatasets.source
                            };
    
                            if (tDatasets.filter)
                            {
                                bloodHoundConfig.prefetch.filter = tDatasets.filter;
                            }
                        }
    
                        if (tDatasets.type === "remote")
                        {
                            bloodHoundConfig.remote = {
                                url: tDatasets.source
                            };
    
                            if (tDatasets.filter)
                            {
                                bloodHoundConfig.remote.filter = tDatasets.filter;
                            }
    
                            if (tDatasets.replace)
                            {
                                bloodHoundConfig.remote.replace = tDatasets.replace;
                            }
                        }
    
                        // include any additional dataset config params in the Bloodhound config
                        $.each(tDatasets, function( index, value ) {
                            if (index !== 'type' 
                                && index !== 'source' 
                                && index !== 'filter' 
                                && index !== 'replace' 
                                && index !== 'local' 
                                && index !== 'templates')
                            {
                                bloodHoundConfig[index] = value;
                            }
                        });
    
                        var engine = new Bloodhound(bloodHoundConfig);
                        engine.initialize();
                        tDatasets.source = engine.ttAdapter();
                        tDatasets.init = true;
                    }
                }

                // compile templates
                if (tDatasets.templates)
                {
                    for (var k in tDatasets.templates)
                    {
                        var template = tDatasets.templates[k];
                        if (typeof(template) === "string")
                        {
                            tDatasets.templates[k] = Handlebars.compile(template);
                        }
                    }
                }

                // process typeahead
                $(self.control).typeahead(tConfig, tDatasets);

                // listen for "autocompleted" event and set the value of the field
                $(self.control).on("typeahead:autocompleted", function(event, datum) {
                    self.setValue(datum.value);
                    $(self.control).change();
                });

                // listen for "selected" event and set the value of the field
                $(self.control).on("typeahead:selected", function(event, datum) {
                    self.setValue(datum.value);
                    $(self.control).change();
                });

                // custom events
                if (tEvents)
                {
                    if (tEvents.autocompleted) {
                        $(self.control).on("typeahead:autocompleted", function(event, datum) {
                            tEvents.autocompleted(event, datum);
                        });
                    }
                    if (tEvents.selected) {
                        $(self.control).on("typeahead:selected", function(event, datum) {
                            tEvents.selected(event, datum);
                        });
                    }
                }

                // when the input value changes, change the query in typeahead
                // this is to keep the typeahead control sync'd with the actual dom value
                // only do this if the query doesn't already match
                var fi = $(self.control);
                $(self.control).change(function() {

                    var value = $(this).val();

                    var newValue = $(fi).typeahead('val');
                    if (newValue !== value)
                    {
                        $(fi).typeahead('val', newValue);
                    }

                });

                // some UI cleanup (we don't want typeahead to restyle)
                $(self.field).find("span.twitter-typeahead").first().css("display", "block"); // SPAN to behave more like DIV, next line
                $(self.field).find("span.twitter-typeahead input.tt-input").first().css("background-color", "");
            }
        },

        prepareControlModel: function(callback)
        {
            var self = this;

            this.base(function(model) {

                model.inputType = self.inputType;

                callback(model);
            });
        },

        updateMaxLengthIndicator: function()
        {
            var self = this;

            var errState = false;

            var message = "";
            if (!Alpaca.isEmpty(self.schema.maxLength) && self.options.showMaxLengthIndicator)
            {
                var val = self.getValue() || "";

                var diff = self.schema.maxLength - val.length;
                if (diff >= 0)
                {
                    message = "You have " + diff + " characters remaining";
                }
                else
                {
                    message = "Your message is too long by " + (diff*-1) + " characters";
                    errState = true;
                }

                var indicator = $(self.field).find(".alpaca-field-text-max-length-indicator");
                if (indicator.length === 0)
                {
                    indicator = $("<p class='alpaca-field-text-max-length-indicator'></p>");
                    $(self.control).after(indicator);
                }

                $(indicator).html(message);
                $(indicator).removeClass("err");
                if (errState)
                {
                    $(indicator).addClass("err");
                }
            }

        },

        /**
         * @see Alpaca.Fields.ControlField#getControlValue
         */
        getControlValue: function()
        {
            var self = this;

            var value = this._getControlVal(true);

            if (self.control.mask && self.options.maskString)
            {
                // get unmasked value
                var fn = $(this.control).data($.mask.dataName);
                if (fn)
                {
                    value = fn();
                    value = self.ensureProperType(value);
                }
            }

            return value;
        },

        /**
         * @see Alpaca.Field#setValue
         */
        setValue: function(value)
        {
            if (this.control && this.control.length > 0)
            {
                if (Alpaca.isEmpty(value))
                {
                    this.control.val("");
                }
                else
                {
                    this.control.val(value);
                }
            }

            // be sure to call into base method
            this.base(value);

            // if applicable, update the max length indicator
            this.updateMaxLengthIndicator();
        },

        /**
         * @see Alpaca.ControlField#handleValidate
         */
        handleValidate: function()
        {
            var baseStatus = this.base();

            var valInfo = this.validation;

            var status =  this._validatePattern();
            valInfo["invalidPattern"] = {
                "message": status ? "" : Alpaca.substituteTokens(this.getMessage("invalidPattern"), [this.schema.pattern]),
                "status": status
            };

            status = this._validateMaxLength();
            valInfo["stringTooLong"] = {
                "message": status ? "" : Alpaca.substituteTokens(this.getMessage("stringTooLong"), [this.schema.maxLength]),
                "status": status
            };

            status = this._validateMinLength();
            valInfo["stringTooShort"] = {
                "message": status ? "" : Alpaca.substituteTokens(this.getMessage("stringTooShort"), [this.schema.minLength]),
                "status": status
            };

            return baseStatus && valInfo["invalidPattern"]["status"] && valInfo["stringTooLong"]["status"] && valInfo["stringTooShort"]["status"];
        },

        /**
         * Validates against the schema pattern property.
         *
         * @returns {Boolean} True if it matches the pattern, false otherwise.
         */
        _validatePattern: function()
        {
            if (this.schema.pattern)
            {
                var val = this.getValue();

                if (val === "" && this.options.allowOptionalEmpty && !this.isRequired())
                {
                    return true;
                }

                if (Alpaca.isEmpty(val))
                {
                    val = "";
                }

                if (typeof(val) === "string")
                {
                    if (!val.match(this.schema.pattern))
                    {
                        return false;
                    }
                }
            }

            return true;
        },

        /**
         * Validates against the schema minLength property.
         *
         * @returns {Boolean} True if its size is greater than minLength, false otherwise.
         */
        _validateMinLength: function()
        {
            if (!Alpaca.isEmpty(this.schema.minLength))
            {
                var val = this.getValue();
                if(val !== val) {
                    // NaN
                    val = "";
                }
                if (val === "" && this.options.allowOptionalEmpty && !this.isRequired())
                {
                    return true;
                }
                if (Alpaca.isEmpty(val))
                {
                    val = "";
                }
                if ((""+val).length < this.schema.minLength)
                {
                    return false;
                }
            }
            return true;
        },

        /**
         * Validates against the schema maxLength property.
         *
         * @returns {Boolean} True if its size is less than maxLength , false otherwise.
         */
        _validateMaxLength: function()
        {
            if (!Alpaca.isEmpty(this.schema.maxLength))
            {
                var val = this.getValue();
                if (val === "" && this.options.allowOptionalEmpty && !this.isRequired())
                {
                    return true;
                }
                if (Alpaca.isEmpty(val))
                {
                    val = "";
                }
                if ((""+val).length > this.schema.maxLength)
                {
                    return false;
                }
            }
            return true;
        },

        /**
         * @see Alpaca.Field#focus
         */
        focus: function(onFocusCallback)
        {
            if (this.control && this.control.length > 0)
            {
                // focuses the control and also positions the input at the end

                var el = $(this.control).get(0);

                try {
                    var elemLen = el.value ? el.value.length : 0;
                    el.selectionStart = elemLen;
                    el.selectionEnd = elemLen;
                }
                catch (e) {
                    // field type doesn't support selection start and end
                }

                el.focus();

                if (onFocusCallback)
                {
                    onFocusCallback(this);
                }

            }
        },

        /**
         * @see Alpaca.Field#getType
         */
        getType: function() {
            return "string";
        },

        /**
         * @see Alpaca.ControlField#onKeyPress
         */
        onKeyPress: function(e)
        {
            var self = this;

            // ignore tab and arrow keys
            if (e.keyCode === 9 || e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40 ) {
                return;
            }

            if (e.keyCode === 8) // backspace
            {
                if (!Alpaca.isEmpty(self.schema.minLength) && (self.options.constrainLengths || self.options.constrainMinLength))
                {
                    var newValue = self.getValue() || "";
                    if (newValue.length <= self.schema.minLength)
                    {
                        // kill event
                        e.preventDefault();
                        e.stopImmediatePropagation();
                    }
                }
            }
            else
            {
                if (!Alpaca.isEmpty(self.schema.maxLength) && (self.options.constrainLengths || self.options.constrainMaxLength))
                {
                    var newValue = self.getValue() || "";
                    if (newValue.length >= self.schema.maxLength)
                    {
                        // kill event
                        e.preventDefault();
                        e.stopImmediatePropagation();
                    }
                }
            }

            if (e.keyCode === 32) // space
            {
                if (self.options.disallowEmptySpaces)
                {
                    // kill event
                    e.preventDefault();
                    e.stopImmediatePropagation();
                }
            }
        },

        onKeyUp: function(e)
        {
            var self = this;

            // if applicable, update the max length indicator
            self.updateMaxLengthIndicator();

            // trigger "fieldkeyup"
            $(this.field).trigger("fieldkeyup");
        }



        /* builder_helpers */
        ,

        /**
         * @see Alpaca.Field#getTitle
         */
        getTitle: function() {
            return "Single-Line Text";
        },

        /**
         * @see Alpaca.Field#getDescription
         */
        getDescription: function() {
            return "Text field for single-line text.";
        },

        /**
         * @private
         * @see Alpaca.ControlField#getSchemaOfSchema
         */
        getSchemaOfSchema: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "minLength": {
                        "title": "Minimal Length",
                        "description": "Minimal length of the property value.",
                        "type": "number"
                    },
                    "maxLength": {
                        "title": "Maximum Length",
                        "description": "Maximum length of the property value.",
                        "type": "number"
                    },
                    "pattern": {
                        "title": "Pattern",
                        "description": "Regular expression for the property value.",
                        "type": "string"
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.ControlField#getOptionsForSchema
         */
        getOptionsForSchema: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "default": {
                        "helper": "Field default value",
                        "type": "text"
                    },
                    "minLength": {
                        "type": "integer"
                    },
                    "maxLength": {
                        "type": "integer"
                    },
                    "pattern": {
                        "type": "text"
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.ControlField#getSchemaOfOptions
         */
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "size": {
                        "title": "Field Size",
                        "description": "Field size.",
                        "type": "number",
                        "default":40
                    },
                    "maskString": {
                        "title": "Mask Expression",
                        "description": "Expression for the field mask. Field masking will be enabled if not empty.",
                        "type": "string"
                    },
                    "placeholder": {
                        "title": "Field Placeholder",
                        "description": "Field placeholder.",
                        "type": "string"
                    },
                    "typeahead": {
                        "title": "Type Ahead",
                        "description": "Provides configuration for the $.typeahead plugin if it is available.  For full configuration options, see: https://github.com/twitter/typeahead.js"
                    },
                    "allowOptionalEmpty": {
                        "title": "Allow Optional Empty",
                        "description": "Allows this non-required field to validate when the value is empty"
                    },
                    "inputType": {
                        "title": "HTML5 Input Type",
                        "description": "Allows for the override of the underlying HTML5 input type.  If not specified, an assumed value is provided based on the kind of input control (i.e. 'text', 'date', 'email' and so forth)",
                        "type": "string"
                    },
                    "data": {
                        "title": "Data attributes for the underlying DOM input control",
                        "description": "Allows you to specify a key/value map of data attributes that will be added as DOM attribuets for the underlying input control.  The data attributes will be added as data-{name}='{value}'.",
                        "type": "object"
                    },
                    "autocomplete": {
                        "title": "HTML autocomplete attribute for the underlying DOM input control",
                        "description": "Allows you to specify the autocomplete attribute for the underlying input control whether or not field should have autocomplete enabled.",
                        "type": "string"
                    },
                    "disallowEmptySpaces": {
                        "title": "Disallow Empty Spaces",
                        "description": "Whether to disallow the entry of empty spaces in the text",
                        "type": "boolean",
                        "default": false
                    },
                    "disallowOnlyEmptySpaces": {
                        "title": "Disallow Only Empty Spaces",
                        "description": "Whether to disallow the entry of only empty spaces in the text",
                        "type": "boolean",
                        "default": false
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.ControlField#getOptionsForOptions
         */
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "size": {
                        "type": "integer"
                    },
                    "maskString": {
                        "helper": "a - an alpha character;9 - a numeric character;* - an alphanumeric character",
                        "type": "text"
                    },
                    "typeahead": {
                        "type": "object"
                    },
                    "allowOptionalEmpty": {
                        "type": "checkbox"
                    },
                    "inputType": {
                        "type": "text"
                    },
                    "data": {
                        "type": "object"
                    }
                }
            });
        }

        /* end_builder_helpers */

    });

    Alpaca.registerMessages({
        "invalidPattern": "This field should have pattern {0}",
        "stringTooShort": "This field should contain at least {0} numbers or characters",
        "stringTooLong": "This field should contain at most {0} numbers or characters"
    });
    Alpaca.registerFieldClass("text", Alpaca.Fields.TextField);
    Alpaca.registerDefaultSchemaFieldMapping("string", "text");

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.TextAreaField = Alpaca.Fields.TextField.extend(
    /**
     * @lends Alpaca.Fields.TextAreaField.prototype
     */
    {
        /**
         * @see Alpaca.Fields.TextField#getFieldType
         */
        getFieldType: function()
        {
            return "textarea";
        },

        /**
         * @see Alpaca.Fields.TextField#setup
         */
        setup: function()
        {
            this.base();

            if (!this.options.rows) {
                this.options.rows = 5;
            }

            if (!this.options.cols) {
                this.options.cols = 40;
            }
        },

        /**
         * @see Alpaca.ControlField#handleValidate
         */
        handleValidate: function()
        {
            var baseStatus = this.base();

            var valInfo = this.validation;

            var status =  this._validateWordCount();
            valInfo["wordLimitExceeded"] = {
                "message": status ? "" : Alpaca.substituteTokens(this.getMessage("wordLimitExceeded"), [this.options.wordlimit]),
                "status": status
            };

            return baseStatus && valInfo["wordLimitExceeded"]["status"];
        },

        /**
         * Validate for word limit.
         *
         * @returns {Boolean} True if the number of words is equal to or less than the word limit.
         */
        _validateWordCount: function()
        {
            if (this.options.wordlimit && this.options.wordlimit > -1)
            {
                var val = this.data;

                if (val)
                {
                    var wordcount = val.split(" ").length;
                    if (wordcount > this.options.wordlimit)
                    {
                        return false;
                    }
                }
            }

            return true;
        }

        /* builder_helpers */
        ,

        /**
         * @see Alpaca.Fields.TextField#getTitle
         */
        getTitle: function() {
            return "Multi-Line Text";
        },

        /**
         * @see Alpaca.Fields.TextField#getDescription
         */
        getDescription: function() {
            return "Textarea field for multiple line text.";
        },

        /**
         * @private
         * @see Alpaca.Fields.TextField#getSchemaOfOptions
         */
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "rows": {
                        "title": "Rows",
                        "description": "Number of rows",
                        "type": "number",
                        "default": 5
                    },
                    "cols": {
                        "title": "Columns",
                        "description": "Number of columns",
                        "type": "number",
                        "default": 40
                    },
                    "wordlimit": {
                        "title": "Word Limit",
                        "description": "Limits the number of words allowed in the text area.",
                        "type": "number",
                        "default": -1
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.Fields.TextField#getOptionsForOptions
         */
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "rows": {
                        "type": "integer"
                    },
                    "cols": {
                        "type": "integer"
                    },
                    "wordlimit": {
                        "type": "integer"
                    }
                }
            });
        }

        /* end_builder_helpers */

    });

    Alpaca.registerMessages({
        "wordLimitExceeded": "The maximum word limit of {0} has been exceeded."
    });

    Alpaca.registerFieldClass("textarea", Alpaca.Fields.TextAreaField);

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.FileField = Alpaca.Fields.TextField.extend(
    /**
     * @lends Alpaca.Fields.FileField.prototype
     */
    {
        /**
         * @see Alpaca.ControlField#getFieldType
         */
        getFieldType: function()
        {
            return "file";
        },

        /**
         * @see Alpaca.Fields.TextField#setValue
         */
        setValue: function(value)
        {
            this.data = value;

            this.updateObservable();

            this.triggerUpdate();
        },

        /**
         * @see Alpaca.Fields.ControlField#getControlValue
         */
        getControlValue: function()
        {
            return this.data;
        },

        onChange: function(e)
        {
            this.base(e);

            if (this.options.selectionHandler)
            {
                this.processSelectionHandler(e.target.files);
            }
        },

        processSelectionHandler: function(files)
        {
            if (files && files.length > 0)
            {
                // if the browser supports HTML5 FileReader, we can pull in the stream for preview
                if (typeof(FileReader) !== "undefined")
                {
                    // clear out previous loaded data
                    var loadedData = [];
                    var loadCount = 0;

                    var fileReader = new FileReader();
                    fileReader.onload = (function() {
                        var field = this;
                        return function(event)
                        {
                            var dataUri = event.target.result;

                            loadedData.push(dataUri);
                            loadCount++;

                            if (loadCount === files.length)
                            {
                                field.options.selectionHandler.call(field, files, loadedData);
                            }
                        };
                    }).call(this);

                    for (var i = 0; i < files.length; i++)
                    {
                        fileReader.readAsDataURL(files[i]);
                    }
                }
            }
        }

        /* builder_helpers */
        ,

        /**
         * @see Alpaca.Fields.TextField#getTitle
         */
        getTitle: function() {
            return "File Field";
        },

        /**
         * @see Alpaca.Fields.TextField#getDescription
         */
        getDescription: function() {
            return "Field for uploading files.";
        },

        /**
         * @private
         * @see Alpaca.ControlField#getSchemaOfOptions
         */
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "selectionHandler": {
                        "title": "Selection Handler",
                        "description": "Function that should be called when files are selected.  Requires HTML5.",
                        "type": "boolean",
                        "default": false
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.ControlField#getOptionsForOptions
         */
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "selectionHandler": {
                        "type": "checkbox"
                    }
                }
            });
        }

        /* end_builder_helpers */
    });

    Alpaca.registerFieldClass("file", Alpaca.Fields.FileField);

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.NumberField = Alpaca.Fields.TextField.extend(
    /**
     * @lends Alpaca.Fields.NumberField.prototype
     */
    {
        /**
         * @see Alpaca.Fields.TextField#setup
         */
        setup: function()
        {
            // default html5 input type = "number";
            //this.inputType = "number";
            // TODO: we can't do this because Chrome screws up it's handling of number type
            // and prevents us from validating properly
            // @see http://stackoverflow.com/questions/16420828/jquery-val-refuses-to-return-non-numeric-input-from-a-number-field-under-chrome

            this.base();

            if (typeof(this.options.numericEntry) === "undefined")
            {
                this.options.numericEntry = false;
            }

        },

        /**
         * @see Alpaca.Fields.TextField#getFieldType
         */
        getFieldType: function() {
            return "number";
        },

        /**
         * @see Alpaca.ControlField#postRender
         */
        postRender: function(callback) {

            var self = this;

            this.base(function() {

                if (self.control)
                {
                    self.on("keypress", function(e) {

                        var key = e.charCode || e.keyCode || 0;

                        var valid = true;

                        if (self.options.numericEntry) {
                            valid = valid && (key >= 48 && key <= 57);
                        }

                        if(!valid) {
                            // don't even allow entry of invalid characters
                            e.preventDefault();
                            e.stopImmediatePropagation();
                        }

                        return valid;
                    });
                }

                callback();
            });
        },

        /**
         * @see Alpaca.Fields.ControlField#getControlValue
         */
        getControlValue: function()
        {
            var val = this._getControlVal(true);

            if (typeof(val) == "undefined" || "" == val)
            {
                return val;
            }

            return parseFloat(val);
        },

        /**
         * @see Alpaca.Fields.TextField#handleValidate
         */
        handleValidate: function() {
            var baseStatus = this.base();

            var valInfo = this.validation;

            var status = this._validateNumber();
            valInfo["stringNotANumber"] = {
                "message": status ? "" : this.getMessage("stringNotANumber"),
                "status": status
            };

            status = this._validateDivisibleBy();
            valInfo["stringDivisibleBy"] = {
                "message": status ? "" : Alpaca.substituteTokens(this.getMessage("stringDivisibleBy"), [this.schema.divisibleBy]),
                "status": status
            };

            status = this._validateMaximum();
            valInfo["stringValueTooLarge"] = {
                "message": "",
                "status": status
            };
            if (!status) {
                if (this.schema.exclusiveMaximum) {
                    valInfo["stringValueTooLarge"]["message"] = Alpaca.substituteTokens(this.getMessage("stringValueTooLargeExclusive"), [this.schema.maximum]);
                } else {
                    valInfo["stringValueTooLarge"]["message"] = Alpaca.substituteTokens(this.getMessage("stringValueTooLarge"), [this.schema.maximum]);
                }
            }

            status = this._validateMinimum();
            valInfo["stringValueTooSmall"] = {
                "message": "",
                "status": status
            };
            if (!status) {
                if (this.schema.exclusiveMinimum) {
                    valInfo["stringValueTooSmall"]["message"] = Alpaca.substituteTokens(this.getMessage("stringValueTooSmallExclusive"), [this.schema.minimum]);
                } else {
                    valInfo["stringValueTooSmall"]["message"] = Alpaca.substituteTokens(this.getMessage("stringValueTooSmall"), [this.schema.minimum]);
                }
            }

            status = this._validateMultipleOf();
            valInfo["stringValueNotMultipleOf"] = {
                "message": "",
                "status": status
            };
            if (!status)
            {
                valInfo["stringValueNotMultipleOf"]["message"] = Alpaca.substituteTokens(this.getMessage("stringValueNotMultipleOf"), [this.schema.multipleOf]);
            }

            // hand back a true/false
            return baseStatus && valInfo["stringNotANumber"]["status"] && valInfo["stringDivisibleBy"]["status"] && valInfo["stringValueTooLarge"]["status"] && valInfo["stringValueTooSmall"]["status"] && valInfo["stringValueNotMultipleOf"]["status"] && valInfo["invalidPattern"]["status"] && valInfo["stringTooLong"]["status"] && valInfo["stringTooShort"]["status"];
        },

        /**
         * Validates against required property.
         *
         * @returns {Boolean} False if this field value is empty but required, true otherwise.
         */
        _validateOptional: function() {

            if (!this.isDisplayOnly())
            {
                if (this.isRequired() && Alpaca.isValEmpty($(this.control).val()))
                {
                    return false;
                }
            }

            return true;
        },

        /**
         * Validates if it is a float number.
         * @returns {Boolean} true if it is a float number
         */
        _validateNumber: function() {

            // get value as text
            var textValue = this._getControlVal();
            if (typeof(textValue) === "number")
            {
                textValue = "" + textValue;
            }

            // allow empty
            if (Alpaca.isValEmpty(textValue)) {
                return true;
            }

            // check if valid number format
            var validNumber = Alpaca.testRegex(Alpaca.regexps.number, textValue);
            if (!validNumber)
            {
                return false;
            }

            // quick check to see if what they entered was a number
            var floatValue = this.getValue();
            if (isNaN(floatValue)) {
                return false;
            }

            return true;
        },

        /**
         * Validates divisibleBy constraint.
         * @returns {Boolean} true if it passes the divisibleBy constraint.
         */
        _validateDivisibleBy: function() {
            var floatValue = this.getValue();
            if (!Alpaca.isEmpty(this.schema.divisibleBy)) {

                // mod
                if (floatValue % this.schema.divisibleBy !== 0)
                {
                    return false;
                }
            }
            return true;
        },

        /**
         * Validates maximum constraint.
         * @returns {Boolean} true if it passes the maximum constraint.
         */
        _validateMaximum: function() {
            var floatValue = this.getValue();

            if (!Alpaca.isEmpty(this.schema.maximum)) {
                if (floatValue > this.schema.maximum) {
                    return false;
                }

                if (!Alpaca.isEmpty(this.schema.exclusiveMaximum)) {
                    if (floatValue == this.schema.maximum && this.schema.exclusiveMaximum) { // jshint ignore:line
                        return false;
                    }
                }
            }

            return true;
        },

        /**
         * Validates maximum constraint.
         * @returns {Boolean} true if it passes the minimum constraint.
         */
        _validateMinimum: function() {
            var floatValue = this.getValue();

            if (!Alpaca.isEmpty(this.schema.minimum)) {
                if (floatValue < this.schema.minimum) {
                    return false;
                }

                if (!Alpaca.isEmpty(this.schema.exclusiveMinimum)) {
                    if (floatValue == this.schema.minimum && this.schema.exclusiveMinimum) { // jshint ignore:line
                        return false;
                    }
                }
            }

            return true;
        },

        /**
         * Validates multipleOf constraint.
         * @returns {Boolean} true if it passes the multipleOf constraint.
         */
        _validateMultipleOf: function() {
            var floatValue = this.getValue();

            if (!Alpaca.isEmpty(this.schema.multipleOf)) {
                if (floatValue && this.schema.multipleOf > 0)
                {
                    return (floatValue % this.schema.multipleOf) === 0;
                }
            }

            return true;
        },

        /**
         * @see Alpaca.Fields.TextField#getType
         */
        getType: function() {
            return "number";
        },

        /**
         * @see Alpaca.ControlField#onKeyPress
         */
        onKeyPress: function(e)
        {
            var self = this;

            // ignore tab and arrow keys
            if (e.keyCode === 9 || e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40 ) {
                return;
            }

            if (e.keyCode === 8) // backspace
            {
                if (!Alpaca.isEmpty(self.schema.minLength) && (self.options.constrainLengths || self.options.constrainMinLength))
                {
                    var newValue = self.getValue() || "";
                    if(Alpaca.isNumber(newValue)) {
                        newValue = newValue.toString();
                    }
                    if (newValue.length <= self.schema.minLength)
                    {
                        // kill event
                        e.preventDefault();
                        e.stopImmediatePropagation();
                    }
                }
            }
            else
            {
                if (!Alpaca.isEmpty(self.schema.maxLength) && (self.options.constrainLengths || self.options.constrainMaxLength))
                {
                    var newValue = self.getValue() || "";
                    if(Alpaca.isNumber(newValue)) {
                        newValue = newValue.toString();
                    }
                    if (newValue.length >= self.schema.maxLength)
                    {
                        // kill event
                        e.preventDefault();
                        e.stopImmediatePropagation();
                    }
                }
            }

            if (e.keyCode === 32) // space
            {
                if (self.options.disallowEmptySpaces)
                {
                    // kill event
                    e.preventDefault();
                    e.stopImmediatePropagation();
                }
            }
        },

        onKeyUp: function(e)
        {
            var self = this;

            // if applicable, update the max length indicator
            self.updateMaxLengthIndicator();

            // trigger "fieldkeyup"
            $(this.field).trigger("fieldkeyup");
        },

        /* builder_helpers */

        /**
         * @private
         * @see Alpaca.Fields.TextField#getSchemaOfSchema
         */
        getSchemaOfSchema: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "multipleOf": {
                        "title": "Multiple Of",
                        "description": "Property value must be a multiple of the multipleOf schema property such that division by this value yields an interger (mod zero).",
                        "type": "number"
                    },
                    "minimum": {
                        "title": "Minimum",
                        "description": "Minimum value of the property.",
                        "type": "number"
                    },
                    "maximum": {
                        "title": "Maximum",
                        "description": "Maximum value of the property.",
                        "type": "number"
                    },
                    "exclusiveMinimum": {
                        "title": "Exclusive Minimum",
                        "description": "Property value can not equal the number defined by the minimum schema property.",
                        "type": "boolean",
                        "default": false
                    },
                    "exclusiveMaximum": {
                        "title": "Exclusive Maximum",
                        "description": "Property value can not equal the number defined by the maximum schema property.",
                        "type": "boolean",
                        "default": false
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.Fields.TextField#getOptionsSchema
         */
        getOptionsForSchema: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "multipleOf": {
                        "title": "Multiple Of",
                        "description": "The value must be a integral multiple of the property",
                        "type": "number"
                    },
                    "minimum": {
                        "title": "Minimum",
                        "description": "Minimum value of the property",
                        "type": "number"
                    },
                    "maximum": {
                        "title": "Maximum",
                        "description": "Maximum value of the property",
                        "type": "number"
                    },
                    "exclusiveMinimum": {
                        "rightLabel": "Exclusive minimum ?",
                        "helper": "Field value must be greater than but not equal to this number if checked",
                        "type": "checkbox"
                    },
                    "exclusiveMaximum": {
                        "rightLabel": "Exclusive Maximum ?",
                        "helper": "Field value must be less than but not equal to this number if checked",
                        "type": "checkbox"
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.Fields.NumberField#getSchemaOfOptions
         */
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "numericEntry": {
                        "title": "Numeric Entry",
                        "description": "Whether to constrain data entry key presses to numeric values (0-9)",
                        "type": "boolean",
                        "default": false
                    }
                }
            });
        },

        /**
         * @see Alpaca.Fields.TextField#getTitle
         */
        getTitle: function() {
            return "Number Field";
        },

        /**
         * @see Alpaca.Fields.TextField#getDescription
         */
        getDescription: function() {
            return "Field for float numbers.";
        }

        /* end_builder_helpers */
    });

    // Additional Registrations
    Alpaca.registerMessages({
        "stringValueTooSmall": "The minimum value for this field is {0}",
        "stringValueTooLarge": "The maximum value for this field is {0}",
        "stringValueTooSmallExclusive": "Value of this field must be greater than {0}",
        "stringValueTooLargeExclusive": "Value of this field must be less than {0}",
        "stringDivisibleBy": "The value must be divisible by {0}",
        "stringNotANumber": "This value is not a number.",
        "stringValueNotMultipleOf": "This value is not a multiple of {0}"
    });
    Alpaca.registerFieldClass("number", Alpaca.Fields.NumberField);
    Alpaca.registerDefaultSchemaFieldMapping("number", "number");

})(jQuery);

/*jshint -W083 */ // inline functions are used safely
(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.ArrayField = Alpaca.ContainerField.extend(
    /**
     * @lends Alpaca.Fields.ArrayField.prototype
     */
    {
        /**
         * @see Alpaca.Field#getFieldType
         */
        getFieldType: function() {
            return "array";
        },

        /**
         * @see Alpaca.ContainerField#setup
         */
        setup: function()
        {
            var self = this;

            this.base();

            var containerItemTemplateType = self.resolveContainerItemTemplateType();
            if (!containerItemTemplateType)
            {
                return Alpaca.throwErrorWithCallback("Unable to find template descriptor for container item: " + self.getFieldType());
            }

            this.containerItemTemplateDescriptor = self.view.getTemplateDescriptor("container-" + containerItemTemplateType + "-item", self);

            if (!this.options.toolbarStyle) {
                this.options.toolbarStyle = Alpaca.isEmpty(this.view.toolbarStyle) ? "button" : this.view.toolbarStyle;
            }
            if (!this.options.toolbarStyle) {
                this.options.toolbarStyle = "button";
            }

            if (!this.options.actionbarStyle) {
                this.options.actionbarStyle = Alpaca.isEmpty(this.view.actionbarStyle) ? "top" : this.view.actionbarStyle;
            }
            if (!this.options.actionbarStyle) {
                this.options.actionbarStyle = "top";
            }

            if (!this.options.toolbarPosition) {
                this.options.toolbarPosition = Alpaca.isEmpty(this.view.toolbarPosition) ? "top" : this.view.toolbarPosition;
            }
            if (!this.options.toolbarPosition) {
                this.options.toolbarPosition = "top";
            }

            if (!this.schema.items)
            {
                this.schema.items = {};
            }

            if (!this.options.items)
            {
                this.options.items = {};
            }

            // offer some backward compability here as older version of Alpaca used to incorrectly look for
            // maxItems, minItems and uniqueItems on the schema.items subobject.
            // if not defined properly, we offer some automatic forward migration of these properties
            if (this.schema.items && this.schema.items.maxItems && typeof(this.schema.maxItems) === "undefined") {
                this.schema.maxItems = this.schema.items.maxItems;
                delete this.schema.items.maxItems;
            }
            if (this.schema.items && this.schema.items.minItems && typeof(this.schema.minItems) === "undefined") {
                this.schema.minItems = this.schema.items.minItems;
                delete this.schema.items.minItems;
            }
            if (this.schema.items && this.schema.items.uniqueItems && typeof(this.schema.uniqueItems) === "undefined") {
                this.schema.uniqueItems = this.schema.items.uniqueItems;
                delete this.schema.items.uniqueItems;
            }

            // determine whether we are using "ruby on rails" compatibility mode
            this.options.rubyrails = false;
            if (this.parent && this.parent.options && this.parent.options.form && this.parent.options.form.attributes)
            {
                if (!Alpaca.isEmpty(this.parent.options.form.attributes.rubyrails))
                {
                    this.options.rubyrails = true;
                }
            }

            var toolbarSticky = Alpaca.defaultToolbarSticky;

            if (!Alpaca.isEmpty(this.view.toolbarSticky))
            {
                toolbarSticky = this.view.toolbarSticky;
            }

            if (!Alpaca.isEmpty(this.options.toolbarSticky))
            {
                toolbarSticky = this.options.toolbarSticky;
            }

            this.options.toolbarSticky = toolbarSticky;

            // by default, hide toolbar when children.count > 0
            if (typeof(self.options.hideToolbarWithChildren) === "undefined")
            {
                self.options.hideToolbarWithChildren = true;
            }

            // Enable forceRevalidation option so that any change in children will trigger parent's revalidation.
            if (this.schema.items && this.schema.uniqueItems)
            {
                Alpaca.mergeObject(this.options, {
                    "forceRevalidation" : true
                });
            }

            if (Alpaca.isEmpty(this.data) || this.data === "")
            {
                this.data = [];
            }

            if (Alpaca.isString(this.data))
            {
                // assume to be a serialized array or object, convert
                try
                {
                    var parsedJSON = Alpaca.parseJSON(this.data);

                    if (!Alpaca.isArray(parsedJSON) && !Alpaca.isObject(parsedJSON))
                    {
                        Alpaca.logWarn("ArrayField parsed string data but it was not an array: " + this.data);
                        return;
                    }

                    this.data = parsedJSON;
                }
                catch (e)
                {
                    // assume just a string value, put into array
                    this.data = [this.data];
                }
            }

            if (!Alpaca.isArray(this.data) && !Alpaca.isObject(this.data))
            {
                return Alpaca.logWarn("ArrayField data is not an array: " + JSON.stringify(this.data, null, "  "));
            }

            //
            // ACTIONS
            //
            var applyAction = function(actions, key, actionConfig) {
                var action = self.findAction(actions, key);
                if (!action) {
                    action = {
                        "core": true
                    };
                    actions.push(action);
                }
                for (var k in actionConfig) {
                    if (!action[k]) {
                        action[k] = actionConfig[k];
                    }
                }
            };
            var cleanupActions = function(actions, showLabels) {
                var i = 0;
                do {

                    // assume enabled by default
                    if (typeof(actions[i].enabled) === "undefined") {
                        actions[i].enabled = true;
                    }

                    // hide label if global disable
                    if (!showLabels) {
                        delete actions[i].label;
                    }

                    if (!actions[i].enabled) {
                        actions.splice(i, 1);
                    } else {
                        i++;
                    }

                } while (i < actions.length);

                // sort so that core actions appear first
                actions.sort(function(a, b) {
                    if (a.core && !b.core) {
                        return -1;
                    }
                    if (!a.core && b.core) {
                        return 1;
                    }
                    return 0;
                });
            };

            // set up default actions for the top array toolbar
            self.toolbar = {};
            if (self.options.toolbar)
            {
                for (var k in self.options.toolbar) {
                    self.toolbar[k] = Alpaca.copyOf(self.options.toolbar[k]);
                }
            }
            if (typeof(self.toolbar.showLabels) === "undefined") {
                self.toolbar.showLabels = true;
            }
            if (!self.toolbar.actions) {
                self.toolbar.actions = [];
            }
            applyAction(self.toolbar.actions, "add", {
                "label": self.getMessage("addItemButtonLabel"),
                "action": "add",
                "iconClass": self.view.getStyle("addIcon"),
                "click": function(key, action) {

                    self.handleToolBarAddItemClick(function(item) {
                        // done
                    });
                }
            });
            cleanupActions(self.toolbar.actions, self.toolbar.showLabels);

            // determine which actions to add into the per-item actionbar
            self.actionbar = {};
            if (self.options.actionbar)
            {
                for (var k2 in self.options.actionbar) {
                    self.actionbar[k2] = Alpaca.copyOf(self.options.actionbar[k2]);
                }
            }
            if (typeof(self.actionbar.showLabels) === "undefined") {
                self.actionbar.showLabels = false;
            }
            if (!self.actionbar.actions) {
                self.actionbar.actions = [];
            }
            applyAction(self.actionbar.actions, "add", {
                "label": self.getMessage("addButtonLabel"),
                "action": "add",
                "iconClass": self.view.getStyle("addIcon"),
                "click": function(key, action, itemIndex) {

                    self.handleActionBarAddItemClick(itemIndex, function(item) {
                        // done
                    });
                }
            });
            applyAction(self.actionbar.actions, "remove", {
                "label": self.getMessage("removeButtonLabel"),
                "action": "remove",
                "iconClass": self.view.getStyle("removeIcon"),
                "click": function(key, action, itemIndex) {

                    self.handleActionBarRemoveItemClick(itemIndex, function(item) {
                        // done
                    });
                }
            });
            applyAction(self.actionbar.actions, "up", {
                "label": self.getMessage("upButtonLabel"),
                "action": "up",
                "iconClass": self.view.getStyle("upIcon"),
                "click": function(key, action, itemIndex) {

                    self.handleActionBarMoveItemUpClick(itemIndex, function() {
                        // done
                    });
                }
            });
            applyAction(self.actionbar.actions, "down", {
                "label": self.getMessage("downButtonLabel"),
                "action": "down",
                "iconClass": self.view.getStyle("downIcon"),
                "click": function(key, action, itemIndex) {

                    self.handleActionBarMoveItemDownClick(itemIndex, function() {
                        // done
                    });
                }
            });
            cleanupActions(self.actionbar.actions, self.actionbar.showLabels);

            var len = this.data.length;
            var data = $.extend(true, {}, this.data);
            data.length = len;

            this.data = Array.prototype.slice.call(data);
        },

        /**
         * Picks apart the array and set onto child fields.
         * @see Alpaca.ContainerField#setup
         */
        setValue: function(data)
        {
            var self = this;
            
            if (!data) {
                data = [];
            }

            if (!Alpaca.isArray(data))
            {
                return;
            }

            // set fields
            var i = 0;
            do
            {
                if (i < self.children.length)
                {
                    var childField = self.children[i];

                    if (data.length > i)
                    {
                        childField.setValue(data[i]);
                        i++;
                    }
                    else
                    {
                        self.removeItem(i, null, true);
                    }
                }
            }
            while (i < self.children.length);

            // if the number of items in the data is greater than the number of existing child elements
            // then we need to add the new fields
            if (i < data.length)
            {
                self.resolveItemSchemaOptions(function(itemSchema, itemOptions, circular) {

                    if (!itemSchema)
                    {
                        Alpaca.logDebug("Unable to resolve schema for item: " + i);
                    }

                    // we only allow addition if the resolved schema isn't circularly referenced
                    // or the schema is optional
                    if (circular)
                    {
                        return Alpaca.throwErrorWithCallback("Circular reference detected for schema: " + JSON.stringify(itemSchema), self.errorCallback);
                    }

                    // waterfall functions
                    var funcs = [];

                    while (i < data.length)
                    {
                        var f = (function(i, data)
                        {
                            return function(_done)
                            {
                                self.addItem(i, itemSchema, itemOptions, data[i], function() {
                                    _done();
                                });
                            };
                        })(i, data);

                        funcs.push(f);

                        i++;
                    }

                    Alpaca.parallel(funcs, function() {
                        // nothing
                    });
                });
            }

        },

        /**
         * @see Alpaca.ContainerField#getContainerValue
         */
        getContainerValue: function()
        {
            // if we're empty and we're also not required, then we hand back empty set
            if (this.children.length === 0 && !this.isRequired())
            {
                return [];
            }

            // otherwise, construct an array and hand it back
            var o = [];
            for (var i = 0; i < this.children.length; i++)
            {
                var v = this.children[i].getValue();

                if(v !== v) {
                    // NaN
                    v = undefined;
                }

                if (typeof(v) !== "undefined")
                {
                    o.push(v);
                }
            }
            return o;
        },

        /**
         * @override
         *
         * Creates sub-items for this object.
         *
         * @param callback
         */
        createItems: function(callback)
        {
            var self = this;

            var items = [];

            if (self.data && self.data.length > 0)
            {
                var totalItemCount = self.data.length;
                var itemsByIndex = {};

                // all items within the array have the same schema and options
                // so we only need to load this once
                self.resolveItemSchemaOptions(function(itemSchema, itemOptions, circular) {

                    // we only allow addition if the resolved schema isn't circularly referenced
                    // or the schema is optional
                    if (circular)
                    {
                        return Alpaca.throwErrorWithCallback("Circular reference detected for schema: " + JSON.stringify(itemSchema), self.errorCallback);
                    }

                    // waterfall functions
                    var funcs = [];
                    for (var index = 0; index < self.data.length; index++)
                    {
                        var value = self.data[index];

                        var pf = (function(index, value)
                        {
                            return function(_done)
                            {
                                self.createItem(index, itemSchema, itemOptions, value, function(item) {

                                    itemsByIndex[index] = item;

                                    _done();
                                });
                            };

                        })(index, value);

                        funcs.push(pf);
                    }

                    Alpaca.parallel(funcs, function(err) {

                        // restore intended order
                        for (var i = 0; i < totalItemCount; i++)
                        {
                            var item = itemsByIndex[i];
                            if (item) {
                                items.push(item);
                            }
                        }

                        callback(items);
                    });

                });
            }
            else
            {
                callback(items);
            }
        },

        /**
         * Workhorse method for createItem.
         *
         * @param index
         * @param itemSchema
         * @param itemOptions
         * @param itemData
         * @param postRenderCallback
         * @return {*}
         * @private
         */
        createItem: function(index, itemSchema, itemOptions, itemData, postRenderCallback)
        {
            var self = this;

            if (self._validateEqualMaxItems())
            {
                var formEl = $("<div></div>");
                formEl.alpaca({
                    "data" : itemData,
                    "options": itemOptions,
                    "schema" : itemSchema,
                    "view" : this.view.id ? this.view.id : this.view,
                    "connector": this.connector,
                    "error": function(err)
                    {
                        self.destroy();

                        self.errorCallback.call(self, err);
                    },
                    "notTopLevel":true,
                    "render": function(fieldControl, cb) {
                        // render
                        fieldControl.parent = self;
                        // setup item path
                        fieldControl.path = self.path + "[" + index + "]";
                        //fieldControl.nameCalculated = true;
                        fieldControl.render(null, function() {
                            if (cb) {
                                cb();
                            }
                        });
                    },
                    "postRender": function(control)
                    {
                        // alpaca finished

                        // render the outer container
                        var containerItemEl = Alpaca.tmpl(self.containerItemTemplateDescriptor, {
                            "id": self.getId(),
                            "name": control.name,
                            "parentFieldId": self.getId(),
                            "actionbarStyle": self.options.actionbarStyle,
							"toolbarLocation": self.options.toolbarLocation,
                            "view": self.view,
                            "data": itemData
                        });

                        // find the insertion point
                        var insertionPointEl = $(containerItemEl).find("." + Alpaca.MARKER_CLASS_CONTAINER_FIELD_ITEM_FIELD);
                        if (insertionPointEl.length === 0)
                        {
                            if ($(containerItemEl).hasClass(Alpaca.MARKER_CLASS_CONTAINER_FIELD_ITEM_FIELD)) {
                                insertionPointEl = $(containerItemEl);
                            }
                        }
                        if (insertionPointEl.length === 0)
                        {
                            self.errorCallback.call(self, {
                                "message": "Cannot find insertion point for field: " + self.getId()
                            });
                            return;
                        }

                        // copy into place
                        $(insertionPointEl).before(control.getFieldEl());
                        $(insertionPointEl).remove();

                        control.containerItemEl = containerItemEl;

                        // TODO: verify, as per: https://github.com/emircal/alpaca/commit/4061c33787bd7a2b86fb613317374d365d9acc92
                        // Reset hideInitValidationError after render
                        Alpaca.fieldApplyFieldAndChildren(control, function(_control) {
                            _control.hideInitValidationError = false;
                        });

                        // PR: https://github.com/gitana/alpaca/pull/124
                        if (Alpaca.isFunction(self.options.items.postRender))
                        {
                            self.options.items.postRender.call(control, insertionPointEl);
                        }

                        if (postRenderCallback)
                        {
                            postRenderCallback(control);
                        }
                    }
                });
            }
        },

        /**
         * Determines the schema and options to utilize for items within this array.
         *
         * @param callback
         */
        resolveItemSchemaOptions: function(callback)
        {
            var _this = this;

            var completionFunction = function(resolvedItemSchema, resolvedItemOptions, circular)
            {
                // special caveat:  if we're in read-only mode, the child must also be in read-only mode
                if (_this.options.readonly) {
                    resolvedItemOptions.readonly = true;
                }

                callback(resolvedItemSchema, resolvedItemOptions, circular);
            };

            var itemOptions;
            // legacy support for options.fields.item
            if (!itemOptions && _this.options && _this.options.fields && _this.options.fields.item) {
                itemOptions = _this.options.fields.item;
            }
            if (!itemOptions && _this.options && _this.options.items) {
                itemOptions = _this.options.items;
            }
            var itemSchema;
            if (_this.schema && _this.schema.items) {
                itemSchema = _this.schema.items;
            }

            // handle $ref
            var schemaReferenceId = null;
            if (itemSchema) {
                schemaReferenceId = itemSchema["$ref"];
            }
            var optionsReferenceId = null;
            if (itemOptions) {
                optionsReferenceId = itemOptions["$ref"];
            }

            if (schemaReferenceId || optionsReferenceId)
            {
                // walk up to find top field
                var topField = this;
                var fieldChain = [topField];
                while (topField.parent)
                {
                    topField = topField.parent;
                    fieldChain.push(topField);
                }

                var originalItemSchema = itemSchema;
                var originalItemOptions = itemOptions;

                Alpaca.loadRefSchemaOptions(topField, schemaReferenceId, optionsReferenceId, function(itemSchema, itemOptions) {

                    // walk the field chain to see if we have any circularity (for schema)
                    var refCount = 0;
                    for (var i = 0; i < fieldChain.length; i++)
                    {
                        if (fieldChain[i].schema)
                        {
                            if (schemaReferenceId)
                            {
                                if ((fieldChain[i].schema.id === schemaReferenceId) || (fieldChain[i].schema.id === "#" + schemaReferenceId))
                                {
                                    refCount++;
                                }
                                else if ((fieldChain[i].schema["$ref"] === schemaReferenceId))
                                {
                                    refCount++;
                                }
                            }
                        }
                    }

                    // use a higher limit for arrays, perhaps 10
                    //var circular = (refCount > 1);
                    var circular = (refCount > 10);

                    var resolvedItemSchema = {};
                    if (originalItemSchema) {
                        Alpaca.mergeObject(resolvedItemSchema, originalItemSchema);
                    }
                    if (itemSchema) {
                        Alpaca.mergeObject(resolvedItemSchema, itemSchema);
                    }
                    delete resolvedItemSchema.id;

                    var resolvedItemOptions = {};
                    if (originalItemOptions) {
                        Alpaca.mergeObject(resolvedItemOptions, originalItemOptions);
                    }
                    if (itemOptions) {
                        Alpaca.mergeObject(resolvedItemOptions, itemOptions);
                    }

                    Alpaca.nextTick(function() {
                        completionFunction(resolvedItemSchema, resolvedItemOptions, circular);
                    });
                });
            }
            else
            {
                Alpaca.nextTick(function() {
                    completionFunction(itemSchema, itemOptions);
                });
            }
        },

        /**
         * @see Alpaca.ContainerField#handleValidate
         */
        handleValidate: function()
        {
            var baseStatus = this.base();

            var valInfo = this.validation;

            var status = this._validateUniqueItems();
            valInfo["valueNotUnique"] = {
                "message": status ? "" : this.getMessage("valueNotUnique"),
                "status": status
            };

            status = this._validateMaxItems();
            valInfo["tooManyItems"] = {
                "message": status ? "" : Alpaca.substituteTokens(this.getMessage("tooManyItems"), [this.schema.maxItems]),
                "status": status
            };

            status = this._validateMinItems();
            valInfo["notEnoughItems"] = {
                "message": status ? "" : Alpaca.substituteTokens(this.getMessage("notEnoughItems"), [this.schema.minItems]),
                "status": status
            };

            return baseStatus && valInfo["valueNotUnique"]["status"] && valInfo["tooManyItems"]["status"] && valInfo["notEnoughItems"]["status"];
        },

        /**
         * Validates if the number of items has been reached to maxItems.
         * @returns {Boolean} true if the number of items has been reached to maxItems
         */
        _validateEqualMaxItems: function()
        {
            if (this.schema.maxItems && this.schema.maxItems >= 0)
            {
                if (this.getSize() >= this.schema.maxItems)
                {
                    return false;
                }
            }

            return true;
        },

        /**
         * Validates if the number of items has been reached to minItems.
         * @returns {Boolean} true if number of items has been reached to minItems
         */
        _validateEqualMinItems: function()
        {
            if (this.schema.minItems && this.schema.minItems >= 0)
            {
                if (this.getSize() <= this.schema.minItems)
                {
                    return false;
                }
            }

            return true;
        },

        /**
         * Validates if number of items has been less than minItems.
         * @returns {Boolean} true if number of items has been less than minItems
         */
        _validateMinItems: function()
        {
            if (this.schema.minItems && this.schema.minItems >= 0)
            {
                if (this.getSize() < this.schema.minItems)
                {
                    return false;
                }
            }

            return true;
        },

        /**
         * Validates if number of items has been over maxItems.
         * @returns {Boolean} true if number of items has been over maxItems
         */
        _validateMaxItems: function()
        {
            if (this.schema.maxItems && this.schema.maxItems >= 0)
            {
                if (this.getSize() > this.schema.maxItems)
                {
                    return false;
                }
            }

            return true;
        },

        /**
         * Validates if all items are unique.
         * @returns {Boolean} true if all items are unique.
         */
        _validateUniqueItems: function()
        {
            if (this.schema.items && this.schema.uniqueItems)
            {
                var hash = {};

                for (var i = 0; i < this.children.length; i++)
                {
                    var key = this.children[i].getValue();
                    if (!key) {
                        key = "";
                    }

                    if (hash[key])
                    {
                        return false;
                    }

                    hash[key] = true;
                }
            }

            return true;
        },

        findAction: function(actionsArray, actionKey)
        {
            var action = null;

            $.each(actionsArray, function(i, v) {
                if (v.action === actionKey) // jshint ignore:line
                {
                    action = v;
                }
            });

            return action;
        },

        postRender: function(callback)
        {
            var self = this;

            this.base(function() {

                //  if there are zero children, show the array toolbar
                self.updateToolbars();

                callback();

            });
        },

        /*
        afterApplyCreatedItems: function(model, callback)
        {
            var self = this;

            //  if there are zero children, show the array toolbar
            self.updateToolbars();

            callback();
        },
        */

        /**
         * Returns number of children.
         */
        getSize: function() {
            return this.children.length;
        },

        /**
         * @OVERRIDE
         *
         * Adjust the path and name ahead of refreshing the DOM.
         */
        updateDOMElement: function()
        {
            this.updatePathAndName();

            this.base();
        },

        /**
         * This method gets invoked after items are dynamically added, removed or moved around in the child chain.
         * It adjusts classes on child DOM elements to make sure they're correct.
         */
        updatePathAndName: function()
        {
            var self = this;

            var updateChildrenPathAndName = function(parent)
            {
                if (parent.children)
                {
                    $.each(parent.children, function(i, v) {

                        if (parent.prePath && Alpaca.startsWith(v.path, parent.prePath))
                        {
                            v.prePath = v.path;
                            v.path = v.path.replace(parent.prePath, parent.path);
                        }

                        // re-calculate name
                        if (parent.preName && Alpaca.startsWith(v.name, parent.preName))
                        {
                            v.preName = v.name;
                            v.name = v.name.replace(parent.preName, parent.name);
                            if (v.field)
                            {
                                $(v.field).attr("name", v.name);
                            }
                        }

                        updateChildrenPathAndName(v);
                    });
                }
            };

            if (this.children && this.children.length > 0)
            {
                $.each(this.children, function(i, v) {

                    var idx = v.path.lastIndexOf('/');
                    var lastSegment = v.path.substring(idx+1);
                    var lastIndex = -1;
                    if (lastSegment.indexOf("[") > 0 && lastSegment.indexOf("]") > 0)
                    {
                        lastIndex = parseInt(lastSegment.substring(lastSegment.indexOf("[") + 1, lastSegment.indexOf("]")));
                    }

                    if (lastIndex !== i)
                    {
                        v.prePath = v.path;
                        v.path = v.path.substring(0, idx) + "/" + lastSegment.substring(0, lastSegment.indexOf("[")) + "[" + i + "]";
                    }

                    // re-calculate name
                    if (v.nameCalculated)
                    {
                        v.preName = v.name;

                        if (v.parent && v.parent.name && v.path)
                        {
                            v.name = v.parent.name + "_" + i;
                        }
                        else
                        {
                            if (v.path)
                            {
                                v.name = v.path.replace(/\//g, "").replace(/\[/g, "_").replace(/\]/g, "");
                            }
                        }

                        if (this.parent.options.rubyrails )
                        {
                            $(v.field).attr("name", v.parent.name);
                        }
                        else
                        {
                            $(v.field).attr("name", v.name);
                        }

                    }

                    if (!v.prePath)
                    {
                        v.prePath = v.path;
                    }

                    updateChildrenPathAndName(v);
                });
            }
        },

        /**
         * Updates the status of array item action toolbar buttons.
         */
        updateToolbars: function()
        {
            var self = this;

            // if we're in display mode, we do not do this
            if (this.view.type === "display")
            {
                return;
            }

            // if we're in readonly mode, don't do this
            if (this.schema.readonly)
            {
                return;
            }

            // fire callbacks to view to remove and create toolbar
            if (self.toolbar)
            {
                self.fireCallback("arrayToolbar", true);
                self.fireCallback("arrayToolbar");
            }

            // fire callbacks to view to remove and create an actionbar for each item
            if (self.actionbar)
            {
                self.fireCallback("arrayActionbars", true);
                self.fireCallback("arrayActionbars");
            }

            //
            // TOOLBAR
            //

            var toolbarEl = $(this.getFieldEl()).find(".alpaca-array-toolbar[data-alpaca-array-toolbar-field-id='" + self.getId() + "']");
            if (this.children.length > 0 && self.options.hideToolbarWithChildren)
            {
                // hide toolbar
                $(toolbarEl).hide();
            }
            else
            {
                // show toolbar
                $(toolbarEl).show();

                // CLICK: array toolbar buttons
                $(toolbarEl).find("[data-alpaca-array-toolbar-action]").each(function() {

                    var actionKey = $(this).attr("data-alpaca-array-toolbar-action");
                    var action = self.findAction(self.toolbar.actions, actionKey);
                    if (action)
                    {
                        $(this).off().click(function(e) {
                            e.preventDefault();
                            action.click.call(self, actionKey, action);
                        });
                    }
                });
            }


            //
            // ACTIONBAR
            //

            // if we're not using the "sticky" toolbar, then show and hide the item action buttons when hovered
            if (typeof(this.options.toolbarSticky) === "undefined" || this.options.toolbarSticky === null)
            {
                // find each item
                var items = this.getFieldEl().find(".alpaca-container-item[data-alpaca-container-item-parent-field-id='" + self.getId() +  "']");
                $(items).each(function(itemIndex) {

                    // find the actionbar for this item
                    // find from containerItemEl
                    var actionbarEl = $(self.getFieldEl()).find(".alpaca-array-actionbar[data-alpaca-array-actionbar-parent-field-id='" + self.getId() +  "'][data-alpaca-array-actionbar-item-index='" + itemIndex + "']");
                    if (actionbarEl && actionbarEl.length > 0)
                    {
                        $(this).hover(function() {
                            $(actionbarEl).show();
                        }, function() {
                            $(actionbarEl).hide();
                        });

                        $(actionbarEl).hide();
                    }
                });
            }
            else if (this.options.toolbarSticky)
            {
                // always show the actionbars
                $(self.getFieldEl()).find(".alpaca-array-actionbar[data-alpaca-array-actionbar-parent-field-id='" + self.getId() +  "']").css("display", "inline-block");
            }
            else if (!this.options.toolbarSticky)
            {
                // always hide the actionbars
                $(self.getFieldEl()).find(".alpaca-array-actionbar[data-alpaca-array-actionbar-parent-field-id='" + self.getId() +  "']").hide();
            }

            // CLICK: actionbar buttons
            // NOTE: actionbarEls size should be 0 or 1
            var actionbarEls = $(self.getFieldEl()).find(".alpaca-array-actionbar[data-alpaca-array-actionbar-parent-field-id='" + self.getId() + "']");
            $(actionbarEls).each(function() {

                var targetIndex = $(this).attr("data-alpaca-array-actionbar-item-index");
                if (typeof(targetIndex) === "string")
                {
                    targetIndex = parseInt(targetIndex, 10);
                }

                // bind button click handlers
                $(this).children("[data-alpaca-array-actionbar-action]").each(function() {

                    var actionKey = $(this).attr("data-alpaca-array-actionbar-action");
                    var action = self.findAction(self.actionbar.actions, actionKey);
                    if (action)
                    {
                        $(this).off().click(function(e) {
                            e.preventDefault();
                            action.click.call(self, actionKey, action, targetIndex);
                        });
                    }
                });

                // if we're at max capacity, disable "add" buttons
                if (self._validateEqualMaxItems())
                {
                    $(this).children("[data-alpaca-array-toolbar-action='add']").each(function(index) {
                        $(this).removeClass('alpaca-button-disabled');
                        self.fireCallback("enableButton", this);
                    });

                    $(this).children("[data-alpaca-array-actionbar-action='add']").each(function(index) {
                        $(this).removeClass('alpaca-button-disabled');
                        self.fireCallback("enableButton", this);
                    });
                }
                else
                {
                    $(this).children("[data-alpaca-array-toolbar-action='add']").each(function(index) {
                        $(this).addClass('alpaca-button-disabled');
                        self.fireCallback("disableButton", this);
                    });

                    $(this).children("[data-alpaca-array-actionbar-action='add']").each(function(index) {
                        $(this).addClass('alpaca-button-disabled');
                        self.fireCallback("disableButton", this);
                    });
                }

                // if we're at min capacity, disable "remove" buttons
                if (self._validateEqualMinItems())
                {
                    $(this).children("[data-alpaca-array-actionbar-action='remove']").each(function(index) {
                        $(this).removeClass('alpaca-button-disabled');
                        self.fireCallback("enableButton", this);
                    });
                }
                else
                {
                    $(this).children("[data-alpaca-array-actionbar-action='remove']").each(function(index) {
                        $(this).addClass('alpaca-button-disabled');
                        self.fireCallback("disableButton", this);
                    });
                }
            });
            // first actionbar has its "move up" button disabled
            $(actionbarEls).first().children("[data-alpaca-array-actionbar-action='up']").each(function() {
                $(this).addClass('alpaca-button-disabled');
                self.fireCallback("disableButton", this);
            });
            // last actionbar has its "move down" button disabled
            $(actionbarEls).last().children("[data-alpaca-array-actionbar-action='down']").each(function() {
                $(this).addClass('alpaca-button-disabled');
                self.fireCallback("disableButton", this);
            });

        },


        ///////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // DYNAMIC METHODS
        //
        ///////////////////////////////////////////////////////////////////////////////////////////////////

        doResolveItemContainer: function()
        {
            var self = this;

            return $(self.container);
        },

        handleToolBarAddItemClick: function(callback)
        {
            var self = this;

            self.resolveItemSchemaOptions(function(itemSchema, itemOptions, circular) {

                // we only allow addition if the resolved schema isn't circularly referenced
                // or the schema is optional
                if (circular)
                {
                    return Alpaca.throwErrorWithCallback("Circular reference detected for schema: " + JSON.stringify(itemSchema), self.errorCallback);
                }

                // how many children do we have currently?
                var insertionPoint = self.children.length;

                var itemData = Alpaca.createEmptyDataInstance(itemSchema);
                self.addItem(insertionPoint, itemSchema, itemOptions, itemData, function(item) {
                    if (callback) {
                        callback(item);
                    }
                });
            });
        },

        handleActionBarAddItemClick: function(itemIndex, callback)
        {
            var self = this;

            self.resolveItemSchemaOptions(function(itemSchema, itemOptions, circular) {

                // we only allow addition if the resolved schema isn't circularly referenced
                // or the schema is optional
                if (circular)
                {
                    return Alpaca.throwErrorWithCallback("Circular reference detected for schema: " + JSON.stringify(itemSchema), self.errorCallback);
                }

                var arrayValues = self.getValue();

                var itemData = Alpaca.createEmptyDataInstance(itemSchema);
                self.addItem(itemIndex + 1, itemSchema, itemOptions, itemData, function(item) {

                    // this is necessary because some underlying fields require their data to be reset
                    // in order for the display to work out properly (radio fields)
                    arrayValues.splice(itemIndex + 1, 0, item.getValue());
                    self.setValue(arrayValues);

                    if (callback) {
                        callback(item);
                    }
                });
            });
        },

        handleActionBarRemoveItemClick: function(itemIndex, callback)
        {
            var self = this;

            self.removeItem(itemIndex, function() {
                if (callback) {
                    callback();
                }
            });
        },

        handleActionBarMoveItemUpClick: function(itemIndex, callback)
        {
            var self = this;

            self.swapItem(itemIndex, itemIndex - 1, self.options.animate, function() {
                if (callback) {
                    callback();
                }
            });
        },

        handleActionBarMoveItemDownClick: function(itemIndex, callback)
        {
            var self = this;

            self.swapItem(itemIndex, itemIndex + 1, self.options.animate, function() {
                if (callback) {
                    callback();
                }
            });
        },

        doAddItem: function(index, item, callback)
        {
            var self = this;

            var addItemContainer = self.doResolveItemContainer();

            // insert into dom
            if (index === 0)
            {
                // insert first into container
                $(addItemContainer).append(item.containerItemEl);
            }
            else
            {
                // insert at a specific index
                var existingElement = addItemContainer.children("[data-alpaca-container-item-index='" + (index-1) + "']");
                if (existingElement && existingElement.length > 0)
                {
                    // insert after
                    existingElement.after(item.containerItemEl);
                }
            }

            self.doAfterAddItem(item, function(err) {

                // trigger ready
                Alpaca.fireReady(item);

                callback(err);
            });
        },

        doAfterAddItem: function(item, callback)
        {
            callback();
        },

        /**
         * Adds an item to the array.
         *
         * This gets called from the toolbar when items are added via the user interface.  The method can also
         * be called programmatically to insert items on the fly.
         *
         * @param {Integer} index the index where the item should be inserted
         * @param {Object} schema the json schema
         * @param {Object} options the json options
         * @param {Any} data the data for the newly inserted item
         * @param [Function] callback called after the child is added
         */
        addItem: function(index, schema, options, data, callback)
        {
            var self = this;

            if (self._validateEqualMaxItems())
            {
                self.createItem(index, schema, options, data, function(item) {

                    // register the child
                    self.registerChild(item, index);

                    // insert into dom
                    self.doAddItem(index, item, function() {

                        // updates dom markers for this element and any siblings
                        self.handleRepositionDOMRefresh();

                        // update the array item toolbar state
                        self.updateToolbars();

                        // refresh validation state
                        self.refreshValidationState();

                        // dispatch event: add
                        self.trigger("add", item);

                        // trigger update
                        self.triggerUpdate();

                        if (callback)
                        {
                            Alpaca.nextTick(function() {
                                callback(item);
                            });
                        }

                    });
                });
            }
        },

        doRemoveItem: function(childIndex, callback)
        {
            var self = this;

            var removeItemContainer = self.doResolveItemContainer();

            removeItemContainer.children(".alpaca-container-item[data-alpaca-container-item-index='" + childIndex + "']").remove();

            self.doAfterRemoveItem(childIndex, function(err) {
                callback(err);
            });
        },

        doAfterRemoveItem: function(childIndex, callback)
        {
            callback();
        },

        /**
         * Removes an item from the array.
         *
         * This gets called automatically from setValue() when the number of items being set is less than the number
         * of field elements.

         * @param {Number} childIndex index of the child to be removed
         * @param [Function] callback called after the child is removed
         * @param [boolean] force whether to force the removal
         */
        removeItem: function(childIndex, callback, force)
        {
            var self = this;

            if (this._validateEqualMinItems() || force)
            {
                // unregister the child
                self.unregisterChild(childIndex);

                // remove itemContainerEl from DOM
                self.doRemoveItem(childIndex, function() {

                    // updates dom markers for this element and any siblings
                    self.handleRepositionDOMRefresh();

                    // update the array item toolbar state
                    self.updateToolbars();

                    // refresh validation state
                    self.refreshValidationState();

                    // dispatch event: remove
                    self.trigger("remove", childIndex);

                    // trigger update
                    self.triggerUpdate();

                    if (callback)
                    {
                        Alpaca.nextTick(function() {
                            callback();
                        });
                    }

                });
            }
        },

        /**
         * Workhorse method for moving an item in the array to a new index.
         *
         * @param {Number} sourceIndex the index of the child to be moved
         * @param {Number} targetIndex the index to be moved to
         * @param [Boolean] animate whether to animate
         * @param [Function] callback called after the child is added and refresh occurs
         */
        moveItem: function(sourceIndex, targetIndex, animate, callback)
        {
            var self = this;

            if (typeof(animate) == "function")
            {
                callback = animate;
                animate = self.options.animate;
            }

            if (typeof(animate) == "undefined")
            {
                animate = self.options.animate ? self.options.animate : true;
            }

            if (typeof(sourceIndex) === "string")
            {
                sourceIndex = parseInt(sourceIndex, 10);
            }

            if (typeof(targetIndex) === "string")
            {
                targetIndex = parseInt(targetIndex, 10);
            }

            if (targetIndex < 0)
            {
                targetIndex = 0;
            }
            if (targetIndex >= self.children.length)
            {
                targetIndex = self.children.length - 1;
            }

            if (targetIndex === -1)
            {
                // no target index
                return;
            }

            if (sourceIndex === targetIndex)
            {
                // nothing to do
                return;
            }

            var targetChild = self.children[targetIndex];
            if (!targetChild)
            {
                // target child not found
                return;
            }

            var onComplete = function()
            {
                var adjustedTargetIndex = targetIndex;
                if (sourceIndex < targetIndex) {
                    adjustedTargetIndex--;
                }

                // splice out child
                var child = self.children.splice(sourceIndex, 1)[0];
                self.children.splice(adjustedTargetIndex, 0, child);

                // set data and refresh
                self.data = self.getValue();
                self.refresh(function() {

                    // refresh validation state
                    self.refreshValidationState();

                    // trigger update
                    self.triggerUpdate();

                    // dispatch event: move
                    self.trigger("move");

                    if (callback)
                    {
                        Alpaca.nextTick(function() {
                            callback();
                        });
                    }

                });
            };

            var duration = 0;
            if (animate)
            {
                duration = 500;
            }

            if (duration > 0)
            {
                var parentFieldId = self.getId();

                // the source and target DOM elements
                var sourceContainer = self.getContainerEl().find(".alpaca-container-item[data-alpaca-container-item-index='" + sourceIndex + "'][data-alpaca-container-item-parent-field-id='" + parentFieldId + "']");
                var targetContainer = self.getContainerEl().find(".alpaca-container-item[data-alpaca-container-item-index='" + targetIndex + "'][data-alpaca-container-item-parent-field-id='" + parentFieldId + "']");

                // create two temp elements as markers for switch
                var tempSourceMarker = $("<div class='tempMarker1'></div>");
                sourceContainer.before(tempSourceMarker);
                var tempTargetMarker = $("<div class='tempMarker2'></div>");
                targetContainer.before(tempTargetMarker);

                // moves div visually
                Alpaca.animatedMove(sourceContainer, targetContainer, duration, function () {
                    onComplete();
                });
            }
            else
            {
                onComplete();
            }
        },

        /**
         * Workhorse method for swapping an item from one index in the array to another.
         *
         * @param {Number} sourceIndex the index of the child to be moved
         * @param {Number} targetIndex the index to be moved to
         * @param [Boolean] animate whether to animate
         * @param [Function] callback called after the child is added and refresh occurs
         */
        swapItem: function(sourceIndex, targetIndex, animate, callback)
        {
            var self = this;

            if (typeof(animate) == "function")
            {
                callback = animate;
                animate = self.options.animate;
            }

            if (typeof(animate) == "undefined")
            {
                animate = self.options.animate ? self.options.animate : true;
            }

            if (typeof(sourceIndex) === "string")
            {
                sourceIndex = parseInt(sourceIndex, 10);
            }

            if (typeof(targetIndex) === "string")
            {
                targetIndex = parseInt(targetIndex, 10);
            }

            if (targetIndex < 0)
            {
                targetIndex = 0;
            }
            if (targetIndex >= self.children.length)
            {
                targetIndex = self.children.length - 1;
            }

            if (targetIndex === -1)
            {
                // no target index
                return;
            }

            if (sourceIndex === targetIndex)
            {
                // nothing to do
                return;
            }

            var targetChild = self.children[targetIndex];
            if (!targetChild)
            {
                // target child not found
                return;
            }

            var onComplete = function()
            {
                var sourceChild = self.children[sourceIndex];
                var targetChild = self.children[targetIndex];

                self.children[sourceIndex] = targetChild;
                self.children[targetIndex] = sourceChild;

                // copy back data and refresh
                self.data = self.getValue();
                self.refresh(function() {

                    // refresh validation state
                    self.refreshValidationState();

                    // trigger update
                    self.triggerUpdate();

                    // dispatch event: move
                    self.trigger("move");

                    if (callback)
                    {
                        Alpaca.nextTick(function() {
                            callback();
                        });
                    }

                });
            };

            var duration = 0;
            if (animate)
            {
                duration = 500;
            }

            if (duration > 0)
            {
                var parentFieldId = self.getId();

                // the source and target DOM elements
                var sourceContainer = self.getContainerEl().find(".alpaca-container-item[data-alpaca-container-item-index='" + sourceIndex + "'][data-alpaca-container-item-parent-field-id='" + parentFieldId + "']");
                var targetContainer = self.getContainerEl().find(".alpaca-container-item[data-alpaca-container-item-index='" + targetIndex + "'][data-alpaca-container-item-parent-field-id='" + parentFieldId + "']");

                // create two temp elements as markers for switch
                var tempSourceMarker = $("<div class='tempMarker1'></div>");
                sourceContainer.before(tempSourceMarker);
                var tempTargetMarker = $("<div class='tempMarker2'></div>");
                targetContainer.before(tempTargetMarker);

                // swap divs visually
                Alpaca.animatedSwap(sourceContainer, targetContainer, duration, function () {
                    onComplete();
                });
            }
            else
            {
                onComplete();
            }
        },

        /**
         * @see Alpaca.ContainerField#getType
         */
        getType: function() {
            return "array";
        },


        /* builder_helpers */

        /**
         * @see Alpaca.ContainerField#getTitle
         */
        getTitle: function() {
            return "Array Field";
        },

        /**
         * @see Alpaca.ContainerField#getDescription
         */
        getDescription: function() {
            return "Field for list of items with same data type or structure.";
        },

        /**
         * @private
         * @see Alpaca.ContainerField#getSchemaOfSchema
         */
        getSchemaOfSchema: function() {
            var properties = {
                "properties": {
                    "items": {
                        "title": "Array Items",
                        "description": "Schema for array items.",
                        "type": "object"
                    },
                    "minItems": {
                        "title": "Minimum Items",
                        "description": "Minimum number of items.",
                        "type": "number"
                    },
                    "maxItems": {
                        "title": "Maximum Items",
                        "description": "Maximum number of items.",
                        "type": "number"
                    },
                    "uniqueItems": {
                        "title": "Items Unique",
                        "description": "Item values should be unique if true.",
                        "type": "boolean",
                        "default": false
                    }
                }
            };

            if (this.children && this.children[0]) {
                Alpaca.merge(properties.properties.items.properties, this.children[0].getSchemaOfSchema());
            }

            return Alpaca.merge(this.base(), properties);
        },

        /**
         * @private
         * @see Alpaca.ContainerField#getOptionsForSchema
         */
        getOptionsForSchema: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "items": {
                        "type": "object"
                    },
                    "minItems": {
                        "type": "integer"
                    },
                    "maxItems": {
                        "type": "integer"
                    },
                    "uniqueItems": {
                        "type": "checkbox"
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.ContainerField#getSchemaOfOptions
         */
        getSchemaOfOptions: function() {
            var properties = {
                "properties": {
                    "toolbarSticky": {
                        "title": "Sticky Toolbar",
                        "description": "If true, the array item toolbar will always be enabled.  If false, the toolbar is always disabled.  If undefined or null, the toolbar will appear when hovered over.",
                        "type": "boolean",
                        "default": undefined
                    },
                    "toolbarStyle": {
                        "title": "Toolbar Style",
                        "description": "The kind of top-level toolbar to render for the array field.  Either 'button' or 'link'.",
                        "type": "string",
                        "default": "button"
                    },
                    "toolbarPosition": {
                        "title": "Toolbar Position",
                        "description": "Location of the top-level toolbar to render for the array field.  Either 'top' or 'bottom'.",
                        "type": "string",
                        "default": "top"
                    },
                    "actionbarStyle": {
                        "title": "Actionbar Style",
                        "description": "The kind of actionbar to render for each item in the array.  Either 'top', 'bottom', 'left', or 'right'.",
                        "type": "string",
                        "default": "top"
                    },
                    "toolbar": {
                        "type": "object",
                        "title": "Toolbar Configuration",
                        "properties": {
                            "showLabels": {
                                "type": "boolean",
                                "default": true,
                                "title": "Whether to show labels next to actions"
                            },
                            "actions": {
                                "type": "array",
                                "title": "Toolbar Actions Configuration",
                                "items": {
                                    "action": {
                                        "type": "string",
                                        "title": "Action Key"
                                    },
                                    "label": {
                                        "type": "string",
                                        "title": "Action Label"
                                    },
                                    "iconClass": {
                                        "type": "string",
                                        "title": "Action CSS Classes for Icon"
                                    },
                                    "click": {
                                        "type": "function",
                                        "title": "Action Click Handler"
                                    },
                                    "enabled": {
                                        "type": "boolean",
                                        "title": "Whether to enable the action",
                                        "default": true
                                    }
                                }
                            }
                        }
                    },
                    "actionbar": {
                        "type": "object",
                        "properties": {
                            "showLabels": {
                                "type": "boolean",
                                "default": false,
                                "title": "Whether to show labels next to actions"
                            },
                            "actions": {
                                "type": "array",
                                "title": "Actions Bar Actions Configuration",
                                "items": {
                                    "action": {
                                        "type": "string",
                                        "title": "Action Key"
                                    },
                                    "label": {
                                        "type": "string",
                                        "title": "Action Label"
                                    },
                                    "iconClass": {
                                        "type": "string",
                                        "title": "Action CSS Classes for Icon"
                                    },
                                    "click": {
                                        "type": "function",
                                        "title": "Action Click Handler"
                                    },
                                    "enabled": {
                                        "type": "boolean",
                                        "title": "Whether to enable the action",
                                        "default": true
                                    }
                                }
                            }
                        }
                    },
                    "hideToolbarWithChildren": {
                        "type": "boolean",
                        "title": "Hide Toolbar with Children",
                        "description": "Indicates whether to hide the top toolbar when child elements are available.",
                        "default": true
                    }
                }
            };

            if (this.children && this.children[0]) {
                Alpaca.merge(properties.properties.items.properties, this.children[0].getSchemaOfSchema());
            }

            return Alpaca.merge(this.base(), properties);
        },

        /**
         * @private
         * @see Alpaca.ContainerField#getOptionsForOptions
         */
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "toolbarSticky": {
                        "type": "checkbox"
                    },
                    "items": {
                        "type": "object",
                        "fields": {
                        }
                    }
                }
            });
        }

        /* end_builder_helpers */
    });

    Alpaca.registerMessages({
        "notEnoughItems": "The minimum number of items is {0}",
        "tooManyItems": "The maximum number of items is {0}",
        "valueNotUnique": "Values are not unique",
        "notAnArray": "This value is not an Array"
    });
    Alpaca.registerFieldClass("array", Alpaca.Fields.ArrayField);
    Alpaca.registerDefaultSchemaFieldMapping("array", "array");

    Alpaca.registerMessages({
        "addItemButtonLabel": "Add New Item",
        "addButtonLabel": "Add",
        "removeButtonLabel": "Remove",
        "upButtonLabel": "Up",
        "downButtonLabel": "Down"
    });

})(jQuery);

/*jshint -W004 */ // duplicate variables
/*jshint -W083 */ // inline functions are used safely
(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.ObjectField = Alpaca.ContainerField.extend(
    /**
     * @lends Alpaca.Fields.ObjectField.prototype
     */
    {
        /**
         * @see Alpaca.Field#getFieldType
         */
        getFieldType: function() {
            return "object";
        },

        /**
         * @see Alpaca.ContainerField#setup
         */
        setup: function()
        {
            var self = this;

            this.base();

            var containerItemTemplateType = self.resolveContainerItemTemplateType();
            if (!containerItemTemplateType)
            {
                var x = self.resolveContainerItemTemplateType();
                return Alpaca.throwErrorWithCallback("Unable to find template descriptor for container item: " + self.getFieldType());
            }

            this.containerItemTemplateDescriptor = self.view.getTemplateDescriptor("container-" + containerItemTemplateType + "-item", self);

            if (Alpaca.isEmpty(this.data) || this.data === "")
            {
                return;
            }

            if (!Alpaca.isObject(this.data))
            {
                if (!Alpaca.isString(this.data))
                {
                    return;
                }
                else
                {
                    try
                    {
                        this.data = Alpaca.parseJSON(this.data);
                        if (!Alpaca.isObject(this.data))
                        {
                            Alpaca.logWarn("ObjectField parsed data but it was not an object: " + JSON.stringify(this.data));
                            return;
                        }
                    }
                    catch (e)
                    {
                        return;
                    }
                }
            }
        },

        /**
         * Picks apart the data object and set onto child fields.
         *
         * @see Alpaca.Field#setValue
         */
        setValue: function(data)
        {
            if (!data)
            {
                data = {};
            }

            // if not an object by this point, we don't handle it
            if (!Alpaca.isObject(data))
            {
                return;
            }

            // sort existing fields by property id
            var existingFieldsByPropertyId = {};
            for (var fieldId in this.childrenById)
            {
                var propertyId = this.childrenById[fieldId].propertyId;
                existingFieldsByPropertyId[propertyId] = this.childrenById[fieldId];
            }

            // new data mapped by property id
            var newDataByPropertyId = {};
            for (var k in data)
            {
                if (data.hasOwnProperty(k))
                {
                    newDataByPropertyId[k] = data[k];
                }
            }

            // walk through new property ids
            // if a field exists, set value onto it and remove from newDataByPropertyId and existingFieldsByPropertyId
            // if a field doesn't exist, let it remain in list
            for (var propertyId in newDataByPropertyId)
            {
                var field = existingFieldsByPropertyId[propertyId];
                if (field)
                {
                    field.setValue(newDataByPropertyId[propertyId]);

                    delete existingFieldsByPropertyId[propertyId];
                    delete newDataByPropertyId[propertyId];
                }
            }

            // anything left in existingFieldsByPropertyId describes data that is missing, null or empty
            // we set those as undefined
            for (var propertyId in existingFieldsByPropertyId)
            {
                var field = existingFieldsByPropertyId[propertyId];
                field.setValue(null);
            }

            // anything left in newDataByPropertyId is new stuff that we need to add
            // the object field doesn't support this since it runs against a schema
            // so we drop this off
        },

        /**
         * Reconstructs the data object from the child fields.
         *
         * @see Alpaca.ContainerField#getContainerValue
         */
        getContainerValue: function()
        {
            // if we don't have any children and we're not required, hand back empty object
            if (this.children.length === 0 && !this.isRequired())
            {
                return {};
            }

            // otherwise, hand back an object with our child properties in it
            var o = {};

            // walk through all of the properties object
            // for each property, we insert it into a JSON object that we'll hand back as the result

            // if the property has dependencies, then we evaluate those dependencies first to determine whether the
            // resulting property should be included

            for (var i = 0; i < this.children.length; i++)
            {
                // the property key and value
                var propertyId = this.children[i].propertyId;
                var fieldValue = this.children[i].getValue();

                if(fieldValue !== fieldValue) {
                    // NaN
                    fieldValue = undefined;
                }

                if (typeof(fieldValue) !== "undefined")
                {
                    if (this.determineAllDependenciesValid(propertyId))
                    {
                        var assignedValue = null;

                        if (typeof(fieldValue) === "boolean")
                        {
                            assignedValue = (fieldValue? true: false);
                        }
                        else if (Alpaca.isArray(fieldValue) || Alpaca.isObject(fieldValue) || Alpaca.isNumber(fieldValue))
                        {
                            assignedValue = fieldValue;
                        }
                        else if (fieldValue || fieldValue === 0)
                        {
                            assignedValue = fieldValue;
                        }

                        if (assignedValue !== null)
                        {
                            o[propertyId] = assignedValue;
                        }
                    }
                }
            }

            return o;
        },

        /**
         * @see Alpaca.Field#afterRenderContainer
         */
        afterRenderContainer: function(model, callback) {

            var self = this;

            this.base(model, function() {

                // Generates wizard if requested
                if (self.isTopLevel())
                {
                    if (self.view)
                    {
                        self.wizardConfigs = self.view.getWizard();
                        if (typeof(self.wizardConfigs) != "undefined")
                        {
                            if (!self.wizardConfigs || self.wizardConfigs === true)
                            {
                                self.wizardConfigs = {};
                            }
                        }

                        var layoutTemplateDescriptor = self.view.getLayout().templateDescriptor;
                        if (self.wizardConfigs && Alpaca.isObject(self.wizardConfigs))
                        {
                            if (!layoutTemplateDescriptor || self.wizardConfigs.bindings)
                            {
                                // run the automatic wizard
                                self.autoWizard();
                            }
                            else
                            {
                                // manual wizard based on layout
                                self.wizard();
                            }
                        }
                    }
                }

                callback();
            });
        },

        /**
         * @override
         *
         * Creates sub-items for this object.
         *
         * @param callback
         */
        createItems: function(callback)
        {
            var self = this;

            var items = [];

            // we keep a map of all of the properties in our original data object
            // as we render elements out of the schema, we remove from the extraDataProperties map
            // whatever is leftover are the data properties that were NOT rendered because they were not part
            // of the schema
            //
            // this is primarily maintained for debugging purposes, so as to inform the developer of mismatches
            var extraDataProperties = {};
            for (var dataKey in self.data) {
                extraDataProperties[dataKey] = dataKey;
            }

            var properties = self.data;
            if (self.schema && self.schema.properties) {
                properties = self.schema.properties;
            }

            var cf = function()
            {
                // If the schema and the data line up perfectly, then there will be no properties in the data that are
                // not also in the schema, and thus, extraDataProperties will be empty.
                //
                // On the other hand, if there are some properties in data that were not in schema, then they will
                // remain in extraDataProperties and we can inform developers for debugging purposes
                //
                var extraDataKeys = [];
                for (var extraDataKey in extraDataProperties) {
                    extraDataKeys.push(extraDataKey);
                }
                if (extraDataKeys.length > 0) {
                    Alpaca.logDebug("There were " + extraDataKeys.length + " extra data keys that were not part of the schema " + JSON.stringify(extraDataKeys));
                }

                callback(items);
            };

            // each property in the object can have a different schema and options so we need to process
            // asynchronously and wait for all to complete

            var itemsByPropertyId = {};

            // wrap into waterfall functions
            var propertyFunctions = [];
            for (var propertyId in properties)
            {
                var itemData = null;
                if (self.data)
                {
                    if (self.data.hasOwnProperty(propertyId))
                    {
                        itemData = self.data[propertyId];
                    }
                }

                var pf = (function(propertyId, itemData, extraDataProperties)
                {
                    return function(_done)
                    {
                        // only allow this if we have data, otherwise we end up with circular reference
                        self.resolvePropertySchemaOptions(propertyId, function (schema, options, circular) {

                            // we only allow addition if the resolved schema isn't circularly referenced
                            // or the schema is optional
                            if (circular) {
                                return Alpaca.throwErrorWithCallback("Circular reference detected for schema: " + JSON.stringify(schema), self.errorCallback);
                            }

                            if (!schema) {
                                Alpaca.logDebug("Unable to resolve schema for property: " + propertyId);
                            }

                            self.createItem(propertyId, schema, options, itemData, null, function (addedItemControl) {

                                itemsByPropertyId[propertyId] = addedItemControl;

                                // remove from extraDataProperties helper
                                delete extraDataProperties[propertyId];

                                _done();
                            });
                        });
                    };

                })(propertyId, itemData, extraDataProperties);

                propertyFunctions.push(pf);
            }

            Alpaca.parallel(propertyFunctions, function(err) {

                // build items array in correct property order
                for (var propertyId in properties)
                {
                    var item = itemsByPropertyId[propertyId];
                    if (item)
                    {
                        items.push(item);
                    }
                }

                // is there any order information in the items?
                var hasOrderInformation = false;
                for (var i = 0; i < items.length; i++) {
                    if (typeof(items[i].options.order) !== "undefined") {
                        hasOrderInformation = true;
                        break;
                    }
                }

                if (hasOrderInformation)
                {
                    // sort by order?
                    items.sort(function (a, b) {

                        var orderA = a.options.order;
                        if (!orderA)
                        {
                            orderA = 0;
                        }
                        var orderB = b.options.order;
                        if (!orderB)
                        {
                            orderB = 0;
                        }

                        return (orderA - orderB);
                    });
                }

                cf();
            });
        },

        /**
         * Creates an sub-item for this object.
         *
         * The postRenderCallback method is called upon completion.
         *
         * @param {String} propertyId Child field property ID.
         * @param {Object} itemSchema schema
         * @param {Object} fieldOptions Child field options.
         * @param {Any} value Child field value
         * @param {String} insertAfterId Location where the child item will be inserted.
         * @param [Function} postRenderCallback called once the item has been added
         */
        createItem: function(propertyId, itemSchema, itemOptions, itemData, insertAfterId, postRenderCallback)
        {
            var self = this;

            var formEl = $("<div></div>");
            formEl.alpaca({
                "data" : itemData,
                "options": itemOptions,
                "schema" : itemSchema,
                "view" : this.view.id ? this.view.id : this.view,
                "connector": this.connector,
                "error": function(err)
                {
                    self.destroy();

                    self.errorCallback.call(self, err);
                },
                "notTopLevel":true,
                "render" : function(fieldControl, cb) {
                    // render
                    fieldControl.parent = self;
                    // add the property Id
                    fieldControl.propertyId = propertyId;
                    // setup item path
                    if (self.path !== "/") {
                        fieldControl.path = self.path + "/" + propertyId;
                    } else {
                        fieldControl.path = self.path + propertyId;
                    }
                    fieldControl.render(null, function() {
                        if (cb) {
                            cb();
                        }
                    });
                },
                "postRender": function(control) {

                    // alpaca finished

                    // render the outer container
                    var containerItemEl = Alpaca.tmpl(self.containerItemTemplateDescriptor, {
                        "id": self.getId(),
                        "name": control.name,
                        "parentFieldId": self.getId(),
                        "actionbarStyle": self.options.actionbarStyle,
                        "view": self.view,
                        "data": itemData
                    });

                    // find the insertion point
                    var insertionPointEl = $(containerItemEl).find("." + Alpaca.MARKER_CLASS_CONTAINER_FIELD_ITEM_FIELD);
                    if (insertionPointEl.length === 0)
                    {
                        if ($(containerItemEl).hasClass(Alpaca.MARKER_CLASS_CONTAINER_FIELD_ITEM_FIELD)) {
                            insertionPointEl = $(containerItemEl);
                        }
                    }
                    if (insertionPointEl.length === 0)
                    {
                        self.errorCallback.call(self, {
                            "message": "Cannot find insertion point for field: " + self.getId()
                        });
                        return;
                    }

                    // copy into place
                    $(insertionPointEl).before(control.getFieldEl());
                    $(insertionPointEl).remove();

                    control.containerItemEl = containerItemEl;

                    // TODO: verify, as per: https://github.com/emircal/alpaca/commit/4061c33787bd7a2b86fb613317374d365d9acc92
                    // Reset hideInitValidationError after render
                    Alpaca.fieldApplyFieldAndChildren(control, function(_control) {
                        _control.hideInitValidationError = false;
                    });

                    if (postRenderCallback)
                    {
                        postRenderCallback(control);
                    }
                }
            });
        },

        /**
         * Determines the schema and options to utilize for sub-objects within this object.
         *
         * @param propertyId
         * @param callback
         */
        resolvePropertySchemaOptions: function(propertyId, callback)
        {
            var _this = this;

            var completionFunction = function(resolvedPropertySchema, resolvedPropertyOptions, circular)
            {
                // special caveat:  if we're in read-only mode, the child must also be in read-only mode
                if (_this.options.readonly) {
                    resolvedPropertyOptions.readonly = true;
                }

                callback(resolvedPropertySchema, resolvedPropertyOptions, circular);
            };

            var propertySchema = null;
            if (_this.schema && _this.schema.properties && _this.schema.properties[propertyId]) {
                propertySchema = _this.schema.properties[propertyId];
            }
            var propertyOptions = {};
            if (_this.options && _this.options.fields && _this.options.fields[propertyId]) {
                propertyOptions = _this.options.fields[propertyId];
            }

            // handle $ref
            var propertyReferenceId = null;
            if (propertySchema) {
                propertyReferenceId = propertySchema["$ref"];
            }
            var fieldReferenceId = null;
            if (propertyOptions) {
                fieldReferenceId = propertyOptions["$ref"];
            }

            if (propertyReferenceId || fieldReferenceId)
            {
                // walk up to find top field
                var topField = this;
                var fieldChain = [topField];
                while (topField.parent)
                {
                    topField = topField.parent;
                    fieldChain.push(topField);
                }

                var originalPropertySchema = propertySchema;
                var originalPropertyOptions = propertyOptions;

                Alpaca.loadRefSchemaOptions(topField, propertyReferenceId, fieldReferenceId, function(propertySchema, propertyOptions) {

                    // walk the field chain to see if we have any circularity (for schema)
                    var refCount = 0;
                    for (var i = 0; i < fieldChain.length; i++)
                    {
                        if (propertyReferenceId)
                        {
                            if (fieldChain[i].schema)
                            {
                                if ( (fieldChain[i].schema.id === propertyReferenceId) || (fieldChain[i].schema.id === "#" + propertyReferenceId))
                                {
                                    refCount++;
                                }
                                else if ( (fieldChain[i].schema["$ref"] === propertyReferenceId))
                                {
                                    refCount++;
                                }
                            }
                        }
                    }

                    var circular = (refCount > 1);

                    var resolvedPropertySchema = {};
                    if (originalPropertySchema) {
                        Alpaca.mergeObject(resolvedPropertySchema, originalPropertySchema);
                    }
                    if (propertySchema) {
                        Alpaca.mergeObject(resolvedPropertySchema, propertySchema);
                    }
                    // keep original id
                    if (originalPropertySchema && originalPropertySchema.id) {
                        resolvedPropertySchema.id = originalPropertySchema.id;
                    }
                    //delete resolvedPropertySchema.id;

                    var resolvedPropertyOptions = {};
                    if (originalPropertyOptions) {
                        Alpaca.mergeObject(resolvedPropertyOptions, originalPropertyOptions);
                    }
                    if (propertyOptions) {
                        Alpaca.mergeObject(resolvedPropertyOptions, propertyOptions);
                    }

                    Alpaca.nextTick(function() {
                        completionFunction(resolvedPropertySchema, resolvedPropertyOptions, circular);
                    });
                });
            }
            else
            {
                Alpaca.nextTick(function() {
                    completionFunction(propertySchema, propertyOptions);
                });
            }
        },

        applyCreatedItems: function(model, callback)
        {
            var self = this;

            this.base(model, function() {

                var f = function(i)
                {
                    if (i === model.items.length)
                    {
                        // done
                        callback();
                        return;
                    }

                    var item = model.items[i];

                    var propertyId = item.propertyId;

                    // HANDLE PROPERTY DEPENDENCIES (IF THE PROPERTY HAS THEM)

                    // if this property has dependencies, show or hide this added item right away
                    self.showOrHidePropertyBasedOnDependencies(propertyId);

                    // if this property has dependencies, bind update handlers to dependent fields
                    self.bindDependencyFieldUpdateEvent(propertyId);

                    // if this property has dependencies, trigger those to ensure it is in the right state
                    self.refreshDependentFieldStates(propertyId);

                    f(i+1);
                };
                f(0);
            });
        },

        /**
         * @see Alpaca.ContainerField#handleValidate
         */
        handleValidate: function()
        {
            var baseStatus = this.base();

            var valInfo = this.validation;

            var status = this._validateMaxProperties();
            valInfo["tooManyProperties"] = {
                "message": status ? "" : Alpaca.substituteTokens(this.getMessage("tooManyProperties"), [this.schema.maxProperties]),
                "status": status
            };

            status = this._validateMinProperties();
            valInfo["tooFewProperties"] = {
                "message": status ? "" : Alpaca.substituteTokens(this.getMessage("tooManyItems"), [this.schema.minProperties]),
                "status": status
            };

            return baseStatus && valInfo["tooManyProperties"]["status"] && valInfo["tooFewProperties"]["status"];
        },

        /**
         * Validate maxProperties schema property.
         *
         * @returns {Boolean} whether maxProperties is satisfied
         */
        _validateMaxProperties: function()
        {
            if (typeof(this.schema["maxProperties"]) == "undefined")
            {
                return true;
            }

            var maxProperties = this.schema["maxProperties"];

            // count the number of properties that we currently have
            var propertyCount = 0;
            for (var k in this.data)
            {
                propertyCount++;
            }

            return propertyCount <= maxProperties;
        },

        /**
         * Validate maxProperties schema property.
         *
         * @returns {Boolean} whether maxProperties is satisfied
         */
        _validateMinProperties: function()
        {
            if (typeof(this.schema["minProperties"]) == "undefined")
            {
                return true;
            }

            var minProperties = this.schema["minProperties"];

            // count the number of properties that we currently have
            var propertyCount = 0;
            for (var k in this.data)
            {
                propertyCount++;
            }

            return propertyCount >= minProperties;
        },


        ///////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // DEPENDENCIES
        //
        ///////////////////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Shows or hides a property's field based on how its dependencies evaluate.
         * If a property doesn't have dependencies, this no-ops.
         *
         * @param propertyId
         */
        showOrHidePropertyBasedOnDependencies: function(propertyId)
        {
            var self = this;

            var item = this.childrenByPropertyId[propertyId];
            if (!item)
            {
                return Alpaca.throwErrorWithCallback("Missing property: " + propertyId, self.errorCallback);
            }

            var valid = this.determineAllDependenciesValid(propertyId);
            if (valid)
            {
                item.show();
                item.onDependentReveal();
            }
            else
            {
                item.hide();
                item.onDependentConceal();
            }

            item.getFieldEl().trigger("fieldupdate");
        },

        /**
         * Helper function for resolving dependencies for a child property.
         * This takes into account JSON Schema v4 and also provides for legacy v3 support.
         *
         * @param propertyId
         */
        getChildDependencies: function(propertyId)
        {
            // first, check for dependencies declared within the object (container)
            var itemDependencies = null;
            if (this.schema.dependencies)
            {
                itemDependencies = this.schema.dependencies[propertyId];
            }
            if (!itemDependencies)
            {
                // second, check for dependencies declared on the item itself
                // this is to support legacy v3 json schema
                var item = this.childrenByPropertyId[propertyId];
                if (item)
                {
                    itemDependencies = item.schema.dependencies;
                }
            }

            return itemDependencies;
        },

        getChildConditionalDependencies: function(propertyId)
        {
            var itemConditionalDependencies = null;

            // second, check for conditional dependencies declared on the item itself
            // this is to support legacy v3 json options
            var item = this.childrenByPropertyId[propertyId];
            if (item)
            {
                itemConditionalDependencies = item.options.dependencies;
            }

            return itemConditionalDependencies;
        },

        /**
         * Determines whether the dependencies for a property pass.
         *
         * @param propertyId
         */
        determineAllDependenciesValid: function(propertyId)
        {
            var self = this;

            var item = this.childrenByPropertyId[propertyId];
            if (!item)
            {
                return Alpaca.throwErrorWithCallback("Missing property: " + propertyId, self.errorCallback);
            }

            // first check for dependencies declared within the object (container)
            var itemDependencies = self.getChildDependencies(propertyId);;
            if (!itemDependencies)
            {
                // no dependencies, so yes, we pass
                return true;
            }

            var valid = true;
            if (Alpaca.isString(itemDependencies))
            {
                valid = self.determineSingleDependencyValid(propertyId, itemDependencies);
            }
            else if (Alpaca.isArray(itemDependencies))
            {
                $.each(itemDependencies, function(index, value) {
                    valid = valid && self.determineSingleDependencyValid(propertyId, value);
                });
            }

            return valid;
        },

        /**
         * Binds field updates to any field dependencies.
         *
         * @param propertyId
         */
        bindDependencyFieldUpdateEvent: function(propertyId)
        {
            var self = this;

            var item = this.childrenByPropertyId[propertyId];
            if (!item)
            {
                return Alpaca.throwErrorWithCallback("Missing property: " + propertyId, self.errorCallback);
            }

            var itemDependencies = self.getChildDependencies(propertyId);
            if (!itemDependencies)
            {
                // no dependencies, so simple return
                return true;
            }

            // helper function
            var bindEvent = function(propertyId, dependencyPropertyId)
            {
                // dependencyPropertyId is the identifier for the property that the field "propertyId" is dependent on

                var dependentField = Alpaca.resolveField(self, dependencyPropertyId);
                if (dependentField)
                {
                    dependentField.getFieldEl().bind("fieldupdate", (function(propertyField, dependencyField, propertyId, dependencyPropertyId) {

                        return function(event)
                        {
                            // the property "dependencyPropertyId" changed and affects target property ("propertyId")

                            // update UI state for target property
                            self.showOrHidePropertyBasedOnDependencies(propertyId);

                            propertyField.getFieldEl().trigger("fieldupdate");
                        };

                    })(item, dependentField, propertyId, dependencyPropertyId));

                    // trigger field update
                    dependentField.getFieldEl().trigger("fieldupdate");
                }
            };

            if (Alpaca.isString(itemDependencies))
            {
                bindEvent(propertyId, itemDependencies);
            }
            else if (Alpaca.isArray(itemDependencies))
            {
                $.each(itemDependencies, function(index, value) {
                    bindEvent(propertyId, value);
                });
            }
        },

        refreshDependentFieldStates: function(propertyId)
        {
            var self = this;

            var propertyField = this.childrenByPropertyId[propertyId];
            if (!propertyField)
            {
                return Alpaca.throwErrorWithCallback("Missing property: " + propertyId, self.errorCallback);
            }

            var itemDependencies = self.getChildDependencies(propertyId);
            if (!itemDependencies)
            {
                // no dependencies, so simple return
                return true;
            }

            // helper function
            var triggerFieldUpdateForProperty = function(otherPropertyId)
            {
                var dependentField = Alpaca.resolveField(self, otherPropertyId);
                if (dependentField)
                {
                    // trigger field update
                    dependentField.getFieldEl().trigger("fieldupdate");
                }
            };

            if (Alpaca.isString(itemDependencies))
            {
                triggerFieldUpdateForProperty(itemDependencies);
            }
            else if (Alpaca.isArray(itemDependencies))
            {
                $.each(itemDependencies, function(index, value) {
                    triggerFieldUpdateForProperty(value);
                });
            }
        },

        /**
         * Checks whether a single property's dependency is satisfied or not.
         *
         * In order to be valid, the property's dependency must exist (JSON schema) and optionally must satisfy
         * any dependency options (value matches using an AND).  Finally, the dependency field must be showing.
         *
         * @param {Object} propertyId Field property id.
         * @param {Object} dependentOnPropertyId Property id of the dependency field.
         *
         * @returns {Boolean} True if all dependencies have been satisfied and the field needs to be shown,
         * false otherwise.
         */
        determineSingleDependencyValid: function(propertyId, dependentOnPropertyId)
        {
            var self = this;

            // checks to see if the referenced "dependent-on" property has a value
            // basic JSON-schema supports this (if it has ANY value, it is considered valid
            // special consideration for boolean false
            var dependentOnField = Alpaca.resolveField(self, dependentOnPropertyId);
            if (!dependentOnField)
            {
                // no dependent-on field found, return false
                return false;
            }

            var dependentOnData = dependentOnField.getValue();

            // assume it isn't valid
            var valid = false;

            // go one of two directions depending on whether we have conditional dependencies or not
            var conditionalDependencies = this.getChildConditionalDependencies(propertyId);
            if (!conditionalDependencies || conditionalDependencies.length === 0)
            {
                //
                // BASIC DEPENENDENCY CHECKING (CORE JSON SCHEMA)
                //

                // special case: if the field is a boolean field and we have no conditional dependency checking,
                // then we set valid = false if the field data is a boolean false
                if (dependentOnField.getType() === "boolean" && !this.childrenByPropertyId[propertyId].options.dependencies && !dependentOnData)
                {
                    valid = false;
                }
                else
                {
                    valid = !Alpaca.isValEmpty(dependentOnData);
                }
            }
            else
            {
                //
                // CONDITIONAL DEPENDENCY CHECKING (ALPACA EXTENSION VIA OPTIONS)
                //

                // Alpaca extends JSON schema by allowing dependencies to trigger only for specific values on the
                // dependent fields.  If options are specified to define this, we walk through and perform an
                // AND operation across any fields

                // do some data sanity cleanup
                if (dependentOnField.getType() === "boolean" && !dependentOnData) {
                    dependentOnData = false;
                }

                var conditionalData = conditionalDependencies[dependentOnPropertyId];

                // if the option is a function, then evaluate the function to determine whether to show
                // the function evaluates regardless of whether the schema-based fallback determined we should show
                if (!Alpaca.isEmpty(conditionalData) && Alpaca.isFunction(conditionalData))
                {
                    valid = conditionalData.call(this, dependentOnData);
                }
                else
                {
                    // assume true
                    valid = true;

                    // the conditional data is an array of values
                    if (Alpaca.isArray(conditionalData)) {

                        // check array value
                        if (!Alpaca.anyEquality(dependentOnData, conditionalData))
                        {
                            valid = false;
                        }
                    }
                    else
                    {
                        // check object value
                        if (!Alpaca.isEmpty(conditionalData) && !Alpaca.anyEquality(conditionalData, dependentOnData))
                        {
                            valid = false;
                        }
                    }
                }
            }

            //
            // NESTED HIDDENS DEPENDENCY HIDES (ALPACA EXTENSION)
            //

            // final check: only set valid if the dependentOnPropertyId is showing
            if (dependentOnField && dependentOnField.isHidden())
            {
                valid = false;
            }

            return valid;
        },

        /**
         * Gets child index.
         *
         * @param {Object} propertyId Child field property ID.
         */
        getIndex: function(propertyId)
        {
            if (Alpaca.isEmpty(propertyId)) {
                return -1;
            }
            for (var i = 0; i < this.children.length; i++) {
                var pid = this.children[i].propertyId;
                if (pid == propertyId) { // jshint ignore:line
                    return i;
                }
            }
            return -1;
        },



        ///////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // DYNAMIC METHODS
        //
        ///////////////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Adds an item to the object.
         *
         * @param {String} propertyId Child field property ID.
         * @param {Object} itemSchema schema
         * @param {Object} fieldOptions Child field options.
         * @param {Any} value Child field value
         * @param {String} insertAfterId Location where the child item will be inserted.
         * @param [Function} callback called once the item has been added
         */
        addItem: function(propertyId, itemSchema, itemOptions, itemData, insertAfterId, callback)
        {
            var self = this;

            this.createItem(propertyId, itemSchema, itemOptions, itemData, insertAfterId, function(child) {

                var index = null;
                if (insertAfterId && self.childrenById[insertAfterId])
                {
                    for (var z = 0; z < self.children.length; z++)
                    {
                        if (self.children[z].getId() == insertAfterId)
                        {
                            index = z;
                            break;
                        }
                    }
                }

                // register the child
                self.registerChild(child, ((index != null) ? index + 1 : 0));

                // insert into dom
                self.doAddItem(index, child);

                // updates dom markers for this element and any siblings
                self.handleRepositionDOMRefresh();

                // update the array item toolbar state
                //self.updateToolbars();

                // refresh validation state
                self.refreshValidationState(true, function() {

                    // dispatch event: add
                    self.trigger("add", child);

                    // trigger update
                    self.triggerUpdate();

                    // trigger "ready"
                    child.triggerWithPropagation.call(child, "ready", "down");

                    if (callback)
                    {
                        Alpaca.nextTick(function() {
                            callback();
                        });
                    }

                });
            });
        },

        doAddItem: function(index, item)
        {
            var self = this;

            // insert into dom
            if (!index)
            {
                // insert first into container
                $(self.container).prepend(item.containerItemEl);
            }
            else
            {
                // insert at a specific index
                var existingElement = self.getContainerEl().children("[data-alpaca-container-item-index='" + index + "']");
                if (existingElement && existingElement.length > 0)
                {
                    // insert after
                    existingElement.after(item.containerItemEl);
                }
            }

            self.doAfterAddItem(item, function() {

                // trigger ready
                Alpaca.fireReady(item);

            });

        },

        doAfterAddItem: function(item, callback)
        {
            callback();
        },

        doResolveItemContainer: function()
        {
            var self = this;

            return $(self.container);
        },

        /**
         * Removes an item from the object.
         *
         * @param propertyId
         * @param callback
         */
        removeItem: function(propertyId, callback)
        {
            var self = this;

            var childField = this.childrenByPropertyId[propertyId];
            if (childField)
            {
                this.children = $.grep(this.children, function (val, index) {
                    return (val.propertyId !== propertyId);
                });

                delete this.childrenByPropertyId[propertyId];
                delete this.childrenById[childField.getId()];

                // remove itemContainerEl from DOM
                self.doRemoveItem(childField);

                this.refreshValidationState(true, function () {

                    // updates dom markers for this element and any siblings
                    self.handleRepositionDOMRefresh();

                    // dispatch event: remove
                    self.trigger("remove", childField);

                    // trigger update handler
                    self.triggerUpdate();

                    if (callback)
                    {
                        Alpaca.nextTick(function() {
                            callback();
                        });
                    }
                });
            }
            else
            {
                callback();
            }
        },

        doRemoveItem: function(item)
        {
            var self = this;

            var removeItemContainer = self.doResolveItemContainer();

            removeItemContainer.children(".alpaca-container-item[data-alpaca-container-item-name='" + item.name + "']").remove();

            // destroy child field itself
            item.destroy();
        },

        ///////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // WIZARD
        //
        ///////////////////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Wraps the current object into a wizard container and wires up the navigation and buttons so that
         * wizard elements flip nicely.
         */
        wizard: function()
        {
            var self = this;

            // config-driven
            var stepDescriptors = this.wizardConfigs.steps;
            if (!stepDescriptors)
            {
                stepDescriptors = [];
            }
            var wizardTitle = this.wizardConfigs.title;
            var wizardDescription = this.wizardConfigs.description;
            var buttonDescriptors = this.wizardConfigs.buttons;
            if (!buttonDescriptors)
            {
                buttonDescriptors = {};
            }
            if (!buttonDescriptors["previous"])
            {
                buttonDescriptors["previous"] = {}
            }
            if (!buttonDescriptors["previous"].title)
            {
                buttonDescriptors["previous"].title = "Previous";
            }
            if (!buttonDescriptors["previous"].align)
            {
                buttonDescriptors["previous"].align = "left";
            }
            if (!buttonDescriptors["previous"].type)
            {
                buttonDescriptors["previous"].type = "button";
            }
            if (!buttonDescriptors["next"])
            {
                buttonDescriptors["next"] = {}
            }
            if (!buttonDescriptors["next"].title)
            {
                buttonDescriptors["next"].title = "Next";
            }
            if (!buttonDescriptors["next"].align)
            {
                buttonDescriptors["next"].align = "right";
            }
            if (!buttonDescriptors["next"].type)
            {
                buttonDescriptors["next"].type = "button";
            }

            if (!this.wizardConfigs.hideSubmitButton)
            {
                if (!buttonDescriptors["submit"]) {
                    buttonDescriptors["submit"] = {}
                }
                if (!buttonDescriptors["submit"].title) {
                    buttonDescriptors["submit"].title = "Submit";
                }
                if (!buttonDescriptors["submit"].align) {
                    buttonDescriptors["submit"].align = "right";
                }
                if (!buttonDescriptors["submit"].type) {
                    buttonDescriptors["submit"].type = "button";
                }
            }

            for (var buttonKey in buttonDescriptors)
            {
                if (!buttonDescriptors[buttonKey].type)
                {
                    buttonDescriptors[buttonKey].type = "button";
                }
            }
            var showSteps = this.wizardConfigs.showSteps;
            if (typeof(showSteps) == "undefined")
            {
                showSteps = true;
            }
            var showProgressBar = this.wizardConfigs.showProgressBar;
            var performValidation = this.wizardConfigs.validation;
            if (typeof(performValidation) == "undefined")
            {
                performValidation = true;
            }

            // DOM-driven configuration
            var wizardTitle = $(this.field).attr("data-alpaca-wizard-title");
            var wizardDescription = $(this.field).attr("data-alpaca-wizard-description");
            var _wizardValidation = $(this.field).attr("data-alpaca-wizard-validation");
            if (typeof(_wizardValidation) != "undefined")
            {
                performValidation = _wizardValidation ? true : false;
            }
            var _wizardShowSteps = $(this.field).attr("data-alpaca-wizard-show-steps");
            if (typeof(_wizardShowSteps) != "undefined")
            {
                showSteps = _wizardShowSteps ? true : false;
            }
            var _wizardShowProgressBar = $(this.field).attr("data-alpaca-wizard-show-progress-bar");
            if (typeof(_wizardShowProgressBar) != "undefined")
            {
                showProgressBar = _wizardShowProgressBar ? true : false;
            }

            // find all of the steps
            var stepEls = $(this.field).find("[data-alpaca-wizard-role='step']");

            // DOM-driven configuration of step descriptors
            if (stepDescriptors.length == 0)
            {
                stepEls.each(function(i) {

                    var stepDescriptor = {};

                    var stepTitle = $(this).attr("data-alpaca-wizard-step-title");
                    if (typeof(stepTitle) != "undefined")
                    {
                        stepDescriptor.title = stepTitle;
                    }
                    if (!stepDescriptor.title)
                    {
                        stepDescriptor.title = "Step " + i;
                    }

                    var stepDescription = $(this).attr("data-alpaca-wizard-step-description");
                    if (typeof(stepDescription) != "undefined")
                    {
                        stepDescriptor.description = stepDescription;
                    }
                    if (!stepDescriptor.description)
                    {
                        stepDescriptor.description = "Step " + i;
                    }

                    stepDescriptors.push(stepDescriptor);
                });
            }

            // assume something for progress bar if not specified
            if (typeof(showProgressBar) == "undefined")
            {
                if (stepDescriptors.length > 1)
                {
                    showProgressBar = true;
                }
            }


            // model for use in rendering the wizard
            var model = {};
            model.wizardTitle = wizardTitle;
            model.wizardDescription = wizardDescription;
            model.showSteps = showSteps;
            model.performValidation = performValidation;
            model.steps = stepDescriptors;
            model.buttons = buttonDescriptors;
            model.schema = self.schema;
            model.options = self.options;
            model.data = self.data;
            model.showProgressBar = showProgressBar;
            model.markAllStepsVisited = this.wizardConfigs.markAllStepsVisited;
            model.view = self.view;

            // render the actual wizard
            var wizardTemplateDescriptor = self.view.getTemplateDescriptor("wizard", self);
            if (wizardTemplateDescriptor)
            {
                var wizardEl = Alpaca.tmpl(wizardTemplateDescriptor, model);

                $(self.field).append(wizardEl);

                var wizardNav = $(wizardEl).find(".alpaca-wizard-nav");
                var wizardSteps = $(wizardEl).find(".alpaca-wizard-steps");
                var wizardButtons = $(wizardEl).find(".alpaca-wizard-buttons");
                var wizardProgressBar = $(wizardEl).find(".alpaca-wizard-progress-bar");

                // move steps into place
                $(wizardSteps).append(stepEls);

                (function(wizardNav, wizardSteps, wizardButtons, model) {

                    var currentIndex = 0;

                    var previousButtonEl = $(wizardButtons).find("[data-alpaca-wizard-button-key='previous']");
                    var nextButtonEl = $(wizardButtons).find("[data-alpaca-wizard-button-key='next']");
                    var submitButtonEl = $(wizardButtons).find("[data-alpaca-wizard-button-key='submit']");

                    // snap into place a little controller to work the buttons
                    // assume the first step
                    var refreshSteps = function()
                    {
                        // NAV
                        if (model.showSteps)
                        {
                            if (!model.visits)
                            {
                                model.visits = {};
                            }

                            // optionally mark all steps as visited
                            if (model.markAllStepsVisited)
                            {
                                var stepElements = $(wizardNav).find("[data-alpaca-wizard-step-index]");
                                for (var g = 0; g < stepElements.length; g++)
                                {
                                    model.visits[g] = true;
                                }
                            }

                            // mark current step as visited
                            model.visits[currentIndex] = true;

                            var stepElements = $(wizardNav).find("[data-alpaca-wizard-step-index]");
                            $(stepElements).removeClass("disabled");
                            $(stepElements).removeClass("completed");
                            $(stepElements).removeClass("active");
                            $(stepElements).removeClass("visited");
                            for (var g = 0; g < stepElements.length; g++)
                            {
                                if (g < currentIndex)
                                {
                                    $(wizardNav).find("[data-alpaca-wizard-step-index='" + g + "']").addClass("completed");
                                }
                                else if (g === currentIndex)
                                {
                                    $(wizardNav).find("[data-alpaca-wizard-step-index='" + g + "']").addClass("active");
                                }
                                else
                                {
                                    if (model.visits && model.visits[g])
                                    {
                                        // do not mark disabled for this case
                                    }
                                    else
                                    {
                                        $(wizardNav).find("[data-alpaca-wizard-step-index='" + g + "']").addClass("disabled");
                                    }

                                }

                                if (model.visits && model.visits[g])
                                {
                                    $(wizardNav).find("[data-alpaca-wizard-step-index='" + g + "']").addClass("visited");
                                }
                            }
                        }

                        // PROGRESS BAR
                        if (model.showProgressBar)
                        {
                            var valueNow = currentIndex + 1;
                            var valueMax = model.steps.length + 1;
                            var width = parseInt(((valueNow / valueMax) * 100), 10) + "%";

                            $(wizardProgressBar).find(".progress-bar").attr("aria-valuemax", valueMax);
                            $(wizardProgressBar).find(".progress-bar").attr("aria-valuenow", valueNow);
                            $(wizardProgressBar).find(".progress-bar").css("width", width);
                        }


                        // BUTTONS

                        // hide everything
                        previousButtonEl.hide();
                        nextButtonEl.hide();
                        submitButtonEl.hide();

                        // simple case
                        if (model.steps.length == 1)
                        {
                            submitButtonEl.show();
                        }
                        else if (model.steps.length > 1)
                        {
                            if (currentIndex > 0)
                            {
                                previousButtonEl.show();
                            }

                            nextButtonEl.show();

                            if (currentIndex == 0)
                            {
                                nextButtonEl.show();
                            }
                            else if (currentIndex == model.steps.length - 1)
                            {
                                nextButtonEl.hide();
                                submitButtonEl.show();
                            }
                        }

                        // hide all steps
                        $(wizardSteps).find("[data-alpaca-wizard-role='step']").hide();
                        $($(wizardSteps).find("[data-alpaca-wizard-role='step']")[currentIndex]).show();

                    };

                    var assertValidation = function(buttonId, callback)
                    {
                        if (!model.performValidation)
                        {
                            callback(true);
                            return;
                        }

                        // collect all of the fields on the current step
                        var fields = [];

                        var currentStepEl = $($(wizardSteps).find("[data-alpaca-wizard-role='step']")[currentIndex]);
                        $(currentStepEl).find(".alpaca-field").each(function() {
                            var fieldId = $(this).attr("data-alpaca-field-id");
                            if (fieldId)
                            {
                                var field = self.childrenById[fieldId];
                                if (field)
                                {
                                    fields.push(field);
                                }
                            }
                        });

                        // wrap into validation functions
                        var fns = [];
                        for (var i = 0; i < fields.length; i++)
                        {
                            fns.push(function(field) {
                                return function(_done)
                                {
                                    field.refreshValidationState(true, function() {
                                        _done();
                                    });
                                }
                            }(fields[i]));
                        }

                        // run all validations
                        Alpaca.parallel(fns, function() {

                            var valid = true;
                            for (var i = 0; i < fields.length; i++)
                            {
                                valid = valid && fields[i].isValid(true);
                            }

                            // custom validation function?
                            var b = model.buttons[buttonId];
                            if (b && b.validate)
                            {
                                b.validate.call(self, function(_valid) {
                                    valid = valid && _valid;
                                    callback(valid);
                                });
                            }
                            else
                            {
                                callback(valid);
                            }
                        });
                    };

                    $(previousButtonEl).click(function(e) {
                        e.preventDefault();

                        if (currentIndex >= 1)
                        {
                            //assertValidation("previous", function(valid) {

                                //if (valid)
                                //{
                                    var b = model.buttons["previous"];
                                    if (b)
                                    {
                                        if (b.click)
                                        {
                                            b.click.call(self, e);
                                        }
                                    }

                                    currentIndex--;

                                    refreshSteps();
                                //}
                            //});
                        }
                    });

                    $(nextButtonEl).click(function(e) {
                        e.preventDefault();

                        if (currentIndex + 1 <= model.steps.length - 1)
                        {
                            assertValidation("next", function(valid) {

                                if (valid)
                                {
                                    var b = model.buttons["next"];
                                    if (b)
                                    {
                                        if (b.click)
                                        {
                                            b.click.call(self, e);
                                        }
                                    }

                                    currentIndex++;

                                    refreshSteps();
                                }
                                else
                                {
                                    // allow focus to settle on invalid field
                                    window.setTimeout(function() {
                                        self.focus(function(field) {
                                            // done
                                        });
                                    }, 250);
                                }
                            });
                        }
                    });

                    $(submitButtonEl).click(function(e) {
                        e.preventDefault();

                        if (currentIndex === model.steps.length - 1)
                        {
                            assertValidation("submit", function(valid) {

                                if (valid)
                                {
                                    var b = model.buttons["submit"];
                                    if (b)
                                    {
                                        if (b.click)
                                        {
                                            b.click.call(self, e);
                                        }
                                        else
                                        {
                                            // are we in a form?
                                            if (self.form)
                                            {
                                                self.form.submit();
                                            }
                                        }
                                    }
                                }
                                else
                                {
                                    // allow focus to settle on invalid field
                                    window.setTimeout(function() {
                                        self.focus(function(field) {
                                            // done
                                        });
                                    }, 250);
                                }
                            });
                        }
                    });

                    // all custom buttons
                    $(wizardButtons).find("[data-alpaca-wizard-button-key]").each(function() {
                        var key = $(this).attr("data-alpaca-wizard-button-key");
                        if (key != "submit" && key != "next" && key != "previous") { // standard buttons have different behavior
                            var b = model.buttons[key];
                            if (b && b.click) {
                                $(this).click(function (b) {
                                    return function (e) {
                                        b.click.call(self, e);
                                    };
                                }(b));
                            }
                        }
                    });

                    $(wizardNav).find("[data-alpaca-wizard-step-index]").click(function(e) {
                        e.preventDefault();

                        var navIndex = $(this).attr("data-alpaca-wizard-step-index");
                        if (navIndex)
                        {
                            navIndex = parseInt(navIndex, 10);

                            if (navIndex == currentIndex || (model.visits && model.visits[navIndex]))
                            {
                                // if we're going backwards, then we do not run validation
                                if (navIndex < currentIndex)
                                {
                                    currentIndex = navIndex;
                                    refreshSteps();
                                }
                                else if (navIndex > currentIndex)
                                {
                                    assertValidation(null, function(valid) {

                                        if (valid)
                                        {
                                            currentIndex = navIndex;
                                            refreshSteps();
                                        }
                                    });
                                }
                                else
                                {
                                    // current item should not be clickable
                                }
                            }
                        }
                    });

                    self.on("moveToStep", function(event) {

                        var index = event.index;
                        var skipValidation = event.skipValidation;

                        if ((typeof(index) !== "undefined") && index <= model.steps.length - 1)
                        {
                            if (skipValidation)
                            {
                                currentIndex = index;
                                refreshSteps();
                            }
                            else
                            {
                                assertValidation(null, function(valid) {

                                    if (valid)
                                    {
                                        currentIndex = index;

                                        refreshSteps();
                                    }
                                });
                            }
                        }
                    });

                    self.on("advanceOrSubmit", function(event) {

                        assertValidation(null, function(valid) {

                            if (valid)
                            {
                                if (currentIndex === model.steps.length - 1)
                                {
                                    $(submitButtonEl).click();
                                }
                                else
                                {
                                    $(nextButtonEl).click();
                                }
                            }
                        });
                    });


                    refreshSteps();

                }(wizardNav, wizardSteps, wizardButtons, model));
            }
        },

        /**
         * Renders a configuration-based wizard without a layout template.
         */
        autoWizard: function()
        {
            var stepBindings = this.wizardConfigs.bindings;
            if (!stepBindings)
            {
                stepBindings = {};
            }

            for (var propertyId in this.childrenByPropertyId)
            {
                if (!stepBindings.hasOwnProperty(propertyId))
                {
                    stepBindings[propertyId] = 1;
                }
            }

            // should we create steps?
            var createSteps = true;
            if ($(this.field).find("[data-alpaca-wizard-role='step']").length > 0)
            {
                // already there
                createSteps = false;
            }

            var step = 1;
            var stepFields = [];
            do
            {
                // collect fields in this step
                stepFields = [];
                for (var propertyId in stepBindings)
                {
                    if (stepBindings[propertyId] === step)
                    {
                        if (this.childrenByPropertyId && this.childrenByPropertyId[propertyId])
                        {
                            //col.push(this.childrenByPropertyId[propertyId].field);
                            //col.push(this.childrenByPropertyId[propertyId].containerItemEl);
                            stepFields.push(this.childrenByPropertyId[propertyId]);
                        }
                    }
                }

                if (stepFields.length > 0)
                {
                    var stepEl = null;
                    if (createSteps)
                    {
                        stepEl = $('<div data-alpaca-wizard-role="step"></div>');
                        $(this.field).append(stepEl);
                    }
                    else
                    {
                        stepEl = $($(this.field).find("[data-alpaca-wizard-role='step']")[step-1]);
                    }

                    // is there any order information in the items?
                    var hasOrderInformation = false;
                    for (var i = 0; i < stepFields.length; i++) {
                        if (typeof(stepFields[i].options.order) !== "undefined") {
                            hasOrderInformation = true;
                            break;
                        }
                    }

                    if (hasOrderInformation)
                    {
                        // sort by order?
                        stepFields.sort(function (a, b) {

                            var orderA = a.options.order;
                            if (!orderA)
                            {
                                orderA = 0;
                            }
                            var orderB = b.options.order;
                            if (!orderB)
                            {
                                orderB = 0;
                            }

                            return (orderA - orderB);
                        });
                    }

                    // move elements in
                    for (var i = 0; i < stepFields.length; i++)
                    {
                        $(stepEl).append(stepFields[i].containerItemEl);
                    }

                    step++;
                }
            }
            while (stepFields.length > 0);

            // now run the normal wizard
            this.wizard();

            // if the container element doesn't have any children left, hide it
            if ($(this.container).children().length === 0) {
                $(this.container).css("display", "none");
            }
        },

        /**
         * @see Alpaca.Field#getType
         */
        getType: function() {
            return "object";
        },

        /**
         * Moves a field.
         *
         * @param {Number} sourceIndex the index of the child to be moved
         * @param {Number} targetIndex the index to which the child should be moved
         * @param [Boolean] animate whether to animate the movement
         * @param [Function] callback called after the child is added
         */
        moveItem: function(sourceIndex, targetIndex, animate, callback)
        {
            var self = this;

            if (typeof(animate) == "function")
            {
                callback = animate;
                animate = self.options.animate;
            }

            if (typeof(animate) == "undefined")
            {
                animate = self.options.animate ? self.options.animate : true;
            }

            if (typeof(sourceIndex) === "string")
            {
                sourceIndex = parseInt(sourceIndex, 10);
            }

            if (typeof(targetIndex) === "string")
            {
                targetIndex = parseInt(targetIndex, 10);
            }

            if (targetIndex < 0)
            {
                targetIndex = 0;
            }
            if (targetIndex >= self.children.length)
            {
                targetIndex = self.children.length - 1;
            }

            if (targetIndex === -1)
            {
                // nothing to swap with
                return;
            }

            var targetChild = self.children[targetIndex];
            if (!targetChild)
            {
                // target child not found
                return;
            }

            // the source and target DOM elements
            var sourceContainer = self.getContainerEl().children("[data-alpaca-container-item-index='" + sourceIndex + "']");
            var targetContainer = self.getContainerEl().children("[data-alpaca-container-item-index='" + targetIndex + "']");

            // create two temp elements as markers for switch
            var tempSourceMarker = $("<div class='tempMarker1'></div>");
            sourceContainer.before(tempSourceMarker);
            var tempTargetMarker = $("<div class='tempMarker2'></div>");
            targetContainer.before(tempTargetMarker);

            var onComplete = function()
            {
                // swap order in children
                var tempChildren = [];
                for (var i = 0; i < self.children.length; i++)
                {
                    if (i === sourceIndex)
                    {
                        tempChildren[i] = self.children[targetIndex];
                    }
                    else if (i === targetIndex)
                    {
                        tempChildren[i] = self.children[sourceIndex];
                    }
                    else
                    {
                        tempChildren[i] = self.children[i];
                    }
                }
                self.children = tempChildren;

                // swap order in DOM
                tempSourceMarker.replaceWith(targetContainer);
                tempTargetMarker.replaceWith(sourceContainer);

                // updates dom markers for this element and any siblings
                self.handleRepositionDOMRefresh();

                // update the action bar bindings
                $(sourceContainer).find("[data-alpaca-array-actionbar-item-index='" + sourceIndex + "']").attr("data-alpaca-array-actionbar-item-index", targetIndex);
                $(targetContainer).find("[data-alpaca-array-actionbar-item-index='" + targetIndex + "']").attr("data-alpaca-array-actionbar-item-index", sourceIndex);

                // refresh validation state
                self.refreshValidationState();

                // trigger update
                self.triggerUpdate();

                // dispatch event: move
                self.trigger("move");

                if (callback)
                {
                    callback();
                }
            };

            if (animate)
            {
                // swap divs visually
                Alpaca.animatedSwap(sourceContainer, targetContainer, 500, function() {
                    onComplete();
                });
            }
            else
            {
                onComplete();
            }
        },


        /* builder_helpers */

        /**
         * @see Alpaca.Field#getTitle
         */
        getTitle: function() {
            return "Object Field";
        },

        /**
         * @see Alpaca.Field#getDescription
         */
        getDescription: function() {
            return "Object field for containing other fields";
        },

        /**
         * @private
         * @see Alpaca.ContainerField#getSchemaOfSchema
         */
        getSchemaOfSchema: function() {
            var properties = {
                "properties": {
                    "properties": {
                        "title": "Properties",
                        "description": "List of child properties.",
                        "type": "object"
                    },
                    "maxProperties": {
                        "type": "number",
                        "title": "Maximum Number Properties",
                        "description": "The maximum number of properties that this object is allowed to have"
                    },
                    "minProperties": {
                        "type": "number",
                        "title": "Minimum Number of Properties",
                        "description": "The minimum number of properties that this object is required to have"
                    }
                }
            };

            var fieldsProperties = properties.properties.properties;

            fieldsProperties.properties = {};

            if (this.children) {
                for (var i = 0; i < this.children.length; i++) {
                    var propertyId = this.children[i].propertyId;
                    fieldsProperties.properties[propertyId] = this.children[i].getSchemaOfSchema();
                    fieldsProperties.properties[propertyId].title = propertyId + " :: " + fieldsProperties.properties[propertyId].title;
                }
            }

            return Alpaca.merge(this.base(), properties);
        },

        /**
         * @private
         * @see Alpaca.ContainerField#getSchemaOfOptions
         */
        getSchemaOfOptions: function() {
            var schemaOfOptions = Alpaca.merge(this.base(), {
                "properties": {
                },
                "order": {
                    "type": "number",
                    "title": "Order",
                    "description": "Allows for optional specification of the index of this field in the properties array."
                }
            });

            var properties = {
                "properties": {
                    "fields": {
                        "title": "Field Options",
                        "description": "List of options for child fields.",
                        "type": "object"
                    }
                }
            };

            var fieldsProperties = properties.properties.fields;

            fieldsProperties.properties = {};

            if (this.children) {
                for (var i = 0; i < this.children.length; i++) {
                    var propertyId = this.children[i].propertyId;
                    fieldsProperties.properties[propertyId] = this.children[i].getSchemaOfOptions();
                    fieldsProperties.properties[propertyId].title = propertyId + " :: " + fieldsProperties.properties[propertyId].title;
                }
            }

            return Alpaca.merge(schemaOfOptions, properties);
        }

        /* end_builder_helpers */
    });

    // Additional Registrations
    Alpaca.registerMessages({
        "tooManyProperties": "The maximum number of properties ({0}) has been exceeded.",
        "tooFewProperties": "There are not enough properties ({0} are required)"
    });

    Alpaca.registerFieldClass("object", Alpaca.Fields.ObjectField);
    Alpaca.registerDefaultSchemaFieldMapping("object", "object");

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.AnyField = Alpaca.ControlField.extend(
    /**
     * @lends Alpaca.Fields.AnyField.prototype
     */
    {
        /**
         * @see Alpaca.Field#getFieldType
         */
        getFieldType: function() {
            return "any";
        },

        /**
         * @see Alpaca.Field#setup
         */
        setup: function()
        {
            this.base();
        },

        /**
         * @see Alpaca.Fields.ControlField#getControlValue
         */
        getControlValue: function()
        {
            return this._getControlVal(true);
        },

        /**
         * @see Alpaca.Field#setValue
         */
        setValue: function(value)
        {
            if (Alpaca.isEmpty(value))
            {
                this.control.val("");
            }
            else
            {
                this.control.val(value);
            }

            // be sure to call into base method
            this.base(value);
        },

        /**
         * @see Alpaca.Field#disable
         */
        disable: function()
        {
            this.control.disabled = true;
        },

        /**
         * @see Alpaca.Field#enable
         */
        enable: function()
        {
            this.control.disabled = false;
        },

        /**
         * @see Alpaca.Field#focus
         */
        focus: function(onFocusCallback)
        {
            this.control.focus();

            if (onFocusCallback)
            {
                onFocusCallback(this);
            }
        },

        /**
         * @see Alpaca.Field#getType
         */
        getType: function() {
            return "any";
        }

        /* builder_helpers */
        ,

        /**
         * @see Alpaca.Field#getTitle
         */
        getTitle: function() {
            return "Any Field";
        },

        /**
         * @see Alpaca.Field#getDescription
         */
        getDescription: function() {
            return "Any field.";
        },

        /**
         * @private
         * @see Alpaca.ControlField#getSchemaOfSchema
         */
        getSchemaOfSchema: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                }
            });
        },

        /**
         * @private
         * @see Alpaca.ControlField#getOptionsForSchema
         */
        getOptionsForSchema: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                }
            });
        },

        /**
         * @private
         * @see Alpaca.ControlField#getSchemaOfOptions
         */
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                }
            });
        },

        /**
         * @private
         * @see Alpaca.ControlField#getOptionsForOptions
         */
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                }
            });
        }

        /* end_builder_helpers */
    });

    Alpaca.registerFieldClass("any", Alpaca.Fields.AnyField);
    Alpaca.registerDefaultSchemaFieldMapping("any", "any");

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.HiddenField = Alpaca.ControlField.extend(
    /**
     * @lends Alpaca.Fields.ControlField.prototype
     */
    {
        /**
         * @see Alpaca.ControlField#getFieldType
         */
        getFieldType: function()
        {
            return "hidden";
        },

        /**
         * @see Alpaca.Field#setup
         */
        setup: function()
        {
            this.base();
        },

        /**
         * @see Alpaca.Fields.ControlField#getControlValue
         */
        getControlValue: function()
        {
            return this._getControlVal(true);
        },

        /**
         * @see Alpaca.Field#setValue
         */
        setValue: function(value)
        {
            if (Alpaca.isEmpty(value)) {
                this.getControlEl().val("");
            } else {
                this.getControlEl().val(value);
            }

            // be sure to call into base method
            this.base(value);
        },

        /**
         * @see Alpaca.Field#getType
         */
        getType: function() {
            return "string";
        },


        /* builder_helpers */

        /**
         * @see Alpaca.Field#getTitle
         */
        getTitle: function() {
            return "Hidden";
        },

        /**
         * @see Alpaca.Field#getDescription
         */
        getDescription: function() {
            return "Field for a hidden HTML input";
        }

        /* end_builder_helpers */

    });

    Alpaca.registerFieldClass("hidden", Alpaca.Fields.HiddenField);

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.ListField = Alpaca.ControlField.extend(
    /**
     * @lends Alpaca.Fields.ListField.prototype
     */
    {
        /**
         * @see Alpaca.Field#setup
         */
        setup: function()
        {
            var self = this;

            self.base();

            self.selectOptions = [];

            if (self.getEnum())
            {
                // sort the enumerated values
                self.sortEnum();

                var optionLabels = self.getOptionLabels();

                $.each(self.getEnum(), function(index, value)
                {
                    var text = value;
                    if (optionLabels)
                    {
                        if (!Alpaca.isEmpty(optionLabels[index]))
                        {
                            text = optionLabels[index];
                        }
                        else if (!Alpaca.isEmpty(optionLabels[value]))
                        {
                            text = optionLabels[value];
                        }
                    }

                    self.selectOptions.push({
                        "value": value,
                        "text": text
                    });
                });
            }

            // if they provided "datasource", we copy to "dataSource"
            if (self.options.datasource && !self.options.dataSource) {
                self.options.dataSource = self.options.datasource;
                delete self.options.datasource;
            }

            // we optionally allow the data source return values to override the schema and options
            if (typeof(self.options.useDataSourceAsEnum) === "undefined")
            {
                self.options.useDataSourceAsEnum = true;
            }

            // make sure we convert any incoming data to our expected format
            self.setValue(this.data, true);
        },

        prepareControlModel: function(callback)
        {
            var self = this;

            this.base(function(model) {

                model.selectOptions = self.selectOptions;

                callback(model);
            });
        },

        populateDisplayableText: function(model)
        {
            var self = this;

            // build out "displayableText"
            var displayableTexts = [];
            var map = {};
            for (var i = 0; i < model.selectOptions.length; i++)
            {
                map[model.selectOptions[i].value] = model.selectOptions[i].text;
            }

            if (self.schema.type === "boolean")
            {
                displayableTexts.push("" + (model.data.length > 0));
            }
            else if (Alpaca.isArray(model.data))
            {
                for (var i = 0; i < model.data.length; i++)
                {
                    var text = map[model.data[i].value];
                    if (text)
                    {
                        displayableTexts.push(text);
                    }
                }
            }
            else
            {
                var text = map[model.data.value];
                if (text)
                {
                    displayableTexts.push(text);
                }
            }

            model.displayableText = displayableTexts.join(", ");
        },

        /**
         * @see Alpaca.ControlField#beforeRenderControl
         */
        beforeRenderControl: function(model, callback)
        {
            var self = this;

            var completionFn = function()
            {
                for (var i = 0; i < self.selectOptions.length; i++)
                {
                    for (var j = 0; j < self.data.length; j++)
                    {
                        if (self.data[j].value === self.selectOptions[i].value)
                        {
                            self.selectOptions[i].selected = true;
                        }
                    }
                }

                // if emptySelectFirst and we have options but no data, then auto-select first item in the options list
                if (self.data.length === 0 && self.options.emptySelectFirst && self.selectOptions.length > 0)
                {
                    self.selectOptions[0].selected = true;
                    self.data = [self.selectOptions[0]];
                }

                // likewise, we auto-assign first pick if field required
                if (self.data.length === 0 && self.isRequired() && self.selectOptions.length > 0)
                {
                    self.selectOptions[0].selected = true;
                    self.data = [self.selectOptions[0]];
                }

                callback();
            };

            this.base(model, function() {

                self.populateDisplayableText(model);

                if (self.options.dataSource)
                {
                    // clear the array
                    self.selectOptions.length = 0;

                    self.invokeDataSource(self.selectOptions, model, function() {

                        if (self.options.useDataSourceAsEnum)
                        {
                            // now build out the enum and optionLabels
                            var _enum = [];
                            var _optionLabels = [];
                            for (var i = 0; i < self.selectOptions.length; i++)
                            {
                                _enum.push(self.selectOptions[i].value);
                                _optionLabels.push(self.selectOptions[i].text);
                            }

                            self.setEnum(_enum);
                            self.setOptionLabels(_optionLabels);
                        }

                        completionFn();

                    });
                }
                else
                {
                    completionFn();
                }

            });
        },

        convertDataExternalToInternal: function(external)
        {
            var convertedValue = {};

            if (external.value) {
                convertedValue.value = external.value;
            } else if (external.id) {
                convertedValue.value = external.id;
            } else if (external.val) {
                convertedValue.value = external.val;
            } else if (external.v) {
                convertedValue.value = external.v;
            } else if (external.key) {
                convertedValue.value = external.key;
            }

            if (external.text) {
                convertedValue.text = external.text;
            } else if (external.title) {
                convertedValue.text = external.title;
            } else if (external.label) {
                convertedValue.text = external.label;
            }

            return convertedValue;
        },

        convertDataInternalToExternal: function(internal)
        {
            return {
                "value": internal.value,
                "text": internal.text
            };
        },

        // @Override
        bindData: function()
        {
        },

        /**
         * Retrieves the value of the control and formats it to the expected output/external format.
         *
         * @returns {*}
         */
        getValue: function()
        {
            var self = this;

            // for legacy support, in case data was set to null, set back to []
            if (this.data === null || typeof(this.data) === "undefined") {
                this.data = [];
            }

            var val = null;

            if (!self.schema.type || self.schema.type === "string")
            {
                var array = [];
                for (var i = 0; i < this.data.length; i++) {
                    array.push(this.data[i].value);
                }

                val = array.join(",");
            }
            else if (self.schema.type === "number")
            {
                if (this.data.length > 0)
                {
                    val = this.data[0].value;
                }
            }
            else if (self.schema.type === "boolean")
            {
                val = (this.data.length > 0);
            }
            else if (self.schema.type === "array")
            {
                var values = [];
                for (var i = 0; i < this.data.length; i++)
                {
                    if (self.schema.items && self.schema.items.type === "string")
                    {
                        values.push(this.data[i].value);
                    }
                    else
                    {
                        values.push(self.convertDataInternalToExternal(this.data[i]));
                    }
                }

                val = values;
            }
            else if (self.schema.type === "object")
            {
                if (this.data.length > 0)
                {
                    val = self.convertDataInternalToExternal(this.data[0]);
                }
            }

            return val;
        },

        /**
         * Converts the externally formatted data to an internal format and sets it onto the control.
         *
         * The external data nominally comes in as:
         *
         *    A comma-delimitted string
         *    An array of strings
         *    An array of objects
         *
         * In the latter case, the objects nominally look like:
         *
         *      [{
         *          "text": "",
         *          "value": ""
         *      }]
         *
         * But may also have other structures, such as this one which Cloud CMS uses:
         *
         *      [{
         *          "id": "",
         *          "ref": "",
         *          "title": "",
         *          ... other properties
         *      }]
         *
         * These are all converted the internal format, which looks like:
         *
         *      [{
         *          "text": "",
         *          "value": "">
         *      }]
         *
         * @param val
         * @param silent whether to refresh UI controls (defaults to false)
         *
         * @returns {*}
         */
        setValue: function(val, silent)
        {
            var self = this;

            var values = [];

            var handled = false;
            if (Alpaca.isEmpty(val) || val === "")
            {
                handled = true;
            }
            else if (Alpaca.isString(val))
            {
                values = val.split(",");
                for (var i = 0; i < values.length; i++)
                {
                    values[i] = values[i].trim();
                    values[i] = {
                        "text": values[i],
                        "value": values[i]
                    };
                }

                handled = true;
            }
            else if (Alpaca.isBoolean(val))
            {
                if (val)
                {
                    values.push({
                        "text": "",
                        "value": true
                    });
                }

                handled = true;
            }
            else if (Alpaca.isNumber(val))
            {
                values.push({
                    "text": "" + val,
                    "value": val
                });

                handled = true;
            }
            else if (Alpaca.isArray(val))
            {
                for (var i = 0; i < val.length; i++)
                {
                    if (Alpaca.isString(val[i])) {
                        values.push({
                            "text": "" + val[i],
                            "value": val[i]
                        });
                    } else if (Alpaca.isNumber(val[i])) {
                        values.push({
                            "text": "" + val[i],
                            "value": val[i]
                        });
                    } else {
                        values.push(self.convertDataExternalToInternal(val[i]));
                    }
                }

                handled = true;
            }
            else if (Alpaca.isObject(val))
            {
                values.push(self.convertDataExternalToInternal(val));

                handled = true;
            }

            if (!handled)
            {
                throw new Error("could not import data: " + val);
            }

            this.data = values;

            if (!silent)
            {
                self.afterSetValue();
            }
        },

        afterSetValue: function()
        {

        },

        /**
         * Finds if the value of this field is empty.
         *
         * @return {Boolean} True if the field value is empty, false otherwise.
         */
        isEmpty: function()
        {
            return this.data.length === 0;
        },

        /**
         * Validate against enum property.
         *
         * @returns {Boolean} True if the element value is part of the enum list, false otherwise.
         */
        _validateEnum: function()
        {
            var self = this;

            var _enum = self.getEnum();
            if (!_enum)
            {
                return true;
            }

            if (!this.isRequired() && self.data.length === 0)
            {
                return true;
            }

            var isValid = true;

            for (var i = 0; i < self.data.length; i++)
            {
                var inArray = Alpaca.inArray(_enum, self.data[i].value);
                if (!inArray)
                {
                    isValid = false;
                    break;
                }
            }

            return isValid;
        },

        /**
         * Validates if number of items has been less than minItems.
         * @returns {Boolean} true if number of items has been less than minItems
         */
        _validateMinItems: function()
        {
            if (this.schema.minItems && this.schema.minItems >= 0)
            {
                if (this.data.length < this.schema.minItems)
                {
                    return false;
                }
            }

            return true;
        },

        /**
         * Validates if number of items has been over maxItems.
         * @returns {Boolean} true if number of items has been over maxItems
         */
        _validateMaxItems: function()
        {
            if (this.schema.maxItems && this.schema.maxItems >= 0)
            {
                if (this.data.length > this.schema.maxItems)
                {
                    return false;
                }
            }

            return true;
        },

        /**
         * @see Alpaca.ContainerField#handleValidate
         */
        handleValidate: function()
        {
            var baseStatus = this.base();

            var valInfo = this.validation;

            var status = this._validateMaxItems();
            valInfo["tooManyItems"] = {
                "message": status ? "" : Alpaca.substituteTokens(this.getMessage("tooManyItems"), [this.schema.maxItems]),
                "status": status
            };

            status = this._validateMinItems();
            valInfo["notEnoughItems"] = {
                "message": status ? "" : Alpaca.substituteTokens(this.getMessage("notEnoughItems"), [this.schema.minItems]),
                "status": status
            };

            return baseStatus && valInfo["tooManyItems"]["status"] && valInfo["notEnoughItems"]["status"];
        }



        /* builder_helpers */
        ,

        /**
         * @private
         * @see Alpaca.ControlField#getSchemaOfSchema
         */
        getSchemaOfSchema: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "enum": {
                        "title": "Enumeration",
                        "description": "List of field value options",
                        "type": "array",
                        "required": true
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.ControlField#getSchemaOfOptions
         */
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "dataSource": {
                        "title": "Option Datasource",
                        "description": "Datasource for generating list of options.  This can be a string or a function.  If a string, it is considered S be a URI to a service that produces a object containing key/value pairs or an array of elements of structure {'text': '', 'value': ''}.  This can also be a function that is called to produce the same list.",
                        "type": "string"
                    },
                    "removeDefaultNone": {
                        "title": "Remove Default None",
                        "description": "If true, the default 'None' option will not be shown.",
                        "type": "boolean",
                        "default": false
                    },
                    "noneLabel": {
                        "title": "None Label",
                        "description": "The label to use for the 'None' option in a list (select, radio or otherwise).",
                        "type": "string",
                        "default": "None"
                    },
                    "hideNone": {
                        "title": "Hide None",
                        "description": "Whether to hide the None option from a list (select, radio or otherwise).  This will be true if the field is required and false otherwise.",
                        "type": "boolean",
                        "default": false
                    },
                    "useDataSourceAsEnum": {
                        "title": "Use Data Source as Enumerated Values",
                        "description": "Whether to constrain the field's schema enum property to the values that come back from the data source.",
                        "type": "boolean",
                        "default": true
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.ControlField#getOptionsForOptions
         */
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "dataSource": {
                        "type": "text"
                    },
                    "removeDefaultNone": {
                        "type": "checkbox",
                        "rightLabel": "Remove Default None"
                    },
                    "noneLabel": {
                        "type": "text"
                    },
                    "hideNone": {
                        "type": "checkbox",
                        "rightLabel": "Hide the 'None' option from the list"
                    }
                }
            });
        }

        /* end_builder_helpers */
    });

    // Registers additional messages
    Alpaca.registerMessages({
        "noneLabel": "None"
    });

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.CheckBoxField = Alpaca.Fields.ListField.extend(
    /**
     * @lends Alpaca.Fields.CheckBoxField.prototype
     */
    {
        /**
         * @see Alpaca.Field#getFieldType
         */
        getFieldType: function() {
            return "checkbox";
        },

        /**
         * @see Alpaca.Field#setup
         */
        setup: function() {

            var self = this;

            self.base();

            if (typeof(self.options.multiple) === "undefined")
            {
                self.options.multiple = false;

                if (self.schema.type === "array")
                {
                    self.options.multiple = true;
                }
                else if (typeof(self.schema["enum"]) !== "undefined")
                {
                    self.options.multiple = true;
                }
            }

            // in single mode, blank out rightlabel
            if (!self.options.multiple)
            {
                if (!this.options.rightLabel) {
                    this.options.rightLabel = "";
                }
            }
        },

        prepareControlModel: function(callback)
        {
            var self = this;

            this.base(function(model) {
                callback(model);
            });
        },

        afterRenderControl: function(model, callback)
        {
            var self = this;

            this.base(model, function() {

                var afterChangeHandler = function()
                {
                    var newData = [];

                    if (self.options.multiple)
                    {
                        $(self.getFieldEl()).find("input:checkbox").each(function() {

                            var value = $(this).attr("data-checkbox-value");

                            if (Alpaca.checked(this))
                            {
                                for (var i = 0; i < self.selectOptions.length; i++)
                                {
                                    if (self.selectOptions[i].value === value)
                                    {
                                        newData.push(self.selectOptions[i].value);
                                    }
                                }
                            }
                        });
                    }
                    else
                    {
                        var checkbox = $(self.getFieldEl()).find("input:checkbox");
                        if (Alpaca.checked(checkbox))
                        {
                            newData = true;
                        }
                    }

                    // set value silently
                    self.setValue(newData, true);

                    self.refreshValidationState();
                    self.triggerWithPropagation("change");
                };

                // whenever the state of one of our input:checkbox controls is changed (either via a click or programmatically),
                // we signal to the top-level field to fire up a change
                //
                // this allows the dependency system to recalculate and such
                //
                $(self.getFieldEl()).find("input:checkbox").change(function(evt) {
                    afterChangeHandler();
                });

                callback();
            });
        },

        afterSetValue: function()
        {
            var self = this;

            // uncheck everything
            Alpaca.checked($(self.getFieldEl()).find("input:checkbox"), false);

            // check those that are selected
            if (self.options.multiple)
            {
                for (var i = 0; i < self.data.length; i++)
                {
                    var checkbox = $(self.getFieldEl()).find("input:checkbox[data-checkbox-value='" + self.data[i].value + "']");
                    Alpaca.checked(checkbox, true);
                }
            }
            else
            {
                var checkbox = $(self.getFieldEl()).find("input:checkbox");
                if (self.data.length > 0)
                {
                    Alpaca.checked(checkbox, true);
                }
            }
        },

        /**
         * @see Alpaca.Field#disable
         */
        disable: function()
        {
            $(this.control).addClass("disabled");

            $(this.control).find("input").each(function() {
                $(this).disabled = true;
                $(this).prop("disabled", true);
            });
        },

        /**
         * @see Alpaca.Field#enable
         */
        enable: function()
        {
            $(this.control).removeClass("disabled");

            $(this.control).find("input").each(function() {
                $(this).disabled = false;
                $(this).prop("disabled", false);
            });
        },

        /**
         * @see Alpaca.Field#getType
         */
        getType: function() {
            return "boolean"; // or string, or array of strings or array of objects
        }

        /* builder_helpers */

        ,

        /**
         * @see Alpaca.Field#getTitle
         */
        getTitle: function() {
            return "Checkbox Field";
        },

        /**
         * @see Alpaca.Field#getDescription
         */
        getDescription: function() {
            return "Checkbox Field for boolean (true/false), string ('true', 'false' or comma-delimited string of values) or data array.";
        },

        /**
         * @private
         * @see Alpaca.ControlField#getSchemaOfOptions
         */
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "rightLabel": {
                        "title": "Option Label",
                        "description": "Optional right-hand side label for single checkbox field.",
                        "type": "string"
                    },
                    "multiple": {
                        "title": "Multiple",
                        "description": "Whether to render multiple checkboxes for multi-valued type (such as an array or a comma-delimited string)",
                        "type": "boolean"
                    },
                    "dataSource": {
                        "title": "Option DataSource",
                        "description": "Data source for generating list of options.  This can be a string or a function.  If a string, it is considered to be a URI to a service that produces a object containing key/value pairs or an array of elements of structure {'text': '', 'value': ''}.  This can also be a function that is called to produce the same list.",
                        "type": "string"
                    },
                    "useDataSourceAsEnum": {
                        "title": "Use Data Source as Enumerated Values",
                        "description": "Whether to constrain the field's schema enum property to the values that come back from the data source.",
                        "type": "boolean",
                        "default": true
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.ControlField#getOptionsForOptions
         */
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "rightLabel": {
                        "type": "text"
                    },
                    "multiple": {
                        "type": "checkbox"
                    },
                    "dataSource": {
                        "type": "text"
                    }
                }
            });
        }

        /* end_builder_helpers */

    });

    Alpaca.registerFieldClass("checkbox", Alpaca.Fields.CheckBoxField);
    Alpaca.registerDefaultSchemaFieldMapping("boolean", "checkbox");

})(jQuery);
(function($){

    var Alpaca = $.alpaca;

    Alpaca.Fields.RadioField = Alpaca.Fields.ListField.extend(
    /**
     * @lends Alpaca.Fields.RadioField.prototype
     */
    {
        /**
         * @see Alpaca.Field#getFieldType
         */
        getFieldType: function() {
            return "radio";
        },

        /**
         * @see Alpaca.Fields.ListField#setup
         */
        setup: function()
        {
            var self = this;

            this.base();
            
            if (this.options.name)
            {
				this.name = this.options.name;
			}
			else if (!this.name)
            {
				this.name = this.getId() + "-name";
			}

            // empty select first to false by default
            if (Alpaca.isUndefined(this.options.emptySelectFirst))
            {
                this.options.emptySelectFirst = false;
            }

            // assume vertical orientation
            // empty select first to false by default
            if (Alpaca.isUndefined(this.options.vertical))
            {
                this.options.vertical = true;
            }
        },

        initControlEvents: function()
        {
            var self = this;

            self.base();

            var inputs = $(self.control).find("input");

            inputs.focus(function(e) {
                if (!self.suspendBlurFocus)
                {
                    self.onFocus.call(self, e);
                    self.trigger("focus", e);
                }
            });

            inputs.blur(function(e) {
                if (!self.suspendBlurFocus)
                {
                    self.onBlur.call(self, e);
                    self.trigger("blur", e);
                }
            });
        },

        prepareControlModel: function(callback)
        {
            var self = this;

            this.base(function(model) {

                model.removeDefaultNone = self.options.removeDefaultNone;

                if (typeof(self.options.noneLabel) === "undefined")
                {
                    self.options.noneLabel = self.getMessage("noneLabel");
                }

                if (typeof(self.options.hideNone) === "undefined")
                {
                    if (typeof(self.options.removeDefaultNone) !== "undefined")
                    {
                        self.options.hideNone = self.options.removeDefaultNone;
                    }
                    else
                    {
                        self.options.hideNone = self.isRequired();
                    }
                }

                // if emptySelectFirst and we have options but no data, then auto-select first item in the options list
                if (self.data.length === 0 && self.options.emptySelectFirst && self.selectOptions.length > 0)
                {
                    self.selectOptions[0].selected = true;
                    self.data = [self.selectOptions[0]];
                }

                // likewise, we auto-assign first pick if field required and removeDefaultNone is true
                if (self.data.length === 0)
                {
                    if (self.isRequired())
                    {
                        if (self.options.removeDefaultNone === true)
                        {
                            self.selectOptions[0].selected = true;
                            self.data = [self.selectOptions[0]];
                        }
                    }
                    else
                    {
                        self.options._noData = true;
                    }
                }

                callback(model);
            });
        },
        
        afterRenderControl: function(model, callback)
        {
            var self = this;

            this.base(model, function() {

                var afterChangeHandler = function()
                {
                    var newData = [];

                    $(self.control).find("input:radio:checked").each(function() {

                        var value = $(this).attr("value");
                        for (var i = 0; i < self.selectOptions.length; i++)
                        {
                            if (self.selectOptions[i].value === value)
                            {
                                newData.push(self.selectOptions[i].value);
                            }
                        }
                    });

                    // set value silently
                    self.setValue(newData, true);

                    self.refreshValidationState();
                    self.triggerWithPropagation("change");
                };

                $(self.control).find("input:radio").change(function(e) {

                    e.preventDefault();

                    afterChangeHandler();
                });


                // stack radio selectors vertically
                if (self.options.vertical)
                {
                    $(self.control).css("display", "block");
                }
                else
                {
                    $(self.control).css("display", "inline-block");
                }

                callback();

            });
        },

        /**
         * Ensures that the "name" property on the control is kept in sync.
         */
        updateDOMElement: function()
        {
            var self = this;

            this.base();

            $(self.control).find("input:radio").attr("name", this.getName());
        },

        afterSetValue: function()
        {
            var self = this;

            Alpaca.checked($(self.control).find("input:radio"), false);

            if (self.data.length > 0)
            {
                for (var i = 0; i < self.data.length; i++)
                {
                    var radio = $(self.control).find("input:radio[value='" + self.data[i].value + "']");
                    if (radio.length > 0)
                    {
                        Alpaca.checked(radio, true);
                    }
                }
            }
        },

        /**
         * @see Alpaca.Field#disable
         */
        disable: function()
        {
            this.base();

            // for radio buttons, we also mark the outer DIV as disabled to prevent label clicks
            // and apply some CSS styling
            this.getFieldEl().addClass("disabled");
        },

        /**
         * @see Alpaca.Field#enable
         */
        enable: function()
        {
            this.base();

            this.getFieldEl().removeClass("disabled");
        }

        /* builder_helpers */
        ,

        /**
         * @see Alpaca.Field#getTitle
         */
        getTitle: function() {
            return "Radio Group Field";
        },

        /**
         * @see Alpaca.Field#getDescription
         */
        getDescription: function() {
            return "Radio Group Field with list of options.";
        },

        /**
         * @private
         * @see Alpaca.Fields.ListField#getSchemaOfOptions
         */
		getSchemaOfOptions: function()
        {
            return Alpaca.merge(this.base(),{
				"properties": {
					"name": {
						"title": "Field name",
						"description": "Field name.",
						"type": "string"
					},
                    "emptySelectFirst": {
                        "title": "Empty Select First",
                        "description": "If the data is empty, then automatically select the first item in the list.",
                        "type": "boolean",
                        "default": false
                    },
                    "vertical": {
                        "title": "Position the radio selector items vertically",
                        "description": "By default, radio controls are stacked vertically.  Set to false if you'd like radio controls to lay out horizontally.",
                        "type": "boolean",
                        "default": true
                    }
				}
			});
        }

        /* end_builder_helpers */
        
    });
    
    Alpaca.registerFieldClass("radio", Alpaca.Fields.RadioField);
    
})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.SelectField = Alpaca.Fields.ListField.extend(
    /**
     * @lends Alpaca.Fields.SelectField.prototype
     */
    {
        /**
         * @see Alpaca.Field#getFieldType
         */
        getFieldType: function()
        {
            return "select";
        },

        /**
         * @see Alpaca.Fields.ListField#setup
         */
        setup: function()
        {
            var self = this;

            this.base();

            if (self.schema["type"] && self.schema["type"] === "array")
            {
                self.options.multiple = true;
            }

            // automatically turn on "hideNone" if we're in multiselect mode and have the multiselect plugin
            if (self.options.multiple && $.fn.multiselect)
            {
                if (typeof(self.options.hideNone) === "undefined")
                {
                    self.options.hideNone = true;
                }
            }

            // offer some backward compability here as older version of Alpaca used to incorrectly look for
            // maxItems and minItems on the schema.items subobject.
            // if not defined properly, we offer some automatic forward migration of these properties
            if (this.schema.items && this.schema.items.maxItems && typeof(this.schema.maxItems) === "undefined") {
                this.schema.maxItems = this.schema.items.maxItems;
                delete this.schema.items.maxItems;
            }
            if (this.schema.items && this.schema.items.minItems && typeof(this.schema.minItems) === "undefined") {
                this.schema.minItems = this.schema.items.minItems;
                delete this.schema.items.minItems;
            }

            if (!self.options.multiselect && $.fn.multiselect)
            {
                self.options.multiselect = {};
            }

            if (self.options.multiselect && typeof(self.options.multiselect.disableIfEmpty) === "undefined")
            {
                self.options.multiselect.disableIfEmpty = true;
            }

            // if we're in a display only mode, turn off multiselect
            if (self.isDisplayOnly())
            {
                delete self.options.multiselect;
            }
        },

        initControlEvents: function()
        {
            var self = this;

            self.base();

            if (self.options.multiple)
            {
                var button = this.control.parent().find("button.multiselect");

                button.focus(function(e) {
                    if (!self.suspendBlurFocus)
                    {
                        self.onFocus.call(self, e);
                        self.trigger("focus", e);
                    }
                });

                button.blur(function(e) {
                    if (!self.suspendBlurFocus)
                    {
                        self.onBlur.call(self, e);
                        self.trigger("blur", e);
                    }
                });
            }
        },

        prepareControlModel: function(callback) {
            var self = this;

            this.base(function (model) {

                if (typeof(self.options.noneLabel) === "undefined")
                {
                    self.options.noneLabel = self.getMessage("noneLabel");
                }

                if (typeof(self.options.hideNone) === "undefined")
                {
                    if (typeof(self.options.removeDefaultNone) !== "undefined")
                    {
                        self.options.hideNone = self.options.removeDefaultNone;
                    }
                    else
                    {
                        self.options.hideNone = self.isRequired();
                    }
                }

                // if emptySelectFirst and we have options but no data, then auto-select first item in the options list
                if (self.data.length === 0 && self.options.emptySelectFirst && self.selectOptions.length > 0)
                {
                    self.selectOptions[0].selected = true;
                    self.data = [self.selectOptions[0]];
                }

                // likewise, we auto-assign first pick if field required
                if (self.data.length === 0 && self.isRequired() && self.selectOptions.length > 0)
                {
                    self.selectOptions[0].selected = true;
                    self.data = [self.selectOptions[0]];
                }

                callback(model);
            });
        },

        afterRenderControl: function(model, callback)
        {
            var self = this;

            this.base(model, function() {

                // if we are in multiple mode and the bootstrap multiselect plugin is available, bind it in
                if (self.options.multiple && $.fn.multiselect && !self.isDisplayOnly())
                {
                    var settings = null;
                    if (self.options.multiselect) {
                        settings = self.options.multiselect;
                    }
                    else
                    {
                        settings = {};
                    }
                    if (!settings.nonSelectedText)
                    {
                        settings.nonSelectedText = "None";
                        if (self.options.noneLabel)
                        {
                            settings.nonSelectedText = self.options.noneLabel;
                        }
                    }

                    $(self.getControlEl()).multiselect(settings);
                }

                var afterChangeHandler = function()
                {
                    var newData = [];

                    var val = $(self.control).val();
                    if (!val) {
                        val = [];
                    }
                    if (Alpaca.isString(val)) {
                        val = [val];
                    }

                    var tempMap = {};
                    for (var i = 0; i < model.selectOptions.length; i++)
                    {
                        tempMap[model.selectOptions[i].value] = model.selectOptions[i];
                    }

                    for (var i = 0; i < val.length; i++)
                    {
                        newData.push(tempMap[val[i]].value);
                    }

                    // set value silently
                    self.setValue(newData, true);

                    self.refreshValidationState();
                    self.triggerWithPropagation("change");
                };

                $(self.control).change(function(e) {
                    afterChangeHandler();
                });

                callback();

            });
        },

        afterSetValue: function()
        {
            var self = this;

            if (self.data.length > 0)
            {
                var values = [];
                for (var i = 0; i < self.data.length; i++) {
                    values.push(self.data[i].value);
                }

                $(self.control).val(values);
            }
        },

        /**
         * @see Alpaca.Field#focus
         */
        focus: function(onFocusCallback)
        {
            if (this.control && this.control.length > 0)
            {
                // set focus onto the select
                var el = $(this.control).get(0);

                el.focus();

                if (onFocusCallback)
                {
                    onFocusCallback(this);
                }
            }
        },

        /**
         * @override
         */
        disable: function()
        {
            var self = this;

            this.base();

            if (self.options.multiselect)
            {
                $(self.getControlEl()).multiselect("disable");
            }
        },

        /**
         * @override
         */
        enable: function()
        {
            var self = this;

            this.base();

            if (self.options.multiselect)
            {
                $(self.getControlEl()).multiselect("enable");
            }
        }




        /* builder_helpers */
        ,

        /**
         * @see Alpaca.Field#getTitle
         */
        getTitle: function() {
            return "Select Field";
        },

        /**
         * @see Alpaca.Field#getDescription
         */
        getDescription: function() {
            return "Select Field";
        },

        /**
         * @private
         * @see Alpaca.Fields.ListField#getSchemaOfOptions
         */
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "multiple": {
                        "title": "Mulitple Selection",
                        "description": "Allow multiple selection if true.",
                        "type": "boolean",
                        "default": false
                    },
                    "size": {
                        "title": "Displayed Options",
                        "description": "Number of options to be shown.",
                        "type": "number"
                    },
                    "emptySelectFirst": {
                        "title": "Empty Select First",
                        "description": "If the data is empty, then automatically select the first item in the list.",
                        "type": "boolean",
                        "default": false
                    },
                    "multiselect": {
                        "title": "Multiselect Plugin Settings",
                        "description": "Multiselect plugin properties - http://davidstutz.github.io/bootstrap-multiselect",
                        "type": "any"
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.Fields.ListField#getOptionsForOptions
         */
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "multiple": {
                        "rightLabel": "Allow multiple selection ?",
                        "helper": "Allow multiple selection if checked",
                        "type": "checkbox"
                    },
                    "size": {
                        "type": "integer"
                    },
                    "emptySelectFirst": {
                        "type": "checkbox",
                        "rightLabel": "Empty Select First"
                    },
                    "multiselect": {
                        "type": "object",
                        "rightLabel": "Multiselect plugin properties - http://davidstutz.github.io/bootstrap-multiselect"
                    }
                }
            });
        }

        /* end_builder_helpers */

    });

    Alpaca.registerFieldClass("select", Alpaca.Fields.SelectField);

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.ChooserField = Alpaca.Fields.ListField.extend(
    /**
     * @lends Alpaca.Fields.ChooserField.prototype
     */
    {
        /**
         * @see Alpaca.Field#getFieldType
         */
        getFieldType: function()
        {
            return "chooser";
        },

        /**
         * @see Alpaca.Field#getType
         */
            /*
        getType: function() {
            return ["array", "string"];
        },
        */

        /**
         * @see Alpaca.Fields.ListField#setup
         */
        setup: function()
        {
            var self = this;

            this.base();
        },

        /**
         * @see Alpaca.ListField#getEnum
         */
        getEnum: function()
        {
            if (this.schema)
            {
                if (this.schema["enum"])
                {
                    return this.schema["enum"];
                }
                else if (this.schema["type"] && this.schema["type"] === "array" && this.schema["items"] && this.schema["items"]["enum"])
                {
                    return this.schema["items"]["enum"];
                }
            }
        },

        prepareControlModel: function(callback) {
            var self = this;

            this.base(function (model) {

                if (self.options.height) {
                    model.height = self.options.height;
                }

                if (self.options.showAllSelections) {
                    model.showAllSelections = self.options.showAllSelections;
                }

                callback(model);
            });
        },

        beforeRenderControl: function(model, callback)
        {
            var self = this;

            this.base(model, function() {

                model.unselected = [];
                model.selected = [];

                var tempMap = {};

                var unselectedIndex = 0;

                // build out unselected
                for (var i = 0; i < self.selectOptions.length; i++)
                {
                    if (!self.selectOptions[i].selected)
                    {
                        model.unselected.push(self.selectOptions[i]);

                        self.selectOptions[i].unselectedIndex = unselectedIndex;
                        unselectedIndex++;
                    }
                    else
                    {
                        tempMap[self.selectOptions[i].value] = self.selectOptions[i];
                    }
                }

                // build out selected
                for (var i = 0; i < self.data.length; i++)
                {
                    model.selected.push(tempMap[self.data[i].value]);
                }

                callback();

            });
        },

        filterUnselectedItems: function(filterText)
        {
            var self = this;

            if (!filterText) {
                filterText = "";
            }

            $(self.control).find(".chooser-filter input").val(filterText);

            $(self.control).find(".chooser-panel-unselected .chooser-item").each(function() {
                var itemText = $(this).attr("data-chooser-item-text");

                // assume it shows
                $(this).show();

                // if no match, filter it
                if (filterText && itemText.toLowerCase().indexOf(filterText.toLowerCase()) === -1)
                {
                    $(this).hide();
                }
            });
        },

        handleRefresh: function()
        {
            var self = this;

            // current filter text
            var filterText = $(self.control).find(".chooser-filter input").val();

            self.refresh(function() {

                // restore filter text
                this.filterUnselectedItems(filterText);
            });
        },

        afterRenderControl: function(model, callback)
        {
            var self = this;

            this.base(model, function() {

                var findIndex = function(button) {
                    var index = $(button).parent().parent().attr("data-chooser-item-index");
                    if (index) {
                        index = parseInt(index, 10);
                    }

                    return index;
                };

                var afterClickHandler = function()
                {
                    var d = [];
                    for (var i = 0; i < model.selected.length; i++)
                    {
                        d.push(model.selected[i]);
                    }

                    self.data = d;

                    self.handleRefresh();
                };

                $(self.control).find("button.btn-add").off().click(function(e) {

                    e.preventDefault();

                    var index = findIndex(this);
                    if (index > -1)
                    {
                        var x = model.unselected.splice(index, 1);
                        model.selected.push(x[0]);

                        afterClickHandler();
                    }
                });

                $(self.control).find("button.btn-remove").off().click(function(e) {

                    e.preventDefault();

                    var index = findIndex(this);
                    if (index > -1)
                    {
                        var x = model.selected.splice(index, 1);
                        model.unselected.push(x[0]);

                        afterClickHandler();
                    }
                });

                $(self.control).find("button.btn-up").off().click(function(e) {

                    e.preventDefault();

                    var index = findIndex(this);
                    if (index > 0)
                    {
                        var x = model.selected.splice(index, 1);
                        model.selected.splice(index - 1, 0, x[0]);

                        afterClickHandler();
                    }
                });

                $(self.control).find("button.btn-down").off().click(function(e) {

                    e.preventDefault();

                    var index = findIndex(this);
                    if (index < model.selected.length - 1)
                    {
                        var x = model.selected.splice(index, 1);
                        model.selected.splice(index + 1, 0, x[0]);

                        afterClickHandler();
                    }
                });

                $(self.control).find(".chooser-filter input").off().keyup(function(e) {

                    var filterText = $(this).val();

                    self.filterUnselectedItems(filterText);
                });

                setTimeout(function() {
                    if (typeof(model.height) === "undefined")
                    {
                        var _height = -1;
                        $(self.control).find(".chooser-panel-items").each(function() {
                            if ($(this).height() > _height) {
                                _height = $(this).height();
                            }
                        });

                        if (_height > -1) {
                            model.height = _height;
                        }
                    }

                    // set height
                    if (model.height)
                    {
                        $(self.control).find(".chooser-panel-items").css("height", model.height);

                        $(self.control).find(".chooser-item-message").css("text-align", "center");
                        $(self.control).find(".chooser-item-message").css("margin-top", (($(self.control).find(".chooser-panel-items").height() / 2) - 8) + "px");
                    }

                }, 0);

                callback();

            });
        },

        afterSetValue: function()
        {
            var self = this;

            self.handleRefresh();
        },

        /**
         * @see Alpaca.Field#focus
         */
        focus: function(onFocusCallback)
        {
            if (onFocusCallback)
            {
                onFocusCallback(this);
            }
        },

        /**
         * @override
         */
        disable: function()
        {
            $(this.control).find(".chooser-panel-items .chooser-item .chooser-item-buttons button.btn").addClass("disabled");
            $(this.control).find(".chooser-panel-items .chooser-item").addClass("disabled");
            $(this.control).find(".chooser-filter input").attr("disabled", "disabled");
        },

        /**
         * @override
         */
        enable: function()
        {
            var self = this;

            self.handleRefresh();
        }




        /* builder_helpers */
        ,

        /**
         * @see Alpaca.Field#getTitle
         */
        getTitle: function() {
            return "Chooser Field";
        },

        /**
         * @see Alpaca.Field#getDescription
         */
        getDescription: function() {
            return "Chooser Field";
        },

        /**
         * @private
         * @see Alpaca.Fields.ListField#getSchemaOfOptions
         */
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "showAllSelections": {
                        "type": "boolean",
                        "title": "Show All Selections",
                        "description": "When true, show full selection list and disable anything already selected",
                        "default": false
                    },
                    "height": {
                        "type": "number",
                        "title": "Height",
                        "description": "Specify a fixed height for the list boxes.  If not provided, the list boxes size to the amount of data."
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.Fields.ListField#getOptionsForOptions
         */
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                }
            });
        }

        /* end_builder_helpers */

    });

    Alpaca.registerFieldClass("chooser", Alpaca.Fields.ChooserField);

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.AddressField = Alpaca.Fields.ObjectField.extend(
    /**
     * @lends Alpaca.Fields.AddressField.prototype
     */
    {
        /**
         * @see Alpaca.Fields.ObjectField#getFieldType
         */
        getFieldType: function() {
            return "address";
        },

        /**
         * @private
         * @see Alpaca.Fields.ObjectField#setup
         */
        setup: function()
        {
            this.base();

            if (!this.data || !this.data.street) {
                this.data = {
                    street: ['', '']
                };
            }

            this.schema = {
                "title": "Home Address",
                "type": "object",
                "properties": {
                    "street": {
                        "title": "Street",
                        "type": "array",
                        "items": {
                            "type": "string",
                            "maxLength": 30
                        },
                        "minItems": 0,
                        "maxItems": 3
                    },
                    "city": {
                        "title": "City",
                        "type": "string"
                    },
                    "state": {
                        "title": "State",
                        "type": "string",
                        "enum": ["AL", "AK", "AS", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FM", "FL", "GA", "GU", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MH", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "MP", "OH", "OK", "OR", "PW", "PA", "PR", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VI", "VA", "WA", "WV", "WI", "WY"]
                    },
                    "zip": {
                        "title": "Zip Code",
                        "type": "string",
                        "pattern": /^(\d{5}(-\d{4})?)?$/
                    }
                }
            };
            Alpaca.merge(this.options, {
                "fields": {
                    "zip": {
                        "maskString": "99999",
                        "size": 5
                    },
                    "state": {
                        "optionLabels": ["ALABAMA", "ALASKA", "AMERICAN SAMOA", "ARIZONA", "ARKANSAS", "CALIFORNIA", "COLORADO", "CONNECTICUT", "DELAWARE", "DISTRICT OF COLUMBIA", "FEDERATED STATES OF MICRONESIA", "FLORIDA", "GEORGIA", "GUAM", "HAWAII", "IDAHO", "ILLINOIS", "INDIANA", "IOWA", "KANSAS", "KENTUCKY", "LOUISIANA", "MAINE", "MARSHALL ISLANDS", "MARYLAND", "MASSACHUSETTS", "MICHIGAN", "MINNESOTA", "MISSISSIPPI", "MISSOURI", "MONTANA", "NEBRASKA", "NEVADA", "NEW HAMPSHIRE", "NEW JERSEY", "NEW MEXICO", "NEW YORK", "NORTH CAROLINA", "NORTH DAKOTA", "NORTHERN MARIANA ISLANDS", "OHIO", "OKLAHOMA", "OREGON", "PALAU", "PENNSYLVANIA", "PUERTO RICO", "RHODE ISLAND", "SOUTH CAROLINA", "SOUTH DAKOTA", "TENNESSEE", "TEXAS", "UTAH", "VERMONT", "VIRGIN ISLANDS", "VIRGINIA", "WASHINGTON", "WEST VIRGINIA", "WISCONSIN", "WYOMING"]
                    }
                }
            });

            if (Alpaca.isEmpty(this.options.addressValidation))
            {
                this.options.addressValidation = true;
            }
        },

        /**
         * @see Alpaca.Field#isContainer
         */
        isContainer: function()
        {
            return false;
        },

        /**
         * Returns address in a single line string.
         *
         * @returns {String} Address as a single line string.
         */
        getAddress: function()
        {
            var value = this.getValue();
            if (this.view.type === "view")
            {
                value = this.data;
            }
            var address = "";
            if (value)
            {
                if (value.street)
                {
                    $.each(value.street, function(index, value) {
                        address += value + " ";
                    });
                }
                if (value.city)
                {
                    address += value.city + " ";
                }
                if (value.state)
                {
                    address += value.state + " ";
                }
                if (value.zip)
                {
                    address += value.zip;
                }
            }

            return address;
        },

        /**
         * @see Alpaca.Field#afterRenderContainer
         */
        afterRenderContainer: function(model, callback) {

            var self = this;

            this.base(model, function() {
                var container = self.getContainerEl();

                // apply additional css
                $(container).addClass("alpaca-addressfield");

                if (self.options.addressValidation && !self.isDisplayOnly())
                {
                    $('<div style="clear:both;"></div>').appendTo(container);
                    var mapButton = $('<div class="alpaca-form-button">Show Google Map</div>').appendTo(container);
                    if (mapButton.button)
                    {
                        mapButton.button({
                            text: true
                        });
                    }
                    mapButton.click(function() {

                        if (google && google.maps)
                        {
                            var geocoder = new google.maps.Geocoder();
                            var address = self.getAddress();
                            if (geocoder)
                            {
                                geocoder.geocode({
                                    'address': address
                                }, function(results, status)
                                {
                                    if (status === google.maps.GeocoderStatus.OK)
                                    {
                                        var mapCanvasId = self.getId() + "-map-canvas";
                                        if ($('#' + mapCanvasId).length === 0)
                                        {
                                            $("<div id='" + mapCanvasId + "' class='alpaca-field-address-mapcanvas'></div>").appendTo(self.getFieldEl());
                                        }

                                        var map = new google.maps.Map(document.getElementById(self.getId() + "-map-canvas"), {
                                            "zoom": 10,
                                            "center": results[0].geometry.location,
                                            "mapTypeId": google.maps.MapTypeId.ROADMAP
                                        });

                                        var marker = new google.maps.Marker({
                                            map: map,
                                            position: results[0].geometry.location
                                        });

                                    }
                                    else
                                    {
                                        self.displayMessage("Geocoding failed: " + status);
                                    }
                                });
                            }

                        }
                        else
                        {
                            self.displayMessage("Google Map API is not installed.");
                        }
                    }).wrap('<small/>');

                    if (self.options.showMapOnLoad)
                    {
                        mapButton.click();
                    }
                }

                callback();

            });
        },

        /**
         * @see Alpaca.Fields.ObjectField#getType
         */
        getType: function() {
            return "any";
        }


        /* builder_helpers */
        ,

        /**
         * @see Alpaca.Fields.ObjectField#getTitle
         */
        getTitle: function() {
            return "Address";
        },

        /**
         * @see Alpaca.Fields.ObjectField#getDescription
         */
        getDescription: function() {
            return "Standard US Address with Street, City, State and Zip. Also comes with support for Google map.";
        },

        /**
         * @private
         * @see Alpaca.Fields.ObjectField#getSchemaOfOptions
         */
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "validateAddress": {
                        "title": "Address Validation",
                        "description": "Enable address validation if true",
                        "type": "boolean",
                        "default": true
                    },
                    "showMapOnLoad": {
                        "title": "Whether to show the map when first loaded",
                        "type": "boolean"
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.Fields.ObjectField#getOptionsForOptions
         */
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "validateAddress": {
                        "helper": "Address validation if checked",
                        "rightLabel": "Enable Google Map for address validation?",
                        "type": "checkbox"
                    }
                }
            });
        }

        /* end_builder_helpers */
    });

    Alpaca.registerFieldClass("address", Alpaca.Fields.AddressField);

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.CKEditorField = Alpaca.Fields.TextAreaField.extend(
    /**
     * @lends Alpaca.Fields.CKEditorField.prototype
     */
    {
        /**
         * @see Alpaca.Fields.TextAreaField#getFieldType
         */
        getFieldType: function() {
            return "ckeditor";
        },

        /**
         * @see Alpaca.Fields.TextAreaField#setup
         */
        setup: function()
        {
            if (!this.data)
            {
                this.data = "";
            }

            this.base();

            if (typeof(this.options.ckeditor) == "undefined")
            {
                this.options.ckeditor = {};
            }
        },

        afterRenderControl: function(model, callback)
        {
            var self = this;

            this.base(model, function() {

                // see if we can render CK Editor
                if (!self.isDisplayOnly() && self.control && typeof(CKEDITOR) !== "undefined")
                {
                    // wait for Alpaca to declare the DOM swapped and ready before we attempt to do anything with CKEditor
                    self.on("ready", function() {
                        if (!self.editor)
                        {
                            self.editor = CKEDITOR.replace($(self.control)[0], self.options.ckeditor);

                            self.initCKEditorEvents();
                        }
                    });
                }

                // if the ckeditor's dom element gets destroyed, make sure we clean up the editor instance
                $(self.control).bind('destroyed', function() {

                    if (self.editor)
                    {
                        self.editor.removeAllListeners();
                        // catch here because CKEditor has an issue if DOM element deletes before CKEditor cleans up
                        // see: https://github.com/lemonde/angular-ckeditor/issues/7
                        try { self.editor.destroy(false); } catch (e) { }
                        self.editor = null;
                    }

                });

                callback();
            });
        },

        initCKEditorEvents: function()
        {
            var self = this;

            if (self.editor)
            {
                // click event
                self.editor.on("click", function (e) {
                    self.onClick.call(self, e);
                    self.trigger("click", e);
                });

                // change event
                self.editor.on("change", function (e) {
                    self.onChange();
                    self.triggerWithPropagation("change", e);
                });

                // blur event
                self.editor.on('blur', function (e) {
                    self.onBlur();
                    self.trigger("blur", e);
                });

                // focus event
                self.editor.on("focus", function (e) {
                    self.onFocus.call(self, e);
                    self.trigger("focus", e);
                });

                // keypress event
                self.editor.on("key", function (e) {
                    self.onKeyPress.call(self, e);
                    self.trigger("keypress", e);
                });

                // for "keydown" and "keyup" events, we need to wait for the "contentDom" event and then register
                // using the CKEditor "editable"
                self.editor.on("contentDom", function() {
                    var editable = self.editor.editable();

                    editable.attachListener(self.editor.document, 'keydown', function(e) {

                        var x = self.onKeyDown.call(self, e);
                        if (x !== false) {
                            x = self.trigger("keydown", e);

                            // propagate up with "before_nested_change"
                            self.triggerWithPropagation("before_nested_change", e);
                        }

                        return x;
                    });

                    editable.attachListener(self.editor.document, 'keyup', function(e) {

                        var x = self.onKeyUp.call(self, e);
                        if (x !== false) {
                            x = self.trigger("keyup", e);
                        }

                        // propagate up with "after_nested_change"
                        self.triggerWithPropagation("after_nested_change", e);

                        return x;
                    });
                });
            }
        },

        setValue: function(value)
        {
            var self = this;

            // be sure to call into base method
            this.base(value);

            if (self.editor)
            {
                self.editor.setData(value);
            }
        },

        /**
         * @see Alpaca.Fields.ControlField#getControlValue
         */
        getControlValue: function()
        {
            var self = this;

            var value = null;

            if (self.editor)
            {
                value = self.editor.getData();
            }

            return value;
        },

        /**
         * @see Alpaca.Field#destroy
         */
        destroy: function()
        {
            var self = this;

            // destroy the plugin instance
            if (self.editor)
            {
                self.editor.destroy();
                self.editor = null;
            }

            // call up to base method
            this.base();
        }

        /* builder_helpers */

        /**
         * @see Alpaca.Fields.TextAreaField#getTitle
         */
        ,
        getTitle: function() {
            return "CK Editor";
        },

        /**
         * @see Alpaca.Fields.TextAreaField#getDescription
         */
        getDescription: function() {
            return "Provides an instance of a CK Editor control for use in editing HTML.";
        },

        /**
         * @private
         * @see Alpaca.ControlField#getSchemaOfOptions
         */
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "ckeditor": {
                        "title": "CK Editor options",
                        "description": "Use this entry to provide configuration options to the underlying CKEditor plugin.",
                        "type": "any"
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.ControlField#getOptionsForOptions
         */
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "ckeditor": {
                        "type": "any"
                    }
                }
            });
        }

        /* end_builder_helpers */
    });

    Alpaca.registerFieldClass("ckeditor", Alpaca.Fields.CKEditorField);

})(jQuery);

/**
 * Uses the spectrum plugin to provide a color picker.
 * This used to rely on HTML5 but no longer.
 */
(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.ColorField = Alpaca.Fields.TextField.extend(
    /**
     * @lends Alpaca.Fields.ColorField.prototype
     */
    {
        /**
         * @see Alpaca.Fields.TextField#setup
         */
        setup: function()
        {
            var self = this;

            this.spectrumAvailable = false;
            if (!self.isDisplayOnly() && typeof($.fn.spectrum) !== "undefined")
            {
                this.spectrumAvailable = true;
            }

            // default html5 input type = "color";
            if (typeof(this.options.spectrum) === "undefined" && self.spectrumAvailable)
            {
                this.inputType = "color";
            }

            this.base();
            if (self.spectrumAvailable){
                // set up default spectrum settings
                if (typeof(this.options.spectrum) === "undefined")
                {
                    this.options.spectrum = {};
                }
                if (typeof(this.options.spectrum.showInput) === "undefined")
                {
                    this.options.spectrum.showInput = true;
                }
                if (typeof(this.options.spectrum.showPalette) === "undefined")
                {
                    this.options.spectrum.showPalette = true;
                }
                if (typeof(this.options.spectrum.preferredFormat) === "undefined")
                {
                    this.options.spectrum.preferredFormat = "hex3";
                }
                if (typeof(this.options.spectrum.clickoutFiresChange) === "undefined")
                {
                    this.options.spectrum.clickoutFiresChange = true;
                }
            }
        },

        /**
         * @see Alpaca.Fields.TextField#getFieldType
         */
        getFieldType: function() {
            return "color";
        },

        /**
         * @see Alpaca.Fields.TextField#getType
         */
        getType: function() {
            return "string";
        },

        afterRenderControl: function(model, callback)
        {
            var self = this;

            this.base(model, function() {

                // if we can render the spectrum plugin...
                if (self.spectrumAvailable && self.control)
                {
                    setTimeout(function() {
                        $((self.control)[0]).spectrum(
                          $.extend({ color: self.data }, self.options.spectrum)
                        );
                    }, 100);

                    $(self.control).on('change.spectrum', function(e, tinycolor) {
                        var val = self.convertTinyColor(tinycolor);
                        self.setValue(val);
                    });
                }

                callback();
            });
        },

        convertTinyColor: function(tinycolor)
        {
            return tinycolor.toHexString();
        },

        /* builder_helpers */

        /**
         * @see Alpaca.Fields.TextField#getTitle
         */
        getTitle: function() {
            return "Color Field";
        },

        /**
         * @see Alpaca.Fields.TextField#getDescription
         */
        getDescription: function() {
            return "A color picker for selecting hexadecimal color values";
        }

        /* end_builder_helpers */
    });

    Alpaca.registerFieldClass("color", Alpaca.Fields.ColorField);
    Alpaca.registerDefaultSchemaFieldMapping("color", "color");

})(jQuery);

/**
 * Uses: https://mjolnic.com/bootstrap-colorpicker/
 */
(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.ColorPickerField = Alpaca.Fields.TextField.extend(
    /**
     * @lends Alpaca.Fields.ColorPickerField.prototype
     */
    {
        /**
         * @see Alpaca.Fields.TextField#setup
         */
        setup: function()
        {
            var self = this;

            this.simpleColorPickerAvailable = false;
            if (!self.isDisplayOnly() && typeof($.fn.colorpicker) !== "undefined")
            {
                this.simpleColorPickerAvailable = true;
            }

            // default html5 input type = "color";
            if (typeof(this.options.colorpicker) === "undefined" && !self.simpleColorPickerAvailable)
            {
                this.inputType = "color";
            }

            this.base();

            // set up default colorpicker settings
            if (typeof(this.options.colorpicker) === "undefined")
            {
                this.options.colorpicker = {};
            }
        },

        /**
         * @see Alpaca.Fields.TextField#getFieldType
         */
        getFieldType: function() {
            return "colorpicker";
        },

        /**
         * @see Alpaca.Fields.TextField#getType
         */
        getType: function() {
            return "string";
        },

        afterRenderControl: function(model, callback)
        {
            var self = this;

            this.base(model, function() {

                // if we can render the spectrum plugin...
                if (self.simpleColorPickerAvailable && self.control)
                {
                    setTimeout(function(self) {
                        return function() {

                            // create a copy of the color picker settings and bind that
                            // this is because colorpicker jquery plugin seems to munge these configs across multiple instances
                            var cp = JSON.parse(JSON.stringify(self.options.colorpicker));
                            if (self.data)
                            {
                                cp.color = self.data;
                            }


                            $(self.control).colorpicker(cp);
                            $(self.control).on('changeColor.colorpicker', function(event) {
                                self.setValue(event.color.toHex());
                            });
                        }
                    }(self, self));
                }

                callback();
            });
        }

        /* builder_helpers */
        ,

        /**
         * @see Alpaca.Fields.TextField#getTitle
         */
        getTitle: function() {
            return "Color Picker Field";
        },

        /**
         * @see Alpaca.Fields.TextField#getDescription
         */
        getDescription: function() {
            return "A color picker for selecting hexadecimal color values";
        }

        /* end_builder_helpers */
    });

    Alpaca.registerFieldClass("colorpicker", Alpaca.Fields.ColorPickerField);

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.CountryField = Alpaca.Fields.SelectField.extend(
    /**
     * @lends Alpaca.Fields.CountryField.prototype
     */
    {
        /**
         * @see Alpaca.Field#getFieldType
         */
        getFieldType: function() {
            return "country";
        },

        /**
         * @see Alpaca.Fields.Field#setup
         */
        setup: function()
        {
            // defaults
            if (Alpaca.isUndefined(this.options.capitalize))
            {
                this.options.capitalize = false;
            }

            this.schema["enum"] = [];
            this.options.optionLabels = [];

            var countriesMap = this.getMessage("countries");
            if (countriesMap)
            {
                for (var countryKey in countriesMap)
                {
                    this.schema["enum"].push(countryKey);

                    var label = countriesMap[countryKey];
                    if (this.options.capitalize)
                    {
                        label = label.toUpperCase();
                    }

                    this.options.optionLabels.push(label);
                }
            }

            this.base();
        }

        /* builder_helpers */
        ,

        /**
         * @see Alpaca.Fields.TextField#getTitle
         */
        getTitle: function() {
            return "Country Field";
        },

        /**
         * @see Alpaca.Fields.TextField#getDescription
         */
        getDescription: function() {
            return "Provides a dropdown selector of countries keyed by their ISO3 code.  The names of the countries are read from the I18N bundle for the current locale.";
        },

        /**
         * @private
         * @see Alpaca.Fields.TextField#getSchemaOfOptions
         */
        getSchemaOfOptions: function() {

            return Alpaca.merge(this.base(), {
                "properties": {
                    "capitalize": {
                        "title": "Capitalize",
                        "description": "Whether the values should be capitalized",
                        "type": "boolean",
                        "default": false,
                        "readonly": true
                    }
                }
            });

        },

        /**
         * @private
         * @see Alpaca.Fields.TextField#getOptionsForOptions
         */
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "capitalize": {
                        "type": "checkbox"
                    }
                }
            });
        }

        /* end_builder_helpers */
    });

    Alpaca.registerFieldClass("country", Alpaca.Fields.CountryField);
    Alpaca.registerDefaultFormatFieldMapping("country", "country");

})(jQuery);

(function($) {

    var round = (function() {
        var strategies = {
            up:      Math.ceil,
            down:    function(input) { return ~~input; },
            nearest: Math.round
        };
        return function(strategy) {
            return strategies[strategy];
        };
    })();

    var Alpaca = $.alpaca;

    Alpaca.Fields.CurrencyField = Alpaca.Fields.TextField.extend(
    /**
     * @lends Alpaca.Fields.CurrencyField.prototype
     */
    {
        /**
         * @constructs
         * @augments Alpaca.Fields.TextField
         *
         * @class Currency Control
         *
         * @param {Object} container Field container.
         * @param {Any} data Field data.
         * @param {Object} options Field options.
         * @param {Object} schema Field schema.
         * @param {Object|String} view Field view.
         * @param {Alpaca.Connector} connector Field connector.
         * @param {Function} errorCallback Error callback.
         */
        constructor: function(container, data, options, schema, view, connector, errorCallback) {
            options = options || {};

            var pfOptionsSchema = this.getSchemaOfPriceFormatOptions().properties;
            for (var i in pfOptionsSchema) {
                var option = pfOptionsSchema[i];
                if (!(i in options)) {
                    options[i] = option["default"] || undefined;
                }
            }

            if (typeof(data) !== "undefined")
            {
                data = "" + parseFloat(data).toFixed(options.centsLimit);
            }

            this.base(container, data, options, schema, view, connector, errorCallback);
        },

        /**
         * @see Alpaca.Fields.TextField#getFieldType
         */
        getFieldType: function() {
            return "currency";
        },

        /**
         * @see Alpaca.Fields.TextField#postRender
         */
        afterRenderControl: function(model, callback) {

            var self = this;

            var field = this.getControlEl();

            this.base(model, function() {

                $(field).priceFormat(self.options);

                callback();

            });
        },

        /**
         * @see Alpaca.Fields.ControlField#getControlValue
         */
        getControlValue: function() {

            var field = this.getControlEl();

            var val = $(field).is('input') ? field.val() : field.html();
            if (this.options.unmask || this.options.round !== "none") {
                var unmasked = function() {
                    var result = '';
                    for (var i in val) {
                        var cur = val[i];
                        if (!isNaN(cur) || cur === "-") {
                            result += cur;
                        } else if (cur === this.options.centsSeparator) {
                            result += '.';
                        }
                    }
                    return parseFloat(result);
                }.bind(this)();
                if (this.options.round !== "none") {
                    unmasked = round(this.options.round)(unmasked);
                    if (!this.options.unmask) {
                        var result = [];
                        var unmaskedString = "" + unmasked;
                        for (var i = 0, u = 0; i < val.length; i++) {
                            if (!isNaN(val[i]) || val[i] === "-") {
                                result.push(unmaskedString[u++] || 0);
                            } else {
                                result.push(val[i]);
                            }
                        }
                        return result.join('');
                    }
                }
                return unmasked;
            } else {
                return val;
            }
        }

        /* builder_helpers */
        ,

        /**
         * @see Alpaca.Fields.TextField#getTitle
         */
        getTitle: function() {
            return "Currency Field";
        },

        /**
         * @see Alpaca.Fields.TextField#getDescription
         */
        getDescription: function() {
            return "Provides an automatically formatted and configurable input for entering currency amounts.";
        },

        getSchemaOfPriceFormatOptions: function() {
            return {
                "properties": {
                    "allowNegative": {
                        "title": "Allow Negative",
                        "description": "Determines if negative numbers are allowed.",
                        "type": "boolean",
                        "default": false
                    },
                    "centsLimit": {
                        "title": "Cents Limit",
                        "description": "The limit of fractional digits.",
                        "type": "number",
                        "default": 2,
                        "minimum": 0
                    },
                    "centsSeparator": {
                        "title": "Cents Separator",
                        "description": "The separator between whole and fractional amounts.",
                        "type": "text",
                        "default": "."
                    },
                    "clearPrefix": {
                        "title": "Clear Prefix",
                        "description": "Determines if the prefix is cleared on blur.",
                        "type": "boolean",
                        "default": false
                    },
                    "clearSuffix": {
                        "title": "Clear Suffix",
                        "description": "Determines if the suffix is cleared on blur.",
                        "type": "boolean",
                        "default": false
                    },
                    "insertPlusSign": {
                        "title": "Plus Sign",
                        "description": "Determines if a plus sign should be inserted for positive values.",
                        "type": "boolean",
                        "default": false
                    },
                    "limit": {
                        "title": "Limit",
                        "description": "A limit of the length of the field.",
                        "type": "number",
                        "default": undefined,
                        "minimum": 0
                    },
                    "prefix": {
                        "title": "Prefix",
                        "description": "The prefix if any for the field.",
                        "type": "text",
                        "default": "$"
                    },
                    "round": {
                        "title": "Round",
                        "description": "Determines if the field is rounded. (Rounding is done when getValue is called and is not reflected in the UI)",
                        "type": "string",
                        "enum": [ "up", "down", "nearest", "none" ],
                        "default": "none"
                    },
                    "suffix": {
                        "title": "Suffix",
                        "description": "The suffix if any for the field.",
                        "type": "text",
                        "default": ""
                    },
                    "thousandsSeparator": {
                        "title": "Thousands Separator",
                        "description": "The separator between thousands.",
                        "type": "string",
                        "default": ","
                    },
                    "unmask": {
                        "title": "Unmask",
                        "description": "If true then the resulting value for this field will be unmasked.  That is, the resulting value will be a float instead of a string (with the prefix, suffix, etc. removed).",
                        "type": "boolean",
                        "default": true
                    }
                }
            };
        },

        /**
         * @private
         * @see Alpaca.Fields.TextField#getSchemaOfOptions
         */
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), this.getSchemaOfPriceFormatOptions());
        },

        /**
         * @private
         * @see Alpaca.Fields.TextField#getOptionsForOptions
         */
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "allowNegative": {
                        "type": "checkbox"
                    },
                    "centsLimit": {
                        "type": "number"
                    },
                    "centsSeparator": {
                        "type": "text"
                    },
                    "clearPrefix": {
                        "type": "checkbox"
                    },
                    "clearSuffix": {
                        "type": "checkbox"
                    },
                    "insertPlusSign": {
                        "type": "checkbox"
                    },
                    "limit": {
                        "type": "number"
                    },
                    "prefix": {
                        "type": "text"
                    },
                    "round": {
                        "type": "select"
                    },
                    "suffix": {
                        "type": "text"
                    },
                    "thousandsSeparator": {
                        "type": "string"
                    },
                    "unmask": {
                        "type": "checkbox"
                    }
                }
            });
        }

        /* end_builder_helpers */
    });

    Alpaca.registerFieldClass("currency", Alpaca.Fields.CurrencyField);

})(jQuery);

(function($) {

    // NOTE: this requires bootstrap-datetimepicker.js
    // NOTE: this requires moment.js

    var Alpaca = $.alpaca;

    Alpaca.Fields.DateField = Alpaca.Fields.TextField.extend(
    /**
     * @lends Alpaca.Fields.DateField.prototype
     */
    {
        /**
         * @see Alpaca.Fields.TextField#getFieldType
         */
        getFieldType: function() {
            return "date";
        },

        getDefaultFormat: function() {
            return Alpaca.defaultDateFormat;
        },

        getDefaultExtraFormats: function() {
            return [];
        },

        /**
         * @see Alpaca.Fields.TextField#setup
         */
        setup: function()
        {
            var self = this;

            // default html5 input type = "date";
            //this.inputType = "date";

            this.base();

            if (!self.options.picker)
            {
                self.options.picker = {};
            }

            if (typeof(self.options.picker.useCurrent) === "undefined") {
                self.options.picker.useCurrent = false;
            }

            // date format

            if (self.options.picker.format) {
                self.options.dateFormat = self.options.picker.format;
            }
            if (!self.options.dateFormat) {
                self.options.dateFormat = self.getDefaultFormat();
            }
            if (!self.options.picker.format) {
                self.options.picker.format = self.options.dateFormat;
            }

            if (!self.options.picker.locale) {
                self.options.picker.locale = Alpaca.defaultLocale;
            }

            if (!self.options.picker.dayViewHeaderFormat) {
                self.options.picker.dayViewHeaderFormat = "MMMM YYYY";
            }

            // extra formats
            if (!self.options.picker.extraFormats) {
                var extraFormats = self.getDefaultExtraFormats();
                if (extraFormats) {
                    self.options.picker.extraFormats = extraFormats;
                }
            }

            if (typeof(self.options.manualEntry) === "undefined")
            {
                self.options.manualEntry = false;
            }
        },
        
        onKeyPress: function(e)
        {
            if (this.options.manualEntry)
            {
                e.preventDefault();
                e.stopImmediatePropagation();
            }
            else
            {
                this.base(e);
                return;
            }
        },
        
        onKeyDown: function(e)
        {
            if (this.options.manualEntry)
            {
                e.preventDefault();
                e.stopImmediatePropagation();
            }
            else
            {
                this.base(e);
                return;
            }
        },

        beforeRenderControl: function(model, callback)
        {
            this.field.css("position", "relative");

            callback();
        },

        /**
         * @see Alpaca.Fields.TextField#afterRenderControl
         */
        afterRenderControl: function(model, callback) {

            var self = this;

            this.base(model, function() {

                if (self.view.type !== "display")
                {
                    if ($.fn.datetimepicker)
                    {
                        self.getControlEl().datetimepicker(self.options.picker);

                        self.picker = self.getControlEl().data("DateTimePicker");
                        if (self.picker && self.options.dateFormat)
                        {
                            self.picker.format(self.options.dateFormat);
                        }
                        if (self.picker)
                        {
                            self.options.dateFormat = self.picker.format();
                        }

                        // with date-time picker, trigger change using plugin
                        self.getFieldEl().on("dp.change", function(e) {

                            // we use a timeout here because we want this to run AFTER control click handlers
                            setTimeout(function() {
                                self.onChange.call(self, e);
                                self.triggerWithPropagation("change", e);
                            }, 250);

                        });

                        // set value if provided
                        if (self.data) {
                            self.picker.date(self.data);
                        }
                    }
                }

                callback();

            });
        },

        /**
         * Allows manual entry mode to be toggled on and off.
         *
         * @param manualEntry
         */
        setManualEntry: function(manualEntry)
        {
            this.options.manualEntry = manualEntry;
        },

        /**
         * Returns field value as a JavaScript Date.
         *
         * @returns {Date} Field value.
         */
        getDate: function()
        {
            var self = this;

            var date = null;
            try
            {
                if (self.picker)
                {
                    date = (self.picker.date() ? self.picker.date()._d: null);
                }
                else
                {
                    date = new Date(this.getValue());
                }
            }
            catch (e)
            {
                console.error(e);
            }

            return date;
        },

        /**
         * Returns field value as a JavaScript Date.
         *
         * @returns {Date} Field value.
         */
        date: function()
        {
            return this.getDate();
        },

        /**
         * @see Alpaca.Field#onChange
         */
        onChange: function(e)
        {
            this.base();

            this.refreshValidationState();
        },

        isAutoFocusable: function()
        {
            return false;
        },

        /**
         * @see Alpaca.Fields.TextField#handleValidate
         */
        handleValidate: function()
        {
            var baseStatus = this.base();

            var valInfo = this.validation;

            var status = this._validateDateFormat();
            valInfo["invalidDate"] = {
                "message": status ? "" : Alpaca.substituteTokens(this.getMessage("invalidDate"), [this.options.dateFormat]),
                "status": status
            };

            return baseStatus && valInfo["invalidDate"]["status"];
        },

        /**
         * Validates date format.
         *
         * @returns {Boolean} True if it is a valid date, false otherwise.
         */
        _validateDateFormat: function()
        {
            var self = this;

            var isValid = true;

            if (self.options.dateFormat)
            {
                var value = self.getValue();
                if (value || self.isRequired())
                {
                    // collect all formats
                    var dateFormats = [];
                    dateFormats.push(self.options.dateFormat);
                    if (self.options.picker && self.options.picker.extraFormats)
                    {
                        for (var i = 0; i < self.options.picker.extraFormats.length; i++)
                        {
                            dateFormats.push(self.options.picker.extraFormats[i]);
                        }
                    }

                    for (var i = 0; i < dateFormats.length; i++)
                    {
                        isValid = isValid || Alpaca.moment(value, self.options.dateFormat, true).isValid();
                    }
                }
            }

            return isValid;
        },

        /**
         * @see Alpaca.Fields.TextField#setValue
         */
        setValue: function(value)
        {
            var self = this;

            this.base(value);

            if (this.picker)
            {
                if (Alpaca.moment(value, self.options.dateFormat, true).isValid())
                {
                    this.picker.date(value);
                }
            }
        },

        destroy: function()
        {
            this.base();

            this.picker = null;
        }


        /* builder_helpers */
        ,

        /**
         * @see Alpaca.Fields.TextField#getTitle
         */
        getTitle: function() {
            return "Date Field";
        },

        /**
         * @see Alpaca.Fields.TextField#getDescription
         */
        getDescription: function() {
            return "Date Field";
        },

        /**
         * @private
         * @see Alpaca.Fields.TextField#getSchemaOfSchema
         */
        getSchemaOfSchema: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "format": {
                        "title": "Format",
                        "description": "Property data format",
                        "type": "string",
                        "default":"date",
                        "enum" : ["date"],
                        "readonly":true
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.Fields.TextField#getOptionsForSchema
         */
        getOptionsForSchema: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "format": {
                        "type": "text"
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.Fields.TextField#getSchemaOfOptions
         */
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "dateFormat": {
                        "title": "Date Format",
                        "description": "Date format (using moment.js format)",
                        "type": "string"
                    },
                    "picker": {
                        "title": "DatetimePicker options",
                        "description": "Options that are supported by the <a href='http://eonasdan.github.io/bootstrap-datetimepicker/'>Bootstrap DateTime Picker</a>.",
                        "type": "any"
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.Fields.TextField#getOptionsForOptions
         */
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "dateFormat": {
                        "type": "text"
                    },
                    "picker": {
                        "type": "any"
                    }
                }
            });
        }

        /* end_builder_helpers */
    });

    Alpaca.registerMessages({
        "invalidDate": "Invalid date for format {0}"
    });
    Alpaca.registerFieldClass("date", Alpaca.Fields.DateField);
    Alpaca.registerDefaultFormatFieldMapping("date", "date");

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.DatetimeField = Alpaca.Fields.DateField.extend(
        /**
         * @lends Alpaca.Fields.DatetimeField.prototype
         */
        {
            /**
             * @see Alpaca.Fields.TextField#getFieldType
             */
            getFieldType: function() {
                return "datetime";
            },

            getDefaultFormat: function() {
                return Alpaca.defaultDateFormat + " " + Alpaca.defaultTimeFormat;
            },

            getDefaultExtraFormats: function() {
                return [
                    Alpaca.defaultDateFormat + " hh:mm:ss a",
                    Alpaca.defaultDateFormat + " HH:mm",
                    Alpaca.defaultDateFormat
                ];
            },

            /**
             * @see Alpaca.Fields.TextField#setup
             */
            setup: function()
            {
                var self = this;

                // default html5 input type = "datetime";
                //this.inputType = "datetime";

                this.base();
            }

            /* builder_helpers */
            ,

            /**
             * @see Alpaca.Fields.TextField#getTitle
             */
            getTitle: function() {
                return "Datetime Field";
            },

            /**
             * @see Alpaca.Fields.TextField#getDescription
             */
            getDescription: function() {
                return "Datetime Field based on <a href='http://eonasdan.github.io/bootstrap-datetimepicker/'>Bootstrap DateTime Picker</a>.";
            }

            /* end_builder_helpers */
        });

    Alpaca.registerFieldClass("datetime", Alpaca.Fields.DatetimeField);

    // "datetime" is legacy (pre v4 schema)
    Alpaca.registerDefaultFormatFieldMapping("datetime", "datetime");

    // official v4 uses date-time
    Alpaca.registerDefaultFormatFieldMapping("date-time", "datetime");

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.EditorField = Alpaca.Fields.TextField.extend(
    /**
     * @lends Alpaca.Fields.EditorField.prototype
     */
    {
        /**
         * @see Alpaca.Fields.TextField#getFieldType
         */
        getFieldType: function() {
            return "editor";
        },

        setup: function()
        {
            var self = this;

            this.base();

            if (!self.options.aceTheme)
            {
                self.options.aceTheme = "ace/theme/chrome";
            }

            if (!self.options.aceMode)
            {
                self.options.aceMode = "ace/mode/json";
            }

            if (typeof(self.options.beautify) == "undefined")
            {
                self.options.beautify = true;
            }

            if (self.options.beautify && this.data)
            {
                if (self.options.aceMode === "ace/mode/json")
                {
                    if (Alpaca.isObject(this.data))
                    {
                        // convert to string to format it
                        this.data = JSON.stringify(this.data, null, "    ");
                    }
                    else if (Alpaca.isString(this.data))
                    {
                        // convert to object and then back to string to format it
                        this.data = JSON.stringify(JSON.parse(this.data), null, "    ");
                    }
                }

                if (self.options.aceMode === "ace/mode/html")
                {
                    if (typeof(html_beautify) !== "undefined")
                    {
                        this.data = html_beautify(this.data);
                    }
                }

                if (self.options.aceMode === "ace/mode/css")
                {
                    if (typeof(css_beautify) !== "undefined")
                    {
                        this.data = css_beautify(this.data);
                    }
                }

                if (self.options.aceMode === "ace/mode/javascript")
                {
                    if (typeof(js_beautify) !== "undefined")
                    {
                        this.data = js_beautify(this.data);
                    }
                }
            }

            if (self.options.aceMode === "ace/mode/json")
            {
                if (!this.data || this.data === "{}")
                {
                    this.data = "{\n\t\n}";
                }
            }

        },

        /**
         * @see Alpaca.Fields.TextField#postRender
         */
        afterRenderControl: function(model, callback)
        {
            var self = this;

            this.base(model, function() {

                if (self.control)
                {
                    /*
                    // ACE HEIGHT
                    var aceHeight = self.options.aceHeight;
                    if (aceHeight)
                    {
                        $(self.control).css("height", aceHeight);
                    }
                    */

                    // ACE WIDTH
                    var aceWidth = self.options.aceWidth;
                    if (!aceWidth) {
                        aceWidth = "100%";
                    }
                    $(self.control).css("width", aceWidth);
                }

                // locate where we will insert the editor
                var el = $(self.control)[0];

                // ace must be included ahead of time
                if (!ace && window.ace) {
                    ace = window.ace;
                }

                if (!ace)
                {
                    Alpaca.logError("Editor Field is missing the 'ace' Cloud 9 Editor");
                }
                else
                {
                    self.editor = ace.edit(el);
                    self.editor.setOptions({
                        maxLines: Infinity
                    });

                    self.editor.getSession().setUseWrapMode(true);

                    // theme
                    var aceTheme = self.options.aceTheme;
                    self.editor.setTheme(aceTheme);

                    // mode
                    var aceMode = self.options.aceMode;
                    self.editor.getSession().setMode(aceMode);

                    self.editor.renderer.setHScrollBarAlwaysVisible(false);
                    //this.editor.renderer.setVScrollBarAlwaysVisible(false); // not implemented
                    self.editor.setShowPrintMargin(false);

                    // set data onto editor
                    if (!self.data) {
                        self.data = "";
                    }
                    self.editor.setValue(self.data);
                    self.editor.clearSelection();

                    // clear undo session
                    self.editor.getSession().getUndoManager().reset();

                    // FIT-CONTENT the height of the editor to the contents contained within
                    if (self.options.aceFitContentHeight)
                    {
                        var heightUpdateFunction = function() {

                            var first = false;
                            if (self.editor.renderer.lineHeight === 0)
                            {
                                first = true;
                                self.editor.renderer.lineHeight = 16;
                            }

                            // http://stackoverflow.com/questions/11584061/
                            var newHeight = self.editor.getSession().getScreenLength() * self.editor.renderer.lineHeight + self.editor.renderer.scrollBar.getWidth();

                            $(self.control).height(newHeight.toString() + "px");

                            // This call is required for the editor to fix all of
                            // its inner structure for adapting to a change in size
                            self.editor.resize();

                            if (first)
                            {
                                window.setTimeout(function() {
                                    self.editor.clearSelection();
                                }, 100);
                            }
                        };

                        // Set initial size to match initial content
                        heightUpdateFunction();

                        // Whenever a change happens inside the ACE editor, update
                        // the size again
                        self.editor.getSession().on('change', heightUpdateFunction);
                    }
                    else
                    {
                        // ACE HEIGHT
                        var aceHeight = self.options.aceHeight;
                        if (aceHeight)
                        {
                            $(self.control).css("min-height", aceHeight + "px");
                        }
                    }

                    // READONLY
                    if (self.schema.readonly)
                    {
                        self.editor.setReadOnly(true);
                    }

                    // if the editor's dom element gets destroyed, make sure we clean up the editor instance
                    // normally, we expect Alpaca fields to be destroyed by the destroy() method but they may also be
                    // cleaned-up via the DOM, thus we check here.
                    $(el).bind('destroyed', function() {

                        if (self.editor)
                        {
                            self.editor.destroy();
                            self.editor = null;
                        }

                    });
                }

                callback();
            });

        },

        /**
         * @see Alpaca.Field#destroy
         */
        destroy: function()
        {
            // destroy the editor instance
            if (this.editor)
            {
                this.editor.destroy();
                this.editor = null;
            }

            // call up to base method
            this.base();
        },

        /**
         * @return the ACE editor instance
         */
        getEditor: function()
        {
            return this.editor;
        },

        /**
         * @see Alpaca.ControlField#handleValidate
         */
        handleValidate: function()
        {
            var baseStatus = this.base();

            var valInfo = this.validation;

            var wordCountStatus =  this._validateWordCount();
            valInfo["wordLimitExceeded"] = {
                "message": wordCountStatus ? "" : Alpaca.substituteTokens(this.getMessage("wordLimitExceeded"), [this.options.wordlimit]),
                "status": wordCountStatus
            };

            var editorAnnotationsStatus = this._validateEditorAnnotations();
            valInfo["editorAnnotationsExist"] = {
                "message": editorAnnotationsStatus ? "" : this.getMessage("editorAnnotationsExist"),
                "status": editorAnnotationsStatus
            };

            return baseStatus && valInfo["wordLimitExceeded"]["status"] && valInfo["editorAnnotationsExist"]["status"];
        },

        _validateEditorAnnotations: function()
        {
            if (this.editor)
            {
                var annotations = this.editor.getSession().getAnnotations();
                if (annotations && annotations.length > 0)
                {
                    return false;
                }
            }

            return true;
        },

        /**
         * Validate for word limit.
         *
         * @returns {Boolean} True if the number of words is equal to or less than the word limit.
         */
        _validateWordCount: function()
        {
            if (this.options.wordlimit && this.options.wordlimit > -1)
            {
                var val = this.editor.getValue();

                if (val)
                {
                    var wordcount = val.split(" ").length;
                    if (wordcount > this.options.wordlimit)
                    {
                        return false;
                    }
                }
            }

            return true;
        },

        /**
         * Force editor to resize to ensure it gets drawn correctly.
         * @override
         */
        onDependentReveal: function()
        {
            if (this.editor)
            {
                this.editor.resize();
            }
        },

        /**
         *@see Alpaca.Fields.TextField#setValue
         */
        setValue: function(value)
        {
            var self = this;

            if (this.editor)
            {
                if (self.schema.type == "object" && Alpaca.isObject(value))
                {
                    // format
                    value = JSON.stringify(value, null, "    ");
                }

                if (!value) {
                    value = "";
                }

                this.editor.setValue(value);
                self.editor.clearSelection();
            }

            // be sure to call into base method
            this.base(value);
        },

        /**
         * @see Alpaca.Fields.ControlField#getControlValue
         */
        getControlValue: function()
        {
            var value = null;

            if (this.editor)
            {
                value = this.editor.getValue();
            }

            // if expected type back is "object", we do the conversion
            if (this.schema.type == "object")
            {
                if (!value)
                {
                    value = {};
                }
                else
                {
                    value = JSON.parse(value);
                }
            }

            return value;
        }


        /* builder_helpers */
        ,

        /**
         * @see Alpaca.Fields.TextField#getTitle
         */
        getTitle: function() {
            return "Editor";
        },

        /**
         * @see Alpaca.Fields.TextField#getDescription
         */
        getDescription: function() {
            return "Editor";
        },

        /**
         * @private
         * @see Alpaca.Fields.TextField#getSchemaOfOptions
         */
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "aceTheme": {
                        "title": "ACE Editor Theme",
                        "description": "Specifies the theme to set onto the editor instance",
                        "type": "string",
                        "default": "ace/theme/twilight"
                    },
                    "aceMode": {
                        "title": "ACE Editor Mode",
                        "description": "Specifies the mode to set onto the editor instance",
                        "type": "string",
                        "default": "ace/mode/javascript"
                    },
                    "aceWidth": {
                        "title": "ACE Editor Height",
                        "description": "Specifies the width of the wrapping div around the editor",
                        "type": "string",
                        "default": "100%"
                    },
                    "aceHeight": {
                        "title": "ACE Editor Height",
                        "description": "Specifies the height of the wrapping div around the editor",
                        "type": "string",
                        "default": "300px"
                    },
                    "aceFitContentHeight": {
                        "title": "ACE Fit Content Height",
                        "description": "Configures the ACE Editor to auto-fit its height to the contents of the editor",
                        "type": "boolean",
                        "default": false
                    },
                    "wordlimit": {
                        "title": "Word Limit",
                        "description": "Limits the number of words allowed in the text area.",
                        "type": "number",
                        "default": -1
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.Fields.TextField#getOptionsForOptions
         */
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "aceTheme": {
                        "type": "text"
                    },
                    "aceMode": {
                        "type": "text"
                    },
                    "wordlimit": {
                        "type": "integer"
                    }
                }
            });
        }

        /* end_builder_helpers */

    });

    Alpaca.registerMessages({
        "wordLimitExceeded": "The maximum word limit of {0} has been exceeded.",
        "editorAnnotationsExist": "The editor has errors in it that must be corrected"
    });

    Alpaca.registerFieldClass("editor", Alpaca.Fields.EditorField);

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.EmailField = Alpaca.Fields.TextField.extend(
    /**
     * @lends Alpaca.Fields.EmailField.prototype
     */
    {
        /**
         * @see Alpaca.Fields.TextField#getFieldType
         */
        getFieldType: function() {
            return "email";
        },

        /**
         * @see Alpaca.Fields.TextField#setup
         */
        setup: function()
        {
            // default html5 input type = "email";
            this.inputType = "email";

            this.base();

            if (!this.schema.pattern)
            {
                this.schema.pattern = Alpaca.regexps.email;
            }
        },

        /**
         * @see Alpaca.Fields.TextField#handleValidate
         */
        handleValidate: function()
        {
            var baseStatus = this.base();

            var valInfo = this.validation;

            if (!valInfo["invalidPattern"]["status"]) {
                valInfo["invalidPattern"]["message"] = this.getMessage("invalidEmail");
            }

            return baseStatus;
        }

        /* builder_helpers */
        ,

        /**
         * @see Alpaca.Fields.TextField#getTitle
         */
        getTitle: function() {
            return "Email Field";
        },

        /**
         * @see Alpaca.Fields.TextField#getDescription
         */
        getDescription: function() {
            return "Email Field.";
        },

        /**
         * @private
         * @see Alpaca.Fields.TextField#getSchemaOfSchema
         */
        getSchemaOfSchema: function() {
            var pattern = (this.schema && this.schema.pattern) ? this.schema.pattern : Alpaca.regexps.email;
            return Alpaca.merge(this.base(), {
                "properties": {
                    "pattern": {
                        "title": "Pattern",
                        "description": "Field Pattern in Regular Expression",
                        "type": "string",
                        "default": pattern,
                        "enum":[pattern],
                        "readonly": true
                    },
                    "format": {
                        "title": "Format",
                        "description": "Property data format",
                        "type": "string",
                        "default":"email",
                        "enum":["email"],
                        "readonly":true
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.Fields.TextField#getOptionsForSchema
         */
        getOptionsForSchema: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "format": {
                        "type": "text"
                    }
                }
            });
        }

        /* end_builder_helpers */
    });

    Alpaca.registerMessages({
        "invalidEmail": "Invalid Email address e.g. info@cloudcms.com"
    });
    Alpaca.registerFieldClass("email", Alpaca.Fields.EmailField);
    Alpaca.registerDefaultFormatFieldMapping("email", "email");

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.GridField = Alpaca.Fields.ArrayField.extend(
    /**
     * @lends Alpaca.Fields.GridField.prototype
     */
    {
        /**
         * @see Alpaca.ControlField#getFieldType
         */
        getFieldType: function() {
            return "grid";
        },

        setup: function()
        {
            this.base();

            if (typeof(this.options.grid) == "undefined")
            {
                this.options.grid = {};
            }
        },

        afterRenderContainer: function(model, callback)
        {
            var self = this;

            this.base(model, function() {

                // convert the data array into the grid's expected format
                var gridData = [];

                // add in headers
                var headers = [];
                for (var key in self.options.fields)
                {
                    var fieldDefinition = self.options.fields[key];

                    var label = key;
                    if (fieldDefinition.label)
                    {
                        label = fieldDefinition.label;
                    }

                    headers.push(label);
                }
                gridData.push(headers);

                for (var i = 0; i < self.data.length; i++)
                {
                    var row = [];
                    for (var key2 in self.data[i])
                    {
                        row.push(self.data[i][key2]);
                    }
                    gridData.push(row);
                }

                /*
                // TODO
                var gridData = [
                    ["Maserati", "Mazda", "Mercedes", "Mini", "Mitsubishi"],
                    ["2009", 0, 2941, 4303, 354, 5814],
                    ["2010", 5, 2905, 2867, 412, 5284],
                    ["2011", 4, 2517, 4822, 552, 6127],
                    ["2012", 2, 2422, 5399, 776, 4151]
                ];
                */

                var holder = $(self.container).find(".alpaca-container-grid-holder");

                var gridConfig = self.options.grid;
                gridConfig.data = gridData;

                $(holder).handsontable(gridConfig);

                callback();
            });
        },

        /**
         * @see Alpaca.ControlField#getType
         */
        getType: function() {
            return "array";
        }

        /* builder_helpers */
        ,

        /**
         * @see Alpaca.ControlField#getTitle
         */
        getTitle: function() {
            return "Grid Field";
        },

        /**
         * @see Alpaca.ControlField#getDescription
         */
        getDescription: function() {
            return "Renders array items into a grid";
        }

        /* end_builder_helpers */
    });

    Alpaca.registerFieldClass("grid", Alpaca.Fields.GridField);

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.ImageField = Alpaca.Fields.TextField.extend(
    /**
     * @lends Alpaca.Fields.ImageField.prototype
     */
    {
        /**
         * @see Alpaca.Fields.TextField#getFieldType
         */
        getFieldType: function() {
            return "image";
        }

        /* builder_helpers */
        ,

        /**
         * @see Alpaca.Fields.TextField#getTitle
         */
        getTitle: function() {
            return "Image Field";
        },

        /**
         * @see Alpaca.Fields.TextField#getDescription
         */
        getDescription: function() {
            return "Image Field.";
        }

        /* end_builder_helpers */
    });

    Alpaca.registerFieldClass("image", Alpaca.Fields.ImageField);

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.IntegerField = Alpaca.Fields.NumberField.extend(
    /**
     * @lends Alpaca.Fields.IntegerField.prototype
     */
    {
        /**
         * @see Alpaca.Fields.NumberField#getFieldType
         */
        getFieldType: function() {
            return "integer";
        },

        /**
         * @see Alpaca.Fields.NumberField#getValue
         */
        getControlValue: function()
        {
            var val = this.base();

            if (typeof(val) == "undefined" || "" == val)
            {
                return val;
            }

            return parseInt(val, 10);
        },

        /**
         * @see Alpaca.Field#onChange
         */
        onChange: function(e)
        {
            this.base();

            if (this.slider)
            {
                this.slider.slider("value", this.getValue());
            }
        },

        /**
         * @see Alpaca.Fields.NumberField#postRender
         */
        postRender: function(callback)
        {
            var self = this;

            this.base(function() {

                if (self.options.slider)
                {
                    if (!Alpaca.isEmpty(self.schema.maximum) && !Alpaca.isEmpty(self.schema.minimum))
                    {
                        if (self.control)
                        {
                            self.control.after('<div id="slider"></div>');

                            self.slider = $('#slider', self.control.parent()).slider({
                                value: self.getValue(),
                                min: self.schema.minimum,
                                max: self.schema.maximum,
                                slide: function(event, ui) {
                                    self.setValue(ui.value);
                                    self.refreshValidationState();
                                }
                            });
                        }
                    }
                }

                callback();
            });
        },

        /**
         * @see Alpaca.Fields.NumberField#handleValidate
         */
        handleValidate: function()
        {
            var baseStatus = this.base();

            var valInfo = this.validation;

            var status = this._validateInteger();
            valInfo["stringNotANumber"] = {
                "message": status ? "" : this.getMessage("stringNotAnInteger"),
                "status": status
            };

            return baseStatus;
        },

        /**
         * Validates if it is an integer.
         *
         * @returns {Boolean} true if it is an integer
         */
        _validateInteger: function()
        {
            // get value as text
            var textValue = this._getControlVal();
            if (typeof(textValue) === "number")
            {
                textValue = "" + textValue;
            }

            // allow empty
            if (Alpaca.isValEmpty(textValue)) {
                return true;
            }

            // check if valid integer format
            var validNumber = Alpaca.testRegex(Alpaca.regexps.integer, textValue);
            if (!validNumber)
            {
                return false;
            }

            // quick check to see if what they entered was a number
            var floatValue = this.getValue();
            if (isNaN(floatValue)) {
                return false;
            }

            return true;
        },

        /**
         * @see Alpaca.Fields.NumberField#getType
         */
        getType: function() {
            return "integer";
        }

        /* builder_helpers */
        ,

        /**
         * @see Alpaca.Fields.NumberField#getTitle
         */
        getTitle: function() {
            return "Integer Field";
        },

        /**
         * @see Alpaca.Fields.NumberField#getDescription
         */
        getDescription: function() {
            return "Field for integers.";
        },

        /**
         * @private
         * @see Alpaca.Fields.NumberField#getSchemaOfSchema
         */
        getSchemaOfSchema: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "minimum": {
                        "title": "Minimum",
                        "description": "Minimum value of the property.",
                        "type": "integer"
                    },
                    "maximum": {
                        "title": "Maximum",
                        "description": "Maximum value of the property.",
                        "type": "integer"
                    },
                    "divisibleBy": {
                        "title": "Divisible By",
                        "description": "Property value must be divisible by this number.",
                        "type": "integer"
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.Fields.NumberField#getOptionsForSchema
         */
        getOptionsForSchema: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "minimum": {
                        "helper": "Minimum value of the field.",
                        "type": "integer"
                    },
                    "maximum": {
                        "helper": "Maximum value of the field.",
                        "type": "integer"
                    },
                    "divisibleBy": {
                        "helper": "Property value must be divisible by this number.",
                        "type": "integer"
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.Fields.NumberField#getSchemaOfOptions
         */
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "slider": {
                        "title": "Slider",
                        "description": "Generate jQuery UI slider control with the field if true.",
                        "type": "boolean",
                        "default": false
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.Fields.NumberField#getOptionsForOptions
         */
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "slider": {
                        "rightLabel": "Slider control ?",
                        "helper": "Generate slider control if selected.",
                        "type": "checkbox"
                    }
                }
            });
        }

        /* end_builder_helpers */
    });

    // Additional Registrations
    Alpaca.registerMessages({
        "stringNotAnInteger": "This value is not an integer."
    });
    Alpaca.registerFieldClass("integer", Alpaca.Fields.IntegerField);
    Alpaca.registerDefaultSchemaFieldMapping("integer", "integer");

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.IPv4Field = Alpaca.Fields.TextField.extend(
    /**
     * @lends Alpaca.Fields.IPv4Field.prototype
     */
    {
        /**
         * @see Alpaca.Fields.TextField#getFieldType
         */
        getFieldType: function() {
            return "ipv4";
        },

        /**
         * @see Alpaca.Fields.TextField#setup
         */
        setup: function()
        {
            this.base();

            if (!this.schema.pattern)
            {
                this.schema.pattern = Alpaca.regexps.ipv4;
            }
        },

        /**
         * @see Alpaca.Fields.TextField#handleValidate
         */
        handleValidate: function()
        {
            var baseStatus = this.base();

            var valInfo = this.validation;

            if (!valInfo["invalidPattern"]["status"])
            {
                valInfo["invalidPattern"]["message"] = this.getMessage("invalidIPv4");
            }

            return baseStatus;
        }

        /* builder_helpers */
        ,

        /**
         * @see Alpaca.Fields.TextField#getTitle
         */
        getTitle: function() {
            return "IP Address Field";
        },

        /**
         * @see Alpaca.Fields.TextField#getDescription
         */
        getDescription: function() {
            return "IP Address Field.";
        },

        /**
         * @private
         * @see Alpaca.Fields.TextField#getSchemaOfSchema
         */
        getSchemaOfSchema: function() {
            var pattern = (this.schema && this.schema.pattern)? this.schema.pattern : Alpaca.regexps.ipv4;
            return Alpaca.merge(this.base(), {
                "properties": {
                    "pattern": {
                        "title": "Pattern",
                        "description": "Field Pattern in Regular Expression",
                        "type": "string",
                        "default": pattern,
                        "readonly": true
                    },
                    "format": {
                        "title": "Format",
                        "description": "Property data format",
                        "type": "string",
                        "enum": ["ip-address"],
                        "default":"ip-address",
                        "readonly":true
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.Fields.TextField#getOptionsForSchema
         */
        getOptionsForSchema: function() {
            return Alpaca.merge(this.base(),{
                "fields": {
                    "format": {
                        "type": "text"
                    }
                }
            });
        }

        /* end_builder_helpers */
    });

    Alpaca.registerMessages({
        "invalidIPv4": "Invalid IPv4 address, e.g. 192.168.0.1"
    });
    Alpaca.registerFieldClass("ipv4", Alpaca.Fields.IPv4Field);
    Alpaca.registerDefaultFormatFieldMapping("ip-address", "ipv4");

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.JSONField = Alpaca.Fields.TextAreaField.extend(
    /**
     * @lends Alpaca.Fields.JSONField.prototype
     */
    {
        /**
         * @see Alpaca.Fields.TextAreaField#getFieldType
         */
        getFieldType: function() {
            return "json";
        },

        /**
         * @see Alpaca.ContainerField#getValue
         */
        setValue: function(value)
        {
            if (Alpaca.isObject(value) || typeof(value) === "object")
            {
                value = JSON.stringify(value, null, 3);
            }

            this.base(value);
        },

        /**
         * @see Alpaca.Fields.ControlField#getControlValue
         */
        getControlValue: function()
        {
            var val = this.base();

            if (val && Alpaca.isString(val))
            {
                val = JSON.parse(val);
            }

            return val;
        },

        /**
         * @see Alpaca.Fields.TextField#handleValidate
         */
        handleValidate: function()
        {
            var baseStatus = this.base();

            var valInfo = this.validation;

            var status = this._validateJSON();
            valInfo["stringNotAJSON"] = {
                "message": status.status ? "" : this.getMessage("stringNotAJSON") +" "+ status.message,
                "status": status.status
            };

            return baseStatus && valInfo["stringNotAJSON"]["status"] ;
        },

        /**
         * Validates if it is a valid JSON object.
         * @returns {Boolean} true if it is a valid JSON object
         */
        _validateJSON: function()
        {
            var textValue = this.control.val();

            // allow null
            if (Alpaca.isValEmpty(textValue))
            {
                return {
                    "status" : true
                };
            }

            // parse the string
            try
            {
                var obj = JSON.parse(textValue);

                // format the string as well
                this.setValue(JSON.stringify(obj, null, 3));
                return {
                    "status" : true
                };
            }
            catch(e)
            {
                return {
                    "status" : false,
                    "message" : e.message
                };
            }
        },

        /**
         * @see Alpaca.Fields.TextAreaField#postRender
         */
        afterRenderControl: function(model, callback)
        {
            var self = this;

            this.base(model, function() {

                if (self.control)
                {
                    // Some auto-formatting capabilities
                    self.control.bind('keypress', function(e) {

                        var code = e.keyCode || e.wich;

                        if (code === 34) {
                            self.control.insertAtCaret('"');
                        }
                        if (code === 123) {
                            self.control.insertAtCaret('}');
                        }
                        if (code === 91) {
                            self.control.insertAtCaret(']');
                        }
                    });

                    self.control.bind('keypress', 'Ctrl+l', function() {
                        self.getFieldEl().removeClass("alpaca-field-focused");

                        // set class from state
                        self.refreshValidationState();
                    });

                    self.control.attr('title','Type Ctrl+L to format and validate the JSON string.');
                }

                callback();

            });

        }

        /* builder_helpers */
        ,

        /**
         * @see Alpaca.Fields.TextAreaField#getTitle
         */
        getTitle: function() {
            return "JSON Editor";
        },

        /**
         * @see Alpaca.Fields.TextAreaField#getDescription
         */
        getDescription: function() {
            return "Editor for JSON objects with basic validation and formatting.";
        }

        /* end_builder_helpers */
    });

    // Additional Registrations
    Alpaca.registerMessages({
        "stringNotAJSON": "This value is not a valid JSON string."
    });

    Alpaca.registerFieldClass("json", Alpaca.Fields.JSONField);

    $.fn.insertAtCaret = function (myValue) {

        return this.each(function() {

            //IE support
            if (document.selection) {

                this.focus();
                sel = document.selection.createRange();
                sel.text = myValue;
                this.focus();

            } else if (this.selectionStart || this.selectionStart == '0') { // jshint ignore:line

                //MOZILLA / NETSCAPE support
                var startPos = this.selectionStart;
                var endPos = this.selectionEnd;
                var scrollTop = this.scrollTop;
                this.value = this.value.substring(0, startPos) + myValue + this.value.substring(endPos, this.value.length);
                this.focus();
                this.selectionStart = startPos /*+ myValue.length*/;
                this.selectionEnd = startPos /*+ myValue.length*/;
                this.scrollTop = scrollTop;

            } else {

                this.value += myValue;
                this.focus();
            }
        });
    };

    /*
     * jQuery Hotkeys Plugin
     * Copyright 2010, John Resig
     * Dual licensed under the MIT or GPL Version 2 licenses.
     *
     * Based upon the plugin by Tzury Bar Yochay:
     * http://github.com/tzuryby/hotkeys
     *
     * Original idea by:
     * Binny V A, http://www.openjs.com/scripts/events/keyboard_shortcuts/
    */
    jQuery.hotkeys = {
        version: "0.8",

        specialKeys: {
            8: "backspace", 9: "tab", 13: "return", 16: "shift", 17: "ctrl", 18: "alt", 19: "pause",
            20: "capslock", 27: "esc", 32: "space", 33: "pageup", 34: "pagedown", 35: "end", 36: "home",
            37: "left", 38: "up", 39: "right", 40: "down", 45: "insert", 46: "del",
            96: "0", 97: "1", 98: "2", 99: "3", 100: "4", 101: "5", 102: "6", 103: "7",
            104: "8", 105: "9", 106: "*", 107: "+", 109: "-", 110: ".", 111 : "/",
            112: "f1", 113: "f2", 114: "f3", 115: "f4", 116: "f5", 117: "f6", 118: "f7", 119: "f8",
            120: "f9", 121: "f10", 122: "f11", 123: "f12", 144: "numlock", 145: "scroll", 191: "/", 224: "meta"
        },

        shiftNums: {
            "`": "~", "1": "!", "2": "@", "3": "#", "4": "$", "5": "%", "6": "^", "7": "&",
            "8": "*", "9": "(", "0": ")", "-": "_", "=": "+", ";": ": ", "'": "\"", ",": "<",
            ".": ">",  "/": "?",  "\\": "|"
        }
    };

    function keyHandler( handleObj ) {
        // Only care when a possible input has been specified
        if ( typeof handleObj.data !== "string" ) {
            return;
        }

        var origHandler = handleObj.handler,
            keys = handleObj.data.toLowerCase().split(" ");

        handleObj.handler = function( event ) {
            // Don't fire in text-accepting inputs that we didn't directly bind to
            if ( this !== event.target && (/textarea|select/i.test( event.target.nodeName ) ||
                 event.target.type === "text") ) {
                return;
            }

            // Keypress represents characters, not special keys
            var special = event.type !== "keypress" && jQuery.hotkeys.specialKeys[ event.which ],
                character = String.fromCharCode( event.which ).toLowerCase(),
                key, modif = "", possible = {};

            // check combinations (alt|ctrl|shift+anything)
            if ( event.altKey && special !== "alt" ) {
                modif += "alt+";
            }

            if ( event.ctrlKey && special !== "ctrl" ) {
                modif += "ctrl+";
            }

            // TODO: Need to make sure this works consistently across platforms
            if ( event.metaKey && !event.ctrlKey && special !== "meta" ) {
                modif += "meta+";
            }

            if ( event.shiftKey && special !== "shift" ) {
                modif += "shift+";
            }

            if ( special ) {
                possible[ modif + special ] = true;

            } else {
                possible[ modif + character ] = true;
                possible[ modif + jQuery.hotkeys.shiftNums[ character ] ] = true;

                // "$" can be triggered as "Shift+4" or "Shift+$" or just "$"
                if ( modif === "shift+" ) {
                    possible[ jQuery.hotkeys.shiftNums[ character ] ] = true;
                }
            }

            for ( var i = 0, l = keys.length; i < l; i++ ) {
                if ( possible[ keys[i] ] ) {
                    return origHandler.apply( this, arguments );
                }
            }
        };
    }

    jQuery.each([ "keydown", "keyup", "keypress" ], function() {
        jQuery.event.special[ this ] = { add: keyHandler };
    });

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.LowerCaseField = Alpaca.Fields.TextField.extend(
    /**
     * @lends Alpaca.Fields.LowerCaseField.prototype
     */
    {
        /**
         * @see Alpaca.Fields.TextField#getFieldType
         */
        getFieldType: function() {
            return "lowercase";
        },

        /**
         * @see Alpaca.Fields.TextField#setup
         */
        setup: function()
        {
            var self = this;

            this.base();

            if (this.data) {
                this.data = this.data.toLowerCase();
            }
        },

        /**
         * @see Alpaca.Fields.TextField#setValue
         */
        setValue: function(val)
        {
            if (!val)
            {
                return this.base(val);
            }

            var lowerValue = val.toLowerCase();

            if (lowerValue != this.getValue()) // jshint ignore:line
            {
                this.base(lowerValue);
            }
        },

        /**
         * @see Alpaca.ControlField#onKeyPress
         */
        onKeyPress: function(e)
        {
            this.base(e);

            var _this = this;

            Alpaca.later(25, this, function() {
                var v = _this.getValue();
                _this.setValue(v);
            });
        }

        /* builder_helpers */
        ,

        /**
         * @see Alpaca.Fields.TextField#getTitle
         */
        getTitle: function() {
            return "Lowercase Text";
        },

        /**
         * @see Alpaca.Fields.TextField#getDescription
         */
        getDescription: function() {
            return "Text field for lowercase text.";
        }

        /* end_builder_helpers */
    });

    Alpaca.registerFieldClass("lowercase", Alpaca.Fields.LowerCaseField);
    Alpaca.registerDefaultFormatFieldMapping("lowercase", "lowercase");

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.MapField = Alpaca.Fields.ArrayField.extend(
    /**
     * @lends Alpaca.Fields.MapField.prototype
     */
    {
        /**
         * @see Alpaca.Fields.TextAreaField#getFieldType
         */
        getFieldType: function() {
            return "map";
        },

        getType: function()
        {
            return "object"
        },

        /**
         * @see Alpaca.Fields.TextAreaField#setup
         */
        setup: function()
        {
            // special handling - data can come in as an object, we convert to array
            if (this.data && Alpaca.isObject(this.data))
            {
                var newData = [];

                $.each(this.data, function(key, value) {
                    var newValue = Alpaca.copyOf(value);
                    newValue["_key"] = key;
                    newData.push(newValue);
                });

                this.data = newData;
            }

            this.base();

            Alpaca.mergeObject(this.options, {
                "forceRevalidation" : true
            });

            if (Alpaca.isEmpty(this.data))
            {
                return;
            }
        },

        /**
         * @see Alpaca.ContainerField#getContainerValue
         */
        getContainerValue: function()
        {
            // if we don't have any children and we're not required, hand back undefined
            if (this.children.length === 0 && !this.isRequired())
            {
                return;
            }

            // special handling, convert back to object
            var o = {};
            for (var i = 0; i < this.children.length; i++)
            {
                var v = this.children[i].getValue();
                var key = v["_key"];
                if (key)
                {
                    delete v["_key"];
                    o[key] = v;
                }
            }

            return o;
        },

        /**
         * @see Alpaca.Fields.TextField#handleValidate
         */
        handleValidate: function()
        {
            var baseStatus = this.base();

            var valInfo = this.validation;

            var isValidMapKeysNotEmpty = this._validateMapKeysNotEmpty();
            valInfo["keyMissing"] = {
                "message": isValidMapKeysNotEmpty ? "" : this.getMessage("keyMissing"),
                "status": isValidMapKeysNotEmpty
            };

            var isValidMapKeysUnique = this._validateMapKeysUnique();
            valInfo["keyNotUnique"] = {
                "message": isValidMapKeysUnique ? "" : this.getMessage("keyNotUnique"),
                "status": isValidMapKeysUnique
            };

            return baseStatus && valInfo["keyMissing"]["status"] && valInfo["keyNotUnique"]["status"];
        },

        /**
         * Validates that key fields are not empty.
         *
         * @returns {Boolean} true if keys are not empty
         */
        _validateMapKeysNotEmpty: function()
        {
            var isValid = true;

            for (var i = 0; i < this.children.length; i++)
            {
                var v = this.children[i].getValue();
                var key = v["_key"];

                if (!key)
                {
                    isValid = false;
                    break;
                }
            }

            return isValid;
        },

        /**
         * Validates if key fields are unique.
         *
         * @returns {Boolean} true if keys are unique
         */
        _validateMapKeysUnique: function()
        {
            var isValid = true;

            var keys = {};
            for (var i = 0; i < this.children.length; i++)
            {
                var v = this.children[i].getValue();
                var key = v["_key"];

                if (keys[key])
                {
                    isValid = false;
                }

                keys[key] = key;
            }

            return isValid;
        }

        /* builder_helpers */
        ,

        /**
         * @see Alpaca.Fields.TextAreaField#getTitle
         */
        getTitle: function() {
            return "Map Field";
        },

        /**
         * @see Alpaca.Fields.TextAreaField#getDescription
         */
        getDescription: function() {
            return "Field for objects with key/value pairs that share the same schema for values.";
        }

        /* end_builder_helpers */
    });

    Alpaca.registerFieldClass("map", Alpaca.Fields.MapField);

    // Additional Registrations
    Alpaca.registerMessages({
        "keyNotUnique": "Keys of map field are not unique.",
        "keyMissing": "Map contains an empty key."
    });

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.OptionTreeField = Alpaca.Fields.TextField.extend(
    /**
     * @lends Alpaca.Fields.OptionTree.prototype
     */
    {
        /**
         * @see Alpaca.Fields.ObjectField#getFieldType
         */
        getFieldType: function() {
            return "optiontree";
        },

        /**
         * @private
         * @see Alpaca.Fields.ObjectField#setup
         */
        setup: function()
        {
            var self = this;

            this.base();

            if (!this.options.tree)
            {
                this.options.tree = {};
            }

            if (!this.options.tree.selectors)
            {
                this.options.tree.selectors = {};
            }

            if (!this.options.tree.order)
            {
                this.options.tree.order = [];
            }

            // ensure all options have schema
            for (var k in this.options.tree.selectors)
            {
                if (!this.options.tree.selectors[k].schema) {
                    Alpaca.logError("OptionTree selector for: " + k + " is missing schema");
                    return;
                }

                if (!this.options.tree.selectors[k].options) {
                    this.options.tree.selectors[k].options = {};
                }
            }

            if (!this.options.tree.data)
            {
                this.options.tree.data = [];
            }

            // walk data
            for (var i = 0; i < this.options.tree.data.length; i++)
            {
                var item = this.options.tree.data[i];

                if (item.attributes)
                {
                    for (var k in item.attributes)
                    {
                        if (!this.options.tree.selectors[k])
                        {
                            this.options.tree.selectors[k] = {};
                        }

                        if (!this.options.tree.selectors[k].label)
                        {
                            this.options.tree.selectors[k].options.noneLabel = "Choose...";
                        }

                        if (!this.options.tree.selectors[k].type)
                        {
                            this.options.tree.selectors[k].options.type = "select";
                        }
                    }
                }
            }

            // assume the order from the options if not otherwise provided
            if (!self.options.tree.order)
            {
                self.options.tree.order = [];

                for (var k in self.options.tree.selectors)
                {
                    self.options.tree.order.push(self.options.tree.selectors[k]);
                }
            }

            if (typeof(self.options.tree.horizontal) === "undefined")
            {
                self.options.tree.horizontal = true;
            }

            // create a lookup list for option list key/value based on location
            this.locationValueLists = {};
            this.locationValues = {};

            for (var i = 0; i < self.options.tree.data.length; i++)
            {
                if (self.options.tree.data[i].attributes)
                {
                    var location = "root";

                    for (var k in self.options.tree.data[i].attributes)
                    {
                        var v = self.options.tree.data[i].attributes[k];

                        var array = this.locationValueLists[location];
                        if (!array) {
                            array = [];
                            this.locationValueLists[location] = array;
                        }

                        var exists = false;
                        for (var x = 0; x < array.length; x++)
                        {
                            if (array[x].value === v) {
                                exists = true;
                                break;
                            }
                        }

                        if (!exists)
                        {
                            array.push({
                                "text": v,
                                "value": v
                            });
                        }

                        if (location.length > 0) {
                            location += "~";
                        }

                        location += k + "=" + v;
                    }

                    this.locationValues[location] = self.options.tree.data[i].value;
                }
            }

            this.currentAttributes = {};
            this.controls = {};
        },

        toLocation: function(attrs)
        {
            var location = "root";

            for (var k in attrs)
            {
                var v = attrs[k];

                if (location.length > 0) {
                    location += "~";
                }

                location += k + "=" + v;
            }

            return location;
        },

        existsLocationWithPrefix: function(prefix)
        {
            var match = false;

            for (var k in this.locationValueLists)
            {
                if (k.indexOf(prefix) > -1)
                {
                    match = true;
                    break;
                }
            }

            return match;
        },

        /**
         * @see Alpaca.Field#afterRenderControl
         */
        afterRenderControl: function(model, callback) {

            var self = this;

            self.optionTreeHolder = $(self.field).find(".optiontree");

            if (self.options.tree.horizontal)
            {
                $(self.field).addClass("optiontree-horizontal");
            }

            this.base(model, function() {

                self.refreshOptionTreeControls(function() {
                    callback();
                });

            });
        },

        refreshOptionTreeControls: function(callback)
        {
            var self = this;

            // hide all of the controls
            for (var k in self.controls)
            {
                self.controls[k].hide();
            }

            // find the index of the last option for which we are missing a value
            var displayUpToIndex = 0;
            for (var i = 0; i < self.options.tree.order.length; i++)
            {
                var selectorId = self.options.tree.order[i];

                if (typeof(self.currentAttributes[selectorId]) !== "undefined" && self.currentAttributes[selectorId] !== null  && self.currentAttributes[selectorId] !== "")
                {
                    displayUpToIndex++;
                }
            }

            // walk through order and construct render functions
            var location = "root";
            var fns = [];
            var displayCount = 0;
            var i = 0;
            do
            {
                if (i < self.options.tree.order.length)
                {
                    var selectorId = self.options.tree.order[i];

                    var hasMatches = (i == self.options.tree.order.length - 1) || (self.existsLocationWithPrefix(location + "~" + selectorId + "="));
                    if (hasMatches)
                    {
                        if (displayCount <= displayUpToIndex)
                        {
                            if (self.controls[selectorId])
                            {
                                // show this one
                                self.controls[selectorId].show();

                                location += "~" + selectorId + "=" + self.currentAttributes[selectorId];
                            }
                            else
                            {
                                var selector = self.options.tree.selectors[selectorId];
                                var last = (i + 1 === self.options.tree.order.length);

                                var fn = function(index, selectorId, selector, controls, optionTreeHolder, last) {
                                    return function(done) {

                                        var alpacaSchema = selector.schema;

                                        var alpacaOptions = selector.options;
                                        if (!alpacaOptions) {
                                            alpacaOptions = {};
                                        }
                                        if (!alpacaOptions.type) {
                                            alpacaOptions.type = "select";
                                        }

                                        if (alpacaOptions.type === "select") {

                                            alpacaOptions.dataSource = function(callback) {

                                                var currentLocation = self.toLocation(self.currentAttributes);
                                                var currentValueList = self.locationValueLists[currentLocation];

                                                callback(currentValueList);

                                            };
                                        }

                                        // render via alpaca
                                        var domEl = $("<div class='optiontree-selector'></div>");

                                        $(domEl).alpaca({
                                            "schema": alpacaSchema,
                                            "options": alpacaOptions,
                                            "postRender": function(control) {

                                                controls[selectorId] = control;

                                                // append to the holder element
                                                $(optionTreeHolder).append(domEl);

                                                control.selectorId = selectorId;

                                                // when the value of this control changes, we record it into our
                                                // current attribute set
                                                control.on("change", function() {

                                                    var selectorId = this.selectorId;

                                                    // set our attribute value
                                                    self.currentAttributes[selectorId] = this.getValue();

                                                    // clear out everything past our index value
                                                    for (var i = 0; i < self.options.tree.order.length; i++)
                                                    {
                                                        if (i > index)
                                                        {
                                                            var selectorId = self.options.tree.order[i];
                                                            delete self.currentAttributes[selectorId];
                                                            if (controls[selectorId])
                                                            {
                                                                controls[selectorId].destroy();
                                                                delete controls[selectorId];
                                                            }
                                                        }
                                                    }

                                                    if (last)
                                                    {
                                                        // find the match
                                                        var val = null;

                                                        for (var i = 0; i < self.options.tree.data.length; i++)
                                                        {
                                                            var match = true;

                                                            var attrs = self.options.tree.data[i].attributes;
                                                            for (var k in self.currentAttributes)
                                                            {
                                                                if (attrs[k] !== self.currentAttributes[k])
                                                                {
                                                                    match = false;
                                                                    break;
                                                                }
                                                            }

                                                            if (match)
                                                            {
                                                                val = self.options.tree.data[i].value;
                                                            }
                                                        }

                                                        if (val)
                                                        {
                                                            self.setValue(val);
                                                        }
                                                    }

                                                    self.refreshOptionTreeControls();
                                                });

                                                // show by default
                                                control.show();

                                                done();
                                            }
                                        });
                                    }
                                }(i, selectorId, selector, self.controls, self.optionTreeHolder, last);

                                fns.push(fn);

                                location += "~" + selectorId + "=" + self.currentAttributes[selectorId];
                            }

                            displayCount++;
                        }
                        else
                        {
                            if (self.controls[selectorId])
                            {
                                self.controls[selectorId].destroy();
                                delete self.controls[selectorId];
                            }
                        }
                    }
                    else
                    {
                        if (self.controls[selectorId])
                        {
                            self.controls[selectorId].destroy();
                            delete self.controls[selectorId];
                        }
                    }
                }

                i++;
            }
            while (i < self.options.tree.order.length);

            Alpaca.series(fns, function() {

                if (callback)
                {
                    callback();
                }

            });

        },

        /**
         * @see Alpaca.Fields.ObjectField#getType
         */
        getType: function() {
            return "any";
        }

        /* builder_helpers */
        ,

        /**
         * @see Alpaca.Fields.ObjectField#getTitle
         */
        getTitle: function() {
            return "Option Tree";
        },

        /**
         * @see Alpaca.Fields.ObjectField#getDescription
         */
        getDescription: function() {
            return "Option Tree";
        },

        /**
         * @private
         * @see Alpaca.Fields.ObjectField#getSchemaOfOptions
         */
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "tree": {
                        "type": "object",
                        "properties": {
                            "options": {
                                "type": "object"
                            },
                            "order": {
                                "type": "array",
                                "items": {
                                    "type": "string"
                                }
                            },
                            "data": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "value": {
                                            "type": "any"
                                        },
                                        "attributes": {
                                            "type": "object"
                                        }
                                    }
                                }
                            },
                            "horizontal": {
                                "type": "boolean"
                            }
                        }
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.Fields.ObjectField#getOptionsForOptions
         */
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                }
            });
        }

        /* end_builder_helpers */
    });

    Alpaca.registerFieldClass("optiontree", Alpaca.Fields.OptionTreeField);

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.PasswordField = Alpaca.Fields.TextField.extend(
    /**
     * @lends Alpaca.Fields.PasswordField.prototype
     */
    {
        /**
         * @see Alpaca.Fields.TextField#getFieldType
         */
        getFieldType: function() {
            return "password";
        },

        /**
         * @see Alpaca.Fields.TextField#setup
         */
        setup: function()
        {
            this.base();

            if (!this.schema.pattern)
            {
                this.schema.pattern = Alpaca.regexps.password;
            }
        },

        /**
         * @see Alpaca.Fields.TextField#handleValidate
         */
        handleValidate: function()
        {
            var baseStatus = this.base();

            var valInfo = this.validation;

            if (!valInfo["invalidPattern"]["status"]) {
                valInfo["invalidPattern"]["message"] = this.getMessage("invalidPassword");
            }

            return baseStatus;
        }

        /* builder_helpers */
        ,

        /**
         * @see Alpaca.Fields.TextField#getTitle
         */
        getTitle: function() {
            return "Password Field";
        },

        /**
         * @see Alpaca.Fields.TextField#getDescription
         */
        getDescription: function() {
            return "Password Field.";
        },

        /**
         * @private
         * @see Alpaca.Fields.TextField#getSchemaOfSchema
         */
        getSchemaOfSchema: function() {
            var pattern = (this.schema && this.schema.pattern)? this.schema.pattern : /^[0-9a-zA-Z\x20-\x7E]*$/;
            return Alpaca.merge(this.base(), {
                "properties": {
                    "pattern": {
                        "title": "Pattern",
                        "description": "Field Pattern in Regular Expression",
                        "type": "string",
                        "default": this.schema.pattern,
                        "enum":[pattern],
                        "readonly": true
                    },
					"format": {
                        "title": "Format",
                        "description": "Property data format",
                        "type": "string",
						"default":"password",
                        "enum":["password"],
						"readonly":true
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.Fields.TextField#getOptionsForSchema
         */
		getOptionsForSchema: function() {
            return Alpaca.merge(this.base(),{
				"fields": {
					"format": {
						"type": "text"
					}
				}
			});
        }

		/* end_builder_helpers */
    });

    Alpaca.registerMessages({
        "invalidPassword": "Invalid Password"
    });
    Alpaca.registerFieldClass("password", Alpaca.Fields.PasswordField);
    Alpaca.registerDefaultFormatFieldMapping("password", "password");
})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.PersonalNameField = Alpaca.Fields.TextField.extend(
    /**
     * @lends Alpaca.Fields.PersonalNameField.prototype
     */
    {
        /**
         * @see Alpaca.Fields.TextField#getFieldType
         */
        getFieldType: function() {
            return "personalname";
        },

        /**
         * @see Alpaca.Fields.TextField#setValue
         */
        setValue: function(val)
        {
            if (!val)
            {
                return this.base(val);
            }

            // convert to upper-case
            var upperValue = "";

            for (var i = 0; i < val.length; i++)
            {
                if (i === 0)
                {
                    upperValue += val.charAt(i).toUpperCase();
                }
                else if (val.charAt(i - 1) === ' ' || val.charAt(i - 1) === '-' || val.charAt(i - 1) === "'")
                {
                    upperValue += val.charAt(i).toUpperCase();
                }
                else
                {
                    upperValue += val.charAt(i);
                }
            }

            if (upperValue != this.getValue()) // jshint ignore:line
            {
                this.base(upperValue);
            }
        },

        /**
         * @see Alpaca.ControlField#onKeyPress
         */
        onKeyPress: function(e)
        {
            this.base(e);

            var _this = this;

            Alpaca.later(25, this, function() {
                var v = _this.getValue();
                _this.setValue(v);
            });

        }

        /* builder_helpers */
        ,

        /**
         * @see Alpaca.Fields.TextField#getTitle
         */
        getTitle: function() {
            return "Personal Name";
        },

        /**
         * @see Alpaca.Fields.TextField#getDescription
         */
        getDescription: function() {
            return "Text Field for personal name with capital letter for first letter & after hyphen, space or apostrophe.";
        }

        /* end_builder_helpers */
    });

    Alpaca.registerFieldClass("personalname", Alpaca.Fields.PersonalNameField);

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.PhoneField = Alpaca.Fields.TextField.extend(
    /**
     * @lends Alpaca.Fields.PhoneField.prototype
     */
    {
        /**
         * @see Alpaca.Fields.TextField#setup
         */
        setup: function()
        {
            // default html5 input type = "tel";
            this.inputType = "tel";

            this.base();

            if (!this.schema.pattern) {
                this.schema.pattern = Alpaca.regexps.phone;
            }

            if (Alpaca.isEmpty(this.options.maskString)) {
                this.options.maskString = "(999) 999-9999";
            }

        },

        /**
         * @see Alpaca.Fields.TextField#postRender
         */
        postRender: function(callback) {

            var self = this;

            this.base(function() {

                callback();

            });
        },

        /**
         * @see Alpaca.Fields.TextField#handleValidate
         */
        handleValidate: function() {
            var baseStatus = this.base();

            var valInfo = this.validation;

            if (!valInfo["invalidPattern"]["status"]) {
                valInfo["invalidPattern"]["message"] = this.getMessage("invalidPhone");
            }

            return baseStatus;
        },

        /**
         * @see Alpaca.Fields.TextField#getFieldType
         */
        getFieldType: function() {
            return "phone";
        }

        /* builder_helpers */
        ,

        /**
         * @see Alpaca.Fields.TextField#getTitle
         */
        getTitle: function() {
            return "Phone Field";
        },

        /**
         * @see Alpaca.Fields.TextField#getDescription
         */
        getDescription: function() {
            return "Phone Field.";
        },

        /**
         * @private
         * @see Alpaca.Fields.TextField#getSchemaOfSchema
         */
        getSchemaOfSchema: function() {
            var pattern = (this.schema && this.schema.pattern) ? this.schema.pattern : Alpaca.regexps.phone;
            return Alpaca.merge(this.base(), {
                "properties": {
                    "pattern": {
                        "title": "Pattern",
                        "description": "Field Pattern in Regular Expression",
                        "type": "string",
                        "default": pattern,
                        "enum":[pattern],
                        "readonly": true
                    },
                    "format": {
                        "title": "Format",
                        "description": "Property data format",
                        "type": "string",
                        "default":"phone",
                        "enum":["phone"],
                        "readonly":true
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.Fields.TextField#getOptionsForSchema
         */
        getOptionsForSchema: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "format": {
                        "type": "text"
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.Fields.TextField#getSchemaOfOptions
         */
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "maskString": {
                        "title": "Field Mask String",
                        "description": "Expression for field mask",
                        "type": "string",
                        "default": "(999) 999-9999"
                    }
                }
            });
        }

        /* end_builder_helpers */
    });

    Alpaca.registerMessages({
        "invalidPhone": "Invalid Phone Number, e.g. (123) 456-9999"
    });
    Alpaca.registerFieldClass("phone", Alpaca.Fields.PhoneField);
    Alpaca.registerDefaultFormatFieldMapping("phone", "phone");

})(jQuery);

/**
 * Uses: https://github.com/billyaraujo/pick-a-color
 */
(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.PickAColorField = Alpaca.Fields.TextField.extend(
    /**
     * @lends Alpaca.Fields.PickAColorField.prototype
     */
    {
        /**
         * @see Alpaca.Fields.TextField#setup
         */
        setup: function()
        {
            var self = this;

            this.pickAColorFieldAvailable = false;
            if (!self.isDisplayOnly() && typeof($.fn.pickAColor) !== "undefined")
            {
                this.pickAColorFieldAvailable = true;
            }

            // default html5 input type = "color";
            if (typeof(this.options.pickacolor) === "undefined" && !self.pickAColorFieldAvailable)
            {
                this.inputType = "color";
            }

            this.base();

            // set up default spectrum settings
            if (typeof(this.options.pickacolor) === "undefined")
            {
                this.options.pickacolor = {
                    showSpectrum          : true,
                    showSavedColors       : true,
                    saveColorsPerElement  : false,
                    fadeMenuToggle        : true,
                    showAdvanced          : true,
                    showBasicColors       : true,
                    showHexInput          : true,
                    allowBlank            : true,
                    inlineDropdown        : false
                };
            }

            // if colors not specified, use default colors
            if (typeof(this.options.colors) === "undefined")
            {
                this.options.colors = {
                    white: "#ffffff",
                    clouds: "#ecf0f1",
                    red: "#c0392b",
                    orange: "#e67e22",
                    yellow: "#f1c40f",
                    green: "#27ae60",
                    blue: "#2980b9",
                    purple: "#8e44ad",
                    dark: "#34495e",
                    black: "#000000",
                    brown: "#bb9977"
                };
            }

            if (this.options.pickacolor && typeof(this.options.pickacolor.basicColors) === "undefined")
            {
                this.options.pickacolor.basicColors = this.options.colors;
            }

            if (typeof(this.options.pickacolor.inlineDropdown) === "undefined")
            {
                this.options.pickacolor.inlineDropdown = false;
            }
        },

        /**
         * @see Alpaca.Fields.TextField#getFieldType
         */
        getFieldType: function() {
            return "pickacolor";
        },

        /**
         * @see Alpaca.Fields.TextField#getType
         */
        getType: function() {
            return "string";
        },

        afterRenderControl: function(model, callback)
        {
            var self = this;

            this.base(model, function() {

                if (self.control)
                {
                    // if we can render the plugin...
                    if (self.pickAColorFieldAvailable && self.options.pickacolor)
                    {
                        if (self.data) {
                            $(self.control).attr("value", self.data);
                        }

                        $(self.control).addClass("pick-a-color");
                        $(self.control).pickAColor(self.options.pickacolor);

                        $(self.control).on("change", function(e) {
                            self.setValue($(this).val());
                            self.refresh();
                        });
                    }
                }

                callback();
            });
        }

        /* builder_helpers */
        ,

        /**
         * @see Alpaca.Fields.TextField#getTitle
         */
        getTitle: function() {
            return "Pick-A-Color Field";
        },

        /**
         * @see Alpaca.Fields.TextField#getDescription
         */
        getDescription: function() {
            return "A color picker for selecting hexadecimal color values";
        }

        /* end_builder_helpers */
    });

    Alpaca.registerFieldClass("pickacolor", Alpaca.Fields.PickAColorField);

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.SearchField = Alpaca.Fields.TextField.extend(
    /**
     * @lends Alpaca.Fields.SearchField.prototype
     */
    {
        /**
         * @see Alpaca.Fields.TextField#setup
         */
        setup: function()
        {
            // default html5 input type = "search";
            this.inputType = "search";

            this.base();

            this.options.attributes.results = 5;
        },

        /**
         * @see Alpaca.Fields.TextField#getFieldType
         */
        getFieldType: function() {
            return "search";
        },

        /**
         * @see Alpaca.Fields.TextField#getType
         */
        getType: function() {
            return "string";
        },

        /* builder_helpers */

        /**
         * @see Alpaca.Fields.TextField#getTitle
         */
        getTitle: function() {
            return "Search Field";
        },

        /**
         * @see Alpaca.Fields.TextField#getDescription
         */
        getDescription: function() {
            return "A search box field";
        }

        /* end_builder_helpers */
    });

    Alpaca.registerFieldClass("search", Alpaca.Fields.SearchField);
    Alpaca.registerDefaultSchemaFieldMapping("search", "search");

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.usHoldings = {};

    Alpaca.usHoldings.territories = {
        "American Samoa"                 : "AS",
        "District Of Columbia"           : "DC",
        "Federated States Of Micronesia" : "FM",
        "Guam"                           : "GU",
        "Marshall Islands"               : "MH",
        "Northern Mariana Islands"       : "MP",
        "Palau"                          : "PW",
        "Puerto Rico"                    : "PR",
        "Virgin Islands"                 : "VI"
    };

    Alpaca.usHoldings.states =  {
        "Alabama"                        : "AL",
        "Alaska"                         : "AK",
        "Arizona"                        : "AZ",
        "Arkansas"                       : "AR",
        "California"                     : "CA",
        "Colorado"                       : "CO",
        "Connecticut"                    : "CT",
        "Delaware"                       : "DE",
        "Florida"                        : "FL",
        "Georgia"                        : "GA",
        "Hawaii"                         : "HI",
        "Idaho"                          : "ID",
        "Illinois"                       : "IL",
        "Indiana"                        : "IN",
        "Iowa"                           : "IA",
        "Kansas"                         : "KS",
        "Kentucky"                       : "KY",
        "Louisiana"                      : "LA",
        "Maine"                          : "ME",
        "Maryland"                       : "MD",
        "Massachusetts"                  : "MA",
        "Michigan"                       : "MI",
        "Minnesota"                      : "MN",
        "Mississippi"                    : "MS",
        "Missouri"                       : "MO",
        "Montana"                        : "MT",
        "Nebraska"                       : "NE",
        "Nevada"                         : "NV",
        "New Hampshire"                  : "NH",
        "New Jersey"                     : "NJ",
        "New Mexico"                     : "NM",
        "New York"                       : "NY",
        "North Carolina"                 : "NC",
        "North Dakota"                   : "ND",
        "Ohio"                           : "OH",
        "Oklahoma"                       : "OK",
        "Oregon"                         : "OR",
        "Pennsylvania"                   : "PA",
        "Rhode Island"                   : "RI",
        "South Carolina"                 : "SC",
        "South Dakota"                   : "SD",
        "Tennessee"                      : "TN",
        "Texas"                          : "TX",
        "Utah"                           : "UT",
        "Vermont"                        : "VT",
        "Virginia"                       : "VA",
        "Washington"                     : "WA",
        "West Virginia"                  : "WV",
        "Wisconsin"                      : "WI",
        "Wyoming"                        : "WY"
    };

    Alpaca.Fields.StateField = Alpaca.Fields.SelectField.extend(
    /**
     * @lends Alpaca.Fields.StateField.prototype
     */
    {
        /**
         * @see Alpaca.Fields.TextField#getFieldType
         */
        getFieldType: function() {
            return "state";
        },

        /**
         * @see Alpaca.Fields.TextField#setup
         */
        setup: function()
        {
            // defaults
            if (Alpaca.isUndefined(this.options.capitalize)) {
                this.options.capitalize = false;
            }
            if (Alpaca.isUndefined(this.options.includeStates)) {
                this.options.includeStates = true;
            }
            if (Alpaca.isUndefined(this.options.includeTerritories)) {
                this.options.includeTerritories = true;
            }
            if (Alpaca.isUndefined(this.options.format)) {
                this.options.format = "name";
            }

            // validate settings
            if (this.options.format === "name" || this.options.format === "code")
            {
                // valid formats
            }
            else
            {
                Alpaca.logError("The configured state format: " + this.options.format + " is not a legal value [name, code]");

                // default to name format
                this.options.format = "name";
            }

            // configure
            var holdings = Alpaca.retrieveUSHoldings(
                this.options.includeStates,
                this.options.includeTerritories,
                (this.options.format === "code"),
                this.options.capitalize);

            this.schema["enum"] = holdings.keys;
            this.options.optionLabels = holdings.values;

            this.base();
        }


        /* builder_helpers */
        ,

        /**
         * @see Alpaca.Fields.TextField#getTitle
         */
        getTitle: function() {
            return "State Field";
        },

        /**
         * @see Alpaca.Fields.TextField#getDescription
         */
        getDescription: function() {
            return "Provides a dropdown selector of states and/or territories in the United States, keyed by their two-character code.";
        },

        /**
         * @private
         * @see Alpaca.Fields.TextField#getSchemaOfOptions
         */
        getSchemaOfOptions: function() {

            return Alpaca.merge(this.base(), {
                "properties": {
                    "format": {
                        "title": "Format",
                        "description": "How to represent the state values in the selector",
                        "type": "string",
                        "default": "name",
                        "enum":["name", "code"],
                        "readonly": true
                    },
                    "capitalize": {
                        "title": "Capitalize",
                        "description": "Whether the values should be capitalized",
                        "type": "boolean",
                        "default": false,
                        "readonly": true
                    },
                    "includeStates": {
                        "title": "Include States",
                        "description": "Whether to include the states of the United States",
                        "type": "boolean",
                        "default": true,
                        "readonly": true
                    },
                    "includeTerritories": {
                        "title": "Include Territories",
                        "description": "Whether to include the territories of the United States",
                        "type": "boolean",
                        "default": true,
                        "readonly": true
                    }
                }
            });

        },

        /**
         * @private
         * @see Alpaca.Fields.TextField#getOptionsForOptions
         */
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "format": {
                        "type": "text"
                    },
                    "capitalize": {
                        "type": "checkbox"
                    },
                    "includeStates": {
                        "type": "checkbox"
                    },
                    "includeTerritories": {
                        "type": "checkbox"
                    }
                }
            });
        }

        /* end_builder_helpers */
    });

    Alpaca.registerFieldClass("state", Alpaca.Fields.StateField);
    Alpaca.registerDefaultFormatFieldMapping("state", "state");

    /**
     * Helper function to retrieve the holdings of US states and territories.
     *
     * @param {Boolean} includeStates whether to include US states
     * @param {Boolean} includeTerritories whether to include US territories
     * @param {Boolean} codeValue whether to hand back US holding codes (instead of names)
     * @param {Boolean} capitalize whether to capitalize the values handed back
     *
     * @returns {Object} an object containing "keys" and "values", both of which are arrays.
     */
    Alpaca.retrieveUSHoldings = (function()
    {
        return function(includeStates, includeTerritories, codeValue, capitalize) {
            var res  = {
                keys:   [],
                values: []
            };
            var opts = $.extend(
                {},
                includeStates      ? Alpaca.usHoldings.states      : {},
                includeTerritories ? Alpaca.usHoldings.territories : {}
            );
            var sorted = Object.keys(opts);
            sorted.sort();
            for (var i in sorted) {
                var state = sorted[i];
                var key   = opts[state];
                var value = codeValue ? key : state;
                if (capitalize) {
                    value = value.toUpperCase();
                }
                res.keys.push(key);
                res.values.push(value);
            }
            return res;
        };
    })();

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.SummernoteField = Alpaca.Fields.TextAreaField.extend(
    /**
     * @lends Alpaca.Fields.SummernoteField.prototype
     */
    {
        /**
         * @see Alpaca.Fields.TextAreaField#getFieldType
         */
        getFieldType: function() {
            return "summernote";
        },

        /**
         * @see Alpaca.Fields.TextAreaField#setup
         */
        setup: function()
        {
            if (!this.data)
            {
                this.data = "";
            }

            this.base();

            if (typeof(this.options.summernote) == "undefined")
            {
                this.options.summernote = {
                    height: null,
                    minHeight: null,
                    maxHeight: null,
                    focus: true
                };
            }
        },

        afterRenderControl: function(model, callback)
        {
            var self = this;

            this.base(model, function() {

                // see if we can render Summernote Editor
                if (!self.isDisplayOnly() && self.control && $.fn.summernote)
                {
                    // wait for Alpaca to declare the DOM swapped and ready before we attempt to do anything with CKEditor
                    self.on("ready", function() {
                        $(self.control).summernote(self.options.summernote);
                    });
                }

                // if summernote's dom element gets destroyed, make sure we clean up the editor instance
                $(self.control).bind('destroyed', function() {
                    try { $(self.control).summernote('destroy'); } catch (e) { }
                });

                callback();
            });
        }

        /* builder_helpers */

        /**
         * @see Alpaca.Fields.TextAreaField#getTitle
         */
        ,
        getTitle: function() {
            return "Summernote Editor";
        },

        /**
         * @see Alpaca.Fields.TextAreaField#getDescription
         */
        getDescription: function() {
            return "Provides an instance of a Summernote Editor control for use in editing HTML.";
        },

        /**
         * @private
         * @see Alpaca.ControlField#getSchemaOfOptions
         */
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "summernote": {
                        "title": "Summernote Editor options",
                        "description": "Use this entry to provide configuration options to the underlying Summernote plugin.",
                        "type": "any"
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.ControlField#getOptionsForOptions
         */
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "summernote": {
                        "type": "any"
                    }
                }
            });
        }

        /* end_builder_helpers */
    });

    Alpaca.registerFieldClass("summernote", Alpaca.Fields.SummernoteField);

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    /**
     * The table field is used for data representations that consist of an array with objects inside of it.  The objects
     * must have a uniform structure.  The table field renders a standard HTML table using the table.  The individual
     * columns are either editable (in edit mode) or simply displayed in read-only mode.
     */
    Alpaca.Fields.TableField = Alpaca.Fields.ArrayField.extend(
    /**
     * @lends Alpaca.Fields.TableField.prototype
     */
    {
        setup: function()
        {
            var self = this;

            if (!self.options)
            {
                self.options = {};
            }

            if (typeof(self.options.animate) === "undefined")
            {
                self.options.animate = false;
            }

            // assume toolbar sticky if not otherwise specified
            if (typeof(this.options.toolbarSticky) === "undefined")
            {
                this.options.toolbarSticky = true;
            }

            this.base();

            if (!this.options.items.type)
            {
                this.options.items.type = "tablerow";
            }

            // support for either "datatable" or "datatables"
            if (this.options["datatable"]) {
                this.options.datatables = this.options["datatable"];
                delete this.options["datatable"];
            }

            // assume empty options for datatables
            if (typeof(this.options.datatables) === "undefined")
            {
                this.options.datatables = {
                    "paging": false,
                    "lengthChange": false,
                    "info": false,
                    "searching": false,
                    "ordering": true
                };

                // draggable reorder of rows
                if (typeof(this.options.dragRows) == "undefined")
                {
                    this.options.dragRows = false;
                }

                if (this.options.readonly)
                {
                    this.options.dragRows = false;
                }

                if (this.isDisplayOnly())
                {
                    this.options.dragRows = false;
                }
            }

            // assume actions column to be shown
            if (typeof(this.options.showActionsColumn) === "undefined")
            {
                this.options.showActionsColumn = true;

                if (this.options.readonly)
                {
                    this.options.showActionsColumn = false;
                }

                if (this.isDisplayOnly())
                {
                    this.options.showActionsColumn = false;
                }
            }

            // data tables columns
            this.options.datatables.columns = [];

            // initialize data tables to detect alpaca field types and perform alpaca field sorting and filtering
            if ($.fn.dataTableExt && !$.fn.DataTable.ext.type.search["alpaca"])
            {
                $.fn.DataTable.ext.order["alpaca"] = function (settings, col) {

                    // ensure that data property has latest value
                    self.data = self.getValue();

                    var propertyName = null;

                    // find the property by index
                    var c = 0;
                    for (var k in self.schema.items.properties) {
                        if (c === col) {
                            propertyName = k;
                            break;
                        }
                        c++;
                    }

                    // collect values
                    var values = [];
                    if (self.data)
                    {
                        for (var i = 0; i < self.data.length; i++)
                        {
                            values.push(self.data[i][propertyName]);
                        }
                    }

                    // sort values
                    values.sort();

                    return values;
                };

                // this is a kind of hacky function at the moment, trying to do filtering that takes into account
                // alpaca field values
                //
                // according to data tables authors, need to wait for next release for refactoring of filtering
                // logic in data tables to really take control of this and do it right
                // this "sort of" works for now
                //
                $.fn.dataTableExt.afnFiltering.push(function(settings, fields, fieldIndex, data, dataIndex) {

                    // TODO
                    var text = $(settings.nTableWrapper).find(".dataTables_filter input[type='search']").val();

                    if (!text) {
                        return true;
                    }

                    text = "" + text;

                    text = $.trim(text);
                    text = text.toLowerCase();

                    var match = false;

                    for (var i = 0; i < data.length; i++)
                    {
                        var dataValue = data[i];
                        if (dataValue)
                        {
                            var z = dataValue.indexOf("data-alpaca-field-id=");
                            if (z > -1)
                            {
                                var alpacaId = $(dataValue).attr("data-alpaca-field-id");

                                var alpacaValue = Alpaca.fieldInstances[alpacaId].getValue();
                                if (alpacaValue)
                                {
                                    alpacaValue = "" + alpacaValue;
                                    alpacaValue = alpacaValue.toLowerCase();

                                    if (alpacaValue.indexOf(text) > -1)
                                    {
                                        match = true;
                                        break;
                                    }
                                }
                            }
                        }
                    }

                    return match;
                });
            }
        },

        /**
         * @see Alpaca.ControlField#getFieldType
         */
        getFieldType: function() {
            return "table";
        },

        prepareContainerModel: function(callback)
        {
            var self = this;

            self.base(function(model) {

                // build a separate "items" array that we'll use to build out the table header
                model.headers = [];
                if (self.schema.items && self.schema.items.properties)
                {
                    for (var k in self.schema.items.properties)
                    {
                        var header = {};
                        header.id = k;
                        header.title = self.schema.items.properties[k].title;
                        header.hidden = false;
                        if (self.options.items && self.options.items.fields && self.options.items.fields[k])
                        {
                            if (self.options.items.fields[k].label)
                            {
                                header.title = self.options.items.fields[k].label;
                            }

                            if (self.options.items.fields[k].type === "hidden")
                            {
                                header.hidden = true;
                            }
                        }

                        model.headers.push(header);
                    }
                }

                callback(model);
            });
        },

        getTableEl: function()
        {
            var self = this;

            return $($(self.container).find("table")[0]);
        },

        /**
         * The table field uses the "array" container convention to render the DOM.  As such, nested objects are wrapped
         * in "field" elements that result in slightly incorrect table structures.  Part of the reason for this is that
         * browsers are very fussy when it comes to injection of nested TR or TD partials.  Here, we generate most
         * things as DIVs and then do some cleanup in this method to make sure that the table is put togehter in the
         * right way.
         *
         * @param model
         * @param callback
         */
        afterRenderContainer: function(model, callback)
        {
            var self = this;

            this.base(model, function() {

                self.cleanupDomInjections();

                // apply styles of underlying "table"
                var table = self.getTableEl();
                self.applyStyle("table", table);

                // if the DataTables plugin is available, use it
                if (self.options.datatables)
                {
                    if ($.fn.DataTable)
                    {
                        if (self.options.datatables.columns.length === 0)
                        {
                            // if we're setting up for dragging rows, then add that column
                            if (self.options.dragRows)
                            {
                                self.options.datatables.columns.push({
                                    "orderable": false,
                                    "name": "dragRowsIndex",
                                    "hidden": true
                                });

                                self.options.datatables.columns.push({
                                    "orderable": false,
                                    "name": "dragRowsDraggable"
                                });
                            }

                            // mix in fields from the items
                            for (var k in self.schema.items.properties)
                            {
                                var colConfig = {
                                    "orderable": true,
                                    "orderDataType": "alpaca"
                                };

                                self.options.datatables.columns.push(colConfig);
                            }

                            // if we have an actions column enabled, then turn off sorting for the actions column (assumed to be last)
                            if (self.options.showActionsColumn)
                            {
                                self.options.datatables.columns.push({
                                    "orderable": false,
                                    "name": "actions"
                                });
                            }
                        }

                        if (self.options.dragRows)
                        {
                            self.options.datatables["rowReorder"] = {
                                "selector": "tr td.alpaca-table-reorder-draggable-cell",
                                "dataSrc": 0,
                                "snapX": true,
                                "update": true
                            };
                        }

                        // EVENT HANDLERS

                        // listen for the "ready" event and when it fires, init data tables
                        // this ensures that the DOM and anything wrapping our table field instance is ready to rock
                        // before we proceed
                        self.off("ready");
                        self.on("ready", function() {

                            // tear down old data tables data if it is still around
                            if (self._dt) {
                                self._dt.destroy();
                                self._dt = undefined;
                            }

                            // table dom element
                            var table = self.getTableEl();

                            // data table reference
                            self._dt = $(table).DataTable(self.options.datatables);

                            // listen for the "row-reorder" event
                            self._dt.on("row-reorder", function(e, diff, edit) {

                                if (self._dt._disableAlpacaHandlers) {
                                    return;
                                }

                                // update our data structure to reflect the shift in positions
                                if (diff.length > 0)
                                {
                                    if (diff[0].oldPosition !== diff[0].newPosition)
                                    {
                                        self._dt._disableAlpacaHandlers = true;
                                        self.moveItem(diff[0].oldPosition, diff[0].newPosition, false, function() {
                                            // all done
                                        });
                                    }
                                }
                            });

                            // listen for the underlying table DOM element being destroyed
                            // when that happens, tear down the datatables implementation as well
                            $(self.container).bind('destroyed', function() {
                                if (self._dt) {
                                    self._dt.destroy();
                                    self._dt = undefined;
                                }
                            });

                            // listen for the sorting event
                            // change the order of children and refresh
                            self._dt.on('order', function ( e, ctx, sorting, columns ) {

                                if (self._dt._disableAlpacaHandlers) {
                                    return;
                                }

                                // if we don't have an original copy of the children, make one
                                // we're about to re-order the children and datatable assumes we know the original order
                                if (!self._dt._originalChildren) {
                                    self._dt._originalChildren = [];
                                    for (var k = 0; k < self.children.length; k++) {
                                        self._dt._originalChildren.push(self.children[k]);
                                    }
                                }

                                // re-order based on the order that datatables believes is right
                                var newChildren = [];
                                for (var z = 0; z < ctx.aiDisplay.length; z++)
                                {
                                    var index = ctx.aiDisplay[z];
                                    newChildren.push(self._dt._originalChildren[index]);
                                }
                                self.children = newChildren;

                                self._dt._disableAlpacaHandlers = false;
                            });

                        });
                    }
                }

                // walk through headers and allow for callback-based config
                $(table).children("thead > tr > th[data-header-id]").each(function() {

                    var key = $(this).attr("data-header-id");

                    var schema = self.schema.items.properties[key];
                    var options = null;
                    if (self.options.items.fields && self.options.items.fields[key]) {
                        options = self.options.items.fields[key];
                    }

                    // CALLBACK: "tableHeaderRequired" or "tableHeaderOptional"
                    if (schema.required || (options && options.required))
                    {
                        // CALLBACK: "tableHeaderRequired"
                        self.fireCallback("tableHeaderRequired", schema, options, this);
                    }
                    else
                    {
                        // CALLBACK: "tableHeaderOptional"
                        self.fireCallback("tableHeaderOptional", schema, options, this);
                    }

                });

                callback();

            });//.bind(self));
        },

        cleanupDomInjections: function()
        {
            var self = this;

            /**
             * Takes a DOM element and merges it "up" to the parent element.  Data attributes and some classes are
             * copied from DOM element into the parent element.  The children of the DOM element are added to the
             * parent and the DOM element is removed.
             *
             * @param mergeElement
             */
            var mergeElementUp = function(mergeElement)
            {
                var mergeElementParent = $(mergeElement).parent();
                var mergeElementChildren = $(mergeElement).children();

                // copy merge element classes to parent
                var classNames = $(mergeElement).attr('class').split(/\s+/);
                $.each( classNames, function(index, className){
                    if (className === "alpaca-merge-up") {
                        // skip
                    } else {
                        $(mergeElementParent).addClass(className);
                    }
                });

                // copy attributes to TR
                $.each($(mergeElement)[0].attributes, function() {
                    if (this.name && this.name.indexOf("data-") === 0)
                    {
                        $(mergeElementParent).attr(this.name, this.value);
                    }
                });

                // replace field with children
                if (mergeElementChildren.length > 0)
                {
                    $(mergeElement).replaceWith(mergeElementChildren);
                }
                else
                {
                    $(mergeElement).remove();
                }
            };

            var trElements = self.getTableEl().children("tbody").children("tr");

            // find each TR's .alpaca-field and merge up
            $(trElements).children(".alpaca-field").each(function() {
                mergeElementUp(this);
            });

            // find each TR's .alpaca-container and merge up
            $(trElements).children(".alpaca-container").each(function() {
                mergeElementUp(this);
            });

            // find any action bars for our field and slip a TD around them
            var alpacaArrayActionbar = self.getFieldEl().find("." + Alpaca.MARKER_CLASS_ARRAY_ITEM_ACTIONBAR + "[" + Alpaca.MARKER_DATA_ARRAY_ITEM_FIELD_ID + "='" + self.getId() + "']");
            if (alpacaArrayActionbar.length > 0)
            {
                alpacaArrayActionbar.each(function() {
                    var td = $("<td class='actionbar' nowrap='nowrap'></td>");
                    $(this).before(td);
                    $(td).append(this);
                });
            }

            // find any alpaca-table-reorder-draggable-cells and slip a TD around them
            var alpacaTableReorderDraggableCells = self.getTableEl().children("tbody").children("tr").children("td.alpaca-table-reorder-draggable-cell");
            if (alpacaTableReorderDraggableCells.length > 0)
            {
                alpacaTableReorderDraggableCells.each(function() {
                    var td = $("<td class='alpaca-table-reorder-draggable-cell'></td>");
                    $(this).before(td);
                    $(td).append($(this).children());
                    $(this).remove();
                });
            }

            // find any alpaca-table-reorder-draggable-cell elements and slip a TD around them
            //var alpacaTableReorderIndexCells = self.getTableEl().children("tbody").children("tr").children("td.alpaca-table-reorder-draggable-cell");

            // find any alpaca-table-reorder-index-cell elements and slip a TD around them
            var alpacaTableReorderIndexCells = self.getTableEl().children("tbody").children("tr").children("td.alpaca-table-reorder-index-cell");
            if (alpacaTableReorderIndexCells.length > 0)
            {
                alpacaTableReorderIndexCells.each(function(i) {
                    var td = $("<td class='alpaca-table-reorder-index-cell'>" + i + "</td>");
                    $(this).before(td);
                    $(this).remove();
                });
            }

            /*
            // find anything else with .alpaca-merge-up and merge up
            this.getFieldEl().find(".alpaca-merge-up[data-merge-up-field-id='" + self.getId() + "']").each(function() {
                mergeElementUp(this);
            });
            */

            // find anything else with .alpaca-merge-up and merge up
            $(trElements).each(function() {
                var trAlpacaId = $(this).attr("data-alpaca-field-id");

                // inject the TD to wrap
                $(this).find(".alpaca-merge-up[data-merge-up-field-id='" + trAlpacaId + "'][data-alpaca-merge-tag='td']").each(function() {

                    var td = $("<td></td>");
                    $(this).before(td);
                    $(td).append(this);

                    mergeElementUp(this);

                    $(td).attr("data-alpaca-merge-tag", null);
                    $(td).attr("data-merge-up-field-id", null);
                });

            });
        },

        doResolveItemContainer: function()
        {
            var self = this;

            return self.getTableEl().children("tbody");
        },

        doAfterAddItem: function(item, callback)
        {
            var self = this;

            self.data = self.getValue();

            self.cleanupDomInjections();

            // if we're using dragRows support, we have no choice here except to completely reboot the table in order
            // to get DataTables to bind things correctly for drag-drop support
            // TODO: change dragRows to use our own drag/drop tooling and get rid of DataTables Row Reorder Plugin
            // we also have do this if we've added the first row to get DataTables to redraw
            var usingDataTables = self.options.datatables && $.fn.DataTable;
            if (self.options.dragRows || (usingDataTables && self.data.length === 1))
            {
                // refresh
                self.refresh(function() {
                    callback();
                });
            }
            else
            {
                // inform data tables that we've added a row
                // we do this by finding the TR and then adding that way
                if (self._dt)
                {
                    // TODO
                    var tr = self.field.find("[data-alpaca-field-path='" + item.path + "']");
                    self._dt.row.add(tr);//.draw(false);
                }

                callback();
            }
        },

        doAfterRemoveItem: function(childIndex, callback)
        {
            var self = this;

            self.data = self.getValue();

            self.cleanupDomInjections();

            // TODO: see above

            var usingDataTables = self.options.datatables && $.fn.DataTable;
            if (self.options.dragRows || (usingDataTables && self.data.length === 0))
            {
                // refresh
                self.refresh(function () {
                    callback();
                });
            }
            else
            {
                // inform data tables that we've removed a row
                if (self._dt)
                {
                    self._dt.rows(childIndex).remove();//.draw(false);
                }

                callback();
            }
        },

        /**
         * @see Alpaca.ControlField#getType
         */
        getType: function() {
            return "array";
        }


        /* builder_helpers */
        ,

        /**
         * @see Alpaca.ControlField#getTitle
         */
        getTitle: function() {
            return "Table Field";
        },

        /**
         * @see Alpaca.ControlField#getDescription
         */
        getDescription: function() {
            return "Renders array items into a table";
        },

        /**
         * @private
         * @see Alpaca.Fields.TextField#getSchemaOfOptions
         */
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "datatables": {
                        "title": "DataTables Configuration",
                        "description": "Optional configuration to be passed to the underlying DataTables Plugin.",
                        "type": "object"
                    },
                    "showActionsColumn": {
                        "title": "Show Actions Column",
                        "default": true,
                        "description": "Whether to show or hide the actions column.",
                        "type": "boolean"
                    },
                    "dragRows": {
                        "title": "Drag Rows",
                        "default": false,
                        "description": "Whether to enable the dragging of rows via a draggable column.  This requires DataTables and the DataTables Row Reorder Plugin.",
                        "type": "boolean"
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.Fields.TextField#getOptionsForOptions
         */
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "datatables": {
                        "type": "object"
                    },
                    "showActionsColumn": {
                        "type": "checkbox"
                    },
                    "dragRows": {
                        "type": "checkbox"
                    }
                }
            });
        }

        /* end_builder_helpers */
    });

    Alpaca.registerFieldClass("table", Alpaca.Fields.TableField);

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.TableRowField = Alpaca.Fields.ObjectField.extend(
    /**
     * @lends Alpaca.Fields.TableRowField.prototype
     */
    {
        prepareContainerModel: function(callback)
        {
            var self = this;

            this.base(function(model) {

                model.options.showActionsColumn = self.parent.options.showActionsColumn;
                model.options.dragRows = self.parent.options.dragRows;

                // walk all items and mark hiddens so that the template can easily pick this up
                // hiddens are applied the "alpaca-table-column-hidden" css class so that they can be hidden
                for (var i = 0; i < model.items.length; i++)
                {
                    if (model.items[i].options.type === "hidden")
                    {
                        model.items[i].hidden = true;
                    }
                }

                callback(model);
            });
        },

        /**
         * @see Alpaca.ControlField#getFieldType
         */
        getFieldType: function() {
            return "tablerow";
        },

        /**
         * @see Alpaca.ControlField#getType
         */
        getType: function() {
            return "object";
        }

        /* builder_helpers */
        ,

        /**
         * @see Alpaca.ControlField#getTitle
         */
        getTitle: function() {
            return "Table Row Field";
        },

        /**
         * @see Alpaca.ControlField#getDescription
         */
        getDescription: function() {
            return "Renders object items into a table row";
        }

        /* end_builder_helpers */
    });

    Alpaca.registerFieldClass("tablerow", Alpaca.Fields.TableRowField);

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.TagField = Alpaca.Fields.LowerCaseField.extend(
    /**
     * @lends Alpaca.Fields.TagField.prototype
     */
    {
        /**
         * @see Alpaca.Fields.TextField#getFieldType
         */
        getFieldType: function() {
            return "tag";
        },

        /**
         * @see Alpaca.Fields.TextField#setup
         */
        setup: function()
        {
            this.base();

            if (!this.options.separator)
            {
                this.options.separator = ",";
            }
        },

        /**
         * @see Alpaca.Fields.TextField#getValue
         */
        getControlValue: function()
        {
            var val = this.base();

            if (val === "") {
                return [];
            }

            return val.split(this.options.separator);
        },

        /**
         * @see Alpaca.Fields.TextField#setValue
         */
        setValue: function(val)
        {
            if (val === "")
            {
                return;
            }

            if (!val)
            {
                return this.base("");
            }

            this.base(val.join(this.options.separator));
        },

        /**
         * @see Alpaca.Field#onBlur
         */
        onBlur: function(e)
        {
            this.base(e);

            var vals = this.getValue();

            var trimmed = [];

            $.each(vals, function(i, v) {

                if (v.trim() !== "")
                {
                    trimmed.push(v.trim());
                }
            });

            this.setValue(trimmed);
        }



        /* builder_helpers */
        ,

        /**
         * @see Alpaca.Fields.TextField#getTitle
         */
        getTitle: function() {
            return "Tag Field";
        },

        /**
         * @see Alpaca.Fields.TextField#getDescription
         */
        getDescription: function() {
            return "Text field for entering list of tags separated by delimiter.";
        },

        /**
         * @private
         * @see Alpaca.Fields.TextField#getSchemaOfOptions
         */
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "separator": {
                        "title": "Separator",
                        "description": "Separator used to split tags.",
                        "type": "string",
                        "default":","
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.Fields.TextField#getOptionsForOptions
         */
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "separator": {
                        "type": "text"
                    }
                }
            });
        }

        /* end_builder_helpers */
    });

    Alpaca.registerFieldClass("tag", Alpaca.Fields.TagField);

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.TimeField = Alpaca.Fields.DateField.extend(
    /**
     * @lends Alpaca.Fields.TimeField.prototype
     */
    {
        /**
         * @see Alpaca.Fields.TextField#getFieldType
         */
        getFieldType: function() {
            return "time";
        },

        getDefaultFormat: function() {
            return Alpaca.defaultTimeFormat;
        },

        /**
         * @see Alpaca.Fields.TextField#setup
         */
        setup: function()
        {
            var self = this;

            // default html5 input type = "time";
            //this.inputType = "time";

            this.base();
        }

        /* builder_helpers */
        ,

        /**
         * @see Alpaca.Fields.TextField#getTitle
         */
        getTitle: function() {
            return "Time Field";
        },

        /**
         * @see Alpaca.Fields.TextField#getDescription
         */
        getDescription: function() {
            return "Time Field";
        }

        /* end_builder_helpers */
    });

    Alpaca.registerMessages({
        "invalidTime": "Invalid time"
    });
    Alpaca.registerFieldClass("time", Alpaca.Fields.TimeField);
    Alpaca.registerDefaultFormatFieldMapping("time", "time");

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.TinyMCEField = Alpaca.Fields.TextAreaField.extend(
        /**
         * @lends Alpaca.Fields.tinyMCEField.prototype
         */
        {
            /**
             * @see Alpaca.Fields.TextAreaField#getFieldType
             */
            getFieldType: function() {
                return "tinymce";
            },

            /**
             * @see Alpaca.Fields.TextAreaField#setup
             */
            setup: function()
            {
                var self = this;

                if (!this.data)
                {
                    this.data = "";
                }

                if (!self.options.toolbar)
                {
                    self.options.toolbar = "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image";
                }

                this.base();
            },

            setValue: function(value)
            {
                var self = this;

                // be sure to call into base method
                this.base(value);

                if (self.editor)
                {
                    self.editor.setContent(value);
                }
            },

            /**
             * @see Alpaca.Fields.ControlField#getControlValue
             */
            getControlValue:function()
            {
                var self = this;

                var value = null;

                if (self.editor)
                {
                    value = self.editor.getContent()
                }

                return value;
            },

            initTinyMCEEvents: function()
            {
                var self = this;

                if (self.editor) {

                    // click event
                    self.editor.on("click", function (e) {
                        self.onClick.call(self, e);
                        self.trigger("click", e);
                    });

                    // change event
                    self.editor.on("change", function (e) {
                        self.onChange();
                        self.triggerWithPropagation("change", e);
                    });

                    // blur event
                    self.editor.on('blur', function (e) {
                        self.onBlur();
                        self.trigger("blur", e);
                    });

                    // focus event
                    self.editor.on("focus", function (e) {
                        self.onFocus.call(self, e);
                        self.trigger("focus", e);
                    });

                    // keypress event
                    self.editor.on("keypress", function (e) {
                        self.onKeyPress.call(self, e);
                        self.trigger("keypress", e);
                    });

                    // keyup event
                    self.editor.on("keyup", function (e) {
                        self.onKeyUp.call(self, e);
                        self.trigger("keyup", e);
                    });

                    // keydown event
                    self.editor.on("keydown", function (e) {
                        self.onKeyDown.call(self, e);
                        self.trigger("keydown", e);
                    });
                }
            },

            afterRenderControl: function(model, callback)
            {
                var self = this;

                this.base(model, function() {

                    if (!self.isDisplayOnly() && self.control && typeof(tinyMCE) !== "undefined")
                    {
                        // wait for Alpaca to declare the DOM swapped and ready before we attempt to do anything with CKEditor
                        self.on("ready", function() {

                            if (!self.editor)
                            {
                                var rteFieldID = $(self.control)[0].id;

                                tinyMCE.init({
                                    init_instance_callback: function(editor) {
                                        self.editor = editor;

                                        self.initTinyMCEEvents();
                                    },
                                    selector: "#" + rteFieldID,
                                    toolbar: self.options.toolbar
                                });

                            }
                        });
                    }

                    callback();
                });
            },

            /**
             * @see Alpaca.Field#destroy
             */
            destroy: function()
            {
                var self = this;

                // destroy the plugin instance
                if (self.editor)
                {
                    self.editor.remove();
                    self.editor = null;
                }

                // call up to base method
                this.base();
            },


            /* builder_helpers */

            /**
             * @see Alpaca.Fields.TextAreaField#getTitle
             */
            getTitle: function() {
                return "TinyMCE Editor";
            },

            /**
             * @see Alpaca.Fields.TextAreaField#getDescription
             */
            getDescription: function() {
                return "Provides an instance of a TinyMCE control for use in editing HTML.";
            },

            /**
             * @private
             * @see Alpaca.ControlField#getSchemaOfOptions
             */
            getSchemaOfOptions: function() {
                return Alpaca.merge(this.base(), {
                    "properties": {
                        "toolbar": {
                            "title": "TinyMCE toolbar options",
                            "description": "Toolbar options for TinyMCE plugin.",
                            "type": "string"
                        }
                    }
                });
            },

            /**
             * @private
             * @see Alpaca.ControlField#getOptionsForOptions
             */
            getOptionsForOptions: function() {
                return Alpaca.merge(this.base(), {
                    "fields": {
                        "toolbar": {
                            "type": "text"
                        }
                    }
                });
            }

            /* end_builder_helpers */
        });

    Alpaca.registerFieldClass("tinymce", Alpaca.Fields.TinyMCEField);

})(jQuery);
(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.TokenField = Alpaca.Fields.TextField.extend(
    /**
     * @lends Alpaca.Fields.TokenField.prototype
     */
    {
        /**
         * @override
         */
        getFieldType: function() {
            return "token";
        },

        /**
         * @override
         */
        setup: function()
        {
            this.base();

            if (!this.options.separator)
            {
                this.options.separator = ",";
            }

            if (typeof(this.options.tokenfield) == "undefined")
            {
                this.options.tokenfield = {};
            }

            if (typeof(this.options.tokenfield.showAutocompleteOnFocus) === "undefined")
            {
                this.options.tokenfield.showAutocompleteOnFocus = true;
            }
        },

        /**
         * @override
         */
        getControlValue: function()
        {
            return this.base();
        },

        /**
         * @override
         */
        setValue: function(val)
        {
            this.base(val);
        },

        /**
         * @override
         */
        onBlur: function(e)
        {
            this.base(e);
        },

        afterRenderControl: function(model, callback)
        {
            var self = this;

            this.base(model, function() {

                // see if we can render CK Editor
                if (!self.isDisplayOnly() && self.control && typeof($.fn.tokenfield) !== "undefined")
                {
                    // wait for Alpaca to declare the DOM swapped and ready before we attempt to do anything
                    self.on("ready", function(self, tokenfield) {
                        $(self.control).tokenfield(tokenfield);
                    }(self, self.options.tokenfield));
                }

                callback();
            });
        }



        /* builder_helpers */
        ,

        /**
         * @override
         */
        getTitle: function() {
            return "Token Field";
        },

        /**
         * @override
         */
        getDescription: function() {
            return "Token field for entering list of tokens separated by delimiter.";
        },

        /**
         * @override
         */
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "separator": {
                        "title": "Separator",
                        "description": "Separator used to split tokens.",
                        "type": "string",
                        "default":","
                    },
                    "tokenfield": {
                        "title": "Token Field options",
                        "description": "Settings to pass into the underlying bootstrap-tokenfield control",
                        "type": "object",
                        "default": undefined
                    }
                }
            });
        },

        /**
         * @override
         */
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "separator": {
                        "type": "text"
                    }
                }
            });
        }

        /* end_builder_helpers */
    });

    Alpaca.registerFieldClass("token", Alpaca.Fields.TokenField);

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.UploadField = Alpaca.ControlField.extend(
    /**
     * @lends Alpaca.Fields.UploadField.prototype
     */
    {
        /**
         * @constructs
         * @augments Alpaca.Fields.ControlField
         *
         * @class File upload control that can be mounted on top of "object" or "array" types.
         *
         * @param {Object} container Field container.
         * @param {Any} data Field data.
         * @param {Object} options Field options.
         * @param {Object} schema Field schema.
         * @param {Object|String} view Field view.
         * @param {Alpaca.Connector} connector Field connector.
         */
        constructor: function(container, data, options, schema, view, connector)
        {
            var self = this;

            this.base(container, data, options, schema, view, connector);

            this.isArrayType = function() {
                return self.schema.type === "array";
            };

            this.isObjectType = function() {
                return self.schema.type === "object";
            };

            // wraps an existing template descriptor into a method that looks like fn(model)
            // this is compatible with the requirements of fileinput
            // config looks like
            //    {
            //       "files": [],
            //       "formatFileSize": fn,
            //       "options": {}
            //    }
            //

            this.wrapTemplate = function(templateId)
            {
                return function(config) {

                    var files = config.files;
                    var formatFileSize = config.formatFileSize;
                    var options = config.options;

                    var rows = [];
                    for (var i = 0; i < files.length; i++)
                    {
                        var model = {};
                        model.options = self.options;
                        model.file = Alpaca.cloneObject(files[i]);
                        model.size = formatFileSize(model.size);
                        model.buttons = self.options.buttons;
                        model.view = self.view;
                        model.fileIndex = i;

                        var row = Alpaca.tmpl(self.view.getTemplateDescriptor(templateId), model, self);

                        rows.push(row[0]);
                    }

                    rows = $(rows);
                    $(rows).each(function() {

                        if (options.fileupload && options.fileupload.autoUpload)
                        {
                            // disable start button
                            $(this).find("button.start").css("display", "none");
                        }

                        self.handleWrapRow(this, options);

                        // this event gets fired when fileimpl has cleaned up the DOM element
                        // we handle Ajax related stuff on our own here
                        //$(this).find("button.delete").on("destroyed", function() {
                        $(this).find("button.delete").on("click", function() {

                            var button = $(row).find("button.delete");

                            var fileIndex = $(button).attr("data-file-index");
                            var file = files[fileIndex];

                            self.onFileDelete.call(self, row, button, file);

                            // remove from files
                            if (self.isArrayType())
                            {
                                var array = self.getValueAsArray();
                                array.splice(fileIndex, 1);
                                self.setValueAsArray(array);
                            }
                            else if (self.isObjectType())
                            {
                                self.setValueAsArray([]);
                            }

                            self.triggerWithPropagation("change");
                            setTimeout(function() {
                                self.refreshUIState();
                            }, 200);
                        });
                    });

                    return $(rows);
                };
            };
        },

        /**
         * @see Alpaca.ControlField#getFieldType
         */
        getFieldType: function() {
            return "upload";
        },

        /**
         * @see Alpaca.Fields.TextField#setup
         */
        setup: function()
        {
            var self = this;

            this.base();

            // disable bottom control buttons (we have a conflict over the 'buttons' namespace)
            self.options.renderButtons = false;

            if (!self.options.buttons)
            {
                self.options.buttons = [];
            }

            if (!self.options.hideDeleteButton)
            {
                self.options.buttons.push({
                    "key": "delete",
                    "isDelete": true
                });
            }

            if (typeof(self.options.showUploadPreview) === "undefined")
            {
                self.options.showUploadPreview = true;
            }

            if (typeof(self.options.showHeaders) === "undefined")
            {
                self.options.showHeaders = true;
            }

            if (!self.data)
            {
                self.data = [];
            }

            // convert to array if not array already
            if (self.data && Alpaca.isObject(self.data)) {
                self.data = [self.data];
            }

            // upload
            if (!self.options.upload)
            {
                self.options.upload = {};
            }

            // support copying back the maxNumberOfFiles from the upload plugin's settings
            if (typeof(self.options.maxNumberOfFiles) === "undefined")
            {
                if (typeof(self.options.upload.maxNumberOfFiles) !== "undefined")
                {
                    self.options.maxNumberOfFiles = self.options.upload.maxNumberOfFiles;
                }
            }

            // figure out reasonable maxNumberOfFiles
            if (typeof(self.options.maxNumberOfFiles) === "undefined")
            {
                self.options.maxNumberOfFiles = 1;
                if (self.isArrayType())
                {
                    self.options.maxNumberOfFiles = -1;
                }
            }

            // safe guard
            if (self.isObjectType()) {
                self.options.maxNumberOfFiles = 1;
            }

            if (self.options.multiple === false)
            {
                self.options.maxNumberOfFiles = 1;
            }

            if (self.options.maxNumberOfFiles > 1 || self.options.maxNumberOfFiles === -1)
            {
                self.options.multiple = true;
            }

            // copy setting into upload plugin config
            self.options.upload.maxNumberOfFiles = 9999;
            if (self.options.maxNumberOfFiles > 0)
            {
                self.options.upload.maxNumberOfFiles = self.options.maxNumberOfFiles;
            }

            // max file size
            if (typeof(self.options.maxFileSize) === "undefined")
            {
                if (self.options.upload.maxFileSize)
                {
                    self.options.maxFileSize = self.options.upload.maxFileSize;
                }
                else
                {
                    self.options.maxFileSize = -1; // no limit
                }

                // copy setting into upload
                if (self.options.maxFileSize)
                {
                    self.options.upload.maxFileSize = self.options.maxFileSize;
                }
            }

            // file types
            if (typeof(self.options.fileTypes) === "undefined")
            {
                if (self.options.upload.acceptFileTypes)
                {
                    self.options.fileTypes = self.options.upload.acceptFileTypes;
                }
                else
                {
                    self.options.fileTypes = null; // no restrictions
                }

                // copy setting into upload
                if (self.options.fileTypes)
                {
                    self.options.upload.acceptFileTypes = self.options.fileTypes;
                }
            }

            // error handler
            if (!self.options.errorHandler)
            {
                self.options.errorHandler = function(messages)
                {
                    alert(messages.join("\n"));
                };
            }

            // if Alpaca is configured for CSRF support and a CSRF cookie or token is available,
            // then apply it to the headers that are sent over the wire via the underlying ajax
            // for the file upload control

            // if we have a CSRF token, apply it to the headers
            var csrfToken = self.determineCsrfToken();
            if (csrfToken)
            {
                if (!self.options.upload) {
                    self.options.upload = {};
                }

                if (!self.options.upload.headers) {
                    self.options.upload.headers = {};
                }

                self.options.upload.headers[Alpaca.CSRF_HEADER_NAME] = csrfToken;
            }
        },

        determineCsrfToken: function()
        {
            // is there a direct token specified?
            var csrfToken = Alpaca.CSRF_TOKEN;
            if (!csrfToken)
            {
                // is there a cookie that we can pull the value from?
                for (var t = 0; t < Alpaca.CSRF_COOKIE_NAMES.length; t++)
                {
                    var cookieName = Alpaca.CSRF_COOKIE_NAMES[t];

                    var cookieValue = Alpaca.readCookie(cookieName);
                    if (cookieValue)
                    {
                        csrfToken = cookieValue;
                        break;
                    }
                }
            }

            return csrfToken;
        },

        prepareControlModel: function(callback)
        {
            var self = this;

            self.base(function(model) {

                model.chooseButtonLabel = self.options.chooseButtonLabel;
                if (!model.chooseButtonLabel)
                {
                    model.chooseButtonLabel = self.getMessage("chooseFiles");
                    if (self.options.maxNumberOfFiles === 1)
                    {
                        model.chooseButtonLabel = self.getMessage("chooseFile");
                    }
                }

                model.dropZoneMessage = self.options.dropZoneMessage;
                if (!model.dropZoneMessage)
                {
                    model.dropZoneMessage = self.getMessage("dropZoneMultiple");
                    if (model.options.maxNumberOfFiles === 1)
                    {
                        model.dropZoneMessage = self.getMessage("dropZoneSingle");
                    }

                    if (model.options.directory)
                    {
                        model.dropZoneMessage = self.getMessage("dropZoneMultipleDirectory");
                    }
                }

                model.selectFromExistingMessage = self.options.selectFromExistingMessage;
                if (!model.selectFromExistingMessage)
                {
                    model.selectFromExistingMessage = self.getMessage("selectFromExistingMultiple");
                    if (model.options.maxNumberOfFiles === 1)
                    {
                        model.selectFromExistingMessage = self.getMessage("selectFromExistingSingle");
                    }
                }

                callback(model);
            });
        },

        afterRenderControl: function(model, callback)
        {
            var self = this;

            this.base(model, function() {

                self.handlePostRender(function() {

                    // if we're in display-only mode, we hide a bunch of things
                    if (self.isDisplayOnly())
                    {
                        $(self.control).find("button").hide();
                        $(self.control).find(".btn").hide();
                        $(self.control).find(".alpaca-fileupload-chooserow").hide();
                        $(self.control).find(".dropzone-message").hide();
                    }

                    callback();
                });

            });
        },

        /**
         * Gets the upload template.
         */
        getUploadTemplate: function() {
            return this.wrapTemplate("control-upload-partial-upload");
        },

        /**
         * Gets the download template.
         */
        getDownloadTemplate: function() {
            return this.wrapTemplate("control-upload-partial-download");
        },

        /**
         * Extension point for modifying the data ahead of an upload submit.
         *
         * @param data
         */
        handleBeforeFileUploadSubmit: function(data)
        {

        },

        handlePostRender: function(callback)
        {
            var self = this;

            var el = this.control;

            // file upload config
            var fileUploadConfig = {};

            // defaults
            fileUploadConfig["dataType"] = "json";
            fileUploadConfig["uploadTemplateId"] = null;
            fileUploadConfig["uploadTemplate"] = this.getUploadTemplate();
            fileUploadConfig["downloadTemplateId"] = null;
            fileUploadConfig["downloadTemplate"] = this.getDownloadTemplate();
            fileUploadConfig["filesContainer"] = $(el).find(".files");
            fileUploadConfig["dropZone"] = $(el).find(".fileupload-active-zone");
            fileUploadConfig["url"] = "/";
            fileUploadConfig["method"] = "post";
            fileUploadConfig["showUploadPreview"] = self.options.showUploadPreview;

            if (self.options.upload)
            {
                for (var k in self.options.upload)
                {
                    fileUploadConfig[k] = self.options.upload[k];
                }
            }

            if (self.options.multiple)
            {
                $(el).find(".alpaca-fileupload-input").attr("multiple", true);
            }

            if (self.options.directory)
            {
                $(el).find(".alpaca-fileupload-input").attr("directory", true);
                //$(el).find(".alpaca-fileupload-input").attr("webkitdirectory", true);
            }

            if (self.options.name)
            {
                $(el).find(".alpaca-fileupload-input").attr("name", self.options.name);
            }

            // hide the progress bar at first
            $(el).find(".progress").css("display", "none");

            /**
             * If a file is being uploaded, show the progress bar.  Otherwise, hide it.
             *
             * @param e
             * @param data
             */
            fileUploadConfig["progressall"] = function (e, data) {

                var showProgressBar = false;
                if (data.loaded < data.total)
                {
                    showProgressBar = true;
                }
                if (showProgressBar)
                {
                    $(el).find(".progress").css("display", "block");
                    var progress = parseInt(data.loaded / data.total * 100, 10);
                    $('#progress .progress-bar').css(
                        'width',
                        progress + '%'
                    );
                }
                else
                {
                    $(el).find(".progress").css("display", "none");
                }
            };

            // some limit checks
            fileUploadConfig["add"] = function(e, data) {

                var uploadErrors = [];

                var i = 0;
                do
                {
                    var bad = false;

                    if (i < data.files.length)
                    {
                        // file types
                        if (self.options.fileTypes)
                        {
                            var re = self.options.fileTypes;
                            if (typeof(self.options.fileTypes) === "string")
                            {
                                re = new RegExp(self.options.fileTypes);
                            }

                            if (!re.test(data.files[i]["type"]))
                            {
                                uploadErrors.push('Not an accepted file type: ' + data.files[i]["type"]);
                                bad = true;
                            }
                        }

                        // size
                        if (self.options.maxFileSize > -1)
                        {
                            if (data.files[i].size > self.options.maxFileSize) {
                                uploadErrors.push('Filesize is too big.  The maximum allowed file size is ' + self.options.maxFileSize + ' and the file being uploaded has size ' + data.files[i].size);
                                bad = true;
                            }
                        }

                        // general "before add" validation function
                        if (self.options.beforeAddValidator)
                        {
                            var errorMessage = self.options.beforeAddValidator(data.files[i]);
                            if (Alpaca.isString(errorMessage) || errorMessage === false)
                            {
                                if (!Alpaca.isString(errorMessage))
                                {
                                    errorMessage = 'Not an accepted file: ' + data.files[i].name;
                                }

                                uploadErrors.push(errorMessage);

                                bad = true;
                            }
                        }
                    }

                    if (bad)
                    {
                        i++;
                    }
                    else
                    {
                        i++;
                    }
                }
                while (i < data.files.length);

                if (uploadErrors.length > 0)
                {
                    self.options.errorHandler(uploadErrors);
                }
                else
                {
                    data.submit();
                }
            };

            // allow for extension
            self.applyConfiguration(fileUploadConfig);

            // instantiate the control
            var fileUpload = self.fileUpload = $(el).find('.alpaca-fileupload-input').fileupload(fileUploadConfig);

            // When file upload of a file completes, we offer the chance to adjust the data ahead of FileUpload
            // getting it.  This is useful for cases where you can't change the server side JSON but could do
            // a little bit of magic in the client.
            fileUpload.bindFirst("fileuploaddone", function(e, data) {

                var enhanceFiles = self.options.enhanceFiles;
                if (enhanceFiles)
                {
                    enhanceFiles(fileUploadConfig, data);
                }
                else
                {
                    self.enhanceFiles(fileUploadConfig, data);
                }

                // copy back down into data.files
                data.files = data.result.files;

                setTimeout(function() {
                    self.refreshValidationState(true);
                    self.refreshUIState();
                }, 250);

            });

            // When files are submitted, the "properties" and "parameters" options map are especially treated
            // and are written into property<index>__<key> and param<index>__key entries in the form data.
            // This allows for multi-part receivers to get values on a per-file basis.
            // Plans are to allow token substitution and other client-side treatment ahead of posting.
            fileUpload.bindFirst("fileuploadsubmit", function(e, data) {

                if (self.options["properties"])
                {
                    $.each(data.files, function(index, file) {

                        for (var key in self.options["properties"])
                        {
                            var propertyName = "property" + index + "__" + key;
                            var propertyValue = self.options["properties"][key];

                            // token substitutions
                            propertyValue = self.applyTokenSubstitutions(propertyValue, index, file);

                            if (!data.formData) {
                                data.formData = {};
                            }

                            data.formData[propertyName] = propertyValue;
                        }
                    });
                }

                if (self.options["parameters"])
                {
                    $.each(data.files, function(index, file) {

                        for (var key in self.options["parameters"])
                        {
                            var paramName = "param" + index + "__" + key;
                            var paramValue = self.options["parameters"][key];

                            // token substitutions
                            paramValue = self.applyTokenSubstitutions(paramValue, index, file);

                            if (!data.formData) {
                                data.formData = {};
                            }

                            data.formData[paramName] = paramValue;
                        }
                    });
                }

                self.handleBeforeFileUploadSubmit(data);

                if (self.options.beforeFileUploadSubmitHandler)
                {
                    self.options.beforeFileUploadSubmitHandler.call(self, data);
                }

            });

            /**
             * When files are uploaded, we adjust the value of the field.
             */
            fileUpload.bind("fileuploaddone", function(e, data) {

                // existing
                var array = self.getValueAsArray();

                var f = function(i)
                {
                    if (i === data.files.length) // jshint ignore:line
                    {
                        self.setValueAsArray(array);
                        return;
                    }

                    self.convertFileToDescriptor(data.files[i], function (err, descriptor) {

                        if (descriptor)
                        {
                            array.push(descriptor);
                        }

                        f(i + 1);
                    });

                };
                f(0);
            });

            /**
             * When file uploads fail, alert...
             */
            fileUpload.bind("fileuploadfail", function(e, data) {
                self.onUploadFail(data);
            });


            /**
             * Whether success or fail, we handle the results.
             */
            fileUpload.bind("fileuploadalways", function(e, data) {
                self.refreshUIState();
            });

            // allow for extension
            self.applyBindings(fileUpload, el);

            // allow for preloading of documents
            self.preload(fileUpload, el, function(files) {

                if (files && files.length > 0)
                {
                    var form = $(self.control).find('.alpaca-fileupload-input');
                    $(form).fileupload('option', 'done').call(form, $.Event('done'), {
                        result: {
                            files: files
                        }
                    });

                    self.afterPreload(fileUpload, el, files, function() {
                        callback();
                    });
                }
                else
                {
                    callback();
                }
            });

            if (typeof(document) !== "undefined")
            {
                $(document).bind('drop dragover', function (e) {
                    e.preventDefault();
                });
            }
        },

        handleWrapRow: function(row, options)
        {

        },

        applyTokenSubstitutions: function(text, index, file)
        {
            var tokens = {
                "index": index,
                "name": file.name,
                "size": file.size,
                "url": file.url,
                "thumbnailUrl": file.thumbnailUrl
            };

            // substitute any tokens
            var x = -1;
            var b = 0;
            do
            {
                x = text.indexOf("{", b);
                if (x > -1)
                {
                    var y = text.indexOf("}", x);
                    if (y > -1)
                    {
                        var token = text.substring(x + car.length, y);

                        var replacement = tokens[token];
                        if (replacement)
                        {
                            text = text.substring(0, x) + replacement + text.substring(y+1);
                        }

                        b = y + 1;
                    }
                }
            }
            while(x > -1);

            return text;
        },

        /**
         * Extension point for adding properties and callbacks to the file upload config.
         *
         * @param fileUploadconfig
         */
        applyConfiguration: function(fileUploadconfig)
        {
        },

        /**
         * Extension point for binding event handlers to file upload instance.
         *
         * @param fileUpload
         */
        applyBindings: function(fileUpload)
        {
        },

        /**
         * Converts from a file to a storage descriptor.
         *
         * A descriptor looks like:
         *
         *      {
         *          "id": ""
         *          ...
         *      }
         *
         * A descriptor may contain additional properties as needed by the underlying storage implementation
         * so as to retrieve metadata about the described file.
         *
         * Assumption is that the underlying persistence mechanism may need to be consulted.  Thus, this is async.
         *
         * By default, the descriptor mimics the file.
         *
         * @param file
         * @param callback function(err, descriptor)
         */
        convertFileToDescriptor: function(file, callback)
        {
            var descriptor = {
                "id": file.id,
                "name": file.name,
                "size": file.size,
                "url": file.url,
                "thumbnailUrl":file.thumbnailUrl,
                "deleteUrl": file.deleteUrl,
                "deleteType": file.deleteType
            };

            callback(null, descriptor);
        },

        /**
         * Converts a storage descriptor to a file.
         *
         * A file looks like:
         *
         *      {
         *          "id": "",
         *          "name": "picture1.jpg",
         *          "size": 902604,
         *          "url": "http:\/\/example.org\/files\/picture1.jpg",
         *          "thumbnailUrl": "http:\/\/example.org\/files\/thumbnail\/picture1.jpg",
         *          "deleteUrl": "http:\/\/example.org\/files\/picture1.jpg",
         *          "deleteType": "DELETE"
         *      }
         *
         * Since an underlying storage mechanism may be consulted, an async callback hook is provided.
         *
         * By default, the descriptor mimics the file.
         *
         * @param descriptor
         * @param callback function(err, file)
         */
        convertDescriptorToFile: function(descriptor, callback)
        {
            var file = {
                "id": descriptor.id,
                "name": descriptor.name,
                "size": descriptor.size,
                "url": descriptor.url,
                "thumbnailUrl":descriptor.thumbnailUrl,
                "deleteUrl": descriptor.deleteUrl,
                "deleteType": descriptor.deleteType
            };

            callback(null, file);
        },

        /**
         * Extension point for "enhancing" data received from the remote server after uploads have been submitted.
         * This provides a place to convert the data.rows back into the format which the upload control expects.
         *
         * Expected format:
         *
         *    data.result.rows = [{...}]
         *    data.result.files = [{
         *      "id": "",
         *      "path": "",
         *      "name": "picture1.jpg",
         *      "size": 902604,
         *      "url": "http:\/\/example.org\/files\/picture1.jpg",
         *      "thumbnailUrl": "http:\/\/example.org\/files\/thumbnail\/picture1.jpg",
         *      "deleteUrl": "http:\/\/example.org\/files\/picture1.jpg",
         *      "deleteType": "DELETE"*
         *    }]
         *
         * @param fileUploadConfig
         * @param data
         */
        enhanceFiles: function(fileUploadConfig, data)
        {
        },

        /**
         * Preloads data descriptors into files.
         *
         * @param fileUpload
         * @param el
         * @param callback
         */
        preload: function(fileUpload, el, callback)
        {
            var self = this;

            var files = [];

            // now preload with files based on property value
            var descriptors = self.getValueAsArray();

            var f = function(i)
            {
                if (i == descriptors.length) // jshint ignore:line
                {
                    // all done
                    return callback(files);
                }

                self.convertDescriptorToFile(descriptors[i], function(err, file) {
                    if (file)
                    {
                        files.push(file);
                    }
                    f(i+1);
                });
            };
            f(0);
        },

        afterPreload: function(fileUpload, el, files, callback)
        {
            var self = this;

            self.refreshUIState();

            callback();
        },

        /**
         * @see Alpaca.Fields.ControlField#getControlValue
         */
        getControlValue: function()
        {
            return this.data;
        },

        /**
         * Hands back the value as either an object or array, depending on the schema type.
         *
         * @returns {*}
         */
        getValue: function()
        {
            var value = this.data;

            if (this.isObjectType())
            {
                if (this.data && this.data.length > 0)
                {
                    value = this.data[0];
                }
                else
                {
                    value = undefined;
                }
            }

            return value;
        },

        setValue: function(value)
        {
            if (!value)
            {
                this.data = [];
            }
            else
            {
                if (Alpaca.isArray(value))
                {
                    this.data = value;
                }
                else if (Alpaca.isObject(value))
                {
                    this.data = [value];
                }
            }

            this.updateObservable();

            this.triggerUpdate();
        },

        /**
         * @returns {Array} the value as an array
         */
        getValueAsArray: function()
        {
            return this.data || [];
        },

        /**
         * Sets the value as an array.
         *
         * @param array
         */
        setValueAsArray: function(array)
        {
            var self = this;

            if (self.isArrayType())
            {
                self.setValue(array);
            }
            else if (self.isObjectType())
            {
                var val = null;
                if (array && array.length > 0) {
                    val = array[0];
                }

                self.setValue(val);
            }
        },

        reload: function(callback)
        {
            var self = this;

            var descriptors = this.getValueAsArray();

            var files = [];

            var f = function(i)
            {
                if (i === descriptors.length) // jshint ignore:line
                {
                    // all done

                    var form = $(self.control).find('.alpaca-fileupload-input');
                    $(form).fileupload('option', 'done').call(form, $.Event('done'), {
                        result: {
                            files: files
                        }
                    });

                    // refresh validation state
                    self.refreshValidationState();

                    return callback();
                }

                self.convertDescriptorToFile(descriptors[i], function(err, file) {
                    if (file)
                    {
                        files.push(file);
                    }
                    f(i+1);
                });
            };
            f(0);
        },

        plugin: function()
        {
            var self = this;

            return $(self.control).find('.alpaca-fileupload-input').data().blueimpFileupload;
        },

        refreshUIState: function()
        {
            var self = this;

            var fileUpload = self.plugin();
            if (fileUpload)
            {
                var maxNumberOfFiles = self.options.maxNumberOfFiles;

                if (maxNumberOfFiles === -1)
                {
                    self.refreshButtons(true);
                }
                else
                {
                    if (fileUpload.options.getNumberOfFiles && fileUpload.options.getNumberOfFiles() >= maxNumberOfFiles)
                    {
                        self.refreshButtons(false);
                    }
                    else
                    {
                        self.refreshButtons(true);
                    }
                }
            }
        },

        refreshButtons: function(enabled)
        {
            var self = this;

            // disable select files button
            $(self.control).find(".btn.fileinput-button").prop("disabled", true);
            $(self.control).find(".btn.fileinput-button").attr("disabled", "disabled");

            // hide dropzone message
            $(self.control).find(".fileupload-active-zone p.dropzone-message").css("display", "none");

            if (enabled)
            {
                // enable select files button
                $(self.control).find(".btn.fileinput-button").prop("disabled", false);
                $(self.control).find(".btn.fileinput-button").attr("disabled", null);

                // show dropzone message
                $(self.control).find(".fileupload-active-zone p.dropzone-message").css("display", "block");
            }
        },

        onFileDelete: function(rowEl, buttonEl, file)
        {
            var self = this;

            var deleteUrl = file.deleteUrl;
            var deleteMethod = file.deleteType;

            var c = {
                "method": deleteMethod,
                "url": deleteUrl,
                "headers": {}
            };

            var csrfToken = self.determineCsrfToken();
            if (csrfToken)
            {
                c.headers[Alpaca.CSRF_HEADER_NAME] = csrfToken;
            }

            $.ajax(c);
        },

        onUploadFail: function(data)
        {
            var self = this;

            if (self.options.errorHandler)
            {
                self.options.errorHandler.call(self, data);
            }

            // if "error" not filled in for each file, do our best here
            if (data.files && data.files.length > 0)
            {
                for (var i = 0; i < data.files.length; i++)
                {
                    if (!data.files[i].error) {
                        data.files[i].error = data.errorThrown;
                    }
                }
            }
        },

        /**
         * @see Alpaca.Field#disable
         */
        disable: function()
        {
            // disable select button
            $(this.field).find(".fileinput-button").prop("disabled", true);
            $(this.field).find(".fileinput-button").attr("disabled", "disabled");

            // hide the upload well
            $(this.field).find(".alpaca-fileupload-well").css("visibility", "hidden");
        },

        /**
         * @see Alpaca.Field#enable
         */
        enable: function()
        {
            $(this.field).find(".fileinput-button").prop("disabled", false);
            $(this.field).find(".fileinput-button").removeAttr("disabled");

            // show the upload well
            $(this.field).find(".alpaca-fileupload-well").css("visibility", "visible");
        },

        /* builder_helpers */

        /**
         * @see Alpaca.ControlField#getTitle
         */
        getTitle: function() {
            return "Upload Field";
        },

        /**
         * @see Alpaca.ControlField#getDescription
         */
        getDescription: function() {
            return "Provides an upload field with support for thumbnail preview";
        },

        /**
         * @see Alpaca.ControlField#getType
         */
        getType: function() {
            return "array";
        },

        /**
         * @private
         * @see Alpaca.Fields.TextField#getSchemaOfSchema
         */
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "maxNumberOfFiles": {
                        "title": "Maximum Number of Files",
                        "description": "The maximum number of files to allow to be uploaded.  If greater than zero, the maximum number will be constrained.  If -1, then no limit is imposed.",
                        "type": "number",
                        "default": 1
                    },
                    "maxFileSize": {
                        "title": "Maximum File Size (in bytes)",
                        "description": "The maximum file size allowed per upload.  If greater than zero, the maximum file size will be limited to the given size in bytes.  If -1, then no limit is imposed.",
                        "type": "number",
                        "default": -1
                    },
                    "fileTypes": {
                        "title": "File Types",
                        "description": "A regular expression limiting the file types that can be uploaded based on filename",
                        "type": "string"
                    },
                    "multiple": {
                        "title": "Multiple",
                        "description": "Whether to allow multiple file uploads.  If maxNumberOfFiles is not specified, multiple will toggle between 1 and unlimited.",
                        "type": "boolean",
                        "default": false
                    },
                    "directory": {
                        "title": "Directory",
                        "description": "Whether to allow directories (folders) to be dropped into the control for multi-document upload.",
                        "type": "boolean",
                        "default": false
                    },
                    "showUploadPreview": {
                        "title": "Show Upload Preview",
                        "description": "Whether to show thumbnails for uploaded assets (requires preview support)",
                        "type": "boolean",
                        "default": true
                    },
                    "errorHandler": {
                        "title": "Error Handler",
                        "description": "Optional function handler to be called when one or more files fails to upload.  This function is responsible for parsing the underlying xHR request and populating the error message state.",
                        "type": "function"
                    }
                }
            });
        }

        /* end_builder_helpers */
    });

    Alpaca.registerFieldClass("upload", Alpaca.Fields.UploadField);

    Alpaca.registerMessages({
        "chooseFile": "Choose File...",
        "chooseFiles": "Choose Files...",
        "dropZoneSingle": "Click the Choose button or Drag and Drop a file here to upload...",
        "dropZoneMultiple": "Click the Choose button or Drag and Drop files here to upload...",
        "dropZoneMultipleDirectory": "Click the Choose button or Drag and Drop files or a folder here to upload..."
    });

    // https://github.com/private-face/jquery.bind-first/blob/master/dev/jquery.bind-first.js
    // jquery.bind-first.js
    (function($) {
        var splitVersion = $.fn.jquery.split(".");
        var major = parseInt(splitVersion[0]);
        var minor = parseInt(splitVersion[1]);

        var JQ_LT_17 = (major < 1) || (major === 1 && minor < 7);

        function eventsData($el)
        {
            return JQ_LT_17 ? $el.data('events') : $._data($el[0]).events;
        }

        function moveHandlerToTop($el, eventName, isDelegated)
        {
            var data = eventsData($el);
            var events = data[eventName];

            if (!JQ_LT_17) {
                var handler = isDelegated ? events.splice(events.delegateCount - 1, 1)[0] : events.pop();
                events.splice(isDelegated ? 0 : (events.delegateCount || 0), 0, handler);

                return;
            }

            if (isDelegated) {
                data.live.unshift(data.live.pop());
            } else {
                events.unshift(events.pop());
            }
        }

        function moveEventHandlers($elems, eventsString, isDelegate) {
            var events = eventsString.split(/\s+/);
            $elems.each(function() {
                for (var i = 0; i < events.length; ++i) {
                    var pureEventName = $.trim(events[i]).match(/[^\.]+/i)[0];
                    moveHandlerToTop($(this), pureEventName, isDelegate);
                }
            });
        }

        $.fn.bindFirst = function()
        {
            var args = $.makeArray(arguments);
            var eventsString = args.shift();

            if (eventsString) {
                $.fn.bind.apply(this, arguments);
                moveEventHandlers(this, eventsString);
            }

            return this;
        };

    })($);

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.UpperCaseField = Alpaca.Fields.TextField.extend(
    /**
     * @lends Alpaca.Fields.UpperCaseField.prototype
     */
    {

        /**
         * @see Alpaca.Fields.TextField#getFieldType
         */
        getFieldType: function() {
            return "uppercase";
        },

        /**
         * @see Alpaca.Fields.TextField#setup
         */
        setup: function()
        {
            var self = this;

            this.base();

            if (this.data) {
                this.data = this.data.toUpperCase();
            }
        },

        /**
         * @see Alpaca.Fields.TextField#setValue
         */
        setValue: function(val)
        {
            if (!val) {
                return this.base(val);
            }

            var upperValue = null;
            if (val && Alpaca.isString(val)) {
                upperValue = val.toUpperCase();
            }

            if (upperValue != this.getValue()) // jshint ignore:line
            {
                this.base(upperValue);
            }
        },

        /**
         * @see Alpaca.ControlField#onKeyPress
         */
        onKeyPress: function(e)
        {
            this.base(e);

            var _this = this;

            Alpaca.later(25, this, function() {
                var v = _this.getValue();
                _this.setValue(v);
            });
        }

        /* builder_helpers */
        ,

        /**
         * @see Alpaca.Fields.TextField#getTitle
         */
        getTitle: function() {
            return "Uppercase Text";
        },

        /**
         * @see Alpaca.Fields.TextField#getDescription
         */
        getDescription: function() {
            return "Text field for uppercase text.";
        }

        /* end_builder_helpers */
    });

    Alpaca.registerFieldClass("uppercase", Alpaca.Fields.UpperCaseField);
    Alpaca.registerDefaultFormatFieldMapping("uppercase", "uppercase");

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.URLField = Alpaca.Fields.TextField.extend(
    /**
     * @lends Alpaca.Fields.URLField.prototype
     */
    {
        /**
         * @see Alpaca.Fields.TextField#getFieldType
         */
        getFieldType: function() {
            return "url";
        },

        /**
         * @see Alpaca.Fields.TextField#setup
         */
        setup: function()
        {
            // default html5 input type = "url";
            this.inputType = "url";

            this.base();

            if (typeof(this.options.allowIntranet) === "undefined")
            {
                this.options.allowIntranet = false;
            }

            if (this.options.allowIntranet)
            {
                this.schema.pattern = Alpaca.regexps["intranet-url"];
            }
            else
            {
                this.schema.pattern = Alpaca.regexps.url;
            }
            this.schema.format = "uri";
        },

        /**
         * @see Alpaca.Fields.TextField#handleValidate
         */
        handleValidate: function() {
            var baseStatus = this.base();

            var valInfo = this.validation;

            if (!valInfo["invalidPattern"]["status"]) {

                valInfo["invalidPattern"]["message"] = this.getMessage("invalidURLFormat");
            }

            return baseStatus;
        }

        /* builder_helpers */
        ,

        /**
         * @private
         * @see Alpaca.Fields.TextField#getSchemaOfOptions
         */
        getSchemaOfOptions: function() {

            return Alpaca.merge(this.base(), {
                "properties": {
                    "allowIntranet": {
                        "title": "Allow intranet",
                        "description": "Allows URLs with unqualified hostnames"
                    }
                }
            });

        },

        /**
         * @private
         * @see Alpaca.Fields.TextField#getOptionsForOptions
         */
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "allowIntranet": {
                        "type": "checkbox"
                    }
                }
            });
        },

        /**
         * @see Alpaca.Fields.TextField#getTitle
         */
        getTitle: function() {
            return "URL Field";
        },

        /**
         * @see Alpaca.Fields.TextField#getDescription
         */
        getDescription: function() {
            return "Provides a text control with validation for an internet web address.";
        }

        /* end_builder_helpers */
    });

    Alpaca.registerMessages({
        "invalidURLFormat": "The URL provided is not a valid web address."
    });
    Alpaca.registerFieldClass("url", Alpaca.Fields.URLField);
    Alpaca.registerDefaultFormatFieldMapping("url", "url");

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.ZipcodeField = Alpaca.Fields.TextField.extend(
    /**
     * @lends Alpaca.Fields.ZipcodeField.prototype
     */
    {
        /**
         * @see Alpaca.Fields.TextField#getFieldType
         */
        getFieldType: function() {
            return "zipcode";
        },

        /**
         * @see Alpaca.Fields.TextField#setup
         */
        setup: function()
        {
            this.base();

            this.options.format = (this.options.format ? this.options.format : "nine");

            if (this.options.format === "nine")
            {
                this.schema.pattern = Alpaca.regexps["zipcode-nine"];
            }
            else if (this.options.format === "five")
            {
                this.schema.pattern = Alpaca.regexps["zipcode-five"];
            }
            else
            {
                Alpaca.logError("The configured zipcode format: " + this.options.format + " is not a legal value [five, nine]");

                // default to nine format
                this.options.format = "nine";
                this.schema.pattern = Alpaca.regexps["zipcode-nine"];
            }

            // set mask string
            if (this.options.format === "nine")
            {
                this.options["maskString"] = "99999-9999";
            }
            else if (this.options.format === "five")
            {
                this.options["maskString"] = "99999";
            }
        },

        /**
         * @see Alpaca.Fields.TextField#handleValidate
         */
        handleValidate: function()
        {
            var baseStatus = this.base();

            var valInfo = this.validation;

            if (!valInfo["invalidPattern"]["status"]) {

                if (this.options.format === "nine")
                {
                    valInfo["invalidPattern"]["message"] = this.getMessage("invalidZipcodeFormatNine");
                }
                else if (this.options.format === "five")
                {
                    valInfo["invalidPattern"]["message"] = this.getMessage("invalidZipcodeFormatFive");
                }
            }

            return baseStatus;
        }



        /* builder_helpers */
        ,

        /**
         * @private
         * @see Alpaca.Fields.TextField#getSchemaOfOptions
         */
        getSchemaOfOptions: function() {

            return Alpaca.merge(this.base(), {
                "properties": {
                    "format": {
                        "title": "Format",
                        "description": "How to represent the zipcode field",
                        "type": "string",
                        "default": "five",
                        "enum":["five", "nine"],
                        "readonly": true
                    }
                }
            });

        },

        /**
         * @private
         * @see Alpaca.Fields.TextField#getOptionsForOptions
         */
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "format": {
                        "type": "text"
                    }
                }
            });
        },

        /**
         * @see Alpaca.Fields.TextField#getTitle
         */
        getTitle: function() {
            return "Zipcode Field";
        },

        /**
         * @see Alpaca.Fields.TextField#getDescription
         */
        getDescription: function() {
            return "Provides a five or nine-digital US zipcode control with validation.";
        }

        /* end_builder_helpers */
    });

    Alpaca.registerMessages({
        "invalidZipcodeFormatFive": "Invalid Five-Digit Zipcode (#####)",
        "invalidZipcodeFormatNine": "Invalid Nine-Digit Zipcode (#####-####)"
    });
    Alpaca.registerFieldClass("zipcode", Alpaca.Fields.ZipcodeField);
    Alpaca.registerDefaultFormatFieldMapping("zipcode", "zipcode");

})(jQuery);

/**
 * Defines the base class implementation for views.  All views in Alpaca ultimately extend this form.
 * This provides the ideal place for any global overrides of view templates, message bundles or other settings.
 */
(function ($) {

    var Alpaca = $.alpaca;

    Alpaca.registerView({
        "id": "base",
        "title": "Abstract base view",
        "messages": {
            "countries": {
                "afg": "Afghanistan",
                "ala": "Aland Islands",
                "alb": "Albania",
                "dza": "Algeria",
                "asm": "American Samoa",
                "and": "Andorra",
                "ago": "Angola",
                "aia": "Anguilla",
                "ata": "Antarctica",
                "atg": "Antigua and Barbuda",
                "arg": "Argentina",
                "arm": "Armenia",
                "abw": "Aruba",
                "aus": "Australia",
                "aut": "Austria",
                "aze": "Azerbaijan",
                "bhs": "Bahamas",
                "bhr": "Bahrain",
                "bgd": "Bangladesh",
                "brb": "Barbados",
                "blr": "Belarus",
                "bel": "Belgium",
                "blz": "Belize",
                "ben": "Benin",
                "bmu": "Bermuda",
                "btn": "Bhutan",
                "bol": "Bolivia",
                "bih": "Bosnia and Herzegovina",
                "bwa": "Botswana",
                "bvt": "Bouvet Island",
                "bra": "Brazil",
                "iot": "British Indian Ocean Territory",
                "brn": "Brunei Darussalam",
                "bgr": "Bulgaria",
                "bfa": "Burkina Faso",
                "bdi": "Burundi",
                "khm": "Cambodia",
                "cmr": "Cameroon",
                "can": "Canada",
                "cpv": "Cape Verde",
                "cym": "Cayman Islands",
                "caf": "Central African Republic",
                "tcd": "Chad",
                "chl": "Chile",
                "chn": "China",
                "cxr": "Christmas Island",
                "cck": "Cocos (Keeling), Islands",
                "col": "Colombia",
                "com": "Comoros",
                "cog": "Congo",
                "cod": "Congo, the Democratic Republic of the",
                "cok": "Cook Islands",
                "cri": "Costa Rica",
                "hrv": "Croatia",
                "cub": "Cuba",
                "cyp": "Cyprus",
                "cze": "Czech Republic",
                "civ": "Cote d'Ivoire",
                "dnk": "Denmark",
                "dji": "Djibouti",
                "dma": "Dominica",
                "dom": "Dominican Republic",
                "ecu": "Ecuador",
                "egy": "Egypt",
                "slv": "El Salvador",
                "gnq": "Equatorial Guinea",
                "eri": "Eritrea",
                "est": "Estonia",
                "eth": "Ethiopia",
                "flk": "Falkland Islands (Malvinas),",
                "fro": "Faroe Islands",
                "fji": "Fiji",
                "fin": "Finland",
                "fra": "France",
                "guf": "French Guiana",
                "pyf": "French Polynesia",
                "atf": "French Southern Territories",
                "gab": "Gabon",
                "gmb": "Gambia",
                "geo": "Georgia",
                "deu": "Germany",
                "gha": "Ghana",
                "gib": "Gibraltar",
                "grc": "Greece",
                "grl": "Greenland",
                "grd": "Grenada",
                "glp": "Guadeloupe",
                "gum": "Guam",
                "gtm": "Guatemala",
                "ggy": "Guernsey",
                "gin": "Guinea",
                "gnb": "Guinea-Bissau",
                "guy": "Guyana",
                "hti": "Haiti",
                "hmd": "Heard Island and McDonald Islands",
                "vat": "Holy See (Vatican City State),",
                "hnd": "Honduras",
                "hkg": "Hong Kong",
                "hun": "Hungary",
                "isl": "Iceland",
                "ind": "India",
                "idn": "Indonesia",
                "irn": "Iran, Islamic Republic of",
                "irq": "Iraq",
                "irl": "Ireland",
                "imn": "Isle of Man",
                "isr": "Israel",
                "ita": "Italy",
                "jam": "Jamaica",
                "jpn": "Japan",
                "jey": "Jersey",
                "jor": "Jordan",
                "kaz": "Kazakhstan",
                "ken": "Kenya",
                "kir": "Kiribati",
                "prk": "Korea, Democratic People's Republic of",
                "kor": "Korea, Republic of",
                "kwt": "Kuwait",
                "kgz": "Kyrgyzstan",
                "lao": "Lao People's Democratic Republic",
                "lva": "Latvia",
                "lbn": "Lebanon",
                "lso": "Lesotho",
                "lbr": "Liberia",
                "lby": "Libyan Arab Jamahiriya",
                "lie": "Liechtenstein",
                "ltu": "Lithuania",
                "lux": "Luxembourg",
                "mac": "Macao",
                "mkd": "Macedonia, the former Yugoslav Republic of",
                "mdg": "Madagascar",
                "mwi": "Malawi",
                "mys": "Malaysia",
                "mdv": "Maldives",
                "mli": "Mali",
                "mlt": "Malta",
                "mhl": "Marshall Islands",
                "mtq": "Martinique",
                "mrt": "Mauritania",
                "mus": "Mauritius",
                "myt": "Mayotte",
                "mex": "Mexico",
                "fsm": "Micronesia, Federated States of",
                "mda": "Moldova, Republic of",
                "mco": "Monaco",
                "mng": "Mongolia",
                "mne": "Montenegro",
                "msr": "Montserrat",
                "mar": "Morocco",
                "moz": "Mozambique",
                "mmr": "Myanmar",
                "nam": "Namibia",
                "nru": "Nauru",
                "npl": "Nepal",
                "nld": "Netherlands",
                "ant": "Netherlands Antilles",
                "ncl": "New Caledonia",
                "nzl": "New Zealand",
                "nic": "Nicaragua",
                "ner": "Niger",
                "nga": "Nigeria",
                "niu": "Niue",
                "nfk": "Norfolk Island",
                "mnp": "Northern Mariana Islands",
                "nor": "Norway",
                "omn": "Oman",
                "pak": "Pakistan",
                "plw": "Palau",
                "pse": "Palestinian Territory, Occupied",
                "pan": "Panama",
                "png": "Papua New Guinea",
                "pry": "Paraguay",
                "per": "Peru",
                "phl": "Philippines",
                "pcn": "Pitcairn",
                "pol": "Poland",
                "prt": "Portugal",
                "pri": "Puerto Rico",
                "qat": "Qatar",
                "rou": "Romania",
                "rus": "Russian Federation",
                "rwa": "Rwanda",
                "reu": "Reunion",
                "blm": "Saint Barthelemy",
                "shn": "Saint Helena",
                "kna": "Saint Kitts and Nevis",
                "lca": "Saint Lucia",
                "maf": "Saint Martin (French part)",
                "spm": "Saint Pierre and Miquelon",
                "vct": "Saint Vincent and the Grenadines",
                "wsm": "Samoa",
                "smr": "San Marino",
                "stp": "Sao Tome and Principe",
                "sau": "Saudi Arabia",
                "sen": "Senegal",
                "srb": "Serbia",
                "syc": "Seychelles",
                "sle": "Sierra Leone",
                "sgp": "Singapore",
                "svk": "Slovakia",
                "svn": "Slovenia",
                "slb": "Solomon Islands",
                "som": "Somalia",
                "zaf": "South Africa",
                "sgs": "South Georgia and the South Sandwich Islands",
                "esp": "Spain",
                "lka": "Sri Lanka",
                "sdn": "Sudan",
                "sur": "Suriname",
                "sjm": "Svalbard and Jan Mayen",
                "swz": "Swaziland",
                "swe": "Sweden",
                "che": "Switzerland",
                "syr": "Syrian Arab Republic",
                "twn": "Taiwan, Province of China",
                "tjk": "Tajikistan",
                "tza": "Tanzania, United Republic of",
                "tha": "Thailand",
                "tls": "Timor-Leste",
                "tgo": "Togo",
                "tkl": "Tokelau",
                "ton": "Tonga",
                "tto": "Trinidad and Tobago",
                "tun": "Tunisia",
                "tur": "Turkey",
                "tkm": "Turkmenistan",
                "tca": "Turks and Caicos Islands",
                "tuv": "Tuvalu",
                "uga": "Uganda",
                "ukr": "Ukraine",
                "are": "United Arab Emirates",
                "gbr": "United Kingdom",
                "usa": "United States",
                "umi": "United States Minor Outlying Islands",
                "ury": "Uruguay",
                "uzb": "Uzbekistan",
                "vut": "Vanuatu",
                "ven": "Venezuela",
                "vnm": "Viet Nam",
                "vgb": "Virgin Islands, British",
                "vir": "Virgin Islands, U.S.",
                "wlf": "Wallis and Futuna",
                "esh": "Western Sahara",
                "yem": "Yemen",
                "zmb": "Zambia",
                "zwe": "Zimbabwe"
            },
            "empty": "",
            "required": "This field is required",
            "valid": "",
            "invalid": "This field is invalid",
            "months": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            "timeUnits": { SECOND: "seconds", MINUTE: "minutes", HOUR: "hours", DAY: "days", MONTH: "months", YEAR: "years" },
            "countryCallingCodes": [
                { 'name': 'Israel', 'dial_code': '+972', 'code': 'IL' },
                { 'name': 'Afghanistan', 'dial_code': '+93', 'code': 'AF' },
                { 'name': 'Albania', 'dial_code': '+355', 'code': 'AL' },
                { 'name': 'Algeria', 'dial_code': '+213', 'code': 'DZ' },
                { 'name': 'AmericanSamoa', 'dial_code': '+1 684', 'code': 'AS' },
                { 'name': 'Andorra', 'dial_code': '+376', 'code': 'AD' },
                { 'name': 'Angola', 'dial_code': '+244', 'code': 'AO' },
                { 'name': 'Anguilla', 'dial_code': '+1 264', 'code': 'AI' },
                { 'name': 'Antigua and Barbuda', 'dial_code': '+1268', 'code': 'AG' },
                { 'name': 'Argentina', 'dial_code': '+54', 'code': 'AR' },
                { 'name': 'Armenia', 'dial_code': '+374', 'code': 'AM' },
                { 'name': 'Aruba', 'dial_code': '+297', 'code': 'AW' },
                { 'name': 'Australia', 'dial_code': '+61', 'code': 'AU' },
                { 'name': 'Austria', 'dial_code': '+43', 'code': 'AT' },
                { 'name': 'Azerbaijan', 'dial_code': '+994', 'code': 'AZ' },
                { 'name': 'Bahamas', 'dial_code': '+1 242', 'code': 'BS' },
                { 'name': 'Bahrain', 'dial_code': '+973', 'code': 'BH' },
                { 'name': 'Bangladesh', 'dial_code': '+880', 'code': 'BD' },
                { 'name': 'Barbados', 'dial_code': '+1 246', 'code': 'BB' },
                { 'name': 'Belarus', 'dial_code': '+375', 'code': 'BY' },
                { 'name': 'Belgium', 'dial_code': '+32', 'code': 'BE' },
                { 'name': 'Belize', 'dial_code': '+501', 'code': 'BZ' },
                { 'name': 'Benin', 'dial_code': '+229', 'code': 'BJ' },
                { 'name': 'Bermuda', 'dial_code': '+1 441', 'code': 'BM' },
                { 'name': 'Bhutan', 'dial_code': '+975', 'code': 'BT' },
                { 'name': 'Bosnia and Herzegovina', 'dial_code': '+387', 'code': 'BA' },
                { 'name': 'Botswana', 'dial_code': '+267', 'code': 'BW' },
                { 'name': 'Brazil', 'dial_code': '+55', 'code': 'BR' },
                { 'name': 'British Indian Ocean Territory', 'dial_code': '+246', 'code': 'IO' },
                { 'name': 'Bulgaria', 'dial_code': '+359', 'code': 'BG' },
                { 'name': 'Burkina Faso', 'dial_code': '+226', 'code': 'BF' },
                { 'name': 'Burundi', 'dial_code': '+257', 'code': 'BI' },
                { 'name': 'Cambodia', 'dial_code': '+855', 'code': 'KH' },
                { 'name': 'Cameroon', 'dial_code': '+237', 'code': 'CM' },
                { 'name': 'Canada', 'dial_code': '+1', 'code': 'CA' },
                { 'name': 'Cape Verde', 'dial_code': '+238', 'code': 'CV' },
                { 'name': 'Cayman Islands', 'dial_code': '+ 345', 'code': 'KY' },
                { 'name': 'Central African Republic', 'dial_code': '+236', 'code': 'CF' },
                { 'name': 'Chad', 'dial_code': '+235', 'code': 'TD' },
                { 'name': 'Chile', 'dial_code': '+56', 'code': 'CL' },
                { 'name': 'China', 'dial_code': '+86', 'code': 'CN' },
                { 'name': 'Christmas Island', 'dial_code': '+61', 'code': 'CX' },
                { 'name': 'Colombia', 'dial_code': '+57', 'code': 'CO' },
                { 'name': 'Comoros', 'dial_code': '+269', 'code': 'KM' },
                { 'name': 'Congo', 'dial_code': '+242', 'code': 'CG' },
                { 'name': 'Cook Islands', 'dial_code': '+682', 'code': 'CK' },
                { 'name': 'Costa Rica', 'dial_code': '+506', 'code': 'CR' },
                { 'name': 'Croatia', 'dial_code': '+385', 'code': 'HR' },
                { 'name': 'Cuba', 'dial_code': '+53', 'code': 'CU' },
                { 'name': 'Cyprus', 'dial_code': '+537', 'code': 'CY' },
                { 'name': 'Czech Republic', 'dial_code': '+420', 'code': 'CZ' },
                { 'name': 'Denmark', 'dial_code': '+45', 'code': 'DK' },
                { 'name': 'Djibouti', 'dial_code': '+253', 'code': 'DJ' },
                { 'name': 'Dominica', 'dial_code': '+1 767', 'code': 'DM' },
                { 'name': 'Dominican Republic', 'dial_code': '+1 849', 'code': 'DO' },
                { 'name': 'Ecuador', 'dial_code': '+593', 'code': 'EC' },
                { 'name': 'Egypt', 'dial_code': '+20', 'code': 'EG' },
                { 'name': 'El Salvador', 'dial_code': '+503', 'code': 'SV' },
                { 'name': 'Equatorial Guinea', 'dial_code': '+240', 'code': 'GQ' },
                { 'name': 'Eritrea', 'dial_code': '+291', 'code': 'ER' },
                { 'name': 'Estonia', 'dial_code': '+372', 'code': 'EE' },
                { 'name': 'Ethiopia', 'dial_code': '+251', 'code': 'ET' },
                { 'name': 'Faroe Islands', 'dial_code': '+298', 'code': 'FO' },
                { 'name': 'Fiji', 'dial_code': '+679', 'code': 'FJ' },
                { 'name': 'Finland', 'dial_code': '+358', 'code': 'FI' },
                { 'name': 'France', 'dial_code': '+33', 'code': 'FR' },
                { 'name': 'French Guiana', 'dial_code': '+594', 'code': 'GF' },
                { 'name': 'French Polynesia', 'dial_code': '+689', 'code': 'PF' },
                { 'name': 'Gabon', 'dial_code': '+241', 'code': 'GA' },
                { 'name': 'Gambia', 'dial_code': '+220', 'code': 'GM' },
                { 'name': 'Georgia', 'dial_code': '+995', 'code': 'GE' },
                { 'name': 'Germany', 'dial_code': '+49', 'code': 'DE' },
                { 'name': 'Ghana', 'dial_code': '+233', 'code': 'GH' },
                { 'name': 'Gibraltar', 'dial_code': '+350', 'code': 'GI' },
                { 'name': 'Greece', 'dial_code': '+30', 'code': 'GR' },
                { 'name': 'Greenland', 'dial_code': '+299', 'code': 'GL' },
                { 'name': 'Grenada', 'dial_code': '+1 473', 'code': 'GD' },
                { 'name': 'Guadeloupe', 'dial_code': '+590', 'code': 'GP' },
                { 'name': 'Guam', 'dial_code': '+1 671', 'code': 'GU' },
                { 'name': 'Guatemala', 'dial_code': '+502', 'code': 'GT' },
                { 'name': 'Guinea', 'dial_code': '+224', 'code': 'GN' },
                { 'name': 'Guinea-Bissau', 'dial_code': '+245', 'code': 'GW' },
                { 'name': 'Guyana', 'dial_code': '+595', 'code': 'GY' },
                { 'name': 'Haiti', 'dial_code': '+509', 'code': 'HT' },
                { 'name': 'Honduras', 'dial_code': '+504', 'code': 'HN' },
                { 'name': 'Hungary', 'dial_code': '+36', 'code': 'HU' },
                { 'name': 'Iceland', 'dial_code': '+354', 'code': 'IS' },
                { 'name': 'India', 'dial_code': '+91', 'code': 'IN' },
                { 'name': 'Indonesia', 'dial_code': '+62', 'code': 'ID' },
                { 'name': 'Iraq', 'dial_code': '+964', 'code': 'IQ' },
                { 'name': 'Ireland', 'dial_code': '+353', 'code': 'IE' },
                { 'name': 'Israel', 'dial_code': '+972', 'code': 'IL' },
                { 'name': 'Italy', 'dial_code': '+39', 'code': 'IT' },
                { 'name': 'Jamaica', 'dial_code': '+1 876', 'code': 'JM' },
                { 'name': 'Japan', 'dial_code': '+81', 'code': 'JP' },
                { 'name': 'Jordan', 'dial_code': '+962', 'code': 'JO' },
                { 'name': 'Kazakhstan', 'dial_code': '+7 7', 'code': 'KZ' },
                { 'name': 'Kenya', 'dial_code': '+254', 'code': 'KE' },
                { 'name': 'Kiribati', 'dial_code': '+686', 'code': 'KI' },
                { 'name': 'Kuwait', 'dial_code': '+965', 'code': 'KW' },
                { 'name': 'Kyrgyzstan', 'dial_code': '+996', 'code': 'KG' },
                { 'name': 'Latvia', 'dial_code': '+371', 'code': 'LV' },
                { 'name': 'Lebanon', 'dial_code': '+961', 'code': 'LB' },
                { 'name': 'Lesotho', 'dial_code': '+266', 'code': 'LS' },
                { 'name': 'Liberia', 'dial_code': '+231', 'code': 'LR' },
                { 'name': 'Liechtenstein', 'dial_code': '+423', 'code': 'LI' },
                { 'name': 'Lithuania', 'dial_code': '+370', 'code': 'LT' },
                { 'name': 'Luxembourg', 'dial_code': '+352', 'code': 'LU' },
                { 'name': 'Madagascar', 'dial_code': '+261', 'code': 'MG' },
                { 'name': 'Malawi', 'dial_code': '+265', 'code': 'MW' },
                { 'name': 'Malaysia', 'dial_code': '+60', 'code': 'MY' },
                { 'name': 'Maldives', 'dial_code': '+960', 'code': 'MV' },
                { 'name': 'Mali', 'dial_code': '+223', 'code': 'ML' },
                { 'name': 'Malta', 'dial_code': '+356', 'code': 'MT' },
                { 'name': 'Marshall Islands', 'dial_code': '+692', 'code': 'MH' },
                { 'name': 'Martinique', 'dial_code': '+596', 'code': 'MQ' },
                { 'name': 'Mauritania', 'dial_code': '+222', 'code': 'MR' },
                { 'name': 'Mauritius', 'dial_code': '+230', 'code': 'MU' },
                { 'name': 'Mayotte', 'dial_code': '+262', 'code': 'YT' },
                { 'name': 'Mexico', 'dial_code': '+52', 'code': 'MX' },
                { 'name': 'Monaco', 'dial_code': '+377', 'code': 'MC' },
                { 'name': 'Mongolia', 'dial_code': '+976', 'code': 'MN' },
                { 'name': 'Montenegro', 'dial_code': '+382', 'code': 'ME' },
                { 'name': 'Montserrat', 'dial_code': '+1664', 'code': 'MS' },
                { 'name': 'Morocco', 'dial_code': '+212', 'code': 'MA' },
                { 'name': 'Myanmar', 'dial_code': '+95', 'code': 'MM' },
                { 'name': 'Namibia', 'dial_code': '+264', 'code': 'NA' },
                { 'name': 'Nauru', 'dial_code': '+674', 'code': 'NR' },
                { 'name': 'Nepal', 'dial_code': '+977', 'code': 'NP' },
                { 'name': 'Netherlands', 'dial_code': '+31', 'code': 'NL' },
                { 'name': 'Netherlands Antilles', 'dial_code': '+599', 'code': 'AN' },
                { 'name': 'New Caledonia', 'dial_code': '+687', 'code': 'NC' },
                { 'name': 'New Zealand', 'dial_code': '+64', 'code': 'NZ' },
                { 'name': 'Nicaragua', 'dial_code': '+505', 'code': 'NI' },
                { 'name': 'Niger', 'dial_code': '+227', 'code': 'NE' },
                { 'name': 'Nigeria', 'dial_code': '+234', 'code': 'NG' },
                { 'name': 'Niue', 'dial_code': '+683', 'code': 'NU' },
                { 'name': 'Norfolk Island', 'dial_code': '+672', 'code': 'NF' },
                { 'name': 'Northern Mariana Islands', 'dial_code': '+1 670', 'code': 'MP' },
                { 'name': 'Norway', 'dial_code': '+47', 'code': 'NO' },
                { 'name': 'Oman', 'dial_code': '+968', 'code': 'OM' },
                { 'name': 'Pakistan', 'dial_code': '+92', 'code': 'PK' },
                { 'name': 'Palau', 'dial_code': '+680', 'code': 'PW' },
                { 'name': 'Panama', 'dial_code': '+507', 'code': 'PA' },
                { 'name': 'Papua New Guinea', 'dial_code': '+675', 'code': 'PG' },
                { 'name': 'Paraguay', 'dial_code': '+595', 'code': 'PY' },
                { 'name': 'Peru', 'dial_code': '+51', 'code': 'PE' },
                { 'name': 'Philippines', 'dial_code': '+63', 'code': 'PH' },
                { 'name': 'Poland', 'dial_code': '+48', 'code': 'PL' },
                { 'name': 'Portugal', 'dial_code': '+351', 'code': 'PT' },
                { 'name': 'Puerto Rico', 'dial_code': '+1 939', 'code': 'PR' },
                { 'name': 'Qatar', 'dial_code': '+974', 'code': 'QA' },
                { 'name': 'Romania', 'dial_code': '+40', 'code': 'RO' },
                { 'name': 'Rwanda', 'dial_code': '+250', 'code': 'RW' },
                { 'name': 'Samoa', 'dial_code': '+685', 'code': 'WS' },
                { 'name': 'San Marino', 'dial_code': '+378', 'code': 'SM' },
                { 'name': 'Saudi Arabia', 'dial_code': '+966', 'code': 'SA' },
                { 'name': 'Senegal', 'dial_code': '+221', 'code': 'SN' },
                { 'name': 'Serbia', 'dial_code': '+381', 'code': 'RS' },
                { 'name': 'Seychelles', 'dial_code': '+248', 'code': 'SC' },
                { 'name': 'Sierra Leone', 'dial_code': '+232', 'code': 'SL' },
                { 'name': 'Singapore', 'dial_code': '+65', 'code': 'SG' },
                { 'name': 'Slovakia', 'dial_code': '+421', 'code': 'SK' },
                { 'name': 'Slovenia', 'dial_code': '+386', 'code': 'SI' },
                { 'name': 'Solomon Islands', 'dial_code': '+677', 'code': 'SB' },
                { 'name': 'South Africa', 'dial_code': '+27', 'code': 'ZA' },
                {
                    'name': 'South Georgia and the South Sandwich Islands',
                    'dial_code': '+500',
                    'code': 'GS'
                },
                { 'name': 'Spain', 'dial_code': '+34', 'code': 'ES' },
                { 'name': 'Sri Lanka', 'dial_code': '+94', 'code': 'LK' },
                { 'name': 'Sudan', 'dial_code': '+249', 'code': 'SD' },
                { 'name': 'Suriname', 'dial_code': '+597', 'code': 'SR' },
                { 'name': 'Swaziland', 'dial_code': '+268', 'code': 'SZ' },
                { 'name': 'Sweden', 'dial_code': '+46', 'code': 'SE' },
                { 'name': 'Switzerland', 'dial_code': '+41', 'code': 'CH' },
                { 'name': 'Tajikistan', 'dial_code': '+992', 'code': 'TJ' },
                { 'name': 'Thailand', 'dial_code': '+66', 'code': 'TH' },
                { 'name': 'Togo', 'dial_code': '+228', 'code': 'TG' },
                { 'name': 'Tokelau', 'dial_code': '+690', 'code': 'TK' },
                { 'name': 'Tonga', 'dial_code': '+676', 'code': 'TO' },
                { 'name': 'Trinidad and Tobago', 'dial_code': '+1 868', 'code': 'TT' },
                { 'name': 'Tunisia', 'dial_code': '+216', 'code': 'TN' },
                { 'name': 'Turkey', 'dial_code': '+90', 'code': 'TR' },
                { 'name': 'Turkmenistan', 'dial_code': '+993', 'code': 'TM' },
                { 'name': 'Turks and Caicos Islands', 'dial_code': '+1 649', 'code': 'TC' },
                { 'name': 'Tuvalu', 'dial_code': '+688', 'code': 'TV' },
                { 'name': 'Uganda', 'dial_code': '+256', 'code': 'UG' },
                { 'name': 'Ukraine', 'dial_code': '+380', 'code': 'UA' },
                { 'name': 'United Arab Emirates', 'dial_code': '+971', 'code': 'AE' },
                { 'name': 'United Kingdom', 'dial_code': '+44', 'code': 'GB' },
                { 'name': 'United States', 'dial_code': '+1', 'code': 'US' },
                { 'name': 'Uruguay', 'dial_code': '+598', 'code': 'UY' },
                { 'name': 'Uzbekistan', 'dial_code': '+998', 'code': 'UZ' },
                { 'name': 'Vanuatu', 'dial_code': '+678', 'code': 'VU' },
                { 'name': 'Wallis and Futuna', 'dial_code': '+681', 'code': 'WF' },
                { 'name': 'Yemen', 'dial_code': '+967', 'code': 'YE' },
                { 'name': 'Zambia', 'dial_code': '+260', 'code': 'ZM' },
                { 'name': 'Zimbabwe', 'dial_code': '+263', 'code': 'ZW' },
                { 'name': 'land Islands', 'dial_code': '', 'code': 'AX' },
                { 'name': 'Antarctica', 'dial_code': null, 'code': 'AQ' },
                { 'name': 'Bolivia, Plurinational State of', 'dial_code': '+591', 'code': 'BO' },
                { 'name': 'Brunei Darussalam', 'dial_code': '+673', 'code': 'BN' },
                { 'name': 'Cocos (Keeling) Islands', 'dial_code': '+61', 'code': 'CC' },
                {
                    'name': 'Congo, The Democratic Republic of the',
                    'dial_code': '+243',
                    'code': 'CD'
                },
                { 'name': "Cote d'Ivoire", 'dial_code': '+225', 'code': 'CI' },
                { 'name': 'Falkland Islands (Malvinas)', 'dial_code': '+500', 'code': 'FK' },
                { 'name': 'Guernsey', 'dial_code': '+44', 'code': 'GG' },
                { 'name': 'Holy See (Vatican City State)', 'dial_code': '+379', 'code': 'VA' },
                { 'name': 'Hong Kong', 'dial_code': '+852', 'code': 'HK' },
                { 'name': 'Iran, Islamic Republic of', 'dial_code': '+98', 'code': 'IR' },
                { 'name': 'Isle of Man', 'dial_code': '+44', 'code': 'IM' },
                { 'name': 'Jersey', 'dial_code': '+44', 'code': 'JE' },
                {
                    'name': "Korea, Democratic People's Republic of",
                    'dial_code': '+850',
                    'code': 'KP'
                },
                { 'name': 'Korea, Republic of', 'dial_code': '+82', 'code': 'KR' },
                { 'name': "Lao People's Democratic Republic", 'dial_code': '+856', 'code': 'LA' },
                { 'name': 'Libyan Arab Jamahiriya', 'dial_code': '+218', 'code': 'LY' },
                { 'name': 'Macao', 'dial_code': '+853', 'code': 'MO' },
                {
                    'name': 'Macedonia, The Former Yugoslav Republic of',
                    'dial_code': '+389',
                    'code': 'MK'
                },
                { 'name': 'Micronesia, Federated States of', 'dial_code': '+691', 'code': 'FM' },
                { 'name': 'Moldova, Republic of', 'dial_code': '+373', 'code': 'MD' },
                { 'name': 'Mozambique', 'dial_code': '+258', 'code': 'MZ' },
                { 'name': 'Palestinian Territory, Occupied', 'dial_code': '+970', 'code': 'PS' },
                { 'name': 'Pitcairn', 'dial_code': '+872', 'code': 'PN' },
                { 'name': 'Réunion', 'dial_code': '+262', 'code': 'RE' },
                { 'name': 'Russia', 'dial_code': '+7', 'code': 'RU' },
                { 'name': 'Saint Barthélemy', 'dial_code': '+590', 'code': 'BL' },
                {
                    'name': 'Saint Helena, Ascension and Tristan Da Cunha',
                    'dial_code': '+290',
                    'code': 'SH'
                },
                { 'name': 'Saint Kitts and Nevis', 'dial_code': '+1 869', 'code': 'KN' },
                { 'name': 'Saint Lucia', 'dial_code': '+1 758', 'code': 'LC' },
                { 'name': 'Saint Martin', 'dial_code': '+590', 'code': 'MF' },
                { 'name': 'Saint Pierre and Miquelon', 'dial_code': '+508', 'code': 'PM' },
                { 'name': 'Saint Vincent and the Grenadines', 'dial_code': '+1 784', 'code': 'VC' },
                { 'name': 'Sao Tome and Principe', 'dial_code': '+239', 'code': 'ST' },
                { 'name': 'Somalia', 'dial_code': '+252', 'code': 'SO' },
                { 'name': 'Svalbard and Jan Mayen', 'dial_code': '+47', 'code': 'SJ' },
                { 'name': 'Syrian Arab Republic', 'dial_code': '+963', 'code': 'SY' },
                { 'name': 'Taiwan, Province of China', 'dial_code': '+886', 'code': 'TW' },
                { 'name': 'Tanzania, United Republic of', 'dial_code': '+255', 'code': 'TZ' },
                { 'name': 'Timor-Leste', 'dial_code': '+670', 'code': 'TL' },
                { 'name': 'Venezuela, Bolivarian Republic of', 'dial_code': '+58', 'code': 'VE' },
                { 'name': 'Viet Nam', 'dial_code': '+84', 'code': 'VN' },
                { 'name': 'Virgin Islands, British', 'dial_code': '+1 284', 'code': 'VG' },
                { 'name': 'Virgin Islands, U.S.', 'dial_code': '+1 340', 'code': 'VI' }
            ]
        }
    });

})(jQuery);
(function($) {

	// czech - czech republic

	var Alpaca = $.alpaca;

	Alpaca.registerView ({
		"id": "base",
		"messages": {
			"cs_CZ": {
				required: "Toto pole je vyžadováno",
				invalid: "Toto pole je neplatné",
				months: ["Leden", "Únor", "Březen", "Duben", "Květen", "Červen", "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"],
				timeUnits: {
					SECOND: "sekundy",
					MINUTE: "minuty",
					HOUR: "hodiny",
					DAY: "dny",
					MONTH: "měsíce",
					YEAR: "roky"
				},
				// ControlField.js
				"invalidValueOfEnum": "Toto pole musí obsahovat jednu hodnotu z {0}. Aktuální hodnota je: {1}",

				// Field.js
				"notOptional": "Toto pole není volitelné",
				"disallowValue": "{0} jsou zakázané hodnoty.",

				// fields/basic/ArrayField.js
				"notEnoughItems": "Minimální počet položek je {0}",
				"tooManyItems": "Maximální počet položek je {0}",
				"valueNotUnique": "Hodnoty nejsou unikátní",
				"notAnArray": "Tato hodnota není pole",
				"addItemButtonLabel": "Přidat novou položku",
				"addButtonLabel": "Přidat",
				"removeButtonLabel": "Odebrat",
				"upButtonLabel": "Nahoru",
				"downButtonLabel": "Dolů",

				// fields/basic/ListField.js
				"noneLabel": "Žádný",

				// fields/basic/NumberField.js
				"stringValueTooSmall": "Minimální hodnota tohoto pole je {0}",
				"stringValueTooLarge": "Maximální hodnota tohoto pole je {0}",
				"stringValueTooSmallExclusive": "Hodnota tohoto pole musí být větší než {0}",
				"stringValueTooLargeExclusive": "Hodnota tohoto pole musí být menší než {0}",
				"stringDivisibleBy": "Hodnota musí být dělitelná {0}",
				"stringNotANumber": "Hodnota není číslo.",
				"stringValueNotMultipleOf": "Číslo není násobkem {0}",

				// fields/basic/ObjectField.js
				"tooManyProperties": "Maximální počet vlastností ({0}) byl překročen.",
				"tooFewProperties": "Není dostatek vlastností (je požadováno {0})",

				// fields/basic/TextAreaField.js
				"wordLimitExceeded": "Maximální počet slov ({0}) byl překročen.",

				// fields/basic/TextField.js
				"invalidPattern": "Toto pole má mít vzor {0}",
				"stringTooShort": "Toto pole musí obsahovat nejmeně {0} znaků",
				"stringTooLong": "Toto pole musí obsahovat maximálně {0} znaků",

				// fields/advanced/DateField.js
				"invalidDate": "Nesprávné datum pro formát {0}",

				// fields/advaned/EditorField.js
				"editorAnnotationsExist": "Editor má v sobě chyby, které musí být opraveny",

				// fields/advanced/EmailField.js
				"invalidEmail": "Chybná e-mailová adresa, př.: info@cloudcms.com",

				// fields/advanced.IntegerField.js
				"stringNotAnInteger": "Tato hodnota není číslo.",

				// fields/advanced/IPv4Field.js
				"invalidIPv4": "Chybná IPv4 adresa, ex: 192.168.0.1",

				// fields/advanced/JSONField.js
				"stringNotAJSON": "Tato hodnota není platný JSON text.",

				// fields/advanced/MapField.js
				"keyMissing": "Mapa obsahuje prázdný klíč.",
				"keyNotUnique": "Klíče nejsou jedinečné.",

				// fields/advanced/PasswordField.js
				"invalidPassword": "Špatné heslo",

				// fields/advanced/PasswordField.js
				"invalidPhone": "Špatné telefonní číslo, př.: (123) 456-9999", // TODO: invalid pattern for czech locale

				// fields/advanced/UploadField.js
				"chooseFile": "Vyberte soubor...",
				"chooseFiles": "Vyberte soubory...",
				"dropZoneSingle": "Vyberte soubor nebo jej přetáhněte sem pro nahrání...",
				"dropZoneMultiple": "Vyberte soubory nebo je přetáhněte sem pro nahrání...",

				// fields/advanced/URLField.js
				"invalidURLFormat": "Uvedená URL není platna webová adresa.",

				// fields/advanced/CipcodeField.js
				"invalidZipcodeFormatFive": "Chybné poštovní směrovací číslo (#####)",
				"invalidZipcodeFormatNine": "Chybné devíti-místné poštovní směrovací číslo (#####-####)"
			}
        }
	});

})(jQuery);

(function($) {

	// german - austria

	var Alpaca = $.alpaca;

	Alpaca.registerView ({
		"id": "base",
		"messages": {
            "de_AT": {
                required: "Eingabe erforderlich",
                invalid: "Eingabe invalid",
                months: ["Jänner", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
                timeUnits: {
                    SECOND: "Sekunden",
                    MINUTE: "Minuten",
                    HOUR: "Stunden",
                    DAY: "Tage",
                    MONTH: "Monate",
                    YEAR: "Jahre"
                },
                "notOptional": "Dieses Feld ist nicht optional",
                "disallowValue": "Diese Werte sind nicht erlaubt: {0}",
                "invalidValueOfEnum": "Diese Feld sollte einen der folgenden Werte enthalten: {0}. [{1}]",
                "notEnoughItems": "Die Mindestanzahl von Elementen ist {0}",
                "tooManyItems": "Die Maximalanzahl von Elementen ist {0}",
                "valueNotUnique": "Diese Werte sind nicht eindeutig",
                "notAnArray": "Keine Liste von Werten",
                "invalidDate": "Falsches Datumsformat: {0}",
                "invalidEmail": "Ungültige e-Mail Adresse, z.B.: info@cloudcms.com",
                "stringNotAnInteger": "Eingabe ist keine Ganz Zahl.",
                "invalidIPv4": "Ungültige IPv4 Adresse, z.B.: 192.168.0.1",
                "stringValueTooSmall": "Die Mindestanzahl von Zeichen ist {0}",
                "stringValueTooLarge": "Die Maximalanzahl von Zeichen ist {0}",
                "stringValueTooSmallExclusive": "Die Anzahl der Zeichen muss größer sein als {0}",
                "stringValueTooLargeExclusive": "Die Anzahl der Zeichen muss kleiner sein als {0}",
                "stringDivisibleBy": "Der Wert muss durch {0} dividierbar sein",
                "stringNotANumber": "Die Eingabe ist keine Zahl",
                "invalidPassword": "Ungültiges Passwort.",
                "invalidPhone": "Ungültige Telefonnummer, z.B.: (123) 456-9999",
                "invalidPattern": "Diese Feld stimmt nicht mit folgender Vorgabe überein {0}",
                "stringTooShort": "Dieses Feld sollte mindestens {0} Zeichen enthalten",
                "stringTooLong": "Dieses Feld sollte höchstens {0} Zeichen enthalten"
            }
		}
	});

})(jQuery);

(function($) {

	// german - germany

	var Alpaca = $.alpaca;

	Alpaca.registerView ({
		"id": "base",
		"messages": {
            "de_DE": {
                required: "Eingabe erforderlich",
                invalid: "Eingabe ungültig",
                months: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
                timeUnits: {
                    SECOND: "Sekunden",
                    MINUTE: "Minuten",
                    HOUR: "Stunden",
                    DAY: "Tage",
                    MONTH: "Monate",
                    YEAR: "Jahre"
                },
                "notOptional": "Dieses Feld ist nicht optional",
                "disallowValue": "Diese Werte sind nicht erlaubt: {0}",
                "invalidValueOfEnum": "Diese Feld sollte einen der folgenden Werte enthalten: {0}. [{1}]",
                "notEnoughItems": "Die Mindestanzahl von Elementen ist {0}",
                "tooManyItems": "Die Maximalanzahl von Elementen ist {0}",
                "valueNotUnique": "Diese Werte sind nicht eindeutig",
                "notAnArray": "Keine Liste von Werten",
                "invalidDate": "Falsches Datumsformat: {0}",
                "invalidEmail": "Keine gültige E-Mail Adresse",
                "stringNotAnInteger": "Keine Ganze Zahl",
                "invalidIPv4": "Ungültige IPv4 Adresse",
                "stringValueTooSmall": "Die kleinstmögliche Zahl ist {0}",
                "stringValueTooLarge": "Die grösstmögliche Zahl ist {0}",
                "stringValueTooSmallExclusive": "Die kleinstmögliche Zahl muss größer sein als {0}",
                "stringValueTooLargeExclusive": "Die grösstmögliche Zahl muss kleiner sein als {0}",
                "stringDivisibleBy": "Der Wert muss durch {0} dividierbar sein",
                "stringNotANumber": "Die Eingabe ist keine Zahl",
                "invalidPassword": "Ungültiges Passwort",
                "invalidPhone": "Ungültige Telefonnummer",
                "invalidPattern": "Diese Feld stimmt nicht mit folgender Vorgabe überein {0}",
                "stringTooShort": "Dieses Feld sollte mindestens {0} Zeichen enthalten",
                "stringTooLong": "Dieses Feld sollte höchstens {0} Zeichen enthalten"
            }
		}
	});

})(jQuery);

(function($) {

	// greek - greece

	var Alpaca = $.alpaca;

	Alpaca.registerView ({
		"id": "base",
		"messages": {
            "el_GR": {
                required: "Υποχρεωτικό",
                invalid: "Λάθος",
                months: ["Ιανουάριος", "Φεβρουάριος", "Μάρτιος", "Απρίλιος", "Μάιος", "Ιούνιος", "Ιούλιος", "Αύγουστος", "Σεπτέμβριος", "Οκτώβριος", "Νοέμβριος", "Δεκέμβριος"],
                timeUnits: {
                    SECOND: "Δευτερόλεπτα",
                    MINUTE: "Λεπτά",
                    HOUR: "Ώρες",
                    DAY: "Μέρες",
                    MONTH: "Μήνες",
                    YEAR: "Χρόνια"
                },
                "notOptional": "Αυτό το πεδίο δεν είναι προαιρετικό",
                "disallowValue": "Μη επιτρεπτή τιμή: {0}",
                "invalidValueOfEnum": "Το πεδίο πρέπει να περιέχει μία από τις ακόλουθες τιμές: {0}. [{1}]",
                "notEnoughItems": "Ο ελάχιστος αριθμός εγγραφών είναι {0}",
                "tooManyItems": "Ο μέγιστος αριθμός εγγραφών είναι {0}",
                "valueNotUnique": "Οι τιμές δεν είναι μοναδικές",
                "notAnArray": "Δεν υπάρχουν εγγραφές",
                "invalidDate": "Λάθος μορφή ημερομηνίας: {0}",
                "invalidEmail": "Μη έγκυρο email",
                "stringNotAnInteger": "Δεν είναι ακέραιος",
                "invalidIPv4": "Μη έγκυρη IPv4 διεύθυνση",
                "stringValueTooSmall": "Το ελάχιστο πλήθος χαρακτήρων είναι {0}",
                "stringValueTooLarge": "Το μέγιστο πλήθος χαρακτήρων είναι {0}",
                "stringValueTooSmallExclusive": "Απαιτούνται περισσότεροι χαρακτήες από {0}",
                "stringValueTooLargeExclusive": "Απαιτούνται λιγότεροι χαρακτήρες από {0}",
                "stringDivisibleBy": "Η τιμή πρέπει να είναι πολλαπλάσιο του {0}",
                "stringNotANumber": "Η τιμή δεν είναι αριθμός",
                "invalidPassword": "Μη έγκυρο password",
                "invalidPhone": "Μη έγκυρος αριθμός τηλεφώνου",
                "invalidPattern": "Αυτό το πεδίο δεν έχει την απαιτούμενη μορφή {0}",
                "stringTooShort": "Το πεδίο πρέπει να έχει τουλάχιστον {0} χαρακτήρες",
                "stringTooLong": "Το πεδίο μπορεί να έχει το πολύ {0} χαρακτήρες"
            }
		}
	});

})(jQuery);

(function($) {

	// spanish - spain

	var Alpaca = $.alpaca;

	Alpaca.registerView ({
		"id": "base",
		"messages": {
			"es_ES": {
				required: "Este campo es obligatorio",
				invalid: "Este campo es inválido",
				months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
				timeUnits: {
					SECOND: "segundos",
					MINUTE: "minutos",
					HOUR: "horas",
					DAY: "días",
					MONTH: "meses",
					YEAR: "años"
				},
				"notOptional": "Este campo no es opcional.",
				"disallowValue": "{0} son los valores rechazados.",
				"invalidValueOfEnum": "Este campo debe tener uno de los valores adentro {0}. [{1}]",
				"notEnoughItems": "El número mínimo de artículos es {0}",
				"tooManyItems": "El número máximo de artículos es {0}",
				"valueNotUnique": "Los valores no son únicos",
				"notAnArray": "Este valor no es un arsenal",
				"invalidDate": "Fecha inválida para el formato {0}",
				"invalidEmail": "Email address inválido, ex: info@cloudcms.com",
				"stringNotAnInteger": "Este valor no es un número entero.",
				"invalidIPv4": "Dirección inválida IPv4, ex: 192.168.0.1",
				"stringValueTooSmall": "El valor mínimo para este campo es {0}",
				"stringValueTooLarge": "El valor máximo para este campo es {0}",
				"stringValueTooSmallExclusive": "El valor de este campo debe ser mayor que {0}",
				"stringValueTooLargeExclusive": "El valor de este campo debe ser menos que {0}",
				"stringDivisibleBy": "El valor debe ser divisible cerca {0}",
				"stringNotANumber": "Este valor no es un número.",
				"invalidPassword": "Contraseña inválida",
				"invalidPhone": "Número de teléfono inválido, ex: (123) 456-9999",
				"invalidPattern": "Este campo debe tener patrón {0}",
				"stringTooShort": "Este campo debe contener por lo menos {0} números o caracteres",
				"stringTooLong": "Este campo debe contener a lo más {0} números o caracteres",
				"noneLabel": "Ninguno",
				"addItemButtonLabel": "Añadir",
				"addButtonLabel": "Añadir",
				"removeButtonLabel": "Quitar",
				"upButtonLabel": "Arriba",
				"downButtonLabel": "Abajo"
			}
        }
	});

})(jQuery);

(function($) {

	// finnish - finland

	var Alpaca = $.alpaca;

	Alpaca.registerView ({
		"id": "base",
		"messages": {
            "fi_FI": {
                required: "Kenttä on pakollinen",
                invalid: "Syöte on virheellinen",
                months: ["Tammikuu", "Helmikuu", "Maaliskuu", "Huhtikuu", "Toukokuu", "Kesäkuu", "Heinäkuu", "Elokuu", "Syyskuu", "Lokakuu", "Marraskuu", "Joulukuu"],
                timeUnits: {
                    SECOND: "sekuntia",
                    MINUTE: "minuuttia",
                    HOUR: "tuntia",
                    DAY: "päivää",
                    MONTH: "kuukautta",
                    YEAR: "vuotta"
                },
                "notOptional": "Tämä kenttä on pakollinen",
                "disallowValue": "Seuraavat syötteet eivät ole sallittuja: {0}",
                "invalidValueOfEnum": "Kentän pitää sisältää yksi seuraavista arvoista: {0}. [{1}]",
                "notEnoughItems": "Pienin sallittu määrä arvoja on {0}",
                "tooManyItems": "Suurin sallittu määrä arvoja on {0}",
                "valueNotUnique": "Syötetyt arvot eivät ole uniikkeja",
                "notAnArray": "Syöte ei ole lista",
                "invalidDate": "Virheellinen päivämäärämuoto: {0}",
                "invalidEmail": "Virheellinen sähköpostiosoite",
                "stringNotAnInteger": "Arvo ei ole kokonaisluku",
                "invalidIPv4": "Virheellinen IPv4-osoite",
                "stringValueTooSmall": "Pienin sallittu arvo on {0}",
                "stringValueTooLarge": "Suurin sallittu arvo on {0}",
                "stringValueTooSmallExclusive": "Arvon pitää olla suurempi kuin {0}",
                "stringValueTooLargeExclusive": "Arvon pitää olla pienempi kuin {0}",
                "stringDivisibleBy": "Luvun pitää olla jaollinen luvulla {0}",
                "stringNotANumber": "Syöte ei ole luku",
                "invalidPassword": "Virheellinen salasana",
                "invalidPhone": "Virheellinen puhelinnumero",
                "invalidPattern": "Syötteen täytyy olla seuraavassa muodossa: {0}",
                "stringTooShort": "Syötteen minimipituus on {0} merkkiä",
                "stringTooLong": "Syötteen maksimipituus on {0} merkkiä",
                "addItemButtonLabel": "Lisää arvo",
                "addButtonLabel": "Lisää",
                "removeButtonLabel": "Poista",
                "upButtonLabel": "Ylös",
                "downButtonLabel": "Alas"
            }
		}
	});

})(jQuery);

(function($) {

	// french - france

	var Alpaca = $.alpaca;

	Alpaca.registerView ({
		"id": "base",
		"messages": {
			"fr_FR": {
				required: "Ce champ est requis",
				invalid: "Ce champ est invalide",
				months: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
				timeUnits: {
					SECOND: "secondes",
					MINUTE: "minutes",
					HOUR: "heures",
					DAY: "jours",
					MONTH: "mois",
					YEAR: "années"
				},
				"notOptional": "Ce champ n'est pas optionnel.",
				"disallowValue": "{0} sont des valeurs interdites.",
				"invalidValueOfEnum": "Ce champ doit prendre une des valeurs suivantes : {0}. [{1}]",
				"notEnoughItems": "Le nombre minimum d'éléments est {0}",
				"tooManyItems": "Le nombre maximum d'éléments est {0}",
				"valueNotUnique": "Les valeurs sont uniques",
				"notAnArray": "Cette valeur n'est pas une liste",
				"invalidDate": "Cette date ne correspond pas au format {0}",
				"invalidEmail": "Adresse de courriel invalide, ex: info@cloudcms.com",
				"stringNotAnInteger": "Cette valeur n'est pas un nombre entier.",
				"invalidIPv4": "Adresse IPv4 invalide, ex: 192.168.0.1",
				"stringValueTooSmall": "La valeur minimale pour ce champ est {0}",
				"stringValueTooLarge": "La valeur maximale pour ce champ est {0}",
				"stringValueTooSmallExclusive": "La valeur doit-être supérieure à {0}",
				"stringValueTooLargeExclusive": "La valeur doit-être inférieure à {0}",
				"stringDivisibleBy": "La valeur doit-être divisible par {0}",
				"stringNotANumber": "Cette valeur n'est pas un nombre.",
				"invalidPassword": "Mot de passe invalide",
				"invalidPhone": "Numéro de téléphone invalide, ex: (123) 456-9999",
				"invalidPattern": "Ce champ doit correspondre au motif {0}",
                "stringTooShort": "Ce champ doit contenir au moins {0} caractères",
                "stringTooLong": "Ce champ doit contenir au plus {0} caractères"
            }
        }
    });

})(jQuery);

(function($) {

	// croatian - croatia

	var Alpaca = $.alpaca;

	Alpaca.registerView ({
		"id": "base",
		"messages": {
			"hr_HR": {
				required: "Polje je obavezno",
				invalid: "Pogrešna vrijednost",
				months: ["Siječanj", "Veljača", "Ožujak", "Travanj", "Svibanj", "Lipanj", "Srpanj", "Kolovoz", "Rujan", "Listopad", "Studeni", "Prosinac"],
				timeUnits: {
					SECOND: "sekunda",
					MINUTE: "minuta",
					HOUR: "sati",
					DAY: "dan",
					MONTH: "mjesec",
					YEAR: "godina"
				},
				"notOptional": "Polje nije opciono.",
				"disallowValue": "{0} vrijednost nije dozvoljena.",
				"invalidValueOfEnum": "Moguće vrijednosti : {0}. [{1}]",
				"notEnoughItems": "Odaberite najmanje {0}",
				"tooManyItems": "Odaberite najviše {0}",
				"valueNotUnique": "Vrijednost nije jedinstvena",
				"notAnArray": "Vrijednost nije popis",
				"invalidDate": "Datum nije u formatu {0}",
				"invalidEmail": "E-mail adresa nije u ispravnom formatu, npr: ime.prezime@internet.com",
				"stringNotAnInteger": "Vrijednost nije cijeli broj.",
				"invalidIPv4": "IPv4 adresa nije ispravna, npr: 192.168.0.1",
				"stringValueTooSmall": "Vrijednost je ispod dopuštenog {0}",
				"stringValueTooLarge": "Vrijednost je iznad dopuštenog {0}",
				"stringValueTooSmallExclusive": "Vrijednost mora biti veća od {0}",
				"stringValueTooLargeExclusive": "Vrijednost mora biti manja od {0}",
				"stringDivisibleBy": "Vrijednost mora biti djeljiva sa {0}",
				"stringNotANumber": "Vrijednost nije broj.",
				"invalidPassword": "Neispravna lozinka",
				"invalidPhone": "Telefon nije ispravan, npr: (123) 456-9999",
				"invalidPattern": "Pogrešan uzorak {0}",
                "stringTooShort": "Polje mora imati namjanje {0} znakova",
                "stringTooLong": "Polje mora imati najviše {0} znakova"
            }
        }
    });

})(jQuery);

(function($) {

	// italian - italy

	var Alpaca = $.alpaca;

	Alpaca.registerView ({
		"id": "base",
		"messages": {
			"it_IT": {
				required: "Questo campo è obbligatorio",
				invalid: "Questo campo è invalido",
				months: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
				timeUnits: {
					SECOND: "secondi",
					MINUTE: "minuti",
					HOUR: "ore",
					DAY: "giorni",
					MONTH: "mesi",
					YEAR: "anni"
				},
				"notOptional": "Questo campo non è opzionale",
				"disallowValue": "{0} sono valori invalidi",
				"invalidValueOfEnum": "Questo campo deve avere uno dei seguenti valori {0} (valore attuale: {1})",
				"notEnoughItems": "Il numero minimo di elementi richiesti è {0}",
				"tooManyItems": "Il numero massimo di elementi ammessi è {0}",
				"valueNotUnique": "I valori non sono univoci",
				"notAnArray": "Questo valore non è di tipo array",
				"invalidDate": "Data invalida per il formato {0}",
				"invalidEmail": "Indirizzo email invalido, si attendono valori del tipo: info@cloudcms.com",
				"stringNotAnInteger": "Questo valore non è un numero intero",
				"invalidIPv4": "Indirizzo IPv4 invalido, si attendono valori del tipo: 192.168.0.1",
				"stringValueTooSmall": "Il valore minimo per questo campo è {0}",
				"stringValueTooLarge": "Il valore massimo per questo campo è {0}",
				"stringValueTooSmallExclusive": "Il valore di questo campo deve essere maggiore di {0}",
				"stringValueTooLargeExclusive": "Il valore di questo campo deve essere minore di {0}",
				"stringDivisibleBy": "Il valore di questo campo deve essere divisibile per {0}",
				"stringNotANumber": "Questo valore non è un numero",
				"invalidPassword": "Password invalida",
				"invalidPhone": "Numero di telefono invalido, si attendono valori del tipo: (123) 456-9999",
				"invalidPattern": "Questo campo deve avere la seguente struttura: {0}",
				"stringTooShort": "Questo campo non deve contenere meno di {0} caratteri",
				"stringTooLong": "Questo campo non deve contenere più di {0} caratteri",
				"noneLabel": "Nessuno",
				"addItemButtonLabel": "Aggiungi",
				"addButtonLabel": "Aggiungi",
				"removeButtonLabel": "Rimuovi",
				"upButtonLabel": "Su",
				"downButtonLabel": "Giù"
			}
		}
	});

})(jQuery);

(function($) {

    // japanese - japan

    var Alpaca = $.alpaca;

    Alpaca.registerView ({
        "id": "base",
        "messages": {
            "ja_JP": {
                required: "この項目は必須です",
                invalid: "この項目は正しい値ではありません",
                months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
                timeUnits: {
                    SECOND: "秒",
                    MINUTE: "分",
                    HOUR: "時",
                    DAY: "日",
                    MONTH: "月",
                    YEAR: "年"
                },
                "notOptional": "この項目は任意の回答項目ではありません",
                "disallowValue": "{0} は禁止されている値です",
                "invalidValueOfEnum": "この項目は {0} の中から選ばなければなりません。現在の値は {1} です",
                "notEnoughItems": "項目数は {0} 以上必要です",
                "tooManyItems": "項目数は {0} 以下でなければなりません",
                "valueNotUnique": "値が一意ではありません",
                "notAnArray": "この項目の値が配列でありません",
                "stringValueTooSmall": "この項目の最小値は {0} です",
                "stringValueTooLarge": "この項目の最大値は {0} です",
                "stringValueTooSmallExclusive": "この項目の値は {0} より小さくなければなりません",
                "stringValueTooLargeExclusive": "この項目の値は {0} より大きくなければなりません",
                "stringDivisibleBy": "値は {0} によって割り切れなければなりません",
                "stringNotANumber": "この項目の値が数値ではありません",
                "stringValueNotMultipleOf": "値が {0} の倍数ではありません",
                "stringNotAnInteger": "この項目の値が整数ではありません",
                "stringNotAJSON": "値が正しい JSON 形式の文字列ではありません",
                "stringTooShort": "この項目は {0} 文字以上必要です",
                "stringTooLong": "この項目は {0} 文字以下でなければなりません",
                "invalidTime": "時間が正しくありません",
                "invalidDate": "日付が {0} ではありません",
                "invalidEmail": "メールアドレスが正しくありません。例えば info@cloudcms.com のような形式です",
                "invalidIPv4": "IPv4 アドレスが正しくありません。例えば 192.168.0.1 のような形式です",
                "invalidPassword": "パスワードが正しくありません",
                "invalidPhone": "電話番号が正しくありません。例えば (123) 456-9999 のような形式です",
                "invalidPattern": "この項目は {0} のパターンでなければなりません",
                "invalidURLFormat": "URL が正しい形式ではありません",
                "keyMissing": "地図が空のキーを含んでいます",
                "keyNotUnique": "地図のキーが一意ではありません",
                "ObjecttooFewProperties": "プロパティが足りません ({0} が必要です)",
                "tooManyProperties": "プロパティ ({0}) の最大数を超えています",
                "wordLimitExceeded": "{0} の単語数の制限を超えています",
                "editorAnnotationsExist": "エディタが修正すべきエラーを報告しています",
                "invalidZipcodeFormatFive": "5桁の Zipcode (#####) ではありません",
                "invalidZipcodeFormatNine": "9桁の Zipcode (#####-####) ではありません"
            }
        }
    });

})(jQuery);

(function($) {

	// norwegian - norway

	var Alpaca = $.alpaca;

	Alpaca.registerView ({
		"id": "base",
		"messages": {
            "nb_NO": {
                required: "Feltet er obligatorisk",
                invalid: "Verdien er ugyldig",
                months: ["Januar", "Februar", "Mars", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember"],
                timeUnits: {
                    SECOND: "Sekunder",
                    MINUTE: "Minutter",
                    HOUR: "Timer",
                    DAY: "Dager",
                    MONTH: "Måneder",
                    YEAR: "År"
                },
                "notOptional": "Dette feltet er obligatorisk",
                "disallowValue": "Denne verdien er ikke tillatt: {0}",
                "invalidValueOfEnum": "Feltet må inneholde en av følgende verdier: {0}. Nåværende verdi er: {1}",
                "notEnoughItems": "Det minste tillatte antallet elementer er {0}",
                "tooManyItems": "Det største tillatte antallet elementer er {0}",
                "valueNotUnique": "Verdiene er ikke unike",
                "notAnArray": "Ikke en liste av verdier",
                "invalidDate": "Ugyldig datoformat: {0}",
                "invalidEmail": "Ugyldig e-postadresse",
                "stringNotAnInteger": "Verdien er ikke et heltall",
                "invalidIPv4": "Ugyldig IPv4-adresse",
                "stringValueTooSmall": "Den minste tillatte verdien er {0}",
                "stringValueTooLarge": "Den største tillatte verdien er {0}",
                "stringValueTooSmallExclusive": "Verdien må være større enn {0}",
                "stringValueTooLargeExclusive": "Verdien må være mindre enn {0}",
                "stringDivisibleBy": "Tallet må være delbart med {0}",
                "stringNotANumber": "Verdien er ikke et tall",
                "invalidPassword": "Ugyldig passord",
                "invalidPhone": "Ugyldig telefonnummer",
                "invalidPattern": "Feltet må være i følgende format: {0}",
                "stringTooShort": "Dette feltet må minst inneholde {0} tegn",
                "stringTooLong": "Dette feltet kan maks inneholde {0} tegn"
            }
		}
	});

})(jQuery);

(function($) {

	// dutch - belgium

	var Alpaca = $.alpaca;

	Alpaca.registerView ({
		"id": "base",
		"messages": {
			"nl_BE": {
				required: "Dit veld is verplicht",
				invalid: "Dit veld is ongeldig",
				months: ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "July", "Augustus", "September", "Oktober", "November", "December"],
				timeUnits: {
					SECOND: "seconden",
					MINUTE: "minuten",
					HOUR: "uren",
					DAY: "dagen",
					MONTH: "maanden",
					YEAR: "jaren"
				},
				"notOptional": "Dit veld is niet optioneel.",
				"disallowValue": "{0} zijn verboden waarden.",
				"invalidValueOfEnum": "Dit veld moet één van volgende bevatten : {0}. [{1}]",
				"notEnoughItems": "Het minimum aantal elementen is {0}",
				"tooManyItems": "Het maximum aantal elementen is {0}",
				"valueNotUnique": "De waarden zijn uniek",
				"notAnArray": "Deze waarde is geen lijst",
				"invalidDate": "De datum komt niet overeen met formaat {0}",
				"invalidEmail": "Ongeldig e-mailadres, vb.: info@cloudcms.com",
				"stringNotAnInteger": "Deze waarde is geen geheel getal.",
				"invalidIPv4": "Ongeldig IPv4 adres, vb.: 192.168.0.1",
				"stringValueTooSmall": "De minimale waarde voor dit veld is {0}",
				"stringValueTooLarge": "De maximale waarde voor dit veld is {0}",
				"stringValueTooSmallExclusive": "De waarde moet groter zijn dan {0}",
				"stringValueTooLargeExclusive": "De waarde moet kleiner zijn dan {0}",
				"stringDivisibleBy": "De waarde moet deelbaar zijn door {0}",
				"stringNotANumber": "Deze waarde is geen getal.",
				"invalidPassword": "Ongeldig wachtwoord",
				"invalidPhone": "Ongeldig telefoonnummer, vb: (123) 456-9999",
				"invalidPattern": "Dit veld moet overeenkomen met patroon {0}",
                "stringTooShort": "Dit veld moet minstens {0} tekens bevatten",
                "stringTooLong": "Dit veld moet minder dan {0} tekens bevatten"
            }
        }
    });

})(jQuery);

(function($) {

    // polish - poland

    var Alpaca = $.alpaca;

    Alpaca.registerView ({
        "id": "base",
        "messages": {
            "pl_PL": {
                required: "To pole jest wymagane",
                invalid: "To pole jest nieprawidłowe",
                months: ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"],
                timeUnits: {
                    SECOND: "sekundy",
                    MINUTE: "minuty",
                    HOUR: "godziny",
                    DAY: "dni",
                    MONTH: "miesiące",
                    YEAR: "lata"
                },
                "notOptional": "To pole nie jest opcjonalne",
                "disallowValue": "Ta wartość nie jest dozwolona: {0}",
                "invalidValueOfEnum": "To pole powinno zawierać jedną z następujących wartości: {0}. [{1}]",
                "notEnoughItems": "Minimalna liczba elementów wynosi {0}",
                "tooManyItems": "Maksymalna liczba elementów wynosi {0}",
                "valueNotUnique": "Te wartości nie są unikalne",
                "notAnArray": "Ta wartość nie jest tablicą",
                "invalidDate": "Niepoprawny format daty: {0}",
                "invalidEmail": "Niepoprawny adres email, n.p.: info@cloudcms.com",
                "stringNotAnInteger": "Ta wartość nie jest liczbą całkowitą",
                "invalidIPv4": "Niepoprawny adres IPv4, n.p.: 192.168.0.1",
                "stringValueTooSmall": "Minimalna wartość dla tego pola wynosi {0}",
                "stringValueTooLarge": "Maksymalna wartość dla tego pola wynosi {0}",
                "stringValueTooSmallExclusive": "Wartość dla tego pola musi być większa niż {0}",
                "stringValueTooLargeExclusive": "Wartość dla tego pola musi być mniejsza niż {0}",
                "stringDivisibleBy": "Wartość musi być podzielna przez {0}",
                "stringNotANumber": "Wartość nie jest liczbą",
                "invalidPassword": "Niepoprawne hasło",
                "invalidPhone": "Niepoprawny numer telefonu, n.p.: (123) 456-9999",
                "invalidPattern": "To pole powinno mieć format {0}",
                "stringTooShort": "To pole powinno zawierać co najmniej {0} znaków",
                "stringTooLong": "To pole powinno zawierać najwyżej {0} znaków"
            }
        }
    });

})(jQuery);
(function($) {

    // portuguese - portugal

    var Alpaca = $.alpaca;

    Alpaca.registerView ({
        "id": "base",
        "messages": {
            "pt_BR": {
                required: "Este campo é obrigatório",
                invalid: "Este campo é inválido",
                months: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
                timeUnits: {
                    SECOND: "segundos",
                    MINUTE: "minutos",
                    HOUR: "horas",
                    DAY: "dias",
                    MONTH: "meses",
                    YEAR: "anos"
                },
                "notOptional": "Este campo não é opcional",
                "disallowValue": "{0} são valores proibidos",
                "invalidValueOfEnum": "Este campo deve ter um dos seguintes valores: {0}. [{1}]",
                "notEnoughItems": "O número mínimo de elementos é {0}",
                "tooManyItems": "O número máximo de elementos é {0}",
                "valueNotUnique": "Os valores não são únicos",
                "notAnArray": "Este valor não é uma lista",
                "invalidDate": "Esta data não tem o formato {0}",
                "invalidEmail": "Endereço de e-mail inválido",
                "stringNotAnInteger": "Este valor não é um número inteiro",
                "invalidIPv4": "Endereço IPv4 inválido, ex: 192.168.0.1",
                "stringValueTooSmall": "O valor mínimo para este campo é {0}",
                "stringValueTooLarge": "O valor máximo para este campo é {0}",
                "stringValueTooSmallExclusive": "O valor deste campo deve ser maior que {0}",
                "stringValueTooLargeExclusive": "O valor deste campo deve ser menor que {0}",
                "stringDivisibleBy": "O valor deve ser divisível por {0}",
                "stringNotANumber": "Este valor não é um número",
                "invalidPassword": "Senha inválida",
                "invalidPhone": "Número de telefone inválido, ex: (123) 456-9999",
                "invalidPattern": "Este campo deve ter o padrão {0}",
                "stringTooShort": "Este campo deve incluir pelo menos {0} caracteres",
                "stringTooLong": "Este campo pode incluir no máximo {0} caracteres"
            }
        }
    });

})(jQuery);

(function($) {

	// swedish - sweden

	var Alpaca = $.alpaca;

	Alpaca.registerView ({
		"id": "base",
		"messages": {
            "sv_SE": {
                required: "Fältet är obligatoriskt",
                invalid: "Värdet är felaktigt",
                months: ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"],
                timeUnits: {
                    SECOND: "sekunder",
                    MINUTE: "minuter",
                    HOUR: "timmar",
                    DAY: "dagar",
                    MONTH: "månader",
                    YEAR: "år"
                },
                "notOptional": "Detta fält är obligatoriskt",
                "disallowValue": "Dessa värden är inte tillåtna: {0}",
                "invalidValueOfEnum": "Fältet måste innehålla ett av följande värden: {0}. [{1}]",
                "notEnoughItems": "Det minsta tillåtna antalet element är {0}",
                "tooManyItems": "Det största tillåtna antalet element är {0}",
                "valueNotUnique": "Värdena är inte unika",
                "notAnArray": "Inte en lista av värden",
                "invalidDate": "Felaktigt format för datum: {0}",
                "invalidEmail": "Ogiltig e-postadress",
                "stringNotAnInteger": "Värdet är inte ett heltal",
                "invalidIPv4": "Ogiltig IPv4-adress",
                "stringValueTooSmall": "Det minsta tillåtna värdet är {0}",
                "stringValueTooLarge": "Det största tillåtna värdet är {0}",
                "stringValueTooSmallExclusive": "Värdet måste vara större än {0}",
                "stringValueTooLargeExclusive": "Värdet måste vara mindre än {0}",
                "stringDivisibleBy": "Talet måste vara delbart med {0}",
                "stringNotANumber": "Värdet är inte ett tal",
                "invalidPassword": "Ogiltigt lösenord",
                "invalidPhone": "Ogiltigt telefonnummer",
                "invalidPattern": "Fältet måste vara i följande format: {0}",
                "stringTooShort": "Detta fält måste innehålla minst {0} tecken",
                "stringTooLong": "Detta fält får innehålla högst {0} tecken",
                "addItemButtonLabel": "Lägg till element",
                "addButtonLabel": "Lägg till",
                "removeButtonLabel": "Ta bort",
                "upButtonLabel": "Upp",
                "downButtonLabel": "Ner"
            }
		}
	});

})(jQuery);

(function($) {

    // chinese - china

	var Alpaca = $.alpaca;

	Alpaca.registerView ({
		"id": "base",
		"messages": {
			"zh_CN": {
				required: "&#27492;&#22495;&#24517;&#39035;",
				invalid: "&#27492;&#22495;&#19981;&#21512;&#26684;",
				months: ["&#19968;&#26376;", "&#20108;&#26376;", "&#19977;&#26376;", "&#22235;&#26376;", "&#20116;&#26376;", "&#20845;&#26376;", "&#19971;&#26376;", "&#20843;&#26376;", "&#20061;&#26376;", "&#21313;&#26376;", "&#21313;&#19968;&#26376;", "&#21313;&#20108;&#26376;"],
				timeUnits: {
					SECOND: "&#31186;",
					MINUTE: "&#20998;",
					HOUR: "&#26102;",
					DAY: "&#26085;",
					MONTH: "&#26376;",
					YEAR: "&#24180;"
				},
				"notOptional": "&#27492;&#22495;&#38750;&#20219;&#36873;",
				"disallowValue": "&#38750;&#27861;&#36755;&#20837;&#21253;&#25324; {0}.",
				"invalidValueOfEnum": "&#20801;&#35768;&#36755;&#20837;&#21253;&#25324; {0}. [{1}]",
				"notEnoughItems": "&#26368;&#23567;&#20010;&#25968; {0}",
				"tooManyItems": "&#26368;&#22823;&#20010;&#25968; {0}",
				"valueNotUnique": "&#36755;&#20837;&#20540;&#19981;&#29420;&#29305;",
				"notAnArray": "&#19981;&#26159;&#25968;&#32452;",
				"invalidDate": "&#26085;&#26399;&#26684;&#24335;&#22240;&#35813;&#26159; {0}",
				"invalidEmail": "&#20234;&#22969;&#20799;&#26684;&#24335;&#19981;&#23545;, ex: info@cloudcms.com",
				"stringNotAnInteger": "&#19981;&#26159;&#25972;&#25968;.",
				"invalidIPv4": "&#19981;&#26159;&#21512;&#27861;IP&#22320;&#22336;, ex: 192.168.0.1",
				"stringValueTooSmall": "&#26368;&#23567;&#20540;&#26159; {0}",
				"stringValueTooLarge": "&#26368;&#22823;&#20540;&#26159; {0}",
				"stringValueTooSmallExclusive": "&#20540;&#24517;&#39035;&#22823;&#20110; {0}",
				"stringValueTooLargeExclusive": "&#20540;&#24517;&#39035;&#23567;&#20110; {0}",
				"stringDivisibleBy": "&#20540;&#24517;&#39035;&#33021;&#34987; {0} &#25972;&#38500;",
				"stringNotANumber": "&#19981;&#26159;&#25968;&#23383;.",
				"invalidPassword": "&#38750;&#27861;&#23494;&#30721;",
				"invalidPhone": "&#38750;&#27861;&#30005;&#35805;&#21495;&#30721;, ex: (123) 456-9999",
				"invalidPattern": "&#27492;&#22495;&#39035;&#26377;&#26684;&#24335; {0}",
				"stringTooShort": "&#27492;&#22495;&#33267;&#23569;&#38271;&#24230; {0}",
				"stringTooLong": "&#27492;&#22495;&#26368;&#22810;&#38271;&#24230; {0}"
			}
        }
    });

})(jQuery);
