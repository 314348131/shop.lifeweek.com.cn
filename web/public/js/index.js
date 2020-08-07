//设置 在网站HTML DOM元素加载后再加载数据
$(function(){
	
	
	//封装方法 加入购物车
	
	function addshopping(product_id){
		let user_id=($.cookie()).user_id;
		$.ajax({
			url:"/pro/insert",
			data:{product_id,user_id},
			type:"post",
			dataType:"json",
			success:function(data){
				//console.log(data);
				//alert(data);
				alert("添加成功");
				location=location 
			}
		})
		
		
	}
		
		
	//设置头部购物默认数量
		$("#count").html("0");
	//获取cookie  判断是否登录
    if($.cookie("user_id")){
			let user_id=($.cookie()).user_id;
			console.log(user_id);
			//获取用户id判断查询用户登录状态
		   $.ajax({
				url:"/user/login_uid",
				data:{user_id},
				type:"post",
				dataType:"json",
				success:function(data){
					//console.log(data)
					if(data[0].ustatus==1){
						$("#uname_login").html(`欢迎！${data[0].uname}`);
						$("#quit").html(`<a id ="quit_id" href="javascript:;">退出</a>`);
					}
				}
			})
			
		//获取用户id查询购物车内容
			$.ajax({
				url:"/user/shopping",
				data:{user_id},
				type:"post",
				dataType:"json",
				success:function(data){
				    //console.log(data);
						if(data.code!=404){
						let unbcount = 0;
					for(obj of data){
						unbcount += obj.count;
						$(".trAfter").after($(`<tr >
									<td>
								<img width="80" height="80" src="${obj.pic}" alt=""><br>
								<a href="javascript:;">${obj.title}</a>
							</td>
							<td>￥<span class="sprice">${obj.price.toFixed(2)}</span>元</td>
							<td><input class="update" data_sid=${obj.product_id} type="text" value="${obj.count}"></td>
							<td>￥<span class="scount">${(obj.price*obj.count).toFixed(2)}</span>元</td>
							<td><button data_sid=${obj.product_id} class="delete"  type="button">删除</button></td>
						</tr>
						`))}	
				//更新商品数量
						$(".update").blur(function(e){
							$this = $(e.target);
							let product_id = $this.attr("data_sid");
							let count = $this.val();
							//console.log(product_id,count);
							$.ajax({
								url:"/pro/update",
								data:{product_id,user_id,count},
								type:"post",
								dataType:"json",
								success:function(data){
									console.log(data);
									if(data.code == "200" ){
										alert("已更新商品");
										location=location 
									}
								}
							})
							
						})
						
								
						
		//动态计算小计和总价格	
				$("#count").html(unbcount)
				count()
		//购物车删除商品
				$(".delete").click(function(e){
					$this = $(e.target);
					let product_id = $this.attr("data_sid");
					//console.log(product_id);
					if(confirm("是否删除?")){
					$.ajax({
						url:"/pro/delete",
						data:{product_id,user_id},
						type:"post",
						dataType:"json",
						success:function(data){
						console.log(data);
						if(data.code==200){
							alert("删除成功");
							location=location 
						}
						}
					})
					}
				})

				}}
			})	
		}
//动态计算小计和总价格 定义一个函数 重复使用
function count(){
	let val = 0;
	$(".scount").each(function(i,e){
		let	$e = $(e)
		val+= parseInt($e.html());
		})
	$(".shoppcount").html(val.toFixed(2))
}	
//点击退出   更新状态  并且   还原页面状态  

$("#quit").click(function(){
	if($.cookie("user_id")){
		let user_id=($.cookie()).user_id;
		//console.log(user_id);
	$.ajax({
		url:"/user/quit",
		data:{user_id},
		type:"post",
		dataType:"json",
		success:function(data){
			console.log(data)
			if(data.code==200){
				$.cookie("user_id","");
				location.href="index.html";
			}
		}
		
	})
	
	}
})
	//获取URL中的查询部分  使用 URLSearshParams
	 let search = location.search;
	  let USP = new URLSearchParams(search);
	 if(search.indexOf("title")!=-1){//判断查询部分是那一部分请求的
		 let title = USP.get("title");//获取请求参数
		 $.ajax({ //提交 ajax后台查询  根据关键词模糊查询
		 	url:"/pro/search_title",
		 	data:{title},
		 	type:"post",
		 	dataType:"json",
		 	success:function(data){
		 		console.log(data);
				$("#psearch").html(`商品搜索_${title}`);
				var $Commoditys = $("#Commodity");
				if(data!=0){
					for(var obj of data){
					$Commoditys.append(Commodity(obj.product_id,obj.pic,obj.title,obj.preferential_price));
					}	
				}else{
					var $nosearch = $(`<div class="nosearch">无法搜索到您要找的商品！</div>`)
					$Commoditys.append($nosearch);
					}
				
		 	}
		 })	
	 }else if(search.indexOf("product_id")!=-1){//判断查询部分是那一部分请求的
		 let product_id = USP.get("product_id");//获取请求参数  
		 $.ajax({ //提交 ajax后台查询  根据商品id 查询
		 	url:"/pro/search_product_id",
		 	data:{product_id},
		 	type:"post",
		 	dataType:"json",
		 	success:function(data){
		 	//console.log(data);
			$("#psearch").html(`商品详情_${data[0].title}`);
			var $Commoditys = $("#Commodity");
			if(data!=0){
				$Commoditys.append($(`<div class="col-5">
								<img src="${data[0].pic}"  width="90%" alt="">
								<div class="row">
									<div class="col-2">
										<img class="m-3 onbg" src="${data[0].pic}" width="50px" alt="">
									</div>
								</div>
							</div>
							<div class="col-7 text-left message">
								<div><span>${data[0].title}</span></div>
								<div><span>商品点击数：439</span></div>
								<div><span>本店售价：<span class="msgprice">￥${data[0].price}元</span></span></div>
								<div><span>注册用户：<span class="msgprice">￥${data[0].price}元</span></span></div>
								<div><span>用户评价： <img src="img/stars5.gif" alt=""></span></div>
								<div><span>商品总价：<span class="msgprice">￥${data[0].price}元</span></span></div>
								<div><span>购买数量：<input type="text" value="1"></span></div>
								<div><a id="addshop" data_shop="${data[0].product_id}" ><img src="img/goumai2.gif" alt=""></a>
								     <a id="addshop1" data_shop="${data[0].product_id}"><img src="img/shoucang2.gif" alt=""></a>
								</div>
							</div>
							<h3 class="col-12 boxtop" id="h3msg"><span>商品描述：</span></h3>`))
							
							let product_id = $("#addshop").attr("data_shop")
							
							$("#addshop").click(function(){
								addshopping(product_id)
							});
							$("#addshop1").click(function(){
								addshopping(product_id)
							});
							
							
					var arr = data[0].details.split("|");
					//console.log(arr);
					arr.reduce((prev,ele)=>{
						$(`<p>${ele}</p>`).appendTo(prev);
						return prev;
					},$(`<div class="divmsg"></div>`)).insertAfter("#h3msg");
					
			}else{
				var $nosearch = $(`<div class="nosearch">无法搜索到您要找的商品！</div>`)
				$Commoditys.append($nosearch);
				}
		 			
		 	}
		 })	
	 }else if(search.indexOf("category_id")!=-1){//判断查询部分是那一部分请求的
		 let category_id = USP.get("category_id");//获取请求参数
		 //console.log(category_id);
		 $.ajax({//提交 ajax后台查询  根据商品分类id 查询
		 	url:"/pro/search_category_id",
		 	data:{category_id},
		 	type:"post",
		 	dataType:"json",
		 	success:function(data){
		 		console.log(data);
		 			
		 			var $Commoditys = $("#Commodity");
		 			if(data!=0){
		 				for(var obj of data){
							$("#psearch").html(`${obj.cname}>${obj.title}`);
		 				$Commoditys.append(Commodity(obj.product_id,obj.pic,obj.title,obj.preferential_price));
		 				}	
		 			}else{
		 				var $nosearch = $(`<div class="nosearch">无法搜索到您要找的商品！</div>`)
		 				$Commoditys.append($nosearch);
		 				}
		 	}
		 })	
		 
	 }
	
		//头部查询关键字搜索商品 使用商品title属性搜索商品 使用模糊查询
		//console.log($("#searchB"));
		
		$("#search").keyup((e)=>{
			//console.log(e.key);
			if(e.keyCode==13){
				$("#searchB").click();
			} 
			
		})
		$("#searchB").click(function(){
		     var title = $("#search").val().trim();
			 if(title!=""){
				 location.href=`product_details.html?title=${title}`;
			 }
		})
		
	//////////////
	//需要重复使用的 封装到方法里面
	function Commodity(product_id,pic,title,preferential_price){
		return `<div class="col-4">
								<div class="m-3">
									<a href="product_details.html?product_id=${product_id}"><img class="w-100" src="${pic}" alt=""></a>
									<p>	<a class="title" href="product_details.html?product_id=${product_id}">${title}</a></p>
									 	<font class="price">￥${preferential_price}元</font>
								</div>
				</div>`
	}
	
	function content(product_id,pic,title,price,preferential_price){
				 return `<div class="col-3">
						<div class="m-3">
							<a href="product_details.html?product_id=${product_id}"><img class="w-100" src="${pic}" alt=""></a>
							<p>
								<a class="title" href="product_details.html?product_id=${product_id}">${title}</a>
							</p>
							<font class="price1" style="text-decoration:line-through;">￥${price}元</font><br>
							<font class="price">￥${preferential_price}元</font>
						</div>
					</div>`
	}
	///////////////////////
	//查找导航栏数据 并加载到导航栏
	$.ajax({
		url:"/index/select",
		type:"get",
		dataType:"json",
		success:function(data){
			var $ulleft = $(".navleft");
			var $ul = $(".nav");
			for(obj of data){
				$ul.append($(`<li><a href="product_details.html?category_id=${obj.category_id}">${obj.cname}</a></li>`));
				$ulleft.append($(`<li><a href="product_details.html?category_id=${obj.category_id}">${obj.cname}</a></li>`));
			}
		}
	})
	
	
	
//查询首页中部数据  并加载到相应位置
 $.ajax({
	 url:"/pro/select",
	 type:"get",
	 dataType:"json",
	 success:function(data){
		// console.log(data);
		 //获取需要添加内容的元素
		var $div1 = $(".f1");
		var $div2 = $(".f2");
		var $div3 = $(".f3");
		//遍历后台发送的数据
		for(obj of data){
			//判断数据分类
			if(obj.category=="新品上市"){
				//添加数据到对应元素里面
				$div1.append(content(obj.product_id,obj.pic,obj.title,obj.price,obj.preferential_price));
				//判断数据分类
			}else if(obj.category=="热销商品"){
				//添加数据到对应元素里面
				$div2.append(content(obj.product_id,obj.pic,obj.title,obj.price,obj.preferential_price));
				//判断数据分类
			}else if(obj.category=="编辑推荐"){
				//添加数据到对应元素里面
				$div3.append(content(obj.product_id,obj.pic,obj.title,obj.price,obj.preferential_price));
			}
		}
	 }
 })


})
