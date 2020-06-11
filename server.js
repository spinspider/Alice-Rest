var app = require('./app');
var port = 8001;
var http = require('http');
var editJsonFile = require("edit-json-file");
var conf = editJsonFile('config.json'); 

http.createServer(app).listen(port,function(){
		console.log('Express server listening on port ' + port);
})