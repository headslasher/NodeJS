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

app.set('views','./view_orientDB');
app.set('view engine', 'pug');
app.locals.pretty=true;
app.use(bodyParser.urlencoded({extended:false}));

app.get('/topic/add', (req, res)=>{
	const sql = 'SELECT * FROM topic';
	db.query(sql).then((topics)=>{
		res.render('add', {topics:topics});
	});
});

app.post('/topic/add', (req, res)=>{
	let title = req.body.title;
	let description = req.body.description;
	let author = req.body.author;
	const sql = 'INSERT INTO topic(title, author, description) VALUES (:title, :description, : author)';
	db.query(sql,{params:{
		title:title,
		description:description,
		author:author
	}}).then((results)=>{
		res.redirect('/topic/'+encodeURIComponent(results[0]['@rid']));
	});
});

app.get(['/topic', '/topic/:id'], function(req, res){
  const sql = 'SELECT * FROM topic';
  db.query(sql).then((topics) => {
    let id = req.params.id;
    if(id){
      const sql = 'SELECT * FROM topic WHERE @rid=:rid';
      db.query(sql, {params:{rid:id}}).then((topic) => {
        res.render('view', {topics:topics, topic:topic[0]});
      });
    } else {
      res.render('view', {topics:topics});
    }
  });
});

app.get('/topic/:id/edit', (req, res)=>{
	const sql = 'SELECT * FROM topic';
	let id = req.params.id;
	db.query(sql).then((topics)=>{
		const sql = 'SELECT * FROM topic WHERE @rid=:rid';
		db.query(sql, {params:{rid:id}}).then((topic) => {
			res.render('edit', {topics:topics, topic:topic[0]});
		});
	});
});

app.post('/topic/:id/edit', (req, res)=>{
	const sql = 'UPDATE topic SET title=:title, description=:description, author=:author WHERE @rid=:id';
	let id = req.params.id;
	let author = req.body.author;
	let title = req.body.title;
	let description = req.body.description;
	db.query(sql,{params:{
		author:author,
		title:title,
		description:description,
		id:id
	}}).then((topics)=>{
		res.redirect('/topic/'+encodeURIComponent(id));
	});
});

app.get('/topic/:id/delete', (req, res)=>{
	const sql = 'SELECT * FROM topic';
	let id = req.params.id;
	db.query(sql).then((topics)=>{
		const sql = 'SELECT * FROM topic WHERE @rid=:rid';
		db.query(sql, {params:{rid:id}}).then((topic) => {
			res.render('delete', {topics:topics, topic:topic[0]});
		});
	});
});

app.post('/topic/:id/delete', (req, res)=>{
	const sql = 'DELETE VERTEX FROM topic WHERE @rid=:rid';
	let id = req.params.id;
	db.query(sql,{params:{
		rid:id
	}}).then((results)=>{
		res.redirect('/topic/');
	});
});

app.listen(4000, ()=>{
	console.log('this server connected in port No 4000');
});
