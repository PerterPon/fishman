



const map = new Map();

let stop = null;
const task = new Promise((resolve, reject) => {
  stop = reject;
  console.log('123123123');
  // console.log(task);
  // stop = reject;
  // map.set(this, reject);
});

new Promise((resolve, reject) => {
  map.set(task, stop);
  // stop = reject;
  // console.log('123123123');
  // console.log(task);
  // stop = reject;
  // map.set(this, reject);
});

// setTimeout(() => {
  
// }, 1000);

setImmediate(() => {
  console.log(map.get(task));
  map.get(task)();
});


