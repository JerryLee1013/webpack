console.log("index.js文件被加载");
// import { mul } from "./test";

document.getElementById("btn").onclick = function () {
    // 懒加载
    // 预加载：webpackPrefetch: true;会在使用之前提前加载js文件
    // 正常加载可以认为是并行加载，同一时间加载多个文件
    // 预加载webpackPrefetch，等其他资源加载完毕，浏览器空闲了，再偷偷加载，再移动端有很大兼容性问题
    // 懒加载等用的时候才加载
    import(/* webpackChunkName:"test",webpackPrefetch:true */ "./test")
        .then(({ mul, count }) => {
            console.log(mul(3, 9));
        })
        .catch(() => {
            console.log("文件加载失败");
        });
};
