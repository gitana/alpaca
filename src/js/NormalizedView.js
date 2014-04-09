(function($) {

    var Alpaca = $.alpaca;

    Alpaca.NormalizedView = Base.extend(
    /**
     * @lends Alpaca.NormalizedView.prototype
     */
    {
        /**
         * Once all of the Alpaca views are registered with the framework, each is normalized so that parent-chain
         * references and overrides are normalized into a single, fast lookup object.
         *
         * @constructs
         *
         * @class Normalized view.
         *
         * @param {String} the view id
         */
        constructor: function(viewId) {
            this.id = viewId;
        },

        /**
         * Normalization occurs once per view upon startup of Alpaca.
         */
        normalize: function()
        {
            // load the view object
            var viewObject  = Alpaca.views[this.id];
            if (!viewObject)
            {
                Alpaca.logError("View compilation failed - view not found: " + this.id);
                return false;
            }

            // collect the inheritance chain
            var chain = [];
            var current = viewObject;
            while (current) {
                chain.push(current);

                var parentId = current.parent;
                if (parentId) {
                    var parent = Alpaca.views[current.parent];
                    if (!parent) {
                        Alpaca.logError("View compilation failed - cannot find parent view: " + parentId + " for view: " + current.id);
                        return false;
                    }
                    current = parent;
                }
                else
                {
                    current = null;
                }
            }

            // reverse the chain
            chain = chain.reverse();

            var setScalar = function(target, source, propertyId)
            {
                var value = source[propertyId];

                var currentValue = target[propertyId];
                if (!Alpaca.isUndefined(currentValue) && !Alpaca.isUndefined(value))
                {
                    Alpaca.logDebug("View property: " + propertyId + " already has value: " + currentValue + " and overwriting to: " + value);
                }

                if (!Alpaca.isUndefined(value)) {
                    target[propertyId] = value;
                }
            };

            var setFunction = function(target, source, propertyId)
            {
                var value = source[propertyId];

                var currentValue = target[propertyId];
                if (!Alpaca.isUndefined(currentValue) && !Alpaca.isUndefined(value))
                {
                    Alpaca.logDebug("View property: " + propertyId + " already has function, overwriting");
                }

                if (!Alpaca.isUndefined(value)) {
                    target[propertyId] = value;
                }
            };

            var mergeMap = function(target, source, propertyId)
            {
                var sourceMap = source[propertyId];
                if (sourceMap)
                {
                    if (!target[propertyId])
                    {
                        target[propertyId] = {};
                    }

                    Alpaca.mergeObject2(sourceMap, target[propertyId]);
                }
            };

            // walk forward and apply
            for (var i = 0; i < chain.length; i++)
            {
                var element = chain[i];

                // scalar properties
                setScalar(this, element, "type");
                setScalar(this, element, "displayReadonly");
                setScalar(this, element, "platform");
                setScalar(this, element, "device");
                setScalar(this, element, "style");
                setScalar(this, element, "ui");
                setScalar(this, element, "collapsible");
                setScalar(this, element, "legendStyle");
                setScalar(this, element, "toolbarStyle");
                setScalar(this, element, "buttonStyle");
                setScalar(this, element, "toolbarSticky");
                setScalar(this, element, "globalTemplate");

                // functions
                setFunction(this, element, "render");
                setFunction(this, element, "postRender");

                // maps (merge)
                mergeMap(this, element, "styles");
                mergeMap(this, element, "templates");
                mergeMap(this, element, "messages");
                mergeMap(this, element, "wizard");
                mergeMap(this, element, "fields");
                mergeMap(this, element, "layout");

                // compiled templates
                mergeMap(this, element, "compiledTemplates");
            }

            Alpaca.logDebug("View compilation complete for view: " + this.id);
            Alpaca.logDebug("Final view: ");
            Alpaca.logDebug(JSON.stringify(this, null, "   "));

            return true;
        }
    });
})(jQuery);