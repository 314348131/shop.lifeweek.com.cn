const express  =  require('express');

const pool = require('./../pool.js');

const router  = express.Router();

//查找首页动态加载数据
router.get('/select',(req,res)=>{
	let mysql = `select product.product_id,categorys.cname,product.category,product.title,product.price,product.preferential_price,product.pic from  categorys join product on categorys.category_id = product.category_id`;
	pool.query(mysql,(err,result)=>{
		if(err)throw err;
		res.send(result);
	});
});
//查询首页关键词搜索
router.post('/search_title',(req,res)=>{
	let $title = req.body.title;
	let mysql = `select * from product where title like'%${$title}%'`;
	pool.query(mysql,(err,result)=>{
		if(err){throw err};
		if(result.length>=1){
			res.send(result);
		}else{
			res.send("0");
		}
		
	});
});
//更新商品数量
router.post('/update',(req,res)=>{
	let user_id = req.body.user_id;
	let product_id = req.body.product_id;
	let count = req.body.count;
	pool.query('update shopping set count = ? where product_id = ? and user_id = ? ',[count,product_id,user_id],(err,result)=>{
		if(err)throw err;
		console.log(result);
		res.send({code:"200"});
	})
	
})


//添加商品
router.post('/insert',(req,res)=>{
	let obj = req.body;
	let user_id = req.body.user_id;
	let product_id = req.body.product_id;
	pool.query('select product_id from shopping where product_id = ? and user_id = ?',[product_id,user_id],(err,result)=>{
		if(err){throw err};
		//console.log(result);
		if(result.length>0){
			pool.query('update shopping set count =count+1 where product_id = ? and user_id = ?',[product_id,user_id],(err,result)=>{
				if(err){throw err};
				res.send({code:"200"});
			})
		}else if(result.length == 0){
			pool.query('insert into shopping set ?',[obj],(err,result)=>{
				if(err){throw err};
				res.send({code:"200"});
			})
		}
	})	
})
//删除购物车商品
router.post('/delete',(req,res)=>{
	let user_id = req.body.user_id;
	let product_id = req.body.product_id;
	pool.query('delete from shopping where  product_id = ? and user_id =? ',[product_id,user_id],(err,result)=>{
		if(err) throw err;
		if(result.affectedRows!=0){
			res.send({code:"200"});
		}
		
	})
})

//查询product_id的商品
router.post('/search_product_id',(req,res)=>{
	let $product_id = req.body.product_id;
	let mysql = `select * from product where product_id =${$product_id}`;
	pool.query(mysql,(err,result)=>{
		if(err){throw err};
			if(result.length>=1){
					res.send(result);
				}else{
					res.send("0");
				}
	});
});
//查询 category_id分类的商品信息
router.post('/search_category_id',(req,res)=>{
	let $category_id = req.body.category_id;
	let mysql = `select product.product_id,categorys.cname,product.category,product.title,product.price,product.preferential_price,product.pic from  categorys join product on categorys.category_id = product.category_id where product.category_id =${$category_id}`;
	pool.query(mysql,(err,result)=>{
		if(err)throw err;
		res.send(result);
	});
});

module.exports = router;