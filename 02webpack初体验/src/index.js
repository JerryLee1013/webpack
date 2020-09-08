/*
    webpack入口起点文件

    1.运行指令：
        开发环境：webpack ./src/index.js -o ./build/build.js --mode=development
            webpack会以./src/index.js为入口文件开始打包，打包后输出到./build/build.js
            整体打包环境为开发环境
        生产环境：webpack ./src/index.js -o ./build/build.js --mode=production
            webpack会以./src/index.js为入口文件开始打包，打包后输出到./build/build.js
            整体打包环境为生产环境
    2.结论：
        a.webpack能处理js/json文件，不能处理css文件
        b.生产环境和开发环境将ES6模块化编译成浏览器能识别的模块化代码
        c.生产环境比开发环境，多一个压缩js代码
*/
// 引入json文件
import data from "./data.json";
// 引入css文件
// import "./index.css";报错

console.log(data);
function add(x, y) {
    return x + y;
}

console.log(add(22, 34));
