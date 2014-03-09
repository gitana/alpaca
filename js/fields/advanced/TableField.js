(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.TableField = Alpaca.Fields.ArrayField.extend(
    /**
     * @lends Alpaca.Fields.TableField.prototype
     */
    {
        /**
         * @constructs
         * @augments Alpaca.Fields.ArrayField
         *
         * @class Table Field
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
         * @see Alpaca.Fields.TextField#setup
         */
        setup: function() {

            var self = this;

            this.base();

            this.itemContainerTemplateDescriptor = this.view.getTemplateDescriptor("tableFieldSetItemContainer");
        },

        /**
         * @see Alpaca.Field#getDefaultFieldTemplateId
         */
        getDefaultFieldTemplateId : function () {
            return "tableFieldSet";
        },

        renderToolbar: function(containerElem) {

        },

        updateToolbarItemsStatus: function() {

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
        _addItem: function(index, itemSchema, itemOptions, itemData, insertAfterId, isDynamicSubItem, postRenderCallback)
        {
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
                            _this.refreshValidationState();
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

                            _this.updateToolbarItemsStatus(_this.outerEl);

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

                return containerElem;
            }
        },

        /**
         * @see Alpaca.Field#renderField
         */
        renderField: function(onSuccess) {

            var self = this;

            this.base(function() {

                self.outerEl = $(self.outerEl).find("tbody");
                self.fieldContainer = $(self.fieldContainer).find("tbody");
                self.fieldSetDiv = $(self.outerEl).find("tbody");

                onSuccess();

            });

        },

        //__BUILDER_HELPERS

        /**
         * @see Alpaca.ControlField#getTitle
         */
        getTitle: function() {
            return "Table Field";
        },

        /**
         * @see Alpaca.ControlField#getDescription
         */
        getDescription: function() {
            return "Renders array items into a table";
        },

        /**
         * @see Alpaca.ControlField#getType
         */
        getType: function() {
            return "array";
        },

        /**
         * @see Alpaca.ControlField#getFieldType
         */
        getFieldType: function() {
            return "table";
        }//__END_OF_BUILDER_HELPERS
    });

    Alpaca.registerFieldClass("table", Alpaca.Fields.TableField);

    /*
    Alpaca.registerTemplate("tableFieldSetOuterEl", '<table>{{html this.html}}</table>');
    Alpaca.registerTemplate("tableFieldSetItemsContainer", '<tr>{{html this.html}}</tr>');
    Alpaca.registerTemplate("tableFieldSetItemContainer", '<td></td>');
    Alpaca.registerTemplate("tableFieldSet", '{{wrap(null, {}) Alpaca.fieldTemplate(this,"tableFieldSetOuterEl",true)}}{{html Alpaca.fieldTemplate(this,"tableFieldSetLegend")}}{{html Alpaca.fieldTemplate(this,"tableFieldSetHelper")}}{{wrap(null, {}) Alpaca.fieldTemplate(this,"tableFieldSetItemsContainer",true)}}{{/wrap}}{{/wrap}}');
    Alpaca.registerTemplate("tableFieldSetMessage", '<span class="t1 glyphicon glyphicon-exclamation-sign"></span><span class="help-block alpaca-controlfield-message-text">${message}</span>');
    Alpaca.registerTemplate("tableFieldSetLegend", '{{if options.label}}<legend class="t5 {{if options.labelClass}}${options.labelClass}{{/if}}">${options.label}</legend>{{/if}}');
    Alpaca.registerTemplate("tableFieldSetHelper", '{{if options.helper}}<p class="t4 {{if options.helperClass}}${options.helperClass}{{/if}}"><i class="glyphicon glyphicon-info-sign alpaca-helper-icon"></i>${options.helper}</p>{{/if}}');
    */

    /*
    Alpaca.registerTemplate("tableFieldSetOuterEl", '<table>{{html this.html}}</table>');
    Alpaca.registerTemplate("tableFieldSetItemsContainer", '<tbody>{{html this.html}}</tbody>');
    Alpaca.registerTemplate("tableFieldSetItemContainer", '<tr></tr>');
    Alpaca.registerTemplate("tableFieldSet", '{{wrap(null, {}) Alpaca.fieldTemplate(this,"tableFieldSetOuterEl",true)}}{{html Alpaca.fieldTemplate(this,"tableFieldSetLegend")}}{{html Alpaca.fieldTemplate(this,"tableFieldSetHelper")}}{{wrap(null, {}) Alpaca.fieldTemplate(this,"tableFieldSetItemsContainer",true)}}{{/wrap}}{{/wrap}}');
    Alpaca.registerTemplate("tableFieldSetMessage", '<span class="t1 glyphicon glyphicon-exclamation-sign"></span><span class="help-block alpaca-controlfield-message-text">${message}</span>');
    Alpaca.registerTemplate("tableFieldSetLegend", '{{if options.label}}<legend class="t5 {{if options.labelClass}}${options.labelClass}{{/if}}">${options.label}</legend>{{/if}}');
    Alpaca.registerTemplate("tableFieldSetHelper", '{{if options.helper}}<p class="t4 {{if options.helperClass}}${options.helperClass}{{/if}}"><i class="glyphicon glyphicon-info-sign alpaca-helper-icon"></i>${options.helper}</p>{{/if}}');
    */

    Alpaca.registerTemplate("tableFieldSetOuterEl", '<table>{{html this.html}}</table>');
    Alpaca.registerTemplate("tableFieldSetItemsContainer", '<tbody>{{html this.html}}</tbody>');
    Alpaca.registerTemplate("tableFieldSetItemContainer", '<tr></tr>');
    Alpaca.registerTemplate("tableFieldSet", '{{wrap(null, {}) Alpaca.fieldTemplate(this,"tableFieldSetOuterEl",true)}}{{html Alpaca.fieldTemplate(this,"tableFieldSetLegend")}}{{html Alpaca.fieldTemplate(this,"tableFieldSetHelper")}}{{wrap(null, {}) Alpaca.fieldTemplate(this,"tableFieldSetItemsContainer",true)}}{{/wrap}}{{/wrap}}');
    Alpaca.registerTemplate("tableFieldSetMessage", '<span class="t1 glyphicon glyphicon-exclamation-sign"></span><span class="help-block alpaca-controlfield-message-text">${message}</span>');
    Alpaca.registerTemplate("tableFieldSetLegend", '{{if options.label}}<legend class="t5 {{if options.labelClass}}${options.labelClass}{{/if}}">${options.label}</legend>{{/if}}');
    Alpaca.registerTemplate("tableFieldSetHelper", '{{if options.helper}}<p class="t4 {{if options.helperClass}}${options.helperClass}{{/if}}"><i class="glyphicon glyphicon-info-sign alpaca-helper-icon"></i>${options.helper}</p>{{/if}}');


    Alpaca.fieldTemplatePostfix["tableFieldSetLegend"] = "-fieldset-legend";
    Alpaca.fieldTemplatePostfix["tableFieldSetItemsContainer"] = "-fieldset-items-container";
    Alpaca.fieldTemplatePostfix["tableFieldSetHelper"] = "-fieldset-helper";
    Alpaca.fieldTemplatePostfix["tableFieldSetOuterEl"] = "-fieldset";

})(jQuery);
