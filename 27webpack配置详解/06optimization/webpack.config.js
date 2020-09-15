const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");

module.exports = {
    entry: "./src/js/index.js",

    output: {
        filename: "js/[name].[contenthash:10].js",
        path: resolve(__dirname, "build"),
        chunkFilename: "js/[name].[contenthash:10]_chunk.js",
    },
    module: {
        rules: [
            // loader的配置
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    plugins: [new HtmlWebpackPlugin()],
    mode: "production",
    // 解析模块的规则
    resolve: {
        // 配置解析模块路径别名
        alias: {
            // 配置css文件夹的别名路径为$css
            $css: resolve(__dirname, "src/css"),
        },
        // 配置省略文件后缀名的规则
        extensions: [".js", ".json", ".css"],
        // 告诉webpack解析模块是去找哪个目录
        modules: [resolve(__dirname, "../../node_modules"), "node_modules"],
    },
    optimization: {
        splitChunks: {
            chunks: "all",
            // 默认值
            /* minSize: 30 * 1024, //分割的chunk最小为30kb
            maxSize: 0, //最大没有限制
            minChunks: 1, //要提取的chuank至少被引用1次
            maxAsynRequests: 5, //按需加载时，并行加载的文件最大数量
            maxInitialRequest: 3, //入口js文件最大并行请求数量
            automaticNameDelimiter: "~", //名称连接符
            name: true, //可以使用命名规则
            //分割chunk的组
            cacheGroups: {
                // node_modules文件会被打包到vendors组的chunk中-->vendors~xxx.js
                // 满足上面的公共规则，如大小超过30kb，至少被引用一次
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                },
                default: {
                    //要提取的chunk至少被引用2次
                    minChunks: 2,
                    // 优先级
                    priority: -20,
                    //如果当前要打包的模块和之前已经被提取的模块是同一个，就会复用，而不是重新打包模块
                    reuseExistingChunk: true,
                },
            }, */
        },
        // 将当前模块记录其他模块的hash值单独打包为一个文件runtime
        // 解决修改a文件导致b文件的contenthash变化
        runtimeChunk: {
            name: (entrypoint) => `runtime-${entrypoint.name}`,
        },
        //
        minimizer: [
            // 配置生产环境的压缩方案
            new TerserWebpackPlugin({
                // 开启缓存
                cache: true,
                //开启多继承打包
                parallel: true,
                //启动source-map
                sourceMap: true,
            }),
        ],
    },
};
