var express = require('express');

var app = express();
var port = '3000';
var hostname = '127.0.0.1';

app.get('/',function(req, res){
	res.send('going through / url');
});

app.get('/login', function(req, res){
	res.send('going through /login url');
});

app.listen(3000, function() {
	console.log('server port 3000 hostname ${hostname}');
});