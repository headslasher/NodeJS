const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');

const OrientDB = require('orientjs');//orient접속
const server = OrientDB({//orient접속할 계정 정보
	 host:       'localhost',
	 port:       2424,
	 username:   'root',
	 password:   'password'
});
const db = server.use('demodb');

app.set('views','./views_orientDB');
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

	fs.unlink('data/'+title, (err) => {
		if(err){
			res.status(500).send('internal server error!!');
		}
		console.log('delete complete')
		res.redirect('/topic');
	});
});

app.listen(4000, ()=>{
	console.log('this server connected in port No 4000');
});
