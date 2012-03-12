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

                this.options.legendStyle = legendStyle;

                // holders of references to children
                this.children = [];
                this.childrenById = [];
                this.childrenByPropertyId = [];
            },

            /**
             * @see Alpaca.Field#getDefaultFieldTemplateId
             */
            getDefaultFieldTemplateId : function () {
                return "fieldSet";
            },

            /**
             * @see Alpaca.Field#setDefaultTemplate
             */
            setDefaultTemplate: function() {
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

                        var initIcon = 'ui-icon-circle-arrow-s';

                        if (!Alpaca.isEmpty(this.options.collapsed) && this.options.collapsed) {
                            initIcon = 'ui-icon-circle-arrow-e';
                            this.labelDiv.nextAll(".alpaca-fieldset-helper").slideToggle(500);
                            this.labelDiv.nextAll(".alpaca-fieldset-items-container").slideToggle(500);
                            this.labelDiv.nextAll(".alpaca-fieldset-array-toolbar").slideToggle(500);
                            this.fieldSetDiv.toggleClass("fieldset-expanded");
                            this.fieldSetDiv.toggleClass("fieldset-collapsed");
                            this.labelDiv.toggleClass("legend-expanded");
                            this.labelDiv.toggleClass("legend-collapsed");
                        }

                        if (this.options.legendStyle == 'link') {
                            $('<span class="ui-icon ' + initIcon + '" style="float:left;margin-right:0.3em;"></span>').prependTo(this.labelDiv);
                            this.labelDiv.click(function() {
                                _this.fieldSetDiv.toggleClass("fieldset-collapsed");
                                _this.fieldSetDiv.toggleClass("fieldset-expanded");
                                $(this).toggleClass("legend-collapsed");
                                $(this).toggleClass("legend-expanded");
                                $('.ui-icon', this).toggleClass("ui-icon-circle-arrow-e").toggleClass("ui-icon-circle-arrow-s");
                                $(this).nextAll(".alpaca-fieldset-helper").slideToggle(500);
                                $(this).nextAll(".alpaca-fieldset-items-container").slideToggle(500);
                                $(this).nextAll(".alpaca-fieldset-array-toolbar").slideToggle(500);
                            });
                        }

                        if (this.options.legendStyle == 'button') {

                            this.labelDiv.button({
                                icons: {
                                    primary: initIcon
                                }
                            }).click(function() {
                                    _this.fieldSetDiv.toggleClass("fieldset-collapsed");
                                    _this.fieldSetDiv.toggleClass("fieldset-expanded");
                                    $(this).toggleClass("legend-collapsed");
                                    $(this).toggleClass("legend-expanded");
                                    $('.ui-icon', this).toggleClass("ui-icon-circle-arrow-e").toggleClass("ui-icon-circle-arrow-s");
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
                Alpaca.each(this.children, function() {
                    this.destroy();
                });

                // destroy ourselves
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
                var itemContainerTemplate = this.view.getTemplate("fieldSetItemContainer");
                if (itemContainerTemplate) {
                    var containerElem = $.tmpl(itemContainerTemplate, {});
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

                this.outerEl.addClass('ui-widget-content');

                var labelDiv = $('.alpaca-fieldset-legend', this.outerEl);

                if (labelDiv.length) {
                    this.labelDiv = labelDiv;
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

                if (!this.singleLevelRendering) {
                    this.renderItems();
                }

                if (onSuccess) {
                    onSuccess();
                }
            },

            /**
             * Renders all child items of this field.
             *
             * @param onSuccess onSuccess callback.
             */
            renderItems: function(onSuccess) {
            },

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
                        "collapsible": {
                            "title": "Collapsible",
                            "description": "Field set is collapsible if true",
                            "type": "boolean",
                            "default": true
                        },
                        "collapsed": {
                            "title": "Collapsed",
                            "description": "Field set is initially collapsibled if true",
                            "type": "boolean",
                            "default": false
                        },
                        "legendStyle": {
                            "title": "Legend Style",
                            "description": "Field set legend style",
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
                        "collapsible": {
                            "rightLabel": "Field set collapsible ?",
                            "helper": "Field set is collapsible if checked",
                            "type": "checkbox"
                        },
                        "collapsed": {
                            "rightLabel": "Field set initially collapsed ?",
                            "description": "Field set is initially collapsed if checked",
                            "type": "checkbox"
                        },
                        "legendStyle": {
                            "type":"select"
                        }
                    }
                });
            }
        });

})(jQuery);
