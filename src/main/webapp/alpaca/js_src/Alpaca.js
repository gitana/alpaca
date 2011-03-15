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
     *    settings: settings            field configuration (optional)
     * });
     * 
     * Alpaca(el, data, {               Binds a control to $(el) using the given data and config.
     *    id: <id>                      field id (optional)
     *    type: <type>                  field type (optional)
     *    settings: settings            field configuration (optional)
     *  },
     *  schema                          field schema (optional)
     * );
     * 
     * Alpaca(el, data, {               Binds a control to $(el) using the given data and config.
     *    id: <id>                      field id (optional)
     *    type: <type>                  field type (optional)
     *    settings: settings            field configuration (optional)
     *  },
     *  schema,                         field schema (optional)
     *  view                           field view (object or id reference) (optional) 
     * );
     * 
     * Alpaca(el, data, {               Binds a control to $(el) using the given data and config.
     *    id: <id>                      field id (optional)
     *    type: <type>                  field type (optional)
     *    settings: settings            field configuration (optional)
     *  },
     *  schema,                         field schema (optional)
     *  view,                           field view (object or id reference) (optional) 
     *  callback                        callback function (optional)
     * );
     * 
     * @return the alpaca field instance
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

		if (args.length == 2 && Alpaca.isObject(args[1])) {
			
			data = args[1].data;
			schema = args[1].schema;
			options = args[1].options;
			view = args[1].view;
			callback = args[1].render;
			renderedCallback = args[1].postRender;
		
		} else {
		
			// figure out the data and options to use
			if (args.length >= 2) {
				// "data" is the second argument
				var data = args[1];
				if (Alpaca.isFunction(data)) {
					alert("Function not supported as data argument");
					return null;
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
						if (args.length >= 5) {
							// "view" is the fifth argument
							if (!Alpaca.isFunction(args[4])) {
								view = args[4];
							}
						}
					}
				}
			}
			// assume last parameter is a callback function
			callback = Alpaca.isFunction(args[args.length - 1]) ? args[args.length - 1] : null;
		}
        
        // handle case for null data
		// if schema exits, we will use the settings from the schema
        // we assume a text field
        if (Alpaca.isEmpty(data)) {
			if (Alpaca.isEmpty(schema) && (Alpaca.isEmpty(options)||Alpaca.isEmpty(options.type))) {
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
        
        var loadCounter = 0;
            
        // make parallel calls if needed
        // load data                
        if (data && Alpaca.isUri(data) && (!(schema && schema.format && schema.format == 'uri'))) {
            $.ajax({
                url: data,
                type: "get",
				dataType: "json",
                success: function(jsonDocument){
                    data = jsonDocument;
                    loadCounter++;
                    if (loadCounter == 4) 
                        return Alpaca.init(el, data, options,schema, view,callback,renderedCallback);
                },
                error: function(error) {
					loadCounter++;
					if (loadCounter == 4) 
						return Alpaca.init(el, data, options, schema, view, callback,renderedCallback);
				}
            });
        }
        else {
            loadCounter++;
            if (loadCounter == 4) 
                return Alpaca.init(el, data, options,schema, view,callback,renderedCallback);
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
					if (loadCounter == 4) 
						return Alpaca.init(el, data, options, schema, view, callback,renderedCallback);
				},
				error: function(error){
				}
			});
		} else {
			loadCounter++;
			if (loadCounter == 4) 
				return Alpaca.init(el, data, options, schema, view, callback,renderedCallback);
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
					if (loadCounter == 4) 
						return Alpaca.init(el, data, options, schema, view, callback,renderedCallback);
				},
				error: function(error){
				}
			});
		} else {
			loadCounter++;
			if (loadCounter == 4) 
				return Alpaca.init(el, data, options, schema, view, callback,renderedCallback);
		}
		
		// view     
        if (view && Alpaca.isUri(view)) {
			$.ajax({
				//async : false,
				url: view,
				type: "get",
				dataType: "json",
				success: function(jsonDocument) {
					view = jsonDocument;
					loadCounter++;
					if (loadCounter == 4) 
						return Alpaca.init(el, data, options, schema, view, callback,renderedCallback);
				},
				error: function(error) {
				}
			});
		} else {
			loadCounter++;
			if (loadCounter == 4) 
				return Alpaca.init(el, data, options, schema, view, callback,renderedCallback);
		}
    };
    
    /**
     * Initial function for setting up field instance and execute callback.
     * 
     * @param {Object} el
     * @param {Object} data
     * @param {Object} options
     * @param {Object} schema
     * @param {Object} view
     * @param {Object} callback
     */
	Alpaca.init = function(el, data, options,schema,view, callback,renderedCallback) {
        var field = Alpaca.createFieldInstance(el, data, options,schema,view);        
        Alpaca.fieldInstances[field.getId()] = field;
		
		// allow callbacks defined through view
		if (Alpaca.isEmpty(callback)) {
			callback = Alpaca.getViewParam("render", field);
		}
		if (Alpaca.isEmpty(renderedCallback)) {
			renderedCallback = Alpaca.getViewParam("postRender", field);
		}		
		
        if (callback != null ) {
            callback(field,renderedCallback);
        } else {
            field.render(renderedCallback);
        }
		
		field.callback = callback;
		field.renderedCallback = renderedCallback;
		
		return field;        
    }
    
    /**
     * Internal method for constructing a field instance.
     * 
	 * @param {Object} el the dom element to act as the container of the constructed field
	 * @param {Object} data the data to be bound into the field
	 * @param {Object} options the configuration for the field
	 * @param {Object} schema the schema for the field
	 * @param {Object} view the view for the field
	 */
    Alpaca.createFieldInstance = function(el, data, options,schema,view) {
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
        return new fieldClass(el, data, options,schema,view);
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
		 * Default Locale
		 */
		defaultLocale: "en_US",
		
		/**
         * Sets default Locale
         */
        setDefaultLocale: function(locale) {
			this.defaultLocale = locale;
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
        registerView: function(view) {
			var type = view.id;
			if (!Alpaca.isEmpty(type)) {
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
					if (Alpaca.isString(template) &&!Alpaca.startsWith(template, view.id)) {
						view.templates[view.id + "_" +templateId+"_src"] = template;
						if (template && !Alpaca.isUri(template)) {
							$.template(view.id + "_" + templateId, template);
							view.templates[templateId] = view.id + "_" + templateId;
						} else {
							view.templates[templateId] = template;							
						}
					}
				}
												
			}
			return type;
		},
        
        defaultView : "WEB_EDIT",
        
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
         * Gets view with given type
         */
        getViewType: function(view){
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
         * Sets default template type
         */
        setDefaultView: function(type){
			if (type && this.views.hasOwnProperty(type)) {
				this.defaultView = type;
			}
		},
        
       /**
        * Returns the view parameter
        */
	    getViewParam: function(configId, field) {
			
			var view = field.view;
			
			if (Alpaca.isObject(view)) {
				var param = this._getViewParam(configId, view);
				if (!Alpaca.isEmpty(param)) {
					return param;
				}
				// Try to see if we can pick up default template
				view = this.defaultView;
			}

			if (Alpaca.isString(view)) {
				view = this.getView(view);
				return this._getViewParam(configId, view);
			}
			return null;
		},
		
		/**
		 * Internal method for parameter lookup through view hierachy
		 * 
		 * @param {Object} configId
		 * @param {Object} view
		 */
		_getViewParam: function(configId, view) {
			if (view && !Alpaca.isEmpty(view[configId])) {
				return view[configId];
			} else {
				if (view && view.parent) {
					return this._getViewParam(configId, this.views[view.parent]);
				} else {
					return null;
				}
			}
		},
		
		/**
        * Returns the field template for given id
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
		 * Internal method for template lookup through view hierachy
		 * 
		 * @param {Object} templateId
		 * @param {Object} view
		 */
		_getTemplate: function(templateId, view, path) {
			if (view && view.fields && view.fields[path] && view.fields[path].templates && view.fields[path].templates[templateId]) {
				return view.fields[path].templates[templateId];
			}
			if (view && view.templates && view.templates[templateId]) {
				return view.templates[templateId];
			} else {
				if (view && view.parent) {
					return this._getTemplate(templateId, this.views[view.parent],path);
				} else {
					return null;
				}
			}
		},

	    getStyles: function(field) {

			var view = field.view;
			
			if (Alpaca.isObject(view)) {
				var template = this._getStyles(view, field.path);
				if (!Alpaca.isEmpty(template)) {
					return template;
				}
				// Try to see if we can pick up default template
				view = this.defaultView;
			}

			if (Alpaca.isString(view)) {
				view = this.getView(view);
				return this._getStyles(view, field.path);
			}
			return null;
		},
		
		_getStyles: function(view, path) {
			if (view && view.fields && view.fields[path] && view.fields[path].styles) {
				return view.fields[path].styles;
			}
			if (view && view.styles) {
				return view.styles;
			} else {
				if (view && view.parent) {
					return this._getStyles(this.views[view.parent],path);
				} else {
					return null;
				}
			}
		},

		
		getLayout: function(templateId, field) {
					
			var view = field.view;
			
			if (Alpaca.isObject(view)) {
				var template = this._getLayout(templateId, view, field.path);
				if (!Alpaca.isEmpty(template)) {
					return template;
				}
				// Try to see if we can pick up default template
				view = this.defaultView;
			}
			
			if (Alpaca.isString(view)) {
				view = this.getView(view);
				return this._getLayout(templateId, view, field.path);
			}
			return null;
		},
		
		_getLayout: function(templateId, view, path) {
			if (path && path != '/') {
				if (view && view.fields && view.fields[path] && view.fields[path].templates && view.fields[path].templates[templateId]) {
					return view.fields[path].templates[templateId];
				} else {
					return null;
				}
			}
			if (view && view.templates && view.templates[templateId]) {
				return view.templates[templateId];
			} else {
				if (view && view.parent) {
					return this._getTemplate(templateId, this.views[view.parent],path);
				} else {
					return null;
				}
			}
		},
        
        /**
         * Registers a new template with given template id and view id 
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
         * Registers templates with given type and mode
         */
        registerTemplates: function(templates, viewId) {
			for (var templateId in templates) {
				this.registerTemplate(templateId, templates[templateId], viewId);
			}
		},
                        
       /**
        * Returns the field message for given id
        */
	    getMessage: function(messageId, field) {
			
			var view = field.getView();
			
			if (Alpaca.isObject(view)) {
				var message = this._getMessage(messageId, view, field.path);
				if (!Alpaca.isEmpty(message)) {
					return message;
				}
				// Try to see if we can pick up default message
				view = this.defaultView;
			}

			if (Alpaca.isString(view)) {
				view = this.getView(view);
				return this._getMessage(messageId, view, field.path);
			}
			return null;
		},
		
		/**
		 * Internal method for message lookup through view hierachy
		 * 
		 * @param {Object} messageId
		 * @param {Object} view
		 */
		_getMessage: function(messageId, view, path) {
			if (view && view.fields && view.fields[path] && view.fields[path].messages && view.fields[path].messages[messageId]) {
				if (view.fields[path].messages[this.defaultLocale] && view.fields[path].messages[this.defaultLocale][messageId]) {
					return view.fields[path].messages[this.defaultLocale][messageId];
				} else {
					return view.fields[path].messages[messageId];
				}
			}
			if (view && view.messages && view.messages[messageId]) {
				if (view.messages[this.defaultLocale] && view.messages[this.defaultLocale][messageId]) {
					return view.messages[this.defaultLocale][messageId];
				} else {
					return view.messages[messageId];
				}
			} else {
				if (view && view.parent) {
					return this._getMessage(messageId, this.views[view.parent],path);
				} else {
					return null;
				}
			}
		},
        
        /**
         * Registers a message for for given id, type and field
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
         * Registers messages for given type and field
         */
        registerMessages: function(messages, viewId) {
			for (var messageId in messages) {
				if (messages.hasOwnProperty(messageId)) {
					this.registerMessage(messageId, messages[messageId], viewId);
				}
			}
		},
        
        /**
         * Default Class for Field Level Template
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
         * Processes Field Level Template
         */
        fieldTemplate: function(object, name, wrap) {
			if (!name) 
				name = "controlFieldLabel";
			var template = this.getTemplate(name, object.data);
			if (wrap) {
				if (this.getTemplate(template + "_src", object.data)) {
					template = this.getTemplate(template+"_src", object.data);
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
         * Date format
         */
        //defaultDateFormat: "m/d/Y",
        //defaultDateFormat: "Y-m-d",
		defaultDateFormat: "mm/dd/yy",
        
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
		//return (text.match("^" + prefix) == prefix);
		return text.substr(0, prefix.length) === prefix;
	};
    
    $.fn.outerHTML = function(nocloning) {
		if (nocloning) {
			return $("<div></div>").append(this).html();
		} else {
			return $("<div></div>").append(this.clone()).html();
		}
    }
 
    Alpaca.isUri = function(obj) { 
        return Alpaca.isString(obj) && (Alpaca.startsWith(obj, "http://") ||
                Alpaca.startsWith(obj, "https://") ||
                Alpaca.startsWith(obj, "/") ||
                Alpaca.startsWith(obj, "./")||
                Alpaca.startsWith(obj, "../")); 
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
	
	 /**
     * Merges json obj2 into obj1 using a recursive approach
     */
    Alpaca.mergeWithNullChecking = function(obj1, obj2) {
		if (!obj1) {
			obj1 = {};
		}
		for (var key in obj2) {
			if (Alpaca.isValEmpty(obj2[key]) ) {
				if (!Alpaca.isEmpty(obj1[key])) {
					obj1[key] = obj2[key];
				}
			} else {
				if (Alpaca.isObject(obj2[key])) {
					if (!obj1[key]) {
						obj1[key] = {};
					}
					obj1[key] = Alpaca.mergeWithNullChecking(obj1[key], obj2[key]);
				} else {
					obj1[key] = obj2[key];
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
	};
	
    /**
     * Compares two objects with any type
     * 
     * @param {Object} obj1
     * @param {Object} obj2
     */
	Alpaca.compareObject = function(obj1,obj2) {
		return equiv(obj1,obj2);
	};	
	
	/**
	 * Compares content of two arrays
	 * 
	 * @param {Object} arr_1
	 * @param {Object} arr_2
	 */
	Alpaca.compareArrayContent = function(arr_1, arr_2) {
		var equal = arr_1.length == arr_2.length;
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
	};

	
	Alpaca.isValEmpty = function(val) {
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
 */
	
    $.fn.filestyle = function(options) {
	
		/* TODO: This should not override CSS. */
		var settings = {
			width: 250
		};
		
		if (options) {
			$.extend(settings, options);
		};
		
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
				};
							} else {
				$(self).css("margin-left", wrapper.width - filenameWidth + "px");
			};
			
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
 */
$.fn.customFileInput = function() {
	return $(this).each(function() {
		//apply events and styles for file input element
		var fileInput = $(this).addClass('alpaca-controlfield-file-custom-input').focus(function() {
			fileInput.data('val', fileInput.val());
		}).blur(function() {
			$(this).trigger('checkChange');
		}).bind('disable', function() {
			fileInput.attr('disabled', true);
			upload.addClass('alpaca-controlfield-file-custom-disabled');
		}).bind('enable', function() {
			fileInput.removeAttr('disabled');
			upload.removeClass('alpaca-controlfield-file-custom-disabled');
		}).bind('checkChange', function() {
			if (fileInput.val() && fileInput.val() != fileInput.data('val')) {
				fileInput.trigger('change');
			}
		}).bind('change', function() {
			//get file name
			var fileName = $(this).val().split(/\\/).pop();
			//get file extension
			var fileExt = 'customfile-ext-' + fileName.split('.').pop().toLowerCase();
			//update the feedback
			uploadFeedback.text(fileName).data('fileExt', fileExt); //store file extension for class removal on next change			
			$('.ui-icon',uploadFeedback.parent()).remove();
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
			uploadFeedback.before('<span class="ui-icon '+iconClass+'" style="float:left;margin-top:0.3em"></span>');
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
		upload.mousemove(function(e) {
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
