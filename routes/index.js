// var express = require('express');
// var router = express.Router();
//
// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
// router.post('/index',function(req,res){
// 	console.log(req.body.username);
// });
// module.exports = router;
var r = require('../my_modules/var');

//new
module.exports = function(app, dirname) {
	app.get('/', function(req, res) {
		res.sendFile(dirname+'/views/index.html');
	});
	// app.get('/Chat', function(req, res) {
	// 	res.sendFile(dirname+'/views/index.html');
	// });//nginx设置了反向代理
	app.post('/login/:roomID', function(req, res) {
		req.session.username = req.body.username;
		req.session.roomID = req.params.roomID;
		// console.log(req.session.usern);
		// res.cookie('username', req.body.username, {maxAge: 1000*60*60,signed:true});
		var roomID = req.params.roomID;
		// res.cookie('roomID', roomID, {maxAge: 1000*60*5,signed:true});
		// console.log(req.body.username+"登录了"+roomID+" by index.js");
		var status = 1;
		if(!r.roomInfo[roomID]){}
		else{
			var i = r.roomInfo[roomID].length;
			// console.log("I:"+i);
			while(i--)
			{
				if(r.roomInfo[roomID][i]==req.body.username)
				{
					status = 0;
				}
				// console.log(r.roomInfo[roomID][i]);
			}
		}
		// console.log(r.roomInfo[roomID]+"  index.js");
		var tmp={status : status,roomID:roomID};
		res.send(tmp);
		res.end();
	});
	app.post('/get', function(req, res) {
		var username = req.session.username;//从session中读取
		// console.log(username);
		// var usr1 = req.signedCookies.username;
		var roomID = req.session.roomID;
		// console.log(usr1);
		var tmp={status : 1,username:username,roomID:roomID};
		res.send(tmp);
		res.end();
	});
	app.get('/show', function(req, res) {
		// req.session.username = req.body.username;
		//res.cookie('username', req.body.username, {maxAge: 1000*60*60});
		//console.log(req.body.username+"登录了");
		// var tmp={status : 1};
		// res.send(tmp);
		// res.end();
		res.sendFile(dirname+'/views/index_show.html');
	});
	app.get('/room/:roomID', function (req, res) {
		var roomID = req.params.roomID;
		res.sendFile(dirname+'/views/index.html');
	});
};
