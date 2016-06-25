var d = document;
var username = getUsername();
(function() {
	//连接websocket后端服务器
	this.socket = io.connect('http://your_ip:3000');
	// this.socket = io.connect('http://127.0.0.1:3000');
	socket.on('login', function(obj) {

		showUserList(obj.allUser);
		// console.log(obj.allUser);
		showMessage('系统提示', obj.user+" 登录了");
		// console.log("get login");
	});
	socket.on('logout', function(obj) {

		showUserList(obj.allUser);
		showMessage('系统提示', obj.user+" 退出了");
		// console.log("get logout");
	});
	socket.on('message', function(obj) {
		showMessage(obj.user, obj.content);
		// console.log("get message");
	});


	//点击回车发送消息
	d.getElementById('content').onkeydown = function(e) {
		e = e || event;
		if(e.keyCode === 13) {
			sendMsg();
		}
	};
})();

//发送消息
function sendMsg() {
	var content = d.getElementById('content').value;
	content = content.replace(/(^\s*)|(\s*$)/g, "");
	var mess = {
		user: html_encode(username),
		content: html_encode(content)
		// time: new Date().toLocaleString()
	}
	if(content != "")
	{
		this.socket.emit('message', mess);
	}
	d.getElementById('content').value = "";
};

//获取cookie中username
function getUsername() {
	var tmp;
	// var start = d.cookie.indexOf('username=');
	// if(start!=-1) {
	// 	start = start + 'username='.length;
	// 	var end = d.cookie.indexOf(';', start);
	// 	if(end==-1) end = d.cookie.length;
	// 	//decodeURI防止中文乱码
	// 	return decodeURI(d.cookie.substring(start, end));
	// }
	ajax({
		url: "/get",              //请求地址
		type: "POST",                       //请求方式
		data: {get_user:1},        //请求参数
		dataType: "json",
		success: function (data) {
			data=JSON.parse(data);
			// alert(data);
			if(data.status==1){
				// alert("登录成功");
				if(data.username)
				{
					username = html_encode(data.username);
				}
				socket.emit('login', {
					id: new Date().getTime()+""+Math.floor(Math.random()*899+100),
					name: html_encode(username),
					roomID: data.roomID
				});
				console.log(data.username+ " room: " +data.roomID);
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
	return "";
};

function showUserList(userList) {
	//清空原数据
	var usl = d.getElementById('usersList');
	usl.innerHTML = "";

	//将所有用户输出
	for(key in userList) {
		var li = d.createElement('li');
		li.innerHTML = userList[key];
		usl.appendChild(li);
	}
}

function showMessage(user, content) {
	var msl = d.getElementById('messageList');

	var li = d.createElement('li');
	li.innerHTML = new Date().toLocaleTimeString()+"<label style='color:#ff0000'> "+user +" : </label> " + content;
	msl.insertBefore(li,msl.childNodes[0]);
}

var btn1 = document.getElementById("btn");
btn1.addEventListener("click", function() {
	sendMsg();
});
