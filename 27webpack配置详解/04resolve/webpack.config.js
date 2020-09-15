const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/js/index.js",

    output: {
        filename: "js/[name].js",
        path: resolve(__dirname, "build"),
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
    mode: "development",
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
};
