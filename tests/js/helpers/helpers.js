(function($) {

    window.simulateClick = function(el, callback)
    {
        $(el).click();

        window.setTimeout(function() {
            callback();
        }, 100);
    };

}(jQuery));