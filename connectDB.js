const express = require('express');
const app = express();
const oracledb = require('oracledb');
const DBconfig = require('./DBconfig');

oracledb.autoCommit=true;
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
    
// SELECT    
    let sql = 'SELECT * FROM topic';
    connection.execute(sql, (err, result) => {
         if (err) {
           console.error(err.message);
           doRelease(connection);
           return;
         }
         console.log(result.rows);
         doRelease(connection);
    });
  });
    
//INSERT
    let sql = 'INSERT INTO topic(title, bcontent, bid) VALUES (:title, :bcontent, :bid)';
    let bind = ['title', 'bcontent', 'bid'];
    
    connection.execute(sql, bind, (err, result) => {
        if (err) {
          console.error(err.message);
          doRelease(connection);
          return;
        }
        console.log(result.rowsAffected);
        doRelease(connection);
    });

//UPDATE
    let sql = 'UPDATE topic SET title = :title, bcontent = :bcontent, bid = :bid WHERE title = title';
    let bind = ['title_UPDATED', 'bcontent_UPDATED', 'bid_UPDATED'];
    
    connection.execute(sql, bind, (err, result) => {
        if (err) {
          console.error(err.message);
          doRelease(connection);
          return;
        }
        console.log(result.rowsAffected);
        doRelease(connection);
    });

//DELETE
    let sql = 'DELETE topic WHERE title = :title';
    let bind = ['title_UPDATED'];
    
    connection.execute(sql, bind, (err, result) => {
        if (err) {
          console.error(err.message);
          doRelease(connection);
          return;
        }
        console.log(result.rowsAffected);
        doRelease(connection);
    });
    
  });

function doRelease(connection) {
  connection.close((err) => {
    if (err)
    	console.error(err.message);
    });
}