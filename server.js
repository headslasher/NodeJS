var http = require('http');
var requestListener = function handler(req,res){
	res.writeHead(200, {'Content-type':'text/plain'});
	res.end('Hello World\n');
};

http.createServer(requestListener).listen(1337, '127.0.0.1');

console.log('Server is running at "http://127.0.0.1:1337"');