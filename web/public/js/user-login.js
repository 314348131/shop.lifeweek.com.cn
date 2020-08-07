$(function(){
	
	$("#login").click(function(){
		let uname = $("#uname").val();
		let upwd  = $("#upwd").val();
		if(uname=="" || upwd==""){
			alert("用户名和密码不能为空");
		}else{
			$.ajax({
				url:"/user/login",
				data:{uname,upwd},
				type:"post",
				dataType:"json",
				success:function(data){
					console.log(data);
					if(data.code==404){
						alert(`用户或密码错误！！！`);
					}else if(data.code==403){
						alert(`用户或密码错误！！！`);
					}else{
						$.cookie("user_id",data[0].user_id);
						location.href="index.html";
						
					}
				}
			})
		}
	});
})