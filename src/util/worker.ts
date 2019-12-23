
/*
 * worker.ts
 * Author: perterpon<perterpon@gmail.com>
 * Create: Mon Dec 23 2019 11:49:44 GMT+0800 (中国标准时间)
 */

import { workerData, parentPort } from 'worker_threads';

import vision from 'src/vision';
vision.occupation = workerData.occupation;
vision.deviceHandler = workerData.deviceHandler;

parentPort.once('message', (message) => {
  if ('start' === message.event) {
    require(workerData.file).start();
  }
});
