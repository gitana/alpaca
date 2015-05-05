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

            if (Alpaca.isEmpty(this.data))
            {
                return;
            }

            if (this.data === "")
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
            // we null out those values
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
         * @see Alpaca.Field#getValue
         */
        getValue: function()
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
                        else if (Alpaca.isArray(fieldValue) || Alpaca.isObject(fieldValue) || Alpaca.isNumber(fieldValue))
                        {
                            assignedValue = fieldValue;
                        }
                        else if (fieldValue)
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

            // wrap into waterfall functions
            var propertyFunctions = [];
            for (var propertyId in properties)
            {
                var itemData = null;
                if (self.data)
                {
                    itemData = self.data[propertyId];
                }

                var pf = (function(propertyId, itemData, extraDataProperties)
                {
                    return function(callback)
                    {
                        // only allow this if we have data, otherwise we end up with circular reference
                        self.resolvePropertySchemaOptions(propertyId, function (schema, options, circular) {

                            // we only allow addition if the resolved schema isn't circularly referenced
                            // or the schema is optional
                            if (circular) {
                                return Alpaca.throwErrorWithCallback("Circular reference detected for schema: " + JSON.stringify(schema), _this.errorCallback);
                            }

                            if (!schema) {
                                Alpaca.logDebug("Unable to resolve schema for property: " + propertyId);
                            }

                            self.createItem(propertyId, schema, options, itemData, null, function (addedItemControl) {

                                if (options.hasOwnProperty("order")) {
                                    order = parseInt(options.order, 10);
                                    if (order === order) {
                                        // order is not NaN
                                        items.splice(order, 0, addedItemControl);
                                    } else {
                                        items.push(addedItemControl);
                                    }
                                } else {
                                    items.push(addedItemControl);
                                }

                                // remove from extraDataProperties helper
                                delete extraDataProperties[propertyId];

                                // by the time we get here, we may have constructed a very large child chain of
                                // sub-dependencies and so we use nextTick() instead of a straight callback so as to
                                // avoid blowing out the stack size
                                Alpaca.nextTick(function () {
                                    callback();
                                });
                            });
                        });
                    };

                })(propertyId, itemData, extraDataProperties);

                propertyFunctions.push(pf);
            }

            Alpaca.series(propertyFunctions, function(err) {
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
                        cb();
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
                        if (fieldChain[i].schema)
                        {
                            if ( (fieldChain[i].schema.id === referenceId) || (fieldChain[i].schema.id === "#" + referenceId))
                            {
                                refCount++;
                            }
                            else if ( (fieldChain[i].schema["$ref"] === referenceId))
                            {
                                refCount++;
                            }
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
                "message": status ? "" : Alpaca.substituteTokens(this.getMessage("tooManyItems"), [this.schema.items.minProperties]),
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
                self.registerChild(child, ((index != null) ? index + 1 : null));

                // insert into dom
                if (!index)
                {
                    // insert first into container
                    $(self.container).append(child.getFieldEl());
                }
                else
                {
                    // insert at a specific index
                    var existingElement = self.getContainerEl().children("[data-alpaca-container-item-index='" + index + "']");
                    if (existingElement && existingElement.length > 0)
                    {
                        // insert after
                        existingElement.after(child.getFieldEl());
                    }
                }

                // updates child dom marker elements
                self.updateChildDOMElements();

                // update the array item toolbar state
                //self.updateToolbars();

                // refresh validation state
                self.refreshValidationState(true, function() {

                    // trigger update
                    self.triggerUpdate();

                    if (callback)
                    {
                        callback();
                    }

                });
            });
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

            this.children = $.grep(this.children, function(val, index) {
                return (val.getId() != propertyId);
            });

            var childField = this.childrenById[propertyId];

            delete this.childrenById[propertyId];
            if (childField.propertyId)
            {
                delete this.childrenByPropertyId[childField.propertyId];
            }

            childField.destroy();

            this.refreshValidationState(true, function() {

                // trigger update handler
                self.triggerUpdate();

                if (callback)
                {
                    callback();
                }
            });
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
                                return function(cb)
                                {
                                    field.refreshValidationState(true, function() {
                                        cb();
                                    });
                                }
                            }(fields[i]));
                        }

                        // run all validations
                        Alpaca.series(fns, function() {

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
            var col = [];
            do
            {
                // collect fields in this step
                col = [];
                for (var propertyId in stepBindings)
                {
                    if (stepBindings[propertyId] == step)
                    {
                        if (this.childrenByPropertyId && this.childrenByPropertyId[propertyId])
                        {
                            col.push(this.childrenByPropertyId[propertyId].field);
                        }
                    }
                }

                if (col.length > 0)
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

                    // move elements in
                    for (var i = 0; i < col.length; i++)
                    {
                        $(stepEl).append(col[i]);
                    }

                    step++;
                }
            }
            while (col.length > 0);

            // now run the normal wizard
            this.wizard();
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

                // updates child dom marker elements
                self.updateChildDOMElements();

                // update the action bar bindings
                $(sourceContainer).find("[data-alpaca-array-actionbar-item-index='" + sourceIndex + "']").attr("data-alpaca-array-actionbar-item-index", targetIndex);
                $(targetContainer).find("[data-alpaca-array-actionbar-item-index='" + targetIndex + "']").attr("data-alpaca-array-actionbar-item-index", sourceIndex);

                // refresh validation state
                self.refreshValidationState();

                // trigger update
                self.triggerUpdate();

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
