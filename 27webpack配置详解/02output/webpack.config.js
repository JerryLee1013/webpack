const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/js/index.js",
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
    plugins: [new HtmlWebpackPlugin()],
    mode: "development",
};
