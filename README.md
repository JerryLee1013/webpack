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

### js 语法检查/兼容性处理/压缩 html/js

1. 下载

```
npm i eslint eslint-loader eslint-config-airbnb-base eslint-plugin-import -D
```

2. 使用
   按需兼容处理 --> core-js
   下载
   npm i core-js -D

使用 webpack.config.js:

```javascript
module.exports = {
    module: {
        rules: [
            {
              test: /\.js$/,
              exclude: /node_modules/,
              loader: 'babel-loader',
              options: {
                presets: [
                  [
                    '@babel/preset-env',
                    {
                      // 按需加载
                      useBuiltIns: 'usage',
                      // 指定core-js版本
                      corejs: {
                        version: 3,
                      },
                      // 指定兼容到浏览器的哪个版本
                      targets: {
                        chrome: '60',
                        firefox: '60',
                        ie: '9',
                        safari: '10',
                        edge: '17',
                      },
                    },
                  ],
                ],
              },
        ],
    },
}
```

## 生产环境配置文件

```
const { resolve } = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

// 定义nodejs环境变量：决定使用browserslist的哪个环境
process.env.NODE_ENV = "production";

// 复用loader
const commonCssLoader = [
    MiniCssExtractPlugin.loader,
    "css-loader",
    {
        // 还需要在package.json中定义browserslist
        loader: "postcss-loader",
    },
];

module.exports = {
    entry: "./src/js/index.js",
    output: {
        filename: "js/built.js",
        path: resolve(__dirname, "build"),
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [...commonCssLoader],
            },
            {
                test: /\.less$/,
                use: [...commonCssLoader, "less-loader"],
            },
            /*
        正常来讲，一个文件只能被一个loader处理。
        当一个文件要被多个loader处理，那么一定要指定loader执行的先后顺序：
          先执行eslint 在执行babel
      */
            {
                // 在package.json中eslintConfig --> airbnb
                test: /\.js$/,
                exclude: /node_modules/,
                // 优先执行
                enforce: "pre",
                loader: "eslint-loader",
                options: {
                    fix: true,
                },
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                options: {
                    presets: [
                        [
                            "@babel/preset-env",
                            {
                                useBuiltIns: "usage",
                                corejs: { version: 3 },
                                targets: {
                                    chrome: "60",
                                    firefox: "50",
                                },
                            },
                        ],
                    ],
                },
            },
            {
                test: /\.(jpg|png|gif)/,
                loader: "url-loader",
                options: {
                    limit: 8 * 1024,
                    name: "[hash:10].[ext]",
                    outputPath: "imgs",
                    esModule: false,
                },
            },
            {
                test: /\.html$/,
                loader: "html-loader",
            },
            {
                exclude: /\.(js|css|less|html|jpg|png|gif)/,
                loader: "file-loader",
                options: {
                    outputPath: "media",
                },
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "css/built.css",
        }),
        new OptimizeCssAssetsWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            minify: {
                collapseWhitespace: true,
                removeComments: true,
            },
        }),
    ],
    mode: "production",
};
```

## HMR(hot Module Replacement)

-   作用：一个模块发生变化，只会重新打包这一个模块；
-   提升代码构建速度

### 对样式文件的处理

```javascript
    devServer: {
        contentBase: resolve(__dirname, "build"),
        compress: true,
        port: 3000,
        open: true,
        //开启HMR功能,重启webpack服务
        hot: true,//对样式文件的更改起作用
    },
```

### 对 js 文件的处理

-   以上方法对 js 文件无效
-   添加支持 HMR 功能的代码
-   只针对非入口文件的 js 来做

```javascript
if (module.hot) {
    // 一旦module上有hot属性，说明开启了HMR功能
    module.hot.accept("./print.js", function () {
        // 方法会监听print.js文件的变化，一旦发生变化，其他默认模块不会重新打包构建，
        // 会执行后面的回调函数
        print();
    });
}
```

### 对 html 文件的处理

-   以上方法对 html 文件无效，同时导致一个问题：html 文件不能热更新了
-   解决：将 html 文件增加到入口处
    -   entry: ["./src/js/index.js", "./src/index.html"]
-   html 文件不需要 HMR 功能

## source-map

-   一种提供源代码到构建后代码映射的技术
-   如果构建后代码出错了，将错误直接指向源代码处的错误，直接更改源代码

-   [inline-|hidden-|eval-][nosource-][cheap-[module-]]source-map
    -   inline-source-map:内联，只生成一个内联的 source-map
    -   hidden-source-map:外部,提供错误代码错误原因，不能提供源码的错误位置
    -   eval-source-map:内联，每一个文件都生成对应的 source-map;提示错误代码的准确信息和错误位置
    -   nosource-source-map：外部;提示错误代码的准确信息,没有源代码信息
    -   cheap-source-map:外部；提示错误代码的准确信息和错误行的位置
    -   cheap-module-source-map:外部；提示错误代码的准确信息和错误位置
    -   source-map:外部；示错误代码的准确信息和错误位置
-   内联和外部的区别
    -   外部生产的文件，内联没有
    -   内联构建速度更快
-   开发环境：速度快，调试更友好
    -   速度快（eval>inline>cheap>...）
    -   调试友好：cheap-module-source-map
    -   推荐 eval-source-map/eval-cheap-module-source-map
-   生产环境：源码要不要隐藏，调试要不要更友好
    -   内联会让代码体积非常大，不采用
    -   nosource-source-map 全部隐藏
    -   hidden-source-map 只隐藏源代码；会提示构建后代码错误信息
    -   推荐 source-map/cheap-module-source-map

## 缓存

-   babel 缓存
    -   catchDirectory:true
    -   让第二次打包构建速度更快
-   文件资源缓存
    -   hash:每次 webpack 构建时会生成一个新的 hash 值，添加到文件名
    -   问题：当因为 js 和 css 同时用一个 hash 值，如果重新打包会导致所有缓存失效，可能只改动一个文件，但是其他所有文件都失效
    -   chunkhash：根据 chunk 生成的 hash 值，如果打包来源于同一个 chunk 那么 hash 值就一样
    -   问题：因为 css 是在 js 中被引入的，所以同属于一个 chunk
    -   contenthash：根据文件的内容生成 hash 值，不同文件 hash 值一定不一样
    -   让代码上线运行缓存更好使用

## tree-shaking 去除无用代码

-   前提
    -   必须使用 ES6 模块化
    -   开启 production 环境
-   作用：减少代码体积
-   在 package 中配置"sideEffects": false；所有代码都没有副作用（都可以进行 tree-shaking），可能会把 css/@babel/polyfill 文件干掉
-   如下这样配置就不会误删除

```
    "sideEffects": [
        "*.css",
        "*.less"
    ]
```

## 懒加载/预加载

```javascript
console.log("index.js文件被加载");
// import { mul } from "./test";

document.getElementById("btn").onclick = function () {
    // 懒加载
    // 预加载：webpackPrefetch: true;会在使用之前提前加载js文件
    // 正常加载可以认为是并行加载，同一时间加载多个文件
    // 预加载webpackPrefetch，等其他资源加载完毕，浏览器空闲了，再偷偷加载，再移动端有很大兼容性问题
    // 懒加载等用的时候才加载
    import(/* webpackChunkName:"test",webpackPrefetch:true */ "./test")
        .then(({ mul, count }) => {
            console.log(mul(3, 9));
        })
        .catch(() => {
            console.log("文件加载失败");
        });
};
```

## PWA,渐进式网络开发应用程序

-   离线可以访问
-   插件 workbox-webpack-plugin
-   webpack.config.js 文件配置

```javascript
    plugins: [
        new WorkboxWebpackPlugin.GenerateSW({
            clientsClaim: true, //帮助serviceworker快速启动
            skipWaiting: true, //删除旧的serviceworker
        }),
    ],
```

-   index.js 配置

```javascript
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("/service-worker.js")
            .then((registration) => {
                console.log("SW registered: ", registration);
            })
            .catch((registrationError) => {
                console.log("SW registration failed: ", registrationError);
            });
    });
}
```

## 多进程配置

-   cnpm 下载 thread-loader
-   将 thread-loader 放到其他需要多进程打包来提升速度的 loader 中

```javascript
{
  test: /\.js$/,
  exclude: /node_modules/,
  use: [
      // 开启多进程打包，进程开启是有时间的600ms，进程通信也要花时间
      // 只有工作消耗时间较长，才需要多进程打包
      {
          loader: "thread-loader",
          options: {
              works: 2, //2进程，消耗进程数提高打包速度
          },
      },
      {
          loader: "babel-loader",
          options: {
              presets: [
                  [
                      "@babel/preset-env",
                      {
                          useBuiltIns: "usage",
                          corejs: { version: 3 },
                          targets: {
                              chrome: "60",
                              firefox: "50",
                          },
                      },
                  ],
              ],
              // 开启babel缓存
              // 第二次构建时，会读取之前的缓存
              cacheDirectory: true,
          },
      },
  ],
}
```

## externals

-   作用：防止将一些包打包输出到 bundle 中

```
    externals: {
        // 忽略库,拒绝jQuery被打包
        jquery: "jQuery",
    },
```

## dll 动态链接库

-   指示 webpack 哪些库不参与打包，会对某些库单独打包
-   cnpm i add-asset-html-webpack-plugin -D
-   创建 webpack.dll.js

```javascript
const { resolve } = require("path");
const webpack = require("webpack");

// 使用dll技术对默写库进行单独打包
// 当运行webpack时，默认查找webpack.config.js文件
// 需要运行webpack.dll.js  --> 运行指令：webpack --config webpack.dll.js
module.exports = {
    entry: {
        // 最终打包生成的name-->jquery
        // ["jquery"]--------->要打包的库是jquery
        jquery: ["jquery"],
    },
    output: {
        filename: "[name].js",
        path: resolve(__dirname, "dll"),
        library: "[name]_[hash:10]", //打包的库里面向外暴露出去的内容叫什么名字
    },
    plugins: [
        // 打包生成mainfest.json-->提供和jquery的映射
        new webpack.DllPlugin({
            name: "[name]_[hash:10]", //映射库的暴露的内容
            path: resolve(__dirname, "dll/mainfest.json"), //输出文件路径
        }),
    ],
    mode: "production",
};
```

-   配置 webpack.config.js

```javascript
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
        }),
        // 告诉webpack哪些库不参与打包，同时使用时的名称也得改
        new webpack.DllReferencePlugin({
            manifest: resolve(__dirname, "dll/mainfest.json"),
        }),
        // 将某个文件打包输出去，并在html中自动引入该文件
        new AddAssetHtmlWebpackPlugin({
            filepath: resolve(__dirname, "dll/jquery.js"),
        }),
    ],
```

## webpack 配置详情

### entry 入口

1.  string

-   打包形成一个 chunk，输出一个 bundle
-   输出的 bundle 默认是 main.js

2.  array

-   entry: ["./src/js/index.js", "./src/js/add.js"],
-   多入口
-   所有入口文件最终只会形成一个 chunk，输出也只有一个 bundle 文件
-   只有一个用途；只有在 HMR 功能中让 html 功能生效

3.  object

-   entry: { index: "./src/js/index.js", add: "./src/js/add.js" },
-   多入口
-   有几个入口文件，就生成几个 chunk 和 bundle 文件
-   文件名为属性名 index/add
-   第三种常用

4.  特殊用法

-   代码

```javascript
    entry: {
        index: ["./src/js/index.js", ".src/js/count.js"],
        add: "./src/js/add.js",
    },
```

-   其中 index 和 array 的用法类似，两个源文件打包在一起，生成一个 chunk 各 bundle
-   然后再按照 objec 的打包方式进行打包

### output

-   代码

```javascript
    output: {
        //指定文件名称+目录
        filename: "js/[name].js",
        // 指定目录
        path: resolve(__dirname, "build"),
        // 所有资源引入公共路径前缀;一般用于生产环境
        publicPath: "/",
        //非入口chunk的文件名称
        chunkFilename: "js/[name]_chunk.js",
        // 整个库向外暴漏的变量名
        library: "[name]",
        // 将变量名添加在指定对象下,一般结合dll使用
        // libraryTarget: "window", //添加到window对象下
        // libraryTarget: "global",//添加到global对象下
        // libraryTarget: "commonjs", //添加到commonjs对象下
    },
```

### resolve

```javascript
    // 解析模块的规则
    resolve: {
        // 配置解析模块路径别名
        alias: {
            // 配置css文件夹的别名路径为$css
            $css: resolve(__dirname, "src/css"),
        },
        // 配置省略文件后缀名的规则
        extensions: [".js", ".json", ".css"],
        // 告诉webpack解析模块是去找哪个目录
        modules: [resolve(__dirname, "../../node_modules"), "node_modules"],
    },
```

### devServer

```javascript

    devServer: {
        // 运行代码的目录
        contentBase: resolve(__dirname, "build"),
        //监视ContentBase目录下的所有文件，一旦文件变化，就会重载
        watchContentBase: true,
        watchOptions: {
            // 忽略监视文件
            ignored: /node_modules/,
        },
        // compress启动gzip压缩
        compress: true,
        // port:5000端口号5000
        port: 5000,
        // host:域名
        host: "localhost",
        // 自动打开浏览器
        open: true,
        //开启hmr功能
        hot: true,
        // clientLogLevel:"none":不要显示启动服务器的日志信息
        clientLogLevel: "none",
        //除了一些基本的启动信息以外，其他信息都不要显示
        quiet: true,
        // overlay:false:如果出错了不要全屏提示
        overlay: false,
        //服务器代理，解决开发环境跨域问题
        proxy: {
            // 一旦devServer（5000）服务器接收到/api/xxx的请求，就会把请求转发到另一个服务器
            "/api": { target: "http://localhost:3000" },
            pathRewrite: {
                // 发送请求时，请求路径重写：将/api/xxx-->/xxx（去掉/api）
                "^/api": "",
            },
        },
    },
```

###

cnpm i terser-webpack-plugin -D
