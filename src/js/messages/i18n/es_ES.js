(function($) {

	// spanish - spain

	var Alpaca = $.alpaca;

	Alpaca.registerView ({
		"id": "base",
		"messages": {
			"es_ES": {
				required: "Este campo es obligatorio",
				invalid: "Este campo es inválido",
				months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
				timeUnits: {
					SECOND: "segundos",
					MINUTE: "minutos",
					HOUR: "horas",
					DAY: "días",
					MONTH: "meses",
					YEAR: "años"
				},
				"notOptional": "Este campo no es opcional.",
				"disallowValue": "{0} son los valores rechazados.",
				"invalidValueOfEnum": "Este campo debe tener uno de los valores adentro {0}. [{1}]",
				"notEnoughItems": "El número mínimo de artículos es {0}",
				"tooManyItems": "El número máximo de artículos es {0}",
				"valueNotUnique": "Los valores no son únicos",
				"notAnArray": "Este valor no es un arsenal",
				"invalidDate": "Fecha inválida para el formato {0}",
				"invalidEmail": "Email address inválido, ex: info@cloudcms.com",
				"stringNotAnInteger": "Este valor no es un número entero.",
				"invalidIPv4": "Dirección inválida IPv4, ex: 192.168.0.1",
				"stringValueTooSmall": "El valor mínimo para este campo es {0}",
				"stringValueTooLarge": "El valor máximo para este campo es {0}",
				"stringValueTooSmallExclusive": "El valor de este campo debe ser mayor que {0}",
				"stringValueTooLargeExclusive": "El valor de este campo debe ser menos que {0}",
				"stringDivisibleBy": "El valor debe ser divisible cerca {0}",
				"stringNotANumber": "Este valor no es un número.",
				"invalidPassword": "Contraseña inválida",
				"invalidPhone": "Número de teléfono inválido, ex: (123) 456-9999",
				"invalidPattern": "Este campo debe tener patrón {0}",
				"stringTooShort": "Este campo debe contener por lo menos {0} números o caracteres",
				"stringTooLong": "Este campo debe contener a lo más {0} números o caracteres",
				"noneLabel": "Ninguno",
				"addItemButtonLabel": "Añadir",
				"addButtonLabel": "Añadir",
				"removeButtonLabel": "Quitar",
				"upButtonLabel": "Arriba",
				"downButtonLabel": "Abajo"
			}
        }
	});

})(jQuery);
