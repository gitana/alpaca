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
            this.base();

            this.options.toolbarStyle = Alpaca.isEmpty(this.view.toolbarStyle) ? "button" : this.view.toolbarStyle;

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

            if (Alpaca.isEmpty(this.data))
            {
                return;
            }

            if (!Alpaca.isArray(this.data))
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

                        if (!Alpaca.isArray(this.data))
                        {
                            Alpaca.logWarn("ArrayField parsed data but it was not an array: " + JSON.stringify(this.data));
                            return;
                        }

                    }
                    catch (e)
                    {
                        this.data = [this.data];
                    }
                }
            }
        },

        /**
         * Picks apart the array and set onto child fields.
         * @see Alpaca.ContainerField#setup
         */
        setValue: function(data)
        {
            var _this = this;

            if (!data || !Alpaca.isArray(data))
            {
                return;
            }

            // set fields
            for (var i = 0; i < this.children.length; i++)
            {
                var childField = this.children[i];
                if (data.length > i)
                {
                    childField.setValue(data[i]);
                }
                else
                {
                    this.removeItem(childField.id); //remove child items if there are more children than in data
                }
            }

            // if the number of items in the data is greater than the number of existing child elements
            // then we need to add the new fields


            if (i < data.length)
            {
                _this.resolveItemSchemaOptions(function(schema, options) {

                    // waterfall functions
                    var funcs = [];

                    while (i < data.length)
                    {
                        var f = (function(i, data)
                        {
                            return function(callback)
                            {
                                _this.addItem(i, schema, options, data[i], null, false, function() {

                                    // by the time we get here, we may have constructed a very large child chain of
                                    // sub-dependencies and so we use nextTick() instead of a straight callback so as to
                                    // avoid blowing out the stack size
                                    //Alpaca.nextTick(function() {
                                        callback();
                                    //});

                                });
                            };
                        })(i, data[i]);

                        funcs.push(f);

                        i++;
                    };

                    /*
                    Alpaca.series(funcs, function() {
                        // TODO: anything once finished?
                    });
                    */
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
         * Prepares the model for use in rendering the container.
         *
         * @param callback function(model)
         */
        prepareContainerModel: function(callback)
        {
            var self = this;

            this.base(function(model) {

                // determine which actions to add into the top array toolbar
                model.arrayToolbarActions = [];
                model.arrayToolbarActions.push({
                    "label": (self.options.items && self.options.items.addItemLabel) ? self.options.items.addItemLabel : "Add Item",
                    "action": "add",
                    "iconClass": self.addIcon,
                    "click": function()
                    {
                        self.resolveItemSchemaOptions(function(schema, options) {
                            /*
                            self.addItem(0, schema, options, "", "id", true, function(addedField) {
                                //_this.enrichElements(addedField.getFieldEl());
                            });
                            */
                            alert("ADDED ITEM");
                        });

                        /*
                        self.resolveItemSchemaOptions(function(schema, options) {
                            arrayField.addItem(containerElem.index() + 1, schema, options, null, id, true, function(addedField) {
                                arrayField.enrichElements(addedField.getFieldEl());
                            });
                        });
                        */

                        return false;
                    }
                });

                // determine which actions to add into each array item
                model.arrayItemActions = [{
                    //"label": "Add",
                    "action": "add",
                    "iconClass": self.addIcon,
                    "click": function() {
                        alert("Item add");
                    }
                }, {
                    //"label": "Remove",
                    "action": "remove",
                    "iconClass": self.removeIcon,
                    "click": function() {
                        alert("Item remove");
                    }
                }, {
                    //"label": "Up",
                    "action": "up",
                    "iconClass": self.upIcon,
                    "click": function() {
                        alert("Item up");
                    }
                }, {
                    //"label": "Down",
                    "action": "down",
                    "iconClass": self.downIcon,
                    "click": function() {
                        alert("Item down");
                    }
                }];

                callback(model);
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

            // mark field container as empty by default
            // the "addItem" method below gets the opportunity to unset this
            //$(self.fieldContainer).addClass("alpaca-fieldset-items-container-empty");

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
                                self.createItem(index, schema, options, value, false, false, function(addedItemControl) {

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

                        self.updateToolbarItemsStatus();

                        callback(items);
                    });

                });
            }
            else
            {
                self.updateToolbarItemsStatus();

                callback();
            }
        },

        /**
         * Workhorse method for createItem.
         *
         * @param index
         * @param itemSchema
         * @param itemOptions
         * @param itemData
         * @param insertAfterId
         * @param isDynamicSubItem
         * @param postRenderCallback
         * @return {*}
         * @private
         */
        createItem: function(index, itemSchema, itemOptions, itemData, insertAfterId, isDynamicSubItem, postRenderCallback)
        {
            var _this = this;

            if (_this._validateEqualMaxItems())
            {
                if (itemOptions === null && _this.options && _this.options.fields && _this.options.fields["item"])
                {
                    itemOptions = _this.options.fields["item"];
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
                        _this.destroy();

                        _this.errorCallback.call(_this, err);
                    },
                    "notTopLevel":true,
                    "isDynamicCreation": (isDynamicSubItem || this.isDynamicCreation),
                    "render" : function(fieldControl, cb) {
                        // render
                        fieldControl.parent = _this;
                        // setup item path
                        fieldControl.path = _this.path + "[" + index + "]";
                        fieldControl.nameCalculated = true;
                        fieldControl.render(null, function() {

                            _this.updatePathAndName();

                            /*
                            containerElem.attr("id", fieldControl.getId() + "-item-container");
                            containerElem.attr("alpaca-id", fieldControl.getId());
                            containerElem.addClass("alpaca-item-container");
                            // render item label if needed
                            if (_this.options && _this.options.itemLabel) {
                                var itemLabelTemplateDescriptor = _this.view.getTemplateDescriptor("itemLabel");
                                var itemLabelElem = Alpaca.tmpl(itemLabelTemplateDescriptor, {
                                    "options": _this.options,
                                    "index": index ? index + 1 : 1,
                                    "id": _this.id
                                });
                                itemLabelElem.prependTo(containerElem);
                            }
                            // remember the control
                            _this.addChild(fieldControl, index);
                            _this.renderToolbar(containerElem);
                            _this.refreshValidationState();

                            // trigger update on the parent array
                            _this.triggerUpdate();

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
                            $(containerElem).attr("data-alpaca-item-container-item-key", index);

                            _this.updateToolbarItemsStatus(_this.outerEl);

                            if (cb)
                            {
                                cb();
                            }
                            */

                            cb();
                        });
                    },
                    "postRender": function(control)
                    {
                        if (postRenderCallback)
                        {
                            postRenderCallback(control);
                        }
                    }
                });

                //this.updateToolbarItemsStatus(this.outerEl);

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
                if (v.action == actionKey)
                {
                    action = v;
                }
            });

            return action;
        },

        afterApplyCreatedItems: function(model, callback)
        {
            var self = this;

            // bind array toolbar buttons
            $(this.container).find("[data-array-toolbar-action]").off().click(function() {
                var actionKey = $(this).attr("data-array-toolbar-action");
                var action = self.findAction(model.arrayToolbarActions, actionKey);
                if (action)
                {
                    action.click();
                }
            });

            // bind array item buttons
            $(this.container).find("[data-array-item-action]").off().click(function() {
                var actionKey = $(this).attr("data-array-item-action");
                var action = self.findAction(model.arrayItemActions, actionKey);
                if (action)
                {
                    action.click();
                }
            });

            // either hover show the item buttons or always show using sticky toolbar
            // this.options.toolbarSticky
            $(this.container).find(".alpaca-container-array-item-actions").parent().hover(function() {
                $(this).find(".alpaca-container-array-item-actions").show();
            }, function() {
                $(this).find(".alpaca-container-array-item-actions").hide();
            });

            if (this.options.toolbarSticky)
            {
                $(this.container).find(".alpaca-container-array-item-actions").show();
            }
            else
            {
                $(this.container).find(".alpaca-container-array-item-actions").parent().hover(function() {
                    $(this.container).find(".alpaca-container-array-item-actions").show();
                }, function() {
                    $(this.container).find(".alpaca-container-array-item-actions").hide();
                });
            }

            self.updateToolbarItemsStatus();

            callback();
        },

        /**
         * Updates status of toolbar items.
         */
        updateToolbarItemsStatus: function()
        {
            var _this = this;

            // add actions to toolbar buttons
            if (_this._validateEqualMaxItems())
            {
                $(this.container).find("[data-array-item-action='add']").each(function(index) {
                    $(this).removeClass("alpaca-fieldset-array-item-toolbar-disabled");
                });
            }
            else
            {
                $(this.container).find("[data-array-item-action='add']").each(function(index) {
                    $(this).addClass("alpaca-fieldset-array-item-toolbar-disabled");
                });
            }

            if (_this._validateEqualMinItems())
            {
                $(this.container).find("[data-array-item-action='remove']").each(function(index) {
                    $(this).removeClass('alpaca-fieldset-array-item-toolbar-disabled');
                });
            }
            else
            {
                $(this.container).find("[data-array-item-action='remove']").each(function(index) {
                    $(this).addClass('alpaca-fieldset-array-item-toolbar-disabled');
                });
            }

            // show or hide the array toolbar
            if (this.getSize() === 0)
            {
                $(this.container).find(".alpaca-container-array-toolbar").show();
            }
            else
            {
                $(this.container).find(".alpaca-container-array-toolbar").hide();
            }
        }

        //__BUILDER_HELPERS
        ,

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
