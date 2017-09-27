

var express = require('express'),
	fs = require('fs'),
    bodyParser = require('body-parser'),
    fileUpload = require('express-fileupload'),
    methodOverride = require('method-override'),
    path = require('path'),
    formidable = require('formidable')
    fileWorker = require("./csvparser");


var app = express();
var PORT = process.env.PORT || 8000;

app.use(express.static(path.join(__dirname, 'public')));
app.use('/libs', express.static('bower_components'));

var lessCompiler = require( 'express-less-middleware' )();
app.use( lessCompiler );

var http = require('http').createServer(app);

app.get('/', function(req, res){
    req.send('./public/views/index.html');
});

app.post('/upload',(req, res, next) => {
    
    console.log(req.body, req.params);

  // create an incoming form object
  var form = new formidable.IncomingForm(),
      filePath = '',
      fields = {};

  // store all uploads in the /uploads directory
  form.uploadDir = path.join(__dirname, '/uploads');

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function(field, file) {
     fs.rename(file.path, path.join(form.uploadDir, file.name));
     filePath = path.join(form.uploadDir, file.name); 
     console.log(filePath);
  }).on('field', function(name, field) {
      fields[name] = field;
      
        console.log('Got a field:', name, field);
  }).on('error', function(err) {
    console.log('An error has occured: \n' + err);
  }).on('end', function() {
      console.log('type ', typeof(fields["exclude"]));
    fileWorker.parseCSV({
        file: filePath,
        excludeLoaners: fields["exclude"] === true || fields["exclude"] === "true",
    }, res.json.bind(res));
  });

  // parse the incoming request containing the form data
  form.parse(req);

});



http.listen(PORT, function(){
    console.log("Listening on 127.0.0.1/8000");
});