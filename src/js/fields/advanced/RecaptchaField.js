requirejs(['alpaca'], function(alpaca) {
  
  console.log("SWF RECAPTCHA FIELD LOADING");

  /*

  This plugin requires that Google's Recaptcha library (https://www.google.com/recaptcha/intro/index.html)
  be loaded on the page and that these configuration variables are available:

  alpacaRecaptchaSiteKey (populated with Google's Recaptcha Site Key)

  This Alpaca field is only effective if coupled with a server side check of the submitted recaptcha value.
  
  This field is associated with the json schema format "recaptchafield", if using this Alpaca field via the format
  association and validation json schema data server side you will need to create a custom validator.

   */
  
  var Alpaca = $.alpaca;
  
  var fieldTypeName = "recaptchafield";
  var fieldObjectName = "RecaptchaField";
  
  console.log("About to register: " + fieldObjectName);
  
  var customField = $.alpaca.Fields.TextField.extend({
    
    getFieldType: function() {
      //overridable methods found in alpaca/src/js/Field.js
      return fieldTypeName;
    },
  
    handleValidate: function() {
      var baseStatus = this.base();
      var valInfo = this.validation;
      
      var self = this;
      var val = this.getValue();
      console.log("Native validator:", val);
  
      var message = "This is required";
      var valid = false;
      if (val && val.length > 0) {
        console.log
        valid = true;
        message = "";
      }

      var result = {
        "status": valid,
        "message": message
      }
      
      console.log("Native Recaptcha Validator Result: " + valid, result);

      return result;
    },
    
    afterRenderControl: function(model, callback) {
      var self = this;
    
      this.base(model, function() {
        console.log(fieldObjectName + " - afterRenderControl");
      
        self.on("ready", function() {
          console.log(fieldObjectName + " - self ready");
        
          if (!self.isDisplayOnly() && self.control) {
            console.log(fieldObjectName + " - afterRenderControl - NOT Read Only");
            var textField = $(self.control);
            textField.hide();
            textField.addClass('swfRecaptchaInput');
          
            var recaptchaTarget = $('<div class="swfRecaptchaTarget"></div>');
            textField.after(recaptchaTarget);
          
            if (!alpacaRecaptchaSiteKey) {
              console.log("Error retrieving alpacaRecaptchaSiteKey. Recaptcha will not be processed correctly");
              recaptchaTarget.html('Error, see console');
            } else if (!self.isRequired()) {
              console.log("Error recaptcha fields must be required! Form definition needs to be fixed");
              recaptchaTarget.html('Error, see console');
            } else {
              grecaptcha.render(
                recaptchaTarget.get()[0],
                {
                  sitekey: alpacaRecaptchaSiteKey,
                  theme: "light",
                  callback: function(response) {
                    console.log("Received recaptcha response:");
                    //textField.val(response);
                    self.setValue(response);
                    //console.log("Revalidated recaptcha field");
                  }
                }
              )
            }
          } else { //Read Only
            console.log(fieldObjectName + " - afterRenderControl - Read Only");
            $(self.field).hide();
          }
        });
      
        callback();
      });
    }
  });
  
  $.alpaca.Fields[fieldObjectName] = customField;
  Alpaca.registerFieldClass(fieldTypeName, Alpaca.Fields[fieldObjectName]);
  
  //associates this with a schema format:
  Alpaca.registerDefaultFormatFieldMapping(fieldTypeName, fieldTypeName);
  //When used with a server side json schema validator you will need to create a validator for the custom
  //format: "recaptchafield"
  
});
