(function($) {

	// dutch - belgium

	var Alpaca = $.alpaca;

	Alpaca.registerView ({
		"id": "base",
		"messages": {
			"nl_BE": {
				required: "Dit veld is verplicht",
				invalid: "Dit veld is ongeldig",
				months: ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "July", "Augustus", "September", "Oktober", "November", "December"],
				timeUnits: {
					SECOND: "seconden",
					MINUTE: "minuten",
					HOUR: "uren",
					DAY: "dagen",
					MONTH: "maanden",
					YEAR: "jaren"
				},
				"notOptional": "Dit veld is niet optioneel.",
				"disallowValue": "{0} zijn verboden waarden.",
				"invalidValueOfEnum": "Dit veld moet één van volgende bevatten : {0}. [{1}]",
				"notEnoughItems": "Het minimum aantal elementen is {0}",
				"tooManyItems": "Het maximum aantal elementen is {0}",
				"valueNotUnique": "De waarden zijn uniek",
				"notAnArray": "Deze waarde is geen lijst",
				"invalidDate": "De datum komt niet overeen met formaat {0}",
				"invalidEmail": "Ongeldig e-mailadres, vb.: info@cloudcms.com",
				"stringNotAnInteger": "Deze waarde is geen geheel getal.",
				"invalidIPv4": "Ongeldig IPv4 adres, vb.: 192.168.0.1",
				"stringValueTooSmall": "De minimale waarde voor dit veld is {0}",
				"stringValueTooLarge": "De maximale waarde voor dit veld is {0}",
				"stringValueTooSmallExclusive": "De waarde moet groter zijn dan {0}",
				"stringValueTooLargeExclusive": "De waarde moet kleiner zijn dan {0}",
				"stringDivisibleBy": "De waarde moet deelbaar zijn door {0}",
				"stringNotANumber": "Deze waarde is geen getal.",
				"invalidPassword": "Ongeldig wachtwoord",
				"invalidPhone": "Ongeldig telefoonnummer, vb: (123) 456-9999",
				"invalidPattern": "Dit veld moet overeenkomen met patroon {0}",
                "stringTooShort": "Dit veld moet minstens {0} tekens bevatten",
                "stringTooLong": "Dit veld moet minder dan {0} tekens bevatten"
            }
        }
    });

})(jQuery);
