(function() {

    var init = function()
    {
        /** BUILD_INSERT_SCRIPT **/
    };

    /**
     * Support for AMD (Asynchronous Module Definition).
     * https://github.com/amdjs/amdjs-api/wiki/AMD
     *
     * If the browser supports AMD, then we use the define() method to claim the "alpaca" name.
     * We also mark that we depend on "jquery".
     */
    if ( typeof define === "function" && define.amd) {

        // load via amd into target namespace
        define( '/** BUILD_INSERT_NAME **/', /** BUILD_INSERT_DEPENDENCIES **/, function ($) {
            return init.call();
        });
    }
    else
    {
        // initialize into global namespace
        return init.call();
    }

})();
