const { resolve } = require("path");
const webpack = require("webpack");
const AddAssetHtmlWebpackPlugin = require("add-asset-html-webpack-plugin");

// 引入html打包插件
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
    entry: "./src/js/index.js",
    output: {
        filename: "build.js",
        path: resolve(__dirname, "build"),
    },
    module: {
        rules: [],
    },
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
    mode: "development",
    devtool: "source-map",
};
