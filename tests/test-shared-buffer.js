const {
  Worker, isMainThread, parentPort, workerData
} = require('worker_threads');

if (isMainThread) {
  const sharedBuffer = new Uint32Array(new SharedArrayBuffer(8));
  // module.exports = async function parseJSAsync(script) {
  //   return new Promise((resolve, reject) => {
  const worker = new Worker(__filename, {
    workerData: {sharedBuffer}
  });
  // worker.stdout.pipe(process.stdout);
  // worker.stderr.pipe(process.stderr);
  setTimeout(() => {
    console.log(sharedBuffer);
    worker.terminate((error, code) => {
      console.log(error, code);
    });
  }, 1000);
  // worker.postMessage(sharedBuffer);
  // worker.on('message', resolve);
  // worker.on('error', reject);
  // worker.on('exit', (code) => {
  //   if (code !== 0)
  //     reject(new Error(`Worker stopped with exit code ${code}`));
  // });
  //   });
  // };
} else {
  // const { parse } = require('some-js-parsing-library');
  console.log('started');
  console.log('workerdata');
  // console.log('workerdata', workerData);
  workerData.sharedBuffer[0] = 10;
  console.log('worker 1');
  // start();
  async function sleep(time ) {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, time);
    });
  }
  async function start() {
    while (true) {
      // await sleep(10);
      Math.random();
      Math.random();
      console.log(Math.random());
    }  
  }

  // parentPort.postMessage(parse(script));
  // parentPort.on('message', (data) => {
  //   console.log(data);
  // });
}