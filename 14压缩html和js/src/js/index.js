const add = (x, y) => x + y;

const promise = new Promise((resolve) => {
    setTimeout(() => {
        console.log("定时器执行完毕！");
        resolve();
    }, 1000);
});

console.log(add(2, 4));
