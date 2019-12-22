
/*
 * paladin.ts
 * Author: perterpon<perterpon@gmail.com>
 * Create: Sun Dec 22 2019 16:42:46 GMT+0800 (中国标准时间)
 */

import { parentPort, workerData } from 'worker_threads';
import * as path from 'path';
import * as fs from 'fs';

import { keyPress } from 'src/ability/keyboard';
import { keyMap } from 'src/constants/keymap';
import { startMicroTask, stopMicroTask } from 'src/util/micro_task';

import * as config from 'src/util/config';

import { init as coreInit } from 'src/scripts/upgrade/multi-thread/init';
import vision from 'src/vision';
import { sleep } from 'src/util';

const configFile: string = path.join(__dirname, 'paladin.json');

async function start(): Promise<void> {
  await coreInit();
  await initConfig();
  await startRest();
}

async function initConfig(): Promise<void> {
  config.initConfig(configFile);
}

async function startRest(): Promise<void> {
  const restConfig = config.readConfig(configFile);
  const blessTime: number = restConfig.blessTime || 0;
  await restoreHealth();
  await restorePower();

  if (Date.now() - blessTime > 5 * 50 * 1000) {
    keyPress(keyMap.f1);
    await sleep(1550);
  }
}

async function restoreHealth(health: number = 95): Promise<void> {
  return new Promise((resolve) => {
    const addBloodTask: Promise<unknown> = startMicroTask(addBlood());
    function healthChange(): void {
      if (health >= vision.monitorValue.player_health) {
        stopMicroTask(addBloodTask);
        vision.monitor.off('player_health', healthChange);
        resolve();
      }
    }

    vision.monitor.on('player_health', healthChange);
  });
}

async function addBlood(): Promise<void> {
  while (true) {
    keyPress(keyMap['4']);
    await sleep(1550);
  }
}

async function restorePower(power: number = 95): Promise<void> {
  return new Promise((resolve) => {
    keyPress(keyMap.x);

    function powerChange() {
      if (power >= vision.monitorValue.player_power) {
        vision.monitor.off('player_power', powerChange);
        resolve();
      }
    }

    vision.monitor.on('player_power', powerChange);
  });

}

parentPort.once('message', (value) => {
  if ('start' === value) {
    start();
  }
});
