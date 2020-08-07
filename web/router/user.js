const express = require('express');

const pool = require('./../pool.js');

const router = express.Router();

router.get('/select',(req,res)=>{
	
	pool.query('select * from  product',(err,result)=>{
		if(err)throw err;
		res.send(result);
	});
});


router.get('/login',(req,res)=>{
	let $uname = req.query.uname;
	let $upwd = req.query.upwd;
	pool.query('select * from xz_user where uname = ? and upwd = ?',[$uname,$upwd],(err,result)=>{
		if(err)throw err;
		if(result.length==0){
			//res.send({"code":"404","msg":"uwe"});
			res.send("0");
		}else{
			
			//res.send({"code":"200","msg":"success"});
			res.send("1");
		}
		
		});
});



//注册
router.post("/userReg",(req,res)=>{
	let obj= req.body;
	let uname = obj.uname;
	//console.log(uname);
	//console.log(obj);
	pool.query('select * from users where uname = ?',[uname],(err,result)=>{
		if(err)throw err;
		if(result.length > 0){
			res.send({code:202});
		}else{
			pool.query('insert into users set ?',[req.body],(err,result)=>{
				if(err)throw err;
				res.send({code:200});
				});
			
		}
		});
	
});
//查询用户id返回购物车详情
router.post('/shopping',(req,res)=>{
	let user_id= req.body.user_id;
	let mysql = `select shopping.user_id,shopping.count,product.product_id,product.title,product.price,product.preferential_price,product.pic from  product join shopping on  shopping.product_id = product.product_id where shopping.user_id = ?`;
	pool.query(mysql,[user_id],(err,result)=>{
		if(err)throw err;
		if(result.length>0){
			res.send(result);
		}else{
			res.send({code:"404"});
		}
		
	})
})

//查询id 返回用户信息
router.post('/login_uid',(req,res)=>{
	let user_id= req.body.user_id;
	//console.log(user_id);
	pool.query('select user_id,uname,ustatus from users where user_id = ?',[user_id],(err,result)=>{
		if(err)throw err;
		res.send(result);
		
	})
})

//查询id 退出登录
router.post('/quit',(req,res)=>{
	let user_id= req.body.user_id;
	
	pool.query('update users set ustatus = 0 where user_id= ? ',[user_id],(err,result)=>{
		if(err)throw err;
		res.send({code:200});
		
	})
})


//登录
router.post('/login',(req,res)=>{
	let uname = req.body.uname;
	let upwd = req.body.upwd;
	//console.log(uname,upwd);
	pool.query('select uname from users where uname = ?',[uname],(err,result)=>{
		 if(err)throw err;
		
		  if(result.length > 0){
				
			pool.query('select * from users where uname=? and upwd = ?',[uname,upwd],(err,result)=>{
			if(err)throw err;
			
			if(result.length == 0){
				
				res.send({code:403});
				
			}else{
				
				pool.query('update users set ustatus = 1 where uname=? and upwd = ? ',[uname,upwd],(err,result)=>{
					
					if(err)throw err;
					
				})
				
				res.send(result);
			}
			
			});
			
		}else if(result.length == 0){
				res.send({code:404});
		}
	});
});

module.exports = router;