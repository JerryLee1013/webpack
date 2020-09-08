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
