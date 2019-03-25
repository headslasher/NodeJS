const app = require('./config/orientDB/express')();

const passport = require('./config/orientDB/passport')(app);

app.get('/welcome', (req, res) => {
    if(req.session.passport) {
        res.send(`
            <h1>Hello, ${req.session.passport.user.displayName} </h1>
            <a href="/auth/logout">logout</a>
        `);
    } else {
        res.render('welcome');
    }
});

const auth = require('./routes/orientDB/auth')(passport);//'/auth'라우터
app.use('/auth', auth);

app.listen('3000',()=>{
	console.log('3000 connected');
});
