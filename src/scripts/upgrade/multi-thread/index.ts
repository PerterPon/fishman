
/*
 * index.ts
 * Author: perterpon<perterpon@gmail.com>
 * Create: Sun Dec 22 2019 11:25:54 GMT+0800 (中国标准时间)
 */

import { Worker } from 'worker_threads';
import * as path from 'path';

import { init as msdkInit } from 'src/core/msdk';
import { startThread, stopThread } from 'src/util/thread';
import { start as startMonitorWorker } from 'src/scripts/upgrade/multi-thread/monitor/worker';

import vision from 'src/vision';
import { sleep } from 'src/util';
import { MONITOR_STATUS_INDEX } from 'src/constants';

let currentWorker: Worker = null;

let workerMap: {[name: string]: string} = {};

async function start(): Promise<void> {
  await init();
  console.log('fishman init success!');
  await sleep(1000);
  startWorker('patrol');
}

async function init(): Promise<void> {
  initOccupation();
  initWorkerMap();
  msdkInit();
  startMonitor();
  await startMonitorWorker();
  initEvent();
}

function initWorkerMap(): void {
  workerMap = {
    'monitor': path.join(__dirname, 'monitor', 'main.js'),
    'patrol': path.join(__dirname, 'patrol.js'),
    'attack': path.join(__dirname, 'attack', `${vision.occupation}.js`),
    'findCorpse': path.join(__dirname, 'find-corpse.js'),
    'goHome': path.join(__dirname, 'go-home')
  };
}

function startMonitor(): void {
  console.log('start monitor');
  vision.sharedValue = new Uint32Array(new SharedArrayBuffer(MONITOR_STATUS_INDEX.length * 4));
  startThread(workerMap.monitor);
}

function initEvent(): void {
  vision.monitor.on('combat', combatChange);
  vision.monitor.on('player_dead', playDeadChange);
}

function initOccupation(): void {
  vision.occupation = 'paladin';
}

function combatChange(): void {
  if (1 === vision.monitorValue.combat) {
    startWorker('attack');
  } else {
    startWorker('patrol')
  }
}

function playDeadChange(): void {
  if (1 === vision.monitorValue.player_dead) {
    console.log('[WARNING] player dead!');
    startWorker('findCorpse');
  }
}

function startWorker(name: string): void {
  console.log(`start ${name}`);
  stopThread(currentWorker);
  currentWorker = startThread(workerMap[name]);
}

start();
