const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.set('views','./views_file');
app.set('view engine', 'pug');
app.locals.pretty=true;
app.use(bodyParser.urlencoded({extended:false}));

app.get('/topic/new', (req, res)=>{
	
	res.render('Hi');
	
});

app.post('/topic', (req, res)=>{
	
	let text = req.body.text;
	let textarea = req.body.textarea;
	res.send(text+' and '+textarea);
	
});

app.listen(4000, ()=>{
	console.log('this server connected in port No 4000');
});