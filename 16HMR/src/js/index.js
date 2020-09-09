import "../css/index.less";
import "../css/iconfont.css";
import print from "./print";
console.log("index.js文件被重新加载了");
print();

if (module.hot) {
    // 一旦module上有hot属性，说明开启了HMR功能
    module.hot.accept("./print.js", function () {
        // 方法会监听print.js文件的变化，一旦发生变化，其他默认模块不会重新打包构建，
        // 会执行后面的回调函数
        print();
    });
}
