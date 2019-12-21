
/*
 * paladin.ts
 * Author: perterpon<perterpon@gmail.com>
 * Create: Fri Dec 13 2019 15:56:01 GMT+0800 (中国标准时间)
 */

import { keyPress } from 'src/ability/keyboard';
import { keyMap } from 'src/constants/keymap';
import { sleep } from 'src/util';
import { statusValue, eventBus } from 'src/monitor';

import { cycleDoUntilLeaveCombat, combatPress, notCombatPress } from 'src/scripts/upgrade/main';
import vision from 'src/vision';

async function healthChange(): Promise<void> {
  const value: number = statusValue.player_health;
  if (0 === value) {
    return;
  }
  if (5 > value) {
    combatPress(keyMap.esc);
    combatPress(keyMap['4']);
    await sleep(1700);
    console.log('jesus');
    jesus();
  }
  if (10 > value) {
    console.log(`self save because health down to: [${value}]`);
    await selfSave();
  } else if (40 > value) {
    combatPress(keyMap.f8);
    await sleep(200);
    combatPress(keyMap['2']);
    await sleep(2 * 1000);
  }
}

async function selfSave(): Promise<void> {
  combatPress(keyMap.esc);
  combatPress(keyMap['4']);
  await sleep(1600);
  combatPress(keyMap.f5);
  await sleep(2.6 * 1000);
  combatPress(keyMap.f5);
  await sleep(2.6 * 1000);
}

async function jesus() {
  combatPress(keyMap.esc);
  await sleep(100);
  combatPress(keyMap['3']);
  combatPress(keyMap['3']);
  await sleep(100);
  combatPress(keyMap['3']);
  combatPress(keyMap['3']);
}

export async function findTarget(): Promise<void> {
  keyPress(keyMap.tab);
  await sleep(50);
  if (0 === vision.monitorValue.target_exists) {
    return;
  }

  if (45 >= vision.monitorValue.target_minDistance) {
    keyPress(keyMap.leftMiddleBrackets);
    await sleep(15 * 10);
  } else {
    keyPress(keyMap.esc);
  }
}

export async function enterCombat(): Promise<void> {
  combatPress(keyMap.s);

  combatPress(keyMap.f9);
  await sleep(1000);
  combatPress(keyMap.leftMiddleBrackets);
  await sleep(300);
  combatPress(keyMap.s);
  await sleep(300);
  combatPress(keyMap.leftMiddleBrackets);
  await sleep(300);
  combatPress(keyMap.s);

  cycleDoUntilLeaveCombat([keyMap.leftMiddleBrackets], 500);
}

export async function leaveCombat(): Promise<void> {
  notCombatPress(keyMap.f10);
  await sleep(1000);
  // search body
  notCombatPress(keyMap.leftMiddleBrackets);
  await sleep(1000);
  // clear target
  notCombatPress(keyMap.f9);
  let cureTimes: number = 0;
  while(true) {
    if (statusValue.player_health > 85) {
        break;
    }
    notCombatPress(keyMap.f5);
    cureTimes++;
    await sleep(4000);
  }

  if (cureTimes >= 2) {
    // cast too much magic, take a rest
    notCombatPress(keyMap.x);
    await sleep(cureTimes * 5 * 1000);
    notCombatPress(keyMap.x);
  }
}

function init() {
  eventBus.on('player_health', healthChange);
}

init();
