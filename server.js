

var express = require('express'),
	fs = require('fs'),
    bodyParser = require('body-parser'),
    fileUpload = require('express-fileupload');
    methodOverride = require('method-override'),
    path = require('path'),
	parse = require('csv-parse');


var app = express();
var PORT = process.env.PORT || 8000;

app.use(fileUpload());
app.use(bodyParser.json()); 
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(methodOverride('X-HTTP-Method-Override')); 
app.use(express.static(path.join(__dirname, 'public')));
app.use('/libs', express.static('bower_components'));

var lessCompiler = require( 'express-less-middleware' )();
app.use( lessCompiler );

var http = require('http').createServer(app);

app.get('/', function(req, res){
    req.send('./public/views/index.html');
});

app.post('/csvUpload', function(req, res){
    console.log(req.files);
    res.send('success');
})



http.listen(PORT, function(){
    console.log("Listening on 127.0.0.1/8000");
});