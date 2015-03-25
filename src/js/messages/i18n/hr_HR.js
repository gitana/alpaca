(function($) {

	// croatian - croatia

	var Alpaca = $.alpaca;

	Alpaca.registerView ({
		"id": "base",
		"messages": {
			"hr_HR": {
				required: "Polje je obavezno",
				invalid: "Pogrešna vrijednost",
				months: ["Siječanj", "Veljača", "Ožujak", "Travanj", "Svibanj", "Lipanj", "Srpanj", "Kolovoz", "Rujan", "Listopad", "Studeni", "Prosinac"],
				timeUnits: {
					SECOND: "sekunda",
					MINUTE: "minuta",
					HOUR: "sati",
					DAY: "dan",
					MONTH: "mjesec",
					YEAR: "godina"
				},
				"notOptional": "Polje nije opciono.",
				"disallowValue": "{0} vrijednost nije dozvoljena.",
				"invalidValueOfEnum": "Moguće vrijednosti : {0}. [{1}]",
				"notEnoughItems": "Odaberite najmanje {0}",
				"tooManyItems": "Odaberite najviše {0}",
				"valueNotUnique": "Vrijednost nije jedinstvena",
				"notAnArray": "Vrijednost nije popis",
				"invalidDate": "Datum nije u formatu {0}",
				"invalidEmail": "E-mail adresa nije u ispravnom formatu, npr: ime.prezime@internet.com",
				"stringNotAnInteger": "Vrijednost nije cijeli broj.",
				"invalidIPv4": "IPv4 adresa nije ispravna, npr: 192.168.0.1",
				"stringValueTooSmall": "Vrijednost je ispod dopuštenog {0}",
				"stringValueTooLarge": "Vrijednost je iznad dopuštenog {0}",
				"stringValueTooSmallExclusive": "Vrijednost mora biti veća od {0}",
				"stringValueTooLargeExclusive": "Vrijednost mora biti manja od {0}",
				"stringDivisibleBy": "Vrijednost mora biti djeljiva sa {0}",
				"stringNotANumber": "Vrijednost nije broj.",
				"invalidPassword": "Neispravna lozinka",
				"invalidPhone": "Telefon nije ispravan, npr: (123) 456-9999",
				"invalidPattern": "Pogrešan uzorak {0}",
                "stringTooShort": "Polje mora imati namjanje {0} znakova",
                "stringTooLong": "Polje mora imati najviše {0} znakova"
            }
        }
    });

})(jQuery);
