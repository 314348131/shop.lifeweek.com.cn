//设置当HTMLdom元素加载完成后
$(function(){
	
	
	//判断用户名是否满足条件
$("#uname").blur(function(e){
      let uname = $(e.target).val();	
			let reg =/^[\w]{6,12}$/;
	     if(uname=="" || !reg.test(uname) ){
		$(".msg-uname").css({"color":"red"}).html("请填写用户信息或格式错误");
			}else{
				$(".msg-uname").html("");
			}
})
//判断邮箱是否满足条件
$("#uemail").blur(function(e){
      let email = $(e.target).val();		
			let emailReg =/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
	    if(email=="" || !emailReg.test(email) ){
		$(".msg-uemail").css({"display":"","color":"red"}).html("请填写常用邮箱或格式错误");
	}else{
			$(".msg-uemail").html("");
	}
})
//判断密码格式是否正确
$("#upwd").blur(function(e){
      let upwd = $(e.target).val();		
		  let upwdReg = /^[\w]{6,18}$/;
	    if(upwd=="" || !upwdReg.test(upwd) ){
		$(".msg-upwd").css({"display":"","color":"red"}).html("请填写密码或格式错误");
	}else{
			$(".msg-upwd").html("");
			let dupwd = $("#d-upwd").val();	
			if(dupwd=="" || dupwd!=upwd){
				$(".msg-d-upwd").css({"display":"","color":"red"}).html("请填写密码或密码不统一");
			}else{
				$(".msg-d-upwd").html("");
			}
			
	}
})
$("#d-upwd").blur(function(e){
		let dupwd = $(e.target).val();	
		let upwd = $("#upwd").val();	
			if(dupwd=="" || dupwd!=upwd){
				$(".msg-d-upwd").css({"display":"","color":"red"}).html("请填写密码或密码不统一");
			}else{
				$(".msg-d-upwd").html("");
			}
})

//判断是否满足条件 执行注册操作
$("#btn").click(function(){

if($("#uname").val()!="" && $("#uemail").val()!="" && $("#upwd").val()!="" &&$("#d-upwd").val()!="" && $(".msg-uname").html()=="" && $(".msg-uemail").html()=="" &&$(".msg-upwd").html()=="" && $(".msg-d-upwd").html()==""){
	//console.log(1);
	let uname = $("#uname").val();
	let email =  $("#uemail").val();
	let upwd = $("#upwd").val();
	
	$.ajax({
		 url:"/user/userReg",
		 data:{uname,email,upwd},
		 dataType:"json",
		 type:"post",
		 success:function(data){
			// console.log(data);
			 if(data.code==202){
					 alert("用户名重复，请重新输入用户名");
			 }else if(data.code==200){
			  location.href="/user-login.html";
			 }
		 }
	})
	
}})
 
 //登录操作
 
 
})