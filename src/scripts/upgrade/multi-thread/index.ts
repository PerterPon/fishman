
/*
 * index.ts
 * Author: perterpon<perterpon@gmail.com>
 * Create: Sun Dec 22 2019 11:25:54 GMT+0800 (中国标准时间)
 */

import { workerData, Worker } from 'worker_threads';
import * as path from 'path';

import { init as monitorInit, startMonitor, statusIndexMap } from 'src/scripts/upgrade/multi-thread/monitor';
import { init as coreInit } from 'src/scripts/upgrade/multi-thread/init';
import * as msdk from 'src/core/msdk';

import vision from 'src/vision';
import { sleep } from 'src/util';
import * as util from 'util';

let monitorWorker: Worker = null;
let patrolWorker: Worker = null;
let attackWorker: Worker = null;
let findCorpseWorker: Worker = null;
let goHomeWorker: Worker = null;
let restWorker: Worker = null;

async function start(): Promise<void> {
  await init();
  console.log('fishman init success!');
  await sleep(1000);
  startPatrol();
}

async function init(): Promise<void> {
  await coreInit();
  await initEvent();
}

async function initEvent(): Promise<void> {
  vision.monitor.on('combat', async () => {
    if (1 === vision.monitorValue.combat) {
      await stopAll();
      await startAttack();
    } else {
      await stopAll();
      await startRest();
      await startPatrol();
    }
  });

  vision.monitor.on('player_dead', async () => {
    if (1 === vision.monitorValue.player_dead) {
      console.log('[WARNING] player dead!');
      await stopAll();
    }
  })
}

async function startPatrol(): Promise<void> {
  console.log('starting patrol');
  const patrolFile: string = path.join(__dirname, 'patrol.js');
  console.log(msdk.deviceHandler);
  patrolWorker = new Worker(patrolFile, {
    workerData: {
      deviceHandler: msdk.deviceHandler
    }
  });
  patrolWorker.postMessage('start');
}

async function stopPatrol(): Promise<void> {
  console.log('stopping patrol');
  if (patrolWorker) {
    patrolWorker.terminate = util.promisify(patrolWorker.terminate);
    await patrolWorker.terminate();
  }
  console.log('patrol stopped!');
}

async function stopAll(): Promise<void> {
  await stopGoHome();
  await stopPatrol();
  await stopRest();
  await stopAttack();
  await stopFindCorpse();
}

async function startAttack(): Promise<void> {
}

async function stopAttack(): Promise<void> {

}

async function startFindCorpse(): Promise<void> {

}

async function stopFindCorpse(): Promise<void> {

}

async function startGoHome(): Promise<void> {

}

async function stopGoHome(): Promise<void> {

}

async function startRest(): Promise<void> {
  
}

async function stopRest(): Promise<void> {

}

start();
