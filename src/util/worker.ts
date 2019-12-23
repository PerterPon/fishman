
/*
 * worker.ts
 * Author: perterpon<perterpon@gmail.com>
 * Create: Mon Dec 23 2019 11:49:44 GMT+0800 (中国标准时间)
 */

import { workerData, parentPort } from 'worker_threads';
import { init as msdkInit } from 'src/core/msdk';
import { start as monitorInit } from 'src/scripts/upgrade/multi-thread/monitor/worker';

import vision from 'src/vision';
vision.occupation = workerData.occupation;
vision.deviceHandler = workerData.deviceHandler;
vision.sharedValue = workerData.sharedValue;

parentPort.once('message', async (message) => {
  if ('start' === message.event) {
    await msdkInit();
    await monitorInit();
    require(workerData.file).start();
  }
});
