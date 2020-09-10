import { mul } from './test';
import '../css/a.css';
import '../css/b.css';

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
console.log(mul(2, 4));

// 注册seviceworker
// 处理兼容性问题
// sw代码必须运行再服务器上
// nodejs 下载serve：cnpm i serve -g
// serve -s build 启动服务器，将build目录下所有资源作为静态资源去暴露出去
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}
