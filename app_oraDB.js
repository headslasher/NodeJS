const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');

app.set('views','./views_file');
app.set('view engine', 'pug');
app.locals.pretty=true;
app.use(bodyParser.urlencoded({extended:false}));

app.get('/topic/write', (req, res)=>{

	res.render('write');

});

app.get(['/topic', '/topic/:title'], (req, res)=>{
	conn.;
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
