const {
  Worker, MessageChannel, MessagePort, isMainThread, parentPort
} = require('worker_threads');


if (isMainThread) {
  require('./config').a = 11;
  const config = {
    a: 1,
    b: 2
  };
  const worker = new Worker(__filename, { workerData: config });
  config.a = 2;
  const subChannel = new MessageChannel();
  worker.postMessage({ hereIsYourPort: subChannel.port1 }, [subChannel.port1]);
  subChannel.port2.on('message', (value) => {
    console.log('received:', value);
  });
} else {
  console.log(require('./config'));
  parentPort.once('message', (value) => {
    console.log(require('worker_threads').workerData);
    setTimeout(() => {
      console.log(require('worker_threads').workerData);
    }, 1000);
    // assert(value.hereIsYourPort instanceof MessagePort);
    value.hereIsYourPort.postMessage('the worker is sending this');
    value.hereIsYourPort.close();
  });
}
