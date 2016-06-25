# Draw-Guess
### 你画我猜

#### 使用Node.js的Express框架

##### 1、环境修改：
将/public/javascripts/index_show.js中的ip地址修改    
本地使用请将    
`` this.socket = io.connect('http://your_ip:3000');``    
改成    
``this.socket = io.connect('http://127.0.0.1:3000');``    
由于我是用了nginx来反向代理nodejs，所以app.js中启用了：    
> app.enable('trust proxy');    

如不需要请注释掉    
自己定义了中间件，路径是/my_modules/var.js 主要是用于app.js与index.js(routes下的)之间的变量共享

##### 2、启动应用
在根目录下
> node app.js

##### 3、访问地址
> http://your_ip:3000/room/roomID  

将roomID替换为任意字符串，不同的字符串视作不同房间


### 版本历史     
#### v0.0.1 (TODO)
- 1、增加回合制，每回合只能一个人绘制
- 2、增加积分模块、答案匹配、储备题库
- 3、前端页面美化

#### v0.0.0
- 1、每个人都可以同时绘画操作
- 2、同一个游戏房间内可以互相发消息，其他房间内用户不会受到绘画消息和聊天消息
- 3、登录时同一个房间内不能有用户名相同的两个用户
- 4、没有记分模块，没有答案匹配模块、没有题库
- 5、没有限制同时只能一个人绘画。
