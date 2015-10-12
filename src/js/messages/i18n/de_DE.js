(function($) {

	// german - germany

	var Alpaca = $.alpaca;

	Alpaca.registerView ({
		"id": "base",
		"messages": {
            "de_DE": {
                required: "Eingabe erforderlich",
                invalid: "Eingabe ungültig",
                months: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
                timeUnits: {
                    SECOND: "Sekunden",
                    MINUTE: "Minuten",
                    HOUR: "Stunden",
                    DAY: "Tage",
                    MONTH: "Monate",
                    YEAR: "Jahre"
                },
                "notOptional": "Dieses Feld ist nicht optional",
                "disallowValue": "Diese Werte sind nicht erlaubt: {0}",
                "invalidValueOfEnum": "Diese Feld sollte einen der folgenden Werte enthalten: {0}. [{1}]",
                "notEnoughItems": "Die Mindestanzahl von Elementen ist {0}",
                "tooManyItems": "Die Maximalanzahl von Elementen ist {0}",
                "valueNotUnique": "Diese Werte sind nicht eindeutig",
                "notAnArray": "Keine Liste von Werten",
                "invalidDate": "Falsches Datumsformat: {0}",
                "invalidEmail": "Keine gültige E-Mail Adresse",
                "stringNotAnInteger": "Keine Ganze Zahl",
                "invalidIPv4": "Ungültige IPv4 Adresse",
                "stringValueTooSmall": "Die Mindestanzahl von Zeichen ist {0}",
                "stringValueTooLarge": "Die Maximalanzahl von Zeichen ist {0}",
                "stringValueTooSmallExclusive": "Die Anzahl der Zeichen muss größer sein als {0}",
                "stringValueTooLargeExclusive": "Die Anzahl der Zeichen muss kleiner sein als {0}",
                "stringDivisibleBy": "Der Wert muss durch {0} dividierbar sein",
                "stringNotANumber": "Die Eingabe ist keine Zahl",
                "invalidPassword": "Ungültiges Passwort",
                "invalidPhone": "Ungültige Telefonnummer",
                "invalidPattern": "Diese Feld stimmt nicht mit folgender Vorgabe überein {0}",
                "stringTooShort": "Dieses Feld sollte mindestens {0} Zeichen enthalten",
                "stringTooLong": "Dieses Feld sollte höchstens {0} Zeichen enthalten"
            }
		}
	});

})(jQuery);
