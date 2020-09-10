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

{
  test: /\.js$/,
  exclude: /node_modules/,
  use: [
      // 开启多进程打包，进程开启是有时间的600ms，进程通信也要花时间
      // 只有工作消耗时间较长，才需要多进程打包
      {
          loader: "thread-loader",
          options: {
              works: 2, //2进程，消耗进程数提高打包速度
          },
      },
      {
          loader: "babel-loader",
          options: {
              presets: [
                  [
                      "@babel/preset-env",
                      {
                          useBuiltIns: "usage",
                          corejs: { version: 3 },
                          targets: {
                              chrome: "60",
                              firefox: "50",
                          },
                      },
                  ],
              ],
              // 开启babel缓存
              // 第二次构建时，会读取之前的缓存
              cacheDirectory: true,
          },
      },
  ],
}
