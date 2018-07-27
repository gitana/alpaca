(function($) {

    var Alpaca = $.alpaca;

    Alpaca.ContainerField = Alpaca.Field.extend(
    /**
     * @lends Alpaca.ContainerField.prototype
     */
    {
        /**
         * Called during construction to signal that this field is a container field.
         */
        onConstruct: function()
        {
            this.isContainerField = true;
        },

        /**
         * @see Alpaca.Field#isContainer
         */
        isContainer: function()
        {
            return true;
        },

        getContainerEl: function()
        {
            return this.container;
        },

        /**
         * For container fields, we use the "container" template as the primary.
         *
         * @see Alpaca.Field#getTemplateDescriptorId
         * @returns {string}
         */
        getTemplateDescriptorId : function ()
        {
            return "container";
        },

        resolveContainerTemplateType: function()
        {
            // we assume the field type and then check the view to see if there is a template for this view
            // if not, we walk the parent chain until we find a template type

            var finished = false;
            var selectedType = null;

            var b = this;
            do
            {
                if (!b.getFieldType)
                {
                    finished = true;
                }
                else
                {
                    var d = this.view.getTemplateDescriptor("container-" + b.getFieldType(), this);
                    if (d)
                    {
                        selectedType = b.getFieldType();
                        finished = true;
                    }
                    else
                    {
                        b = b.constructor.ancestor.prototype;
                    }
                }
            }
            while (!finished);

            return selectedType;
        },

        resolveContainerItemTemplateType: function()
        {
            // we assume the field type and then check the view to see if there is a template for this view
            // if not, we walk the parent chain until we find a template type

            var finished = false;
            var selectedType = null;

            var b = this;
            do
            {
                if (!b.getFieldType)
                {
                    finished = true;
                }
                else
                {
                    var d = this.view.getTemplateDescriptor("container-" + b.getFieldType() + "-item", this);
                    if (d)
                    {
                        selectedType = b.getFieldType();
                        finished = true;
                    }
                    else
                    {
                        b = b.constructor.ancestor.prototype;
                    }
                }
            }
            while (!finished);

            return selectedType;
        },

        /**
         * @see Alpaca.Field#setup
         */
        setup: function()
        {
            var self = this;

            this.base();

            var containerTemplateType = self.resolveContainerTemplateType();
            if (!containerTemplateType)
            {
                return Alpaca.throwErrorWithCallback("Unable to find template descriptor for container: " + self.getFieldType());
            }

            this.containerDescriptor = this.view.getTemplateDescriptor("container-" + containerTemplateType, self);

            // default to false
            var collapsible = false;

            if (!Alpaca.isEmpty(this.view.collapsible)) {
                collapsible = this.view.collapsible;
            }

            if (!Alpaca.isEmpty(this.options.collapsible)) {
                collapsible = this.options.collapsible;
            }

            this.options.collapsible = collapsible;

            var legendStyle = "button";

            if (!Alpaca.isEmpty(this.view.legendStyle)) {
                legendStyle = this.view.legendStyle;
            }

            if (!Alpaca.isEmpty(this.options.legendStyle)) {
                legendStyle = this.options.legendStyle;
            }

            this.options.legendStyle = legendStyle;

            //Lazy loading
            this.lazyLoading = false;
            if (!Alpaca.isEmpty(this.options.lazyLoading)) {
                this.lazyLoading = this.options.lazyLoading;
                if (this.lazyLoading) {
                    this.options.collapsed = true;
                }
                //delete this.options.lazyLoading;
            }
            // holders of references to children
            this.children = [];
            this.childrenById = {};
            this.childrenByPropertyId = {};
        },

        /**
         * @see Alpaca.Field#destroy
         */
        destroy: function()
        {
            // if this container is DOM-wrapped with a form, then release the form
            if (this.form)
            {
                this.form.destroy(true); // pass in true so that we don't call back recursively
                delete this.form;
            }

            // destroy any child controls
            Alpaca.each(this.children, function () {
                this.destroy();
            });

            // call up to base method
            this.base();
        },

        // @Override
        bindData: function()
        {
        },

        /**
         * Add a "container" dom element inside of the field which houses our custom container.
         *
         * @see Alpaca.Field#renderField
         */
        renderFieldElements: function(callback) {

            var self = this;

            // find our insertion point
            // this is marked by the handlebars helper
            this.container = $(this.field).find("." + Alpaca.MARKER_CLASS_CONTAINER_FIELD);
            this.container.removeClass(Alpaca.MARKER_CLASS_CONTAINER_FIELD);

            // render
            self.prepareContainerModel(function(model) {
                self.beforeRenderContainer(model, function() {
                    self.renderContainer(model, function(containerField) {

                        if (containerField)
                        {
                            self.container.replaceWith(containerField);
                            self.container = containerField;

                            self.container.addClass(Alpaca.CLASS_CONTAINER);
                        }

                        // mark the form field with "alpaca-horizontal" or "alpaca-vertical"
                        if (self.view.horizontal)
                        {
                            self.container.addClass("alpaca-horizontal");
                        }
                        else
                        {
                            self.container.addClass("alpaca-vertical");
                        }

                        // CALLBACK: "container"
                        self.fireCallback("container");

                        self.afterRenderContainer(model, function() {

                            callback();
                        });

                    });
                });
            });
        },

        /**
         * Prepares the model for use in rendering the container.
         *
         * @param callback function(model)
         */
        prepareContainerModel: function(callback)
        {
            var self = this;

            var model = {
                "id": this.getId(),
                "name": this.name,
                "schema": this.schema,
                "options": this.options,
                "view": this.view
            };

            // load items into array and store on model for future use
            self.createItems(function(items) {

                if (!items)
                {
                    items = [];
                }

                // legacy support: assume containerItemEl = fieldEl
                for (var i = 0; i < items.length; i++)
                {
                    if (!items[i].containerItemEl) {
                        items[i].containerItemEl = items[i].getFieldEl();
                    }
                }

                model.items = items;

                callback(model);

            });
        },

        /**
         * Called before the container is rendered.
         *
         * @extension-point
         *
         * @param model
         * @param callback
         */
        beforeRenderContainer: function(model, callback)
        {
            var self = this;

            callback();
        },

        /**
         * Renders the container into the field container.
         *
         * @extension-point
         *
         * @param model
         * @param callback
         */
        renderContainer: function(model, callback)
        {
            var container = null;

            if (this.containerDescriptor)
            {
                container = Alpaca.tmpl(this.containerDescriptor, model);
            }

            callback(container);
        },

        /**
         * Called after the container is rendered.
         *
         * @extension-point
         *
         * @param model
         * @param callback
         */
        afterRenderContainer: function(model, callback)
        {
            var self = this;

            self.beforeApplyCreatedItems(model, function() {
                self.applyCreatedItems(model, function () {
                    self.afterApplyCreatedItems(model, function () {
                        callback();
                    });
                });
            });
        },

        /**
         * @see Alpaca.Field#postRender
         */
        postRender: function(callback)
        {
            var self = this;

            this.base(function() {

                callback();

            });
        },

        /**
         * @see Alpaca.Field#initEvents
         */
        initEvents: function()
        {
            var self = this;

            this.base();

            /*
            if (self.options.collapsible)
            {
                // CALLBACK: "collapsible"
                self.fireCallback("collapsible");
            }
            */
        },

        /**
         * Creates any sub-items for this container.
         *
         * @extension_point
         *
         * @param callback
         */
        createItems: function(callback)
        {
            callback();
        },

        beforeApplyCreatedItems: function(model, callback)
        {
            callback();
        },

        applyCreatedItems: function(model, callback)
        {
            var self = this;

            var layoutBindings = null;
            if (self.isTopLevel() && self.view.getLayout())
            {
                layoutBindings = self.view.getLayout().bindings;

                // if layout and bindings not provided, assume a default strategy
                if (!layoutBindings && self.view.getLayout().templateDescriptor && model.items.length > 0)
                {
                    layoutBindings = {};

                    for (var i = 0; i < model.items.length; i++)
                    {
                        var name = model.items[i].name;

                        layoutBindings[name] = "[data-alpaca-layout-binding='" + name + "']";
                    }
                }

            }

            if (model.items.length > 0)
            {
                $(self.container).addClass("alpaca-container-has-items");
                $(self.container).attr("data-alpaca-container-item-count", model.items.length);
            }
            else
            {
                $(self.container).removeClass("alpaca-container-has-items");
                $(self.container).removeAttr("data-alpaca-container-item-count");
            }

            for (var i = 0; i < model.items.length; i++)
            {
                var item = model.items[i];

                // find the insertion point
                var insertionPoint = $(self.container).find("." + Alpaca.MARKER_CLASS_CONTAINER_FIELD_ITEM + "[" + Alpaca.MARKER_DATA_CONTAINER_FIELD_ITEM_KEY + "='" + item.name + "']");
                if (!layoutBindings)
                {
                    var holder = $(insertionPoint).parent();

                    $(insertionPoint).replaceWith(item.containerItemEl);

                    // reset domEl to allow for refresh
                    item.domEl = holder;
                }
                else
                {
                    // use a layout
                    var bindingId = layoutBindings[item.name];
                    if (bindingId)
                    {
                        var holder = $(bindingId, self.field);
                        if (holder.length == 0)
                        {
                            // legacy support, fallback to ID based
                            try {
                                holder = $('#' + bindingId, self.field);
                            } catch (e) { }
                        }
                        if (holder.length > 0)
                        {
                            // create a wrapper (which will serve as the domEl)
                            item.domEl = $("<div></div>");
                            $(item.domEl).addClass("alpaca-layout-binding-holder");
                            $(item.domEl).attr("alpaca-layout-binding-field-name", item.name);
                            holder.append(item.domEl);
                            item.domEl.append(item.containerItemEl);
                        }
                    }

                    // remove insertion point
                    $(insertionPoint).remove();
                }

                $(item.containerItemEl).addClass("alpaca-container-item");

                if (i === 0)
                {
                    $(item.containerItemEl).addClass("alpaca-container-item-first");
                }

                if (i + 1 === model.items.length)
                {
                    $(item.containerItemEl).addClass("alpaca-container-item-last");
                }

                $(item.containerItemEl).attr("data-alpaca-container-item-index", i);
                $(item.containerItemEl).attr("data-alpaca-container-item-name", item.name);
                $(item.containerItemEl).attr("data-alpaca-container-item-parent-field-id", self.getId());

                // register the child
                self.registerChild(item, i);
            }

            if (self.options.collapsible)
            {
                // CALLBACK: "collapsible"
                self.fireCallback("collapsible");
            }

            self.triggerUpdate();

            callback();
        },

        afterApplyCreatedItems: function(model, callback)
        {
            callback();
        },

        /**
         * Helper method to add child field.
         *
         * @param {Alpaca.Control} child Child field to be added.
         * @param {Integer} index Index of the new child.
         */
        registerChild: function(child, index)
        {
            if (!Alpaca.isEmpty(index))
            {
                this.children.splice(index, 0, child);
            }
            else
            {
                this.children.push(child);
            }

            this.childrenById[child.getId()] = child;
            if (child.propertyId)
            {
                this.childrenByPropertyId[child.propertyId] = child;
            }

            child.parent = this;
        },

        /**
         * Helper method to remove child field.
         *
         * @param index
         */
        unregisterChild: function(index)
        {
            var child = this.children[index];
            if (!child)
            {
                return;
            }

            if (!Alpaca.isEmpty(index))
            {
                this.children.splice(index, 1);
            }

            delete this.childrenById[child.getId()];
            if (child.propertyId)
            {
                delete this.childrenByPropertyId[child.propertyId];
            }

            child.parent = null;
        },

        /**
         * This method gets invoked after items are dynamically added, removed or moved around in the child chain.
         * It adjusts classes on child DOM elements to make sure they're correct.
         */
        updateDOMElement: function()
        {
            var self = this;

            this.base();

            if (self.children.length > 0)
            {
                $(self.getContainerEl()).addClass("alpaca-container-has-items");
                $(self.getContainerEl()).attr("data-alpaca-container-item-count", self.children.length);
            }
            else
            {
                $(self.getContainerEl()).removeClass("alpaca-container-has-items");
                $(self.getContainerEl()).removeAttr("data-alpaca-container-item-count");
            }

            for (var i = 0; i < self.children.length; i++)
            {
                var child = self.children[i];

                // set path if not set
                if (!child.path)
                {
                    if (child.schema.type === "array")
                    {
                        child.path = self.path + "[" + i + "]";
                    }
                    else
                    {
                        child.path = self.path + "/" + child.propertyId;
                    }
                }

                child.calculateName();

                $(child.containerItemEl).removeClass("alpaca-container-item-first");
                $(child.containerItemEl).removeClass("alpaca-container-item-last");
                $(child.containerItemEl).removeClass("alpaca-container-item-index");
                $(child.containerItemEl).removeClass("alpaca-container-item-key");

                $(child.containerItemEl).addClass("alpaca-container-item");

                if (i === 0)
                {
                    $(child.containerItemEl).addClass("alpaca-container-item-first");
                }
                if (i + 1 === self.children.length)
                {
                    $(child.containerItemEl).addClass("alpaca-container-item-last");
                }

                $(child.containerItemEl).attr("data-alpaca-container-item-index", i);
                $(child.containerItemEl).attr("data-alpaca-container-item-name", child.name);
                $(child.containerItemEl).attr("data-alpaca-container-item-parent-field-id", self.getId());

                self.updateChildDOMWrapperElement(i, child);

                child.updateDOMElement();
            }
        },

        /**
         * EXTENSION POINT that allows containers to update any custom wrapper elements for child controls.
         *
         * @param i
         * @param child
         */
        updateChildDOMWrapperElement: function(i, child)
        {

        },

        /**
         * Gets called whenever an item is dynamically added or removed from a container.  This allows all of the
         * container markers to refresh on the DOM.
         */
        handleRepositionDOMRefresh: function()
        {
            var self = this;

            if (self.getParent())
            {
                // call update dom markers for parent which will trickle down to to cover this field and our siblings
                self.getParent().updateDOMElement();
            }
            else
            {
                // just ourselves
                self.updateDOMElement();
            }
        },

        /**
         * Propagates signal down to all children.
         * @override
         */
        onDependentReveal: function()
        {
            for (var i = 0; i < this.children.length; i++)
            {
                this.children[i].onDependentReveal();
            }
        },

        /**
         * Propagates signal down to all children.
         * @override
         */
        onDependentConceal: function()
        {
            for (var i = 0; i < this.children.length; i++)
            {
                this.children[i].onDependentConceal();
            }
        },

        /**
         * Focus an element in the container.  Find the first invalid element or if no invalid elements, pick
         * the first child.  If a callback is provided, the callback is fired and passed the control element
         * that received the focus.
         */
        focus: function(onFocusCallback)
        {
            var self = this;

            if (this.isDisplayOnly())
            {
                if (onFocusCallback) {
                    onFocusCallback();
                }
                return;
            }

            this.base();

            var invalidIndex = -1;

            // use the dom to create an array that orders things as they are laid out on the page
            var pageOrderedChildren = [];
            var el = this.getContainerEl();
            if (this.form) {
                el = this.form.getFormEl();
            }
            $(el).find(".alpaca-container-item[data-alpaca-container-item-parent-field-id='" + this.getId() + "']").each(function() {
                var childIndex = $(this).attr("data-alpaca-container-item-index");
                pageOrderedChildren.push(self.children[childIndex]);
            });

            // walk the ordered children and find first invalid
            for (var i = 0; i < pageOrderedChildren.length; i++)
            {
                if (pageOrderedChildren[i])
                {
                    if (!pageOrderedChildren[i].isValid(true) &&
                        pageOrderedChildren[i].isControlField &&
                        pageOrderedChildren[i].isAutoFocusable() &&
                        !pageOrderedChildren[i].options.readonly)
                    {
                        invalidIndex = i;
                        break;
                    }
                }
            }

            // if we didn't find anything invalid, just focus on first item
            if (invalidIndex === -1 && pageOrderedChildren.length > 0)
            {
                invalidIndex = 0;
            }

            // do the focus if we found something
            if (invalidIndex > -1)
            {
                pageOrderedChildren[invalidIndex].focus();

                if (onFocusCallback)
                {
                    onFocusCallback(pageOrderedChildren[invalidIndex]);
                }
            }
        },

        /**
         * @see Alpaca.Field#disable
         */
        disable: function()
        {
            if (this.options.readonly) {
                return;
            }

            this.base();

            for (var i = 0; i < this.children.length; i++)
            {
                this.children[i].disable();
            }
        },

        /**
         * @see Alpaca.Field#enable
         */
        enable: function()
        {
            if (this.options.readonly) {
                return;
            }

            this.base();

            for (var i = 0; i < this.children.length; i++)
            {
                this.children[i].enable();
            }
        },

        /**
         * Returns the value of this field.
         *
         * @returns {Any} value Field value.
         */
        getValue: function()
        {
            var self = this;

            var value = self.getContainerValue();

            /*
            if (self.isDisplayOnly())
            {
                if (value)
                {
                    value = JSON.stringify(value, null, "  ");
                }
            }
            */

            return value;
        },

        /**
         * Extension point
         */
        getContainerValue: function()
        {
            return null;
        },

        firstChild: function() {
            var child = null;

            if (this.children.length > 0) {
                child = this.children[0];
            }

            return child;
        },

        lastChild: function() {
            var child = null;

            if (this.children.length > 0) {
                child = this.children[this.children.length - 1];
            }

            return child;
        }

        /* builder_helpers */
        ,

        /**
         * @private
         * @see Alpaca.Field#getSchemaOfOptions
         */
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "lazyLoading": {
                        "title": "Lazy Loading",
                        "description": "Child fields will only be rendered when the fieldset is expanded if this option is set true.",
                        "type": "boolean",
                        "default": false
                    },
                    "collapsible": {
                        "title": "Collapsible",
                        "description": "Field set is collapsible if true.",
                        "type": "boolean",
                        "default": false
                    },
                    "collapsed": {
                        "title": "Collapsed",
                        "description": "Field set is initially collapsed if true.",
                        "type": "boolean",
                        "default": false
                    },
                    "legendStyle": {
                        "title": "Legend Style",
                        "description": "Field set legend style.",
                        "type": "string",
                        "enum":["button","link"],
                        "default": "button"
                    },
                    "animate": {
                        "title": "Animate movements and transitions",
                        "description": "Up and down transitions will be animated",
                        "type": "boolean",
                        "default": true
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.Field#getOptionsForOptions
         */
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "lazyLoading": {
                        "rightLabel": "Lazy loading child fields ?",
                        "helper": "Lazy loading will be enabled if checked.",
                        "type": "checkbox"
                    },
                    "collapsible": {
                        "rightLabel": "Field set collapsible ?",
                        "helper": "Field set is collapsible if checked.",
                        "type": "checkbox"
                    },
                    "collapsed": {
                        "rightLabel": "Field set initially collapsed ?",
                        "description": "Field set is initially collapsed if checked.",
                        "type": "checkbox"
                    },
                    "legendStyle": {
                        "type":"select"
                    },
                    "animate": {
                        "rightLabel": "Animate movements and transitions",
                        "type": "checkbox"
                    }
                }
            });
        }
        /* end_builder_helpers */
    });

})(jQuery);
