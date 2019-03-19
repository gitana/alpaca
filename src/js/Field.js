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
                    if (this.propertyId)
                    {
                        this.name = this.parent.name + "_" + this.propertyId;
                        this.nameCalculated = true;
                    }
                    else
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
