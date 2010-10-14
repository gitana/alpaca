(function($) {
	
	var Alpaca = $.alpaca;	

	/**
	 * Abstract Container Field
	 * 
	 * Extends Field to provide for parenting of child fields.
	 * 
	 * Custom field implementation should extend this if they intend to be containers of subcontrols - examples include
	 * tree controls, list controls and more.
	 * 
	 * {
	 *    collapsible: <boolean>
	 *    collapsed: <boolean>
	 * }
	 */
	Alpaca.ContainerField = Alpaca.Field.extend({ 
		
		/**
		 * Override so that we can set up containers to hold subfields.
		 * We also check for valid data type.
		 */
		setup: function()
		{
			this.base();

			// holders of references to children
			this.children = [];
			this.childrenById = [];			
    	},
    	    	
    	/**
    	 * Helper method to register child fields of this field.
    	 */
    	addChild: function(child)
    	{
    		this.children.push(child);
    		this.childrenById[child.getId()] = child;
    		
    		child.parent = this;
    	},
    	    	
    	/**
    	 * Provide default behavior rendering fields in a very blocky kind of way.
    	 * Makes a best guess about how to lay things out.
    	 * 
    	 * If you want to change how this renders, plug in a template!
    	 * 
    	 * This works against as an OBJECT or an ARRAY.
    	 */
		handleNoTemplateRender: function(parentEl, onSuccess)
		{
    		var _this = this;
    		
    		this.fieldset = $("<fieldset></fieldset>");    		
    		//this.legend = $("<legend></legend>");
    		//this.legend.addClass("alpaca-Object-legend");
    		
    		/*
    		if (this.settings.collapsible)
    		{
    			var collapseImg = $("<div></div>");
    			collapseImg.addClass("alpaca-Object-collapseImg");
    			collapseImg.appendTo(this.legend);
    			
    			this.fieldset.addClass("alpaca-Expanded");
    		}
    		*/
    		
    		/*
    		if(!lang.isUndefined(this.settings.legend) && this.settings.legend !== '')
    		{
    			this.legend.appendChild( alpaca.cn("span", null, null, " "+this.settings.legend) );
    		}
    		*/
   
    		/*
    		if( this.settings.collapsible || (!lang.isUndefined(this.settings.legend) && this.settings.legend !== '') ) 
    		{
    			this.fieldset.appendChild(this.legend);
    		}
    		*/
    		
    		// write to dom
    		$(this.fieldset).appendTo(parentEl);
    		
    		if (Alpaca.isObject(this.data))
    		{
	    		for (var fieldId in this.data)
	    		{
	    			if (this.data.hasOwnProperty(fieldId))
	    			{
	    				var fieldData = this.data[fieldId];
	    				var fieldSettings = {};
	    				if (this.settings && this.settings.properties)
	    				{
	    					fieldSettings = this.settings.properties[fieldId];
	    				}
	    				var fieldOptions = {
	    					"id": fieldId,
	    					"type": null, // NOTE: let the type float
	    					"schema": null,
	    					"settings": fieldSettings
	    				};
	    				var fieldContainer = this.fieldset;
	    				
	    				// plug in the sub-schema if possible
	    				if (this.schema)
	    				{
	    					if (this.schema.properties)
	    					{
	    						fieldOptions["schema"] = this.schema.properties[fieldId];
	    					}
	    				}
	    				
	    				// render control
	    				var fieldControl = Alpaca(fieldContainer, fieldData, fieldOptions);
	    				this.addChild(fieldControl);
	    				fieldControl.render(_this.getMode());
	    				
	    				// add in a div to act as a line separator
	    				var clearDiv = $("<div></div>");
	    				clearDiv.addClass("alpaca-clear-div");
	    				clearDiv.appendTo(fieldContainer);
	    			}
	    		}
    		}
    		else if (Alpaca.isArray(this.data))
    		{
    			for (var x = 0; x < this.data.length; x++)
    			{
    				var fieldId = this.getId(); // NOTE: our own field id
    				var fieldData = this.data[x];    				
    				var fieldSettings = {};    				
    				var fieldOptions = {
    					"id": fieldId,
    					"type": null, // NOTE: let the type float
    					"schema": null,
    					"settings": fieldSettings
    				};
    				var fieldContainer = this.fieldset;
	    				
    				// plug in the sub-schema if possible
    				if (this.schema)
    				{
    					if (this.schema.properties)
    					{
    						fieldOptions["schema"] = this.schema.properties[fieldId];
    					}
    				}

    				// render control
    				var fieldControl = Alpaca(fieldContainer, fieldData, fieldOptions);
    				this.addChild(fieldControl);
    				fieldControl.render(_this.getMode());
    				
    				// add in a div to act as a line separator
    				var clearDiv = $("<div></div>");
    				clearDiv.addClass("alpaca-clear-div");
    				clearDiv.appendTo(fieldContainer);
	    		}
    		}
    		
    		/*
    		if (this.options.collapsed)
    		{
    			this.toggleCollapse();
    		}
    		*/
    		
    		if (onSuccess)
    		{
    			onSuccess();
    		}    		
    	},
    	    	
    	initEvents: function()
    	{
    		var _this = this;
    		
    		// if collapsible
    		if (this.settings.collapsible)
    		{
    			$(this.legend).click(function(e) {
    				_this.toggleCollapse();
    			});
    		}
    	},
    	
    	toggleCollapse: function()
    	{
    		if ($(this.fieldset).hasClass("alpaca-Expanded"))
    		{
    			$(this.fieldset).removeClass("alpaca-Expanded");
    			$(this.fieldset).addClass("alpaca-Collapsed");
    		}
    		else
    		{
    			$(this.fieldset).removeClass("alpaca-Collapsed");
    			$(this.fieldset).addClass("alpaca-Expanded");
    		}    			
    	},
    	
    	handleValidate: function()
    	{
    		// validate all of the fields, one at a time
    		var response = true;
    		
    		Alpaca.each(this.children, function() {
    			
    			this.renderValidationState();
    			
    			var state = this.getValidationState();
    			if (state == Alpaca.STATE_REQUIRED || state == Alpaca.STATE_INVALID)
    			{
    				response = false;
    			}
    		});
    		
    		return response;
    	},
    	    	    	    	
    	clear: function(stopUpdateTrigger)
    	{
    		// clear all the kiddies
    		Alpaca.each(this.children, function() {
    			this.clear(false);
    		});
    		
    		// trigger update all at once
    		if (!stopUpdateTrigger)
    		{
    			this.triggerUpdate();
    		}
    	},
    	
    	destroy: function()
    	{
    		Alpaca.each(this.children, function() {
    			this.destroy();
    		});
    		
    		// destroy ourselves
    		this.base();
    	},
    	
		/**
		 * @Override
		 * 
		 * Renders the loaded template.
		 * This works against as an OBJECT or an ARRAY.
		 */
		_renderLoadedTemplate: function(parentEl, templateString, onSuccess)
    	{
    		var _this = this;

    		/// Custom options passed into the tmpl engine
    		var renderContext = 
    		{
    			// this function is called by the custom {{alpaca}} template token
    			alpaca: function(nothing, fieldId, fieldOptions)
    			{
    				var item = this;
    				
    				var el = $("<div></div>");

    				if (fieldOptions)
    				{
    					var assigned = false;
    					
    					// TODO: how do we pick this off of the form configuration?
    					/*
    					if (Alpaca.isString(fieldOptions))
    					{
    						
    						if (_this.settings && _this.settings.properties)
    						{
    							// 1. settings can be a dot-delimited string
    							// in this case, we can pick off the sub-settings using a parse
    							var _settings = Alpaca.traverseObject(_this.settings, fieldOptions, "properties");
    							if (_settings)
    							{
    								fieldOptions = {
    									settings: _settings
    								};
    								assigned = true;
    							}
    						}
    					}
    					*/
    					
    					if (!assigned)
    					{
    						// otherwise, assume it is a standard field type
	    	    			var fieldType = fieldOptions;
	    	    			fieldOptions = {};
	    	    			fieldOptions.type = fieldType;
    					}
	    	    	}
    				
    				// if field options not passed in, select by traversing field id into the form options
    				if (!fieldOptions)
    				{
    					fieldOptions = Alpaca.traverseObject(_this.settings, fieldId);
    				}
    				
    				// if we still don't have any field options... create empty object
    				if (!fieldOptions)
    				{
    					fieldOptions = { };
    				}

    				// Necessary - set field ID
	    	    	fieldOptions.id = fieldId;
	    	    	
	    	    	// pick the subobject data from the "item.data" object (i.e. data.user.firstname)
	    	    	var fieldData = Alpaca.traverseObject(item.data, fieldId);
	    	    	
	    	    	var fieldControl = Alpaca(el, fieldData, fieldOptions);
	    	    	if (fieldControl)
	    	    	{
	    	    		// render
	    	    		fieldControl.render(_this.getMode());
	    	    		
	    	    		// remember the control
	    	    		_this.addChild(fieldControl);
		    			
		    			// return a div marker to indicate where the control should be placed
		    			return "<div class='alpacaTempField' alpacaFieldId='" + fieldId + "'></div>";
	    	    	}
	    	    	else
	    	    	{
	    	    		alert("Unable to determine control to render for data: " + fieldData);
	    	    	}
    			}
    		};

    		renderedDomElement = $.tmpl( templateString, this.data, renderContext );
    		renderedDomElement.appendTo($(parentEl));

    		// substitute the real controls for the temporary placeholders
    		$(parentEl).find(".alpacaTempField").each(function()
			{
    			var fieldId = $(this).attr("alpacaFieldId");
    			
    			var fieldControl = _this.childrenById[fieldId];
    			
    			// copy the element into the dom
    			$(this).replaceWith(fieldControl.getEl());
			});
			
    		// call onSuccess handler
			onSuccess();
    	}
    	
	});

})(jQuery);