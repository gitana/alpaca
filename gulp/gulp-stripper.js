'use strict';
var gutil = require('gulp-util');
var through = require('through2');

module.exports = function (config) {

	return through.obj(function (file, enc, cb) {

        if (file.isNull())
        {
			cb(null, file);
		}

		if (file.isStream())
        {
			cb(new gutil.PluginError('gulp-stripper', 'Streaming not supported'));
			return;
		}

        var START_TOKEN = "/* builder_helpers */";
        var END_TOKEN = "/* end_builder_helpers */";

		try
        {
            var contents = file.contents.toString();

            var i = -1;
            do
            {
                i = contents.indexOf(START_TOKEN);
                if (i > -1)
                {
                    var j = contents.indexOf(END_TOKEN, i);
                    if (j > -1)
                    {
                        contents = contents.substring(0, i) + contents.substring(j + END_TOKEN.length);
                    }
                    else
                    {
                        i = -1;
                    }
                }
            }
            while (i !== -1);

            file.contents = new Buffer(contents);
			cb(null, file);
		}
        catch (err)
        {
			cb(new gutil.PluginError('gulp-stripper', err, {fileName: file.path}));
		}
	});
};