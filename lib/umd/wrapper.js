/**
 * UMD wrapper for compatibility with browser, Node and AMD.
 *
 * Based on:
 *   https://github.com/umdjs/umd/blob/master/returnExports.js
 */
(function (root, factory)
{
    var umdEnabled = true;
    if (root && typeof(root.umd) != "undefined") {
        umdEnabled = root.umd;
    }

    if (umdEnabled && typeof exports === 'object')
    {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        //module.exports = factory(require('b'));
        module.exports = factory();
    }
    else if (umdEnabled && typeof define === 'function' && define.amd)
    {
        // AMD. Register as an anonymous module.
        //define(['b'], factory);
        define('/** BUILD_INSERT_NAME **/', /** BUILD_INSERT_DEPENDENCIES **/, factory);
    }
    else
    {
        // Browser globals
        //root.returnExports = factory(root.b);
        root["/** BUILD_INSERT_VARIABLE_NAME **/"] = factory();
    }

}(this, function (/** BUILD_INSERT_ARGUMENT_NAMES **/) {

    //use b in some fashion.

    // Just return a value to define the module export.
    // This example returns an object, but the module
    // can return a function as the exported value.
    //return {};

    /** BUILD_INSERT_SCRIPT **/

    return /** BUILD_INSERT_VARIABLE_NAME **/;

}));
