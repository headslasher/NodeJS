const app = require('express')();
const session = require('express-session');
const OrientoStore = require('connect-oriento')(session);
const bodyparser = require('body-parser');
const hasher = require("pbkdf2-password")();
const assert = require("assert");
const opts = {
  password: "helloworld"
};
const md5 = require('md5');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

hasher(opts, (err, pass, salt, hash) => {
 opts.salt = salt;
 hasher(opts, (err, pass, salt, hash2) => {
	 assert.deepEqual(hash2, hash);

	 // password mismatch
	 opts.password = "aaa";
	 hasher(opts, (err, pass, salt, hash2) => {
		 assert.notDeepEqual(hash2, hash);
		 console.log("OK");
	 });
 });
});

app.use(bodyparser.urlencoded({extended:false}));
app.use(session({
	secret:'13r133tw3tr#R!#',
	resave: false,
	saveUninitialized : true,
	store: new OrientoStore({
	    server: 'host=localhost&port=2424&username=root&password=password&db=demodb'
	})
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(
	(username, password, done)=>{
			var userDB={//111111
											salt : 'pWZXLF3Mul3VJ/HsRVfVRHo+HRZxVB5qNZAfCnMkWLTMHZFl3T6ImShrQDjJDUkszXVjB0QKg2FVro1YI1WO0w==',
											id:'admin',
											pw:'1jSJOKDAgwreV+gyV7bvK7n8hLEkwsEVcWlDemEhz1WyAGZmBx7Jr+I/I43yj6Zn8ezJC9N+8qeMLPWYgliUXQS53yx3U/MQgFhWTT2fqMB+CRAsRcAVjTjLetWdpJXfTWPkq8BYWMYxCXsJkbiHrLd1lJyUYodR3dtp7CGQEYM=',
											name:'adminname'
									};

			let uid = username;
			let upw = password;

			for(let i =0;i<userDB.length;i++){
				let user = userDB[i];
				if(uid == user.id && md5(upw+user.salt) == user.pw){
					console.log(uid+'and'+upw);
					done(null, user);
				} else {
					console.log(uid+'and'+upw);
					done(null, false);
				}
			}
			done(null, false);
			}
));

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://www.example.com/auth/facebook/callback"
});

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
			<input type='text' id='id' name='id' size='10' placeholder='login ID'><br>
			<input type='password' id='pw' name='pw' size='10' placeholder='password'><br>
			<input type='submit' id='submit' name='submit' value='로그인'><br>
		</div>
	</form>
	`;
	res.send(output);
});

app.post('/auth/login',
  passport.authenticate('local', { successRedirect: '/welcome',
                                   failureRedirect: '/auth/login',
                                   failureFlash: false })
);

app.get('/welcome',(req, res)=>{

	if(req.session.uid=='admin'){
		let output=`
			<div>
				${req.session.uid} Welcome!
				<a href='/auth/logout'>logout</a>
			</div>
		`;
		res.send(output);
	} else if(req.session.uid == null){
		let output=`
			<div>
				not login!!
				<a href='/auth/login'>login</a>
			</div>
		`;
		res.send(output);
	}
});

app.get('/auth/logout',(req, res)=>{
	delete req.session.uid;
	req.session.save(function(){
		res.redirect('/auth/login');
	});
});

app.listen('3000',()=>{
	console.log('3000 connected');
});
