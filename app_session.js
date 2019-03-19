const app = require('express')();
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const OrientoStore = require('connect-oriento')(session);
const bodyparser = require('body-parser');
const hasher = require("pbkdf2-password")();
const assert = require("assert");
const opts = {
  password: "admin"
};
const md5 = require('md5');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

app.use(bodyparser.urlencoded({extended:false}));
app.use(session({
	secret:'13r133tw3tr#R!#',
  resave: false,
  saveUninitialized: true,
  store: new FileStore()
}));
app.use(passport.initialize());
app.use(passport.session());

var userDB=[
            {//admin
            salt : 'zgllAK6yiR4DrV3QzUTajWTmq8Uvt1dDrC7AljsRB3NNHx4fwStJIyWhM3r2lHo0IYUJbthzyK7Oznu43ORhwA==',
            username:'admin',
            password:'5HFao6An1wFKmucWIRhxcWndCf0BXEiy9oiuTAY6OIO4uGItKmvZvi38QpsulDkC9WskwAc2P+qAiKg1LLQrPlKXutskWPBCoyiLJ/SgGmbgZuOvcFh2QpoLNHx8V1+hQsx5pZI/RTLu9A7EcBaRZHmmiHL309h7OExaJzfM4iw=',
            nickname:'adminname'
            }
          ];


app.get('/count',(req, res)=>{
	res.redirect('/tmp');
});

app.get('/tmp',(req, res)=>{
	if(!req.session.count){
		req.session.count = 1;
	} else {
		req.session.count++;
	};
	res.send('count : ' + req.session.count);
});

app.get('/auth/login',(req, res)=>{
	let output=`
	<form action='/auth/login' method='POST'>
		<div>
			<input type='text' id='username' name='username' size='10' placeholder='username'><br>
			<input type='password' id='password' name='password' size='10' placeholder='password'><br>
			<input type='submit' id='submit' name='submit' value='로그인'><br>
		</div>
	</form>
  <a href="/auth/register">go register</a>
	`;
	res.send(output);
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    let tmpUsername = username;
    let tmpPassword = password;
    for(var i = 0 ; i < userDB.length; i++){
      var user = userDB[i];
      if(tmpUsername == user.username){
        return hasher({password:tmpPassword, salt:user.salt}, (err, pass, salt, hash)=>{
          if(hash == user.password){
            console.log('LocalStrategyUser', user);
            done(null, user);
          } else {
            console.log('LocalStrategyUserfail');
            done(null, false);
          }
        });
      }
    }
    console.log('LocalStrategyNoUserfail');
    done(null, false);
  }
));

passport.serializeUser(function(user, done) {
    console.log('serializeUser', user);
    done(null, user.username);
});

passport.deserializeUser(function(id, done) {
    console.log('deserializeUser', id);
    for(var i=0; i<userDB.length; i++) {
        var user = userDB[i];
        if(user.username == id) {
            return done(null, user);
        }
    }
});
app.post('/auth/login',
  passport.authenticate('local', { successRedirect: '/welcome',
                                   failureRedirect: '/auth/login',
                                   failureFlash: true })
);

// app.post('/auth/login',(req, res)=>{
//   for(var i = 0 ; i < userDB.length; i++){
//     const user = userDB[i];
//     let tmpUsername = req.body.username;
//     let tmpPassword = req.body.password;
//     if(tmpUsername == user.username){
//       return hasher({password:tmpPassword, salt:user.salt}, function(err, pass, salt, hash){
//         if(hash == user.password){
//           req.session.username = user.username;
//           req.session.save(function(){
//           res.redirect('/welcome');
//           });
//         } else {
//           res.send('wrong admin password <a href="/auth/login">login page</a>');
//         }
//       });
//     }
//   }
//   res.send('no login <a href="/auth/login">login page</a>');
// });

app.get('/welcome', function(req, res) {
    if(req.session.nickname) {
        res.send(`
            <h1>Hello, ${req.session.nickname} </h1>
            <a href="/auth/logout">logout</a>
        `);
    }else {
        res.send(`
            <h1>Welcome</h1>
            <ul>
                <li><a href='/auth/login'>Login</a></li>
                <li><a href='/auth/register'>Register</a></li>
            </ul>
        `);
    }
});

app.get('/auth/register',(req, res)=>{
  let output=`
    <form action='/auth/register' method='POST'>
      <input type='text' id='username' name='username' placeholder='username'><br>
      <input type='text' id='password' name='password' placeholder='password'><br>
      <input type='text' id='nickname' name='nickname' placeholder='nickname'><br>
      <input type='submit' value='등록하기'>
    </form>
  `;
  res.send(output);
});

app.post('/auth/register',(req, res)=>{
  hasher({password:req.body.password}, (err, pass, salt, hash)=>{
    const user = {
      salt : salt,
      username : req.body.username,
      password : hash,
      nickname : req.body.nickname
    };
    userDB.push(user);
    req.session.username = req.body.username;
    req.session.password = req.body.password;
    req.session.nickname = req.body.nickname;
    req.session.save(()=>{
    res.redirect('/welcome')
    });
  })
});

app.get('/auth/logout',(req, res)=>{
	delete req.session.username;
  delete req.session.password;
  delete req.session.nickname;
	req.session.save(function(){
		res.redirect('/auth/login');
	});
});

app.listen('3000',()=>{
	console.log('3000 connected');
});
