const http = require('http');
const hostname = '127.0.0.1';
const port = '1337';

http.createServer((request, response) => {
	response.writeHead(200);
	response.end('Hello World\n')
}).listen(port, hostname, () => {
	console.log('server is at http://${hostname}:${port}');
});