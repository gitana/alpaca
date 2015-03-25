(function($) {

	// italian - italy

	var Alpaca = $.alpaca;

	Alpaca.registerView ({
		"id": "base",
		"messages": {
			"it_IT": {
				required: "Questo campo è obbligatorio",
				invalid: "Questo campo è invalido",
				months: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
				timeUnits: {
					SECOND: "secondi",
					MINUTE: "minuti",
					HOUR: "ore",
					DAY: "giorni",
					MONTH: "mesi",
					YEAR: "anni"
				},
				"notOptional": "Questo campo non è opzionale",
				"disallowValue": "{0} sono valori invalidi",
				"invalidValueOfEnum": "Questo campo deve avere uno dei seguenti valori {0} (valore attuale: {1})",
				"notEnoughItems": "Il numero minimo di elementi richiesti è {0}",
				"tooManyItems": "Il numero massimo di elementi ammessi è {0}",
				"valueNotUnique": "I valori non sono univoci",
				"notAnArray": "Questo valore non è di tipo array",
				"invalidDate": "Data invalida per il formato {0}",
				"invalidEmail": "Indirizzo email invalido, si attendono valori del tipo: info@cloudcms.com",
				"stringNotAnInteger": "Questo valore non è un numero intero",
				"invalidIPv4": "Indirizzo IPv4 invalido, si attendono valori del tipo: 192.168.0.1",
				"stringValueTooSmall": "Il valore minimo per questo campo è {0}",
				"stringValueTooLarge": "Il valore massimo per questo campo è {0}",
				"stringValueTooSmallExclusive": "Il valore di questo campo deve essere maggiore di {0}",
				"stringValueTooLargeExclusive": "Il valore di questo campo deve essere minore di {0}",
				"stringDivisibleBy": "Il valore di questo campo deve essere divisibile per {0}",
				"stringNotANumber": "Questo valore non è un numero",
				"invalidPassword": "Password invalida",
				"invalidPhone": "Numero di telefono invalido, si attendono valori del tipo: (123) 456-9999",
				"invalidPattern": "Questo campo deve avere la seguente struttura: {0}",
				"stringTooShort": "Questo campo non deve contenere meno di {0} caratteri",
				"stringTooLong": "Questo campo non deve contenere più di {0} caratteri",
				"noneLabel": "Nessuno",
				"addItemButtonLabel": "Aggiungi",
				"addButtonLabel": "Aggiungi",
				"removeButtonLabel": "Rimuovi",
				"upButtonLabel": "Su",
				"downButtonLabel": "Giù"
			}
		}
	});

})(jQuery);
