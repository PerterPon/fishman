
/*
 * worker.ts
 * Author: perterpon<perterpon@gmail.com>
 * Create: Mon Dec 23 2019 15:15:55 GMT+0800 (中国标准时间)
 */

import { EventEmitter } from 'events';

import { MONITOR_STATUS_INDEX } from 'src/constants';
import vision from 'src/vision';

import { sleep } from 'src/util';

export async function start(): Promise<void> {
  vision.monitor = new EventEmitter();
  startMonitor();
}

async function startMonitor(): Promise<void> {
  while (true) {
    const newState: {[name: string]: number} = parseMonitorValue(vision.sharedValue);
    compareState(newState);
    vision.monitorValue = newState;
    await sleep(5);
  }
}

function parseMonitorValue(sharedMonitorValue: Uint32Array): {[name: string]: number} {
  const newStatusValue: {[name: string]: number} = {};
  for (let i = 0; i < MONITOR_STATUS_INDEX.length; i++) {
    const key: string = MONITOR_STATUS_INDEX[i];
    const value: number = sharedMonitorValue[i];
    newStatusValue[key] = value;
  }
  return newStatusValue;
}

function compareState(newState: {[name: string]: number}): void {
  const oldState = vision.monitorValue;
  if (null === oldState) {
    vision.monitorValue = newState;
    return;
  }

  const { monitor } = vision;
  for (let i = 0; i < MONITOR_STATUS_INDEX.length; i++) {
    const key: string = MONITOR_STATUS_INDEX[i];
    const newValue: number = newState[key];
    const oldValue: number = oldState[key];
    if (newValue !== oldValue) {
      monitor.emit(key);
    }
  }
}
