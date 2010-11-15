(function($){

    var Alpaca = $.alpaca;
    
    /**
     * Abstract Field class
     *
     * Defines a field which contains a value and core functions.
     * These functions are left empty and are intended to be implemented in inheriting classes.
     *
     * Provides support for templated rendering.
     *
     * This takes in an options block which look like this:
     *
     * {
     *    id: <id>,                     				field id (optional)
     *    type: <type>,                 				field type (optional) - "text" if not specified
     *    schema: schema,              					field schema (optional)
     *    settings: settings            				field settings (optional) - {} if not specified
     * }
     *
     * The settings block consists of the following:
     *
     * SETTINGS
     * {
     *    template: <string>						    optional - allows for override of template
     *    fieldClass: [<string>]                        optional - additional css classes to apply
     *    validate: <boolean>			        		optional - whether to validate on change (true)
     *    disabled: <boolean>                           optional - whether to initialize as disabled (false)
     *    messages: {								    optional
     *       <messageId>:<messageString>
     *    }
     * }
     *
     * MODE SETTINGS
     *
     * All of the properties above can be overridden for specific modes as shown here:
     *
     * {
     *    ...
     *    modes:
     *    {
     *       "<modeId>":
     *       {
     *          <property>:<key>
     *       }
     *    }
     * }
     *
     * JSON SCHEMA:
     *
     * This class obeys JSON schema for:
     *
     * {
     *    optional: <boolean>							[optional] (false)
     *    default: <any>                                [optional]
     * }
     */
    Alpaca.Field = Base.extend({
    
        /**
         * Constructor
         *
         * @param container The DOM element to which this field is bound.
         * @param data The data bound to this field.
         * @param options (optional)
         *
         * Options consists of:
         *
         * {
         *    id: <id>,                     field id (optional)
         *    type: <type>,                 field type (optional)
         *    settings: settings            field settings (optional)
         * }
         *
         * @param schema field schema (optional)
         */
        constructor: function(container, data, options, schema){
            var _this = this;
            
            // mark that we are initializing
            this.initializing = true;
            
            // container
            this.container = container;
            
            // parent
            this.parent = null;
            this.data = data;
            this.options = options;
            this.schema = schema;
            
            // things we can draw off the options
            this.id = this.options.id;
            this.type = this.options.type;
            this.settings = this.options.settings;
            this.optionTemplate = this.options.template;
            
            // defaults
            if (!this.id) {
                this.id = Alpaca.generateId();
            }
            if (!this.schema) {
                this.schema = {};
            }
            if (!this.settings) {
                this.settings = {};
            }
            
            // data
            if (!this.data && this.schema["default"]) {
                this.data = this.schema["default"];
            }
            
            // backup data
            this.backupData = Alpaca.cloneObject(this.data);
            
        },
        
        /**
         * Sets up any default values for this field.
         */
        setup: function(){
            /**
             * JSON SCHEMA
             */
            if (Alpaca.isUndefined(this.schema.optional)) {
                this.schema.optional = false;
            }
            
            /**
             * SETTINGS
             */
            if (Alpaca.isUndefined(this.settings.validate)) {
                this.settings.validate = true;
            }
            
            if (Alpaca.isUndefined(this.settings.disabled)) {
                this.settings.disabled = false;
            }
            
            // MESSAGES
            
            if (!this.settings.messages) {
                this.settings.messages = {};
            }
            if (!this.settings.messages[Alpaca.STATE_REQUIRED]) {
                this.settings.messages[Alpaca.STATE_REQUIRED] = Alpaca.messages[Alpaca.STATE_REQUIRED];
            }
            if (!this.settings.messages[Alpaca.STATE_INVALID]) {
                this.settings.messages[Alpaca.STATE_INVALID] = Alpaca.messages[Alpaca.STATE_INVALID];
            }
            if (!this.settings.messages[Alpaca.STATE_VALID]) {
                this.settings.messages[Alpaca.STATE_VALID] = Alpaca.messages[Alpaca.STATE_VALID];
            }
            
        },
        
        _refresh: function(mode){
            // pull back data
            if (!this.initializing && mode == Alpaca.MODE_VIEW) {
                this.data = this.getValue();
            }
            
            // if we have already created backup settings, restore from them
            if (this.backupSettings) {
                this.settings = Alpaca.cloneObject(this.backupSettings);
            }
            else {
                this.backupSettings = Alpaca.cloneObject(this.settings);
            }
            
            //
            // copy any mode specific settings back into the root settings object
            //
            if (this.settings.modes) {
                var modeSettings = this.settings.modes[mode];
                if (modeSettings) {
                    for (var key in modeSettings) {
                        this.settings = Alpaca.merge(this.settings, modeSettings, function(key){
                            var valid = true;
                            
                            // don't allow a few keys
                            if (key == "modes") {
                                valid = false;
                            }
                            
                            return valid;
                        });
                    }
                }
            }
            
            // mark that we switched into the desired mode
            this.setMode(mode);
            
            // perform setup based on settings
            this.setup();
        },
        
        toggleMode: function(mode){
            if (!mode) {
                // toggle
                mode = this.getMode();
                
                if (mode == Alpaca.MODE_VIEW) {
                    mode = Alpaca.MODE_EDIT;
                }
                else 
                    if (mode == Alpaca.MODE_EDIT) {
                        mode = Alpaca.MODE_VIEW;
                    }
            }
            
            // re-render
            this.render(mode);
        },
        
        /**
         * Binds the data into the field.  Called at the very end of construction.
         */
        bindData: function(){
            if (this.data) {
                this.setValue(this.data, true);
            }
        },
        
        /**
         * Determines the template to use in rendering this field in its configured mode.
         * This pays attention to any overrides that are specified in the settings.
         *
         * Otherwise, it results to defaults declared as member variables (TEMPLATE_VIEW and TEMPLATE_EDIT).
         *
         * You can override this method to handle your own custom template types.
         */
        lookupTemplate: function(){
            var template = this.template;
            
            // if template is a function, evaluate it to get a string
            if (Alpaca.isFunction(template)) {
                template = template();
            }
            
            // trim for good measure
            template = $.trim(template);
            
            return template;
        },
        
        view: function(){
            this.render(Alpaca.MODE_VIEW);
        },
        
        edit: function(){
            this.render(Alpaca.MODE_EDIT);
        },
        
        create: function(){
            this.render(Alpaca.MODE_CREATE);
        },
        
        /**
         * Renders this field into the container.
         * Creates an outerEl which is bound into the container.
         */
        render: function(mode){
            if (!mode) {
                mode = Alpaca.MODE_EDIT;
            }
            this._refresh(mode);
            this._render();
        },
        
        /**
         * Internal method for processing the render.
         */
        _render: function(){
            var _this = this;
            
            // remove the previous outerEl if it exists
            if (this.outerEl) {
                this.outerEl.remove();
            }
            
            // render into the outer element
            this.renderOuter();
        },
        
        /**
         * Renders into the outerEl element
         */
        renderOuter: function(){
            var _this = this;
            
            // load the appropriate template and render it
            this.processRender(this.container/*this.outerEl*/, function(){
            
                // bind our field dom element into the container
                $(_this.getEl()).appendTo(_this.container);
                
                // allow any post-rendering facilities to kick in
                _this.postRender();
            });
        },
        
        /**
         * Responsible for fetching any templates needed so as to render the
         * current mode for this field.
         *
         * Once completed, the onSuccess method is called.
         */
        processRender: function(parentEl, onSuccess){
            var _this = this;
            
            // lookup the template we should use to render
            var template = this.lookupTemplate();
            if (!template) {
                _this.handleNoTemplateRender(parentEl, onSuccess);
            }
            else {
                // if we have a template to load, load it and then render
                if (Alpaca.startsWith(template, "http:") ||
                Alpaca.startsWith(template, "https") ||
                Alpaca.startsWith(template, "/") ||
                Alpaca.startsWith(template, "./")) {
                    // load template from remote location
                    $.ajax({
                        url: template,
                        type: 'get',
                        success: function(templateString){
                            _this._renderLoadedTemplate(parentEl, templateString, onSuccess);
                        },
                        error: function(error){
                            alert(error);
                        }
                    });
                }
                else {
                    // we already have the template, so just render it
                    this._renderLoadedTemplate(parentEl, template, onSuccess);
                }
            }
        },
        
        /**
         * This method can be overridden to manually provide rendering for the various modes.
         */
        handleNoTemplateRender: function(parentEl, onSuccess){
        },
        
        /**
         * Renders the loaded template
         */
        _renderLoadedTemplate: function(parentEl, templateString, onSuccess){
            var context = {
                id: this.getId(),
                settings: this.settings,
                data: this.data
            };
            var renderedDomElement = $.tmpl(templateString, context, {});
            renderedDomElement.appendTo($(parentEl));
            
            this.outerEl = renderedDomElement;
            
            if (this.outerEl.attr("id") == null) {
                this.outerEl.attr("id", this.getId() + "-field-outer");
            }
            if (this.outerEl.attr("alpaca-field-id") == null) {
                this.outerEl.attr("alpaca-field-id", this.getId());
            }
            this.renderField(onSuccess);
            // call onSuccess handler
            //onSuccess();
        },
        
        /**
         * Called after the rendering is complete as a way to make final modifications to the
         * dom elements that were produced.
         */
        postRender: function(){
            if (this.getMode() == Alpaca.MODE_EDIT) {
                // Support for custom CSS class for the field
                var fieldClass = this.settings["fieldClass"];
                if (fieldClass) {
                    $(this.outerEl).addClass(fieldClass);
                }
                
                /** optional **/
                if (this.settings.optional) {
                    $(this.outerEl).addClass("alpaca-field-optional");
                }
                else {
                    $(this.outerEl).addClass("alpaca-field-required");
                }
                
                // after render
                if (this.getMode() == Alpaca.MODE_EDIT) {
                    if (this.settings.disabled) {
                        this.disable();
                    }
                    
                    // bind data
                    this.bindData();
                }
                
                // initialize events (after part of the dom)
                this.initEvents();
            }
            
            // finished initializing
            this.initializing = false;
            
            if (this.getMode() == Alpaca.MODE_EDIT) {
                // final call to update validation state
                this.renderValidationState();
            }
        },
        
        /**
         * Retrieve the rendering element
         */
        getEl: function(){
            return $(this.outerEl);
        },
        
        /**
         * Returns the id of the field
         */
        getId: function(){
            return this.id;
        },
        
        getType: function(){
            return this.type;
        },
        
        /**
         * Returns this field's parent field.
         */
        getParent: function(){
            return this.parent;
        },
        
        /**
         * Return the value of the field
         */
        getValue: function(){
            return this.data;
        },
        
        /**
         * Sets the value of the field
         */
        setValue: function(value, stopUpdateTrigger){
            this.data = value;
            
            // set corresponding style
            this.renderValidationState();
            
            if (!stopUpdateTrigger) {
                this.triggerUpdate();
            }
        },
        
        /**
         * Initialize events
         */
        initEvents: function(){
            // OVERRIDE
        },
        
        /**
         * Makes sure that the DOM of the rendered field reflects the validation state
         * of the field.
         */
        renderValidationState: function(){
            // remove all previous markers
            $(this.getEl()).removeClass("alpaca-field-invalid");
            $(this.getEl()).removeClass("alpaca-field-valid");
            $(this.getEl()).removeClass("alpaca-field-empty");
            
            // this runs validation
            var state = this.getValidationState();
            
            if (state == Alpaca.STATE_INVALID) {
                $(this.getEl()).addClass("alpaca-field-invalid");
            }
            if (state == Alpaca.STATE_VALID) {
                $(this.getEl()).addClass("alpaca-field-valid");
            }
            if (state == Alpaca.STATE_EMPTY_OK) {
                $(this.getEl()).addClass("alpaca-field-empty");
            }
        },
        
        /**
         * Returns the validation state code for the field
         */
        getValidationState: function(){
            var state = null;
            
            var validated = this.validate();
            if (validated) {
                state = Alpaca.STATE_VALID;
            }
            else {
                state = Alpaca.STATE_INVALID;
            }
            
            return state;
        },
        
        /**
         * Converts the validation state into a message.
         */
        getValidationStateMessage: function(state){
            var message = this.settings.messages[state];
            if (!message) {
                message = "";
            }
            
            return message;
        },
        
        /**
         * Validates this field and returns whether it is in a valid state.
         */
        validate: function(){
            // skip out if we haven't yet bound any data into this control
            // the control can still be considered to be initializing
            if (this.initializing) {
                return true;
            }
            
            var isValid = true;
            
            if (this.settings.validate) {
                isValid = this.handleValidate();
            }
            
            return isValid;
        },
        
        /**
         * Performs validation
         */
        handleValidate: function(){
            if (!this._validateOptional()) {
                return false;
            }
            
            return true;
        },
        
        _validateOptional: function(){
            var val = this.getValue();
            
            if (val === '') {
                if (!this.schema.optional) {
                    return false;
                }
            }
            
            return true;
        },
        
        /**
         * Triggers any event handlers that want to listen to an update event for this field
         */
        triggerUpdate: function(){
            $(this.getEl()).trigger("fieldupdate");
        },
        
        /**
         * Disable the field
         */
        disable: function(){
            // OVERRIDE
        },
        
        /**
         * Enable the field
         */
        enable: function(){
            // OVERRIDE
        },
        
        /**
         * Focus the field
         */
        focus: function(){
            // OVERRIDE
        },
        
        /**
         * Purge any event listeners
         * Remove the field from the DOM
         */
        destroy: function(){
            $(this.getEl()).remove();
        },
        
        /**
         * Show the field
         */
        show: function(){
            $(this.getEl()).css({
                "display": ""
            });
        },
        
        /**
         * Hide the field
         */
        hide: function(){
            $(this.getEl()).css({
                "display": "none"
            });
        },
        
        /**
         * Clear the field.
         *
         * This resets the field to its original value (this.data)
         */
        clear: function(stopUpdateTrigger){
            var newValue = null;
            
            if (this.data) {
                newValue = this.data;
            }
            
            if (newValue == null) {
                newValue = null;
            }
            
            this.setValue(newValue, stopUpdateTrigger);
        },
        
        isEmpty: function(){
            var empty = false;
            
            var val = this.getValue();
            
            if (!val || val == "") {
                empty = true;
            }
            
            return empty;
        },
        
        getMode: function(){
            return this.mode;
        },
        
        setMode: function(mode){
			this.mode = mode;
			if (this.optionTemplate) {
				this.template = this.optionTemplate;
			}
			else {			
				this.template = Alpaca.getTemplate("field", this, null, mode);
			}
		},
        
        ///////////////////////////////////////////////////////////////////////////////////////////////
        //
        // FIELD EVENT HANDLERS
        //
        ///////////////////////////////////////////////////////////////////////////////////////////////		
        
        /**
         * Highlights the entire field
         */
        onFocus: function(e){
            $(this.getEl()).removeClass("alpaca-field-empty");
            $(this.getEl()).addClass("alpaca-field-focused");
        },
        
        /**
         * Unhighlights the entire field
         */
        onBlur: function(e){
            $(this.getEl()).removeClass("alpaca-field-focused");
            
            // set class from state
            this.renderValidationState();
        },
        
        onChange: function(e){
            // store back into data element
            this.data = this.getValue();
            
            this.triggerUpdate();
        }
        
    });
    
    /**
     * Information about the arguments for this field
     * This isn't used at runtime
     * It's used with the form builder.
     */
    Alpaca.Field.groupSettings = [{
        name: "id",
        label: "ID",
        type: "string",
        description: "The ID to use for this field.  If not specified, an ID will automatically be generated.",
        optional: true,
        defaultValue: "An automatically generated ID"
    }, {
        name: "type",
        label: "Type",
        type: "string",
        description: "The ID of the field type to instantiate (i.e. 'text')",
        optional: true,
        defaultValue: "textfield"
    }, {
        name: "template",
        label: "Template",
        type: "string",
        description: "URL or text of the template to use to render this field",
        optional: true,
        defaultValue: "Stock template"
    }, {
        name: "validate",
        label: "Process Validation?",
        type: "boolean",
        description: "Whether to process validation for this field",
        optional: true,
        defaultValue: true
    }, {
        name: "fielClass",
        label: "Field CSS Class",
        type: "string",
        description: "Custom CSS class name to apply to the field element",
        optional: true,
        defaultValue: null
    }, {
        name: "disabled",
        label: "Disabled",
        type: "boolean",
        description: "Whether the field is disabled upon rendering",
        optional: true,
        defaultValue: false
    }];
    
})(jQuery);
