(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.UploadField = Alpaca.ControlField.extend(
    /**
     * @lends Alpaca.Fields.UploadField.prototype
     */
    {
        /**
         * @constructs
         * @augments Alpaca.Fields.ControlField
         *
         * @class File upload control that can be mounted on top of "object" or "array" types.
         *
         * @param {Object} container Field container.
         * @param {Any} data Field data.
         * @param {Object} options Field options.
         * @param {Object} schema Field schema.
         * @param {Object|String} view Field view.
         * @param {Alpaca.Connector} connector Field connector.
         */
        constructor: function(container, data, options, schema, view, connector)
        {
            var self = this;

            this.base(container, data, options, schema, view, connector);

            this.isArrayType = function() {
                return self.schema.type === "array";
            };

            this.isObjectType = function() {
                return self.schema.type === "object";
            };

            // wraps an existing template descriptor into a method that looks like fn(model)
            // this is compatible with the requirements of fileinput
            // config looks like
            //    {
            //       "files": [],
            //       "formatFileSize": fn,
            //       "options": {}
            //    }
            //

            this.wrapTemplate = function(templateId)
            {
                return function(config) {

                    var files = config.files;
                    var formatFileSize = config.formatFileSize;
                    var options = config.options;

                    var rows = [];
                    for (var i = 0; i < files.length; i++)
                    {
                        var model = {};
                        model.options = self.options;
                        model.file = Alpaca.cloneObject(files[i]);
                        model.size = formatFileSize(model.size);
                        model.buttons = self.options.buttons;
                        model.view = self.view;
                        model.fileIndex = i;

                        var row = Alpaca.tmpl(self.view.getTemplateDescriptor(templateId), model, self);

                        rows.push(row[0]);
                    }

                    rows = $(rows);
                    $(rows).each(function() {

                        if (options.fileupload && options.fileupload.autoUpload)
                        {
                            // disable start button
                            $(this).find("button.start").css("display", "none");
                        }

                        self.handleWrapRow(this, options);

                        // this event gets fired when fileimpl has cleaned up the DOM element
                        // we handle Ajax related stuff on our own here
                        //$(this).find("button.delete").on("destroyed", function() {
                        $(this).find("button.delete").on("click", function() {

                            var button = $(row).find("button.delete");

                            var fileIndex = $(button).attr("data-file-index");
                            var file = files[fileIndex];

                            self.onFileDelete.call(self, row, button, file);

                            // remove from files
                            if (self.isArrayType())
                            {
                                var array = self.getValueAsArray();
                                array.splice(fileIndex, 1);
                                self.setValueAsArray(array);
                            }
                            else if (self.isObjectType())
                            {
                                self.setValueAsArray([]);
                            }

                            self.triggerWithPropagation("change");
                            setTimeout(function() {
                                self.refreshUIState();
                            }, 200);
                        });
                    });

                    return $(rows);
                };
            };
        },

        /**
         * @see Alpaca.ControlField#getFieldType
         */
        getFieldType: function() {
            return "upload";
        },

        /**
         * @see Alpaca.Fields.TextField#setup
         */
        setup: function()
        {
            var self = this;

            this.base();

            // disable bottom control buttons (we have a conflict over the 'buttons' namespace)
            self.options.renderButtons = false;

            if (!self.options.buttons)
            {
                self.options.buttons = [];
            }

            if (!self.options.hideDeleteButton)
            {
                self.options.buttons.push({
                    "key": "delete",
                    "isDelete": true
                });
            }

            if (typeof(self.options.showUploadPreview) === "undefined")
            {
                self.options.showUploadPreview = true;
            }

            if (typeof(self.options.showHeaders) === "undefined")
            {
                self.options.showHeaders = true;
            }

            if (!self.data)
            {
                self.data = [];
            }

            // convert to array if not array already
            if (self.data && Alpaca.isObject(self.data)) {
                self.data = [self.data];
            }

            // upload
            if (!self.options.upload)
            {
                self.options.upload = {};
            }

            // support copying back the maxNumberOfFiles from the upload plugin's settings
            if (typeof(self.options.maxNumberOfFiles) === "undefined")
            {
                if (typeof(self.options.upload.maxNumberOfFiles) !== "undefined")
                {
                    self.options.maxNumberOfFiles = self.options.upload.maxNumberOfFiles;
                }
            }

            // figure out reasonable maxNumberOfFiles
            if (typeof(self.options.maxNumberOfFiles) === "undefined")
            {
                self.options.maxNumberOfFiles = 1;
                if (self.isArrayType())
                {
                    self.options.maxNumberOfFiles = -1;
                }
            }

            // safe guard
            if (self.isObjectType()) {
                self.options.maxNumberOfFiles = 1;
            }

            if (self.options.multiple === false)
            {
                self.options.maxNumberOfFiles = 1;
            }

            if (self.options.maxNumberOfFiles > 1 || self.options.maxNumberOfFiles === -1)
            {
                self.options.multiple = true;
            }

            // copy setting into upload plugin config
            self.options.upload.maxNumberOfFiles = 9999;
            if (self.options.maxNumberOfFiles > 0)
            {
                self.options.upload.maxNumberOfFiles = self.options.maxNumberOfFiles;
            }

            // max file size
            if (typeof(self.options.maxFileSize) === "undefined")
            {
                if (self.options.upload.maxFileSize)
                {
                    self.options.maxFileSize = self.options.upload.maxFileSize;
                }
                else
                {
                    self.options.maxFileSize = -1; // no limit
                }

                // copy setting into upload
                if (self.options.maxFileSize)
                {
                    self.options.upload.maxFileSize = self.options.maxFileSize;
                }
            }

            // file types
            if (typeof(self.options.fileTypes) === "undefined")
            {
                if (self.options.upload.acceptFileTypes)
                {
                    self.options.fileTypes = self.options.upload.acceptFileTypes;
                }
                else
                {
                    self.options.fileTypes = null; // no restrictions
                }

                // copy setting into upload
                if (self.options.fileTypes)
                {
                    self.options.upload.acceptFileTypes = self.options.fileTypes;
                }
            }

            // error handler
            if (!self.options.errorHandler)
            {
                self.options.errorHandler = function(messages)
                {
                    alert(messages.join("\n"));
                };
            }

            // if Alpaca is configured for CSRF support and a CSRF cookie or token is available,
            // then apply it to the headers that are sent over the wire via the underlying ajax
            // for the file upload control

            // if we have a CSRF token, apply it to the headers
            var csrfToken = self.determineCsrfToken();
            if (csrfToken)
            {
                if (!self.options.upload) {
                    self.options.upload = {};
                }

                if (!self.options.upload.headers) {
                    self.options.upload.headers = {};
                }

                self.options.upload.headers[Alpaca.CSRF_HEADER_NAME] = csrfToken;
            }
        },

        determineCsrfToken: function()
        {
            // is there a direct token specified?
            var csrfToken = Alpaca.CSRF_TOKEN;
            if (!csrfToken)
            {
                // is there a cookie that we can pull the value from?
                for (var t = 0; t < Alpaca.CSRF_COOKIE_NAMES.length; t++)
                {
                    var cookieName = Alpaca.CSRF_COOKIE_NAMES[t];

                    var cookieValue = Alpaca.readCookie(cookieName);
                    if (cookieValue)
                    {
                        csrfToken = cookieValue;
                        break;
                    }
                }
            }

            return csrfToken;
        },

        prepareControlModel: function(callback)
        {
            var self = this;

            self.base(function(model) {

                model.chooseButtonLabel = self.options.chooseButtonLabel;
                if (!model.chooseButtonLabel)
                {
                    model.chooseButtonLabel = self.getMessage("chooseFiles");
                    if (self.options.maxNumberOfFiles === 1)
                    {
                        model.chooseButtonLabel = self.getMessage("chooseFile");
                    }
                }

                model.dropZoneMessage = self.options.dropZoneMessage;
                if (!model.dropZoneMessage)
                {
                    model.dropZoneMessage = self.getMessage("dropZoneMultiple");
                    if (model.options.maxNumberOfFiles === 1)
                    {
                        model.dropZoneMessage = self.getMessage("dropZoneSingle");
                    }

                    if (model.options.directory)
                    {
                        model.dropZoneMessage = self.getMessage("dropZoneMultipleDirectory");
                    }
                }

                model.selectFromExistingMessage = self.options.selectFromExistingMessage;
                if (!model.selectFromExistingMessage)
                {
                    model.selectFromExistingMessage = self.getMessage("selectFromExistingMultiple");
                    if (model.options.maxNumberOfFiles === 1)
                    {
                        model.selectFromExistingMessage = self.getMessage("selectFromExistingSingle");
                    }
                }

                callback(model);
            });
        },

        afterRenderControl: function(model, callback)
        {
            var self = this;

            this.base(model, function() {

                self.handlePostRender(function() {

                    // if we're in display-only mode, we hide a bunch of things
                    if (self.isDisplayOnly())
                    {
                        $(self.control).find("button").hide();
                        $(self.control).find(".btn").hide();
                        $(self.control).find(".alpaca-fileupload-chooserow").hide();
                        $(self.control).find(".dropzone-message").hide();
                    }

                    callback();
                });

            });
        },

        /**
         * Gets the upload template.
         */
        getUploadTemplate: function() {
            return this.wrapTemplate("control-upload-partial-upload");
        },

        /**
         * Gets the download template.
         */
        getDownloadTemplate: function() {
            return this.wrapTemplate("control-upload-partial-download");
        },

        /**
         * Extension point for modifying the data ahead of an upload submit.
         *
         * @param data
         */
        handleBeforeFileUploadSubmit: function(data)
        {

        },

        handlePostRender: function(callback)
        {
            var self = this;

            var el = this.control;

            // file upload config
            var fileUploadConfig = {};

            // defaults
            fileUploadConfig["dataType"] = "json";
            fileUploadConfig["uploadTemplateId"] = null;
            fileUploadConfig["uploadTemplate"] = this.getUploadTemplate();
            fileUploadConfig["downloadTemplateId"] = null;
            fileUploadConfig["downloadTemplate"] = this.getDownloadTemplate();
            fileUploadConfig["filesContainer"] = $(el).find(".files");
            fileUploadConfig["dropZone"] = $(el).find(".fileupload-active-zone");
            fileUploadConfig["url"] = "/";
            fileUploadConfig["method"] = "post";
            fileUploadConfig["showUploadPreview"] = self.options.showUploadPreview;

            if (self.options.upload)
            {
                for (var k in self.options.upload)
                {
                    fileUploadConfig[k] = self.options.upload[k];
                }
            }

            if (self.options.multiple)
            {
                $(el).find(".alpaca-fileupload-input").attr("multiple", true);
            }

            if (self.options.directory)
            {
                $(el).find(".alpaca-fileupload-input").attr("directory", true);
                //$(el).find(".alpaca-fileupload-input").attr("webkitdirectory", true);
            }

            if (self.options.name)
            {
                $(el).find(".alpaca-fileupload-input").attr("name", self.options.name);
            }

            // hide the progress bar at first
            $(el).find(".progress").css("display", "none");

            /**
             * If a file is being uploaded, show the progress bar.  Otherwise, hide it.
             *
             * @param e
             * @param data
             */
            if (self.options.progressall) {
                fileUploadConfig["progressall"] = self.options.progressall;
            }
            else {
                fileUploadConfig["progressall"] = function (e, data) {

                    var showProgressBar = false;
                    if (data.loaded < data.total)
                    {
                        showProgressBar = true;
                    }
                    if (showProgressBar)
                    {
                        $(el).find(".progress").css("display", "block");
                        var progress = parseInt(data.loaded / data.total * 100, 10);
                        $('#progress .progress-bar').css(
                            'width',
                            progress + '%'
                        );
                    }
                    else
                    {
                        $(el).find(".progress").css("display", "none");
                    }
                };
            }

            // some limit checks
            fileUploadConfig["add"] = function(e, data) {

                var uploadErrors = [];

                var i = 0;
                do
                {
                    var bad = false;

                    if (i < data.files.length)
                    {
                        // file types
                        if (self.options.fileTypes)
                        {
                            var re = self.options.fileTypes;
                            if (typeof(self.options.fileTypes) === "string")
                            {
                                re = new RegExp(self.options.fileTypes);
                            }

                            if (!re.test(data.files[i]["type"]))
                            {
                                uploadErrors.push('Not an accepted file type: ' + data.files[i]["type"]);
                                bad = true;
                            }
                        }

                        // size
                        if (self.options.maxFileSize > -1)
                        {
                            if (data.files[i].size > self.options.maxFileSize) {
                                uploadErrors.push('Filesize is too big.  The maximum allowed file size is ' + self.options.maxFileSize + ' and the file being uploaded has size ' + data.files[i].size);
                                bad = true;
                            }
                        }

                        // general "before add" validation function
                        if (self.options.beforeAddValidator)
                        {
                            var errorMessage = self.options.beforeAddValidator(data.files[i]);
                            if (Alpaca.isString(errorMessage) || errorMessage === false)
                            {
                                if (!Alpaca.isString(errorMessage))
                                {
                                    errorMessage = 'Not an accepted file: ' + data.files[i].name;
                                }

                                uploadErrors.push(errorMessage);

                                bad = true;
                            }
                        }
                    }

                    if (bad)
                    {
                        i++;
                    }
                    else
                    {
                        i++;
                    }
                }
                while (i < data.files.length);

                if (uploadErrors.length > 0)
                {
                    self.options.errorHandler(uploadErrors);
                }
                else
                {
                    data.submit();
                }
            };

            // allow for extension
            self.applyConfiguration(fileUploadConfig);

            // instantiate the control
            var fileUpload = self.fileUpload = $(el).find('.alpaca-fileupload-input').fileupload(fileUploadConfig);

            // When file upload of a file completes, we offer the chance to adjust the data ahead of FileUpload
            // getting it.  This is useful for cases where you can't change the server side JSON but could do
            // a little bit of magic in the client.
            fileUpload.bindFirst("fileuploaddone", function(e, data) {

                var enhanceFiles = self.options.enhanceFiles;
                if (enhanceFiles)
                {
                    enhanceFiles(fileUploadConfig, data);
                }
                else
                {
                    self.enhanceFiles(fileUploadConfig, data);
                }

                // copy back down into data.files
                data.files = data.result.files;

                setTimeout(function() {
                    self.refreshValidationState(true);
                    self.refreshUIState();
                }, 250);

            });

            // When files are submitted, the "properties" and "parameters" options map are especially treated
            // and are written into property<index>__<key> and param<index>__key entries in the form data.
            // This allows for multi-part receivers to get values on a per-file basis.
            // Plans are to allow token substitution and other client-side treatment ahead of posting.
            fileUpload.bindFirst("fileuploadsubmit", function(e, data) {

                if (self.options["properties"])
                {
                    $.each(data.files, function(index, file) {

                        for (var key in self.options["properties"])
                        {
                            var propertyName = "property" + index + "__" + key;
                            var propertyValue = self.options["properties"][key];

                            // token substitutions
                            propertyValue = self.applyTokenSubstitutions(propertyValue, index, file);

                            if (!data.formData) {
                                data.formData = {};
                            }

                            data.formData[propertyName] = propertyValue;
                        }
                    });
                }

                if (self.options["parameters"])
                {
                    $.each(data.files, function(index, file) {

                        for (var key in self.options["parameters"])
                        {
                            var paramName = "param" + index + "__" + key;
                            var paramValue = self.options["parameters"][key];

                            // token substitutions
                            paramValue = self.applyTokenSubstitutions(paramValue, index, file);

                            if (!data.formData) {
                                data.formData = {};
                            }

                            data.formData[paramName] = paramValue;
                        }
                    });
                }

                self.handleBeforeFileUploadSubmit(data);

                if (self.options.beforeFileUploadSubmitHandler)
                {
                    self.options.beforeFileUploadSubmitHandler.call(self, data);
                }

            });

            /**
             * When files are uploaded, we adjust the value of the field.
             */
            fileUpload.bind("fileuploaddone", function(e, data) {

                // existing
                var array = self.getValueAsArray();

                var f = function(i)
                {
                    if (i === data.files.length) // jshint ignore:line
                    {
                        self.setValueAsArray(array);
                        return;
                    }

                    self.convertFileToDescriptor(data.files[i], function (err, descriptor) {

                        if (descriptor)
                        {
                            array.push(descriptor);
                        }

                        f(i + 1);
                    });

                };
                f(0);
            });

            /**
             * When file uploads fail, alert...
             */
            fileUpload.bind("fileuploadfail", function(e, data) {
                self.onUploadFail(data);
            });


            /**
             * Whether success or fail, we handle the results.
             */
            fileUpload.bind("fileuploadalways", function(e, data) {
                self.refreshUIState();
            });

            // allow for extension
            self.applyBindings(fileUpload, el);

            // allow for preloading of documents
            self.preload(fileUpload, el, function(files) {

                if (files && files.length > 0)
                {
                    var form = $(self.control).find('.alpaca-fileupload-input');
                    $(form).fileupload('option', 'done').call(form, $.Event('done'), {
                        result: {
                            files: files
                        }
                    });

                    self.afterPreload(fileUpload, el, files, function() {
                        callback();
                    });
                }
                else
                {
                    callback();
                }
            });

            if (typeof(document) !== "undefined")
            {
                $(document).bind('drop dragover', function (e) {
                    e.preventDefault();
                });
            }
        },

        handleWrapRow: function(row, options)
        {

        },

        applyTokenSubstitutions: function(text, index, file)
        {
            var tokens = {
                "index": index,
                "name": file.name,
                "size": file.size,
                "url": file.url,
                "thumbnailUrl": file.thumbnailUrl
            };

            // substitute any tokens
            var x = -1;
            var b = 0;
            do
            {
                x = text.indexOf("{", b);
                if (x > -1)
                {
                    var y = text.indexOf("}", x);
                    if (y > -1)
                    {
                        var token = text.substring(x + car.length, y);

                        var replacement = tokens[token];
                        if (replacement)
                        {
                            text = text.substring(0, x) + replacement + text.substring(y+1);
                        }

                        b = y + 1;
                    }
                }
            }
            while(x > -1);

            return text;
        },

        /**
         * Extension point for adding properties and callbacks to the file upload config.
         *
         * @param fileUploadconfig
         */
        applyConfiguration: function(fileUploadconfig)
        {
        },

        /**
         * Extension point for binding event handlers to file upload instance.
         *
         * @param fileUpload
         */
        applyBindings: function(fileUpload)
        {
        },

        /**
         * Converts from a file to a storage descriptor.
         *
         * A descriptor looks like:
         *
         *      {
         *          "id": ""
         *          ...
         *      }
         *
         * A descriptor may contain additional properties as needed by the underlying storage implementation
         * so as to retrieve metadata about the described file.
         *
         * Assumption is that the underlying persistence mechanism may need to be consulted.  Thus, this is async.
         *
         * By default, the descriptor mimics the file.
         *
         * @param file
         * @param callback function(err, descriptor)
         */
        convertFileToDescriptor: function(file, callback)
        {
            var descriptor = {
                "id": file.id,
                "name": file.name,
                "size": file.size,
                "url": file.url,
                "thumbnailUrl":file.thumbnailUrl,
                "deleteUrl": file.deleteUrl,
                "deleteType": file.deleteType
            };

            callback(null, descriptor);
        },

        /**
         * Converts a storage descriptor to a file.
         *
         * A file looks like:
         *
         *      {
         *          "id": "",
         *          "name": "picture1.jpg",
         *          "size": 902604,
         *          "url": "http:\/\/example.org\/files\/picture1.jpg",
         *          "thumbnailUrl": "http:\/\/example.org\/files\/thumbnail\/picture1.jpg",
         *          "deleteUrl": "http:\/\/example.org\/files\/picture1.jpg",
         *          "deleteType": "DELETE"
         *      }
         *
         * Since an underlying storage mechanism may be consulted, an async callback hook is provided.
         *
         * By default, the descriptor mimics the file.
         *
         * @param descriptor
         * @param callback function(err, file)
         */
        convertDescriptorToFile: function(descriptor, callback)
        {
            var file = {
                "id": descriptor.id,
                "name": descriptor.name,
                "size": descriptor.size,
                "url": descriptor.url,
                "thumbnailUrl":descriptor.thumbnailUrl,
                "deleteUrl": descriptor.deleteUrl,
                "deleteType": descriptor.deleteType
            };

            callback(null, file);
        },

        /**
         * Extension point for "enhancing" data received from the remote server after uploads have been submitted.
         * This provides a place to convert the data.rows back into the format which the upload control expects.
         *
         * Expected format:
         *
         *    data.result.rows = [{...}]
         *    data.result.files = [{
         *      "id": "",
         *      "path": "",
         *      "name": "picture1.jpg",
         *      "size": 902604,
         *      "url": "http:\/\/example.org\/files\/picture1.jpg",
         *      "thumbnailUrl": "http:\/\/example.org\/files\/thumbnail\/picture1.jpg",
         *      "deleteUrl": "http:\/\/example.org\/files\/picture1.jpg",
         *      "deleteType": "DELETE"*
         *    }]
         *
         * @param fileUploadConfig
         * @param data
         */
        enhanceFiles: function(fileUploadConfig, data)
        {
        },

        /**
         * Preloads data descriptors into files.
         *
         * @param fileUpload
         * @param el
         * @param callback
         */
        preload: function(fileUpload, el, callback)
        {
            var self = this;

            var files = [];

            // now preload with files based on property value
            var descriptors = self.getValueAsArray();

            var f = function(i)
            {
                if (i == descriptors.length) // jshint ignore:line
                {
                    // all done
                    return callback(files);
                }

                self.convertDescriptorToFile(descriptors[i], function(err, file) {

                    if (file)
                    {
                        files.push(file);
                    }

                    f(i+1);
                });
            };
            f(0);
        },

        afterPreload: function(fileUpload, el, files, callback)
        {
            var self = this;

            self.refreshUIState();

            callback();
        },

        /**
         * @see Alpaca.Fields.ControlField#getControlValue
         */
        getControlValue: function()
        {
            return this.data;
        },

        /**
         * Hands back the value as either an object or array, depending on the schema type.
         *
         * @returns {*}
         */
        getValue: function()
        {
            var value = this.data;

            if (this.isObjectType())
            {
                if (this.data && this.data.length > 0)
                {
                    value = this.data[0];
                }
                else
                {
                    value = undefined;
                }
            }

            return value;
        },

        setValue: function(value)
        {
            if (!value)
            {
                this.data = [];
            }
            else
            {
                if (Alpaca.isArray(value))
                {
                    this.data = value;
                }
                else if (Alpaca.isObject(value))
                {
                    this.data = [value];
                }
            }

            this.updateObservable();

            this.triggerUpdate();
        },

        /**
         * @returns {Array} the value as an array
         */
        getValueAsArray: function()
        {
            return this.data || [];
        },

        /**
         * Sets the value as an array.
         *
         * @param array
         */
        setValueAsArray: function(array)
        {
            var self = this;

            if (self.isArrayType())
            {
                self.setValue(array);
            }
            else if (self.isObjectType())
            {
                var val = null;
                if (array && array.length > 0) {
                    val = array[0];
                }

                self.setValue(val);
            }
        },

        reload: function(callback)
        {
            var self = this;

            var descriptors = this.getValueAsArray();

            var files = [];

            var f = function(i)
            {
                if (i === descriptors.length) // jshint ignore:line
                {
                    // all done

                    var form = $(self.control).find('.alpaca-fileupload-input');
                    $(form).fileupload('option', 'done').call(form, $.Event('done'), {
                        result: {
                            files: files
                        }
                    });

                    // refresh validation state
                    self.refreshValidationState();

                    return callback();
                }

                self.convertDescriptorToFile(descriptors[i], function(err, file) {
                    if (file)
                    {
                        files.push(file);
                    }
                    f(i+1);
                });
            };
            f(0);
        },

        plugin: function()
        {
            var self = this;

            return $(self.control).find('.alpaca-fileupload-input').data().blueimpFileupload;
        },

        refreshUIState: function()
        {
            var self = this;

            var fileUpload = self.plugin();
            if (fileUpload)
            {
                var maxNumberOfFiles = self.options.maxNumberOfFiles;

                if (maxNumberOfFiles === -1)
                {
                    self.refreshButtons(true);
                }
                else
                {
                    if (fileUpload.options.getNumberOfFiles && fileUpload.options.getNumberOfFiles() >= maxNumberOfFiles)
                    {
                        self.refreshButtons(false);
                    }
                    else
                    {
                        self.refreshButtons(true);
                    }
                }
            }
        },

        refreshButtons: function(enabled)
        {
            var self = this;

            // disable select files button
            $(self.control).find(".btn.fileinput-button").prop("disabled", true);
            $(self.control).find(".btn.fileinput-button").attr("disabled", "disabled");

            // hide dropzone message
            $(self.control).find(".fileupload-active-zone p.dropzone-message").css("display", "none");

            if (enabled)
            {
                // enable select files button
                $(self.control).find(".btn.fileinput-button").prop("disabled", false);
                $(self.control).find(".btn.fileinput-button").attr("disabled", null);

                // show dropzone message
                $(self.control).find(".fileupload-active-zone p.dropzone-message").css("display", "block");
            }
        },

        onFileDelete: function(rowEl, buttonEl, file)
        {
            var self = this;

            var deleteUrl = file.deleteUrl;
            var deleteMethod = file.deleteType;

            var c = {
                "method": deleteMethod,
                "url": deleteUrl,
                "headers": {}
            };

            var csrfToken = self.determineCsrfToken();
            if (csrfToken)
            {
                c.headers[Alpaca.CSRF_HEADER_NAME] = csrfToken;
            }

            $.ajax(c);
        },

        onUploadFail: function(data)
        {
            var self = this;

            if (self.options.errorHandler)
            {
                self.options.errorHandler.call(self, data);
            }

            // if "error" not filled in for each file, do our best here
            if (data.files && data.files.length > 0)
            {
                for (var i = 0; i < data.files.length; i++)
                {
                    if (!data.files[i].error) {
                        data.files[i].error = data.errorThrown;
                    }
                }
            }
        },

        /**
         * @see Alpaca.Field#disable
         */
        disable: function()
        {
            // disable select button
            $(this.field).find(".fileinput-button").prop("disabled", true);
            $(this.field).find(".fileinput-button").attr("disabled", "disabled");

            // hide the upload well
            $(this.field).find(".alpaca-fileupload-well").css("visibility", "hidden");
        },

        /**
         * @see Alpaca.Field#enable
         */
        enable: function()
        {
            $(this.field).find(".fileinput-button").prop("disabled", false);
            $(this.field).find(".fileinput-button").removeAttr("disabled");

            // show the upload well
            $(this.field).find(".alpaca-fileupload-well").css("visibility", "visible");
        },

        /* builder_helpers */

        /**
         * @see Alpaca.ControlField#getTitle
         */
        getTitle: function() {
            return "Upload Field";
        },

        /**
         * @see Alpaca.ControlField#getDescription
         */
        getDescription: function() {
            return "Provides an upload field with support for thumbnail preview";
        },

        /**
         * @see Alpaca.ControlField#getType
         */
        getType: function() {
            return "array";
        },

        /**
         * @private
         * @see Alpaca.Fields.TextField#getSchemaOfSchema
         */
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "maxNumberOfFiles": {
                        "title": "Maximum Number of Files",
                        "description": "The maximum number of files to allow to be uploaded.  If greater than zero, the maximum number will be constrained.  If -1, then no limit is imposed.",
                        "type": "number",
                        "default": 1
                    },
                    "maxFileSize": {
                        "title": "Maximum File Size (in bytes)",
                        "description": "The maximum file size allowed per upload.  If greater than zero, the maximum file size will be limited to the given size in bytes.  If -1, then no limit is imposed.",
                        "type": "number",
                        "default": -1
                    },
                    "fileTypes": {
                        "title": "File Types",
                        "description": "A regular expression limiting the file types that can be uploaded based on filename",
                        "type": "string"
                    },
                    "multiple": {
                        "title": "Multiple",
                        "description": "Whether to allow multiple file uploads.  If maxNumberOfFiles is not specified, multiple will toggle between 1 and unlimited.",
                        "type": "boolean",
                        "default": false
                    },
                    "directory": {
                        "title": "Directory",
                        "description": "Whether to allow directories (folders) to be dropped into the control for multi-document upload.",
                        "type": "boolean",
                        "default": false
                    },
                    "showUploadPreview": {
                        "title": "Show Upload Preview",
                        "description": "Whether to show thumbnails for uploaded assets (requires preview support)",
                        "type": "boolean",
                        "default": true
                    },
                    "errorHandler": {
                        "title": "Error Handler",
                        "description": "Optional function handler to be called when one or more files fails to upload.  This function is responsible for parsing the underlying xHR request and populating the error message state.",
                        "type": "function"
                    }
                }
            });
        }

        /* end_builder_helpers */
    });

    Alpaca.registerFieldClass("upload", Alpaca.Fields.UploadField);

    Alpaca.registerMessages({
        "chooseFile": "Choose File...",
        "chooseFiles": "Choose Files...",
        "dropZoneSingle": "Click the Choose button or Drag and Drop a file here to upload...",
        "dropZoneMultiple": "Click the Choose button or Drag and Drop files here to upload...",
        "dropZoneMultipleDirectory": "Click the Choose button or Drag and Drop files or a folder here to upload..."
    });

    // https://github.com/private-face/jquery.bind-first/blob/master/dev/jquery.bind-first.js
    // jquery.bind-first.js
    (function($) {
        var splitVersion = $.fn.jquery.split(".");
        var major = parseInt(splitVersion[0]);
        var minor = parseInt(splitVersion[1]);

        var JQ_LT_17 = (major < 1) || (major === 1 && minor < 7);

        function eventsData($el)
        {
            return JQ_LT_17 ? $el.data('events') : $._data($el[0]).events;
        }

        function moveHandlerToTop($el, eventName, isDelegated)
        {
            var data = eventsData($el);
            var events = data[eventName];

            if (!JQ_LT_17) {
                var handler = isDelegated ? events.splice(events.delegateCount - 1, 1)[0] : events.pop();
                events.splice(isDelegated ? 0 : (events.delegateCount || 0), 0, handler);

                return;
            }

            if (isDelegated) {
                data.live.unshift(data.live.pop());
            } else {
                events.unshift(events.pop());
            }
        }

        function moveEventHandlers($elems, eventsString, isDelegate) {
            var events = eventsString.split(/\s+/);
            $elems.each(function() {
                for (var i = 0; i < events.length; ++i) {
                    var pureEventName = $.trim(events[i]).match(/[^\.]+/i)[0];
                    moveHandlerToTop($(this), pureEventName, isDelegate);
                }
            });
        }

        $.fn.bindFirst = function()
        {
            var args = $.makeArray(arguments);
            var eventsString = args.shift();

            if (eventsString) {
                $.fn.bind.apply(this, arguments);
                moveEventHandlers(this, eventsString);
            }

            return this;
        };

    })($);

})(jQuery);
