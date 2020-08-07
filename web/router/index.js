const express = require('express');

const pool = require('./../pool.js');

const router = express.Router();

router.get("/select",(req,res)=>{
	
	pool.query("select category_id,cname from categorys ",(err,result)=>{
		
		if(err){throw err};
		
		res.send(result);
		
	});
	
})


module.exports = router;