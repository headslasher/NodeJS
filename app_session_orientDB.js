const app = require('express')();//express

const session = require('express-session');//session
const FileStore = require('session-file-store')(session);//session을 파일형태저장
const OrientoStore = require('connect-oriento')(session);//session을 orient에저장
const OrientDB = require('orientjs');//orient접속
const server = OrientDB({//orient접속할 계정 정보
   host:       'localhost',
   port:       2424,
   username:   'root',
   password:   'password'
});
const db = server.use('demodb');//orient접속할 DB
app.use(session({//orient접속 session정보
	secret:'13r133tw3tr#R!#',
  resave: false,
  saveUninitialized: true,
  store: new OrientoStore({
    server : 'host=localhost&port=2424&username=root&password=password&db=demodb'
  })
}));

const bodyparser = require('body-parser');//body form 태그 정보 파싱

const hasher = require("pbkdf2-password")();//pbkdf2암호화
const assert = require("assert");
const md5 = require('md5');//md5암호화

const passport = require('passport');//passport
const LocalStrategy = require('passport-local').Strategy;//로컬에서 지정한 인증방식
const FacebookStrategy = require('passport-facebook').Strategy;//facebook에서 지정한 인증방식

app.set('views','./views/orientDB');//pug 템플릿
app.set('view engine','pug');//pug 템플릿 폴더, 확장자 지정

app.use(bodyparser.urlencoded({extended:false}));
app.use(passport.initialize());
app.use(passport.session());

var userDB=[
            {//admin
            salt : 'zgllAK6yiR4DrV3QzUTajWTmq8Uvt1dDrC7AljsRB3NNHx4fwStJIyWhM3r2lHo0IYUJbthzyK7Oznu43ORhwA==',
            username:'admin',
            password:'5HFao6An1wFKmucWIRhxcWndCf0BXEiy9oiuTAY6OIO4uGItKmvZvi38QpsulDkC9WskwAc2P+qAiKg1LLQrPlKXutskWPBCoyiLJ/SgGmbgZuOvcFh2QpoLNHx8V1+hQsx5pZI/RTLu9A7EcBaRZHmmiHL309h7OExaJzfM4iw=',
            displayName:'adminname'
            }
          ];

app.get('/auth/login',(req, res)=>{
  res.render('auth/login');
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    let tmpUsername = username;
    let tmpPassword = password;
    const sql = 'SELECT * FROM UserDB WHERE username = :username';
    db.query(sql, {params : tmpUsername}).then((results)=>{
      console.log(results);
      if(results.length == 0){
        done(null, false);
      }
      return hasher({password:tmpPassword, salt:user.salt}, (err, pass, salt, hash) => {
        if(hash == user.password){
        done(null, user);
        } else {
        done(null, false);
        }
      });
    }, (error) => {res.status(500)});
    }
));

passport.use(new FacebookStrategy({
    clientID: '439858690100776',
    clientSecret: '111db73bfcd6e660c00c4331064792b1',
    callbackURL: "/auth/facebook/callback",
    profileFields:['id','email','gender','link','locale','name','timezone','updated_time','verified','displayName']
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile);
    let authId = profile.id;
    const sql = 'SELECT * FROM UserDB WHERE username = :username'
    db.query(sql,{params:{username:authId}}).then((results)=>{
      if(results.length == 0){
        let newUser = {
          'username': profile.id,
          'displayName': profile.displayName,
          'email' : profile.emails[0].value
        };
        const sql = 'INSERT INTO UserDB (username, displayName) VALUES (:username, :displayName)';
        db.query(sql, {params:newUser}).then(()=>{
          done(null, newUser);
        }, (err)=>{
          done('error');
        })
      } else {
        done(null, results[0]);
      }
    });

  }
));

passport.serializeUser(function(user, done) {
    console.log('serializeUser', user);
    done(null, user.username);
});

passport.deserializeUser(function(id, done) {
    console.log('deserializeUser', id);
    const sql = 'SELECT * FROM UserDB WHERE username = :username';
    db.query(sql, {params:{username:id}}).then((results)=>{
      if(results.length == 0){
        done(null, 'There is no user');
      } else {
        done(null, results[0]);
      }
    })
    for(var i=0; i<userDB.length; i++) {
        var user = userDB[i];
        if(user.username == id) {
          console.log('done', id);
            done(null, user);
        }
    }
});

app.post('/auth/login',
  passport.authenticate('local', { successRedirect: '/welcome',
                                   failureRedirect: '/auth/login',
                                   failureFlash: true })
);


app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/welcome',
                                      failureRedirect: '/auth/login' }));


app.get('/welcome', function(req, res) {
    if(req.session.displayName) {
        res.send(`
            <h1>Hello, ${req.session.displayName} </h1>
            <a href="/auth/logout">logout</a>
        `);
    } else {
        res.render('welcome');
    }
});

app.get('/auth/register',(req, res)=>{
  res.render('auth/register');
});

app.post('/auth/register',(req, res)=>{
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
        })
      })}, (error) => {console.log(error); res.status(500)});
    userDB.push(user);
    req.session.username = req.body.username;
    req.session.password = req.body.password;
    req.session.displayName = req.body.displayName;
    req.session.save(()=>{
    res.redirect('/welcome')
    });
  })
});

app.get('/auth/logout', (req, res) => {
    req.logout();
    req.session.save(function() {
        res.redirect('/welcome');
    })
});

app.listen('3000',()=>{
	console.log('3000 connected');
});
