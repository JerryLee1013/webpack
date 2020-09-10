import $ from "jquery";

const add = (x, y) => x + y;
// eslint-disable-next-line
console.log(add(2, 3));
function sum(...args) {
    return args.reduce((p, c) => p + c, 0);
}
const result = sum(1, 2, 3, 4, 5, 6);
// eslint-disable-next-line
console.log(result);
// eslint-disable-next-line
console.log($);

// 通过js代码让某个文件被单独打包成一个chunk;
// import动态导入语法：能将某个模块单独打包
import(/* webpackChunkName："test" */ "./test")
    .then(({ mul, count }) => {
        // eslint-disable-next-line
        console.log(mul(2, 5));
    })
    .catch(() => {
        // eslint-disable-next-line
        console.log("文件加载失败");
    });
