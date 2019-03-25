module.exports = (passport) => {
  const route = require('express').Router();
  const db = require('../../config/orientDB/db')();//외부 db접속모듈
  const bodyparser = require('body-parser');//body form 태그 정보 파싱
  const hasher = require("pbkdf2-password")();//pbkdf2암호화
  const userDB=[
              {//admin
              salt : 'zgllAK6yiR4DrV3QzUTajWTmq8Uvt1dDrC7AljsRB3NNHx4fwStJIyWhM3r2lHo0IYUJbthzyK7Oznu43ORhwA==',
              username:'admin',
              password:'5HFao6An1wFKmucWIRhxcWndCf0BXEiy9oiuTAY6OIO4uGItKmvZvi38QpsulDkC9WskwAc2P+qAiKg1LLQrPlKXutskWPBCoyiLJ/SgGmbgZuOvcFh2QpoLNHx8V1+hQsx5pZI/RTLu9A7EcBaRZHmmiHL309h7OExaJzfM4iw=',
              displayName:'adminname'
              }
            ];

  route.get('/login',(req, res)=>{
    res.render('auth/login');
  });

  route.post('/login',
    passport.authenticate('local', { successRedirect: '/welcome',
                                     failureRedirect: '/auth/login',
                                     failureFlash: true })
  );

  route.get('/facebook', passport.authenticate('facebook', { scope: 'email' }));

  route.get('/facebook/callback',
    passport.authenticate('facebook', { successRedirect: '/welcome',
                                        failureRedirect: '/auth/login' }));

  route.get('/register',(req, res)=>{
    res.render('auth/register');
  });

  route.post('/register',(req, res)=>{
    hasher({password:req.body.password}, (err, pass, salt, hash)=>{
      const user = {
        salt : salt,
        username : req.body.username,
        password : hash,
        displayName : req.body.displayName
      };
      const sql = 'INSERT INTO UserDB (username, password, displayName, salt) VALUES (:username, :password, :displayName, :salt)'
      db.query(sql, {params : user}).then((results) => {
        req.login(user,(err)=>{
          req.session.save(()=>{
            res.redirect('/welcome');
          });
        });
      }, (error) => {console.log(error); res.status(500);
    });
    });
  });

  route.get('/logout', (req, res) => {
      req.logout();
      req.session.save(function() {
          res.redirect('/auth/login');
      });
  });

  return route;
};
