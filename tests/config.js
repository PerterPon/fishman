

console.log('1111');
const a = {
  a: 8,
  b: 9,
};

module.exports = a;

setTimeout(() => {
  a.a = 10;
}, 5000);

