const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = '3000';
const hostname = '127.0.0.1';

app.set('view engine','jade');
app.set('views','./views');
app.locals.pretty = true;/*템플릿 들여쓰기*/

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended : false}));


app.get('/post', (req, res) => {
	
	res.render('post');
	
});

app.get('/form_receiver', (req, res) => {
	
	let text = req.query.text;
	let textarea = req.query.textarea;
	
	res.send(text + ' + ' + textarea + ' + GET ' );
	
});

app.post('/form_receiver', (req, res)=> {
	
	let text = req.body.text;
	let textarea = req.body.textarea;
	
	res.send(text + ' + ' + textarea + ' + POST ' );
	
});

app.get('/topic/:topicId', (req, res) => {
	
	let topics;
	topics = [
			'This is JavaScript!!!',
			'This is NodeJS!!!',
			'This is Express!!!'
	];
	let link;
	
	link = `
	<a href="/topic?id=0">JavaScript</a><br>
	<a href="/topic?id=1">NodeJS</a><br>
	<a href="/topic?id=2">Express</a><br>
	`

	res.send(link + topics[req.params.topicId]);	
});

app.get('/topic/:topicId/:mode', (req, res) => {
	res.send('topicId : ' + req.params.topicId + ', mode : ' + req.params.mode);
}); //sementic URL


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