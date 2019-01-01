var path = require("path");
var express = require("express");

var port = process.env.PORT || 9999;

var app = express();

var publicDir = path.join(__dirname, '..', 'build', 'web');

app.use(express.static(publicDir));

app.listen(port, function() {
    console.log('App is now listening on port: ' + port);
});

/*
app.configure(function() {
    app.use(express.json());
    app.use(express.urlencoded());
});

 */