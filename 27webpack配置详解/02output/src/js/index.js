import("./add")
    .then(({ default: add }) => {
        console.log(add(1, 2));
    })
    .catch(() => {
        console.log("文件读取失败");
    });
console.log("index.js被加载了");
