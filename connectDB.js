const express = require('express');
const app = express();
const oracledb = require('oracledb');
const DBconfig = require('./DBconfig');

oracledb.autoCommit=true;

Connection(DBconfig);

function Connection(DBconfig){
	oracledb.getConnection(
	  {
	   user          : DBconfig.user,
	   password      : DBconfig.password,
	   connectString : DBconfig.connectString
	  },
	 (err, connection) => {
	  if (err) {
	    console.error(err.message);
	    return;
	  }
	    const conn = connection;
	    select_topic(conn);
	 });
}

function doRelease(connection) {
  connection.close((err) => {
    if (err)
    	console.error(err.message);
    });
  	console.log('complete');
}

function select_topic(conn){
	let sql = 'SELECT * FROM topic';
	//SELECT    
	conn.execute(sql, (err, result) => {
	    if (err) {
	      console.error(err.message);
	      doRelease(conn);
	      return;
	    }
	    console.log(result.rows);
	    doRelease(conn);
	});
}

function insert_topic(conn){
	let sql = 'INSERT INTO topic(title, bcontent, bid) VALUES (:title, :bcontent, :bid)';
	let bind = ['title', 'bcontent', 'bid'];
	//INSERT   
	conn.execute(sql, bind, (err, result) => {
		   if (err) {
		     console.error(err.message);
		     doRelease(conn);
		     return;
		   }
		   console.log(result.rowsAffected);
		   doRelease(conn);
		});
}

function update_topic(conn){
	let sql = 'UPDATE topic SET title = :title, bcontent = :bcontent, bid = :bid WHERE title = title';
	let bind = ['title_UPDATED', 'bcontent_UPDATED', 'bid_UPDATED'];
	//UPDATE   
	conn.execute(sql, bind, (err, result) => {
		   if (err) {
		     console.error(err.message);
		     doRelease(conn);
		     return;
		   }
		   console.log(result.rowsAffected);
		   doRelease(conn);
		});
}

function delete_topic(conn){
	let sql = 'DELETE topic WHERE title = :title';
	let bind = ['title_UPDATED'];
	//DELETE   
	conn.execute(sql, bind, (err, result) => {
		   if (err) {
		     console.error(err.message);
		     doRelease(conn);
		     return;
		   }
		   console.log(result.rowsAffected);
		   doRelease(conn);
		});
}

