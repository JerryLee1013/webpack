const { resolve } = require("path");
// 引入html打包插件
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
    entry: "./src/js/index.js",
    output: {
        filename: "js/build.js",
        path: resolve(__dirname, "build"),
    },
    module: {
        rules: [],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
        }),
    ],
    mode: "development",
    externals: {
        // 忽略库,拒绝jQuery被打包
        jquery: "jQuery",
    },
};
