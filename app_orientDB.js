const app = require('./config/orientDB/express')();

const passport = require('./config/orientDB/passport')(app);

const auth = require('./routes/orientDB/auth')(passport);//'/auth'라우터
app.use('/auth', auth);

const topic = require('./routes/orientDB/topic')();//'/topic'라우터
app.use('/topic', topic);

app.listen(3000, ()=>{
	console.log('this server connected in port No 3000');
});
