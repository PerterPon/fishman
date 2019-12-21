

const array = new Uint32Array(new SharedArrayBuffer(64));

array[0] = 1001;
console.log(array.length);
