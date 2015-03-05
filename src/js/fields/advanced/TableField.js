(function($) {

    var Alpaca = $.alpaca;

    /**
     * The table field is used for data representations that consist of an array with objects inside of it.  The objects
     * must have a uniform structure.  The table field renders a standard HTML table using the table.  The individual
     * columns are either editable (in edit mode) or simply displayed in read-only mode.
     */
    Alpaca.Fields.TableField = Alpaca.Fields.ArrayField.extend(
    /**
     * @lends Alpaca.Fields.TableField.prototype
     */
    {
        setup: function()
        {
            var self = this;

            if (!self.options)
            {
                self.options = {};
            }

            if (typeof(self.options.animate) === "undefined")
            {
                self.options.animate = false;
            }

            this.base();

            if (!this.options.items.type)
            {
                this.options.items.type = "tablerow";
            }

            // support for either "datatable" or "datatables"
            if (this.options.datatable) {
                this.options.datatables = this.options.datatable;
            }

            // assume empty options for datatables
            if (typeof(this.options.datatables) === "undefined")
            {
                this.options.datatables = {
                    "paging": false,
                    "lengthChange": false,
                    "info": false,
                    "searching": false,
                    "ordering": true
                };
            }

            // assume actions column to be shown
            if (typeof(this.options.showActionsColumn) === "undefined")
            {
                this.options.showActionsColumn = true;

                if (this.options.readonly)
                {
                    this.options.showActionsColumn = false;
                }

                if (this.isDisplayOnly())
                {
                    this.options.showActionsColumn = false;
                }
            }
        },

        /**
         * @see Alpaca.ControlField#getFieldType
         */
        getFieldType: function() {
            return "table";
        },

        /**
         * The table field uses the "array" container convention to render the DOM.  As such, nested objects are wrapped
         * in "field" elements that result in slightly incorrect table structures.  Part of the reason for this is that
         * browsers are very fussy when it comes to injection of nested TR or TD partials.  Here, we generate most
         * things as DIVs and then do some cleanup in this method to make sure that the table is put togehter in the
         * right way.
         *
         * @param model
         * @param callback
         */
        afterRenderContainer: function(model, callback)
        {
            var self = this;

            this.base(model, function() {

                self.cleanupDomInjections();

                // apply styles of underlying "table"
                var table = $(this.container).find("table");
                self.applyStyle("table", table);

                // if the DataTables plugin is available, use it
                if (self.options.datatables)
                {
                    if ($.fn.DataTable)
                    {
                        $(this.container).find("table").DataTable(self.options.datatables);
                    }
                }

                callback();

            }.bind(self));
        },

        cleanupDomInjections: function()
        {
            /**
             * Takes a DOM element and merges it "up" to the parent element.  Data attributes and some classes are
             * copied from DOM element into the parent element.  The children of the DOM element are added to the
             * parent and the DOM element is removed.
             *
             * @param mergeElement
             */
            var mergeElementUp = function(mergeElement)
            {
                var mergeElementParent = $(mergeElement).parent();
                var mergeElementChildren = $(mergeElement).children();

                // copy merge element classes to parent
                var classNames =$(mergeElement).attr('class').split(/\s+/);
                $.each( classNames, function(index, className){
                    if (className === "alpaca-merge-up") {
                        // skip
                    } else {
                        $(mergeElementParent).addClass(className);
                    }
                });

                // copy attributes to TR
                $.each($(mergeElement)[0].attributes, function() {
                    if (this.name && this.name.indexOf("data-") === 0)
                    {
                        $(mergeElementParent).attr(this.name, this.value);
                    }
                });

                // replace field with children
                if (mergeElementChildren.length > 0)
                {
                    $(mergeElement).replaceWith(mergeElementChildren);
                }
                else
                {
                    $(mergeElement).remove();
                }
            };

            // find each TR's .alpaca-field and merge up
            this.getFieldEl().find("tr > .alpaca-field").each(function() {
                mergeElementUp(this);
            });

            // find each TR's .alpaca-container and merge up
            this.getFieldEl().find("tr > .alpaca-container").each(function() {
                mergeElementUp(this);
            });

            // find the action bar and slip a TD around it
            var alpacaArrayActionbar = this.getFieldEl().find("." + Alpaca.MARKER_CLASS_ARRAY_ITEM_ACTIONBAR);
            if (alpacaArrayActionbar.length > 0)
            {
                alpacaArrayActionbar.each(function() {
                    var td = $("<td class='actionbar' nowrap='nowrap'></td>");
                    $(this).before(td);
                    $(td).append(this);
                });
            }

            // find anything else with .alpaca-merge-up and merge up
            this.getFieldEl().find(".alpaca-merge-up").each(function() {
                mergeElementUp(this);
            });
        },

        doResolveItemContainer: function()
        {
            var self = this;

            return $(self.container).find("table tbody");
        },

        doAfterAddItem: function(item)
        {
            var self = this;

            self.cleanupDomInjections();
        },

        doAfterRemoveItem: function(item)
        {
            var self = this;

            self.cleanupDomInjections();
        },

        /**
         * @see Alpaca.ControlField#getType
         */
        getType: function() {
            return "array";
        }


        /* builder_helpers */
        ,

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
         * @private
         * @see Alpaca.Fields.TextField#getSchemaOfOptions
         */
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "datatables": {
                        "title": "DataTables Configuration",
                        "description": "Optional configuration to be passed to the underlying DataTables Plugin.",
                        "type": "object"
                    },
                    "showActionsColumn": {
                        "title": "Show Actions Column",
                        "default": true,
                        "description": "Whether to show or hide the actions column.",
                        "type": "boolean"
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.Fields.TextField#getOptionsForOptions
         */
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "datatables": {
                        "type": "object"
                    },
                    "showActionsColumn": {
                        "type": "checkbox"
                    }
                }
            });
        }

        /* end_builder_helpers */
    });

    Alpaca.registerFieldClass("table", Alpaca.Fields.TableField);

})(jQuery);
