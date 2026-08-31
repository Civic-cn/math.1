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
1.设置姓名是用于合作人之间的
git config user.name //会显示当前用户名
git config --global user.name "xxx" //修改提交git人名字

git config --global user.email
git config --global user.email "你的邮箱@xx.com" //邮箱同理

2.本地初始化git
git init //在本地生成隐藏文件 .git,可用ls -la查看

3.查看git目前什么状态，有哪些跟踪了，有哪些没有跟踪，哪些提交了
git status

4.添加未跟踪文件或者想要提交的文件进入缓冲区
git add //add后并未提交仓库，，而是缓存区
git add. //把当前目录下所有文件提交到暂存区
