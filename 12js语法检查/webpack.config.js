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
            /* 
                js语法检查
                    注意只检查自己写的源码,不检查第三方库
                    设置检查规则:
                        在package.json中eslintConfig中设置
                        "eslintConfig": {
                            "extends": "airbnd-base"
                        }
                        下载eslint-config-airbnb-base eslint eslint-plugin-import三个库
             */
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "eslint-loader",
                options: {
                    fix: true, //自动修复
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
