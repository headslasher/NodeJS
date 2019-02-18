const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs')

app.set('views','./views_file');
app.set('view engine', 'pug');
app.locals.pretty=true;
app.use(bodyParser.urlencoded({extended:false}));

app.get('/topic/write', (req, res)=>{
	
	res.render('write');
	
});

app.get(['/topic', '/topic/:title'], (req, res)=>{
	
	fs.readdir('data', (err, files) => {
		let title = req.params.title;
		console.log(title);
		
		if(err){
			res.status(500).send('internal server error!!')
		}
		
		if(title){
			fs.readFile('data/'+title, 'UTF-8',  (err, data) => {
				if(err){
					res.status(500).send('internal server error!!')
				}
				res.render('main', {topics:files, title:title, content:data});
			})			
		} else {
			res.render('main', {topics:files, title:'Welcome', content:'Homepage'});
		}
	})
});

app.post('/topic/write', (req, res)=>{
	
	let title = req.body.title;
	let content = req.body.content;
	
	fs.writeFile('data/'+title, content, (err) => {
		if(err){
			res.status(500).send('internal server error!!');
		}
		res.redirect('/topic');
	});
});

app.post('/topic/delete', (req, res)=>{
	
	fs.unlink(path, function() {
		
	})
});

app.listen(4000, ()=>{
	console.log('this server connected in port No 4000');
});