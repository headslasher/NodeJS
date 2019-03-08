const app = require('express')();
const cookieParser = require('cookie-parser');
app.use(cookieParser('230r8h230rh20!53%#%@%'));

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

	if(req.signedCookies.cart){
		var cart = req.signedCookies.cart;
	} else {
		var cart = {};
	}

	if(!cart[id]){
		cart[id] = 0;
	}
	cart[id] = parseInt(cart[id])+1;
	res.cookie('cart',cart,{signed:true});
	res.redirect('/cart');
});

app.get('/cart',(req, res)=>{

	let cart = req.signedCookies.cart;

	let str = '';

	for(let num in products){
		if(!cart[num]){
			cart[num] = 0;
		}
		str += `<li>${products[num].title}:${cart[num]}</li>`
	}

	res.send(`
		<ul>
			${str}
		</ul>
		<a href='/product'>`+'ListPage'+`</a>
		`);
});

app.listen(3000,()=>{
	console.log('connected port 3000');
});
