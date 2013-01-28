(function($) {

	var Alpaca = $.alpaca;

	Alpaca.registerView ({
		"id": "VIEW_WEB_EDIT",
		"messages": {
			"zh_CN": {
				required: "&#27492;&#22495;&#24517;&#39035;",
				invalid: "&#27492;&#22495;&#19981;&#21512;&#26684;",
				months: ["&#19968;&#26376;", "&#20108;&#26376;", "&#19977;&#26376;", "&#22235;&#26376;", "&#20116;&#26376;", "&#20845;&#26376;", "&#19971;&#26376;", "&#20843;&#26376;", "&#20061;&#26376;", "&#21313;&#26376;", "&#21313;&#19968;&#26376;", "&#21313;&#20108;&#26376;"],
				timeUnits: {
					SECOND: "&#31186;",
					MINUTE: "&#20998;",
					HOUR: "&#26102;",
					DAY: "&#26085;",
					MONTH: "&#26376;",
					YEAR: "&#24180;"
				},
				"notOptional": "&#27492;&#22495;&#38750;&#20219;&#36873;",
				"disallowValue": "&#38750;&#27861;&#36755;&#20837;&#21253;&#25324; {0}.",
				"invalidValueOfEnum": "&#20801;&#35768;&#36755;&#20837;&#21253;&#25324; {0}.",
				"notEnoughItems": "&#26368;&#23567;&#20010;&#25968; {0}",
				"tooManyItems": "&#26368;&#22823;&#20010;&#25968; {0}",
				"valueNotUnique": "&#36755;&#20837;&#20540;&#19981;&#29420;&#29305;",
				"notAnArray": "&#19981;&#26159;&#25968;&#32452;",
				"invalidDate": "&#26085;&#26399;&#26684;&#24335;&#22240;&#35813;&#26159; {0}",
				"invalidEmail": "&#20234;&#22969;&#20799;&#26684;&#24335;&#19981;&#23545;, ex: admin@gitanasoftware.com",
				"stringNotAnInteger": "&#19981;&#26159;&#25972;&#25968;.",
				"invalidIPv4": "&#19981;&#26159;&#21512;&#27861;IP&#22320;&#22336;, ex: 192.168.0.1",
				"stringValueTooSmall": "&#26368;&#23567;&#20540;&#26159; {0}",
				"stringValueTooLarge": "&#26368;&#22823;&#20540;&#26159; {0}",
				"stringValueTooSmallExclusive": "&#20540;&#24517;&#39035;&#22823;&#20110; {0}",
				"stringValueTooLargeExclusive": "&#20540;&#24517;&#39035;&#23567;&#20110; {0}",
				"stringDivisibleBy": "&#20540;&#24517;&#39035;&#33021;&#34987; {0} &#25972;&#38500;",
				"stringNotANumber": "&#19981;&#26159;&#25968;&#23383;.",
				"invalidPassword": "&#38750;&#27861;&#23494;&#30721;",
				"invalidPhone": "&#38750;&#27861;&#30005;&#35805;&#21495;&#30721;, ex: (123) 456-9999",
				"invalidPattern": "&#27492;&#22495;&#39035;&#26377;&#26684;&#24335; {0}",
				"stringTooShort": "&#27492;&#22495;&#33267;&#23569;&#38271;&#24230; {0}",
				"stringTooLong": "&#27492;&#22495;&#26368;&#22810;&#38271;&#24230; {0}"
			
			},
			"es_ES": {
				required: "Este campo es required",
				invalid: "Este campo es inv�lido",
				months: ["Enero", "Febrero", "Marzo", "Abril", "Puede", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
				timeUnits: {
					SECOND: "segundos",
					MINUTE: "minutos",
					HOUR: "horas",
					DAY: "d�as",
					MONTH: "meses",
					YEAR: "a�os"
				},
				"notOptional": "Este campo no es opcional.",
				"disallowValue": "{0} son los valores rechazados.",
				"invalidValueOfEnum": "Este campo debe tener uno de los valores adentro {0}.",
				"notEnoughItems": "El n�mero m�nimo de art�culos es {0}",
				"tooManyItems": "El n�mero m�ximo de art�culos es {0}",
				"valueNotUnique": "Los valores no son �nicos",
				"notAnArray": "Este valor no es un arsenal",
				"invalidDate": "Fecha inv�lida para el formato {0}",
				"invalidEmail": "Email address inv�lido, ex: admin@gitanasoftware.com",
				"stringNotAnInteger": "Este valor no es un n�mero entero.",
				"invalidIPv4": "Direcci&#243;n inv�lida IPv4, ex: 192.168.0.1",
				"stringValueTooSmall": "El valor m�nimo para este campo es {0}",
				"stringValueTooLarge": "El valor m�ximo para este campo es {0}",
				"stringValueTooSmallExclusive": "El valor de este campo debe ser mayor que {0}",
				"stringValueTooLargeExclusive": "El valor de este campo debe ser menos que {0}",
				"stringDivisibleBy": "El valor debe ser divisible cerca {0}",
				"stringNotANumber": "Este valor no es un n�mero.",
				"invalidPassword": "Contrase�a inv�lida",
				"invalidPhone": "N�mero de tel�fono inv�lido, ex: (123) 456-9999",
				"invalidPattern": "Este campo debe tener patr&#243;n {0}",
				"stringTooShort": "Este campo debe contener por lo menos {0} n�meros o caracteres",
				"stringTooLong": "Este campo debe contener a lo m�s {0} n�meros o caracteres"
			},
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
				"invalidValueOfEnum": "Ce champ doit prendre une des valeurs suivantes : {0}.",
				"notEnoughItems": "Le nombre minimum d'éléments est {0}",
				"tooManyItems": "Le nombre maximum d'éléments est {0}",
				"valueNotUnique": "Les valeurs sont uniques",
				"notAnArray": "Cette valeur n'est pas une liste",
				"invalidDate": "Cette date ne correspond pas au format {0}",
				"invalidEmail": "Adresse de courriel invalide, ex: admin@gitanasoftware.com",
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
