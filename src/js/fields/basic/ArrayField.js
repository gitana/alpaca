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

            if (typeof(this.options.dragAndDrop) === "undefined") {
                this.options.dragAndDrop = Alpaca.isEmpty(this.view.dragAndDrop) ? Alpaca.defaultDragAndDrop : this.view.dragAndDrop;
            }

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
                            "dragAndDrop": self.options.dragAndDrop,
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

                    key = Alpaca.hashCode(key);

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
            // DRAG AND DROP
            //

            if (self.options.dragAndDrop)
            {
                // enable drag and drop
                document.addEventListener("dragenter", function (event) {
                    event.preventDefault();
                }, false);
    
                document.addEventListener("dragover", function (event) {
                    event.preventDefault();
                }, false);
    
                $(self.getFieldEl()).off().on("drop", function(ev) {
                    ev.preventDefault();

                    var parentFieldId = ev.originalEvent.dataTransfer.getData("parentFieldId");
                    if (parentFieldId == self.getId())
                    {
                        var closestItem = ev.target.closest(".alpaca-container-item[data-alpaca-container-item-parent-field-id='" + parentFieldId +  "']");
                        if (closestItem) {
                            var targetIndex = closestItem.dataset.alpacaContainerItemIndex;
                            var sourceIndex = ev.originalEvent.dataTransfer.getData("sourceIndex");
                            
                            self.moveItem(sourceIndex, targetIndex);
                            ev.stopPropagation();
                        }
                    }
                });

                var items = self.getFieldEl().find(".alpaca-container-item[data-alpaca-container-item-parent-field-id='" + self.getId() +  "']");
                $(items).each(function(itemIndex) {
                    var target = null;
                    $(this).attr("draggable", true);
                    $(this).off().on("mousedown", function(ev) 
                    {
                        ev.stopPropagation();

                        target = ev.target;
                    });
                    $(this).on("dragstart", function(ev) 
                    {
                        ev.stopPropagation();

                        // if this item's move icon contains the target
                        var dragHandle = $(this).children(".alpaca-array-item-move")[0];
                        if (dragHandle && dragHandle.contains(target)) 
                        {
                            var event = ev.originalEvent;
                            event.dataTransfer.setData("sourceIndex", this.dataset.alpacaContainerItemIndex);
                            event.dataTransfer.setData("parentFieldId", this.dataset.alpacaContainerItemParentFieldId);
    
                            // find droppable area and highlight
                            $(this).siblings(".alpaca-container-item").each(function() {
                                $(this).children(".alpaca-array-item-move").css({
                                    "color": "#2CEAA3"
                                });
                            });
                        }
                        else 
                        {
                            ev.preventDefault();
                        }
                    });
                    $(this).on("dragend", function(ev) 
                    {
                        ev.stopPropagation();

                        $(".alpaca-array-item-move").css({
                            "color": "#333"
                        });
                    });
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
                    "dragAndDrop": {
                        "title": "Drag and Drop",
                        "description": "If true, drag and drop is enabled for array items.",
                        "type": "boolean",
                        "default": false
                    },
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
                    "dragAndDrop": {
                        "type": "checkbox"
                    },
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
