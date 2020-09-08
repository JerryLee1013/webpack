# webpack 静态模块打包器

---

## 构建工具

将前端一些列操作整合称大工具，称为构建工具

## webpack 五个核心概念

### Entry

入口指示：webpack 以哪个文件为入口起点开始打包，分析构建内部依赖图

### Output

输出指示：webpack 打包后的资源 bundles 输出到哪里取，以及如何命名

### Loader

让 webpack 能够去处理那些非 js 文件

### Plugins

插件可以用于执行范围更广的任务，插件的范围包括：从打包优化和压缩，一直到重新定义环境中的变量等；

### Mode

Mode 指示 webpack 使用相应模式的配置

-   开发模式
-   生产模式

## webpack 初体验

1.  配置 webpack 到全局
    ```
    cnpm install webpack webpack-cli -g
    ```
2.  配置 webpack 开发模式 到项目
    ```
    cnpm install webpack webpack-cli -D
    ```
3.  运行指令：
    -   开发环境：webpack ./src/index.js -o ./build/build.js --mode=development
        webpack 会以./src/index.js 为入口文件开始打包，打包后输出到./build/build.js
        整体打包环境为开发环境
    -   生产环境：webpack ./src/index.js -o ./build/build.js --mode=production
        webpack 会以./src/index.js 为入口文件开始打包，打包后输出到./build/build.js
        整体打包环境为生产环境
4.  结论：
    -   webpack 能处理 js/json 文件，不能处理 css 文件
    -   生产环境和开发环境将 ES6 模块化编译成浏览器能识别的模块化代码
    -   生产环境比开发环境，多一个压缩 js 代码

```javascript
// 引入json文件
import data from "./data.json";
// 引入css文件
// import "./index.css";报错

console.log(data);
function add(x, y) {
    return x + y;
}

console.log(add(22, 34));
```

## webpack 打包

### css/less 样式打包

1.  下载配置文件

```
cnpm i style-loader css-loader -D
```

2.  创建 package.config.js 文件

```javascript
/*
    webpack的配置文件
        作用：指示webpack干哪写活（当你运行webpack指令的时候会加载其中的配置）

        所有的构建工具都是基于nodejs平台运行的，模块化采用commonjs
 */
// resolve用来拼接绝对路径的方法
const { resolve } = require("path");
module.exports = {
    // webpack配置
    // 入口起点
    entry: "./src/index.js",
    // 输出
    output: {
        // 输出文件名
        filename: "build.js",
        // 输出路径
        // __dirname ：nodejs的变量，代表当前文件的目录绝对路径
        path: resolve(__dirname, "build"),
    },
    // loader的配置
    module: {
        rules: [
            // 详细的loader配置,不同文件配置不同的loader
            {
                test: /\.css$/, //正则匹配css资源
                // 使用哪写loader进行处理
                // use数组中loader执行顺序：从下到上一次执行
                use: [
                    // 创建style标签，将js中的css样式资源添加到head中生效
                    "style-loader",
                    // 将css文件变成commonjs模块架子啊到js模块中，里面内容是样式字符串
                    "css-loader",
                ],
            },
            {
                test: /\.less$/, //正则匹配less资源
                use: [
                    "style-loader",
                    "css-loader",
                    //  将less文件编译成css文件,需要下载less-loader和less
                    "less-loader",
                ],
            },
        ],
    },
    // 插件的配置
    plugins: [
        // 详细的插件配置
    ],
    // 模式
    mode: "development",
    // mode: "production",
};
```

### 打包 html 文件

1.  下载配置文件

```
cnpm i html-webpack-plugin -D
```

2.  创建 package.config.js 文件

```javascript
const { resolve } = require("path");
// 引入html打包插件
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
    entry: "./src/index.js",
    output: {
        filename: "build.js",
        path: resolve(__dirname, "build"),
    },
    module: {
        rules: [],
    },
    plugins: [
        // html-webpack-plugin
        //  new HtmlWebpackPlugin()功能：没有参数时，默认会创建一个空HTML文件，自动引入打包输出的所有资源
        // 需要有结构的html
        new HtmlWebpackPlugin({
            // 复制./src/index.html文件，并自动引入打包输出的所有资源
            template: "./src/index.html",
        }),
    ],
    mode: "development",
};
```
