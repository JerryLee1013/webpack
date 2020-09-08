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
                test: /.\less$/,
                // 使用多个loader处理用use
                use: ["style-loader", "css-loader", "less-loader"],
            },
            // 处理图片资源
            // 处理不了html中的img图片
            {
                test: /\.(jpg|png|gif)$/,
                // 使用一个loader直接用loader
                // 下载url-loader、file-loader
                loader: "url-loader",
                options: {
                    // 图片大小小于8kb，就会被base64处理
                    // 优点：减少请求数量，减轻服务器压力；
                    // 缺点：图片体积会更大，文件请求速度更快
                    limit: 8 * 1024,
                    // 问题：因为url-loader默认使用es6模块化解析，而html-loader引入图片是commonjs
                    // 解析时会出问题：[object module]
                    // 解决：关闭url-loader的ES6模块化，使用commonjs
                    // esModule: false, //现在的版本默认就是false。可以不用写
                    // 重命名解析后的图片文件,
                    // [hash: 10]取图片解析名hash值的前十位
                    // [ext]文件的原扩展名
                    name: "[hash:10].[ext]",
                },
            },
            //专门负责处理html中的img
            {
                test: /\.html$/,
                // 负责引入img，从而能被url-loader进行处理
                // 下载html-loader
                loader: "html-loader",
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
