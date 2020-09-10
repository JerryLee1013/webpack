const { resolve } = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");

// 定义nodejs环境变量：决定使用browserslist的哪个环境
process.env.NODE_ENV = "production";

// 复用loader
const commonCssLoader = [
    MiniCssExtractPlugin.loader,
    "css-loader",
    {
        // 还需要在package.json中定义browserslist
        loader: "postcss-loader",
    },
];

module.exports = {
    entry: "./src/js/index.js",
    output: {
        filename: "js/built.[contenthash:10].js",
        path: resolve(__dirname, "build"),
    },
    module: {
        rules: [
            {
                // 在package.json中eslintConfig --> airbnb
                test: /\.js$/,
                exclude: /node_modules/,
                // 优先执行
                enforce: "pre",
                loader: "eslint-loader",
                options: {
                    fix: true,
                },
            },
            {
                //以下loader只会匹配一个
                // 注意不能有两个loader处理同一类型文件
                oneOf: [
                    {
                        test: /\.css$/,
                        use: [...commonCssLoader],
                    },
                    {
                        test: /\.less$/,
                        use: [...commonCssLoader, "less-loader"],
                    },

                    {
                        test: /\.js$/,
                        exclude: /node_modules/,
                        use: [
                            // 开启多进程打包，进程开启是有时间的600ms，进程通信也要花时间
                            // 只有工作消耗时间较长，才需要多进程打包
                            {
                                loader: "thread-loader",
                                options: {
                                    works: 2, //2进程，消耗进程数提高打包速度
                                },
                            },
                            {
                                loader: "babel-loader",
                                options: {
                                    presets: [
                                        [
                                            "@babel/preset-env",
                                            {
                                                useBuiltIns: "usage",
                                                corejs: { version: 3 },
                                                targets: {
                                                    chrome: "60",
                                                    firefox: "50",
                                                },
                                            },
                                        ],
                                    ],
                                    // 开启babel缓存
                                    // 第二次构建时，会读取之前的缓存
                                    cacheDirectory: true,
                                },
                            },
                        ],
                    },
                    {
                        test: /\.(jpg|png|gif)/,
                        loader: "url-loader",
                        options: {
                            limit: 8 * 1024,
                            name: "[hash:10].[ext]",
                            outputPath: "imgs",
                            esModule: false,
                        },
                    },
                    {
                        test: /\.html$/,
                        loader: "html-loader",
                    },
                    {
                        exclude: /\.(js|css|less|html|jpg|png|gif)/,
                        loader: "file-loader",
                        options: {
                            outputPath: "media",
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "css/built.[contenthash:10].css",
        }),
        new OptimizeCssAssetsWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            minify: {
                collapseWhitespace: true,
                removeComments: true,
            },
        }),
        new WorkboxWebpackPlugin.GenerateSW({
            clientsClaim: true, //帮助serviceworker快速启动
            skipWaiting: true, //删除旧的serviceworker
        }),
    ],
    mode: "production",
    devtool: "source-map",
};
