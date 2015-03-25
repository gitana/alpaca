(function($) {

    // polish - poland

    var Alpaca = $.alpaca;

    Alpaca.registerView ({
        "id": "base",
        "messages": {
            "pl_PL": {
                required: "To pole jest wymagane",
                invalid: "To pole jest nieprawidłowe",
                months: ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"],
                timeUnits: {
                    SECOND: "sekundy",
                    MINUTE: "minuty",
                    HOUR: "godziny",
                    DAY: "dni",
                    MONTH: "miesiące",
                    YEAR: "lata"
                },
                "notOptional": "To pole nie jest opcjonalne",
                "disallowValue": "Ta wartość nie jest dozwolona: {0}",
                "invalidValueOfEnum": "To pole powinno zawierać jedną z następujących wartości: {0}. [{1}]",
                "notEnoughItems": "Minimalna liczba elementów wynosi {0}",
                "tooManyItems": "Maksymalna liczba elementów wynosi {0}",
                "valueNotUnique": "Te wartości nie są unikalne",
                "notAnArray": "Ta wartość nie jest tablicą",
                "invalidDate": "Niepoprawny format daty: {0}",
                "invalidEmail": "Niepoprawny adres email, n.p.: info@cloudcms.com",
                "stringNotAnInteger": "Ta wartość nie jest liczbą całkowitą",
                "invalidIPv4": "Niepoprawny adres IPv4, n.p.: 192.168.0.1",
                "stringValueTooSmall": "Minimalna wartość dla tego pola wynosi {0}",
                "stringValueTooLarge": "Maksymalna wartość dla tego pola wynosi {0}",
                "stringValueTooSmallExclusive": "Wartość dla tego pola musi być większa niż {0}",
                "stringValueTooLargeExclusive": "Wartość dla tego pola musi być mniejsza niż {0}",
                "stringDivisibleBy": "Wartość musi być podzielna przez {0}",
                "stringNotANumber": "Wartość nie jest liczbą",
                "invalidPassword": "Niepoprawne hasło",
                "invalidPhone": "Niepoprawny numer telefonu, n.p.: (123) 456-9999",
                "invalidPattern": "To pole powinno mieć format {0}",
                "stringTooShort": "To pole powinno zawierać co najmniej {0} znaków",
                "stringTooLong": "To pole powinno zawierać najwyżej {0} znaków"
            }
        }
    });

})(jQuery);