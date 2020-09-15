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
    // devsever只能用于开发环境
    devServer: {
        // 运行代码的目录
        contentBase: resolve(__dirname, "build"),
        //监视ContentBase目录下的所有文件，一旦文件变化，就会重载
        watchContentBase: true,
        watchOptions: {
            // 忽略监视文件
            ignored: /node_modules/,
        },
        // compress启动gzip压缩
        compress: true,
        // port:5000端口号5000
        port: 5000,
        // host:域名
        host: "localhost",
        // 自动打开浏览器
        open: true,
        //开启hmr功能
        hot: true,
        // clientLogLevel:"none":不要显示启动服务器的日志信息
        clientLogLevel: "none",
        //除了一些基本的启动信息以外，其他信息都不要显示
        quiet: true,
        // overlay:false:如果出错了不要全屏提示
        overlay: false,
        //服务器代理，解决开发环境跨域问题
        proxy: {
            // 一旦devServer（5000）服务器接收到/api/xxx的请求，就会把请求转发到另一个服务器
            "/api": { target: "http://localhost:3000" },
            pathRewrite: {
                // 发送请求时，请求路径重写：将/api/xxx-->/xxx（去掉/api）
                "^/api": "",
            },
        },
    },
};
