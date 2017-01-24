(function($) {

	// norwegian - norway

	var Alpaca = $.alpaca;

	Alpaca.registerView ({
		"id": "base",
		"messages": {
            "nb_NO": {
                required: "Feltet er obligatorisk",
                invalid: "Verdien er ugyldig",
                months: ["Januar", "Februar", "Mars", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember"],
                timeUnits: {
                    SECOND: "Sekunder",
                    MINUTE: "Minutter",
                    HOUR: "Timer",
                    DAY: "Dager",
                    MONTH: "Måneder",
                    YEAR: "År"
                },
                "notOptional": "Dette feltet er obligatorisk",
                "disallowValue": "Denne verdien er ikke tillatt: {0}",
                "invalidValueOfEnum": "Feltet må inneholde en av følgende verdier: {0}. Nåværende verdi er: {1}",
                "notEnoughItems": "Det minste tillatte antallet elementer er {0}",
                "tooManyItems": "Det største tillatte antallet elementer er {0}",
                "valueNotUnique": "Verdiene er ikke unike",
                "notAnArray": "Ikke en liste av verdier",
                "invalidDate": "Ugyldig datoformat: {0}",
                "invalidEmail": "Ugyldig e-postadresse",
                "stringNotAnInteger": "Verdien er ikke et heltall",
                "invalidIPv4": "Ugyldig IPv4-adresse",
                "stringValueTooSmall": "Den minste tillatte verdien er {0}",
                "stringValueTooLarge": "Den største tillatte verdien er {0}",
                "stringValueTooSmallExclusive": "Verdien må være større enn {0}",
                "stringValueTooLargeExclusive": "Verdien må være mindre enn {0}",
                "stringDivisibleBy": "Tallet må være delbart med {0}",
                "stringNotANumber": "Verdien er ikke et tall",
                "invalidPassword": "Ugyldig passord",
                "invalidPhone": "Ugyldig telefonnummer",
                "invalidPattern": "Feltet må være i følgende format: {0}",
                "stringTooShort": "Dette feltet må minst inneholde {0} tegn",
                "stringTooLong": "Dette feltet kan maks inneholde {0} tegn"
            }
		}
	});

})(jQuery);
