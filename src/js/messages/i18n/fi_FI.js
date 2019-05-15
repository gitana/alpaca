(function($) {

	// finnish - finland

	var Alpaca = $.alpaca;

	Alpaca.registerView ({
		"id": "base",
		"messages": {
            "fi_FI": {
                required: "Kenttä on pakollinen",
                invalid: "Syöte on virheellinen",
                months: ["Tammikuu", "Helmikuu", "Maaliskuu", "Huhtikuu", "Toukokuu", "Kesäkuu", "Heinäkuu", "Elokuu", "Syyskuu", "Lokakuu", "Marraskuu", "Joulukuu"],
                timeUnits: {
                    SECOND: "sekuntia",
                    MINUTE: "minuuttia",
                    HOUR: "tuntia",
                    DAY: "päivää",
                    MONTH: "kuukautta",
                    YEAR: "vuotta"
                },
                "notOptional": "Tämä kenttä on pakollinen",
                "disallowValue": "Seuraavat syötteet eivät ole sallittuja: {0}",
                "invalidValueOfEnum": "Kentän pitää sisältää yksi seuraavista arvoista: {0}. [{1}]",
                "notEnoughItems": "Pienin sallittu määrä arvoja on {0}",
                "tooManyItems": "Suurin sallittu määrä arvoja on {0}",
                "valueNotUnique": "Syötetyt arvot eivät ole uniikkeja",
                "notAnArray": "Syöte ei ole lista",
                "invalidDate": "Virheellinen päivämäärämuoto: {0}",
                "invalidEmail": "Virheellinen sähköpostiosoite",
                "stringNotAnInteger": "Arvo ei ole kokonaisluku",
                "invalidIPv4": "Virheellinen IPv4-osoite",
                "stringValueTooSmall": "Pienin sallittu arvo on {0}",
                "stringValueTooLarge": "Suurin sallittu arvo on {0}",
                "stringValueTooSmallExclusive": "Arvon pitää olla suurempi kuin {0}",
                "stringValueTooLargeExclusive": "Arvon pitää olla pienempi kuin {0}",
                "stringDivisibleBy": "Luvun pitää olla jaollinen luvulla {0}",
                "stringNotANumber": "Syöte ei ole luku",
                "invalidPassword": "Virheellinen salasana",
                "invalidPhone": "Virheellinen puhelinnumero",
                "invalidPattern": "Syötteen täytyy olla seuraavassa muodossa: {0}",
                "stringTooShort": "Syötteen minimipituus on {0} merkkiä",
                "stringTooLong": "Syötteen maksimipituus on {0} merkkiä",
                "addItemButtonLabel": "Lisää arvo",
                "addButtonLabel": "Lisää",
                "removeButtonLabel": "Poista",
                "upButtonLabel": "Ylös",
                "downButtonLabel": "Alas"
            }
		}
	});

})(jQuery);
