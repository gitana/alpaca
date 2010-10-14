/**
 * Alpaca forms engine for jQuery
 */
(function($) {
    
    Alpaca.JsonSchema = { };
    
    Alpaca.JsonSchema.Builder = function(config)
    {
	};
	
	Alpaca.JsonSchema.Builder.prototype =
	{
		/**
		 * Convert a JSON schema to an Alpaca schema
		 */
		import: function(schema, onSuccess)
		{
			var _this = this;

			// Allow for remote loading of schema from an HTTP address
			if (	Alpaca.startsWith(schema, "http://") ||
					Alpaca.startsWith(schema, "https://") ||
					!Alpaca.startsWith(schema, "{") ||
					Alpaca.startsWith(schema, "/"))
			{
				$.ajax({
					url: schema,
					type: "get",
					dataType: "json",
					success: function(schemaDocument)
					{
						var options = _this._import(schemaDocument);
						
						if (onSuccess)
						{
							onSuccess(options);
						}
					},
					error: function(error)
					{
						alert("error loading schema");
					}
				});
			}
			else
			{
				var options = _this._import(schema);

				if (onSuccess)
				{
					onSuccess(options);
				}				
			}
		},
		
		_import: function(schema, propertyName)
		{
			var options = {
			};
			
			
			//
			// Alpaca.Field Abstract
			//
			
			if (propertyName)
			{
				options.id = propertyName;
			}
			
			if (schema.optional)
			{
				options.optional = true;
			}
			
			// TODO: options.mode
			// TODO: options.template
			// TODO: options.fieldClass
			// TODO: options.validate
			// TODO: options.disabled
			// TODO: options.mesages
			
			
			//
			// DETERMINE THE TYPE
			//
			var isControlField = false;
			var isContainerField = false;
			var isObject = false;
			var isArray = false;
			var isNumber = false;
			var isText = false;
			var isBoolean = false;
			var isDate = false;
			if (schema.type == "object")
			{
				options.type = "object";
				isObject = true;
				isContainerField = true;
			}
			else if (schema.type == "array")
			{
				options.type = "array";
				isArray = true;
				isContainerField = true;
			}
			else if (schema.type == "string")
			{
				options.type = "text";
				isText = true;
				isControlField = true;
			}
			else if (schema.type == "boolean")
			{
				options.type = "checkbox";
				isBoolean = true;
				isControlField = true;
			}
			else if (schema.type == "number")
			{
				options.type = "number";
				isNumber = true;
				isText = true;
				isControlField = true;
			}
			else if (schema.type == "date")
			{
				options.type = "date";
				isDate = true;
				isText = true;
				isControlField = true;
			}
			else
			{
				options.type = "text";
				isText = true;
				isControlField = true;
			}
			
			
			//
			// ALL FIELDS
			//
			if (isControlField || isContainerField)
			{
				// TODO: schema.title
				// TODO: schema.description
				// TODO: schema.contentEncoding
			}
			
			
			//
			// CONTROL FIELDS
			//
			
			if (isControlField)
			{
				// TODO: schema.enum
				// TODO: schema.format
				// TODO: schema.default
				// TODO: schema.disallow
				// TODO: schema.extends
			}
			
			
			//
			// CONTAINER FIELDS
			//
			
			if (isContainerField)
			{
			}
			
			
			//
			// TYPE SPECIFIC PROPERTIES
			//
			
			if (isObject)
			{
			}
			else if (isArray)
			{
				// TODO: schema.items
				// TODO: schema.minItems
				// TODO: schema.maxItems
				// TODO: schema.uniqueItems
				
			}
			else if (isText)
			{
				if (schema.pattern)
				{
					options.pattern = schema.pattern;
				}				
				if (schema.minLength)
				{
					options.minLength = schema.minLength;
				}				
				if (schema.maxLength)
				{
					options.maxLength = schema.maxLength;
				}				
			}
			else if (isBoolean)
			{
			}
			else if (isNumber)
			{
				if (schema.minimum)
				{
					options.minValue = schema.minimum;
				}
				if (schema.maximum)
				{
					options.maxValue = schema.maximum;
				}
				
				// TODO: schema.maximumCanEqual
				// TODO: schema.minimumCanEqual
				// TODO: schema.divisibleBy
				
			}
			else if (isDate)
			{
			}
			
			
			
			//
			// WALK DOWN THROUGH CHILD PROPERTIES
			//
			if (schema.properties)
			{
				for (var p in schema.properties)
				{
					if (schema.properties.hasOwnProperty(p))
					{
						options[p] = this._import(schema.properties[p], p);
					}
				}
			}
			
			// TODO: WHAT ABOUT NESTED ARRAY ELEMENTS?

			return options;
		}
	};

})(jQuery);

