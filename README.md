# SakuraBombSquad 樱花爆破队匿名墙

## Intro 介绍

See `views/about.ejs` for both English and Simplified Chinese version. 

Admin panel is at `localhost:xxx/admin`

英文和简中介绍见 `views/about.ejs`.

管理员面板在 `localhost:xxx/admin`


## Env 环境

```shell
# node, npm
npm install express express-session express-ejs-layouts \
ejs marked moment sqlite3 uuid bycrpt multer
```
## Build 编译

No need to build, get node and its packages ready. 

无需编译, 直接配置好 node 和包即可.

## Deploy 配置

For convenience run `node deploy.js` to get a default admin account as shown below.
```
username: root
password: 114514
```
***Please change the password for security!*** 

方便起见, 运行 `node deploy.js` 来获得一个默认管理员账号, 信息如上.

***安全起见, 务必更换默认密码***

## Run 运行

```shell
node server.js
```

## Dev 开发

Originally using Webstorm.

项目使用 Webstorm 开发, 建议二次开发也继续使用. 

## Licence 协议

GPL3

See LICENCE for more details.

细则请见 LICENCE 文件. 