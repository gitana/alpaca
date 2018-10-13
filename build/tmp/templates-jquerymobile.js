this["HandlebarsPrecompiled"] = this["HandlebarsPrecompiled"] || {};
this["HandlebarsPrecompiled"]["web-display"] = this["HandlebarsPrecompiled"]["web-display"] || {};
this["HandlebarsPrecompiled"]["web-display"]["container-array-item"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, buffer = 
  "<script type=\"text/x-handlebars-template\">\n\n    <div>\n        ";
  stack1 = ((helper = (helper = helpers.itemField || (depth0 != null ? depth0.itemField : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"itemField","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},options) : helper));
  if (!helpers.itemField) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n    </div>\n\n</script>\n";
},"useData":true});
this["HandlebarsPrecompiled"]["web-display"]["container-array"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, buffer = 
  "\n            ";
  stack1 = ((helper = (helper = helpers.item || (depth0 != null ? depth0.item : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"item","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},options) : helper));
  if (!helpers.item) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<script type=\"text/x-handlebars-template\">\n\n    <div>\n\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.items : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n    </div>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["web-display"]["container-object-item"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, buffer = 
  "<script type=\"text/x-handlebars-template\">\n\n    <div>\n        ";
  stack1 = ((helper = (helper = helpers.itemField || (depth0 != null ? depth0.itemField : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"itemField","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},options) : helper));
  if (!helpers.itemField) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n    </div>\n\n</script>\n";
},"useData":true});
this["HandlebarsPrecompiled"]["web-display"]["container-object"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, buffer = 
  "\n            ";
  stack1 = ((helper = (helper = helpers.item || (depth0 != null ? depth0.item : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"item","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},options) : helper));
  if (!helpers.item) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<script type=\"text/x-handlebars-template\">\n\n    <div>\n\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.items : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n    </div>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["web-display"]["container-table-item"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<script type=\"text/x-handlebars-template\">\n\n    <tr>\n        "
    + ((stack1 = (helpers.itemField || (depth0 && depth0.itemField) || helpers.helperMissing).call(depth0 != null ? depth0 : {},"td",{"name":"itemField","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n    </tr>\n\n\n</script>\n";
},"useData":true});
this["HandlebarsPrecompiled"]["web-display"]["container-table"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                    <th>"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.value : depth0)) != null ? stack1.title : stack1), depth0))
    + "</th>\n";
},"5":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "\n                "
    + ((stack1 = (helpers.item || (depth0 && depth0.item) || helpers.helperMissing).call(depth0 != null ? depth0 : {},"tr",{"name":"item","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, buffer = 
  "<script type=\"text/x-handlebars-template\">\n\n    <div>\n\n        ";
  stack1 = ((helper = (helper = helpers.arrayToolbar || (depth0 != null ? depth0.arrayToolbar : depth0)) != null ? helper : alias2),(options={"name":"arrayToolbar","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(alias1,options) : helper));
  if (!helpers.arrayToolbar) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n\n        <table>\n\n            <!-- table headers -->\n            <thead>\n                <tr>\n"
    + ((stack1 = (helpers.eachProperty || (depth0 && depth0.eachProperty) || alias2).call(alias1,((stack1 = ((stack1 = (depth0 != null ? depth0.schema : depth0)) != null ? stack1.items : stack1)) != null ? stack1.properties : stack1),{"name":"eachProperty","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                </tr>\n            </thead>\n\n            <!-- table body -->\n            <tbody>\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.items : depth0),{"name":"each","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "            </tbody>\n\n        </table>\n\n    </div>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["web-display"]["container-tablerow-item"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, buffer = 
  "<script type=\"text/x-handlebars-template\">\n\n    <td>\n        ";
  stack1 = ((helper = (helper = helpers.itemField || (depth0 != null ? depth0.itemField : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"itemField","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},options) : helper));
  if (!helpers.itemField) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n    </td>\n\n</script>\n";
},"useData":true});
this["HandlebarsPrecompiled"]["web-display"]["container-tablerow"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, buffer = 
  "            ";
  stack1 = ((helper = (helper = helpers.item || (depth0 != null ? depth0.item : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"item","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},options) : helper));
  if (!helpers.item) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<script type=\"text/x-handlebars-template\">\n\n    <div class=\"alpaca-merge-up\">\n\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.items : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n    </div>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["web-display"]["container"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "        <legend class=\""
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.labelClass : stack1),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " alpaca-container-label\">"
    + ((stack1 = container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.label : stack1), depth0)) != null ? stack1 : "")
    + "</legend>\n";
},"2":function(container,depth0,helpers,partials,data) {
    var stack1;

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.labelClass : stack1), depth0));
},"4":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.compare || (depth0 && depth0.compare) || helpers.helperMissing).call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helpersPosition : stack1),"above",{"name":"compare","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"5":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helpers : stack1),{"name":"each","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"6":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "                    <p class=\"alpaca-helper "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helperClass : stack1),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\">\n                        <i class=\"alpaca-icon-helper\"></i>\n                        "
    + ((stack1 = (helpers.showMessage || (depth0 && depth0.showMessage) || helpers.helperMissing).call(alias1,depth0,{"name":"showMessage","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                    </p>\n";
},"7":function(container,depth0,helpers,partials,data) {
    var stack1;

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helperClass : stack1), depth0));
},"9":function(container,depth0,helpers,partials,data) {
    return "";
},"11":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.compare || (depth0 && depth0.compare) || helpers.helperMissing).call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helpersPosition : stack1),"below",{"name":"compare","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : {}, buffer = 
  "<script type=\"text/x-handlebars-template\">\n\n    <div>\n\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.label : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helpers : stack1),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n        ";
  stack1 = ((helper = (helper = helpers.container || (depth0 != null ? depth0.container : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"container","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(alias1,options) : helper));
  if (!helpers.container) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helpers : stack1),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n    </div>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["web-display"]["control-any"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<script type=\"text/x-handlebars-template\">\n\n    <div>"
    + ((stack1 = (helpers.str || (depth0 && depth0.str) || helpers.helperMissing).call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.data : depth0),{"name":"str","hash":{},"data":data})) != null ? stack1 : "")
    + "</div>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["web-display"]["control-checkbox"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<script type=\"text/x-handlebars-template\">\n\n    <div>\n        "
    + container.escapeExpression(((helper = (helper = helpers.displayableText || (depth0 != null ? depth0.displayableText : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"displayableText","hash":{},"data":data}) : helper)))
    + "\n    </div>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["web-display"]["control-hidden"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<script type=\"text/x-handlebars-template\">\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["web-display"]["control-image"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<script type=\"text/x-handlebars-template\">\n\n    <div class=\"alpaca-image-display\">\n        <img id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "-image\" src=\""
    + alias4(((helper = (helper = helpers.data || (depth0 != null ? depth0.data : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"data","hash":{},"data":data}) : helper)))
    + "\">\n    </div>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["web-display"]["control-password"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<script type=\"text/x-handlebars-template\">\n\n    <div>"
    + ((stack1 = (helpers.disguise || (depth0 && depth0.disguise) || helpers.helperMissing).call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.data : depth0),"&bull;",{"name":"disguise","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["web-display"]["control-radio"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<script type=\"text/x-handlebars-template\">\n\n    <div>\n        "
    + container.escapeExpression(((helper = (helper = helpers.displayableText || (depth0 != null ? depth0.displayableText : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"displayableText","hash":{},"data":data}) : helper)))
    + "\n    </div>\n\n</script>\n";
},"useData":true});
this["HandlebarsPrecompiled"]["web-display"]["control-select"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<script type=\"text/x-handlebars-template\">\n\n    <div>\n        "
    + container.escapeExpression(((helper = (helper = helpers.displayableText || (depth0 != null ? depth0.displayableText : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"displayableText","hash":{},"data":data}) : helper)))
    + "\n    </div>\n\n</script>\n";
},"useData":true});
this["HandlebarsPrecompiled"]["web-display"]["control-text"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "<script type=\"text/x-handlebars-template\">\n\n    <div>"
    + ((stack1 = ((helper = (helper = helpers.data || (depth0 != null ? depth0.data : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"data","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</div>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["web-display"]["control-textarea"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "<script type=\"text/x-handlebars-template\">\n\n    <p>\n        "
    + ((stack1 = ((helper = (helper = helpers.data || (depth0 != null ? depth0.data : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"data","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n    </p>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["web-display"]["control-url"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "target=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.anchorTarget : stack1), depth0))
    + "\"";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1;

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.anchorTitle : stack1), depth0));
},"5":function(container,depth0,helpers,partials,data) {
    var helper;

  return container.escapeExpression(((helper = (helper = helpers.data || (depth0 != null ? depth0.data : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"data","hash":{},"data":data}) : helper)));
},"7":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "            "
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.anchorTitle : stack1), depth0))
    + "\n";
},"9":function(container,depth0,helpers,partials,data) {
    var helper;

  return "            "
    + container.escapeExpression(((helper = (helper = helpers.data || (depth0 != null ? depth0.data : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"data","hash":{},"data":data}) : helper)))
    + "\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {};

  return "<script type=\"text/x-handlebars-template\">\n\n    <div class=\"alpaca-control-url-anchor-wrapper\">\n        <a href=\""
    + container.escapeExpression(((helper = (helper = helpers.data || (depth0 != null ? depth0.data : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"data","hash":{},"data":data}) : helper)))
    + "\" "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.anchorTarget : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " title=\""
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.anchorTitle : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.program(5, data, 0),"data":data})) != null ? stack1 : "")
    + "\">\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.anchorTitle : stack1),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.program(9, data, 0),"data":data})) != null ? stack1 : "")
    + "        </a>\n    </div>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["web-display"]["control"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {};

  return "        <label class=\""
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.labelClass : stack1),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " alpaca-control-label\" for=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">"
    + ((stack1 = container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.label : stack1), depth0)) != null ? stack1 : "")
    + "</label>\n";
},"2":function(container,depth0,helpers,partials,data) {
    var stack1;

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.labelClass : stack1), depth0));
},"4":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.compare || (depth0 && depth0.compare) || helpers.helperMissing).call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helpersPosition : stack1),"above",{"name":"compare","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"5":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helpers : stack1),{"name":"each","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"6":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "                    <p class=\""
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helperClass : stack1),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\">\n                        <i class=\"info-sign\"></i>\n                        "
    + ((stack1 = (helpers.showMessage || (depth0 && depth0.showMessage) || helpers.helperMissing).call(alias1,depth0,{"name":"showMessage","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                    </p>\n";
},"7":function(container,depth0,helpers,partials,data) {
    var stack1;

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helperClass : stack1), depth0));
},"9":function(container,depth0,helpers,partials,data) {
    return "";
},"11":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.compare || (depth0 && depth0.compare) || helpers.helperMissing).call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helpersPosition : stack1),"below",{"name":"compare","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : {}, buffer = 
  "<script type=\"text/x-handlebars-template\">\n\n    <div>\n\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.label : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helpers : stack1),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n        ";
  stack1 = ((helper = (helper = helpers.control || (depth0 != null ? depth0.control : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"control","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(alias1,options) : helper));
  if (!helpers.control) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helpers : stack1),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n    </div>\n\n</script>\n";
},"useData":true});
this["HandlebarsPrecompiled"]["web-display"]["form"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.buttons : stack1),{"name":"each","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"4":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "            <button data-key=\""
    + alias4(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"key","hash":{},"data":data}) : helper)))
    + "\" "
    + ((stack1 = (helpers.compare || (depth0 && depth0.compare) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"submit",{"name":"compare","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = (helpers.compare || (depth0 && depth0.compare) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"reset",{"name":"compare","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " class=\"alpaca-form-button alpaca-form-button-"
    + alias4(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"key","hash":{},"data":data}) : helper)))
    + " "
    + alias4(((helper = (helper = helpers.styles || (depth0 != null ? depth0.styles : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"styles","hash":{},"data":data}) : helper)))
    + "\" "
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.value : depth0),{"name":"each","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.attributes : depth0),{"name":"each","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">"
    + ((stack1 = ((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</button>\n";
},"5":function(container,depth0,helpers,partials,data) {
    return "type=\"submit\"";
},"7":function(container,depth0,helpers,partials,data) {
    return "type=\"reset\"";
},"9":function(container,depth0,helpers,partials,data) {
    var helper, alias1=container.escapeExpression;

  return alias1(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"key","hash":{},"data":data}) : helper)))
    + "=\""
    + alias1(container.lambda(depth0, depth0))
    + "\"";
},"11":function(container,depth0,helpers,partials,data) {
    var helper, alias1=container.escapeExpression;

  return " "
    + alias1(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"key","hash":{},"data":data}) : helper)))
    + "=\""
    + alias1(container.lambda(depth0, depth0))
    + "\"";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : {}, buffer = 
  "<script type=\"text/x-handlebars-template\">\n\n    <form role=\"form\">\n\n        ";
  stack1 = ((helper = (helper = helpers.formItems || (depth0 != null ? depth0.formItems : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"formItems","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(alias1,options) : helper));
  if (!helpers.formItems) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n\n        <div class=\"alpaca-form-buttons-container\">\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.buttons : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n\n    </form>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["web-edit"] = this["HandlebarsPrecompiled"]["web-edit"] || {};
this["HandlebarsPrecompiled"]["web-edit"]["container-array-actionbar"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=container.escapeExpression, alias2=depth0 != null ? depth0 : {};

  return "        <button class=\"alpaca-array-actionbar-action "
    + alias1(container.lambda(((stack1 = ((stack1 = (depths[1] != null ? depths[1].view : depths[1])) != null ? stack1.styles : stack1)) != null ? stack1.smallButton : stack1), depth0))
    + "\" data-alpaca-array-actionbar-action=\""
    + alias1(((helper = (helper = helpers.action || (depth0 != null ? depth0.action : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias2,{"name":"action","hash":{},"data":data}) : helper)))
    + "\">\n"
    + ((stack1 = helpers["if"].call(alias2,(depth0 != null ? depth0.iconClass : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "            "
    + ((stack1 = helpers["if"].call(alias2,(depth0 != null ? depth0.label : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n        </button>\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "            <i class=\""
    + container.escapeExpression(container.lambda((depth0 != null ? depth0.iconClass : depth0), depth0))
    + "\"></i>\n";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return ((stack1 = ((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"label","hash":{},"data":data}) : helper))) != null ? stack1 : "");
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<script type=\"text/x-handlebars-template\">\n\n    <div class=\"alpaca-array-actionbar alpaca-array-actionbar-"
    + alias4(((helper = (helper = helpers.actionbarStyle || (depth0 != null ? depth0.actionbarStyle : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"actionbarStyle","hash":{},"data":data}) : helper)))
    + " btn-group\" data-alpaca-array-actionbar-parent-field-id=\""
    + alias4(((helper = (helper = helpers.parentFieldId || (depth0 != null ? depth0.parentFieldId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"parentFieldId","hash":{},"data":data}) : helper)))
    + "\" data-alpaca-array-actionbar-field-id=\""
    + alias4(((helper = (helper = helpers.fieldId || (depth0 != null ? depth0.fieldId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"fieldId","hash":{},"data":data}) : helper)))
    + "\" data-alpaca-array-actionbar-item-index=\""
    + alias4(((helper = (helper = helpers.itemIndex || (depth0 != null ? depth0.itemIndex : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"itemIndex","hash":{},"data":data}) : helper)))
    + "\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.actions : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\n\n</script>";
},"useData":true,"useDepths":true});
this["HandlebarsPrecompiled"]["web-edit"]["container-array-item"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=helpers.blockHelperMissing, buffer = 
  "        <div class=\"pull-left\">\n            ";
  stack1 = ((helper = (helper = helpers.arrayActionbar || (depth0 != null ? depth0.arrayActionbar : depth0)) != null ? helper : alias2),(options={"name":"arrayActionbar","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.arrayActionbar) { stack1 = alias4.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  buffer += "\n        </div>\n        <div class=\"pull-right\">\n            ";
  stack1 = ((helper = (helper = helpers.itemField || (depth0 != null ? depth0.itemField : depth0)) != null ? helper : alias2),(options={"name":"itemField","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.itemField) { stack1 = alias4.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n        </div>\n        <div class=\"clear\"></div>\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.compare || (depth0 && depth0.compare) || helpers.helperMissing).call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.actionbarStyle : depth0),"right",{"name":"compare","hash":{},"fn":container.program(5, data, 0),"inverse":container.program(7, data, 0),"data":data})) != null ? stack1 : "");
},"5":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=helpers.blockHelperMissing, buffer = 
  "            <div class=\"pull-left\">\n                ";
  stack1 = ((helper = (helper = helpers.itemField || (depth0 != null ? depth0.itemField : depth0)) != null ? helper : alias2),(options={"name":"itemField","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.itemField) { stack1 = alias4.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  buffer += "\n            </div>\n            <div class=\"pull-right\">\n                ";
  stack1 = ((helper = (helper = helpers.arrayActionbar || (depth0 != null ? depth0.arrayActionbar : depth0)) != null ? helper : alias2),(options={"name":"arrayActionbar","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.arrayActionbar) { stack1 = alias4.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n            </div>\n            <div class=\"alpaca-clear\"></div>\n";
},"7":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, buffer = 
  "            <div>\n\n"
    + ((stack1 = (helpers.compare || (depth0 && depth0.compare) || alias2).call(alias1,(depth0 != null ? depth0.actionbarStyle : depth0),"top",{"name":"compare","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                ";
  stack1 = ((helper = (helper = helpers.itemField || (depth0 != null ? depth0.itemField : depth0)) != null ? helper : alias2),(options={"name":"itemField","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(alias1,options) : helper));
  if (!helpers.itemField) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n\n"
    + ((stack1 = (helpers.compare || (depth0 && depth0.compare) || alias2).call(alias1,(depth0 != null ? depth0.actionbarStyle : depth0),"bottom",{"name":"compare","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            </div>\n";
},"8":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, buffer = 
  "                ";
  stack1 = ((helper = (helper = helpers.arrayActionbar || (depth0 != null ? depth0.arrayActionbar : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"arrayActionbar","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},options) : helper));
  if (!helpers.arrayActionbar) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<script type=\"text/x-handlebars-template\">\n\n    <div>\n"
    + ((stack1 = (helpers.compare || (depth0 && depth0.compare) || helpers.helperMissing).call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.actionbarStyle : depth0),"left",{"name":"compare","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(4, data, 0),"data":data})) != null ? stack1 : "")
    + "    </div>\n\n</script>\n";
},"useData":true});
this["HandlebarsPrecompiled"]["web-edit"]["container-array-toolbar"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return " btn-group";
},"3":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing;

  return "\n"
    + ((stack1 = (helpers.compare || (depth0 && depth0.compare) || alias2).call(alias1,(depths[1] != null ? depths[1].toolbarStyle : depths[1]),"link",{"name":"compare","hash":{},"fn":container.program(4, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = (helpers.compare || (depth0 && depth0.compare) || alias2).call(alias1,(depths[1] != null ? depths[1].toolbarStyle : depths[1]),"button",{"name":"compare","hash":{},"fn":container.program(6, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function";

  return "                <a href=\"#\" class=\"alpaca-array-toolbar-action\" data-alpaca-array-toolbar-action=\""
    + container.escapeExpression(((helper = (helper = helpers.action || (depth0 != null ? depth0.action : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"action","hash":{},"data":data}) : helper)))
    + "\">"
    + ((stack1 = ((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</a>\n";
},"6":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=container.escapeExpression, alias2=depth0 != null ? depth0 : {};

  return "                <button class=\"alpaca-array-toolbar-action "
    + alias1(container.lambda(((stack1 = ((stack1 = (depths[1] != null ? depths[1].view : depths[1])) != null ? stack1.styles : stack1)) != null ? stack1.smallButton : stack1), depth0))
    + "\" data-alpaca-array-toolbar-action=\""
    + alias1(((helper = (helper = helpers.action || (depth0 != null ? depth0.action : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias2,{"name":"action","hash":{},"data":data}) : helper)))
    + "\">\n"
    + ((stack1 = helpers["if"].call(alias2,(depth0 != null ? depth0.iconClass : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                    "
    + ((stack1 = helpers["if"].call(alias2,(depth0 != null ? depth0.label : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                </button>\n";
},"7":function(container,depth0,helpers,partials,data) {
    var helper;

  return "                    <i class=\""
    + container.escapeExpression(((helper = (helper = helpers.iconClass || (depth0 != null ? depth0.iconClass : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"iconClass","hash":{},"data":data}) : helper)))
    + "\"></i>\n";
},"9":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return ((stack1 = ((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"label","hash":{},"data":data}) : helper))) != null ? stack1 : "");
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<script type=\"text/x-handlebars-template\">\n\n    <div class=\"alpaca-array-toolbar alpaca-array-toolbar-position-"
    + alias4(((helper = (helper = helpers.toolbarPosition || (depth0 != null ? depth0.toolbarPosition : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"toolbarPosition","hash":{},"data":data}) : helper)))
    + "\" data-alpaca-array-toolbar-field-id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" "
    + ((stack1 = (helpers.compare || (depth0 && depth0.compare) || alias2).call(alias1,(depth0 != null ? depth0.toolbarStyle : depth0),"button",{"name":"compare","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">\n\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.actions : depth0),{"name":"each","hash":{},"fn":container.program(3, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n    </div>\n\n</script>";
},"useData":true,"useDepths":true});
this["HandlebarsPrecompiled"]["web-edit"]["container-array"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, buffer = 
  "        ";
  stack1 = ((helper = (helper = helpers.arrayToolbar || (depth0 != null ? depth0.arrayToolbar : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"arrayToolbar","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},options) : helper));
  if (!helpers.arrayToolbar) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, buffer = 
  "            ";
  stack1 = ((helper = (helper = helpers.item || (depth0 != null ? depth0.item : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"item","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},options) : helper));
  if (!helpers.item) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing;

  return "<script type=\"text/x-handlebars-template\">\n\n    <div>\n"
    + ((stack1 = (helpers.compare || (depth0 && depth0.compare) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.toolbarPosition : stack1),"top",{"name":"compare","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.items : depth0),{"name":"each","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = (helpers.compare || (depth0 && depth0.compare) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.toolbarPosition : stack1),"bottom",{"name":"compare","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\n\n</script>\n";
},"useData":true});
this["HandlebarsPrecompiled"]["web-edit"]["container-object-item"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, buffer = 
  "<script type=\"text/x-handlebars-template\">\n\n    <div>\n\n        ";
  stack1 = ((helper = (helper = helpers.itemField || (depth0 != null ? depth0.itemField : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"itemField","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},options) : helper));
  if (!helpers.itemField) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n\n    </div>\n\n</script>\n";
},"useData":true});
this["HandlebarsPrecompiled"]["web-edit"]["container-object"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, buffer = 
  "\n            ";
  stack1 = ((helper = (helper = helpers.item || (depth0 != null ? depth0.item : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"item","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},options) : helper));
  if (!helpers.item) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<script type=\"text/x-handlebars-template\">\n\n    <div>\n\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.items : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n    </div>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["web-edit"]["container-table-item"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<script type=\"text/x-handlebars-template\">\n\n    <tr>\n        "
    + ((stack1 = (helpers.itemField || (depth0 && depth0.itemField) || helpers.helperMissing).call(depth0 != null ? depth0 : {},"td",{"name":"itemField","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n    </tr>\n\n</script>\n";
},"useData":true});
this["HandlebarsPrecompiled"]["web-edit"]["container-table"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "";
},"3":function(container,depth0,helpers,partials,data) {
    return "                    <!-- hidden column storing sort order -->\n                    <th class=\"alpaca-table-reorder-index-header\"></th>\n                    <!-- draggable -->\n                    <th class=\"alpaca-table-reorder-draggable-header\"></th>\n";
},"5":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function";

  return "                    <th data-header-id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.hidden : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">"
    + ((stack1 = ((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</th>\n";
},"6":function(container,depth0,helpers,partials,data) {
    return "class=\"alpaca-table-column-hidden\"";
},"8":function(container,depth0,helpers,partials,data) {
    return "                        <th>Actions</th>\n";
},"10":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "\n                "
    + ((stack1 = (helpers.item || (depth0 && depth0.item) || helpers.helperMissing).call(depth0 != null ? depth0 : {},"tr",{"name":"item","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : {}, buffer = 
  "<script type=\"text/x-handlebars-template\">\n\n    <div>\n\n        ";
  stack1 = ((helper = (helper = helpers.arrayToolbar || (depth0 != null ? depth0.arrayToolbar : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"arrayToolbar","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(alias1,options) : helper));
  if (!helpers.arrayToolbar) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n\n        <table>\n\n            <!-- table headers -->\n            <thead>\n                <tr>\n\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.dragRows : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.headers : depth0),{"name":"each","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.showActionsColumn : stack1),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                </tr>\n            </thead>\n\n            <!-- table body -->\n            <tbody>\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.items : depth0),{"name":"each","hash":{},"fn":container.program(10, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "            </tbody>\n\n        </table>\n\n    </div>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["web-edit"]["container-tablerow-item"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, buffer = 
  "<script type=\"text/x-handlebars-template\">\n\n    <td>\n        ";
  stack1 = ((helper = (helper = helpers.itemField || (depth0 != null ? depth0.itemField : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"itemField","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},options) : helper));
  if (!helpers.itemField) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n    </td>\n\n</script>\n";
},"useData":true});
this["HandlebarsPrecompiled"]["web-edit"]["container-tablerow"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "\n            <!-- hidden sort order column -->\n            <div class=\"alpaca-table-reorder-index-cell\"></div>\n\n            <!-- reorder draggable -->\n            <div class=\"alpaca-table-reorder-draggable-cell\">\n                <i class=\"glyphicon glyphicon-menu-hamburger\"></i>\n            </div>\n";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.hidden : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.program(6, data, 0),"data":data})) != null ? stack1 : "");
},"4":function(container,depth0,helpers,partials,data) {
    return "";
},"6":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, buffer = 
  "                ";
  stack1 = ((helper = (helper = helpers.item || (depth0 != null ? depth0.item : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"item","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},options) : helper));
  if (!helpers.item) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n";
},"8":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", buffer = 
  "            <div class=\"alpaca-merge-up\" data-alpaca-merge-tag=\"td\" data-merge-up-field-id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">\n                ";
  stack1 = ((helper = (helper = helpers.arrayActionbar || (depth0 != null ? depth0.arrayActionbar : depth0)) != null ? helper : alias2),(options={"name":"arrayActionbar","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.arrayActionbar) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n            </div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "<script type=\"text/x-handlebars-template\">\n\n    <div class=\"alpaca-merge-up\">\n\n        <!-- drag cell -->\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.dragRows : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.items : depth0),{"name":"each","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n        <!-- actions cell -->\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.showActionsColumn : stack1),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n    </div>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["web-edit"]["container"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "        <legend class=\""
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.labelClass : stack1),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " alpaca-container-label\">"
    + ((stack1 = container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.label : stack1), depth0)) != null ? stack1 : "")
    + "</legend>\n";
},"2":function(container,depth0,helpers,partials,data) {
    var stack1;

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.labelClass : stack1), depth0));
},"4":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.compare || (depth0 && depth0.compare) || helpers.helperMissing).call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helpersPosition : stack1),"above",{"name":"compare","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"5":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helpers : stack1),{"name":"each","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"6":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "                    <p class=\"alpaca-helper "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helperClass : stack1),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\">\n                        <i class=\"alpaca-icon-helper\"></i>\n                        "
    + ((stack1 = (helpers.showMessage || (depth0 && depth0.showMessage) || helpers.helperMissing).call(alias1,depth0,{"name":"showMessage","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                    </p>\n";
},"7":function(container,depth0,helpers,partials,data) {
    var stack1;

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helperClass : stack1), depth0));
},"9":function(container,depth0,helpers,partials,data) {
    return "";
},"11":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.compare || (depth0 && depth0.compare) || helpers.helperMissing).call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helpersPosition : stack1),"below",{"name":"compare","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : {}, buffer = 
  "<script type=\"text/x-handlebars-template\">\n\n    <div>\n\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.label : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helpers : stack1),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n        ";
  stack1 = ((helper = (helper = helpers.container || (depth0 != null ? depth0.container : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"container","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(alias1,options) : helper));
  if (!helpers.container) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helpers : stack1),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n    </div>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["web-edit"]["control-any"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "readonly=\"readonly\"";
},"3":function(container,depth0,helpers,partials,data) {
    var helper;

  return "name=\""
    + container.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"name","hash":{},"data":data}) : helper)))
    + "\"";
},"5":function(container,depth0,helpers,partials,data) {
    var helper, alias1=container.escapeExpression;

  return "data-"
    + alias1(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"key","hash":{},"data":data}) : helper)))
    + "=\""
    + alias1(container.lambda(depth0, depth0))
    + "\"";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {};

  return "<script type=\"text/x-handlebars-template\">\n\n    <input type=\"text\" id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" size=\"40\" "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.readonly : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.name : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers.each.call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.data : stack1),{"name":"each","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "/>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["web-edit"]["control-checkbox"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return "\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.selectOptions : depth0),{"name":"each","hash":{},"fn":container.program(2, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n";
},"2":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "\n            <div>\n\n                <label>\n\n                    <input type=\"checkbox\" data-checkbox-index=\""
    + alias4(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" data-checkbox-value=\""
    + alias4(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper)))
    + "\" "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.selected : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depths[1] != null ? depths[1].options : depths[1])) != null ? stack1.readonly : stack1),{"name":"if","hash":{},"fn":container.program(5, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.name : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers.each.call(alias1,((stack1 = (depths[1] != null ? depths[1].options : depths[1])) != null ? stack1.data : stack1),{"name":"each","hash":{},"fn":container.program(9, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "/>\n                    "
    + ((stack1 = ((helper = (helper = helpers.text || (depth0 != null ? depth0.text : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"text","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n\n                </label>\n            </div>\n\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "checked";
},"5":function(container,depth0,helpers,partials,data) {
    return "readonly=\"readonly\"";
},"7":function(container,depth0,helpers,partials,data) {
    var helper;

  return "name=\""
    + container.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"name","hash":{},"data":data}) : helper)))
    + "\"";
},"9":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "data-"
    + alias4(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"key","hash":{},"data":data}) : helper)))
    + "=\""
    + alias4(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper)))
    + "\"";
},"11":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "\n        <div>\n\n            <label>\n\n                <input type=\"checkbox\" "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.data : depth0)) != null ? stack1.length : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.readonly : stack1),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.name : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers.each.call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.data : stack1),{"name":"each","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "/>\n\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.rightLabel : stack1),{"name":"if","hash":{},"fn":container.program(12, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            </label>\n\n        </div>\n\n";
},"12":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                    "
    + ((stack1 = container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.rightLabel : stack1), depth0)) != null ? stack1 : "")
    + "\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return "<script type=\"text/x-handlebars-template\">\n\n"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.multiple : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.program(11, data, 0, blockParams, depths),"data":data})) != null ? stack1 : "")
    + "\n</script>\n";
},"useData":true,"useDepths":true});
this["HandlebarsPrecompiled"]["web-edit"]["control-ckeditor"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<script type=\"text/x-handlebars-template\">\n\n    <textarea id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"id","hash":{},"data":data}) : helper)))
    + "\" cols=\"80\" rows=\"10\">\n    </textarea>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["web-edit"]["control-editor"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<script type=\"text/x-handlebars-template\">\n\n    <div id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"control-field-editor-el\"></div>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["web-edit"]["control-file"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "size=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.size : stack1), depth0))
    + "\"";
},"3":function(container,depth0,helpers,partials,data) {
    return "readonly=\"readonly\"";
},"5":function(container,depth0,helpers,partials,data) {
    var helper;

  return "name=\""
    + container.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"name","hash":{},"data":data}) : helper)))
    + "\"";
},"7":function(container,depth0,helpers,partials,data) {
    var helper, alias1=container.escapeExpression;

  return "data-"
    + alias1(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"key","hash":{},"data":data}) : helper)))
    + "=\""
    + alias1(container.lambda(depth0, depth0))
    + "\"";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {};

  return "<script type=\"text/x-handlebars-template\">\n\n    <input type=\"file\" id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.size : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.readonly : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.name : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers.each.call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.data : stack1),{"name":"each","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "/>\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["web-edit"]["control-hidden"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return "name=\""
    + container.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"name","hash":{},"data":data}) : helper)))
    + "\"";
},"3":function(container,depth0,helpers,partials,data) {
    var helper, alias1=container.escapeExpression;

  return "data-"
    + alias1(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"key","hash":{},"data":data}) : helper)))
    + "=\""
    + alias1(container.lambda(depth0, depth0))
    + "\"";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {};

  return "<script type=\"text/x-handlebars-template\">\n\n    <input type=\"hidden\" id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.name : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers.each.call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.data : stack1),{"name":"each","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "/>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["web-edit"]["control-image"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "placeholder=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.placeholder : stack1), depth0))
    + "\"";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "size=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.size : stack1), depth0))
    + "\"";
},"5":function(container,depth0,helpers,partials,data) {
    return "readonly=\"readonly\"";
},"7":function(container,depth0,helpers,partials,data) {
    var helper;

  return "name=\""
    + container.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"name","hash":{},"data":data}) : helper)))
    + "\"";
},"9":function(container,depth0,helpers,partials,data) {
    var helper, alias1=container.escapeExpression;

  return "data-"
    + alias1(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"key","hash":{},"data":data}) : helper)))
    + "=\""
    + alias1(container.lambda(depth0, depth0))
    + "\"";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<script type=\"text/x-handlebars-template\">\n\n    <input type=\"text\" id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.placeholder : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.size : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.readonly : stack1),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.name : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers.each.call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.data : stack1),{"name":"each","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "/>\n\n    <div class=\"alpaca-image-display\">\n        <h5>Preview</h5>\n        <img id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "-image\" src=\""
    + alias4(((helper = (helper = helpers.data || (depth0 != null ? depth0.data : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"data","hash":{},"data":data}) : helper)))
    + "\">\n    </div>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["web-edit"]["control-optiontree"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "placeholder=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.placeholder : stack1), depth0))
    + "\"";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "size=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.size : stack1), depth0))
    + "\"";
},"5":function(container,depth0,helpers,partials,data) {
    return "readonly=\"readonly\"";
},"7":function(container,depth0,helpers,partials,data) {
    var helper;

  return "name=\""
    + container.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"name","hash":{},"data":data}) : helper)))
    + "\"";
},"9":function(container,depth0,helpers,partials,data) {
    var helper, alias1=container.escapeExpression;

  return "data-"
    + alias1(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"key","hash":{},"data":data}) : helper)))
    + "=\""
    + alias1(container.lambda(depth0, depth0))
    + "\"";
},"11":function(container,depth0,helpers,partials,data) {
    var helper, alias1=container.escapeExpression;

  return alias1(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"key","hash":{},"data":data}) : helper)))
    + "=\""
    + alias1(container.lambda(depth0, depth0))
    + "\"";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<script type=\"text/x-handlebars-template\">\n\n    <div class=\"optiontree\"></div>\n\n    <input type=\""
    + alias4(((helper = (helper = helpers.inputType || (depth0 != null ? depth0.inputType : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"inputType","hash":{},"data":data}) : helper)))
    + "\" id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.placeholder : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.size : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.readonly : stack1),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.name : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers.each.call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.data : stack1),{"name":"each","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers.each.call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.attributes : stack1),{"name":"each","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "/>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["web-edit"]["control-password"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "placeholder=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.placeholder : stack1), depth0))
    + "\"";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "size=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.size : stack1), depth0))
    + "\"";
},"5":function(container,depth0,helpers,partials,data) {
    return "readonly=\"readonly\"";
},"7":function(container,depth0,helpers,partials,data) {
    var helper;

  return "name=\""
    + container.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"name","hash":{},"data":data}) : helper)))
    + "\"";
},"9":function(container,depth0,helpers,partials,data) {
    var helper, alias1=container.escapeExpression;

  return "data-"
    + alias1(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"key","hash":{},"data":data}) : helper)))
    + "=\""
    + alias1(container.lambda(depth0, depth0))
    + "\"";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {};

  return "<script type=\"text/x-handlebars-template\">\n\n    <input type=\"password\" id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.placeholder : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.size : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.readonly : stack1),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.name : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers.each.call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.data : stack1),{"name":"each","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "/>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["web-edit"]["control-radio"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {};

  return "    <div class=\"radio\">\n        <label>\n            <input type=\"radio\" "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.readonly : stack1),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " name=\""
    + container.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\" value=\"\" "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1._noData : stack1),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "/>"
    + ((stack1 = container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.noneLabel : stack1), depth0)) != null ? stack1 : "")
    + "\n        </label>\n    </div>\n";
},"4":function(container,depth0,helpers,partials,data) {
    return "readonly=\"readonly\"";
},"6":function(container,depth0,helpers,partials,data) {
    return "checked=\"checked\"";
},"8":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=container.escapeExpression, alias3=helpers.helperMissing, alias4="function";

  return "    <div class=\"radio\">\n        <label>\n            <input type=\"radio\" "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depths[1] != null ? depths[1].options : depths[1])) != null ? stack1.readonly : stack1),{"name":"if","hash":{},"fn":container.program(4, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " name=\""
    + alias2(container.lambda((depths[1] != null ? depths[1].name : depths[1]), depth0))
    + "\" value=\""
    + alias2(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper)))
    + "\" "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.selected : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "/>"
    + ((stack1 = ((helper = (helper = helpers.text || (depth0 != null ? depth0.text : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias1,{"name":"text","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n        </label>\n    </div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "<script type=\"text/x-handlebars-template\">\n\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.hideNone : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.program(3, data, 0, blockParams, depths),"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.selectOptions : depth0),{"name":"each","hash":{},"fn":container.program(8, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n</script>";
},"useData":true,"useDepths":true});
this["HandlebarsPrecompiled"]["web-edit"]["control-select"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "readonly=\"readonly\"";
},"3":function(container,depth0,helpers,partials,data) {
    return "multiple=\"multiple\"";
},"5":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "size=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.size : stack1), depth0))
    + "\"";
},"7":function(container,depth0,helpers,partials,data) {
    var helper;

  return "name=\""
    + container.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"name","hash":{},"data":data}) : helper)))
    + "\"";
},"9":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.hideNone : stack1),{"name":"if","hash":{},"fn":container.program(10, data, 0),"inverse":container.program(12, data, 0),"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.selectOptions : depth0),{"name":"each","hash":{},"fn":container.program(14, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n";
},"10":function(container,depth0,helpers,partials,data) {
    return "";
},"12":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "        <option value=\"\">"
    + ((stack1 = container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.noneLabel : stack1), depth0)) != null ? stack1 : "")
    + "</option>\n";
},"14":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function";

  return "        <option value=\""
    + ((stack1 = ((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\" "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.selected : depth0),{"name":"if","hash":{},"fn":container.program(15, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">"
    + container.escapeExpression(((helper = (helper = helpers.text || (depth0 != null ? depth0.text : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"text","hash":{},"data":data}) : helper)))
    + "</option>\n";
},"15":function(container,depth0,helpers,partials,data) {
    return "selected=\"selected\"";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {};

  return "<script type=\"text/x-handlebars-template\">\n\n    <select id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.readonly : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.multiple : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.size : stack1),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.name : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">\n\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.multiple : stack1),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.program(9, data, 0),"data":data})) != null ? stack1 : "")
    + "\n    </select>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["web-edit"]["control-text"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "placeholder=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.placeholder : stack1), depth0))
    + "\"";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "size=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.size : stack1), depth0))
    + "\"";
},"5":function(container,depth0,helpers,partials,data) {
    return "readonly=\"readonly\"";
},"7":function(container,depth0,helpers,partials,data) {
    var helper;

  return "name=\""
    + container.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"name","hash":{},"data":data}) : helper)))
    + "\"";
},"9":function(container,depth0,helpers,partials,data) {
    var helper, alias1=container.escapeExpression;

  return "data-"
    + alias1(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"key","hash":{},"data":data}) : helper)))
    + "=\""
    + alias1(container.lambda(depth0, depth0))
    + "\"";
},"11":function(container,depth0,helpers,partials,data) {
    var helper, alias1=container.escapeExpression;

  return alias1(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"key","hash":{},"data":data}) : helper)))
    + "=\""
    + alias1(container.lambda(depth0, depth0))
    + "\"";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<script type=\"text/x-handlebars-template\">\n\n    <input type=\""
    + alias4(((helper = (helper = helpers.inputType || (depth0 != null ? depth0.inputType : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"inputType","hash":{},"data":data}) : helper)))
    + "\" id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.placeholder : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.size : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.readonly : stack1),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.name : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers.each.call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.data : stack1),{"name":"each","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers.each.call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.attributes : stack1),{"name":"each","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "/>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["web-edit"]["control-textarea"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "placeholder=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.placeholder : stack1), depth0))
    + "\"";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "rows=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.rows : stack1), depth0))
    + "\"";
},"5":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "cols=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.cols : stack1), depth0))
    + "\"";
},"7":function(container,depth0,helpers,partials,data) {
    return "readonly=\"readonly\"";
},"9":function(container,depth0,helpers,partials,data) {
    var helper;

  return "name=\""
    + container.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"name","hash":{},"data":data}) : helper)))
    + "\"";
},"11":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function";

  return "data-"
    + container.escapeExpression(((helper = (helper = helpers.fieldId || (depth0 != null ? depth0.fieldId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"fieldId","hash":{},"data":data}) : helper)))
    + "=\""
    + ((stack1 = ((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\"";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {};

  return "<script type=\"text/x-handlebars-template\">\n\n    <textarea id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.placeholder : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.rows : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.cols : stack1),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.readonly : stack1),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.name : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers.each.call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.data : stack1),{"name":"each","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "/>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["web-edit"]["control-url"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "placeholder=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.placeholder : stack1), depth0))
    + "\"";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "size=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.size : stack1), depth0))
    + "\"";
},"5":function(container,depth0,helpers,partials,data) {
    return "readonly=\"readonly\"";
},"7":function(container,depth0,helpers,partials,data) {
    var helper;

  return "name=\""
    + container.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"name","hash":{},"data":data}) : helper)))
    + "\"";
},"9":function(container,depth0,helpers,partials,data) {
    var helper, alias1=container.escapeExpression;

  return "data-"
    + alias1(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"key","hash":{},"data":data}) : helper)))
    + "=\""
    + alias1(container.lambda(depth0, depth0))
    + "\"";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {};

  return "<script type=\"text/x-handlebars-template\">\n\n    <input type=\"text\" id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.placeholder : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.size : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.readonly : stack1),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.name : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers.each.call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.data : stack1),{"name":"each","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "/>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["web-edit"]["control"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {};

  return "        <label class=\""
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.labelClass : stack1),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " alpaca-control-label\" for=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">"
    + ((stack1 = container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.label : stack1), depth0)) != null ? stack1 : "")
    + "</label>\n";
},"2":function(container,depth0,helpers,partials,data) {
    var stack1;

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.labelClass : stack1), depth0));
},"4":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.compare || (depth0 && depth0.compare) || helpers.helperMissing).call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helpersPosition : stack1),"above",{"name":"compare","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"5":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helpers : stack1),{"name":"each","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"6":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "                    <p class=\""
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helperClass : stack1),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\">\n                        <i class=\"info-sign\"></i>\n                        "
    + ((stack1 = (helpers.showMessage || (depth0 && depth0.showMessage) || helpers.helperMissing).call(alias1,depth0,{"name":"showMessage","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                    </p>\n";
},"7":function(container,depth0,helpers,partials,data) {
    var stack1;

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helperClass : stack1), depth0));
},"9":function(container,depth0,helpers,partials,data) {
    return "";
},"11":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.compare || (depth0 && depth0.compare) || helpers.helperMissing).call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helpersPosition : stack1),"below",{"name":"compare","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"13":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.buttons : stack1),{"name":"if","hash":{},"fn":container.program(14, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"14":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "            <div class=\"alpaca-control-buttons-container\">\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.buttons : stack1),{"name":"each","hash":{},"fn":container.program(15, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "            </div>\n";
},"15":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                <button data-key=\""
    + alias4(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"key","hash":{},"data":data}) : helper)))
    + "\" type=\""
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + "\" class=\"alpaca-control-button alpaca-control-button-"
    + alias4(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"key","hash":{},"data":data}) : helper)))
    + " "
    + alias4(((helper = (helper = helpers.styles || (depth0 != null ? depth0.styles : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"styles","hash":{},"data":data}) : helper)))
    + "\" "
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.value : depth0),{"name":"each","hash":{},"fn":container.program(16, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">"
    + ((stack1 = ((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</button>\n";
},"16":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return alias4(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"key","hash":{},"data":data}) : helper)))
    + "=\""
    + alias4(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper)))
    + "\" ";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : {}, buffer = 
  "<script type=\"text/x-handlebars-template\">\n\n    <div>\n\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.label : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helpers : stack1),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n        ";
  stack1 = ((helper = (helper = helpers.control || (depth0 != null ? depth0.control : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"control","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(alias1,options) : helper));
  if (!helpers.control) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helpers : stack1),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.renderButtons : stack1),{"name":"if","hash":{},"fn":container.program(13, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n    </div>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["web-edit"]["form"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.buttons : stack1),{"name":"each","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"4":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                    <button data-key=\""
    + alias4(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"key","hash":{},"data":data}) : helper)))
    + "\" type=\""
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + "\" "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.id : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " class=\"alpaca-form-button alpaca-form-button-"
    + alias4(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"key","hash":{},"data":data}) : helper)))
    + " "
    + alias4(((helper = (helper = helpers.styles || (depth0 != null ? depth0.styles : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"styles","hash":{},"data":data}) : helper)))
    + "\" "
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.value : depth0),{"name":"each","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.attributes : depth0),{"name":"each","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">"
    + ((stack1 = ((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</button>\n";
},"5":function(container,depth0,helpers,partials,data) {
    var helper;

  return "id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"id","hash":{},"data":data}) : helper)))
    + "\"";
},"7":function(container,depth0,helpers,partials,data) {
    var helper, alias1=container.escapeExpression;

  return alias1(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"key","hash":{},"data":data}) : helper)))
    + "=\""
    + alias1(container.lambda(depth0, depth0))
    + "\"";
},"9":function(container,depth0,helpers,partials,data) {
    var helper, alias1=container.escapeExpression;

  return " "
    + alias1(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"key","hash":{},"data":data}) : helper)))
    + "=\""
    + alias1(container.lambda(depth0, depth0))
    + "\"";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : {}, buffer = 
  "<script type=\"text/x-handlebars-template\">\n\n    <form role=\"form\">\n\n        ";
  stack1 = ((helper = (helper = helpers.formItems || (depth0 != null ? depth0.formItems : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"formItems","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(alias1,options) : helper));
  if (!helpers.formItems) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n\n        <div class=\"alpaca-form-buttons-container\">\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.buttons : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n\n    </form>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["web-edit"]["message"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function";

  return "<script type=\"text/x-handlebars-template\">\n\n    <div class=\"alpaca-message alpaca-message-"
    + ((stack1 = ((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\">\n        "
    + ((stack1 = ((helper = (helper = helpers.message || (depth0 != null ? depth0.message : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"message","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n    </div>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["web-edit"]["wizard"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "        <div class=\"alpaca-wizard-nav\">\n            <nav class=\"navbar navbar-default\" role=\"navigation\">\n                <div class=\"container-fluid alpaca-wizard-back\">\n                    <ul class=\"nav navbar-nav\">\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.steps : depth0),{"name":"each","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                    </ul>\n                </div>\n            </nav>\n        </div>\n";
},"2":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function";

  return "                        <li data-alpaca-wizard-step-index=\""
    + container.escapeExpression(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">\n                            <div class=\"holder\">\n                                <div class=\"title\">"
    + ((stack1 = ((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</div>\n                                <div class=\"description\">"
    + ((stack1 = ((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"description","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</div>\n                            </div>\n                            <div class=\"chevron\"></div>\n                        </li>\n";
},"4":function(container,depth0,helpers,partials,data) {
    return "        <div class=\"alpaca-wizard-progress-bar\">\n            <div class=\"progress\">\n                <div class=\"progress-bar\" role=\"progressbar\" aria-valuenow=\"0\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 60%;\">\n                </div>\n            </div>\n        </div>\n";
},"6":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "            <h3>"
    + ((stack1 = ((helper = (helper = helpers.wizardTitle || (depth0 != null ? depth0.wizardTitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"wizardTitle","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</h3>\n";
},"8":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "            <h4>"
    + ((stack1 = ((helper = (helper = helpers.wizardDescription || (depth0 != null ? depth0.wizardDescription : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"wizardDescription","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</h4>\n";
},"10":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = (helpers.compare || (depth0 && depth0.compare) || helpers.helperMissing).call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.align : depth0),"left",{"name":"compare","hash":{},"fn":container.program(11, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"11":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                        <button type=\""
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + "\" "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.id : depth0),{"name":"if","hash":{},"fn":container.program(12, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " class=\""
    + alias4(container.lambda(((stack1 = ((stack1 = (depths[1] != null ? depths[1].view : depths[1])) != null ? stack1.styles : stack1)) != null ? stack1.button : stack1), depth0))
    + "\" data-alpaca-wizard-button-key=\""
    + alias4(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"key","hash":{},"data":data}) : helper)))
    + "\" "
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.attributes : depth0),{"name":"each","hash":{},"fn":container.program(14, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">"
    + ((stack1 = ((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</button>\n";
},"12":function(container,depth0,helpers,partials,data) {
    var helper;

  return "id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"id","hash":{},"data":data}) : helper)))
    + "\"";
},"14":function(container,depth0,helpers,partials,data) {
    var helper, alias1=container.escapeExpression;

  return " "
    + alias1(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"key","hash":{},"data":data}) : helper)))
    + "=\""
    + alias1(container.lambda(depth0, depth0))
    + "\"";
},"16":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = (helpers.compare || (depth0 && depth0.compare) || helpers.helperMissing).call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.align : depth0),"right",{"name":"compare","hash":{},"fn":container.program(11, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "<script type=\"text/x-handlebars-template\">\n\n    <div class=\"alpaca-wizard\">\n\n        <!-- nav bar -->\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.showSteps : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n        <!-- wizard progress bar -->\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.showProgressBar : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.wizardTitle : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.wizardDescription : depth0),{"name":"if","hash":{},"fn":container.program(8, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n        <!-- wizard steps -->\n        <div class=\"alpaca-wizard-steps\">\n\n        </div>\n\n        <!-- wizard buttons -->\n        <div class=\"alpaca-wizard-buttons\">\n\n            <div class=\"pull-left\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.buttons : depth0),{"name":"each","hash":{},"fn":container.program(10, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "            </div>\n\n            <div class=\"pull-right\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.buttons : depth0),{"name":"each","hash":{},"fn":container.program(16, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "            </div>\n\n            <div style=\"clear:both\"></div>\n\n        </div>\n\n    </div>\n\n</script>";
},"useData":true,"useDepths":true});
this["HandlebarsPrecompiled"]["jquerymobile-display"] = this["HandlebarsPrecompiled"]["jquerymobile-display"] || {};
this["HandlebarsPrecompiled"]["jquerymobile-display"]["container"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "true";
},"3":function(container,depth0,helpers,partials,data) {
    return "false";
},"5":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {};

  return "        <legend for=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\""
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.labelClass : stack1),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\">"
    + ((stack1 = container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.label : stack1), depth0)) != null ? stack1 : "")
    + "</legend>\n";
},"6":function(container,depth0,helpers,partials,data) {
    var stack1;

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.labelClass : stack1), depth0));
},"8":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helpers : stack1),{"name":"each","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"9":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "        <h3 class=\""
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helperClass : stack1),{"name":"if","hash":{},"fn":container.program(10, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\">\n            "
    + ((stack1 = (helpers.showMessage || (depth0 && depth0.showMessage) || helpers.helperMissing).call(alias1,depth0,{"name":"showMessage","hash":{},"fn":container.program(12, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n        </h3>\n";
},"10":function(container,depth0,helpers,partials,data) {
    var stack1;

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helperClass : stack1), depth0));
},"12":function(container,depth0,helpers,partials,data) {
    return "";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {};

  return "<script type=\"text/x-handlebars-template\">\n\n    <fieldset data-role=\"collapsible\" id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" data-collapsed=\""
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.collapsed : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "\">\n\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.label : stack1),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helpers : stack1),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n        <div data-role=\"controlgroup\" class=\"alpaca-fieldset-items-container\">\n\n        </div>\n\n    </fieldset>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["jquerymobile-display"]["control"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "            <h4>"
    + ((stack1 = container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.label : stack1), depth0)) != null ? stack1 : "")
    + "</h4>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {};

  return "<script type=\"text/x-handlebars-template\">\n\n    <ul data-role=\"listview\">\n        <li>\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.label : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            <p>\n                <strong>"
    + ((stack1 = ((helper = (helper = helpers.data || (depth0 != null ? depth0.data : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"data","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</strong>\n            </p>\n        </li>\n    </ul>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["jquerymobile-edit"] = this["HandlebarsPrecompiled"]["jquerymobile-edit"] || {};
this["HandlebarsPrecompiled"]["jquerymobile-edit"]["container-array"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return " btn-group";
},"3":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing;

  return "\n"
    + ((stack1 = (helpers.compare || (depth0 && depth0.compare) || alias2).call(alias1,((stack1 = (depths[1] != null ? depths[1].options : depths[1])) != null ? stack1.toolbarStyle : stack1),"link",{"name":"compare","hash":{},"fn":container.program(4, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = (helpers.compare || (depth0 && depth0.compare) || alias2).call(alias1,((stack1 = (depths[1] != null ? depths[1].options : depths[1])) != null ? stack1.toolbarStyle : stack1),"button",{"name":"compare","hash":{},"fn":container.program(6, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function";

  return "                    <a href=\"#\" class=\"alpaca-array-toolbar-action\" data-array-toolbar-action=\""
    + container.escapeExpression(((helper = (helper = helpers.action || (depth0 != null ? depth0.action : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"action","hash":{},"data":data}) : helper)))
    + "\">"
    + ((stack1 = ((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</a>\n";
},"6":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=container.escapeExpression, alias2=depth0 != null ? depth0 : {};

  return "                    <button class=\"alpaca-array-toolbar-action btn "
    + alias1(container.lambda(((stack1 = ((stack1 = (depths[1] != null ? depths[1].view : depths[1])) != null ? stack1.styles : stack1)) != null ? stack1.button : stack1), depth0))
    + "\" data-array-toolbar-action=\""
    + alias1(((helper = (helper = helpers.action || (depth0 != null ? depth0.action : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias2,{"name":"action","hash":{},"data":data}) : helper)))
    + "\">\n"
    + ((stack1 = helpers["if"].call(alias2,(depth0 != null ? depth0.iconClass : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                        "
    + ((stack1 = helpers["if"].call(alias2,(depth0 != null ? depth0.label : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                    </button>\n";
},"7":function(container,depth0,helpers,partials,data) {
    var helper;

  return "                        <i class=\""
    + container.escapeExpression(((helper = (helper = helpers.iconClass || (depth0 != null ? depth0.iconClass : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"iconClass","hash":{},"data":data}) : helper)))
    + "\"></i>\n";
},"9":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return ((stack1 = ((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"label","hash":{},"data":data}) : helper))) != null ? stack1 : "");
},"11":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : {}, buffer = 
  "\n        <div>\n\n            <div class=\"alpaca-array-item-actions btn-group\">\n"
    + ((stack1 = helpers.each.call(alias1,(depths[1] != null ? depths[1].arrayItemActions : depths[1]),{"name":"each","hash":{},"fn":container.program(12, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "            </div>\n\n            ";
  stack1 = ((helper = (helper = helpers.item || (depth0 != null ? depth0.item : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"item","hash":{},"fn":container.program(15, data, 0, blockParams, depths),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(alias1,options) : helper));
  if (!helpers.item) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n\n        </div>\n\n";
},"12":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=container.escapeExpression, alias2=depth0 != null ? depth0 : {};

  return "                <button class=\"alpaca-array-item-action "
    + alias1(container.lambda(((stack1 = ((stack1 = (depths[1] != null ? depths[1].view : depths[1])) != null ? stack1.styles : stack1)) != null ? stack1.button : stack1), depth0))
    + "\" data-array-item-action=\""
    + alias1(((helper = (helper = helpers.action || (depth0 != null ? depth0.action : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias2,{"name":"action","hash":{},"data":data}) : helper)))
    + "\">\n"
    + ((stack1 = helpers["if"].call(alias2,(depth0 != null ? depth0.iconClass : depth0),{"name":"if","hash":{},"fn":container.program(13, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                    "
    + ((stack1 = helpers["if"].call(alias2,(depth0 != null ? depth0.label : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                </button>\n";
},"13":function(container,depth0,helpers,partials,data) {
    var helper;

  return "                    <i class=\""
    + container.escapeExpression(((helper = (helper = helpers.iconClass || (depth0 != null ? depth0.iconClass : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"iconClass","hash":{},"data":data}) : helper)))
    + "\"></i>\n";
},"15":function(container,depth0,helpers,partials,data) {
    return "";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "<script type=\"text/x-handlebars-template\">\n\n    <div>\n\n        <div class=\"alpaca-array-toolbar\" "
    + ((stack1 = (helpers.compare || (depth0 && depth0.compare) || helpers.helperMissing).call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.toolbarStyle : stack1),"button",{"name":"compare","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">\n\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.arrayToolbarActions : depth0),{"name":"each","hash":{},"fn":container.program(3, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n        </div>\n\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.items : depth0),{"name":"each","hash":{},"fn":container.program(11, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n    </div>\n\n</script>";
},"useData":true,"useDepths":true});
this["HandlebarsPrecompiled"]["jquerymobile-edit"]["container-grid"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return " btn-group";
},"3":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing;

  return "\n"
    + ((stack1 = (helpers.compare || (depth0 && depth0.compare) || alias2).call(alias1,((stack1 = (depths[1] != null ? depths[1].options : depths[1])) != null ? stack1.toolbarStyle : stack1),"link",{"name":"compare","hash":{},"fn":container.program(4, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = (helpers.compare || (depth0 && depth0.compare) || alias2).call(alias1,((stack1 = (depths[1] != null ? depths[1].options : depths[1])) != null ? stack1.toolbarStyle : stack1),"button",{"name":"compare","hash":{},"fn":container.program(6, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function";

  return "                <a href=\"#\" class=\"alpaca-array-toolbar-action\" data-array-toolbar-action=\""
    + container.escapeExpression(((helper = (helper = helpers.action || (depth0 != null ? depth0.action : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"action","hash":{},"data":data}) : helper)))
    + "\">"
    + ((stack1 = ((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</a>\n";
},"6":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=container.escapeExpression, alias2=depth0 != null ? depth0 : {};

  return "                <button class=\"alpaca-array-toolbar-action btn "
    + alias1(container.lambda(((stack1 = ((stack1 = (depths[1] != null ? depths[1].view : depths[1])) != null ? stack1.styles : stack1)) != null ? stack1.button : stack1), depth0))
    + "\" data-array-toolbar-action=\""
    + alias1(((helper = (helper = helpers.action || (depth0 != null ? depth0.action : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias2,{"name":"action","hash":{},"data":data}) : helper)))
    + "\">\n"
    + ((stack1 = helpers["if"].call(alias2,(depth0 != null ? depth0.iconClass : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                    "
    + ((stack1 = helpers["if"].call(alias2,(depth0 != null ? depth0.label : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                </button>\n";
},"7":function(container,depth0,helpers,partials,data) {
    var helper;

  return "                    <i class=\""
    + container.escapeExpression(((helper = (helper = helpers.iconClass || (depth0 != null ? depth0.iconClass : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"iconClass","hash":{},"data":data}) : helper)))
    + "\"></i>\n";
},"9":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return ((stack1 = ((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"label","hash":{},"data":data}) : helper))) != null ? stack1 : "");
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "<script type=\"text/x-handlebars-template\">\n\n    <div>\n\n        <div class=\"alpaca-array-toolbar\" "
    + ((stack1 = (helpers.compare || (depth0 && depth0.compare) || helpers.helperMissing).call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.toolbarStyle : stack1),"button",{"name":"compare","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">\n\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.arrayToolbarActions : depth0),{"name":"each","hash":{},"fn":container.program(3, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n        </div>\n\n        <div class=\"alpaca-container-grid-holder\"></div>\n\n    </div>\n\n</script>";
},"useData":true,"useDepths":true});
this["HandlebarsPrecompiled"]["jquerymobile-edit"]["container-object"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, buffer = 
  "\n            <div class=\"fieldcontainer\">\n\n                ";
  stack1 = ((helper = (helper = helpers.item || (depth0 != null ? depth0.item : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"item","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},options) : helper));
  if (!helpers.item) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n\n            </div>\n            <br/>\n\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<script type=\"text/x-handlebars-template\">\n\n    <div>\n\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.items : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n    </div>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["jquerymobile-edit"]["container-table"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return " btn-group";
},"3":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing;

  return "\n"
    + ((stack1 = (helpers.compare || (depth0 && depth0.compare) || alias2).call(alias1,((stack1 = (depths[1] != null ? depths[1].options : depths[1])) != null ? stack1.toolbarStyle : stack1),"link",{"name":"compare","hash":{},"fn":container.program(4, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = (helpers.compare || (depth0 && depth0.compare) || alias2).call(alias1,((stack1 = (depths[1] != null ? depths[1].options : depths[1])) != null ? stack1.toolbarStyle : stack1),"button",{"name":"compare","hash":{},"fn":container.program(6, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function";

  return "            <a href=\"#\" class=\"alpaca-array-toolbar-action\" data-array-toolbar-action=\""
    + container.escapeExpression(((helper = (helper = helpers.action || (depth0 != null ? depth0.action : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"action","hash":{},"data":data}) : helper)))
    + "\">"
    + ((stack1 = ((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</a>\n";
},"6":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=container.escapeExpression, alias2=depth0 != null ? depth0 : {};

  return "            <button class=\"alpaca-array-toolbar-action btn "
    + alias1(container.lambda(((stack1 = ((stack1 = (depths[1] != null ? depths[1].view : depths[1])) != null ? stack1.styles : stack1)) != null ? stack1.button : stack1), depth0))
    + "\" data-array-toolbar-action=\""
    + alias1(((helper = (helper = helpers.action || (depth0 != null ? depth0.action : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias2,{"name":"action","hash":{},"data":data}) : helper)))
    + "\">\n"
    + ((stack1 = helpers["if"].call(alias2,(depth0 != null ? depth0.iconClass : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                "
    + ((stack1 = helpers["if"].call(alias2,(depth0 != null ? depth0.label : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            </button>\n";
},"7":function(container,depth0,helpers,partials,data) {
    var helper;

  return "                <i class=\""
    + container.escapeExpression(((helper = (helper = helpers.iconClass || (depth0 != null ? depth0.iconClass : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"iconClass","hash":{},"data":data}) : helper)))
    + "\"></i>\n";
},"9":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return ((stack1 = ((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"label","hash":{},"data":data}) : helper))) != null ? stack1 : "");
},"11":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "                    <th>"
    + ((stack1 = ((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"label","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</th>\n";
},"13":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "                <tr>\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.data : depth0),{"name":"each","hash":{},"fn":container.program(14, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                    <!-- actions cell -->\n                    <td>\n                        <div class=\"alpaca-array-item-actions btn-group\">\n"
    + ((stack1 = helpers.each.call(alias1,(depths[1] != null ? depths[1].arrayItemActions : depths[1]),{"name":"each","hash":{},"fn":container.program(16, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                        </div>\n                    </td>\n                </tr>\n";
},"14":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                    <td>"
    + ((stack1 = container.lambda(depth0, depth0)) != null ? stack1 : "")
    + "</td>\n";
},"16":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=container.escapeExpression, alias2=depth0 != null ? depth0 : {};

  return "                            <button class=\"alpaca-array-item-action "
    + alias1(container.lambda(((stack1 = ((stack1 = (depths[2] != null ? depths[2].view : depths[2])) != null ? stack1.styles : stack1)) != null ? stack1.button : stack1), depth0))
    + "\" data-array-item-action=\""
    + alias1(((helper = (helper = helpers.action || (depth0 != null ? depth0.action : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias2,{"name":"action","hash":{},"data":data}) : helper)))
    + "\">\n"
    + ((stack1 = helpers["if"].call(alias2,(depth0 != null ? depth0.iconClass : depth0),{"name":"if","hash":{},"fn":container.program(17, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                "
    + ((stack1 = helpers["if"].call(alias2,(depth0 != null ? depth0.label : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                            </button>\n";
},"17":function(container,depth0,helpers,partials,data) {
    var helper;

  return "                                <i class=\""
    + container.escapeExpression(((helper = (helper = helpers.iconClass || (depth0 != null ? depth0.iconClass : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"iconClass","hash":{},"data":data}) : helper)))
    + "\"></i>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "<script type=\"text/x-handlebars-template\">\n\n    <div>\n\n        <div class=\"alpaca-array-toolbar\" "
    + ((stack1 = (helpers.compare || (depth0 && depth0.compare) || helpers.helperMissing).call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.toolbarStyle : stack1),"button",{"name":"compare","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">\n\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.arrayToolbarActions : depth0),{"name":"each","hash":{},"fn":container.program(3, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n        </div>\n\n        <table>\n\n            <!-- table headers -->\n            <thead>\n                <tr>\n"
    + ((stack1 = helpers.each.call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.fields : stack1),{"name":"each","hash":{},"fn":container.program(11, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                    <th>Actions</th>\n                </tr>\n            </thead>\n\n            <!-- table body -->\n            <tbody>\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.items : depth0),{"name":"each","hash":{},"fn":container.program(13, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "            </tbody>\n\n        </table>\n    </div>\n\n</script>";
},"useData":true,"useDepths":true});
this["HandlebarsPrecompiled"]["jquerymobile-edit"]["container"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "            <h3 "
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.labelClass : stack1),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">"
    + ((stack1 = container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.label : stack1), depth0)) != null ? stack1 : "")
    + "</h3>\n";
},"2":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "class=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.labelClass : stack1), depth0))
    + "\"";
},"4":function(container,depth0,helpers,partials,data) {
    return "";
},"6":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helpers : stack1),{"name":"each","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"7":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "            <input type=\"image\" data-icon=\"icon-info\">\n            <small class=\""
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helperClass : stack1),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\">\n                "
    + ((stack1 = (helpers.showMessage || (depth0 && depth0.showMessage) || helpers.helperMissing).call(alias1,depth0,{"name":"showMessage","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            </small>\n";
},"8":function(container,depth0,helpers,partials,data) {
    var stack1;

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helperClass : stack1), depth0));
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : {}, buffer = 
  "<script type=\"text/x-handlebars-template\">\n\n    <div class=\"ui-field-contain\">\n        <div class=\"ui-body ui-body-a ui-corner-all\">\n\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.label : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            ";
  stack1 = ((helper = (helper = helpers.container || (depth0 != null ? depth0.container : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"container","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(alias1,options) : helper));
  if (!helpers.container) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helpers : stack1),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n        </div>\n    </div>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["jquerymobile-edit"]["control-checkbox"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return "\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.checkboxOptions : depth0),{"name":"each","hash":{},"fn":container.program(2, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n";
},"2":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                <input type=\"checkbox\" name=\""
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\" id=\""
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "-"
    + alias4(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" data-checkbox-index=\""
    + alias4(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" data-checkbox-value=\""
    + alias4(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper)))
    + "\" "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depths[2] != null ? depths[2].options : depths[2])) != null ? stack1.readonly : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers.each.call(alias1,((stack1 = (depths[2] != null ? depths[2].options : depths[2])) != null ? stack1.data : stack1),{"name":"each","hash":{},"fn":container.program(5, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">\n                <label for=\""
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\"-"
    + alias4(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"index","hash":{},"data":data}) : helper)))
    + ">"
    + ((stack1 = container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.rightLabel : stack1), depth0)) != null ? stack1 : "")
    + "</label>\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "readonly=\"readonly\"";
},"5":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "data-"
    + alias4(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"key","hash":{},"data":data}) : helper)))
    + "=\""
    + alias4(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper)))
    + "\"";
},"7":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "            <input type=\"checkbox\" name=\""
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\" id=\""
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\" "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.readonly : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers.each.call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.data : stack1),{"name":"each","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">\n            <label for=\""
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\">\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.rightLabel : stack1),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.program(10, data, 0),"data":data})) != null ? stack1 : "")
    + "            </label>\n";
},"8":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                    "
    + ((stack1 = container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.rightLabel : stack1), depth0)) != null ? stack1 : "")
    + "\n";
},"10":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                    "
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.label : stack1), depth0))
    + "\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return "<script type=\"text/x-handlebars-template\">\n\n    <fieldset data-role=\"controlgroup\">\n\n"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.multiple : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.program(7, data, 0, blockParams, depths),"data":data})) != null ? stack1 : "")
    + "\n    </fieldset>\n\n</script>\n";
},"useData":true,"useDepths":true});
this["HandlebarsPrecompiled"]["jquerymobile-edit"]["control-radio"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "        <input type=\"radio\" name=\""
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\" id=\""
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "-none\" value=\"\" checked=\"checked\" "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.readonly : stack1),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">\n        <label for=\""
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "-none\">"
    + ((stack1 = container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.noneLabel : stack1), depth0)) != null ? stack1 : "")
    + "</label>\n";
},"4":function(container,depth0,helpers,partials,data) {
    return "readonly=\"readonly\"";
},"6":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : {}, alias4=helpers.helperMissing, alias5="function";

  return "        <input type=\"radio\" name=\""
    + alias2(alias1((depths[1] != null ? depths[1].name : depths[1]), depth0))
    + "\" id=\""
    + alias2(alias1((depths[1] != null ? depths[1].name : depths[1]), depth0))
    + "-"
    + alias2(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" value=\""
    + alias2(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"value","hash":{},"data":data}) : helper)))
    + "\" checked=\"checked\" "
    + ((stack1 = helpers["if"].call(alias3,((stack1 = (depths[1] != null ? depths[1].options : depths[1])) != null ? stack1.readonly : stack1),{"name":"if","hash":{},"fn":container.program(4, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = (helpers.compare || (depth0 && depth0.compare) || alias4).call(alias3,(depth0 != null ? depth0.value : depth0),(depths[1] != null ? depths[1].data : depths[1]),{"name":"compare","hash":{},"fn":container.program(7, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">\n        <label for=\""
    + alias2(alias1((depths[1] != null ? depths[1].name : depths[1]), depth0))
    + "-"
    + alias2(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + ((stack1 = ((helper = (helper = helpers.text || (depth0 != null ? depth0.text : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"text","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</label>\n";
},"7":function(container,depth0,helpers,partials,data) {
    return "checked=\"checked\"";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "<script type=\"text/x-handlebars-template\">\n\n    <fieldset data-role=\"controlgroup\">\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.hideNone : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.program(3, data, 0, blockParams, depths),"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.selectOptions : depth0),{"name":"each","hash":{},"fn":container.program(6, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </fieldset>\n\n</script>";
},"useData":true,"useDepths":true});
this["HandlebarsPrecompiled"]["jquerymobile-edit"]["control"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {};

  return "        <label class=\""
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.labelClass : stack1),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " alpaca-control-label\" for=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">"
    + ((stack1 = container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.label : stack1), depth0)) != null ? stack1 : "")
    + "</label>\n";
},"2":function(container,depth0,helpers,partials,data) {
    var stack1;

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.labelClass : stack1), depth0));
},"4":function(container,depth0,helpers,partials,data) {
    return "";
},"6":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helpers : stack1),{"name":"each","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"7":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "        <small class=\"alpaca-helper "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helperClass : stack1),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\">\n            "
    + ((stack1 = (helpers.showMessage || (depth0 && depth0.showMessage) || helpers.helperMissing).call(alias1,depth0,{"name":"showMessage","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n        </small>\n";
},"8":function(container,depth0,helpers,partials,data) {
    var stack1;

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helperClass : stack1), depth0));
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : {}, buffer = 
  "<script type=\"text/x-handlebars-template\">\n\n    <div data-role=\"fieldcontainer\">\n\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.label : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n        ";
  stack1 = ((helper = (helper = helpers.control || (depth0 != null ? depth0.control : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"control","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(alias1,options) : helper));
  if (!helpers.control) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helpers : stack1),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n    </div>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["jquerymobile-edit"]["message"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helperClass : stack1), depth0));
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function";

  return "<script type=\"text/x-handlebars-template\">\n\n    <div class=\"fieldcontainer\">\n        <div class=\"alpaca-message alpaca-message-"
    + ((stack1 = ((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\">\n            <small class=\"alpaca-helper "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helperClass : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\">\n                "
    + ((stack1 = ((helper = (helper = helpers.message || (depth0 != null ? depth0.message : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"message","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n            </small>\n        </div>\n    </div>\n\n</script>";
},"useData":true});