const { resolve } = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

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
    // 多入口
    entry: "./src/js/index.js",
    output: {
        filename: "js/[name].[contenthash:10].js", //取entry属性名
        path: resolve(__dirname, "build"),
    },
    /* module: {
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
    }, */
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
    ],
    // 可以将node_modules中代码单独打包一个chunk最终输出
    // 自动分子多入口chunk，有没有公共的文件，如果有会打包成一个单独chunk
    optimization: {
        splitChunks: {
            chunks: "all",
        },
    },
    mode: "production",
    devtool: "source-map",
};
