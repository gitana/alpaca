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
         * @constructs
         * @augments Alpaca.ContainerField
         *
         * @class Control for JSON Schema object type.
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
            this.base(container, data, options, schema, view, connector, errorCallback);
        },

        /**
         * @see Alpaca.ContainerField#setup
         */
        setup: function() {
            this.base();

            this.wizardPreIcon = "";
            this.wizardNextIcon = "";
            this.wizardDoneIcon= "";

            if (this.view.style && Alpaca.styleInjections[this.view.style]) {
                if (Alpaca.styleInjections[this.view.style]["wizardPreIcon"]) {
                    this.wizardPreIcon = Alpaca.styleInjections[this.view.style]["wizardPreIcon"];
                }
                if (Alpaca.styleInjections[this.view.style]["wizardNextIcon"]) {
                    this.wizardNextIcon = Alpaca.styleInjections[this.view.style]["wizardNextIcon"];
                }
                if (Alpaca.styleInjections[this.view.style]["wizardDoneIcon"]) {
                    this.wizardDoneIcon = Alpaca.styleInjections[this.view.style]["wizardDoneIcon"];
                }
            }

            if (Alpaca.isEmpty(this.data)) {
                return;
            }
            if (!Alpaca.isObject(this.data)) {
                if (!Alpaca.isString(this.data)) {
                    return;
                } else {
                    try {
                        this.data = Alpaca.parseJSON(this.data);
                        if (!Alpaca.isObject(this.data)) {
                            Alpaca.logWarn("ObjectField parsed data but it was not an object: " + JSON.stringify(this.data));
                            return;
                        }
                    } catch (e) {
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
        setValue: function(data) {
            if (!data || !Alpaca.isObject(data)) {
                return;
            }
            // clear all controls
            //Alpaca.each(this.children, function() {
            //    this.clear();
            //});

            // set fields
            for (var fieldId in this.childrenById) {
                var propertyId = this.childrenById[fieldId].propertyId;
                var _data = Alpaca.traverseObject(data, propertyId);
                if (!Alpaca.isEmpty(_data)) {
                    var childField = this.childrenById[fieldId];
                    childField.setValue(_data);
                }
            }
        },

        /**
         * Reconstructs the data object from the child fields.
         *
         * @see Alpaca.Field#getValue
         */
        getValue: function() {

            // if we don't have any children and we're not required, hand back empty object
            if (this.children.length === 0 && !this.schema.required)
            {
                return {};
            }

            // otherwise, hand back an object with our child properties in it
            var o = {};

            // walk through all of the properties object
            // for each property, we insert it into a JSON object that we'll hand back as the result

            // if the property has dependencies, then we evaluate those dependencies first to determine whether the
            // resulting property should be included

            for (var i = 0; i < this.children.length; i++) {

                // the property key and vlaue
                var propertyId = this.children[i].propertyId;
                var fieldValue = this.children[i].getValue();

                if (typeof(fieldValue) !== "undefined")
                {
                    if (this.determineAllDependenciesValid(propertyId))
                    {
                        var assignedValue = null;

                        if (typeof(fieldValue) === "boolean")
                        {
                            assignedValue = (fieldValue? true: false);
                        }
                        else if (Alpaca.isArray(fieldValue) || Alpaca.isObject(fieldValue))
                        {
                            assignedValue = fieldValue;
                        }
                        else if (fieldValue)
                        {
                            assignedValue = fieldValue;
                        }

                        if (assignedValue)
                        {
                            o[propertyId] = assignedValue;
                        }
                    }
                }
            }

            return o;
        },

        /**
         * @see Alpaca.Field#postRender
         */
        postRender: function(callback) {

            var self = this;

            this.base(function() {

                // Generates wizard if requested
                if (self.isTopLevel()) {
                    if (self.view) {
                        self.wizardConfigs = self.view.getWizard();
                        if (self.wizardConfigs) {

                            // set up defaults for wizard
                            if (Alpaca.isUndefined(self.wizardConfigs.validation)) {
                                self.wizardConfigs.validation = true;
                            }
                            if (!self.wizardConfigs.buttons) {
                                self.wizardConfigs.buttons = {};
                            }

                            // done
                            if (!self.wizardConfigs.buttons.done) {
                                self.wizardConfigs.buttons.done = {};
                            }
                            if (Alpaca.isUndefined(self.wizardConfigs.buttons.done.validateOnClick)) {
                                self.wizardConfigs.buttons.done.validateOnClick = true;
                            }

                            // prev
                            if (!self.wizardConfigs.buttons.prev) {
                                self.wizardConfigs.buttons.prev = {};
                            }
                            if (Alpaca.isUndefined(self.wizardConfigs.buttons.prev.validateOnClick)) {
                                self.wizardConfigs.buttons.prev.validateOnClick = true;
                            }

                            // next
                            if (!self.wizardConfigs.buttons.next) {
                                self.wizardConfigs.buttons.next = {};
                            }
                            if (Alpaca.isUndefined(self.wizardConfigs.buttons.next.validateOnClick)) {
                                self.wizardConfigs.buttons.next.validateOnClick = true;
                            }
                        }
                        var layoutTemplateDescriptor = self.view.getLayout().templateDescriptor;
                        if (self.wizardConfigs && self.wizardConfigs.renderWizard) {
                            if (layoutTemplateDescriptor) {
                                //Wizard based on layout
                                self.wizard();
                            } else {
                                //Wizard based on injections
                                self.autoWizard();
                            }
                        }
                    }
                }

                callback();
            });
        },

        /**
         * @see Alpaca.ContainerField#handleValidate
         */
        handleValidate: function() {
            var baseStatus = this.base();

            var valInfo = this.validation;

            var status = this._validateMaxProperties();
            valInfo["tooManyProperties"] = {
                "message": status ? "" : Alpaca.substituteTokens(this.view.getMessage("tooManyProperties"), [this.schema.maxProperties]),
                "status": status
            };

            status = this._validateMinProperties();
            valInfo["tooFewProperties"] = {
                "message": status ? "" : Alpaca.substituteTokens(this.view.getMessage("tooManyItems"), [this.schema.items.minProperties]),
                "status": status
            };

            return baseStatus && valInfo["tooManyProperties"]["status"] && valInfo["tooFewProperties"]["status"];
        },//__BUILDER_HELPERS

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

        //__BUILDER_HELPERS


        /**
         * Gets child index.
         *
         * @param {Object} propertyId Child field property ID.
         */
        getIndex: function(propertyId) {
            if (Alpaca.isEmpty(propertyId)) {
                return -1;
            }
            for (var i = 0; i < this.children.length; i++) {
                var pid = this.children[i].propertyId;
                if (pid == propertyId) {
                    return i;
                }
            }
            return -1;
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

            var propertySchema = null;
            if (_this.schema && _this.schema.properties && _this.schema.properties[propertyId]) {
                propertySchema = _this.schema.properties[propertyId];
            }
            var propertyOptions = {};
            if (_this.options && _this.options.fields && _this.options.fields[propertyId]) {
                propertyOptions = _this.options.fields[propertyId];
            }

            // handle $ref
            if (propertySchema && propertySchema["$ref"])
            {
                var referenceId = propertySchema["$ref"];

                var topField = this;
                var fieldChain = [topField];
                while (topField.parent)
                {
                    topField = topField.parent;
                    fieldChain.push(topField);
                }

                var originalPropertySchema = propertySchema;
                var originalPropertyOptions = propertyOptions;

                Alpaca.loadRefSchemaOptions(topField, referenceId, function(propertySchema, propertyOptions) {

                    // walk the field chain to see if we have any circularity
                    var refCount = 0;
                    for (var i = 0; i < fieldChain.length; i++)
                    {
                        if (fieldChain[i].schema && fieldChain[i].schema.id === referenceId)
                        {
                            refCount++;
                        }
                    }

                    var circular = (refCount > 1);

                    var resolvedPropertySchema = {};
                    if (originalPropertySchema) {
                        Alpaca.mergeObject(resolvedPropertySchema, originalPropertySchema);
                    }
                    if (propertySchema)
                    {
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
                    if (propertyOptions)
                    {
                        Alpaca.mergeObject(resolvedPropertyOptions, propertyOptions);
                    }

                    callback(resolvedPropertySchema, resolvedPropertyOptions, circular);
                });
            }
            else
            {
                callback(propertySchema, propertyOptions);
            }
        },

        /**
         * Removes child
         *
         * @param {String} id the alpaca field id of the field to be removed
         */
        removeItem: function(id)
        {
            this.children = $.grep(this.children, function(val, index) {
                return (val.getId() != id);
            });

            var childField = this.childrenById[id];

            delete this.childrenById[id];
            if (childField.propertyId)
            {
                delete this.childrenByPropertyId[childField.propertyId];
            }

            childField.destroy();

            this.renderValidationState();

            // trigger update handler
            this.triggerUpdate();
        },

        /**
         * Adds a child item.
         *
         * @param {String} propertyId Child field property ID.
         * @param {Object} itemSchema schema
         * @param {Object} fieldOptions Child field options.
         * @param {Any} value Child field value
         * @param {String} insertAfterId Location where the child item will be inserted.
         * @param [Boolean] isDynamicSubItem whether this item is being dynamically created (after first render)
         * @param [Function} postRenderCallback called once the item has been added
         */
        addItem: function(propertyId, itemSchema, itemOptions, itemData, insertAfterId, isDynamicSubItem, postRenderCallback) {
            var _this = this;

            var containerElem = _this.renderItemContainer(insertAfterId, this, propertyId);
            containerElem.alpaca({
                "data" : itemData,
                "options": itemOptions,
                "schema" : itemSchema,
                "view" : this.view.id ? this.view.id : this.view,
                "connector": this.connector,
                "error": function(err)
                {
                    _this.destroy();

                    _this.errorCallback.call(_this, err);
                },
                "notTopLevel":true,
                "isDynamicCreation": (isDynamicSubItem || this.isDynamicCreation),
                "render" : function(fieldControl, cb) {
                    // render
                    fieldControl.parent = _this;
                    // add the property Id
                    fieldControl.propertyId = propertyId;
                    // setup item path
                    if (_this.path != "/") {
                        fieldControl.path = _this.path + "/" + propertyId;
                    } else {
                        fieldControl.path = _this.path + propertyId;
                    }
                    fieldControl.render(null, function() {

                        containerElem.attr("id", fieldControl.getId() + "-item-container");
                        containerElem.attr("alpaca-id", fieldControl.getId());
                        containerElem.addClass("alpaca-fieldset-item-container");
                        // remember the control
                        if (Alpaca.isEmpty(insertAfterId)) {
                            _this.addChild(fieldControl);
                        } else {
                            var index = _this.getIndex(insertAfterId);
                            if (index != -1) {
                                _this.addChild(fieldControl, index + 1);
                            } else {
                                _this.addChild(fieldControl);
                            }
                        }
                        if (insertAfterId) {
                            _this.renderValidationState();
                        }

                        // if not empty, mark the "last" and "first" dom elements in the list
                        if ($(containerElem).siblings().addBack().length > 0)
                        {
                            $(containerElem).parent().removeClass("alpaca-fieldset-items-container-empty");

                            $(containerElem).siblings().addBack().removeClass("alpaca-item-container-first");
                            $(containerElem).siblings().addBack().removeClass("alpaca-item-container-last");
                            $(containerElem).siblings().addBack().first().addClass("alpaca-item-container-first");
                            $(containerElem).siblings().addBack().last().addClass("alpaca-item-container-last");
                        }

                        // store key on dom element
                        $(containerElem).attr("data-alpaca-item-container-item-key", propertyId);

                        // trigger update on the parent array
                        _this.triggerUpdate();

                        if (cb)
                        {
                            cb();
                        }

                    });
                },
                "postRender": function(control) {
                    if (postRenderCallback)
                    {
                        postRenderCallback(control);
                    }
                }
            });
        },

        /**
         * @see Alpaca.ContainerField#renderItems
         */
        renderItems: function(onSuccess) {

            var _this = this;

            // we keep a map of all of the properties in our original data object
            // as we render elements out of the schema, we remove from the dataProperties map
            // whatever is leftover are the data properties that were NOT rendered because they were not part
            // of the schema
            // we use this for debugging
            var extraDataProperties = {};
            for (var dataKey in _this.data) {
                extraDataProperties[dataKey] = dataKey;
            }

            var properties = _this.data;
            if (_this.schema && _this.schema.properties) {
                properties = _this.schema.properties;
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

                // support for dependencies

                // walk through all properties and allow each to determine whether it should show based on its dependencies.
                // if properties do not have dependencies, they show by default.
                for (var propertyId in properties)
                {
                    _this.showOrHidePropertyBasedOnDependencies(propertyId);
                }

                // bind event handlers to handle updates to field state
                for (var propertyId in properties)
                {
                    _this.bindDependencyFieldUpdateEvent(propertyId);
                }

                // force refresh of dependency states
                for (var propertyId in properties)
                {
                    _this.refreshDependentFieldStates(propertyId);
                }

                _this.renderValidationState();

                if (onSuccess)
                {
                    onSuccess();
                }
            };

            // each property in the object can have a different schema and options so we need to process
            // asynchronously and wait for all to complete

            // figure out the total count of properties that we need to iterate through
            var total = 0;
            for (var propertyId in properties)
            {
                total++;
            }

            // collect all the property ids since we'll churn through them by property key
            var propertyIds = [];
            for (var propertyId in properties)
            {
                propertyIds.push(propertyId);
            }

            // workhorse function for a single property
            var handleProperty = function(index)
            {
                if (index === total)
                {
                    // all done, fire completion function
                    cf();

                    return;
                }

                var propertyId = propertyIds[index];

                var itemData = null;
                if (_this.data)
                {
                    itemData = _this.data[propertyId];
                }

                // only allow this if we have data, otherwise we end up with circular reference
                _this.resolvePropertySchemaOptions(propertyId, function(schema, options, circular) {

                    // we only allow addition if the resolved schema isn't circularly referenced
                    // or the schema is optional
                    if (circular)
                    {
                        return Alpaca.throwErrorWithCallback("Circular reference detected for schema: " + schema, _this.errorCallback);
                    }

                    if (!schema)
                    {
                        Alpaca.logError("Unable to resolve schema for property: " + propertyId);
                    }

                    _this.addItem(propertyId, schema, options, itemData, null, false, function(addedItemControl) {

                        // remove from extraDataProperties helper
                        delete extraDataProperties[propertyId];

                        handleProperty(index + 1);
                    });
                });
            };
            handleProperty(0);
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

            var itemDependencies = item.schema.dependencies;
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

            var itemDependencies = item.schema.dependencies;
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
                    dependentField.getEl().bind("fieldupdate", function(propertyField, dependencyField, propertyId, dependencyPropertyId) {

                        return function(event)
                        {
                            // the property "dependencyPropertyId" changed and affects target property ("propertyId")

                            // update UI state for target property
                            self.showOrHidePropertyBasedOnDependencies(propertyId);

                            propertyField.trigger("fieldupdate");
                        };

                    }(item, dependentField, propertyId, dependencyPropertyId));

                    // trigger field update
                    dependentField.trigger("fieldupdate");
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

            var itemDependencies = propertyField.schema.dependencies;
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
                    dependentField.trigger("fieldupdate");
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

            var dependentOnData = dependentOnField.data;

            // assume it isn't valid
            var valid = false;

            // go one of two directions depending on whether we have conditional dependencies or not
            var conditionalDependencies = this.childrenByPropertyId[propertyId].options.dependencies;
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
                    valid = !Alpaca.isValEmpty(dependentOnField.data);
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
                    dependentOnData = false
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
                        //if (conditionalDependencies[dependentOnPropertyId] && $.inArray(dependentOnData, conditionalDependencies[dependentOnPropertyId]) == -1)
                        if (Alpaca.anyEquality(dependentOnData, conditionalData))
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




        ///////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // WIZARD
        //
        ///////////////////////////////////////////////////////////////////////////////////////////////////////



        /**
         * Renders a template-based wizard.
         */
        wizard: function() {

            var _this = this;

            var element = this.outerEl;
            var steps = $('.alpaca-wizard-step', element);
            var count = steps.size();

            this.totalSteps = count;

            var stepTitles = [];
            if (this.wizardConfigs.stepTitles) {
                stepTitles = this.wizardConfigs.stepTitles;
            } else {
                // Prepare step titles
                steps.each(function(i) {
                    var stepTitle = {
                        "title": "",
                        "description": ""
                    };
                    if ($('.alpaca-wizard-step-title', this)) {
                        stepTitle.title = $('.alpaca-wizard-step-title', this).html();
                        $('.alpaca-wizard-step-title', this).hide();
                    }
                    if ($('.alpaca-wizard-step-description', this)) {
                        stepTitle.description = $('.alpaca-wizard-step-description', this).html();
                        $('.alpaca-wizard-step-description', this).hide();
                    }
                    stepTitles.push(stepTitle);
                });
            }
            var wizardStatusBarElement = this._renderWizardStatusBar(stepTitles);
            if (wizardStatusBarElement) {
                $(element).before(wizardStatusBarElement);
            }

            steps.each(function(i) {

                var wizardStepTargetId = $(this).attr("id");

                var stepId = 'step' + i;
                var wizardStepTemplateDescriptor = _this.view.getTemplateDescriptor("wizardStep");
                if (wizardStepTemplateDescriptor) {
                    var wizardStepElement = _this.view.tmpl(wizardStepTemplateDescriptor, {});
                    wizardStepElement.attr("id", stepId);
                    $(this).wrap(wizardStepElement);
                }

                var navBarId = stepId + '-nav-bar';
                var wizardNavBarTemplateDescriptor = _this.view.getTemplateDescriptor("wizardNavBar");
                if (wizardNavBarTemplateDescriptor) {
                    var wizardNavBarElement = _this.view.tmpl(wizardNavBarTemplateDescriptor, {});
                    wizardNavBarElement.attr("id", navBarId);
                    wizardNavBarElement.addClass('alpaca-wizard-nav-bar');
                    $(this).append(wizardNavBarElement);
                }

                // collect all of the stepBindings for this step
                var stepBindings = {};
                var bindings = _this.view.getLayout().bindings;
                for (var fieldId in bindings)
                {
                    var bindingTargetId = bindings[fieldId];

                    if (bindingTargetId == wizardStepTargetId)
                    {
                        stepBindings[fieldId] = wizardStepTargetId;
                    }
                }

                var vFunc = function(stepCount, stepBindings)
                {
                    return function() {

                        var valid = true;

                        if (_this.wizardConfigs && _this.wizardConfigs.validation) {

                            // if auto-wizard, process bindings one at a time
                            if (stepBindings) {
                                $.each(stepBindings, function(propertyId, step) {
                                    valid = valid & _this.childrenByPropertyId[propertyId].validate();
                                    _this.childrenByPropertyId[propertyId].renderValidationState();
                                });
                            }

                        }

                        return valid;
                    };
                }(i, stepBindings);

                if (i === 0) {
                    _this._createNextButton(i, true, vFunc);
                    _this._selectStep(i);
                } else if (i == count - 1) {
                    $("#step" + i).hide();
                    _this._createPrevButton(i, false);
                    _this._createDoneButton(i, true, vFunc);
                } else {
                    $("#step" + i).hide();
                    _this._createPrevButton(i, false);
                    _this._createNextButton(i, true, vFunc);
                }
            });
        },

        /**
         * Renders a configuration-based wizard without a layout template.
         */
        autoWizard: function() {

            var _this = this;

            var totalSteps = this.wizardConfigs.steps;

            if (!totalSteps) {
                totalSteps = 1;
            }

            this.totalSteps = totalSteps;

            var stepBindings = this.wizardConfigs.bindings;

            if (!stepBindings) {
                stepBindings = {};
            }

            for (var propertyId in this.childrenByPropertyId) {
                if (!stepBindings.hasOwnProperty(propertyId)) {
                    stepBindings[propertyId] = 1;
                }
            }

            for (var i = 0; i < totalSteps; i++) {
                var step = i + 1;
                var tmpArray = [];
                for (var propertyId in stepBindings) {
                    if (stepBindings[propertyId] == step) {
                        if (this.childrenByPropertyId && this.childrenByPropertyId[propertyId]) {
                            tmpArray.push("#" + this.childrenByPropertyId[propertyId].container.attr('id'));
                        }
                    }
                }

                var stepId = 'step' + i;
                var wizardStepTemplateDescriptor = this.view.getTemplateDescriptor("wizardStep");
                if (wizardStepTemplateDescriptor) {
                    var wizardStepElement = _this.view.tmpl(wizardStepTemplateDescriptor, {});
                    wizardStepElement.attr("id", stepId);
                    $(tmpArray.join(',')).wrapAll(wizardStepElement);
                }

                var navBarId = stepId + '-nav-bar';
                var wizardNavBarTemplateDescriptor = this.view.getTemplateDescriptor("wizardNavBar");
                if (wizardNavBarTemplateDescriptor) {
                    var wizardNavBarElement = _this.view.tmpl(wizardNavBarTemplateDescriptor, {});
                    wizardNavBarElement.attr("id", navBarId);
                    wizardNavBarElement.addClass('alpaca-wizard-nav-bar');
                    $('#' + stepId, this.outerEl).append(wizardNavBarElement);
                }
            }

            var wizardStatusBarElement = this._renderWizardStatusBar(this.wizardConfigs.stepTitles);
            if (wizardStatusBarElement) {
                wizardStatusBarElement.prependTo(this.fieldContainer);
            }

            for (var i = 0; i < totalSteps; i++) {

                var vFunc = function(stepCount, stepBindings)
                {
                    return function() {

                        var valid = true;

                        if (_this.view && _this.wizardConfigs && _this.wizardConfigs.validation) {

                            // if auto-wizard, process bindings one at a time
                            if (stepBindings) {
                                $.each(stepBindings, function(propertyId, step) {
                                    if (step == stepCount + 1 && valid) {
                                        valid = _this.childrenByPropertyId[propertyId].validate();
                                        _this.childrenByPropertyId[propertyId].validate();
                                    }
                                });
                            }
                        }

                        return valid;

                    };
                }(i, stepBindings);


                if (i === 0) {
                    _this._createNextButton(i, false, vFunc);
                    _this._selectStep(i);
                } else if (i == totalSteps - 1) {
                    $("#step" + i).hide();
                    _this._createPrevButton(i, false);
                    _this._createDoneButton(i, true, vFunc);
                } else {
                    $("#step" + i).hide();
                    _this._createPrevButton(i, false);
                    _this._createNextButton(i, false, vFunc);
                }
            }
        },

        /**
         * Renders wizard status bar.
         *
         * @param {Object} stepTitles Step titles.
         */
        _renderWizardStatusBar: function(stepTitles) {

            var _this = this;

            var wizardStatusBar = this.wizardConfigs.statusBar;
            if (wizardStatusBar && stepTitles) {
                var wizardStatusBarTemplateDescriptor = this.view.getTemplateDescriptor("wizardStatusBar");
                if (wizardStatusBarTemplateDescriptor) {
                    var wizardStatusBarElement = _this.view.tmpl(wizardStatusBarTemplateDescriptor, {
                        "id": this.getId() + "-wizard-status-bar",
                        "titles": stepTitles
                    });
                    wizardStatusBarElement.addClass("alpaca-wizard-status-bar");
                    this.getStyleInjection("wizardStatusBar",wizardStatusBarElement);
                    return wizardStatusBarElement;
                }
            }
        },

        /**
         * Creates an "prev" button.
         *
         * @param {Integer} i Step number.
         * @param [boolean] whether to add a clear div at the end
         * @param [validationFunction] function test whether the button should be allowed to proceed
         */
        _createPrevButton: function(i, clear, validationFunction) {

            // only apply validation if configured to do so
            if (this.wizardConfigs.buttons && this.wizardConfigs.buttons.prev) {
                if (!this.wizardConfigs.buttons.prev.validateOnClick) {
                    validationFunction = null;
                }
            }

            var stepName = "step" + i;
            var _this = this;

            var wizardPreButtonTemplateDescriptor = this.view.getTemplateDescriptor("wizardPreButton");
            if (wizardPreButtonTemplateDescriptor) {
                var wizardPreButtonElement = _this.view.tmpl(wizardPreButtonTemplateDescriptor, {});
                wizardPreButtonElement.attr("id", stepName + '-button-pre');
                wizardPreButtonElement.addClass("alpaca-wizard-button-pre");
                if (_this.buttonBeautifier) {
                    _this.buttonBeautifier.call(_this, wizardPreButtonElement, this.wizardPreIcon,true );
                }

                // when they click "prev", run validation function first to make sure they're allowed to proceed
                wizardPreButtonElement.click(function(stepName, stepCount, validationFunction) {

                    return function() {
                        var valid = true;

                        if (validationFunction)
                        {
                            valid = validationFunction(stepName, stepCount);
                        }

                        if (valid) {
                            $("#" + stepName).hide();
                            $("#step" + (i - 1)).show();
                            _this._selectStep(i - 1);

                            // TODO: fire click handler?
                            if (_this.wizardConfigs.buttons.prev && _this.wizardConfigs.buttons.prev.onClick) {
                                _this.wizardConfigs.buttons.prev.onClick();
                            }
                        }

                        return false;
                    };
                }(stepName, i, validationFunction));

                $("#" + stepName + "-nav-bar").append(wizardPreButtonElement);
                if (clear) {
                    $("#" + stepName + "-nav-bar").parent().append("<div style='clear:both'></div>");
                }
            }

        },

        /**
         * Creates a "next" button.
         *
         * @param {Integer} i Step number.
         * @param [boolean] whether to add a clear div at the end
         * @param [validationFunction] function test whether the button should be allowed to proceed
         */
        _createNextButton: function(i, clear, validationFunction) {

            // only apply validation if configured to do so
            if (this.wizardConfigs.buttons && this.wizardConfigs.buttons.next) {
                if (!this.wizardConfigs.buttons.next.validateOnClick) {
                    validationFunction = null;
                }
            }

            var stepName = "step" + i;
            var _this = this;

            var wizardNextButtonTemplateDescriptor = this.view.getTemplateDescriptor("wizardNextButton");
            if (wizardNextButtonTemplateDescriptor) {
                var wizardNextButtonElement = _this.view.tmpl(wizardNextButtonTemplateDescriptor, {});
                wizardNextButtonElement.attr("id", stepName + '-button-next');
                wizardNextButtonElement.addClass("alpaca-wizard-button-next");
                if (_this.buttonBeautifier) {
                    _this.buttonBeautifier.call(_this, wizardNextButtonElement, this.wizardNextIcon,true );
                }

                // when they click "next", run validation function first to make sure they're allowed to proceed
                wizardNextButtonElement.click(function(stepName, stepCount, validationFunction) {

                    return function() {
                        var valid = true;

                        if (validationFunction)
                        {
                            valid = validationFunction(stepName, stepCount);
                        }

                        if (valid) {
                            $("#" + stepName).hide();
                            $("#step" + (stepCount + 1)).show();
                            _this._selectStep(stepCount + 1);

                            // TODO: fire click handler?
                            if (_this.wizardConfigs.buttons.next && _this.wizardConfigs.buttons.next.onClick) {
                                _this.wizardConfigs.buttons.next.onClick();
                            }
                        }

                        return false;
                    };
                }(stepName, i, validationFunction));

                $("#" + stepName + "-nav-bar").append(wizardNextButtonElement);
                if (clear) {
                    $("#" + stepName + "-nav-bar").parent().append("<div style='clear:both'></div>");
                }
            }
        },

        /**
         * Creates a "done" button.
         *
         * @param {Integer} i Step number.
         * @param [boolean] whether to add a clear div at the end
         * @param [validationFunction] function test whether the button should be allowed to proceed
         */
        _createDoneButton: function(i, clear, validationFunction) {

            // only apply validation if configured to do so
            if (this.wizardConfigs.buttons && this.wizardConfigs.buttons.done) {
                if (!this.wizardConfigs.buttons.done.validateOnClick) {
                    validationFunction = null;
                }
            }

            var stepName = "step" + i;
            var _this = this;

            var wizardDoneButtonTemplateDescriptor = this.view.getTemplateDescriptor("wizardDoneButton");
            if (wizardDoneButtonTemplateDescriptor) {
                var wizardDoneButtonElement = _this.view.tmpl(wizardDoneButtonTemplateDescriptor, {});
                wizardDoneButtonElement.attr("id", stepName + '-button-done');
                wizardDoneButtonElement.addClass("alpaca-wizard-button-done");
                if (_this.buttonBeautifier) {
                    _this.buttonBeautifier.call(_this, wizardDoneButtonElement, this.wizardDoneIcon,true );
                }

                // when they click "done", run validation function first to make sure they're allowed to proceed
                wizardDoneButtonElement.click(function(stepName, stepCount, validationFunction) {

                    return function() {
                        var valid = true;

                        if (validationFunction)
                        {
                            valid = validationFunction(stepName, stepCount);
                        }

                        if (valid) {
                            $("#" + stepName + "-nav-bar").append(wizardDoneButtonElement);
                            if (clear) {
                                $("#" + stepName + "-nav-bar").parent().append("<div style='clear:both'></div>");
                            }

                            // TODO: fire click handler?
                            if (_this.wizardConfigs.buttons.done && _this.wizardConfigs.buttons.done.onClick) {
                                _this.wizardConfigs.buttons.done.onClick();
                            }
                        }

                        return false;
                    };
                }(stepName, i, validationFunction));

                $("#" + stepName + "-nav-bar").append(wizardDoneButtonElement);
                if (clear) {
                    $("#" + stepName + "-nav-bar").parent().append("<div style='clear:both'></div>");
                }
            }

        },

        /**
         * Selects a wizard step.
         *
         * @param {Integer} i Step number.
         */
        _selectStep: function(i) {
            var unCurrentStepElem = $("#" + this.getId() + "-wizard-status-bar" + " li");
            unCurrentStepElem.removeClass("current current-has-next");
            this.getStyleInjection("wizardUnCurrentStep",unCurrentStepElem);
            var currentStepElem = $("#stepDesc" + i);
            currentStepElem.addClass("current");
            this.getStyleInjection("wizardCurrentStep",currentStepElem);
            if (i < this.totalSteps - 1) {
                $("#stepDesc" + i).addClass("current-has-next");
            }
        },//__BUILDER_HELPERS

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
        },

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
         * @see Alpaca.Field#getType
         */
        getType: function() {
            return "object";
        },

        /**
         * @see Alpaca.Field#getFieldType
         */
        getFieldType: function() {
            return "object";
        }//__END_OF_BUILDER_HELPERS

    });

    // Additional Registrations
    Alpaca.registerMessages({
        "tooManyProperties": "The maximum number of properties ({0}) has been exceeded.",
        "tooFewProperties": "There are not enough properties ({0} are required)"
    });

    Alpaca.registerFieldClass("object", Alpaca.Fields.ObjectField);
    Alpaca.registerDefaultSchemaFieldMapping("object", "object");
})(jQuery);
