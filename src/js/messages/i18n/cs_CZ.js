(function($) {

	// czech - czech republic

	var Alpaca = $.alpaca;

	Alpaca.registerView ({
		"id": "base",
		"messages": {
			"cs_CZ": {
				required: "Toto pole je vyžadováno",
				invalid: "Toto pole je neplatné",
				months: ["Leden", "Únor", "Březen", "Duben", "Květen", "Červen", "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"],
				timeUnits: {
					SECOND: "sekundy",
					MINUTE: "minuty",
					HOUR: "hodiny",
					DAY: "dny",
					MONTH: "měsíce",
					YEAR: "roky"
				},
				// ControlField.js
				"invalidValueOfEnum": "Toto pole musí obsahovat jednu hodnotu z {0}. Aktuální hodnota je: {1}",

				// Field.js
				"notOptional": "Toto pole není volitelné",
				"disallowValue": "{0} jsou zakázané hodnoty.",

				// fields/basic/ArrayField.js
				"notEnoughItems": "Minimální počet položek je {0}",
				"tooManyItems": "Maximální počet položek je {0}",
				"valueNotUnique": "Hodnoty nejsou unikátní",
				"notAnArray": "Tato hodnota není pole",
				"addItemButtonLabel": "Přidat novou položku",
				"addButtonLabel": "Přidat",
				"removeButtonLabel": "Odebrat",
				"upButtonLabel": "Nahoru",
				"downButtonLabel": "Dolů",

				// fields/basic/ListField.js
				"noneLabel": "Žádný",

				// fields/basic/NumberField.js
				"stringValueTooSmall": "Minimální hodnota tohoto pole je {0}",
				"stringValueTooLarge": "Maximální hodnota tohoto pole je {0}",
				"stringValueTooSmallExclusive": "Hodnota tohoto pole musí být větší než {0}",
				"stringValueTooLargeExclusive": "Hodnota tohoto pole musí být menší než {0}",
				"stringDivisibleBy": "Hodnota musí být dělitelná {0}",
				"stringNotANumber": "Hodnota není číslo.",
				"stringValueNotMultipleOf": "Číslo není násobkem {0}",

				// fields/basic/ObjectField.js
				"tooManyProperties": "Maximální počet vlastností ({0}) byl překročen.",
				"tooFewProperties": "Není dostatek vlastností (je požadováno {0})",

				// fields/basic/TextAreaField.js
				"wordLimitExceeded": "Maximální počet slov ({0}) byl překročen.",

				// fields/basic/TextField.js
				"invalidPattern": "Toto pole má mít vzor {0}",
				"stringTooShort": "Toto pole musí obsahovat nejmeně {0} znaků",
				"stringTooLong": "Toto pole musí obsahovat maximálně {0} znaků",

				// fields/advanced/DateField.js
				"invalidDate": "Nesprávné datum pro formát {0}",

				// fields/advaned/EditorField.js
				"editorAnnotationsExist": "Editor má v sobě chyby, které musí být opraveny",

				// fields/advanced/EmailField.js
				"invalidEmail": "Chybná e-mailová adresa, př.: info@cloudcms.com",

				// fields/advanced.IntegerField.js
				"stringNotAnInteger": "Tato hodnota není číslo.",

				// fields/advanced/IPv4Field.js
				"invalidIPv4": "Chybná IPv4 adresa, ex: 192.168.0.1",

				// fields/advanced/JSONField.js
				"stringNotAJSON": "Tato hodnota není platný JSON text.",

				// fields/advanced/MapField.js
				"keyMissing": "Mapa obsahuje prázdný klíč.",
				"keyNotUnique": "Klíče nejsou jedinečné.",

				// fields/advanced/PasswordField.js
				"invalidPassword": "Špatné heslo",

				// fields/advanced/PasswordField.js
				"invalidPhone": "Špatné telefonní číslo, př.: (123) 456-9999", // TODO: invalid pattern for czech locale

				// fields/advanced/UploadField.js
				"chooseFile": "Vyberte soubor...",
				"chooseFiles": "Vyberte soubory...",
				"dropZoneSingle": "Vyberte soubor nebo jej přetáhněte sem pro nahrání...",
				"dropZoneMultiple": "Vyberte soubory nebo je přetáhněte sem pro nahrání...",

				// fields/advanced/URLField.js
				"invalidURLFormat": "Uvedená URL není platna webová adresa.",

				// fields/advanced/CipcodeField.js
				"invalidZipcodeFormatFive": "Chybné poštovní směrovací číslo (#####)",
				"invalidZipcodeFormatNine": "Chybné devíti-místné poštovní směrovací číslo (#####-####)"
			}
        }
	});

})(jQuery);
