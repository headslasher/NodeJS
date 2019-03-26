module.exports = () => {

  const route = require('express').Router();
  const db = require('../../config/orientDB/db')();

  route.get('/add', (req, res)=>{
  	const sql = 'SELECT * FROM topic';
  	db.query(sql).then((topics)=>{
  		res.render('topic/add', {topics:topics});
  	});
  });

  route.post('/add', (req, res)=>{
  	let title = req.body.title;
  	let description = req.body.description;
  	let author = req.body.author;
  	const sql = 'INSERT INTO topic(title, author, description) VALUES (:title, :description, : author)';
  	db.query(sql,{params:{
  		title:title,
  		description:description,
  		author:author
  	}}).then((results)=>{
  		res.redirect('/'+encodeURIComponent(results[0]['@rid']));
  	});
  });

  route.get(['/', '/:id'], function(req, res){
    const sql = 'SELECT * FROM topic';
    db.query(sql).then((topics) => {
      let id = req.params.id;
      if(id){
        const sql = 'SELECT * FROM topic WHERE @rid=:rid';
        db.query(sql, {params:{rid:id}}).then((topic) => {
          res.render('topic/view', {topics:topics, topic:topic[0]});
        });
      } else {
        res.render('topic/view', {topics:topics, user:req.user});
      }
    });
  });

  route.get('/:id/edit', (req, res)=>{
  	const sql = 'SELECT * FROM topic';
  	let id = req.params.id;
  	db.query(sql).then((topics)=>{
  		const sql = 'SELECT * FROM topic WHERE @rid=:rid';
  		db.query(sql, {params:{rid:id}}).then((topic) => {
  			res.render('topic/edit', {topics:topics, topic:topic[0]});
  		});
  	});
  });

  route.post('/:id/edit', (req, res)=>{
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
  		res.redirect('/'+encodeURIComponent(id));
  	});
  });

  route.get('/:id/delete', (req, res)=>{
  	const sql = 'SELECT * FROM topic';
  	let id = req.params.id;
  	db.query(sql).then((topics)=>{
  		const sql = 'SELECT * FROM topic WHERE @rid=:rid';
  		db.query(sql, {params:{rid:id}}).then((topic) => {
  			res.render('topic/delete', {topics:topics, topic:topic[0]});
  		});
  	});
  });

  route.post('/:id/delete', (req, res)=>{
  	const sql = 'DELETE VERTEX FROM topic WHERE @rid=:rid';
  	let id = req.params.id;
  	db.query(sql,{params:{
  		rid:id
  	}}).then((results)=>{
  		res.redirect('/');
  	});
  });
  return route;
};
