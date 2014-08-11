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

            this.options.toolbarStyle = Alpaca.isEmpty(this.view.toolbarStyle) ? "button" : this.view.toolbarStyle;
            this.options.actionbarStyle = Alpaca.isEmpty(this.view.actionbarStyle) ? "top" : this.view.actionbarStyle;

            // determine whether we are using "ruby on rails" compatibility mode
            this.options.rubyrails = false;
            if (this.parent && this.parent.options && this.parent.options.form && this.parent.options.form.attributes)
            {
                if (!Alpaca.isEmpty(this.parent.options.form.attributes.rubyrails))
                {
                    this.options.rubyrails = true;
                }
            }

            if (!this.options.items)
            {
                this.options.items = {};
            }

            var toolbarSticky = false;

            if (!Alpaca.isEmpty(this.view.toolbarSticky))
            {
                toolbarSticky = this.view.toolbarSticky;
            }

            if (!Alpaca.isEmpty(this.options.toolbarSticky))
            {
                toolbarSticky = this.options.toolbarSticky;
            }

            if (Alpaca.isEmpty(this.options.items.showMoveUpItemButton))
            {
                this.options.items.showMoveUpItemButton = true;
            }

            if (Alpaca.isEmpty(this.options.items.showMoveDownItemButton))
            {
                this.options.items.showMoveDownItemButton = true;
            }

            this.options.toolbarSticky = toolbarSticky;

            // Enable forceRevalidation option so that any change in children will trigger parent's revalidation.
            if (this.schema.items && this.schema.uniqueItems)
            {
                Alpaca.mergeObject(this.options, {
                    "forceRevalidation" : true
                });
            }

            if (typeof(this.data) === "undefined")
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
                Alpaca.logWarn("ArrayField data is not an array: " + JSON.stringify(this.data, null, "  "));
                return;
            }

            // determine which actions to add into the top array toolbar
            self.toolbar = {};
            if (self.options.toolbar)
            {
                for (var k in self.options.toolbar) {
                    self.toolbar[k] = self.options.toolbar[k];
                }
            }
            if (!self.toolbar.actions)
            {
                self.toolbar.actions = [];
                self.toolbar.actions.push({
                    "label": (self.options.items && self.options.items.addItemLabel) ? self.options.items.addItemLabel : "Add Item",
                    "action": "add",
                    "iconClass": self.addIcon,
                    "click": function(key, action)
                    {
                        self.resolveItemSchemaOptions(function(itemSchema, itemOptions) {
                            var itemData = Alpaca.createEmptyDataInstance(itemSchema);
                            self.addItem(0, itemSchema, itemOptions, itemData, function() {
                                // all done
                            });
                        });

                    }
                });
            }

            self.actionbar = {};
            if (self.options.actionbar)
            {
                for (var k2 in self.options.actionbar) {
                    self.actionbar[k2] = self.options.actionbar[k2];
                }
            }
            if (!self.actionbar.actions)
            {
                self.actionbar.actions = [];
                self.actionbar.actions.push({
                    //"label": "Add",
                    "action": "add",
                    "iconClass": self.addIcon,
                    "click": function(key, action, itemIndex) {

                        self.resolveItemSchemaOptions(function(itemSchema, itemOptions) {
                            var itemData = Alpaca.createEmptyDataInstance(itemSchema);
                            self.addItem(itemIndex + 1, itemSchema, itemOptions, itemData, function() {
                                // all done
                            });
                        });

                    }
                });
                self.actionbar.actions.push({
                    //"label": "Remove",
                    "action": "remove",
                    "iconClass": self.removeIcon,
                    "click": function(key, action, itemIndex) {

                        self.removeItem(itemIndex, function() {
                            // all done
                        });

                    }
                });
                self.actionbar.actions.push({
                    //"label": "Up",
                    "action": "up",
                    "iconClass": self.upIcon,
                    "click": function(key, action, itemIndex) {

                        self.moveItem(itemIndex, true, function() {
                            // all done
                        });

                    }
                });
                self.actionbar.actions.push({
                    //"label": "Down",
                    "action": "down",
                    "iconClass": self.downIcon,
                    "click": function(key, action, itemIndex) {

                        self.moveItem(itemIndex, false, function() {
                            // all done
                        });

                    }
                });
            }

            var len     = this.data.length;
            var data    = $.extend(true, {}, this.data);
            data.length = len;
            this.data   = Array.prototype.slice.call(data);
        },

        /**
         * Picks apart the array and set onto child fields.
         * @see Alpaca.ContainerField#setup
         */
        setValue: function(data)
        {
            var self = this;

            if (!data || !Alpaca.isArray(data))
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
                        self.removeItem(i);
                    }
                }
            }
            while (i < self.children.length);

            // if the number of items in the data is greater than the number of existing child elements
            // then we need to add the new fields
            if (i < data.length)
            {
                self.resolveItemSchemaOptions(function(schema, options) {

                    if (!schema)
                    {
                        Alpaca.logDebug("Unable to resolve schema for item: " + i);
                    }

                    // waterfall functions
                    var funcs = [];

                    while (i < data.length)
                    {
                        var f = (function(i, data)
                        {
                            return function(callback)
                            {
                                self.addItem(i, schema, options, data[i], function() {

                                    // by the time we get here, we may have constructed a very large child chain of
                                    // sub-dependencies and so we use nextTick() instead of a straight callback so as to
                                    // avoid blowing out the stack size
                                    Alpaca.nextTick(function() {
                                        callback();
                                    });

                                });
                            };
                        })(i, data[i]);

                        funcs.push(f);

                        i++;
                    }

                    Alpaca.series(funcs, function() {
                        // nothing
                    });
                });
            }

        },

        /**
         * @see Alpaca.ContainerField#getValue
         */
        getValue: function()
        {
            // if we're empty and we're also not required, then we hand back undefined
            if (this.children.length === 0 && !this.schema.required)
            {
                return;
            }

            // otherwise, construct an array and had it back
            var o = [];
            for (var i = 0; i < this.children.length; i++)
            {
                var v = this.children[i].getValue();

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

            if (self.data)
            {
                // all items within the array have the same schema and options
                // so we only need to load this once
                self.resolveItemSchemaOptions(function(schema, options) {

                    // waterfall functions
                    var funcs = [];
                    for (var index = 0; index < self.data.length; index++)
                    {
                        var value = self.data[index];

                        var pf = (function(index, value)
                        {
                            return function(callback)
                            {
                                self.createItem(index, schema, options, value, function(addedItemControl) {

                                    items.push(addedItemControl);

                                    // by the time we get here, we may have constructed a very large child chain of
                                    // sub-dependencies and so we use nextTick() instead of a straight callback so as to
                                    // avoid blowing out the stack size
                                    Alpaca.nextTick(function() {
                                        callback();
                                    });

                                });
                            };

                        })(index, value);

                        funcs.push(pf);
                    }

                    Alpaca.series(funcs, function(err) {

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
         * @param insertAfterId
         * @param postRenderCallback
         * @return {*}
         * @private
         */
        createItem: function(index, itemSchema, itemOptions, itemData, postRenderCallback)
        {
            var self = this;

            if (self._validateEqualMaxItems())
            {
                if (itemOptions === null && self.options && self.options.fields && self.options.fields["item"])
                {
                    itemOptions = self.options.fields["item"];
                }

                var containerElem = $("<div></div>");
                containerElem.alpaca({
                    "data" : itemData,
                    "options": itemOptions,
                    "schema" : itemSchema,
                    "view" : this.view.id ? this.view.id : this.view,
                    "connector": this.connector,
                    "error": function(err)
                    {
                        self.destroy();

                        self.errorCallback.call(_this, err);
                    },
                    "notTopLevel":true,
                    "render": function(fieldControl, cb) {
                        // render
                        fieldControl.parent = self;
                        // setup item path
                        fieldControl.path = self.path + "[" + index + "]";
                        fieldControl.nameCalculated = true;
                        fieldControl.render(null, function() {

                            // remember the control
                            self.refreshValidationState();
                            self.updatePathAndName();

                            // trigger update on the parent array
                            self.triggerUpdate();

                            if (cb)
                            {
                                cb();
                            }
                        });
                    },
                    "postRender": function(control)
                    {
                        // PR: https://github.com/gitana/alpaca/pull/124
                        if (Alpaca.isFunction(self.options.items.postRender))
                        {
                            self.options.items.postRender(containerElem);
                        }

                        if (postRenderCallback)
                        {
                            postRenderCallback(control);
                        }
                    }
                });

                return containerElem;
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

            var itemOptions;
            if (_this.options && _this.options.fields && _this.options.fields["item"]) {
                itemOptions = _this.options.fields["item"];
            }
            var itemSchema;
            if (_this.schema && _this.schema.items) {
                itemSchema = _this.schema.items;
            }

            // handle $ref
            if (itemSchema && itemSchema["$ref"])
            {
                var referenceId = itemSchema["$ref"];

                var topField = this;
                var fieldChain = [topField];
                while (topField.parent)
                {
                    topField = topField.parent;
                    fieldChain.push(topField);
                }

                var originalItemSchema = itemSchema;
                var originalItemOptions = itemOptions;

                Alpaca.loadRefSchemaOptions(topField, referenceId, function(itemSchema, itemOptions) {

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

                    var resolvedItemSchema = {};
                    if (originalItemSchema) {
                        Alpaca.mergeObject(resolvedItemSchema, originalItemSchema);
                    }
                    if (itemSchema)
                    {
                        Alpaca.mergeObject(resolvedItemSchema, itemSchema);
                    }
                    delete resolvedItemSchema.id;

                    var resolvedItemOptions = {};
                    if (originalItemOptions) {
                        Alpaca.mergeObject(resolvedItemOptions, originalItemOptions);
                    }
                    if (itemOptions)
                    {
                        Alpaca.mergeObject(resolvedItemOptions, itemOptions);
                    }

                    callback(resolvedItemSchema, resolvedItemOptions, circular);
                });
            }
            else
            {
                callback(itemSchema, itemOptions);
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
                "message": status ? "" : this.view.getMessage("valueNotUnique"),
                "status": status
            };

            status = this._validateMaxItems();
            valInfo["tooManyItems"] = {
                "message": status ? "" : Alpaca.substituteTokens(this.view.getMessage("tooManyItems"), [this.schema.items.maxItems]),
                "status": status
            };

            status = this._validateMinItems();
            valInfo["notEnoughItems"] = {
                "message": status ? "" : Alpaca.substituteTokens(this.view.getMessage("notEnoughItems"), [this.schema.items.minItems]),
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
            if (this.schema.items && this.schema.items.maxItems)
            {
                if (this.getSize() >= this.schema.items.maxItems)
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
            if (this.schema.items && this.schema.items.minItems)
            {
                if (this.getSize() <= this.schema.items.minItems)
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
            if (this.schema.items && this.schema.items.minItems)
            {
                if (this.getSize() < this.schema.items.minItems)
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
            if (this.schema.items && this.schema.items.maxItems)
            {
                if (this.getSize() > this.schema.items.maxItems)
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
                for (var i = 0, l = this.children.length; i < l; ++i)
                {
                    if (!hash.hasOwnProperty(this.children[i]))
                    {
                        hash[this.children[i]] = true;
                    }
                    else
                    {
                        return false;
                    }
                }
            }

            return true;
        },

        findAction: function(actionsArray, actionKey)
        {
            var action = null;

            $.each(actionsArray, function(i, v) {
                if (v.action == actionKey) // jshint ignore:line
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

                        if (parent.prePath && Alpaca.startsWith(v.path,parent.prePath))
                        {
                            v.prePath = v.path;
                            v.path = v.path.replace(parent.prePath,parent.path);
                        }

                        // re-calculate name
                        if (parent.preName && Alpaca.startsWith(v.name, parent.preName))
                        {
                            v.preName = v.name;
                            v.name = v.name.replace(parent.preName, parent.name);
                            if (v.field)
                            {
                                $(v.field).attr('name', v.name);
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
                    if (lastSegment.indexOf("[") < 0 && lastSegment.indexOf("]") < 0)
                    {
                        lastSegment = lastSegment.substring(lastSegment.indexOf("[") + 1, lastSegment.indexOf("]"));
                    }

                    if (lastSegment !== i)
                    {
                        v.prePath = v.path;
                        v.path = v.path.substring(0, idx) + "/[" + i + "]";
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
                            $(v.field).attr('name', v.parent.name);
                        }
                        else
                        {
                            $(v.field).attr('name', v.name);
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

            var toolbar = $(this.getFieldEl()).find(".alpaca-array-toolbar[data-alpaca-array-toolbar-field-id='" + self.getId() + "']");
            if (this.children.length > 0)
            {
                // hide toolbar
                $(toolbar).hide();
            }
            else
            {
                // show toolbar
                $(toolbar).show();

                // CLICK: array toolbar buttons
                $(toolbar).find("[data-alpaca-array-toolbar-action]").each(function() {

                    var actionKey = $(this).attr("data-alpaca-array-toolbar-action");
                    var action = self.findAction(self.toolbar.actions, actionKey);
                    if (action)
                    {
                        $(this).off().click(function() {
                            action.click.call(self, actionKey, action);
                        });
                    }
                });
            }


            //
            // ACTIONBAR
            //

            // if we're not using the "sticky" toolbar, then show and hide the item action buttons when hovered
            if (!this.options.toolbarSticky)
            {
                // find each item
                var items = this.getFieldEl().find(".alpaca-container-item");
                $(items).each(function(itemIndex) {

                    // find the actionbar for this item
                    var actionbar = $(self.getFieldEl()).find(".alpaca-array-actionbar[data-alpaca-array-actionbar-field-id='" + self.getId() +  "'][data-alpaca-array-actionbar-item-index='" + itemIndex + "']");
                    if (actionbar && actionbar.length > 0)
                    {
                        $(this).hover(function() {
                            $(actionbar).show();
                        }, function() {
                            $(actionbar).hide();
                        });

                        $(actionbar).hide();
                    }
                });
            }
            else
            {
                // otherwise, always show the actionbars
                $(self.getFieldEl()).find(".alpaca-array-actionbar[data-alpaca-array-actionbar-field-id='" + self.getId() +  "']").show();
            }

            // CLICK: actionbar buttons
            var actionbars = $(this.getFieldEl()).find(".alpaca-array-actionbar[data-alpaca-array-actionbar-field-id='" + self.getId() + "']");
            $(actionbars).each(function() {

                var targetIndex = $(this).attr("data-alpaca-array-actionbar-item-index");
                if (typeof(targetIndex) === "string")
                {
                    targetIndex = parseInt(targetIndex, 10);
                }

                // bind button click handlers
                $(this).find("[data-alpaca-array-actionbar-action]").each(function() {

                    var actionKey = $(this).attr("data-alpaca-array-actionbar-action");
                    var action = self.findAction(self.actionbar.actions, actionKey);
                    if (action)
                    {
                        $(this).off().click(function() {
                            action.click.call(self, actionKey, action, targetIndex);
                        });
                    }
                });

                // if we're at max capacity, disable "add" buttons
                if (self._validateEqualMaxItems())
                {
                    $(this).find("[data-alpaca-array-actionbar-action='add']").each(function(index) {
                        $(this).removeClass('alpaca-button-disabled');
                        self.fireCallback("enableButton", this);
                    });
                }
                else
                {
                    $(this).find("[data-alpaca-array-actionbar-action='add']").each(function(index) {
                        $(this).addClass('alpaca-button-disabled');
                        self.fireCallback("disableButton", this);
                    });
                }

                // if we're at min capacity, disable "remove" buttons
                if (self._validateEqualMinItems())
                {
                    $(this).find("[data-alpaca-array-actionbar-action='remove']").each(function(index) {
                        $(this).removeClass('alpaca-button-disabled');
                        self.fireCallback("enableButton", this);
                    });
                }
                else
                {
                    $(this).find("[data-alpaca-array-actionbar-action='remove']").each(function(index) {
                        $(this).addClass('alpaca-button-disabled');
                        self.fireCallback("disableButton", this);
                    });
                }
            });
            // first actionbar has its "move up" button disabled
            $(actionbars).first().find("[data-alpaca-array-actionbar-action='up']").each(function() {
                $(this).addClass('alpaca-button-disabled');
                self.fireCallback("disableButton", this);
            });
            // last actionbar has its "move down" button disabled
            $(actionbars).last().find("[data-alpaca-array-actionbar-action='down']").each(function() {
                $(this).addClass('alpaca-button-disabled');
                self.fireCallback("disableButton", this);
            });

        },


        ///////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // DYNAMIC METHODS
        //
        ///////////////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Adds an item to the array.
         *
         * This gets called automatically from setValue() when the data array length exceeds the number of
         * child fields.
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
                self.createItem(index, schema, options, data, function(child) {

                    // register the child
                    self.registerChild(child, index);

                    // insert into dom
                    if (index === 0)
                    {
                        // insert first into container
                        $(self.container).append(child.getFieldEl());
                    }
                    else
                    {
                        // insert at a specific index
                        var existingElement = self.getContainerEl().children("[data-alpaca-container-item-index='" + (index-1) + "']");
                        if (existingElement && existingElement.length > 0)
                        {
                            // insert after
                            existingElement.after(child.getFieldEl());
                        }
                    }

                    // updates child dom marker elements
                    self.updateChildDOMElements();

                    // update the array item toolbar state
                    self.updateToolbars();

                    // refresh validation state
                    self.refreshValidationState();

                    // trigger update
                    self.triggerUpdate();

                    if (callback)
                    {
                        callback();
                    }
                });
            }
        },

        /**
         * Removes an item from the array.
         *
         * This gets called automatically from setValue() when the number of items being set is less than the number
         * of field elements.

         * @param {Number} childIndex index of the child to be removed
         * @param [Function] callback called after the child is added
         */
        removeItem: function(childIndex, callback)
        {
            var self = this;

            if (this._validateEqualMinItems())
            {
                // unregister the child
                self.unregisterChild(childIndex);

                // remove from DOM
                self.getContainerEl().children("[data-alpaca-container-item-index='" + childIndex + "']").remove();

                // updates child dom marker elements
                self.updateChildDOMElements();

                // update the array item toolbar state
                self.updateToolbars();

                // refresh validation state
                self.refreshValidationState();

                // trigger update
                self.triggerUpdate();

                if (callback)
                {
                    callback();
                }
            }
        },

        /**
         * Dynamically moves a child up or down.
         *
         * @param {Number} sourceIndex the index of the child to be moved
         * @param {Boolean} isUp true if the moving is upwards
         * @param [Function] callback called after the child is added
         */
        moveItem: function(sourceIndex, isUp, callback)
        {
            var self = this;

            if (typeof(sourceIndex) === "string") {
                sourceIndex = parseInt(sourceIndex, 10);
            }

            // determine the "targetIndex"
            var targetIndex = sourceIndex;
            if (isUp) {
                targetIndex -= 1;
            } else {
                targetIndex += 1;
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

                // update the array item toolbar state
                self.updateToolbars();

                // refresh validation state
                self.refreshValidationState();

                // trigger update
                self.triggerUpdate();

                if (callback)
                {
                    callback();
                }
            };

            // swap divs visually
            Alpaca.animatedSwap(sourceContainer, targetContainer, 500, function() {
                onComplete();
            });
        },

        //__BUILDER_HELPERS

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
                        "type": "object",
                        "properties": {
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
                        "type": "object",
                        "fields": {
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
                        "description": "Array item toolbar will be aways on if true.",
                        "type": "boolean",
                        "default": false
                    },
                    "items": {
                        "title": "Array Items",
                        "description": "Options for array items.",
                        "type": "object",
                        "properties": {
                            "extraToolbarButtons": {
                                "title": "Extra Toolbar buttons",
                                "description": "Buttons to be added next to add/remove/up/down, see examples",
                                "type": "array",
                                "default": undefined
                            },
                            "moveUpItemLabel": {
                                "title": "Move Up Item Label",
                                "description": "The label to use for the toolbar's 'move up' button.",
                                "type": "string",
                                "default": "Move Up"
                            },
                            "moveDownItemLabel": {
                                "title": "Move Down Item Label",
                                "description": "The label to use for the toolbar's 'move down' button.",
                                "type": "string",
                                "default": "Move Down"
                            },
                            "removeItemLabel": {
                                "title": "Remove Item Label",
                                "description": "The label to use for the toolbar's 'remove item' button.",
                                "type": "string",
                                "default": "Remove Item"
                            },
                            "addItemLabel": {
                                "title": "Add Item Label",
                                "description": "The label to use for the toolbar's 'add item' button.",
                                "type": "string",
                                "default": "Add Item"
                            },
                            "showMoveDownItemButton": {
                                "title": "Show Move Down Item Button",
                                "description": "Whether to show to the 'Move Down' button on the toolbar.",
                                "type": "boolean",
                                "default": true
                            },
                            "showMoveUpItemButton": {
                                "title": "Show Move Up Item Button",
                                "description": "Whether to show the 'Move Up' button on the toolbar.",
                                "type": "boolean",
                                "default": true
                            }
                        }
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
        },
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
         * @see Alpaca.ContainerField#getType
         */
        getType: function() {
            return "array";
        }//__END_OF_BUILDER_HELPERS
    });

    Alpaca.registerMessages({
        "notEnoughItems": "The minimum number of items is {0}",
        "tooManyItems": "The maximum number of items is {0}",
        "valueNotUnique": "Values are not unique",
        "notAnArray": "This value is not an Array"
    });
    Alpaca.registerFieldClass("array", Alpaca.Fields.ArrayField);
    Alpaca.registerDefaultSchemaFieldMapping("array", "array");

})(jQuery);
