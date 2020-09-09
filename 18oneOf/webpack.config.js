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
    entry: "./src/js/index.js",
    output: {
        filename: "js/built.js",
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
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "css/built.css",
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
    mode: "production",
};
