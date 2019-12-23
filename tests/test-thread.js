const { Worker, isMainThread } = require('worker_threads');



if (true === isMainThread) {
  const worker = new Worker(__filename);
  worker.on('exit', () => {
    console.log('exit');
  })
  // worker.terminate();
} else {

}