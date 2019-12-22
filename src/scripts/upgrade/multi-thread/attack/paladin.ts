
/*
 * paladin.ts
 * Author: perterpon<perterpon@gmail.com>
 * Create: Sun Dec 22 2019 16:32:43 GMT+0800 (中国标准时间)
 */

import { parentPort } from 'worker_threads';

import { keyPress } from 'src/ability/keyboard';
import { init as coreInit } from 'src/scripts/upgrade/multi-thread/init';

import { keyMap } from 'src/constants/keymap';
import { sleep } from 'src/util';
import { startMicroTask, stopMicroTask } from 'src/util/micro_task';
import vision from 'src/vision';

export async function tryAttack(): Promise<void> {
  keepPress(keyMap.leftMiddleBrackets);
  await sleep(10 * 1500);
}

let keepPressTask: Promise<unknown> = null;
let attackTask: Promise<unknown> = null;
let selfSaveTask: Promise<unknown> = null;

async function keepPress(code: number): Promise<void> {
  while (true) {
    keyPress(code);
    await sleep(1000);
  }
}

async function start(): Promise<void> {
  await init();

  keyPress(keyMap.esc);
  keyPress(keyMap.s);
  await sleep(100);
  keyPress(keyMap.s);
  await sleep(100);

  attackTask = startMicroTask(startAttack());
}

async function startAttack(): Promise<void> {
  await sleep(100);
  keyPress(keyMap.f1);

  keepPressTask = startMicroTask(
    keepPress(keyMap.leftMiddleBrackets)
  );

  await sleep(1550);
  while (true) {
    keyPress(keyMap['5']);
    await sleep(1550);
    keyPress(keyMap['6']);
    await sleep(1550);
    keyPress(keyMap.f1);
    await sleep(10 * 1000);
  }
}

async function init(): Promise<void> {
  await coreInit();
  await initEvent();
}

async function healthChange(): Promise<void> {
  const { player_health } = vision.monitorValue;
  if (10 > player_health) {
    stopMicroTask(selfSaveTask);
    jesus();
  } else if (30 > player_health) {
    selfSaveTask = startMicroTask(selfSave());
  } else if (50 > player_health) {
    if (0 === vision.monitorValue.player_casting) {
      keyPress(keyMap['4']);
    }
  }
}

async function jesus(): Promise<void> {
  if (1 === vision.monitorValue.player_casting) {
    stopMicroTask(attackTask);
    stopMicroTask(keepPressTask);

    keyPress(keyMap.esc);
    await sleep(100);
  }

  keyPress(keyMap['3']);
  await sleep(1000);
  startAttack();
}

async function selfSave(): Promise<void> {
  if (1 === vision.monitorValue.player_casting) {
    stopMicroTask(attackTask);
    stopMicroTask(keepPressTask);

    keyPress(keyMap.esc);
    await sleep(100);
  }

  keyPress(keyMap['4']);
  await sleep(1550);
  keyPress(keyMap['4']);
  await sleep(1550);
}

async function initEvent(): Promise<void> {
  vision.monitor.on('player_health', healthChange);
}

parentPort.once('message', (value) => {
  if ('start' === value) {
    start();
  }
});
