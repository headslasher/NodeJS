var express = require('express');

var app = express();
var port = '3000';
var hostname = '127.0.0.1';

app.use(express.static('public'));


app.get('/topic', function(req, res){
	
	var topics = [
			'This is JavaScript!!!',
			'This is NodeJS!!!',
			'This is Express!!!'
	];
	
	var link = `
	
	<a href="/topic?id=0">JavaScript</a><br>
	<a href="/topic?id=1">NodeJS</a><br>
	<a href="/topic?id=2">Express</a><br>
	
	`
	
	res.send(link + topics[req.query.id]);
	
});


app.set('view engine','jade');
app.set('views','./views');

app.locals.pretty = true;/*템플릿 들여쓰기*/

app.get('/template', function(req, res){
	res.render('temp', {date:Date(), string:'String'});
});/*.jade 템플릿*/

app.get('/dynamic', function(req, res){
	
	var date = Date();
	var list = '';
	for(var i=0 ; i < 5 ; i++){
		list += '<li>coding</li>';
		}
	var page =
	`
	<!DOCTYPE html>
	<html>
		<head>
			<meta charset="UTF-8">
				<title>Insert title here</title>
		</head>
		<body>
			hello, dynamic!!!<br>
			dynamic은 내용 수정시 서버재시작을 요함.<br><br>
			
			<ul>
				${list}
			</ul>
			
			${date}
		</body>
	</html>
	`;
	res.send(page);
});/*동기 비동기 페이지*/

app.get('/router',function(req, res){
	res.send('hello router, <img src="/1.jpg">');
});/*file system모듈*/

app.get('/login', function(req, res){
	res.send('going through /login url');
});

app.listen(3000, function() {
	console.log('server port 3000 connected');
});/*웹 서버 호출*/