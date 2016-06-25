var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var session = require('express-session');
// var users = {};
var r = require('./my_modules/var');

app.set('port', process.env.PORT || 3000);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.enable('trust proxy');//域名反向代理必备啊啊啊啊啊啊啊啊啊啊啊啊啊！！！！
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser("jfamily"));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'jfamily',//用来对session数据进行加密的字符串.这个属性值为必须指定的属性。
  name: 'name',//表示cookie的name，默认cookie的name是：connect.sid。
  cookie: {maxAge: 60*60*1000},//cookie过期时间，毫秒。
  resave: false,//是指每次请求都重新设置session cookie，每次请求都会再设置x毫秒。
  saveUninitialized: false,//是指无论有没有session cookie，每次请求都设置个session cookie ，默认给个标示为 connect.sid。
}));

// app.use('/', routes);
// app.use('/users', users);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// // error handlers
//
// // development error handler
// // will print stacktrace
// if (app.get('env') === 'development') {
//   app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//       message: err.message,
//       error: err
//     });
//   });
// }
//
// // production error handler
// // no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.render('error', {
//     message: err.message,
//     error: {}
//   });
// });
//WebSocket连接监听
io.on('connection', function(socket) {
  // console.log("有一个新连接");
  //打印握手信息
  // console.log(socket.handshake);
	var roomID;
  //登录
  socket.on('login', function(user){
	// var url = socket.request.headers.referer;
	// var splited = url.split('/');
	roomID = user.roomID;   // 获取房间ID
	if (!r.roomInfo[roomID]) {
      r.roomInfo[roomID] = [];//如果房间为空创建房间
	  r.personCount[roomID] = 0;
    }
	// r.roomInfo[roomID].push(user.name);
	socket.name = r.roomInfo[roomID].push(user.name);
    // users[user.id] = user.name;
    r.usersCount++;
	r.personCount[roomID]++;
    // console.log("用户数："+r.usersCount);
	socket.join(roomID);
    io.to(roomID).emit('login', {
      user: user.name,
      allUser: r.roomInfo[roomID],
    });
	// console.log(r.roomInfo);
	console.log(user.name + '加入了' + roomID);
	console.log(r.roomInfo[roomID]);
  });

  //退出
  socket.on('disconnect', function(){
	  if(r.roomInfo[roomID])
	  {
		  if(r.roomInfo[roomID][socket.name-1]){
  	      var username = r.roomInfo[roomID][socket.name-1];
  	      r.roomInfo[roomID].splice(socket.name-1,1);
  	      r.usersCount--;
  		  r.personCount[roomID]--;
  	      io.to(roomID).emit('logout', {
  	        user: username,
  	        allUser: r.roomInfo[roomID],
			});
  		console.log(username + '退出' + roomID);
		console.log(r.roomInfo[roomID]);
  	    //   console.log("用户数："+r.usersCount)
  	    }
	  }
  });

  //接收消息
  socket.on('message', function(mess) {
    //广播给所有用户
    io.to(roomID).emit('message', mess);
	// console.log("向"+roomID+"发消息");
  });

  socket.on('beginDraw', function(p){
    socket.broadcast.to(roomID).emit('beginDraw', p);
  });
  socket.on('draw', function(p) {
    socket.broadcast.to(roomID).emit('draw', p);//除了自己的都更新
  });
  socket.on('endDraw', function() {
    io.to(roomID).emit('endDraw');
  });
  socket.on('clear', function() {
    socket.broadcast.to(roomID).emit('clear');
  });
  socket.on('brushChanged', function(brush){
    io.to(roomID).emit('brushChanged', brush);
  });
});

server.listen(app.get('port'), function() {
  console.log("Chat程序开始监听端口："+app.get('port'));
});
routes(app,__dirname)
module.exports = app;
