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
