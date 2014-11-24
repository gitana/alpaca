var path    = require('path');
var express = require('express');

var app       = express();
var publicDir = path.join(__dirname, '..');
var port      = process.env.PORT || 9999;

app.configure(function() {
    app.use(express.json());
    app.use(express.urlencoded());
});

app.use(express.static(publicDir));

app.listen(port, function() {
    console.log('App is now listening on port: ' + port);
});
