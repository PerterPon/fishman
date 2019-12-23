
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
import { startThread, stopThread } from 'src/util/thread';

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
  patrolWorker = await startThread(patrolFile);
}

async function stopPatrol(): Promise<void> {
  console.log('stopping patrol');
  await stopThread(patrolWorker);
  patrolWorker = null;
}

async function startAttack(): Promise<void> {
  console.log('start attack');
  const file: string = path.join(__dirname, 'attack', `${vision.occupation}.js`);
  attackWorker = await startThread(file);
}

async function stopAttack(): Promise<void> {
  console.log('stop attack');
  await stopThread(attackWorker);
  attackWorker = null;
}

async function startFindCorpse(): Promise<void> {
  console.log('start find corpse');
  const file: string = path.join(__dirname, 'find-corpse.js');
  findCorpseWorker = await startThread(file);
}

async function stopFindCorpse(): Promise<void> {
  console.log('stop find corpse');
  await stopThread(findCorpseWorker);
  findCorpseWorker = null;
}

async function startGoHome(): Promise<void> {
  console.log('start go home');
  const file: string = path.join(__dirname, 'go-home.js');
  goHomeWorker = await startThread(file);
}

async function stopGoHome(): Promise<void> {
  console.log('stop go home');
  stopThread(goHomeWorker);
  goHomeWorker = null;
}

async function startRest(): Promise<void> {
  console.log('start rest');
  const file: string = path.join(__dirname, 'rest', `${vision.occupation}.js`);
  restWorker = await startThread(file);
}

async function stopRest(): Promise<void> {
  console.log('stop rest');
  await stopThread(restWorker);
  restWorker = null;
}

async function stopAll(): Promise<void> {
  await stopGoHome();
  await stopPatrol();
  await stopRest();
  await stopAttack();
  await stopFindCorpse();
}

start();
