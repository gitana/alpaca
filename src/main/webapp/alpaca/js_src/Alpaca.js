/**
 * Alpaca forms engine for jQuery
 */
(function($) {

    var Alpaca;
    var VERSION = "0.1.0";
    var _makeArray = function(nonarray) { return Array.prototype.slice.call(nonarray); };
    var _isFunction = function( obj ) { return Object.prototype.toString.call(obj) === "[object Function]"; };
    var _isString = function( obj ) { return (typeof obj == "string"); };
    var _isObject =function( obj) { return $.isPlainObject(obj); };
    var _isNumber =function( obj) { return (typeof obj == "number"); };
    var _isBoolean = function(obj) { return (typeof obj == "boolean"); };
    var _isArray = function( obj ) { return Object.prototype.toString.call(obj) === "[object Array]"; };
    var _isUndefined = function(obj) { return (typeof obj  == "undefined"); };
    var _isEmpty = function(obj) { return _isUndefined(obj) || obj == null; };
    
    var _escapeHTML = function(s) {
      return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    };
    var _spliceIn = function(source, splicePoint, splice) {
        return source.substring(0, splicePoint) + splice + source.substring(splicePoint, source.length);
    };

    var _indexOf = function(el, arr, fn) {
        var l=arr.length,i;        
        
        if (!Alpaca.isFunction(fn)) {
			fn = function(elt, arrElt){
				return elt === arrElt;
			};
		}
        
        for (i = 0; i < l; i++) {
			if (fn.call({}, el, arr[i])) {
				return i;
			}
		}
        
        return -1;
    };    

    /**
     * Removes accents from the given string.
     * 
     * @param str
     * @return
     */
    var _removeAccents = function(str){
		return str.replace(/[àáâãäå]/g, "a").replace(/[èéêë]/g, "e").replace(/[ìíîï]/g, "i").replace(/[òóôõö]/g, "o").replace(/[ùúûü]/g, "u").replace(/[ýÿ]/g, "y").replace(/[ñ]/g, "n").replace(/[ç]/g, "c").replace(/[œ]/g, "oe").replace(/[æ]/g, "ae");
	}
    
    /**
     * Compacts an array by removing an null or undefined elements.
     * 
     * @param arr
     * @return
     */
    var _compactArray = function(arr) {
       var n = [], l=arr.length,i;
       for(i = 0 ; i < l ; i++) {
          if( !lang.isNull(arr[i]) && !lang.isUndefined(arr[i]) ) {
             n.push(arr[i]);
          }
       }
       return n;
    };
    
    /**
     * Static method to build a field instance bound to a DOM element.
     * 
     * Alpaca(el)                       Either binds a control using the contents of $(el) or hands back a previously bound control
     * Alpaca(el, data)                 Binds a control to $(el) using the given data.
     * Alpaca(el, data, "<type>")       Binds a control of type "<type>" to $(el) using the given data.
     * 
     * Alpaca(el, data, {               Binds a control to $(el) using the given data and config.
     *    id: <id>                      field id (optional)
     *    type: <type>                  field type (optional)
     *    schema: schema,               field schema (optional)
     *    settings: settings            field configuration (optional)
     * });
     * 
     * Alpaca(el, data, {               Binds a control to $(el) using the given data and config.
     *    id: <id>                      field id (optional)
     *    type: <type>                  field type (optional)
     *    settings: settings            field configuration (optional)
     *     },
     *     schema                            field schema (optional)
     * );
     * 
     * Alpaca(el, data, {               Binds a control to $(el) using the given data and config.
     *    id: <id>                      field id (optional)
     *    type: <type>                  field type (optional)
     *    settings: settings            field configuration (optional)
     *     },
     *     schema,                            field schema (optional)
     *     callback                        callback function 
     * );
     * * @return the alpaca field instance
     */
    Alpaca = function() {
        var args = Alpaca.makeArray(arguments);
        if (args.length == 0) {
            // illegal
            alert("No arguments - no supported");
            return;
        }

        // element is the first argument
        var el = args[0];
        
        // other arguments we may want to figure out
        var data = null;
        var options = null;
        var schema = null;
        
        if (args.length == 1) {
            // hands back the field instance that is bound directly under the specified element
            // var field = Alpaca(el);
            var domElements = $(el).find("SPAN:first");
            
            var field = null;
            for (var i = 0; i < domElements.length; i++){
                var domElement = domElements[i];                
                var fieldId = $(domElement).attr("alpaca-field-id");
                if (fieldId){
                    var _field = Alpaca.fieldInstances[fieldId];
                    if (_field){
                        field = _field;
                    }
                }
            }
            
            if (field != null){
                return field;
            } else {
                // otherwise, grab the data inside the element and use that for the control
                var domData = $(el).html();
                $(el).html("");
                data = domData;
            }
        }

        // figure out the data and options to use
        if (args.length >= 2) {
            // "data" is the second argument
            var data = args[1];
            if (Alpaca.isFunction(data)) {
                alert("Function not supported as data argument");
                return;
            }
            
            if (args.length >= 3) {
                // "options" is the third argument
                if (!Alpaca.isFunction(args[2])) {
                    options = args[2];
                }
                if (args.length >= 4) {
                    // "schema" is the forth argument
                    if (!Alpaca.isFunction(args[3])) {
                        schema = args[3];
                    }
                }
            }
        }
        // assume last parameter is a callback function
        var callback = Alpaca.isFunction(args[args.length-1]) ? args[args.length-1] : null;
        
        // handle special case for null data
        // we assume a text field
        if (Alpaca.isEmpty(data)){
            if (Alpaca.isEmpty(options)){
                data = "";
                options = "text";
            } else if (options && Alpaca.isObject(options)) {
                if (options.config && Alpaca.isObject(options.config)) {
                    data = "";
                    options.config.type = "text";
                }
            }
        }
        
         // container can either be a dom id or a dom element
        if (el) {
            if (Alpaca.isString(el)) {
                el = $("#" + el);
              }
        }
        
        var loadCounter = 0;
            
        // make parallel calls if needed
        // load data                
        if (data && Alpaca.isUri(data)) {
            $.ajax({
                url: data,
                type: "get",
				dataType: "json",
                success: function(jsonDocument){
                    data = jsonDocument;
                    loadCounter++;
                    if (loadCounter == 3) 
                        Alpaca.init(el, data, options,schema,callback);
                },
                error: function(error){
                }
            });
        }
        else {
            loadCounter++;
            if (loadCounter == 3) 
                Alpaca.init(el, data, options,schema,callback);
        }
                                
        // options
        if (options && Alpaca.isUri(options)) {
			$.ajax({
				url: options,
				type: "get",
				dataType: "json",
				success: function(jsonDocument){
					options = jsonDocument;
					loadCounter++;
					if (loadCounter == 3) 
						Alpaca.init(el, data, options, schema, callback);
				},
				error: function(error){
				}
			});
		} else {
			loadCounter++;
			if (loadCounter == 3) 
				Alpaca.init(el, data, options, schema, callback);
		}
        
        // schema     
        if (schema && Alpaca.isUri(schema)) {
			$.ajax({
				//async : false,
				url: schema,
				type: "get",
				dataType: "json",
				success: function(jsonDocument){
					schema = jsonDocument;
					loadCounter++;
					if (loadCounter == 3) 
						Alpaca.init(el, data, options, schema, callback);
				},
				error: function(error){
				}
			});
		} else {
			loadCounter++;
			if (loadCounter == 3) 
				Alpaca.init(el, data, options, schema, callback);
		}
    };
    
    Alpaca.init = function(el, data, options,schema,callback) {
        var field = Alpaca.createFieldInstance(el, data, options,schema);        
        Alpaca.fieldInstances[field.getId()] = field;
        if (callback != null ) {
            callback(field);
        } else {
            field.render();
        }        
    }
    
    /**
     * Internal method for constructing a field instance.
     * 
     * @param el the dom element to act as the container of the constructed field
     * @param data the data to be bound into the field
     * @param options the configuration for the field
     */
    Alpaca.createFieldInstance = function(el, data, options,schema) {
        // make sure options and schema are not empty
        if (options == null) options = {};
        if (schema == null) schema = {};
        // options can be a string that identifies the kind of field to construct (i.e. "text")
        if (options && Alpaca.isString(options)) {
            var fieldType = options;
            options = {};
            options.type = fieldType;
        }        
        if (!options.type) {
			// if nothing passed in, we can try to make a guess based on the type of data
			if (!schema.type) {
				schema.type = Alpaca.getSchemaType(data, schema);
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
            alert("Unable to find field class for type: " + options.type);
            return null;
        }        
        // if we have data, bind it in
        return new fieldClass(el, data, options,schema);
    };
    
    Alpaca.Fields = { };
    
    // core statics
    $.extend(Alpaca, {
        VERSION: VERSION,
        makeArray: _makeArray,

        isFunction: _isFunction,
        isString: _isString,
        isObject: _isObject,
        isNumber: _isNumber,
        isArray: _isArray,
        isBoolean: _isBoolean,
        
        isUndefined: _isUndefined,
        isEmpty: _isEmpty,
        
        spliceIn: _spliceIn,
        compactArray: _compactArray,
        removeAccents: _removeAccents,
        indexOf: _indexOf,
        log: function(msg)
        {
            if (!(typeof console == "undefined"))
            {
                console.log(msg);
            }
        }
    });

    // static methods and properties
    $.extend(Alpaca, 
    {
        uniqueIdCounter: 0,
        
        /**
         * URL to the spacer image.
         */
        spacerUrl: "../images/spacer.gif",
        
        /**
         * Render modes
         */
        MODE_VIEW: "view",
        MODE_EDIT: "edit",
        MODE_CREATE: "create",
        
        /**
         * Field states
         */
        STATE_EMPTY: "empty",
        STATE_REQUIRED: "required",
        STATE_VALID: "valid",
        STATE_INVALID: "invalid",
        
        /**
         * Messages
         */
        messages: {
			empty: "",
			required: "This field is required",
			valid: "",
			invalid: "This field is invalid",
			months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
			timeUnits: {
				SECOND: "seconds",
				MINUTE: "minutes",
				HOUR: "hours",
				DAY: "days",
				MONTH: "months",
				YEAR: "years"
			}
		},
        
        /**
         * Default Field Type to Schema Type Mapping
         */
        defaultSchemaFieldMapping: {},
        /**
         * Registers a view
         */
        registerDefaultSchemaFieldMapping: function(schemaType,fieldType) {
            if (schemaType && fieldType) {
                this.defaultSchemaFieldMapping[schemaType] = fieldType;
            }
        },
        /**
         * Default Field Type to Schema Type Mapping
         */
        defaultFormatFieldMapping: {},
        /**
         * Registers a view
         */
        registerDefaultFormatFieldMapping: function(format,fieldType) {
            if (format && fieldType) {
                this.defaultFormatFieldMapping[format] = fieldType;
            }
        },
        /**
         * Gets schema type based on data type
         */
        getSchemaType: function (data,schema) {
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

        },                 
        /**
         * Views
         */        
        views: {},
        
        /**
         * Registers a view
         */
        registerView: function(type, view) {
			if (this.views[type]) {
				var oldView = this.views[type];
				if (view.description) {
					oldView[type] = view.description;
				}
				if (view.templates) {
					for (var templateKey in view.templates) {
						if (!oldView.templates) {
							oldView.templates = {};
						}
						if (!oldView.templates[templateKey]) {
							oldView.templates[templateKey] = {};
						}
						Alpaca.merge(oldView.templates[templateKey], view.templates[templateKey]);
					}
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
		},
        
        defaultView : "DEFAULT",
        
        defaultMode : "edit",
        
        /**
         * Gets view with given type
         */
        getView: function(type){
			if (type && this.views.hasOwnProperty(type)) {
				return this.views[type];
			} else {
				return this.views[this.defaultView];
			}
		},
        
        /**
         * Sets default template type
         */
        setDefaultView: function(type){
			if (type && this.views.hasOwnProperty(type)) {
				this.defaultView = type;
			}
		},
        
       /**
        * Returns the template for given id, type, mode and field
        */
	    getTemplate: function(templateId, field, viewType, mode) {
			if (!mode) {
				mode = this.defaultMode;
			}
			if (mode != Alpaca.MODE_CREATE) {
				return this._getTemplate(templateId, field, viewType, mode);
			} else {
				var template = this._getTemplate(templateId, field, viewType, mode);
				if (!template) {
					template = this._getTemplate(templateId, field, viewType, Alpaca.MODE_EDIT);
				}
				return template;
			}
		},
		
		/**
         * Internal methods for returing the template for given id, type, mode and field
         */
        _getTemplate: function(templateId, field, viewType, mode) {
			if (!mode) {
				mode = this.defaultMode;
			}
			if (field && field.settings && field.settings.templates && field.settings.templates[mode] && field.settings.templates[mode][templateId]) {
				return field.settings.templates[mode][templateId];
			} else {
				var view = this.getView(viewType);
				
				var templates = view.templates[mode];
				
				if (templates && templates[templateId]) {
					return templates[templateId];
				} else {
					if (view && view.parent) {
						return this._getTemplate(templateId, field, view.parent, mode);
					} else {
						return null;
					}
				}
			}
		},
        
        /**
         * Registers a new template with given id, type and mode
         */
        registerTemplate: function(templateId, template, viewType, mode) {
			var view = this.getView(viewType);
			
			if (!view) {
				if (viewType) {
					view = this.views[viewType] = {};
				} else {
					view = this.views[this.defaultView] = {};
				}
			}
			if (view) {
				if (!view.templates) {
					view.templates = {};
				}
				if (!mode) {
					mode = this.defaultMode;
				}
				
				if (!view.templates[mode]) {
					view.templates[mode] = {};
				}
				view.templates[mode][templateId] = template;								
			}
		},

        /**
         * Registers templates with given type and mode
         */
        registerTemplates: function(templates, viewType, mode) {
			for (var templateId in templates) {
				this.registerTemplate(templateId, templates[templateId], viewType, mode);
			}
		},
                        
        /**
         * Returns the message for given id, type and field
         */
        getMessage: function(messageId, field, viewType) {
			if (field && field.settings && field.settings.messages && field.settings.messages[messageId]) {
				return field.settings.messages[messageId];
			} else {
				var view = this.getView(viewType);
				if (view.messages[messageId]) {
					return view.messages[messageId];
				} else {
					if (view && view.parent) {
						return this.getMessage(messageId, field, view.parent);
					} else {
						return null;
					}
				}
			}
		},
        
        /**
         * Registers a message for for given id, type and field
         */
        registerMessage: function(messageId, message, viewType, mode) {
			var view = this.getView(viewType);
			
			if (!view) {
				if (viewType) {
					this.views[viewType] = {};
					view = this.views[viewType];
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
         * Registers messages for given type and field
         */
        registerMessages: function(messages, viewType, mode) {
			for (var messageId in messages) {
				if (messages.hasOwnProperty(messageId)) {
					this.registerMessage(messageId, messages[messageId], viewType, mode);
				}
			}
		},
        
        /**
         * Default Class for Field Level Template
         */
        fieldTemplatePostfix: {
			"fieldMessageContainer" : "-field-message-container",
            "controlFieldLabel" : "-field-label",
            "controlFieldContainer":"-field-container",
            "controlFieldHelper":"-field-helper",
            "fieldOuterEl":"-field",
            "fieldSetLegend" : "-fieldset-legend",
            "itemsContainer":"-items-container",
            "fieldSetHelper":"-fieldset-helper",
            "fieldSetOuterEl":"-fieldset",
            "formButtonsContainer":"-form-buttons-container",
            "formFieldsContainer":"-form-fields-container"
        },
        
        /**
         * Processes Field Level Template
         */
        fieldTemplate: function(object, name, wrap) {
			if (!name) 
				name = "controlFieldLabel";
			var template = this.getTemplate(name, object.data);
			if (wrap) {
				if ($('.alpaca' + this.fieldTemplatePostfix[name], $(template)).length == 0) {
					template = $(template).addClass("alpaca" + this.fieldTemplatePostfix[name]).outerHTML();
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
					return label.outerHTML();
				} else {
					return "";
				}
			}
		},        
        /**
         * Date format
         */
        //defaultDateFormat: "m/d/Y",
        defaultDateFormat: "Y-m-d",
        
        /**
         * Useful regular expressions
         */
        regexps:
        {
            email: /^[a-z0-9!\#\$%&'\*\-\/=\?\+\-\^_`\{\|\}~]+(?:\.[a-z0-9!\#\$%&'\*\-\/=\?\+\-\^_`\{\|\}~]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,6}$/i,
            url: /^(http|https):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(\:[0-9]{1,5})?(([0-9]{1,5})?\/.*)?$/i,
            password: /^[0-9a-zA-Z\x20-\x7E]*$/
        },
        
        /**
         * Map of instantiated fields
         */
        fieldInstances: {},
        
        /**
         * Maps field types to field class implementations
         */
        fieldClassRegistry: {},
        
        /**
         * Registers an implementation class for a type of field
         */
        registerFieldClass: function(type, fieldClass) {
			this.fieldClassRegistry[type] = fieldClass;
		},
        
        /**
         * Returns the implementation class for a type of field
         */
        getFieldClass: function(type) {
			return this.fieldClassRegistry[type];
		},
        
        /**
         * Gets the field type id for a given field implementation class 
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
        
        replaceAll: function(text, replace, with_this) {
			return text.replace(new RegExp(replace, 'g'), with_this);
		},
        
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
        
        elementFromTemplate: function(template, substitutions) {
			var html = template;
			
			if (substitutions) {
				for (x in substitutions) {
					html = Alpaca.replaceAll(html, "${" + x + "}", substitutions[x]);
				}
			}
			
			return $(html);
		},
        
        generateId: function()
        {
            Alpaca.uniqueIdCounter++;
            return "alpaca" + Alpaca.uniqueIdCounter;
        },
        
        // helper function to provide YAHOO later like capabilities
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
		}
        
    });

    $.alpaca = window.Alpaca = Alpaca;
    
    /**
     * jQuery friendly method for binding a field to a DOM element.
     * 
     * $(el).alpaca()                       Either binds a control using the contents of $(el) or hands back a previously bound control
     * $(el).alpaca(data)                   Binds a control to $(el) using the given data.
     * $(el).alpaca(data, "<type>")         Binds a control of type <type> to $(el) using the given data.
     * 
     * $(el).alpaca(data, {                 Binds a control to the $(el) using the given data.
     *    id: <id>                          field id (optional)
     *    type: <type>                      field type (optional)
     *    schema: schema,                   field schema (optional)
     *    settings: settings                field settings (optional)
     * });
     * 
     */
    $.fn.alpaca = function() {
		var args = Alpaca.makeArray(arguments);
		
		// append this into the front of args
		var newArgs = [].concat(this, args);
		
		// hand back the field instance
		return Alpaca.apply(this, newArgs);
	};
        
    // helper
    Alpaca.endsWith = function(text, suffix) {
		return text.indexOf(suffix, text.length - suffix.length) !== -1;
	};
    
    Alpaca.startsWith = function(text, prefix) {
		return (text.match("^" + prefix) == prefix);
	};
    
    $.fn.outerHTML = function() {
        return $("<div></div>").append(this.clone()).html();
    }
    
    Alpaca.isUri = function(obj) { 
        return Alpaca.isString(obj) && (Alpaca.startsWith(obj, "http://") ||
                Alpaca.startsWith(obj, "https://") ||
                Alpaca.startsWith(obj, "/") ||
                Alpaca.startsWith(obj, "./")); 
    };
    
    $.fn.swapWith = function(to) {
		return this.each(function() {
			var copy_to = $(to).clone();
			var copy_from = $(this).clone();
			$(to).replaceWith(copy_from);
			$(this).replaceWith(copy_to);
		});
	};

    
    /**
     * Picks a subelement from the given object using the given keys array.
     * 
     * @param object
     * @param keys either an array of tokens or a dot-delimited string (i.e. "data.user.firstname")
     * @param subprop optional subproperty to traverse (i.e.. "data.properties.user.properties.firstname")
     */
    Alpaca.traverseObject = function(object, keys, subprop) {
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
			if (current[key]) {
				current = current[key];
				if (keys.length == 0) {
					element = current;
				}
			} else {
				keys = [];
			}
		} while (keys.length > 0);
		
		return element;
	};
    
    /**
     * Helper function that executes the given function upon each element in the array
     * 
     * @param data either an array or an object
     * 
     * The element of the array becomes the "this" variable in the function
     */
    Alpaca.each = function(data, func) {
		if (Alpaca.isArray(data)) {
			for (var i = 0; i < data.length; i++) {
				func.apply(data[i]);
			}
		} else if (Alpaca.isObject(data)) {
			for (var key in data) {
				func.apply(data[key]);
			}
		}
	};
    
    /**
     * Merges json obj2 into obj1 using a recursive approach
     * 
     * @param validKeyFunction used to determine whether to include a given key
     */
    Alpaca.merge = function(obj1, obj2, validKeyFunction) {
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
	}
    
    Alpaca.cloneObject = function(obj) {
		var clone = {};
		
		for (var i in obj) {
			if (Alpaca.isObject(obj[i])) {
				clone[i] = Alpaca.cloneObject(obj[i]);
			} else {
				clone[i] = obj[i];
			}
		}
		
		return clone;
	};
    
    Alpaca.substituteTokens = function(text, args) {
		for (var i = 0; i < args.length; i++) {
			var token = "{" + i + "}";
			
			var x = text.indexOf(token);
			if (x > -1) {
				var nt = text.substring(0, x) + args[i] + text.substring(x + 3);
				text = nt;
			//text = Alpaca.replaceAll(text, token, args[i]);
			}
		}
		
		return text;
	};
    
})(jQuery);
