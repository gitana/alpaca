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
            if (Alpaca.isEmpty(this.data)) {
                return;
            }
            if (!Alpaca.isObject(this.data)) {
                if (!Alpaca.isString(this.data)) {
                    return;
                } else {
                    try {
                        this.data = $.parseJSON(this.data);
                        if (!Alpaca.isObject(this.data)) {
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
         * @see Alpaca.Field#getValue
         */
        getValue: function() {
            var o = {};

            for (var i = 0; i < this.children.length; i++) {
                var fieldId = this.children[i].getId();
                var propertyId = this.children[i].propertyId;
                var fieldValue = this.children[i].getValue();
                //o[fieldId] = fieldValue;
                o[propertyId] = fieldValue;
            }

            return o;
        },

        /**
         * @see Alpaca.Field#postRender
         */
        postRender: function() {
            this.base();
            // Generates wizard if requested
            if (this.isTopLevel()) {
                if (this.view) {
                    this.wizardConfigs = this.view.getWizard();
                    var layoutTemplate = this.view.getLayout().template;
                    if (this.wizardConfigs && this.wizardConfigs.renderWizard) {
                        if (layoutTemplate) {
                            //Wizard based on layout
                            this.wizard();
                        } else {
                            //Wizard based on injections
                            this.autoWizard();
                        }
                    }
                }
            }
        },

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
         * Adds a child item.
         *
         * @param {String} propertyId Child field property ID.
         * @param {Object} fieldOptions Child field options.
         * @param {Any} value Child field value
         * @param {String} insertAfterId Location where the child item will be inserted.
         */
        addItem: function(propertyId, fieldOptions, value, insertAfterId) {
            var _this = this;
            var itemSchema;
            if (_this.schema && _this.schema.properties && _this.schema.properties[propertyId]) {
                itemSchema = _this.schema.properties[propertyId];
            }
            var containerElem = _this.renderItemContainer(insertAfterId, this, propertyId);

            containerElem.alpaca({
                "data" : value,
                "options": fieldOptions,
                "schema" : itemSchema,
                "view" : this.view.viewObject.id ? this.view.viewObject.id : this.view.viewObject,
                "connector": this.connector,
                "notTopLevel":true,
                "render" : function(fieldControl) {
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
                    fieldControl.render();
                    containerElem.attr("id", fieldControl.getId() + "-item-container");
                    containerElem.attr("alpaca-id", fieldControl.getId());
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
                }
            });
        },

        /**
         * @see Alpaca.ContainerField#renderItems
         */
        renderItems: function() {
            var _this = this;
            var properties = _this.data;
            if (_this.schema && _this.schema.properties) {
                properties = _this.schema.properties;
            }
            for (var propertyId in properties) {
                var fieldSetting = {};
                if (_this.options && _this.options.fields && _this.options.fields[propertyId]) {
                    fieldSetting = _this.options.fields[propertyId];
                }
                var itemData = null;
                if (_this.data) {
                    itemData = _this.data[propertyId];
                }
                _this.addItem(propertyId, fieldSetting, itemData);
            }
            // loop through all items to check their dependencies
            for (var propertyId in properties) {
                if (_this.schema && _this.schema.properties && _this.schema.properties[propertyId]) {
                    var itemSchema = _this.schema.properties[propertyId];
                    var itemDependencies = itemSchema.dependencies;
                    if (itemDependencies) {
                        if (Alpaca.isString(itemDependencies)) {
                            this.enableDependency(propertyId, itemDependencies);
                        } else if (Alpaca.isArray(itemDependencies)) {
                            $.each(itemDependencies, function(index, value) {
                                _this.enableDependency(propertyId, value);
                            })
                        }
                    }
                }
            }
            this.renderValidationState();
        },

        /**
         * Checks status of field dependencies.
         *
         * @param {Object} propertyId Field property id.
         * @param {Object} dependency Property id of the dependency field.
         *
         * @returns {Boolean} True if all dependencies have been satisfied and the field needs to be shown,
         * false otherwise.
         */
        getDependencyStatus: function(propertyId, dependency) {
            var shouldShow = this.childrenByPropertyId[dependency] && !Alpaca.isValEmpty(this.childrenByPropertyId[dependency].data);
            var itemDependencySettings = this.childrenByPropertyId[propertyId].options.dependencies;
            if (shouldShow && itemDependencySettings) {

                if (Alpaca.isArray(itemDependencySettings[dependency])) {

                    if (itemDependencySettings[dependency] && $.inArray(this.childrenByPropertyId[dependency].data, itemDependencySettings[dependency]) == -1 ) {
                        shouldShow = false;
                    }

                } else {

                    if (itemDependencySettings[dependency] != null && (itemDependencySettings[dependency] != this.childrenByPropertyId[dependency].data)) {
                        shouldShow = false;
                    }

                }
            }
            return shouldShow;
        },

        /**
         * Displays or hides a field depending on status of its dependencies
         *
         * @param {String} propertyId Field property id.
         */
        renderDependency: function(propertyId) {
            var item = this.childrenByPropertyId[propertyId];
            var itemDependencies = item.schema.dependencies;
            if (itemDependencies) {
                if (Alpaca.isString(itemDependencies)) {
                    if (this.getDependencyStatus(propertyId, itemDependencies)) {
                        item.show();
                    } else {
                        item.hide();
                    }
                } else if (Alpaca.isArray(itemDependencies)) {

                    var shouldShow = true;
                    var _this = this;
                    $.each(itemDependencies, function(index, value) {
                        shouldShow = shouldShow && _this.getDependencyStatus(propertyId, value);
                    });

                    if (shouldShow) {
                        item.show();
                    } else {
                        item.hide();
                    }
                }
            }
        },

        /**
         * Enables field dependency.
         *
         * @param {String} propertyId Field property ID
         * @param {String} dependency Field dependency property id.
         */
        enableDependency: function(propertyId, dependency) {
            if (this.childrenByPropertyId[propertyId]) {
                this.renderDependency(propertyId);
                // do the binding
                var _this = this;
                if (this.childrenByPropertyId[dependency]) {
                    this.childrenByPropertyId[dependency].getEl().bind("fieldupdate", function(event) {
                        _this.renderDependency(propertyId);
                    });
                }
            }
        },

        /**
         * Renders a template-based wizard.
         */
        wizard: function() {

            var element = this.outerEl;
            var steps = $('.alpaca-wizard-step', element);
            var count = steps.size();

            this.totalSteps = count;
            var _this = this;
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

                var stepId = 'step' + i;
                var wizardStepTemplate = _this.view.getTemplate("wizardStep");
                if (wizardStepTemplate) {
                    var wizardStepElement = $.tmpl(wizardStepTemplate, {});
                    wizardStepElement.attr("id", stepId);
                    $(this).wrap(wizardStepElement);
                }

                var navBarId = stepId + '-nav-bar';
                var wizardNavBarTemplate = _this.view.getTemplate("wizardNavBar");
                if (wizardNavBarTemplate) {
                    var wizardNavBarElement = $.tmpl(wizardNavBarTemplate, {});
                    wizardNavBarElement.attr("id", navBarId);
                    wizardNavBarElement.addClass('alpaca-wizard-nav-bar');
                    $(this).append(wizardNavBarElement);
                }

                if (i == 0) {
                    _this._createNextButton(i);
                    _this._selectStep(i);
                } else if (i == count - 1) {
                    $("#step" + i).hide();
                    _this._createPrevButton(i);
                } else {
                    $("#step" + i).hide();
                    _this._createPrevButton(i);
                    _this._createNextButton(i);
                }
                $("#step" + i + "-nav-bar").buttonset();
            });
        },

        /**
         * Renders a configuration-based wizard without a layout template.
         */
        autoWizard: function() {

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

            this.stepBindings = stepBindings;

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
                var wizardStepTemplate = this.view.getTemplate("wizardStep");
                if (wizardStepTemplate) {
                    var wizardStepElement = $.tmpl(wizardStepTemplate, {});
                    wizardStepElement.attr("id", stepId);
                    $(tmpArray.join(',')).wrapAll(wizardStepElement);
                }

                var navBarId = stepId + '-nav-bar';
                var wizardNavBarTemplate = this.view.getTemplate("wizardNavBar");
                if (wizardNavBarTemplate) {
                    var wizardNavBarElement = $.tmpl(wizardNavBarTemplate, {});
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
                if (i == 0) {
                    this._createNextButton(i);
                    this._selectStep(i);
                } else if (i == totalSteps - 1) {
                    $("#step" + i).hide();
                    this._createPrevButton(i);
                } else {
                    $("#step" + i).hide();
                    this._createPrevButton(i);
                    this._createNextButton(i);
                }
                $("#step" + i + "-nav-bar").buttonset();
            }
        },

        /**
         * Renders wizard status bar.
         *
         * @param {Object} stepTitles Step titles.
         */
        _renderWizardStatusBar: function(stepTitles) {
            var wizardStatusBar = this.wizardConfigs.statusBar;
            if (wizardStatusBar && stepTitles) {
                var wizardStatusBarTemplate = this.view.getTemplate("wizardStatusBar");
                if (wizardStatusBarTemplate) {
                    var wizardStatusBarElement = $.tmpl(wizardStatusBarTemplate, {
                        "id": this.getId() + "-wizard-status-bar",
                        "titles": stepTitles
                    });
                    wizardStatusBarElement.addClass("alpaca-wizard-status-bar ui-widget-header ui-corner-all");
                    return wizardStatusBarElement;
                }
            }
        },

        /**
         * Creates an "prev" button.
         *
         * @param {Integer} i Step number.
         */
        _createPrevButton: function(i) {
            var stepName = "step" + i;
            var _this = this;

            var wizardPreButtonTemplate = this.view.getTemplate("wizardPreButton");
            if (wizardPreButtonTemplate) {
                var wizardPreButtonElement = $.tmpl(wizardPreButtonTemplate, {});
                wizardPreButtonElement.attr("id", stepName + '-button-pre');
                if (wizardPreButtonElement.button) {
                    wizardPreButtonElement.button({
                        text: true,
                        icons: {
                            primary: "ui-icon-triangle-1-w"
                        }
                    });
                }
                wizardPreButtonElement.click(function() {
                    $("#" + stepName).hide();
                    $("#step" + (i - 1)).show();
                    _this._selectStep(i - 1);
                    return false;
                });
                $("#" + stepName + "-nav-bar").append(wizardPreButtonElement);
            }

        },

        /**
         * Creates a "next" button.
         *
         * @param {Integer} i Step number.
         */
        _createNextButton: function(i) {
            var stepName = "step" + i;
            var _this = this;

            var wizardNextButtonTemplate = this.view.getTemplate("wizardNextButton");
            if (wizardNextButtonTemplate) {
                var wizardNextButtonElement = $.tmpl(wizardNextButtonTemplate, {});
                wizardNextButtonElement.attr("id", stepName + '-button-next');
                if (wizardNextButtonElement.button) {
                    wizardNextButtonElement.button({
                        text: true,
                        icons: {
                            secondary: "ui-icon-triangle-1-e"
                        }
                    });
                }
                wizardNextButtonElement.click(function() {
                    var valid = true;

                    if (_this.view && _this.wizardConfigs && _this.wizardConfigs.validation) {
                        $.each(_this.stepBindings, function(propertyId, step) {
                            if (step == i + 1 && valid) {
                                valid = _this.childrenByPropertyId[propertyId].validate();
                            }
                        });
                    }
                    if (valid) {
                        $("#" + stepName).hide();
                        $("#step" + (i + 1)).show();
                        _this._selectStep(i + 1);
                    }
                    return false;
                });

                $("#" + stepName + "-nav-bar").append(wizardNextButtonElement);
            }
        },

        /**
         * Selects a wizard step.
         *
         * @param {Integer} i Step number.
         */
        _selectStep: function(i) {
            $("#" + this.getId() + "-wizard-status-bar" + " li").removeClass("current current-has-next ui-state-highlight ui-corner-all");
            $("#stepDesc" + i).addClass("current ui-state-highlight ui-corner-all");
            if (i < this.totalSteps - 1) {
                $("#stepDesc" + i).addClass("current-has-next");
            }
        },

        /**
         * @private
         * @see Alpaca.ContainerField#getSchemaOfSchema
         */
        getSchemaOfSchema: function() {
            var properties = {
                "properties": {
                    "properties": {
                        "title": "Field Properties",
                        "description": "List of Field Properties",
                        "type": "object"
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
                    "properties": {
                        "title": "Field Option Properties",
                        "description": "List of field option properties",
                        "type": "object"
                    }
                }
            };

            var fieldsProperties = properties.properties.properties;

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
            return "Composite Field";
        },

        /**
         * @see Alpaca.Field#getDescription
         */
        getDescription: function() {
            return "Composite field for containing other fields";
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
        }

    });

    Alpaca.registerFieldClass("object", Alpaca.Fields.ObjectField);
    Alpaca.registerDefaultSchemaFieldMapping("object", "object");
})(jQuery);
