const app = require('express')();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());

app.set('view engine', 'pug');
app.set('views','./views_file');

app.get('/count', (req, res)=>{
	
	let count;
	
	if(req.cookies.count){
		count = parseInt(req.cookies.count);
	} else {
		count = 0;
	}
	count = count+1;
	res.cookie('count', count);
	res.send('count : ' + count);
});

app.listen(3000, function() {
	console.log('connection');
});
