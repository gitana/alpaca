(function($) {

    var Alpaca = $.alpaca;
    
    /**
     * Default control for the treatment of a JSON object.
     */
    Alpaca.Fields.ObjectField = Alpaca.ContainerField.extend({
    
         /**
         * @Override
         *
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
         * @Override
         *
         * Pick apart the data object and set onto child fields.
         *
         * Data must be an object.
         */
        setValue: function(data, stopUpdateTrigger) {
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
         * @Override
         *
         * Reconstruct the data object from the child fields.
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
         * Override
         */
        postRender: function() {
            this.base();
            
            // Generates wizard if requested
            if (this.isTopLevel()) {
                //if (this.view && this.wizardConfigs && this.wizardConfigs.renderWizard) {               
                if (this.view) {
                    this.wizardConfigs = Alpaca.getViewParam('wizard', this);
                    this.templatesConfigs = Alpaca.getViewParam('templates', this);
                    if (this.wizardConfigs && this.wizardConfigs.renderWizard) {
                        if (this.templatesConfigs && this.templatesConfigs.layout) {
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
         * Gets child index
         *
         * @param {Object} propertyId
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
         * @Override
         *
         * Adds item
         */
        addItem: function(propertyId, fieldSetting, value, insertAfterId) {
            var _this = this;
            var itemSchema;
            if (_this.schema && _this.schema.properties && _this.schema.properties[propertyId]) {
                itemSchema = _this.schema.properties[propertyId];
            }
            var containerElem = _this.renderItemContainer(insertAfterId, this, propertyId);
            Alpaca(containerElem, value, fieldSetting, itemSchema, this.getView(), function(fieldControl) {
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
            });
        },
        
        /**
         * @Override
         *
         * Renders all properties
         *
         * We need to validate data against schema before rendering if schema
         * is present.
         *
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
         *
         * @param {Object} propertyId
         * @param {Object} dependency
         */
        getDependencyStatus: function(propertyId, dependency) {
            var shouldShow = !Alpaca.isValEmpty(this.childrenByPropertyId[dependency].data);
            var itemDependencySettings = this.childrenByPropertyId[propertyId].options.dependencies;
            if (shouldShow && itemDependencySettings) {
                if (itemDependencySettings[dependency] && (itemDependencySettings[dependency] != this.childrenByPropertyId[dependency].data)) {
                    shouldShow = false;
                }
            }
            return shouldShow;
        },
        
        /**
         * Displays or hides item depending on status of its dependencies
         *
         * @param {Object} propertyId
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
         * Enable item dependency
         *
         * @param {Object} dependency
         */
        enableDependency: function(propertyId, dependency) {
            if (this.childrenByPropertyId[propertyId]) {
                this.renderDependency(propertyId);
                // do the binding
                var _this = this;
                this.childrenByPropertyId[dependency].getEl().bind("fieldupdate", function(event) {
                    _this.renderDependency(propertyId);
                });
            }
        },
        
        /**
         * Renders wizard
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
                var wizardStepTemplate = Alpaca.getTemplate("wizardStep", _this);
                if (wizardStepTemplate) {
                    var wizardStepElement = $.tmpl(wizardStepTemplate, {});
                    wizardStepElement.attr("id", stepId);
                    $(this).wrap(wizardStepElement);
                }
                
                var navBarId = stepId + '-nav-bar';
                var wizardNavBarTemplate = Alpaca.getTemplate("wizardNavBar", _this);
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
         * Renders wizard without layout
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
                var wizardStepTemplate = Alpaca.getTemplate("wizardStep", this);
                if (wizardStepTemplate) {
                    var wizardStepElement = $.tmpl(wizardStepTemplate, {});
                    wizardStepElement.attr("id", stepId);
                    $(tmpArray.join(',')).wrapAll(wizardStepElement);
                }
                
                var navBarId = stepId + '-nav-bar';
                var wizardNavBarTemplate = Alpaca.getTemplate("wizardNavBar", this);
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
         * Renders wizard status bar
         *
         * @param {Object} stepTitles
         */
        _renderWizardStatusBar: function(stepTitles) {
            var wizardStatusBar = this.wizardConfigs.statusBar;
            if (wizardStatusBar && stepTitles) {
                var wizardStatusBarTemplate = Alpaca.getTemplate("wizardStatusBar", this);
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
         * Creates prev button
         *
         * @param {Object} i
         */
        _createPrevButton: function(i) {
            var stepName = "step" + i;
            var _this = this;
            
            /*
             var wizardPreButtonTemplate = Alpaca.getTemplate("wizardPreButton", this);
             if (wizardPreButtonTemplate) {
             var wizardPreButtonElement = $.tmpl(wizardPreButtonTemplate, {});
             wizardPreButtonElement.attr("id", stepName + '-button-pre');
             wizardPreButtonElement.addClass('alpaca-wizard-button alpaca-wizard-button-back');
             $("#" + stepName + "-nav-bar").append(wizardPreButtonElement);
             }
             
             $("#" + stepName + "-button-pre").bind("click", function(e) {
             $("#" + stepName).hide();
             $("#step" + (i - 1)).show();
             _this._selectStep(i - 1);
             });
             */
            var wizardPreButtonTemplate = Alpaca.getTemplate("wizardPreButton", this);
            if (wizardPreButtonTemplate) {
                var wizardPreButtonElement = $.tmpl(wizardPreButtonTemplate, {});
                wizardPreButtonElement.attr("id", stepName + '-button-pre');
                wizardPreButtonElement.button({
                    text: true,
                    icons: {
                        primary: "ui-icon-triangle-1-w"
                    }
                }).click(function() {
                    $("#" + stepName).hide();
                    $("#step" + (i - 1)).show();
                    _this._selectStep(i - 1);
                    return false;
                });
                $("#" + stepName + "-nav-bar").append(wizardPreButtonElement);
            }
            
        },
        
        /**
         * Creates next button
         *
         * @param {Object} i
         */
        _createNextButton: function(i) {
            var stepName = "step" + i;
            var _this = this;
            
            /*
             var wizardNextButtonTemplate = Alpaca.getTemplate("wizardNextButton", this);
             if (wizardNextButtonTemplate) {
             var wizardNextButtonElement = $.tmpl(wizardNextButtonTemplate, {});
             wizardNextButtonElement.attr("id", stepName + '-button-next');
             wizardNextButtonElement.addClass('alpaca-wizard-button alpaca-wizard-button-next');
             $("#" + stepName + "-nav-bar").append(wizardNextButtonElement);
             }
             
             $("#" + stepName + "-button-next").bind("click", function(e) {
             $("#" + stepName).hide();
             $("#step" + (i + 1)).show();
             
             _this._selectStep(i + 1);
             });
             */
            var wizardNextButtonTemplate = Alpaca.getTemplate("wizardNextButton", this);
            if (wizardNextButtonTemplate) {
                var wizardNextButtonElement = $.tmpl(wizardNextButtonTemplate, {});
                wizardNextButtonElement.attr("id", stepName + '-button-next');
                wizardNextButtonElement.button({
                    text: true,
                    icons: {
                        secondary: "ui-icon-triangle-1-e"
                    }
                }).click(function() {
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
         * Selects wizard step
         *
         * @param {Object} i
         */
        _selectStep: function(i) {
            $("#" + this.getId() + "-wizard-status-bar" + " li").removeClass("current current-has-next ui-state-highlight ui-corner-all");
            $("#stepDesc" + i).addClass("current ui-state-highlight ui-corner-all");
            if (i < this.totalSteps - 1) {
                $("#stepDesc" + i).addClass("current-has-next");
            }
        },
        
        /**
         * @Override
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
         * @Override
         */
        getTitle: function() {
            return "Composite Field";
        },
        
        /**
         * @Override
         */
        getDescription: function() {
            return "Composite field for containing other fields";
        },
        
        /**
         * @Override
         */
        getType: function() {
            return "object";
        },
        
        /**
         * @Override
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
         * @Override
         */
        getFieldType: function() {
            return "object";
        }
        
    });
    
    Alpaca.registerFieldClass("object", Alpaca.Fields.ObjectField);
    Alpaca.registerDefaultSchemaFieldMapping("object", "object");
})(jQuery);
