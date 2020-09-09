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

### 图片打包

1.  下载插件

```
cnpm i html-loader url-loader file-loader -D
```

2.  创建 webpack.config.js 文件

```javascript
const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/index.js",
    output: {
        filename: "build.js",
        path: resolve(__dirname, "build"),
    },
    module: {
        rules: [
            {
                test: /.\less$/,
                // 使用多个loader处理用use
                use: ["style-loader", "css-loader", "less-loader"],
            },
            // 处理图片资源
            // 处理不了html中的img图片
            {
                test: /\.(jpg|png|gif)$/,
                // 使用一个loader直接用loader
                // 下载url-loader、file-loader
                loader: "url-loader",
                options: {
                    // 图片大小小于8kb，就会被base64处理
                    // 优点：减少请求数量，减轻服务器压力；
                    // 缺点：图片体积会更大，文件请求速度更快
                    limit: 8 * 1024,
                    // 问题：因为url-loader默认使用es6模块化解析，而html-loader引入图片是commonjs
                    // 解析时会出问题：[object module]
                    // 解决：关闭url-loader的ES6模块化，使用commonjs
                    // esModule: false, //现在的版本默认就是false。可以不用写
                    // 重命名解析后的图片文件,
                    // [hash: 10]取图片解析名hash值的前十位
                    // [ext]文件的原扩展名
                    name: "[hash:10].[ext]",
                },
            },
            //专门负责处理html中的img
            {
                test: /\.html$/,
                // 负责引入img，从而能被url-loader进行处理
                // 下载html-loader
                loader: "html-loader",
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
        }),
    ],
    mode: "development",
};
```

### 打包其他资源

```javascript
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
            // 打包其他资源（除了html/js/css资源以外的资源）
            {
                // 排除html/js/css/less资源
                exclude: /\.(html|js|css|less)$/,
                loader: "file-loader",
            },
        ],
    },
```

### devServer 开发服务器

-   开发服务器 devServer：用来自动化（自动编译，自动打开浏览器，自动刷新浏览器）
-   特点：没有输出，只会在内存中编译打包，不会有任何输出到本地代码
-   启动 devServer 指令：webpack-dev-server
-   下载 webpack-dev-server
    ```
    cnpm i webpack-dev-server -D
    ```

**代码**

```javascript
const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/index.js",
    output: {
        filename: "build.js",
        path: resolve(__dirname, "build"),
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                // 使用多个loader处理用use
                use: ["style-loader", "css-loader"],
            },
            // 打包其他资源（除了html/js/css资源以外的资源）
            {
                // 排除html/js/css/less资源
                exclude: /\.(html|js|css|less)$/,
                loader: "file-loader",
                options: {
                    name: "[hash:10].[ext]",
                },
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
        }),
    ],
    mode: "development",

    // 开发服务器devServer：用来自动化（自动编译，自动打开浏览器，自动刷新浏览器）
    // 特点：没有输出，只会在内存中编译打包，不会有任何输出到本地代码
    // 启动devServer指令：npx webpack-dev-server
    devServer: {
        contentBase: resolve(__dirname, "build"),
        // 启动gzip压缩
        compress: true,
        // 端口号3000
        port: 3000,
        //自动打开浏览器
        open: true,
    },
};
```

### 开发环境配置

```javascript
const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    // 编译入口
    entry: "./src/js/index.js",
    // 出口
    output: {
        filename: "js/build.js",
        path: resolve(__dirname, "build"),
    },

    // loader
    module: {
        rules: [
            // 编译css文件
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
            // 编译less文件
            {
                test: /\.less$/,
                use: ["style-loader", "css-loader", "less-loader"],
            },
            // 编译picture文件
            {
                test: /\.(jpg|png|gif)$/,
                loader: "url-loader",
                options: {
                    limit: 8 * 1024,
                    name: "[hash:10].[ext]",
                    outputPath: "imgs",
                },
            },
            // 编译html中的img
            {
                test: /\.html$/,
                loader: "html-loader",
            },
            // 打包其他资源
            {
                exclude: /\.(html|css|js|less|jpg|png|gif)$/,
                loader: "file-loader",
                options: {
                    name: "[hash:10].[ext]",
                    outputPath: "media",
                },
            },
        ],
    },

    // 插件
    plugins: [
        new HtmlWebpackPlugin({
            // 复制html模板
            template: "./src/index.html",
        }),
    ],

    // 模式
    mode: "development",

    // 开发服务器
    devServer: {
        contentBase: resolve(__dirname, "build"),
        compress: true,
        port: 3000,
        open: true,
    },
};
```

## 生产环境配置

### 提取 css 成单独文件/css 兼容处理/压缩 css

1.  下载插件

    ```
    cnpm i mini-css-extract-plugin -D
    ```

2.  代码

```
const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    // 编译入口
    entry: "./src/js/index.js",
    // 出口
    output: {
        filename: "js/build.js",
        path: resolve(__dirname, "build"),
    },

    // loader
    module: {
        rules: [
            // 编译css文件
            {
                test: /\.css$/,
                use: [
                    // "style-loader",
                    // 取代tyle-loader,作用：提取js中的css成单独文件
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                ],
            },
            // 编译less文件
            {
                test: /\.less$/,
                use: ["style-loader", "css-loader", "less-loader"],
            },
            // 编译picture文件
            {
                test: /\.(jpg|png|gif)$/,
                loader: "url-loader",
                options: {
                    limit: 8 * 1024,
                    name: "[hash:10].[ext]",
                    outputPath: "imgs",
                },
            },
            // 编译html中的img
            {
                test: /\.html$/,
                loader: "html-loader",
            },
            // 打包其他资源
            {
                exclude: /\.(html|css|js|less|jpg|png|gif)$/,
                loader: "file-loader",
                options: {
                    name: "[hash:10].[ext]",
                    outputPath: "media",
                },
            },
        ],
    },

    // 插件
    plugins: [
        new HtmlWebpackPlugin({
            // 复制html模板
            template: "./src/index.html",
        }),
        new MiniCssExtractPlugin({
            // 对输出的css文件重命名
            filename: "css/build.css",
        }),
    ],

    // 模式
    mode: "development",

    // 开发服务器
    devServer: {
        contentBase: resolve(__dirname, "build"),
        compress: true,
        port: 3000,
        open: true,
    },
};
```

3.  css 兼容性处理

```
cnpm i postcss-loader precss autoprefixer -D
```

-   在 package.json 中加如浏览器版本限制代码,如下:

```json
"browserslist": {
    //开发环境:设置 nidejs 中的环境变量,通过 process.env.NODE_ENV = development
    "development": [
        "last 1 chrome version",
        "last 1 firefox version",
        "last 1 safari version"
    ],
    //生产环境:默认是生产环境
    "production": [
        ">0.2%",
        "not dead",
        "not op_mini all"
    ]
}
```

-   创建 webpack.config.js

```javascript
const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// 设置nodejs环境变量
process.env.NODE_ENV = "development";

module.exports = {
    // 编译入口
    entry: "./src/js/index.js",
    // 出口
    output: {
        filename: "js/build.js",
        path: resolve(__dirname, "build"),
    },

    // loader
    module: {
        rules: [
            // 编译css文件
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    // 使用loader的默认配置
                    // "postcss-loader",
                    // 修改loader的配置
                    {
                        loader: "postcss-loader",
                    },
                ],
            },
        ],
    },

    // 插件
    plugins: [
        new HtmlWebpackPlugin({
            // 复制html模板
            template: "./src/index.html",
        }),
        new MiniCssExtractPlugin({
            // 对输出的css文件重命名
            filename: "css/build.css",
        }),
    ],

    // 模式
    mode: "development",

    // 开发服务器
    devServer: {
        contentBase: resolve(__dirname, "build"),
        compress: true,
        port: 3000,
        open: true,
    },
};
```

-   创建 postcss.config.js

```javascript
module.exports = {
    plugins: [require("precss"), require("autoprefixer")],
};
```

4.  压缩 css

-   下载插件

```
cnpm i optimize-css-assets-webpack-plugin -D
```

-   代码

```javascript
const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");

// 设置nodejs环境变量
process.env.NODE_ENV = "development";

module.exports = {
    // 编译入口
    entry: "./src/js/index.js",
    // 出口
    output: {
        filename: "js/build.js",
        path: resolve(__dirname, "build"),
    },

    // loader
    module: {
        rules: [
            // 编译css文件
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    // 使用loader的默认配置
                    // "postcss-loader",
                    // 修改loader的配置
                    {
                        loader: "postcss-loader",
                    },
                ],
            },
        ],
    },

    // 插件
    plugins: [
        new HtmlWebpackPlugin({
            // 复制html模板
            template: "./src/index.html",
        }),
        new MiniCssExtractPlugin({
            // 对输出的css文件重命名
            filename: "css/build.css",
        }),
        new OptimizeCssAssetsWebpackPlugin(), //压缩css
    ],

    // 模式
    mode: "development",

    // 开发服务器
    devServer: {
        contentBase: resolve(__dirname, "build"),
        compress: true,
        port: 3000,
        open: true,
    },
};
```

## js 语法检查

1.  下载模块

```
cnpm i eslint-loader eslint-config-airbnb-base eslint-plugin-import eslint -D
```
