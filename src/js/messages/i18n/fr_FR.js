(function($) {

	// french - france

	var Alpaca = $.alpaca;

	Alpaca.registerView ({
		"id": "base",
		"messages": {
			"fr_FR": {
				required: "Ce champ est requis",
				invalid: "Ce champ est invalide",
				months: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
				timeUnits: {
					SECOND: "secondes",
					MINUTE: "minutes",
					HOUR: "heures",
					DAY: "jours",
					MONTH: "mois",
					YEAR: "années"
				},
				"notOptional": "Ce champ n'est pas optionnel.",
				"disallowValue": "{0} sont des valeurs interdites.",
				"invalidValueOfEnum": "Ce champ doit prendre une des valeurs suivantes : {0}. [{1}]",
				"notEnoughItems": "Le nombre minimum d'éléments est {0}",
				"tooManyItems": "Le nombre maximum d'éléments est {0}",
				"valueNotUnique": "Les valeurs sont uniques",
				"notAnArray": "Cette valeur n'est pas une liste",
				"invalidDate": "Cette date ne correspond pas au format {0}",
				"invalidEmail": "Adresse de courriel invalide, ex: info@cloudcms.com",
				"stringNotAnInteger": "Cette valeur n'est pas un nombre entier.",
				"invalidIPv4": "Adresse IPv4 invalide, ex: 192.168.0.1",
				"stringValueTooSmall": "La valeur minimale pour ce champ est {0}",
				"stringValueTooLarge": "La valeur maximale pour ce champ est {0}",
				"stringValueTooSmallExclusive": "La valeur doit-être supérieure à {0}",
				"stringValueTooLargeExclusive": "La valeur doit-être inférieure à {0}",
				"stringDivisibleBy": "La valeur doit-être divisible par {0}",
				"stringNotANumber": "Cette valeur n'est pas un nombre.",
				"invalidPassword": "Mot de passe invalide",
				"invalidPhone": "Numéro de téléphone invalide, ex: (123) 456-9999",
				"invalidPattern": "Ce champ doit correspondre au motif {0}",
                "stringTooShort": "Ce champ doit contenir au moins {0} caractères",
                "stringTooLong": "Ce champ doit contenir au plus {0} caractères"
            }
        }
    });

})(jQuery);
