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
