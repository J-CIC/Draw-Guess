var beginx=0,beginy=0,movex=0,movey=0;
var last = null;
var ismouseDown=false;
var c = document.getElementById("myCanvas");
var width = document.body.offsetWidth;
c.width = width;
c.height = 300;
var cxt = c.getContext("2d");

var crw, crh, cx, cy, cvw, cvh;
//画笔
var brush = {
	"color": "#000000",
	"width": "1"
}
document.getElementById('green').addEventListener("click",function(){
	changeColor('green');
});
document.getElementById('blue').addEventListener("click",function(){
	changeColor('blue');
});
document.getElementById('red').addEventListener("click",function(){
	changeColor('red');
});
document.getElementById('pink').addEventListener("click",function(){
	changeColor('pink');
});
document.getElementById('black').addEventListener("click",function(){
	changeColor('black');
});
document.getElementById('yellow').addEventListener("click",function(){
	changeColor('yellow');
});
document.getElementById('clear').addEventListener("click",clean);
var change_color= document.getElementById('change_color');
change_color.addEventListener("click",function(){
	document.getElementById('color').style.display = 'block';
});
function changeColor(color)//改变颜色
{
	brush.color = color;
	document.getElementById('color').style.display = 'none';
	// console.log(color);
	brushChanged();
}
function changeThickness()//改变笔触粗细
{
	brush.width = thick.value;
	brushChanged();
}
function useEraser()//使用橡皮
{
	brush.width = rubber.value;
	brush.color = "white";
	brushChanged();
}

function brushChanged() {
	socket.emit('brushChanged', brush);
}
this.socket.on('brushChanged', function(brush){
	this.brush = brush;

	cxt.strokeStyle = this.brush.color;
	cxt.lineWidth = this.brush.width;
})
function isTouch(event){
	var type = event.type;
	if(type.indexOf('touch')>=0){
		return true;
	}else{
		return false;
	}
}
function mousedown(event)
{
	ismouseDown=true;
	var xy = pos(event);
	socket.emit('beginDraw', {
		'x': xy.x,
		'y': xy.y
	})

}
function mouseup(event)
{
	ismouseDown=false;
	event.preventDefault();
	last = null;
	socket.emit('endDraw');
}
function mousemove(event)
{
	if(ismouseDown==true)
	{
		// mx = getRealX(event.clientX);
		// my = getRealY(event.clientY);
		event.preventDefault();
		var xy = pos(event);
		if(last!=null){
			cxt.beginPath();
			cxt.moveTo(last.x,last.y);
			cxt.lineTo(xy.x,xy.y);
			// cxt.lineTo(mx,my);
			cxt.stroke();
		}
		last = xy;
		socket.emit('draw', {
			'x': xy.x,
			'y': xy.y
		})
	}

}
function pos(event){
	var x,y;
	if(isTouch(event)){
		x = event.touches[0].pageX / cvw * crw;
		y = event.touches[0].pageY / cvh * crh;
	}else{
		x = (event.offsetX) / cvw * crw;
		y = (event.offsetY) / cvh * crh;
		// x = event.pageX - this.offsetLeft;
		// y = event.pageY - this.offsetTop;
	}
// log('x='+x+' y='+y);
	return {x:x,y:y};
}
//将当前用户的显示坐标转化为画布中的实际坐标
function initSize() {
	crw = c.width;	//画布的实际宽度
	crh = c.height;	//画布的实际高度
	cx = c.offsetLeft;	//画布起点x值
	cy = c.offsetTop;	//画布起点y值
	cvw = c.offsetWidth;	//画布显示出的宽度
	cvh = c.offsetHeight;	//画布显示出的高度
};

this.socket.on('beginDraw', function(point){
	cxt.beginPath();
	cxt.moveTo(point.x, point.y);
	// console.log("get beginDraw");
});
this.socket.on('draw', function(point){
	if(last!=null){
		cxt.moveTo(last.x,last.y);
		cxt.lineTo(point.x,point.y);
		// cxt.lineTo(mx,my);
		cxt.stroke();
	}
	// console.log("get draw");
	last = point;
});
this.socket.on('endDraw', function(){
	ismouseDown=false;
	last = null;
	cxt.closePath();
	// console.log("UP");
});
this.socket.on('clear', function(){
	cxt.clearRect(0,0,c.width,c.height);
	// console.log("get clear");
});
function clean(){
	cxt.clearRect(0,0,c.width,c.height);
	socket.emit('clear');
	// console.log("clear");
}
c.onmousedown = mousedown;
c.onmousemove = mousemove;
c.onmouseup = mouseup;
c.addEventListener('touchstart',mousedown,false);
c.addEventListener('touchmove',mousemove,false);
c.addEventListener('touchend',mouseup,false);
