const app = require('express')();
const session = require('express-session');
const OrientoStore = require('connect-oriento')(session);
const bodyparser = require('body-parser');
const md5 = require('md5');

app.use(bodyparser.urlencoded({extended:false}));
app.use(session({
	secret:'13r133tw3tr#R!#',
	resave: false,
	saveUninitialized : true,
	store: new OrientoStore({
	    server: 'host=localhost&port=2424&username=root&password=password&db=demodb'
	})
}));

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

app.post('/auth/login',(req, res)=>{
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

	let uid = req.body.id;
	let upw = req.body.pw;

	for(let i =0;i<userDB.length;i++){
		if(uid == userDB[i].id && md5(upw+userDB[i].salt) == userDB[i].pw){
			req.session.uid = userDB[i].id;
			req.session.upw = userDB[i].pw;
			return req.session.save(() => {
						res.redirect('/welcome');
			})
		}
	}
	if (req.body.id == null){
	res.redirect('/auth/login');
	} else {
	req.session.uid = req.body.id;
	let output=`
		<div>
			user page
			<a href='/welcome'>welcome</a>
		</div>
	`;
	res.send(output);
	}
});

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
