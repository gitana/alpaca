NumberFormat = Class.create( {
	initialize : function(el, options) {
		this.el = $(el);

		var options = Object.extend( {
			prefix : 'US$ ',
			centsSeparator : '.',
			thousandsSeparator : ',',
			limit : false,
			centsLimit : 2,
			clearPrefix : false,
			allowNegative : false,
			clearOnEmpty: false
		}, options);

		this.is_number = /[0-9]/;

		// load the pluggings settings
	this.prefix = options.prefix;
	this.centsSeparator = options.centsSeparator;
	this.thousandsSeparator = options.thousandsSeparator;
	this.limit = options.limit;
	this.centsLimit = options.centsLimit;
	this.clearPrefix = options.clearPrefix;
	this.allowNegative = options.allowNegative;
	this.clearOnEmpty = options.clearOnEmpty;
	if (this.clearPrefix) {
		Event.observe(this.el, 'blur', this.clearPrefix.bind(this));
		Event.observe(this.el, 'focus', this.addPrefix.bind(this));
	}

	Event.observe(this.el, 'keyup', this.priceIt.bind(this));
	Event.observe(this.el, 'keydown', this.keyCheck.bind(this));

	if (this.el.value.length > 0) {
		this.priceIt();
		this.clearPrefix();
	}
},

keyCheck : function(e) {
	var code = (e.keyCode ? e.keyCode : e.which);
	var typed = String.fromCharCode(code);
	var functional = false;
	var str = e.target.value;
	var newValue = this.priceFormat(str + typed);

	// allow key numbers, 0 to 9
	if ((code >= 48 && code <= 57) || (code >= 96 && code <= 105))
		functional = true;

	// check Backspace, Tab, Enter, Delete, and left/right arrows
	if (code == 8)
		functional = true;
	if (code == 9)
		functional = true;
	if (code == 13)
		functional = true;
	if (code == 46)
		functional = true;
	if (code == 35)
		functional = true;
	if (code == 36)
		functional = true;
	if (code == 37)
		functional = true;
	if (code == 39)
		functional = true;
	if (this.allowNegative && (code == 189 || code == 109))
		functional = true; // dash as well

	if (!functional) {
		e.preventDefault();
		e.stopPropagation();
		if (str != newValue)
			e.target.value = newValue;
	}
},

toNumbers : function(str) {
	var formatted = '';
	for ( var i = 0; i < (str.length); i++) {
		char = str.charAt(i);
		if (formatted.length == 0 && char == 0)
			char = false;

		if (char && char.match(this.is_number)) {
			if (this.limit) {
				if (formatted.length < this.limit)
					formatted = formatted + char;
			} else {
				formatted = formatted + char;
			}
		}
	}

	return formatted;
},

priceFormat : function(str, ignore) {
	if(!ignore && (str === '' || str == this.priceFormat('0', true)) && clearOnEmpty) {

		return '';
	}
	
	// formatting settings
	var formatted = this.fillWithZeroes(this.toNumbers(str));
	var thousandsFormatted = '';
	var thousandsCount = 0;

	// split integer from cents
	var centsVal = formatted.substr(formatted.length - this.centsLimit,
			this.centsLimit);
	var integerVal = formatted.substr(0, formatted.length - this.centsLimit);

	// apply cents pontuation
	formatted = integerVal + this.centsSeparator + centsVal;

	// apply thousands pontuation
	if (this.thousandsSeparator) {
		for ( var j = integerVal.length; j > 0; j--) {
			char = integerVal.substr(j - 1, 1);
			thousandsCount++;
			if (thousandsCount % 3 == 0)
				char = this.thousandsSeparator + char;
			thousandsFormatted = char + thousandsFormatted;
		}
		if (thousandsFormatted.substr(0, 1) == this.thousandsSeparator)
			thousandsFormatted = thousandsFormatted.substring(1,
					thousandsFormatted.length);
		formatted = thousandsFormatted + this.centsSeparator + centsVal;
	}

	// if the string contains a dash, it is negative - add it to the
	// begining (except for zero)
	if (this.allowNegative && str.indexOf('-') != -1
			&& (integerVal != 0 || centsVal != 0))
		formatted = '-' + formatted;

	// apply the prefix
	if (this.prefix) {
		formatted = this.prefix + formatted;
	}

	return formatted;
},

fillWithZeroes : function(str) {
	while (str.length < (this.centsLimit + 1)) {
		str = '0' + str;
	}
	return str;
},

priceIt : function() {
	var str = this.el.value;
	var price = this.priceFormat(str);
	if (str != price) {
		this.el.value = price;
	}
},

// Add prefix on focus
	addPrefix : function() {
		var val = el.value;
		el.value = this.prefix + val;
	},
	// Clear prefix on blur if is set to true
	clearPrefix : function() {
		if (prefix.trim() != '' && this.clearPrefix) {
			var array = el.value.split(this.prefix);
			el.value = array[1];
		}
	}
});
