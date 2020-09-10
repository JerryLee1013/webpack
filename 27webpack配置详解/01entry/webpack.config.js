const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    // entry: "./src/js/index.js",
    // entry: ["./src/js/index.js", "./src/js/add.js"],
    // entry: { index: "./src/js/index.js", add: "./src/js/add.js" },
    entry: {
        index: ["./src/js/index.js", "./src/js/count.js"],
        add: "./src/js/add.js",
    },
    output: {
        filename: "js/[name].js",
        path: resolve(__dirname, "build"),
    },
    plugins: [new HtmlWebpackPlugin()],
    mode: "development",
};
