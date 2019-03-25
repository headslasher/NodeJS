module.exports = () => {
  const OrientDB = require('orientjs');//orient접속
  const server = OrientDB({//orient접속할 계정 정보
     host:       'localhost',
     port:       2424,
     username:   'root',
     password:   'password'
  });
  const db = server.use('demodb');//orient접속할 DB
  return db;
};
