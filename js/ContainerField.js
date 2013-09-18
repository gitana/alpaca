(function($) {

    var Alpaca = $.alpaca;

    Alpaca.ContainerField = Alpaca.Field.extend(

        /**
         * @lends Alpaca.ContainerField.prototype
         */
        {
            /**
             * @constructs
             * @augments Alpaca.Field
             *
             * @class Abstract container field for parenting of child fields.
             *
             * Custom field implementation should extend this if they intend to be containers of sub-controls -
             * examples include tree controls, list controls and more.
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
             * @see Alpaca.Field#setup
             */
            setup: function() {
                this.base();

                var collapsible = true;

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
                this.childrenById = [];
                this.childrenByPropertyId = [];
                // style icons
                this.expandedIcon = "";
                this.collapsedIcon = "";
                this.commonIcon = "";
                this.addIcon = "";
                this.removeIcon = "";
                this.upIcon = "";
                this.downIcon = "";
                if (this.view.style && Alpaca.styleInjections[this.view.style]) {
                    if (Alpaca.styleInjections[this.view.style]["commonIcon"]) {
                        this.commonIcon = Alpaca.styleInjections[this.view.style]["commonIcon"];
                    }
                    if (Alpaca.styleInjections[this.view.style]["containerExpandedIcon"]) {
                        this.expandedIcon = Alpaca.styleInjections[this.view.style]["containerExpandedIcon"];
                    }
                    if (Alpaca.styleInjections[this.view.style]["containerCollapsedIcon"]) {
                        this.collapsedIcon = Alpaca.styleInjections[this.view.style]["containerCollapsedIcon"];
                    }
                    if (Alpaca.styleInjections[this.view.style]["buttonBeautifier"]) {
                        this.buttonBeautifier = Alpaca.styleInjections[this.view.style]["buttonBeautifier"];
                    }
                    if (Alpaca.styleInjections[this.view.style]["addIcon"]) {
                        this.addIcon = Alpaca.styleInjections[this.view.style]["addIcon"];
                    }
                    if (Alpaca.styleInjections[this.view.style]["removeIcon"]) {
                        this.removeIcon = Alpaca.styleInjections[this.view.style]["removeIcon"];
                    }
                    if (Alpaca.styleInjections[this.view.style]["upIcon"]) {
                        this.upIcon = Alpaca.styleInjections[this.view.style]["upIcon"];
                    }
                    if (Alpaca.styleInjections[this.view.style]["downIcon"]) {
                        this.downIcon = Alpaca.styleInjections[this.view.style]["downIcon"];
                    }
                }
            },

            /**
             * @see Alpaca.Field#getDefaultFieldTemplateId
             */
            getDefaultFieldTemplateId : function () {
                return "fieldSet";
            },

            /**
             * @see Alpaca.Field#setDefaultTemplateDescriptor
             */
            setDefaultTemplateDescriptor: function() {
                this.base();
            },

            /**
             * Helper method to add child field.
             *
             * @param {Alpaca.Control} child Child field to be added.
             * @param {Integer} index Index of the new child.
             */
            addChild: function(child, index) {
                if (!Alpaca.isEmpty(index)) {
                    this.children.splice(index, 0, child);
                } else {
                    this.children.push(child);
                }
                this.childrenById[child.getId()] = child;
                if (child.propertyId) {
                    this.childrenByPropertyId[child.propertyId] = child;
                }
                child.parent = this;
            },

            /**
             * @see Alpaca.Field#initEvents
             */
            initEvents: function() {
                var _this = this;

                // if collapsible
                if (this.labelDiv) {
                    if (this.options.collapsible) {

                        this.labelDiv.addClass("legend-expanded");
                        this.fieldSetDiv.addClass("fieldset-expanded");

                        var initIcon = this.expandedIcon;

                        if (!Alpaca.isEmpty(this.options.collapsed) && this.options.collapsed) {
                            initIcon = this.collapsedIcon;
                            this.labelDiv.nextAll(".alpaca-fieldset-helper").slideToggle(500);
                            this.labelDiv.nextAll(".alpaca-fieldset-items-container").slideToggle(500);
                            this.labelDiv.nextAll(".alpaca-fieldset-array-toolbar").slideToggle(500);
                            this.fieldSetDiv.toggleClass("fieldset-expanded");
                            this.fieldSetDiv.toggleClass("fieldset-collapsed");
                            this.labelDiv.toggleClass("legend-expanded");
                            this.labelDiv.toggleClass("legend-collapsed");
                        }

                        if (this.options.legendStyle == 'link') {
                            $('<span class="' + this.commonIcon + " " + initIcon + ' alpaca-fieldset-legend-link"></span>').prependTo(this.labelDiv);
                            this.labelDiv.click(function() {
                                _this.fieldSetDiv.toggleClass("fieldset-collapsed");
                                _this.fieldSetDiv.toggleClass("fieldset-expanded");
                                $(this).toggleClass("legend-collapsed");
                                $(this).toggleClass("legend-expanded");
                                $('.alpaca-fieldset-legend-link', this).toggleClass(_this.collapsedIcon).toggleClass(_this.expandedIcon);
                                $(this).nextAll(".alpaca-fieldset-helper").slideToggle(500);
                                $(this).nextAll(".alpaca-fieldset-items-container").slideToggle(500);
                                $(this).nextAll(".alpaca-fieldset-array-toolbar").slideToggle(500);
                            });
                        }

                        if (this.options.legendStyle == 'button') {
                            if (this.buttonBeautifier) {
                                this.buttonBeautifier.call(this, this.labelDiv, initIcon, true);
                            }

                            this.labelDiv.click(function() {
                                _this.fieldSetDiv.toggleClass("fieldset-collapsed");
                                _this.fieldSetDiv.toggleClass("fieldset-expanded");
                                $(this).toggleClass("legend-collapsed");
                                $(this).toggleClass("legend-expanded");
                                $('.alpaca-fieldset-legend-button', this).toggleClass(_this.collapsedIcon).toggleClass(_this.expandedIcon);
                                $(this).nextAll(".alpaca-fieldset-helper").slideToggle(500);
                                $(this).nextAll(".alpaca-fieldset-items-container").slideToggle(500);
                                $(this).nextAll(".alpaca-fieldset-array-toolbar").slideToggle(500);
                            });
                        }
                    }
                }
            },

            /**
             * Clears the field and resets the field to its original value.
             *
             * @param stopUpdateTrigger If false, triggers the update event of this event.
             */
            clear: function(stopUpdateTrigger) {
                // clear all the kiddies
                Alpaca.each(this.children, function() {
                    this.clear(false);
                });

                // trigger update all at once
                if (!stopUpdateTrigger) {
                    this.triggerUpdate();
                }
            },

            /**
             * @see Alpaca.Field#setDefault
             */
            setDefault: function() {
                if (Alpaca.isEmpty(this.schema['default'])) {
                    Alpaca.each(this.children, function() {
                        this.setDefault();
                    });
                } else {
                    this.setValue(this.schema['default']);
                }
            },

            /**
             * @see Alpaca.Field#destroy
             */
            destroy: function() {

                // if this container is DOM-wrapped with a form, then release the form
                if (this.form) {
                    this.form.destroy(true); // pass in true so that we don't call back recursively
                    delete this.form;
                }

                // destroy any child controls
                Alpaca.each(this.children, function() {
                    this.destroy();
                });

                // call up to base method
                this.base();
            },

            /**
             * Renders child item container.
             *
             * @param {Integer} insertAfterId Insertion point for the container.
             * @param {Alpaca.Control} parent Parent field.
             * @param {String} propertyId Child item property ID.
             */
            renderItemContainer: function(insertAfterId, parent, propertyId) {
                var _this = this;

                var itemContainerTemplateDescriptor = this.view.getTemplateDescriptor("fieldSetItemContainer");
                if (itemContainerTemplateDescriptor) {
                    var containerElem = _this.view.tmpl(itemContainerTemplateDescriptor, {});
                    if (containerElem.attr('data-replace') == 'true') {
                        return this.fieldContainer;
                    } else {
                        if (insertAfterId) {
                            $('#' + insertAfterId + '-item-container', this.outerEl).after(containerElem);
                        } else {

                            var appendToContainer = this.fieldContainer;

                            var bindings = this.view.getLayout().bindings;
                            if (bindings) {
                                var binding = bindings[propertyId];
                                if (binding && $('#' + binding, appendToContainer).length > 0) {
                                    appendToContainer = $('#' + binding, appendToContainer);
                                }
                            }
                            containerElem.appendTo(appendToContainer);
                        }
                    }
                    return containerElem;
                } else {
                    return this.fieldContainer;
                }
            },

            /**
             * @see Alpaca.Field#renderField
             */
            renderField: function(onSuccess) {

                var _this = this;

                this.getStyleInjection("container", this.outerEl);

                var labelDiv = $('.alpaca-fieldset-legend', this.outerEl);

                if (labelDiv.length) {
                    this.labelDiv = labelDiv;
                } else {
                    this.outerEl.addClass('alpaca-fieldset-no-legend');
                }

                var fieldSetDiv = $('.alpaca-fieldset', this.outerEl);

                if (fieldSetDiv.length) {
                    this.fieldSetDiv = fieldSetDiv;
                } else {
                    this.fieldSetDiv = this.outerEl;
                }

                var fieldContainer = $('.alpaca-fieldset-items-container', this.outerEl);
                if (fieldContainer.length) {
                    this.fieldContainer = fieldContainer;
                } else {
                    this.fieldContainer = this.outerEl;
                }

                var asyncHandler = false;

                if (!this.singleLevelRendering && !this.lazyLoading) {
                    asyncHandler = true;
                    this.renderItems(function() {
                        if (onSuccess) {
                            onSuccess();
                        }
                    });
                }

                if (this.lazyLoading) {
                    if (this.labelDiv) {
                        asyncHandler = true;
                        $(this.labelDiv).click(function() {
                            if (_this.lazyLoading) {
                                _this.renderItems(function() {
                                    _this.lazyLoading = false;
                                    if (onSuccess) {
                                        onSuccess();
                                    }
                                });
                            }
                        });
                    }
                }

                if (!asyncHandler)
                {
                    if (onSuccess) {
                        onSuccess();
                    }
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
             * Renders all child items of this field.
             *
             * @param onSuccess onSuccess callback.
             */
            renderItems: function(onSuccess) {
            },//__BUILDER_HELPERS

            /**
             * @see Alpaca.Field#isContainer
             */
            isContainer: function() {
                return true;
            },

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
                            "default": true
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
                        }
                    }
                });
            }//__END_OF_BUILDER_HELPERS
        });

})(jQuery);
