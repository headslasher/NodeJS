const app = require('express')();
const cookieParser = require('cookie-parser');
app.use(cookieParser());

let products = {
		1:{title:'number1'},
		2:{title:'number2'}
};

app.get('/product',(req,res)=>{

	let content = '';
	
	for(let name in products){
		content += 
		`
		<li><a href='/cart/${name}'>${products[name].title}</a></li>
		`
	}
	
	res.send(
			`<ul>${content}</ul>`);
});

app.get('/cart/:id', (req,res)=>{

	let id = req.params.id;
	
	if(req.cookies.cart){
		var cart = req.cookies.cart;
	} else {
		var cart = {};
	}
	
	if(!cart[id]){
		cart[id] = 0;
	} 
	cart[id] = parseInt(cart[id])+1;
	res.cookie('cart',cart);
	res.send(`<a href='/product'>`+'{'+req.params.id+':'+cart[id]+'}'+`</a>`);
	
});

app.listen(3000,()=>{
	console.log('connected port 3000');
});