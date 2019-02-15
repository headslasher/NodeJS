const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs')

app.set('views','./views_file');
app.set('view engine', 'pug');
app.locals.pretty=true;
app.use(bodyParser.urlencoded({extended:false}));

app.get('/topic/main', (req, res)=>{
	
	res.render('Hi');
	
});

app.get('/topic', (req, res)=>{
	
	fs.readdir('data', (err, files) => {
		if(err){
			res.status(500).send('internal server error!!')
		}
		res.render('view', {topics:files});
	})

});

app.post('/topic', (req, res)=>{
	
	let text = req.body.text;
	let textarea = req.body.textarea;
	
	fs.writeFile('data/'+text, textarea, (err) => {
		if(err){
			res.status(500).send('internal server error!!');
		}
		res.send(' text = '+text+' textarea = '+textarea);
	});
});

app.listen(4000, ()=>{
	console.log('this server connected in port No 4000');
});