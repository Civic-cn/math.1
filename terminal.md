## 终端命令
打印当前工作目录-----pwd
列出当前目录下的 “文件 ”列表-----ls
查看当前目录的隐藏文件---ls -la
进入某个目录-----cd
创建目录（文件夹）----mkdir +目录名
创建文件-----touch 哪个目录名/文件名.md
返回上一级-----cd ..
查看文件内容----cat
删除文件----rm   //remove缩写 
删除目录----rmdir //remove direcion  //若显示不是口的，但里面没有文件，可能是隐藏文件，用ls -la查看是否有 .DS_Store，将其删除
清空终端内容---clear
回到家目录--cd ~

使用vscode打开某个文件-----code 文件路径
修改某个文件里的内容----vim 文件名
不保存退出vim----:q!
保存退出vim---:wq
用默认方式打开xx（类似双击）---open 路径/文件..等等    打开当前路径的 open ./ 
## git相关
//git适合管理文本文件（代码），而不是二进制
1. git本地账户初始化
git config user.name //会显示当前用户名
git config --global user.name "xxx" //修改提交git人名字
git config --global user.email
git config --global user.email "你的邮箱@xx.com" //邮箱同理

2. 本地初始化git
git init //在本地生成隐藏文件 xx.git,可用ls -la查看

3. 查看git目前什么状态，有哪些跟踪了，有哪些没有跟踪，哪些提交了
git status

4. 添加未跟踪文件或者想要提交的文件进入缓冲区
git add //add后并未提交仓库，而是缓存区
git add. //把当前目录下所有文件提交到暂存区
有不想被提交的文件，我们可以写到gitignore里
gitignore是一个文件，不是文件夹，用touch建立，再用vim（修改）
把不想被提交的文件名写进去，git add .就不会提交他们了，但是gitignore要提交至暂存区 git add就行


5. 正式提交到仓库
git commit -m "第一次提交" //“xxx”是备注，可写可不写

6. 查看本地提交历史，用于查看想回溯的版本代码
 git log --oneline
 终端返回：
 提交编号x1 提交备注x
 提交编号x2 提交备注x

7. 回到某次版本
git checkout 版本编号xxx 
git checkout master(这是最新一次的分支名) //表示回到最近版本
//此时版本回到该版本，数据回溯！！！

8. git远程操控
配置ssh信任方式
 远程仓库地址 git@github.com:Civic-cn/math.1.git
 这是ssh方式的，还有http方式，http方式比较麻烦，每次都有输入密码
 用ssh方式要先配置公钥密钥 在家目录下，就是打开终端的地方，然后ls -la
 查看有没有.ssh文件，我之前问ai配置过了

9. 关联本地仓库和远程仓库

 cd ~/Desktop/test  //要到项目所在地址操作

 1. 改成这个仓库的地址
 git remote set-url origin git@gitee.com:wcj2913522514/bilibili-practical-application.git

 2. 确认改对了
 git remote -v

 3. 推送
 git push -u origin main


先 add 再commit 再push 
 //类似上述三个操作

 ## 云服务器相关
远程登陆 ssh root@101.96.206.125
密码 Wcj2913522514. 
ip 101.96.206.125
退出云服务器 exit


## Nginx相关
80端口指向的是

	listen 80 default_server;
	listen [::]:80 default_server;

	
 /home/ubuntu/bilibili-practical-application

	root /var/www/html;     //这里，cat里面就知道返回的页面怎么样了


## 新前端 模块化js
1. 用import export代替script引用

## vite作用：热更新 文件合并 ...
# 前端构建工具 工程治理 vite（构建/打包工具）使用nodejs中的npm中下载
运行在 node.js上
 1. 热更新
  本来使用模块化，我们的检查更新内容要发远程仓库，再服务器上pull下来更新才能看到。 我们使用。 构建工具  就可以 ”热更新“，即自己浏览器刷新查看更新内容
 2. 文件合并
 本来每个css都要一次请求发送， 构建工具可以帮我们合并成一次请求，大大降低访问网站的延迟
 3. 解决浏览器缓存问题 给不同文件加哈希值，只要文件一变，哈希值就变，能大大缓存问题
 # Node js中带了 npm
 1. 打个比方，要运行 .py文件，要有python
    那么nodejs就是专门运行
 ## npm js的功能之一是应用商店 装的是工具和库（默认当前用户） 还有类似的apt（默认装全部用户）
1. 在指定项目目录进行初始化 
npm init -y
初始化后，项目文件夹内出现一个package.json的文件夹这个json是这个项目的档案，他记录这个项目能跑哪些命令？ //有点迷糊

npm install -D vite 
使用npm 安装vite —D是因为vite起脚手架作用，之后上线他不会在项目中 
npm装的东西在 node_modules里面
## npm还能兼具项目管家 
比如三个vite命令太长，我们可以在json里面去别名缩短他们查看json第6行
scripts": {
  "dev": "vite",
  "build": "vite build",  生成最终打包文件 dist
  "preview": "vite preview"
  }
此后
npm run dev       # = ./node_modules/.bin/vite
npm run build     # = ./node_modules/.bin/vite build
npm run preview   # = ./node_modules/.bin/vite preview

## vite相关指令
# 1.热更新 
./node_modules/.bin/vite
# 2.打包  打包前是源代码，易于修改查看，打包后（build后的dist）是便于浏览器运行的，以此减少延迟
./node_modules/.bin/vite 
# 3.打包后查看 
./node_modules/.bin/vite preview

1.2.分别解决模块化后调试困难，浏览器缓存，文件过多请求三个痛点 


## React 和vue 都是 ”前端框架“，他们管的都是UI组件，依赖构建工具（vite）
vue国内多，react国外多 xx框架==管理xx的一套规则
不用框架的网页叫 vanilla ==原生写法
浏览器只认 html css js这三个东西
 # 前端框架的本质==几个npm包 （npm来管这些包）

项目中一个页面可以分成很多ui组件，比如
顶部导航栏  输入区  输出区  标题
# 挂载组件时当成一个大组件去挂载
# 拆成小组件是为了去复用
我们可以细分每个小模块去挂在到html
也可以把很多小组件当成一个大组件再挂进去，这样只要挂一个

# 要让react组件挂到html上，就要一个入口文件!!!

jsx react组件代码中 大写字母开头是react标签
小写字母开头仍是html标签

# 以后从0建立react/vue...等等框架/ 使用指令 npm create vite 就行