const app = require('express')();
const session = require('express-session');
const bodyparser = require('body-parser');

app.use(bodyparser.urlencoded({extended:false}));
app.use(session({
	secret:'13r13r#R!#',
	resave: false,
	saveUninitialized : true
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

	const admin={
		id:'admin',
		pw:'admin',
		name:'adminname'
	};
	let uid = req.body.id;
	let upw = req.body.pw;
	if(uid==admin.id){
		req.session.uid = admin.id;
		res.redirect('/welcome');
	} else if (req.body.id == null){
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
				admin Welcome!
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
	} else {
		let output=`
			<div>
				${req.session.uid} Welcome!
				<a href='/auth/logout'>logout</a>
			</div>
		`;
		res.send(output);
	}
});


app.get('/auth/logout',(req, res)=>{
	delete req.session.uid;
	res.redirect('/welcome');
});

app.listen('3001',()=>{
	console.log('3001 connected');
});
