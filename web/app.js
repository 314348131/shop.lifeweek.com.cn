const express = require('express');

const app = express();

app.listen(9090);

const cors = require('cors');

const userRouter = require('./router/user.js');

const proRouter = require('./router/pro.js');

const indexRouter = require('./router/index.js');

const bodyparser= require('body-parser');

app.use(bodyparser.urlencoded({
extended:false
}));
app.use(cors({
	origin:['http://127.0.0.1:8080','http://localhost:8080']
}))

const mysql = require('mysql');

const pool1 = mysql.createPool({
host:'127.0.0.1',
port:'3306',
user:'root',
password:'',
database:'xzqa',
connentionLimit:20
});

app.get('/category',(req,res)=>{
	pool1.query('select id,category_name from xzqa_category',(err,result)=>{
		if(err)throw err;
		res.send(result);
	})
})

app.use(express.static('public'));

app.use('/user',userRouter);

app.use('/pro',proRouter);

app.use('/index',indexRouter);




