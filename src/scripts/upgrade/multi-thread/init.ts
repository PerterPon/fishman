
/*
 * init.ts
 * Author: perterpon<perterpon@gmail.com>
 * Create: Sun Dec 22 2019 15:19:22 GMT+0800 (中国标准时间)
 */

import { isMainThread, workerData } from 'worker_threads';

import { init as monitorInit, startMonitor } from 'src/scripts/upgrade/multi-thread/monitor';
import vision from 'src/vision';
import * as msdk from 'src/core/msdk';

export async function init(): Promise<void> {
  if (true === isMainThread) {
    await initMain();
  } else {
    await initWorker();
  }
}

async function initMain(): Promise<void> {
  await msdk.init();
  monitorInit();
  startMonitor();
}

async function initWorker(): Promise<void> {
  const deviceHandler: number = workerData.deviceHandler;
  const occupation: string = workerData.occupation;
  if (undefined === deviceHandler || undefined === occupation) {
    throw new Error(`init worker with empty device handler or occupation!`);
  }
  vision.occupation = occupation;

  await msdk.init(msdk.deviceHandler);
  monitorInit();
  startMonitor();
}
