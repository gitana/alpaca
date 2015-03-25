(function($) {

    // portuguese - portugal

    var Alpaca = $.alpaca;

    Alpaca.registerView ({
        "id": "base",
        "messages": {
            "pt_BR": {
                required: "Este campo é obrigatório",
                invalid: "Este campo é inválido",
                months: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
                timeUnits: {
                    SECOND: "segundos",
                    MINUTE: "minutos",
                    HOUR: "horas",
                    DAY: "dias",
                    MONTH: "meses",
                    YEAR: "anos"
                },
                "notOptional": "Este campo não é opcional.",
                "disallowValue": "{0} são valores proibidas.",
                "invalidValueOfEnum": "Este campo deve ter um dos seguintes valores: {0}. [{1}]",
                "notEnoughItems": "O número mínimo de elementos é {0}",
                "tooManyItems": "O número máximo de elementos é {0}",
                "valueNotUnique": "Os valores não são únicos",
                "notAnArray": "Este valor não é uma lista",
                "invalidDate": "Esta data não tem o formato {0}",
                "invalidEmail": "Endereço de email inválida, ex: info@cloudcms.com",
                "stringNotAnInteger": "Este valor não é um número inteiro.",
                "invalidIPv4": "Endereço IPv4 inválida, ex: 192.168.0.1",
                "stringValueTooSmall": "O valor mínimo para este campo é {0}",
                "stringValueTooLarge": "O valor máximo para este campo é {0}",
                "stringValueTooSmallExclusive": "O valor deste campo deve ser maior que {0}",
                "stringValueTooLargeExclusive": "O valor deste campo deve ser menor que {0}",
                "stringDivisibleBy": "O valor deve ser divisível por {0}",
                "stringNotANumber": "Este valor não é um número.",
                "invalidPassword": "Senha inválida",
                "invalidPhone": "Número de telefone inválido, ex: (123) 456-9999",
                "invalidPattern": "Este campo deve ter o padrão {0}",
                "stringTooShort": "Este campo deve incluir pelo menos {0} caracteres",
                "stringTooLong": "Este campo pode incluir no máximo {0} caracteres"
            }
        }
    });

})(jQuery);
