(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.SwitchViewButtonField = Alpaca.Fields.ButtonField.extend(
    /**
     * @lends Alpaca.Fields.SwitchViewButtonField.prototype
     */
    {
        /**
         * @constructs
         * @augments Alpaca.Fields.ButtonField
         *
         * @class Button control for switching form views.
         *
         * @param {Object} container Field container.
         * @param {Any} data Field data.
         * @param {Object} options Field options.
         * @param {Object} schema Field schema.
         * @param {Object|String} view Field view.
         * @param {Alpaca.Connector} connector Field connector.
         */
        constructor: function(container, data, options, schema, view, connector) {
            this.base(container, data, options, schema, view, connector);
        },

        /**
         * @see Alpaca.Fields.ButtonField#setup
         */
        setup: function() {
            this.base();
            if (!this.data) {
                this.data = this.view.getMessage("switchView");
            }
        },

        /**
         * Shows the switch pane with a list of available views
         */
        switcherPaneShow: function() {
            var _this = this;

            this.switcherPane.css({
                /*
                 top: _this.button.offset().top - _this.switcherPane.height() - 15,
                 left: _this.button.offset().left
                 */
            }).slideDown(50);

            //this.button.css(button_active);
        },

        /**
         * Hides switching pane.
         */
        switcherPaneHide: function() {
            this.switcherPane.slideUp(50, function() {
            });
            //this.button.css(button_default);
        },

        /**
         * @see Alpaca.Fields.ButtonField#onClick
         */
        onClick: function(e) {
            // prepare view list
            var currentView = this.form.topControl.view.viewObject;
            if (Alpaca.isEmpty(this.viewList)) {
                // back up current view
                if (Alpaca.isEmpty(Alpaca.views[currentView.id])) {
                    if (Alpaca.isEmpty(currentView.id)) {
                        currentView.id = Alpaca.generateViewId();
                    }
                    if (Alpaca.isEmpty(currentView.description)) {
                        currentView.title = this.view.getMessage("currentView");
                    }
                    Alpaca.registerView(currentView);
                }
                var viewList = [];
                for (var viewId in Alpaca.views) {
                    viewList.push({
                        "id": viewId,
                        "desc": Alpaca.views[viewId].title
                    });
                }
                this.viewList = viewList;
            }
            // generate view selection list
            var viewListStr = '<div class="ui-widget ui-widget-content ui-corner-all alpaca-form-button-view-switcher"><div class="ui-state-highlight"><ul>';
            $.each(this.viewList, function(index, value) {
                viewListStr += '<li><a href="#" id="' + value.id + '"';
                if (value.id == currentView.id || value.id == currentView) {
                    viewListStr += ' class="current"';
                }
                viewListStr += '>' + value.desc + '</a></li>';
            });
            viewListStr += "</url></div></div>";
            this.switcherPane = $(viewListStr);

            var _this = this;
            this.switcherPane.find('a').click(function() {
                var viewId = $(this).attr('id');
                _this.form.topControl.initializing = true;
                _this.form.topControl.render(viewId);
                _this.switcherPaneHide();
                return false;
            });

            /*
             this.switcherPane.hover(function() {
             }, function() {
             if (_this.switcherPane.is(':visible')) {
             _this.switcherPaneHide();
             }
             });
             */
            this.switcherPane.click(function() {
                if (_this.switcherPane.is(':visible')) {
                    _this.switcherPaneHide();
                }
            });

            this.fieldContainer.append(this.switcherPane.hide());

            this.switcherPaneShow();
        },

        /**
         * @see Alpaca.ControlField#postRender
         */
        postRender: function() {
            this.base();
            this.field.addClass("alpaca-form-button-switchview");
            this.button = this.field.button({
                text: true,
                icons: {
                    primary: "ui-icon-shuffle"
                }
            });
        },

        /**
         * @see Alpaca.Fields.ButtonField#getTitle
         */
        getTitle: function() {
            return "Alpaca Switch View Button";
        },

        /**
         * @see Alpaca.Fields.ButtonField#getDescription
         */
        getDescription: function() {
            return "Alpaca button for switching views.";
        }
    });

    // Registers additonal messages
    Alpaca.registerMessages({
        "switchView": "Switch View",
        "currentView": "Current Custom View"
    });

    Alpaca.registerFieldClass("switchviewbutton", Alpaca.Fields.SwitchViewButtonField);

})(jQuery);
