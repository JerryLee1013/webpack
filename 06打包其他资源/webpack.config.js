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
};
