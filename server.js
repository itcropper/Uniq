

var express = require('express'),
	fs = require('fs'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    path = require('path'),
	parse = require('csv-parse'),
    multer = require('multer');


var app = express();
var PORT = process.env.PORT || 8000;


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
      console.log(file);
    cb(null, file.originalname)
  }
})
 
var upload = multer({ storage: storage })

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

app.post('/csvUpload', upload.single('file'), function(req, res) {
    
    console.log("--->", req.file.originalname);
    
    req.file.originalname = req.file.originalname.split('.csv')[0]+'.csv';
    
    fs.readFile("uploads/" + req.file.originalname, function (err, fileData) {
        
        if(err){
            console.log(err);
            return res.send(err);
        }
	  parse(fileData, {columns: true, trim: true}, function(err, rows) {
          
        console.log(fileData);
          
	    rows = rows.map((r) => r['Search term']);
	    var uniqueWords = {};

	    for(var cell of rows){
	    	for(var word of cell.split(" ")){
	    		word = word.trim().replace(/,/g, "");
	    		if(uniqueWords[word]){
	    			uniqueWords[word] += 1;
	    		}else{
	    			uniqueWords[word] = 1;
	    		}
	    	}
	    }

	    var wordsAsList = Object.keys(uniqueWords).map((key) => [key, uniqueWords[key]]);

	    wordsAsList.sort((a,b) => b[1] - a[1]);

		var output = "Word, Count\n" + wordsAsList.map((val,i) => val[0] + ", "+ val[1]).join('\n');

		var file = fs.writeFile('finished/' + req.file.originalname, output, () => {
            res.send(req.file.originalname);
            
			console.log('Finished. Data is in ' + req.file.originalname);
            
            fs.unlink('finished/' + req.file.originalname, (err) => {
                if (err) throw err;
                console.log('successfully deleted /tmp/hello');
                fs.unlink('uploads/' + req.file.originalname, (err) => {
                    if (err) throw err;
                    console.log('successfully deleted /tmp/hello');
                });         
            });              
		});
	  });
	});  
});



http.listen(PORT, function(){
    console.log("Listening on 127.0.0.1/8000");
});