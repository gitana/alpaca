/**
 * Alpaca forms engine for jQuery
 */
(function($) {

    var Alpaca;

    /**
     * @namespace Static method to build an Alpaca field instance bound to a DOM element.
     * @description <p>Usage:</p>
     * <p>
     * 1: Binds a control using the contents of $(el) or hands back a previously bound control<br/>
     * <code>
     *     <pre>
     *      Alpaca(el)
     *     </pre>
     * </code>
     * </p>
     * <p>
     * 2: Binds a control to $(el) using the given data (only for non-object types).<br/>
     * <code>
     *     <pre>
     *      Alpaca(el, data)
     *     </pre>
     * </code>
     * </p>
     * <p>
     * 3: Binds a control to $(el) using the given configuration object.<br/>
     * </p>
     * <code>
     *     <pre>
     * Alpaca(el,{
     *   "data" : {Any} field data (optional),
     *   "schema": {Object} field schema (optional),
     *   "options" : {Object} field options (optional),
     *   "view": {Object|String} field view (object or id reference) (optional),
     *   "render": {Function} callback function for replacing default rendering method (optional),
     *   "postRender": {Function} callback function for post-rendering  (optional),
     *   "error": {Function} callback function for error handling  (optional),
     *   "connector": {Alpaca.Connector} connector for retrieving or storing data, schema, options,
     *                view and templates. (optional),
     * });
     *    </pre>
     *</code>
     * @returns {Object} alpaca field instance
     */
    Alpaca = function() {
        var args = Alpaca.makeArray(arguments);
        if (args.length == 0) {
            // illegal
            alert("No arguments - no supported");
            return null;
        }

        // element is the first argument
        var el = args[0];

        // other arguments we may want to figure out
        var data = null;
        var options = null;
        var schema = null;
        var view = null;
        var callback = null;
        var renderedCallback = null;
        var errorCallback = null;
        var connector = null;
        var notTopLevel = false;

        if (args.length == 1) {
            // hands back the field instance that is bound directly under the specified element
            // var field = Alpaca(el);
            var domElements = $(el).find(":first");

            var field = null;
            for (var i = 0; i < domElements.length; i++) {
                var domElement = domElements[i];
                var fieldId = $(domElement).attr("alpaca-field-id");
                if (fieldId) {
                    var _field = Alpaca.fieldInstances[fieldId];
                    if (_field) {
                        field = _field;
                    }
                }
            }

            if (field != null) {
                return field;
            } else {
                // otherwise, grab the data inside the element and use that for the control
                var domData = $(el).html();
                $(el).html("");
                data = domData;
            }
        }

        if (args.length >= 2) {
            if (Alpaca.isObject(args[1])) {
                data = args[1].data;
                schema = args[1].schema;
                options = args[1].options;
                view = args[1].view;
                callback = args[1].render;
                renderedCallback = args[1].postRender;
                errorCallback = args[1].error;
                connector = args[1].connector;
                if (!Alpaca.isEmpty(args[1].notTopLevel)) {
                    notTopLevel = args[1].notTopLevel;
                }
            } else {
                // "data" is the second argument
                data = args[1];
                if (Alpaca.isFunction(data)) {
                    data = data();
                }
            }
        }

        if (Alpaca.isEmpty(errorCallback)) {
            errorCallback = function(error) {
                alert(error.message);
            };
        }

        if (Alpaca.isEmpty(connector)) {
            connector = new Alpaca.Connector('default');
        }

        // handle case for null data
        // if schema exits, we will use the settings from the schema
        // we assume a text field
        if (Alpaca.isEmpty(data)) {
            if (Alpaca.isEmpty(schema) && (Alpaca.isEmpty(options) || Alpaca.isEmpty(options.type))) {
                if (Alpaca.isEmpty(options)) {
                    data = "";
                    options = "text";
                } else if (options && Alpaca.isObject(options)) {
                    data = "";
                    options.type = "text";
                }
            }
        }

        // container can either be a dom id or a dom element
        if (el) {
            if (Alpaca.isString(el)) {
                el = $("#" + el);
            }
        }

        // For second or deeper level of fields, default loader should be the one to do loadAll
        // since schema, data, options and view should have already been loaded.
        // Unless we want to load individual fields (other than the templates) using the provided
        // loader, this should be good enough. The benefit is saving time on loader format checking.

        var loadAllConnector = connector;

        if (notTopLevel) {
            loadAllConnector = new Alpaca.Connector('default');
        }

        loadAllConnector.loadAll({
            "data":data,
            "options": options,
            "schema": schema,
            "view": view
        }, function(loadedData, loadedOptions, loadedSchema, loadedView) {
            return Alpaca.init(el, loadedData, loadedOptions, loadedSchema, loadedView, callback, renderedCallback, connector, errorCallback);
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

    // static methods and properties
    $.extend(Alpaca,
    /** @lends Alpaca */
    {
        /**
         * Version number.
         */
        VERSION: "0.1.0",

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
            return (typeof obj == "string");
        },

        /**
         * Finds whether the type of a variable is object.
         * @param {Any} obj The variable being evaluated.
         * @returns {Boolean} True if the variable is an object, false otherwise.
         */
        isObject: function(obj) {
            return $.isPlainObject(obj);
        },

        /**
         * Finds whether the type of a variable is number.
         * @param {Any} obj The variable being evaluated.
         * @returns {Boolean} True if the variable is a number, false otherwise.
         */
        isNumber: function(obj) {
            return (typeof obj == "number");
        },

        /**
         * Finds whether the type of a variable is array.
         * @param {Any} obj The variable being evaluated.
         * @returns {Boolean} True if the variable is an array, false otherwise.
         */
        isArray: function(obj) {
            return Object.prototype.toString.call(obj) === "[object Array]";
        },

        /**
         * Finds whether the type of a variable is boolean.
         * @param {Any} obj The variable being evaluated.
         * @returns {Boolean} True if the variable is a boolean, false otherwise.
         */
        isBoolean: function(obj) {
            return (typeof obj == "boolean");
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
         * Finds whether a variable is empty.
         * @param {Any} obj The variable being evaluated.
         * @returns {Boolean} True if the variable is empty, false otherwise.
         */
        isEmpty: function(obj) {
            return Alpaca.isUndefined(obj) || obj == null;
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
         * Logs a message.
         *
         * @param {String} msg The message to be logged.
         */
        log: function(msg) {
            if (!(typeof console == "undefined")) {
                console.log(msg);
            }
        },

        /**
         * @private
         * Static counter for generating a unique ID.
         */
        uniqueIdCounter: 0,

        /**
         * Default Locale.
         */
        defaultLocale: "en_US",

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
        getSchemaType: function (data) {
            // map data types to default field types
            if (Alpaca.isEmpty(data)) {
                return "string";
            }
            if (Alpaca.isObject(data)) {
                return "object";
            }
            if (Alpaca.isString(data)) {
                return "string";
            }
            if (Alpaca.isNumber(data)) {
                return "number";
            }
            if (Alpaca.isArray(data)) {
                return "array";
            }
            if (Alpaca.isBoolean(data)) {
                return "boolean";
            }
            // Last check for data that carries functions -- GitanaConnector case.
            if (typeof data == 'object') {
                return "object";
            }
        },

        /**
         * @private
         *
         * Alpaca Views.
         */
        views: {},

        /**
         * @private
         *
         * View ID Prefix.
         */
        viewIdPrefix: "VIEW_",

        /**
         * Validates a view id.
         *
         * @param {String} id View id being validated.
         *
         * @returns {Boolean} True if the view id is valid, false otherwise.
         */
        isValidViewId : function (id) {
            return Alpaca.startsWith(id, this.viewIdPrefix);
        },

        /**
         * Generates a valid view id.
         *
         * @returns {String} A valid unique view id.
         */
        generateViewId : function () {
            return this.viewIdPrefix + "VIEW_" + this.generateId();
        },

        /**
         * Registers a view.
         *
         * @param {Object} view View to be registered.
         */
        registerView: function(view) {
            var type = view.id;
            if (!Alpaca.isEmpty(type) && this.isValidViewId(type)) {
                if (this.views[type]) {
                    var oldView = this.views[type];
                    if (view.description) {
                        oldView["description"] = view.description;
                    }
                    if (view.type) {
                        oldView["type"] = view.type;
                    }
                    if (view.id) {
                        oldView["id"] = view.id;
                    }
                    if (view.templates) {
                        if (!oldView.templates) {
                            oldView.templates = {};
                        }
                        Alpaca.merge(oldView.templates, view.templates);
                    }
                    if (view.messages) {
                        if (!oldView.messages) {
                            oldView.messages = {};
                        }
                        Alpaca.merge(oldView.messages, view.messages);
                    }
                } else {
                    this.views[type] = view;
                }

                // Compile Top-Level Templates
                /*
                 for (var templateId in view.templates) {
                 var template = view.templates[templateId];
                 if (!Alpaca.startsWith(template, view.id) && (templateId != "fieldOuterEl" && templateId != "controlFieldContainer" && templateId != "fieldSetOuterEl" && templateId != "itemsContainer")) {
                 $.template(view.id + "_" + templateId, template);
                 view.templates[templateId] = view.id + "_" + templateId;
                 }
                 }
                 */
                var tmpTemplates = Alpaca.cloneObject(view.templates);
                for (var templateId in tmpTemplates) {
                    var template = view.templates[templateId];
                    if (Alpaca.isString(template) && !Alpaca.startsWith(template, view.id)) {
                        view.templates[view.id + "_" + templateId + "_src"] = template;
                        if (template && !Alpaca.isUri(template)) {
                            $.template(view.id + "_" + templateId, template);
                            view.templates[templateId] = view.id + "_" + templateId;
                        } else {
                            view.templates[templateId] = template;
                        }
                    }
                }

            } else {
                alert("Invalid View ID (must starts with " + this.viewIdPrefix + ")");
            }
            return type;
        },

        /**
         * Default view.
         */
        defaultView : "VIEW_WEB_EDIT",

        /**
         * Gets view for a given id.
         *
         * @param {String}viewId The view id.
         *
         * @returns {Object} The view mapped to the given view id.
         */
        getView: function(viewId) {
            if (viewId && this.views.hasOwnProperty(viewId)) {
                return this.views[viewId];
            } else {
                return this.views[this.defaultView];
            }
        },

        /**
         * Returns view type.
         *
         * @param {Object|String} view view
         * @returns {String} view type
         */
        getViewType: function(view) {
            if (Alpaca.isString(view)) {
                view = this.getView(view);
            }
            if (Alpaca.isObject(view)) {
                if (view.type) {
                    return view.type;
                } else if (view.parent) {
                    return this.getViewType(view.parent);
                } else {
                    return null;
                }
            }
        },

        /**
         * Sets default view as the view with a given id.
         *
         * @param {String} Id of the view being set as default.
         */
        setDefaultView: function(viewId) {
            if (viewId && this.views.hasOwnProperty(viewId)) {
                this.defaultView = viewId;
            }
        },

        /**
         * Registers a template to a view.
         *
         * @param {String} templateId Template id.
         * @param {String} template Template being registered.
         * @param {String} viewId Id of the view that the template being registered to.
         */
        registerTemplate: function(templateId, template, viewId) {
            var view = this.getView(viewId);

            if (!view) {
                if (viewId) {
                    view = this.views[viewId] = {};
                } else {
                    view = this.views[this.defaultView] = {};
                }
            }
            if (view) {
                if (!view.templates) {
                    view.templates = {};
                }
                //view.templates[templateId] = template;
                // Compile Template

                if (template && !Alpaca.isUri(template)) {
                    $.template(view.id + "_" + templateId, template);
                    view.templates[templateId] = view.id + "_" + templateId;
                } else {
                    view.templates[templateId] = template;
                }

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
        registerMessage: function(messageId, message, viewId) {
            var view = this.getView(viewId);

            if (!view) {
                if (viewId) {
                    this.views[viewId] = {};
                    view = this.views[viewId];
                } else {
                    this.views[this.defaultView] = {};
                    view = this.views[this.defaultView];
                }
            }
            if (view) {
                if (!view.messages) {
                    view.messages = {};
                }
                view.messages[messageId] = message;
            }
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
         * @private
         * Default Mappings for Field Level Templates.
         */
        fieldTemplatePostfix: {
            "controlFieldMessageContainer" : "-controlfield-message-container",
            "controlFieldLabel" : "-controlfield-label",
            "controlFieldContainer":"-controlfield-container",
            "controlFieldHelper":"-controlfield-helper",
            /*
             "controlFieldOuterEl":"-controlfield",
             */
            "fieldSetLegend" : "-fieldset-legend",
            "fieldSetItemsContainer":"-fieldset-items-container",
            "fieldSetHelper":"-fieldset-helper",
            "fieldSetOuterEl":"-fieldset",
            "formButtonsContainer":"-form-buttons-container",
            "formFieldsContainer":"-form-fields-container"
        },

        /**
         * @private
         * Processes field level template.
         *
         * @param {String} object Object that the template is applied to.
         * @param {String} name Template id.
         * @param {Boolean} wrap True if we want the template as a wrapper, false otherwise.
         *
         * @returns {Object} Object rendered by field level template.
         */
        fieldTemplate: function(object, name, wrap) {
            if (!name)
                name = "controlFieldLabel";
            var template = this.getTemplate(name, object.data);
            if (wrap) {
                if (this.getTemplate(template + "_src", object.data)) {
                    template = this.getTemplate(template + "_src", object.data);
                }
                if ($('.alpaca' + this.fieldTemplatePostfix[name], $(template)).length == 0) {
                    if (this.fieldTemplatePostfix[name]) {
                        template = $(template).addClass("alpaca" + this.fieldTemplatePostfix[name]).outerHTML(true);
                    } else {
                        template = $(template).outerHTML(true);
                    }
                }
                return template;
            } else {
                var label = $.tmpl(template, object.data);
                if (label) {
                    if (this.fieldTemplatePostfix[name]) {
                        if ($('.alpaca' + this.fieldTemplatePostfix[name], label).length == 0) {
                            label.addClass("alpaca" + this.fieldTemplatePostfix[name]);
                        }
                        if (!label.attr("id")) {
                            label.attr("id", object.data.id + this.fieldTemplatePostfix[name]);
                        }
                    }
                    return label.outerHTML(true);
                } else {
                    return "";
                }
            }
        },

        /**
         * @private
         *
         * @returns The field template for given id.
         */
        getTemplate: function(templateId, field) {

            var view = field.view;

            if (Alpaca.isObject(view)) {
                var template = this._getTemplate(templateId, view, field.path);
                if (!Alpaca.isEmpty(template)) {
                    return template;
                }
                // Try to see if we can pick up default template
                view = this.defaultView;
            }

            if (Alpaca.isString(view)) {
                view = this.getView(view);
                return this._getTemplate(templateId, view, field.path);
            }
            return null;
        },

        /**
         * @private
         * Internal method for template lookup through view hierarchy.
         *
         * @param {Object} templateId Template id.
         * @param {Object} view View.
         * @param {String} path Template path.
         */
        _getTemplate: function(templateId, view, path) {
            if (view && view.fields && view.fields[path] && view.fields[path].templates && view.fields[path].templates[templateId]) {
                return view.fields[path].templates[templateId];
            }
            if (view && view.templates && view.templates[templateId]) {
                return view.templates[templateId];
            } else {
                if (view && view.parent) {
                    return this._getTemplate(templateId, this.views[view.parent], path);
                } else {
                    return null;
                }
            }
        },


        /**
         * Default date format.
         */
        defaultDateFormat: "mm/dd/yy",

        /**
         * Regular expressions for fields.
         */
        regexps:
        {
            "email": /^[a-z0-9!\#\$%&'\*\-\/=\?\+\-\^_`\{\|\}~]+(?:\.[a-z0-9!\#\$%&'\*\-\/=\?\+\-\^_`\{\|\}~]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,6}$/i,
            "url": /^(http|https):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(\:[0-9]{1,5})?(([0-9]{1,5})?\/.*)?$/i,
            "password": /^[0-9a-zA-Z\x20-\x7E]*$/,
            "date": /^(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.]\d\d$/,
            "integer": /^([\+\-]?([1-9]\d*)|0)$/,
            "number":/^([\+\-]?((([0-9]+(\.)?)|([0-9]*\.[0-9]+))([eE][+-]?[0-9]+)?))$/,
            "phone":/^(\D?(\d{3})\D?\D?(\d{3})\D?(\d{4}))?$/,
            "ipv4":/^(?:1\d?\d?|2(?:[0-4]\d?|[6789]|5[0-5]?)?|[3-9]\d?|0)(?:\.(?:1\d?\d?|2(?:[0-4]\d?|[6789]|5[0-5]?)?|[3-9]\d?|0)){3}$/
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
                    if (this.fieldClassRegistry[type] == fieldClass) {
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
                for (className in classNames) {
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
                for (x in substitutions) {
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
         * @private
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
                }
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
                if (subprop && key == subprop) {
                    key = keys.shift();
                }
                if (!Alpaca.isEmpty(current[key])) {
                    current = current[key];
                    if (keys.length == 0) {
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
         * Merges json obj2 into obj1 using a recursive approach. The merge will include empty values
         * of obj2 properties.
         *
         * @param {Object} obj1 Source object.
         * @param {Object} obj2 Destination object
         *
         * @returns {Object} Merged object
         */
        mergeObject : function(obj1, obj2) {
            if (!obj1) {
                obj1 = {};
            }
            for (var key in obj2) {
                if (!Alpaca.isFunction(obj2[key])) {
                    if (Alpaca.isValEmpty(obj2[key])) {
                        if (!Alpaca.isEmpty(obj1[key])) {
                            obj1[key] = obj2[key];
                        }
                    } else {
                        if (Alpaca.isObject(obj2[key])) {
                            if (!obj1[key]) {
                                obj1[key] = {};
                            }
                            obj1[key] = Alpaca.mergeObject(obj1[key], obj2[key]);
                        } else {
                            obj1[key] = obj2[key];
                        }
                    }
                }
            }
            return obj1;
        },

        /*
        cloneObject : function(obj) {
            var clone = {};

            for (var i in obj) {
                if (Alpaca.isObject(obj[i])) {
                    clone[i] = Alpaca.cloneObject(obj[i]);
                } else {
                    clone[i] = obj[i];
                }
            }

            return clone;
        },
        */
        /**
         * Clones an object.
         *
         * @param {Object} obj Source object
         * @returns {Object} Cloned object
         */
        cloneObject : function(obj) {
            var clone;

            if (Alpaca.isObject(obj)) {
                clone = {};
                for (var i in obj) {
                    if (obj.hasOwnProperty(i)) {
                        if (Alpaca.isObject(obj[i]) || Alpaca.isArray(obj[i])) {
                            clone[i] = Alpaca.cloneObject(obj[i]);
                        } else {
                            clone[i] = obj[i];
                        }
                    }
                }
            } else if (Alpaca.isArray(obj)) {
                clone = [];
                for (var i = 0 ; i < obj.length ; i++) {
                    if (Alpaca.isObject(obj[i]) || Alpaca.isArray(obj[i])) {
                        clone.push(Alpaca.cloneObject(obj[i]));
                    } else {
                        clone.push(obj[i]);
                    }
                }
            } else {
                clone = obj;
            }

            return clone;
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
        compareArrayContent : function(arr_1, arr_2) {
            var equal = arr_1 && arr_2 && (arr_1.length == arr_2.length);
            if (equal) {
                $.each(arr_1, function(foo, val) {
                    if (!equal)
                        return false;
                    if ($.inArray(val, arr_2) == -1) {
                        equal = false;
                    } else {
                        equal = true;
                    }
                });
            }
            return equal;
        },

        /**
         * Finds whether a variable has empty value or not.
         *
         * @param {Any} val Variable to be evaluated.
         * @returns {Boolean} True if the variable has empty value, false otherwise.
         */
        isValEmpty : function(val) {
            var empty = false;
            if (Alpaca.isEmpty(val)) {
                empty = true;
            } else {
                if (Alpaca.isString(val) && val == "") {
                    empty = true;
                }
                if (Alpaca.isObject(val) && $.isEmptyObject(val)) {
                    empty = true;
                }
                if (Alpaca.isArray(val) && val.length == 0) {
                    empty = true;
                }
                if (Alpaca.isNumber(val) && isNaN(val)) {
                    empty = true;
                }
            }
            return empty;
        },

        /**
         * @private
         *
         * Initial function for setting up field instance and executing callbacks if needed.
         *
         * @param {Object} el Container element.
         * @param {Object} data Field data.
         * @param {Object} options Field options.
         * @param {Object} schema Field schema.
         * @param {Object|String} view Field view.
         * @param {Function} callback Render callback.
         * @param {Function} renderedCallback Post-render callback.
         * @param {Alpaca.connector} connector Field connector.
         * @param {Function} errorCallback Error callback.
         *
         * @returns {Alpaca.Field} New field instance.
         */
        init : function(el, data, options, schema, view, callback, renderedCallback, connector, errorCallback) {
            var field = Alpaca.createFieldInstance(el, data, options, schema, view, connector, errorCallback);
            Alpaca.fieldInstances[field.getId()] = field;

            // allow callbacks defined through view
            if (Alpaca.isEmpty(callback)) {
                callback = field.view.render;
            }
            if (Alpaca.isEmpty(renderedCallback)) {
                renderedCallback = field.view.postRender;
            }

            if (callback != null) {
                callback(field, renderedCallback);
            } else {
                field.render(renderedCallback);
            }

            field.callback = callback;
            field.renderedCallback = renderedCallback;

            return field;
        },

        /**
         * @private
         *
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
            if (Alpaca.isValEmpty(options)) options = {};
            if (Alpaca.isValEmpty(schema)) schema = {};
            // options can be a string that identifies the kind of field to construct (i.e. "text")
            if (options && Alpaca.isString(options)) {
                var fieldType = options;
                options = {};
                options.type = fieldType;
            }
            if (!options.type) {
                // if nothing passed in, we can try to make a guess based on the type of data
                if (!schema.type) {
                    schema.type = Alpaca.getSchemaType(data);
                }
                if (schema && schema["enum"]) {
                    if (schema["enum"].length > 3) {
                        options.type = "select";
                    } else {
                        options.type = "radio";
                    }
                } else {
                    options.type = Alpaca.defaultSchemaFieldMapping[schema.type];
                }
                // check if it has format defined
                if (schema.format && Alpaca.defaultFormatFieldMapping[schema.format]) {
                    options.type = Alpaca.defaultFormatFieldMapping[schema.format];
                }
            }
            // find the field class registered for this field type
            var fieldClass = Alpaca.getFieldClass(options.type);
            if (!fieldClass) {
                errorCallback({
                    "message":"Unable to find field class for type: " + options.type,
                    "reason": "FIELD_INSTANTIATION_ERROR"
                });
                return null;
            }
            // if we have data, bind it in
            return new fieldClass(el, data, options, schema, view, connector);
        }
    });

    $.alpaca = window.Alpaca = Alpaca;

    /**
     * jQuery friendly method for binding a field to a DOM element.
     * @ignore
     */
    $.fn.alpaca = function() {
        var args = Alpaca.makeArray(arguments);

        // append this into the front of args
        var newArgs = [].concat(this, args);

        // hand back the field instance
        return Alpaca.apply(this, newArgs);
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
    }

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

    /*
     * Style File - jQuery plugin for styling file input elements
     *
     * Copyright (c) 2007-2009 Mika Tuupola
     *
     * Licensed under the MIT license:
     *   http://www.opensource.org/licenses/mit-license.php
     *
     * Based on work by Shaun Inman
     *   http://www.shauninman.com/archive/2007/09/10/styling_file_inputs_with_css_and_the_dom
     *
     * @ignore
     * */

    $.fn.filestyle = function(options) {

        /* TODO: This should not override CSS. */
        var settings = {
            width: 250
        };

        if (options) {
            $.extend(settings, options);
        }
        ;

        return this.each(function() {

            var self = this;
            var wrapper = $("<div>").addClass('alpaca-filefield-button');

            var filename = $('<input/>').addClass('alpaca-filefield-control').addClass($(self).attr("class"));
            var filenameWidth = filename.width;

            $(self).before(filename);
            $(self).wrap(wrapper);

            $(self).css({
                "position": "relative",
                "height": wrapper.css('height'),
                "width": settings.width + "px",
                "display": "inline",
                "cursor": "pointer",
                "opacity": "0.0"
            });

            if ($.browser.mozilla) {
                if (/Win/.test(navigator.platform)) {
                    $(self).css("margin-left", "-142px");
                } else {
                    $(self).css("margin-left", "-168px");
                }
                ;
            } else {
                $(self).css("margin-left", wrapper.width - filenameWidth + "px");
            }
            ;

            $(self).bind("change", function() {
                filename.val($(self).val());
            });

        });
    };

    /**
     * --------------------------------------------------------------------
     * jQuery customfileinput plugin
     * Author: Scott Jehl, scott@filamentgroup.com
     * Copyright (c) 2009 Filament Group
     * licensed under MIT (filamentgroup.com/examples/mit-license.txt)
     * --------------------------------------------------------------------
     * @ignore
     */
    $.fn.customFileInput = function() {
        return $(this).each(function() {
            //apply events and styles for file input element
            var fileInput = $(this).addClass('alpaca-controlfield-file-custom-input').focus(
                    function() {
                        fileInput.data('val', fileInput.val());
                    }).blur(
                    function() {
                        $(this).trigger('checkChange');
                    }).bind('disable',
                    function() {
                        fileInput.attr('disabled', true);
                        upload.addClass('alpaca-controlfield-file-custom-disabled');
                    }).bind('enable',
                    function() {
                        fileInput.removeAttr('disabled');
                        upload.removeClass('alpaca-controlfield-file-custom-disabled');
                    }).bind('checkChange',
                    function() {
                        if (fileInput.val() && fileInput.val() != fileInput.data('val')) {
                            fileInput.trigger('change');
                        }
                    }).bind('change',
                    function() {
                        //get file name
                        var fileName = $(this).val().split(/\\/).pop();
                        //get file extension
                        var fileExt = 'customfile-ext-' + fileName.split('.').pop().toLowerCase();
                        //update the feedback
                        uploadFeedback.text(fileName).data('fileExt', fileExt); //store file extension for class removal on next change
                        $('.ui-icon', uploadFeedback.parent()).remove();
                        var fileType = fileName.split('.').pop().toLowerCase();
                        var iconClass = 'ui-icon-document';
                        if (fileType == 'jpg' || fileType == 'gif' || fileType == 'png' || fileType == 'jpeg' || fileType == 'bmp') {
                            iconClass = 'ui-icon-image';
                        }
                        if (fileType == 'mp3' || fileType == 'mp4' || fileType == 'swf' || fileType == 'mov' || fileType == 'wav' || fileType == 'm4v') {
                            iconClass = 'ui-icon-video';
                        }
                        if (fileType == 'json' || fileType == 'js') {
                            iconClass = 'ui-icon-script';
                        }
                        uploadFeedback.before('<span class="ui-icon ' + iconClass + '" style="float:left;margin-top:0.3em"></span>');
                    }).click(function() { //for IE and Opera, make sure change fires after choosing a file, using an async callback
                fileInput.data('val', fileInput.val());
                setTimeout(function() {
                    fileInput.trigger('checkChange');
                }, 100);
            });

            //create custom control container
            var upload = $('<div class="ui-widget-header ui-corner-all alpaca-controlfield-file-custom"></div>');
            //create custom control button
            var uploadButton = $('<span class="" aria-hidden="true" style="float:right">Browse...</span>').button({text:true}).appendTo(upload);
            //create custom control feedback
            var uploadFeedback = $('<span class="alpaca-controlfield-file-custom-feedback" aria-hidden="true">No file selected...</span>').appendTo(upload);

            //match disabled state
            if (fileInput.is('[disabled]')) {
                fileInput.trigger('disable');
            }

            //on mousemove, keep file input under the cursor to steal click
            upload.mousemove(
                    function(e) {
                        fileInput.css({
                            'left': e.pageX - upload.offset().left - fileInput.outerWidth() + 20, //position right side 20px right of cursor X)
                            'top': e.pageY - upload.offset().top - $(window).scrollTop() - 3
                        });
                    }).insertAfter(fileInput); //insert after the input
            fileInput.appendTo(upload);
            upload.wrap('<small/>');
        });
    };

})(jQuery);
