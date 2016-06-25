var height = window.innerHeight;
// console.log(height);
var main = document.getElementById('main');
var btn = document.getElementById("btn");
main.style.height = height + 'px';
btn.style.top = (height-90) + 'px';
document.getElementById('usr_name').onkeydown = function(e) {
	e = e || event;
	if(e.keyCode === 13) {
		btn.click();
	}
};
btn.addEventListener("click", function() {
	var name = document.getElementById("usr_name").value;
	name = name.replace(/(^\s*)|(\s*$)/g, "");
	if(name=='')
	{
		alert("请填写用户名哦！");
		return false;
	}
	var url = window.location.href;
	var splited = url.split('/');
	var roomID = splited[splited.length - 1];
	ajax({
		url: "/login/"+roomID,              //请求地址
		type: "POST",                       //请求方式
		data: {new_topic:true,username: name},        //请求参数
		dataType: "json",
		success: function (data) {
			data=JSON.parse(data);
			if(data.status==1){
				//alert("登录成功");
				window.location.href="/show";
			}
			else if(data.status==0){
				alert("已经有人登录了哦");
			}
			// 此处放成功后执行的代码
		},
		fail: function (status) {
			// 此处放失败后执行的代码
		}
	});
});
