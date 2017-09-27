var reader = require('csv-reader'),
    fs = require('fs'),
    stopwords = require('stopwords').english;

exports.parseCSV = function(options, callback){
    
    
    var inputStream = fs.createReadStream(options.file, 'utf8'),
        result = {};
    
    inputStream
        .pipe(reader({ parseNumbers: true, parseBooleans: true, trim: true }))
        .on('data', function (row) { 
            
            for(let col of row){
                if(col.split){
                    let words = col.split(" ");
                    for(let word of words){
                       if(stopwords.includes(word)){
                           continue;
                        }
                        result[word] = (result[word] || 0) + 1
                    }
                }
            }
        })
        .on('end', function (data) {
            console.log('filter? ', options.excludeLoaners);
            result = Object.keys(result)
                .map(a => [a, result[a]])
                .filter(k => (options.excludeLoaners && k[1]) || k[1] > 1)
                .sort((a, b) => b[1] - a[1]);
            console.log(result.slice(0, 10));
            callback(result);
        });    
}