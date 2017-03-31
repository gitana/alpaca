(function($) {

	// greek - greece

	var Alpaca = $.alpaca;

	Alpaca.registerView ({
		"id": "base",
		"messages": {
            "el_GR": {
                required: "Υποχρεωτικό",
                invalid: "Λάθος",
                months: ["Ιανουάριος", "Φεβρουάριος", "Μάρτιος", "Απρίλιος", "Μάιος", "Ιούνιος", "Ιούλιος", "Αύγουστος", "Σεπτέμβριος", "Οκτώβριος", "Νοέμβριος", "Δεκέμβριος"],
                timeUnits: {
                    SECOND: "Δευτερόλεπτα",
                    MINUTE: "Λεπτά",
                    HOUR: "Ώρες",
                    DAY: "Μέρες",
                    MONTH: "Μήνες",
                    YEAR: "Χρόνια"
                },
                "notOptional": "Αυτό το πεδίο δεν είναι προαιρετικό",
                "disallowValue": "Μη επιτρεπτή τιμή: {0}",
                "invalidValueOfEnum": "Το πεδίο πρέπει να περιέχει μία από τις ακόλουθες τιμές: {0}. [{1}]",
                "notEnoughItems": "Ο ελάχιστος αριθμός εγγραφών είναι {0}",
                "tooManyItems": "Ο μέγιστος αριθμός εγγραφών είναι {0}",
                "valueNotUnique": "Οι τιμές δεν είναι μοναδικές",
                "notAnArray": "Δεν υπάρχουν εγγραφές",
                "invalidDate": "Λάθος μορφή ημερομηνίας: {0}",
                "invalidEmail": "Μη έγκυρο email",
                "stringNotAnInteger": "Δεν είναι ακέραιος",
                "invalidIPv4": "Μη έγκυρη IPv4 διεύθυνση",
                "stringValueTooSmall": "Το ελάχιστο πλήθος χαρακτήρων είναι {0}",
                "stringValueTooLarge": "Το μέγιστο πλήθος χαρακτήρων είναι {0}",
                "stringValueTooSmallExclusive": "Απαιτούνται περισσότεροι χαρακτήες από {0}",
                "stringValueTooLargeExclusive": "Απαιτούνται λιγότεροι χαρακτήρες από {0}",
                "stringDivisibleBy": "Η τιμή πρέπει να είναι πολλαπλάσιο του {0}",
                "stringNotANumber": "Η τιμή δεν είναι αριθμός",
                "invalidPassword": "Μη έγκυρο password",
                "invalidPhone": "Μη έγκυρος αριθμός τηλεφώνου",
                "invalidPattern": "Αυτό το πεδίο δεν έχει την απαιτούμενη μορφή {0}",
                "stringTooShort": "Το πεδίο πρέπει να έχει τουλάχιστον {0} χαρακτήρες",
                "stringTooLong": "Το πεδίο μπορεί να έχει το πολύ {0} χαρακτήρες"
            }
		}
	});

})(jQuery);
