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
