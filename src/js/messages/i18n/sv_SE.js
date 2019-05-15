(function($) {

	// swedish - sweden

	var Alpaca = $.alpaca;

	Alpaca.registerView ({
		"id": "base",
		"messages": {
            "sv_SE": {
                required: "Fältet är obligatoriskt",
                invalid: "Värdet är felaktigt",
                months: ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"],
                timeUnits: {
                    SECOND: "sekunder",
                    MINUTE: "minuter",
                    HOUR: "timmar",
                    DAY: "dagar",
                    MONTH: "månader",
                    YEAR: "år"
                },
                "notOptional": "Detta fält är obligatoriskt",
                "disallowValue": "Dessa värden är inte tillåtna: {0}",
                "invalidValueOfEnum": "Fältet måste innehålla ett av följande värden: {0}. [{1}]",
                "notEnoughItems": "Det minsta tillåtna antalet element är {0}",
                "tooManyItems": "Det största tillåtna antalet element är {0}",
                "valueNotUnique": "Värdena är inte unika",
                "notAnArray": "Inte en lista av värden",
                "invalidDate": "Felaktigt format för datum: {0}",
                "invalidEmail": "Ogiltig e-postadress",
                "stringNotAnInteger": "Värdet är inte ett heltal",
                "invalidIPv4": "Ogiltig IPv4-adress",
                "stringValueTooSmall": "Det minsta tillåtna värdet är {0}",
                "stringValueTooLarge": "Det största tillåtna värdet är {0}",
                "stringValueTooSmallExclusive": "Värdet måste vara större än {0}",
                "stringValueTooLargeExclusive": "Värdet måste vara mindre än {0}",
                "stringDivisibleBy": "Talet måste vara delbart med {0}",
                "stringNotANumber": "Värdet är inte ett tal",
                "invalidPassword": "Ogiltigt lösenord",
                "invalidPhone": "Ogiltigt telefonnummer",
                "invalidPattern": "Fältet måste vara i följande format: {0}",
                "stringTooShort": "Detta fält måste innehålla minst {0} tecken",
                "stringTooLong": "Detta fält får innehålla högst {0} tecken",
                "addItemButtonLabel": "Lägg till element",
                "addButtonLabel": "Lägg till",
                "removeButtonLabel": "Ta bort",
                "upButtonLabel": "Upp",
                "downButtonLabel": "Ner"
            }
		}
	});

})(jQuery);
