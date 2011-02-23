(function($) {

    var Alpaca = $.alpaca;
    
    /**
     * Switch View Button class
     */
    Alpaca.Fields.AlpacaSwitchViewButtonField = Alpaca.Fields.AlpacaButtonField.extend({
    
        /**
         * @Override
         *
         * Sets up any default values for this field.
         */
        setup: function() {
            this.base();
            
            if (!this.data) {
                this.data = Alpaca.getMessage("switchView", this);
            }
            
        },
        
        switcherPaneShow: function() {
			var _this = this;
            this.switcherPane.css({
                top: _this.button.offset().top + 30,
                left: _this.button.offset().left
            }).slideDown(50);
            //this.button.css(button_active);
        },
        
        switcherPaneHide: function() {
            this.switcherPane.slideUp(50, function() {
            });
            //this.button.css(button_default);
        },
        
        /**
         * @Override
         */
        onClick: function(e) {
			// prepare view list
			var currentView = this.form.topField.view;
			if (Alpaca.isEmpty(this.viewList)) {
				// back up current view
				if (Alpaca.isObject(currentView)) {
					if (Alpaca.isEmpty(currentView.id)) {
						currentView.id = "VIEW_" + Alpaca.generateId();
					}
					if (Alpaca.isEmpty(currentView.description)) {
						currentView.description = Alpaca.getMessage("currentView", this);
					}
					Alpaca.registerView(currentView);
				}
				var viewList = [];
				for (var viewId in Alpaca.views) {
					viewList.push({
						"id": viewId,
						"desc": Alpaca.views[viewId].description
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
				_this.form.topField.initializing = true;
				_this.form.topField.render(viewId);
				_this.switcherPaneHide();
				return false;
			});
			
			this.switcherPane.hover(function() {
			}, function() {
				if (_this.switcherPane.is(':visible')) {
					_this.switcherPaneHide();
				}
			});
			
			this.fieldContainer.append(this.switcherPane.hide());
			
			this.switcherPaneShow();
		},
        
        /**
         * @Override
         */
        postRender: function() {
            this.base();
            this.button = this.inputElement.button({
                text: true,
                icons: {
                    primary: "ui-icon-shuffle"
                }
            });
        },
        
        /**
         * @Override
         */
        getTitle: function() {
            return "Alpaca Switch View Button";
        },
        
        /**
         * @Override
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
    
    Alpaca.registerFieldClass("alpacaswitchviewbutton", Alpaca.Fields.AlpacaSwitchViewButtonField);
    
})(jQuery);
