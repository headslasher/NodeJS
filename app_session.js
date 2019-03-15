const app = require('express')();
const session = require('express-session');
const OrientoStore = require('connect-oriento')(session);
const bodyparser = require('body-parser');
const md5 = require('md5');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

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

passport.use(new LocalStrategy(
	(username, password, done)=>{

			const userDB=[{
											salt : '!13t!#TG@G@$',
											id:'admin',
											pw:'cffa238e1cd60d78020cd97e44a39ca6',
											name:'adminname'
										},
										{
											salt : '!198wg3oihw3G@G@$',
											id:'admin1',
											pw:'101f4b240a8ce811dfe58b4d7aacaf9a',
											name:'adminname1'
										}];

			let uid = username;
			let upw = password;

			for(let i =0;i<userDB.length;i++){
				let user = userDB[i];
				if(uid == user.id && md5(upw+user.salt) == user.pw){
					done(null, user);
				} else {
					done(null, false);
				}
			}
			done(null, false);
			}
));

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
