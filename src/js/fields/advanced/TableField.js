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

            // assume toolbar sticky if not otherwise specified
            if (typeof(this.options.toolbarSticky) === "undefined")
            {
                this.options.toolbarSticky = true;
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

                // draggable reorder of rows
                if (typeof(this.options.dragRows) == "undefined")
                {
                    this.options.dragRows = false;
                }

                if (this.options.readonly)
                {
                    this.options.dragRows = false;
                }

                if (this.isDisplayOnly())
                {
                    this.options.dragRows = false;
                }
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

            // data tables columns
            this.options.datatables.columns = [];

            // initialize data tables to detect alpaca field types and perform alpaca field sorting and filtering
            if ($.fn.dataTableExt && !$.fn.DataTable.ext.type.search["alpaca"])
            {
                $.fn.DataTable.ext.order["alpaca"] = function (settings, col) {

                    return this.api().column( col, {order:'index'} ).nodes().map( function ( td, i ) {
                        var alpacaId = $(td).children().attr("data-alpaca-field-id");
                        return Alpaca.fieldInstances[alpacaId].getValue();
                    } );

                };

                // this is a kind of hacky function at the moment, trying to do filtering that takes into account
                // alpaca field values
                //
                // according to data tables authors, need to wait for next release for refactoring of filtering
                // logic in data tables to really take control of this and do it right
                // this "sort of" works for now
                //
                $.fn.dataTableExt.afnFiltering.push(function(settings, fields, fieldIndex, data, dataIndex) {

                    var text = $(settings.nTableWrapper).find(".dataTables_filter input[type='search']").val();

                    if (!text) {
                        return true;
                    }

                    text = "" + text;

                    text = $.trim(text);
                    text = text.toLowerCase();

                    var match = false;

                    for (var i = 0; i < data.length; i++)
                    {
                        var dataValue = data[i];
                        if (dataValue)
                        {
                            var z = dataValue.indexOf("data-alpaca-field-id=");
                            if (z > -1)
                            {
                                var alpacaId = $(dataValue).attr("data-alpaca-field-id");

                                var alpacaValue = Alpaca.fieldInstances[alpacaId].getValue();
                                if (alpacaValue)
                                {
                                    alpacaValue = "" + alpacaValue;
                                    alpacaValue = alpacaValue.toLowerCase();

                                    if (alpacaValue.indexOf(text) > -1)
                                    {
                                        match = true;
                                        break;
                                    }
                                }
                            }
                        }
                    }

                    return match;
                });
            }
        },

        /**
         * @see Alpaca.ControlField#getFieldType
         */
        getFieldType: function() {
            return "table";
        },

        prepareContainerModel: function(callback)
        {
            var self = this;

            self.base(function(model) {

                // build a separate "items" array that we'll use to build out the table header
                model.headers = [];
                if (self.schema.items && self.schema.items.properties)
                {
                    for (var k in self.schema.items.properties)
                    {
                        var header = {};
                        header.id = k;
                        header.title = self.schema.items.properties[k].title;
                        header.hidden = false;
                        if (self.options.items && self.options.items.fields && self.options.items.fields[k])
                        {
                            if (self.options.items.fields[k].label)
                            {
                                header.title = self.options.items.fields[k].label;
                            }

                            if (self.options.items.fields[k].type === "hidden")
                            {
                                header.hidden = true;
                            }
                        }

                        model.headers.push(header);
                    }
                }

                callback(model);
            });
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
                        // if we're setting up for dragging rows, then add that column
                        if (self.options.dragRows)
                        {
                            self.options.datatables.columns.push({
                                "orderable": false,
                                "name": "dragRowsIndex",
                                "hidden": true
                            });

                            self.options.datatables.columns.push({
                                "orderable": false,
                                "name": "dragRowsDraggable"
                            });
                        }

                        // mix in fields from the items
                        for (var k in self.schema.items.properties)
                        {
                            self.options.datatables.columns.push({
                                "orderable": true,
                                "orderDataType": "alpaca"
                            });
                        }

                        // if we have an actions column enabled, then turn off sorting for the actions column (assumed to be last)
                        if (self.options.showActionsColumn)
                        {
                            self.options.datatables.columns.push({
                                "orderable": false,
                                "name": "actions"
                            });
                        }

                        if (self.options.dragRows)
                        {
                            self.options.datatables["rowReorder"] = {
                                "selector": "tr td.alpaca-table-reorder-draggable-cell",
                                "dataSrc": 0,
                                "snapX": true,
                                "update": true
                            };
                        }

                        // EVENT HANDLERS

                        // listen for the "ready" event and when it fires, init data tables
                        // this ensures that the DOM and anything wrapping our table field instance is ready to rock
                        // before we proceed
                        self.off("ready");
                        self.on("ready", function() {

                            // tear down old data tables data if it is still around
                            if (self._dt) {
                                self._dt.destroy();
                                self._dt = undefined;
                            }

                            // table dom element
                            var table = $(self.container).find("table");

                            // data table reference
                            self._dt = $(table).DataTable(self.options.datatables);

                            // listen for the "row-reorder" event
                            self._dt.on("row-reorder", function(e, diff, edit) {

                                if (self._dt._disableAlpacaHandlers) {
                                    return;
                                }

                                // update our data structure to reflect the shift in positions
                                if (diff.length > 0)
                                {
                                    if (diff[0].oldPosition !== diff[0].newPosition)
                                    {
                                        self._dt._disableAlpacaHandlers = true;
                                        self.moveItem(diff[0].oldPosition, diff[0].newPosition, false, function() {
                                            // all done
                                        });
                                    }
                                }
                            });

                            // listen for the underlying table DOM element being destroyed
                            // when that happens, tear down the datatables implementation as well
                            $(self.container).bind('destroyed', function() {
                                if (self._dt) {
                                    self._dt.destroy();
                                    self._dt = undefined;
                                }
                            });

                            // listen for the sorting event
                            // change the order of children and refresh
                            self._dt.on('order', function ( e, ctx, sorting, columns ) {

                                if (self._dt._disableAlpacaHandlers) {
                                    return;
                                }

                                // if we don't have an original copy of the children, make one
                                // we're about to re-order the children and datatable assumes we know the original order
                                if (!self._dt._originalChildren) {
                                    self._dt._originalChildren = [];
                                    for (var k = 0; k < self.children.length; k++) {
                                        self._dt._originalChildren.push(self.children[k]);
                                    }
                                }

                                // re-order based on the order that datatables believes is right
                                var newChildren = [];
                                for (var z = 0; z < ctx.aiDisplay.length; z++)
                                {
                                    var index = ctx.aiDisplay[z];
                                    newChildren.push(self._dt._originalChildren[index]);
                                }
                                self.children = newChildren;

                                self._dt._disableAlpacaHandlers = false;
                            });

                        });
                    }
                }

                // walk through headers and allow for callback-based config
                $(table).find("thead > tr > th[data-header-id]").each(function() {

                    var key = $(this).attr("data-header-id");

                    var schema = self.schema.items.properties[key];
                    var options = null;
                    if (self.options.items.fields && self.options.items.fields[key]) {
                        options = self.options.items.fields[key];
                    }

                    // CALLBACK: "tableHeaderRequired" or "tableHeaderOptional"
                    if (schema.required || (options && options.required))
                    {
                        // CALLBACK: "tableHeaderRequired"
                        self.fireCallback("tableHeaderRequired", schema, options, this);
                    }
                    else
                    {
                        // CALLBACK: "tableHeaderOptional"
                        self.fireCallback("tableHeaderOptional", schema, options, this);
                    }

                });

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

            // find the alpaca-table-reorder-draggable-cell and slip a TD around it
            var alpacaTableReorderDraggableCells = this.getFieldEl().find(".alpaca-table-reorder-draggable-cell");
            if (alpacaTableReorderDraggableCells.length > 0)
            {
                alpacaTableReorderDraggableCells.each(function() {
                    var td = $("<td class='alpaca-table-reorder-draggable-cell'></td>");
                    $(this).before(td);
                    $(td).append($(this).children());
                    $(this).remove();
                });
            }

            // find the alpaca-table-reorder-index-cell, slip a TD around it and insert value
            var alpacaTableReorderIndexCells = this.getFieldEl().find(".alpaca-table-reorder-index-cell");
            if (alpacaTableReorderIndexCells.length > 0)
            {
                alpacaTableReorderIndexCells.each(function(i) {
                    var td = $("<td class='alpaca-table-reorder-index-cell'>" + i + "</td>");
                    $(this).before(td);
                    $(this).remove();
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

        doAfterAddItem: function(item, callback)
        {
            var self = this;

            self.data = self.getValue();

            self.cleanupDomInjections();

            // if we're using dragRows support, we have no choice here except to completely reboot the table in order
            // to get DataTables to bind things correctly for drag-drop support
            // TODO: change dragRows to use our own drag/drop tooling and get rid of DataTables Row Reorder Plugin
            // we also have do this if we've added the first row to get DataTables to redraw
            var usingDataTables = self.options.datatables && $.fn.DataTable;
            if (self.options.dragRows || (usingDataTables && self.data.length === 1))
            {
                // refresh
                self.refresh(function() {

                    callback();
                });
            }
            else
            {
                callback();
            }
        },

        doAfterRemoveItem: function(childIndex, callback)
        {
            var self = this;

            self.data = self.getValue();

            self.cleanupDomInjections();

            // TODO: see above

            var usingDataTables = self.options.datatables && $.fn.DataTable;
            if (self.options.dragRows || (usingDataTables && self.data.length === 0))
            {
                // refresh
                self.refresh(function () {
                    callback();
                });

                callback();
            }
            else
            {
                callback();
            }
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
                    },
                    "dragRows": {
                        "title": "Drag Rows",
                        "default": false,
                        "description": "Whether to enable the dragging of rows via a draggable column.  This requires DataTables and the DataTables Row Reorder Plugin.",
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
                    },
                    "dragRows": {
                        "type": "checkbox"
                    }
                }
            });
        }

        /* end_builder_helpers */
    });

    Alpaca.registerFieldClass("table", Alpaca.Fields.TableField);

})(jQuery);
