# Draw-Guess
## 你画我猜

### 使用Node.js的Express框架

使用方法：将/public/javascripts/index_show.js中的ip地址修改

本地使用请将
>this.socket = io.connect('http://your_ip:3000');

改成
> this.socket = io.connect('http://127.0.0.1:3000');

由于我是用了nginx来反向代理nodejs，所以app.js中启用了：
> app.enable('trust proxy');

如不需要请注释掉
自己定义了中间件，路径是/my_modules/var.js
主要是用于app.js与index.js(routes下的)之间的变量共享
启动应用，在根目录下
> node app.js
