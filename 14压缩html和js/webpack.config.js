const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/js/index.js",
    output: {
        filename: "js/build.js",
        path: resolve(__dirname, "build"),
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            minify: {
                collapseWhitespace: true, //移除空格
                removeComments: true, //移除注释
            },
        }),
    ],
    mode: "production",
};
