/*jshint -W083 */ // inline functions are used safely
(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.ArrayField = Alpaca.ContainerField.extend(
    /**
     * @lends Alpaca.Fields.ArrayField.prototype
     */
    {
        /**
         * @constructs
         * @augments Alpaca.ContainerField
         *
         * @class Default control for the treatment of a JSON array.
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

            this.options.toolbarStyle = Alpaca.isEmpty(this.view.toolbarStyle) ? "button" : this.view.toolbarStyle;

            if (!this.options.items) {
                this.options.items = {};
            }

            var toolbarSticky = false;

            if (!Alpaca.isEmpty(this.view.toolbarSticky)) {
                toolbarSticky = this.view.toolbarSticky;
            }

            if (!Alpaca.isEmpty(this.options.toolbarSticky)) {
                toolbarSticky = this.options.toolbarSticky;
            }

            if (Alpaca.isEmpty(this.options.items.showMoveUpItemButton)) {
                this.options.items.showMoveUpItemButton = true;
            }

            if (Alpaca.isEmpty(this.options.items.showMoveDownItemButton)) {
                this.options.items.showMoveDownItemButton = true;
            }

            this.options.toolbarSticky = toolbarSticky;

            // Enable forceRevalidation option so that any change in children will trigger parent's revalidation.
            if (this.schema.items && this.schema.uniqueItems) {
                Alpaca.mergeObject(this.options, {
                    "forceRevalidation" : true
                });
            }

            if (Alpaca.isEmpty(this.data)) {
                return;
            }
            if (!Alpaca.isArray(this.data)) {
                if (!Alpaca.isString(this.data)) {
                    return;
                } else {
                    try {
                        this.data = Alpaca.parseJSON(this.data);
                        if (!Alpaca.isArray(this.data)) {
                            Alpaca.logWarn("ArrayField parsed data but it was not an array: " + JSON.stringify(this.data));
                            return;
                        }
                    } catch (e) {
                        this.data = [this.data];
                    }
                }
            }
        },

        /**
         * Picks apart the array and set onto child fields.
         * @see Alpaca.ContainerField#setup
         */
        setValue: function(data) {

            var _this = this;

            if (!data || !Alpaca.isArray(data)) {
                return;
            }

            // set fields
            for (var i = 0; i < this.children.length; i++) {
                var childField = this.children[i];
                if (data.length > i) {
                    childField.setValue(data[i]);
                } else {
                    this.removeItem(childField.id); //remove child items if there are more children than in data
                }
            }

            _this.resolveItemSchemaOptions(function(schema, options) {

                // if the number of items in the data is greater than the number of existing child elements
                while(i < data.length) {
                    _this.addItem(i, schema, options, data[i]);
                    i++;
                };

            });

        },

        /**
         * @see Alpaca.ContainerField#getValue
         */
        getValue: function() {

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
         * Returns number of children.
         */
        getSize: function() {
            return this.children.length;
        },

        /**
         * Recursive function for Update child field path and name.
         */
        updateChildrenPathAndName: function(parent) {
            var _this = this;
            if (parent.children) {
                $.each(parent.children, function(i, v) {
                    if (parent.prePath && Alpaca.startsWith(v.path,parent.prePath)) {
                        v.prePath = v.path;
                        v.path = v.path.replace(parent.prePath,parent.path);
                    }
                    // re-calculate name
                    if (parent.preName && Alpaca.startsWith(v.name, parent.preName)) {
                        v.preName = v.name;
                        v.name = v.name.replace(parent.preName, parent.name);
                        if (v.field) {
                            $(v.field).attr('name', v.name);
                        }
                    }
                    _this.updateChildrenPathAndName(v);
                });
            }
        },

        /**
         * Update field path and name when an array item is removed, inserted or switched.
         */
        updatePathAndName: function() {
            var _this = this;
            if (this.children) {
                $.each(this.children,function(i,v) {
                    var idx = v.path.lastIndexOf('/');
                    var lastSegment = v.path.substring(idx+1);
                    if (lastSegment.indexOf("[") != -1 && lastSegment.indexOf("]") != -1) {
                        lastSegment = lastSegment.substring(lastSegment.indexOf("[") + 1, lastSegment.indexOf("]"));
                    }
                    if (lastSegment != i) {
                        v.prePath = v.path;
                        v.path = v.path.substring(0, idx) + "/[" + i + "]";

                    }
                    // re-calculate name
                    if (v.nameCalculated) {
                        v.preName = v.name;
                        if (v.parent && v.parent.name && v.path) {
                            v.name = v.parent.name + "_" + i;
                        } else {
                            if (v.path) {
                                v.name = v.path.replace(/\//g, "").replace(/\[/g, "_").replace(/\]/g, "");
                            }
                        }
                        $(v.field).attr('name', v.name);
                    }
                    if (!v.prePath) {
                        v.prePath = v.path;
                    }
                    _this.updateChildrenPathAndName(v);
                });
            }
        },

        /**
         * Moves child up or down
         * @param {String} fromId Id of the child to be moved.
         * @param {Boolean} isUp true if the moving is upwards
         */
        moveItem: function(fromId, isUp) {
            var _this = this;
            if (this.childrenById[fromId]) {
                // do the loop
                $.each(this.children, function(index, val) {
                    if (val.getId() == fromId) {
                        var toIndex;
                        if (isUp === true) {
                            toIndex = index - 1;
                            if (toIndex < 0) {
                                toIndex = _this.children.length - 1;
                            }
                        } else {
                            toIndex = index + 1;
                            if (toIndex >= _this.children.length) {
                                toIndex = 0;
                            }
                        }
                        if (_this.children[toIndex]) {
                            var toId = _this.children[toIndex].getId();
                            var fromContainer = $('#' + fromId + '-item-container');
                            var toContainer = $('#' + toId + '-item-container');
                            _this.reRenderItem(_this.children[index], toContainer);
                            _this.reRenderItem(_this.children[toIndex], fromContainer);
                            var tmp = _this.children[index];
                            _this.children[index] = _this.children[toIndex];
                            _this.children[toIndex] = tmp;
                            _this.updatePathAndName();
                            return false;
                        }
                    }
                });
            }
        },

        /**
         * Removes child
         * @param {String} id Id of the child to be removed
         */
        removeItem: function(id) {
            if (this._validateEqualMinItems()) {
                this.children = $.grep(this.children, function(val, index) {
                    return (val.getId() != id);
                });
                delete this.childrenById[id];
                $('#' + id + "-item-container", this.outerEl).remove();
                this.renderValidationState();
                this.updateToolbarItemsStatus();
                this.updatePathAndName();

                // trigger update handler
                this.triggerUpdate();
            }
        },

        /**
         * Updates status of toolbar items.
         */
        updateToolbarItemsStatus: function() {
            var _this = this;
            // add actions to toolbar buttons
            if (_this._validateEqualMaxItems()) {
                $('.alpaca-fieldset-array-item-toolbar-add', this.outerEl).each(function(index) {
                    $(this).removeClass('alpaca-fieldset-array-item-toolbar-disabled');
                });
            } else {
                $('.alpaca-fieldset-array-item-toolbar-add', this.outerEl).each(function(index) {
                    $(this).addClass('alpaca-fieldset-array-item-toolbar-disabled');
                });
            }
            if (_this._validateEqualMinItems()) {
                $('.alpaca-fieldset-array-item-toolbar-remove', this.outerEl).each(function(index) {
                    $(this).removeClass('alpaca-fieldset-array-item-toolbar-disabled');
                });
            } else {
                $('.alpaca-fieldset-array-item-toolbar-remove', this.outerEl).each(function(index) {
                    $(this).addClass('alpaca-fieldset-array-item-toolbar-disabled');
                });
            }
            if (this.getSize() === 0) {
                this.renderArrayToolbar(this.outerEl);
            } else {
                if (this.arrayToolbar) {
                    this.arrayToolbar.remove();
                }
            }
            // update counter
            $('.alpaca-item-label-counter', this.outerEl).each(function(index) {
                $(this).html(index + 1);
            });
        },

        /**
         * Renders array item toolbar.
         *
         * @param {Object} containerElem Toolbar container.
         */
        renderToolbar: function(containerElem) {
            var _this = this;

            if (!this.options.readonly) {
                var id = containerElem.attr('alpaca-id');
                var fieldControl = this.childrenById[id];
                var itemToolbarTemplateDescriptor = this.view.getTemplateDescriptor("arrayItemToolbar");
                if (itemToolbarTemplateDescriptor) {

                    // Base buttons : add & remove
                    var buttonsDef = [
                        {
                            feature: "add",
                            icon: _this.addIcon,
                            label: (_this.options.items && _this.options.items.addItemLabel) ? _this.options.items.addItemLabel : "Add Item",
                            clickCallback: function(id, arrayField) {

                                _this.resolveItemSchemaOptions(function(schema, options) {

                                    var newContainerElem = arrayField.addItem(containerElem.index() + 1, schema, options, null, id, true);
                                    arrayField.enrichElements(newContainerElem);

                                });

                                return false;
                            }
                        },
                        {
                            feature: "remove",
                            icon: _this.removeIcon,
                            label: (_this.options.items && _this.options.items.removeItemLabel) ? _this.options.items.removeItemLabel : "Remove Item",
                            clickCallback: function(id, arrayField) {
                                arrayField.removeItem(id);
                            }
                        }
                    ];

                    // Optional buttons : up & down
                    if ((_this.options.items && _this.options.items.showMoveUpItemButton)) {
                        buttonsDef.push({
                            feature: "up",
                            icon: _this.upIcon,
                            label: (_this.options.items && _this.options.items.moveUpItemLabel) ? _this.options.items.moveUpItemLabel : "Move Up",
                            clickCallback: function(id, arrayField) {
                                arrayField.moveItem(id, true);
                            }
                        });
                    }

                    if ((_this.options.items && _this.options.items.showMoveDownItemButton)) {
                        buttonsDef.push({
                            feature: "down",
                            icon: _this.downIcon,
                            label: (_this.options.items && _this.options.items.moveDownItemLabel) ? _this.options.items.moveDownItemLabel : "Move Down",
                            clickCallback: function(id, arrayField) {
                                arrayField.moveItem(id, false);
                            }
                        });
                    }

                    // Extra buttons : user-defined
                    if (_this.options.items && _this.options.items.extraToolbarButtons) {
                        buttonsDef = $.merge(buttonsDef,_this.options.items.extraToolbarButtons);
                    }

                    var toolbarElem = _this.view.tmpl(itemToolbarTemplateDescriptor, {
                        "id": id,
                        "buttons": buttonsDef
                    });
                    if (toolbarElem.attr("id") === null) {
                        toolbarElem.attr("id", id + "-item-toolbar");
                    }

                    // Process all buttons
                    for (var i in buttonsDef) {
                        (function(def) { // closure to prevent "def" leaking
                            var el = toolbarElem.find('.alpaca-fieldset-array-item-toolbar-'+def.feature);
                            el.click(function(e) {return def.clickCallback(id, _this, e);});
                            if (_this.buttonBeautifier) {
                                _this.buttonBeautifier.call(_this,el, def.icon);
                            }
                        })(buttonsDef[i]);
                    }

                    if (this.options.toolbarSticky) {
                        toolbarElem.prependTo(containerElem);
                    } else {
                        toolbarElem.hide().prependTo(containerElem);
                        containerElem.hover(function() {
                            $('.alpaca-fieldset-array-item-toolbar', this).show();
                        }, function() {
                            $('.alpaca-fieldset-array-item-toolbar', this).hide();
                        });
                    }

                }
            }
        },

        /**
         * Renders array toolbar.
         * @param {Object} containerElem Array toolbar container.
         */
        renderArrayToolbar: function(containerElem) {
            var _this = this;
            var id = containerElem.attr('alpaca-id');
            var itemToolbarTemplateDescriptor = this.view.getTemplateDescriptor("arrayToolbar");
            if (itemToolbarTemplateDescriptor) {
                var toolbarElem = _this.view.tmpl(itemToolbarTemplateDescriptor, {
                    "id": id,
                    "addItemLabel": (_this.options.items && _this.options.items.addItemLabel) ? _this.options.items.addItemLabel : "Add Item"
                });
                if (toolbarElem.attr("id") === null) {
                    toolbarElem.attr("id", id + "-array-toolbar");
                }

                // add actions to toolbar buttons
                if (this.options.toolbarStyle == "link") {
                    $('.alpaca-fieldset-array-toolbar-add', toolbarElem).click(function() {

                        _this.resolveItemSchemaOptions(function(schema, options) {

                            var newContainerElem = _this.addItem(0, schema, options, "", id, true);
                            _this.enrichElements(newContainerElem);

                        });
                    });
                } else {
                    var toolbarElemAdd = $('.alpaca-fieldset-array-toolbar-add', toolbarElem);
                    if (_this.buttonBeautifier) {
                        _this.buttonBeautifier.call(_this, toolbarElemAdd, _this.addIcon, true);
                    }
                    toolbarElemAdd.click(function() {

                        _this.resolveItemSchemaOptions(function(schema, options) {
                            _this.addItem(0, schema, options, "", id, true);
                        });

                        return false;
                    }).wrap('<small></small>');

                }
                toolbarElem.appendTo(containerElem);
                this.arrayToolbar = toolbarElem;
            }
        },

        /**
         * Re-renders item.
         *
         * @param {Object} fieldControl Item control to be re-rendered
         *
         * @param {Object} newContainer New field container.
         */
        reRenderItem: function(fieldControl, newContainer) {
            fieldControl.container = newContainer;
            fieldControl.render();

            newContainer.attr("id", fieldControl.getId() + "-item-container");
            newContainer.attr("alpaca-id", fieldControl.getId());
            newContainer.addClass("alpaca-item-container");

            $(".alpaca-fieldset-array-item-toolbar", newContainer).remove();
            this.renderToolbar(newContainer);
            this.enrichElements(newContainer);
        },

        /**
         * Adds item.
         *
         * @param {String} index Index of the item
         * @param {Object} itemSchema field schema
         * @param {Object} itemOptions field options
         * @param {Any} itemData field data
         * @param {String} insertAfterId Where the item will be inserted
         * @param [Boolean] isDynamicSubItem whether this item is being dynamically created (after first render)
         * @param [Function] postRenderCallback called after the child is added
         */
        addItem: function(index, itemSchema, itemOptions, itemData, insertAfterId, isDynamicSubItem, postRenderCallback) {
            return this._addItem(index, itemSchema, itemOptions, itemData, insertAfterId, isDynamicSubItem, postRenderCallback);
        },

        /**
         * Workhorse method for addItem.
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
        _addItem: function(index, itemSchema, itemOptions, itemData, insertAfterId, isDynamicSubItem, postRenderCallback) {
            var _this = this;
            if (_this._validateEqualMaxItems()) {

                if (itemOptions === null && _this.options && _this.options.fields && _this.options.fields["item"]) {
                    itemOptions = _this.options.fields["item"];
                }

                var containerElem = _this.renderItemContainer(insertAfterId);
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

                            containerElem.attr("id", fieldControl.getId() + "-item-container");
                            containerElem.attr("alpaca-id", fieldControl.getId());
                            containerElem.addClass("alpaca-item-container");
                            // render item label if needed
                            if (_this.options && _this.options.itemLabel) {
                                var itemLabelTemplateDescriptor = _this.view.getTemplateDescriptor("itemLabel");
                                var itemLabelElem = _this.view.tmpl(itemLabelTemplateDescriptor, {
                                    "options": _this.options,
                                    "index": index ? index + 1 : 1,
                                    "id": _this.id
                                });
                                itemLabelElem.prependTo(containerElem);
                            }
                            // remember the control
                            _this.addChild(fieldControl, index);
                            _this.renderToolbar(containerElem);
                            _this.renderValidationState();
                            _this.updatePathAndName();

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

                            if (cb)
                            {
                                cb();
                            }
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

                this.updateToolbarItemsStatus(this.outerEl);
                return containerElem;
            }
        },

        /**
         * Enriches styles for dynamic elements.
         *
         * @param {Object} containerElem Field container element.
         */
        enrichElements: function(containerElem) {
            this.getStyleInjection('array',containerElem);
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

                    if (itemSchema)
                    {
                        itemSchema = Alpaca.copyOf(itemSchema);
                        delete itemSchema.id;
                    }

                    if (itemOptions)
                    {
                        itemOptions = Alpaca.copyOf(itemOptions);
                    }

                    callback(itemSchema, itemOptions, circular);
                });
            }
            else
            {
                callback(itemSchema, itemOptions);
            }
        },

        /**
         * @see Alpaca.ContainerField#renderItems
         */
        renderItems: function(onSuccess) {
            var _this = this;

            // mark field container as empty by default
            // the "addItem" method below gets the opportunity to unset this
            $(this.fieldContainer).addClass("alpaca-fieldset-items-container-empty");

            if (this.data)
            {
                // all items within the array have the same schema and options
                // so we only need to load this once
                _this.resolveItemSchemaOptions(function(schema, options) {

                    // workhorse function
                    // adds an item and then recursively fires down from the callback until the end of the list is reached
                    var handleItem = function(index)
                    {
                        if (index === _this.data.length)
                        {
                            _this.updateToolbarItemsStatus();

                            if (onSuccess)
                            {
                                onSuccess();
                            }

                            return;
                        }

                        var value = _this.data[index];

                        _this.addItem(index, schema, options, value, false, false, function() {
                            handleItem(index+1);
                        });

                    };
                    handleItem(0);
                });
            }
            else
            {
                this.updateToolbarItemsStatus();

                if (onSuccess)
                {
                    onSuccess();
                }
            }
        },

        /**
         * Validates if the number of items has been reached to maxItems.
         * @returns {Boolean} true if the number of items has been reached to maxItems
         */
        _validateEqualMaxItems: function() {
            if (this.schema.items && this.schema.items.maxItems) {
                if (this.getSize() >= this.schema.items.maxItems) {
                    return false;
                }
            }
            return true;
        },

        /**
         * Validates if the number of items has been reached to minItems.
         * @returns {Boolean} true if number of items has been reached to minItems
         */
        _validateEqualMinItems: function() {
            if (this.schema.items && this.schema.items.minItems) {
                if (this.getSize() <= this.schema.items.minItems) {
                    return false;
                }
            }
            return true;
        },

        /**
         * Validates if number of items has been less than minItems.
         * @returns {Boolean} true if number of items has been less than minItems
         */
        _validateMinItems: function() {
            if (this.schema.items && this.schema.items.minItems) {
                if (this.getSize() < this.schema.items.minItems) {
                    return false;
                }
            }
            return true;
        },

        /**
         * Validates if number of items has been over maxItems.
         * @returns {Boolean} true if number of items has been over maxItems
         */
        _validateMaxItems: function() {
            if (this.schema.items && this.schema.items.maxItems) {
                if (this.getSize() > this.schema.items.maxItems) {
                    return false;
                }
            }
            return true;
        },

        /**
         * Validates if all items are unique.
         * @returns {Boolean} true if all items are unique.
         */
        _validateUniqueItems: function() {
            if (this.schema.items && this.schema.uniqueItems) {
                var hash = {};
                for (var i = 0, l = this.children.length; i < l; ++i) {
                    if (!hash.hasOwnProperty(this.children[i])) {
                        hash[this.children[i]] = true;
                    } else {
                        return false;
                    }
                }
            }
            return true;
        },

        /**
         * @see Alpaca.ContainerField#handleValidate
         */
        handleValidate: function() {
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
        },//__BUILDER_HELPERS

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
        },

        /**
         * @see Alpaca.ContainerField#getFiledType
         */
        getFieldType: function() {
            return "array";
        }//__END_OF_BUILDER_HELPERS
    });

    Alpaca.registerTemplate("itemLabel", '{{if options.itemLabel}}<div class="alpaca-controlfield-label"><div>${options.itemLabel}{{if index}} <span class="alpaca-item-label-counter">${index}</span>{{/if}}</div></div>{{/if}}');
    Alpaca.registerTemplate("arrayToolbar", '<span class="ui-widget ui-corner-all alpaca-fieldset-array-toolbar"><button class="alpaca-fieldset-array-toolbar-icon alpaca-fieldset-array-toolbar-add">${addItemLabel}</button></span>');
    Alpaca.registerTemplate("arrayItemToolbar", '<div class="ui-widget-header ui-corner-all alpaca-fieldset-array-item-toolbar">{{each(k,v) buttons}}<button class="alpaca-fieldset-array-item-toolbar-icon alpaca-fieldset-array-item-toolbar-${v.feature}">${v.label}</button>{{/each}}</div>');
    Alpaca.registerMessages({
        "notEnoughItems": "The minimum number of items is {0}",
        "tooManyItems": "The maximum number of items is {0}",
        "valueNotUnique": "Values are not unique",
        "notAnArray": "This value is not an Array"
    });
    Alpaca.registerFieldClass("array", Alpaca.Fields.ArrayField);
    Alpaca.registerDefaultSchemaFieldMapping("array", "array");

})(jQuery);
