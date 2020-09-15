import(/* webpackChunkName:"a" */ "./a")
    .then(({ add }) => {
        console.log(add(2, 5));
    })
    .catch(() => {});
console.log("index.js被加载了");
