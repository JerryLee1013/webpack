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
