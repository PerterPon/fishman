
/*
 * main.ts
 * Author: perterpon<perterpon@gmail.com>
 * Create: Fri Dec 13 2019 15:52:55 GMT+0800 (中国标准时间)
 */

import { startMonitor, eventBus, statusValue } from 'src/monitor';

import { keyPress, keyDown, keyUp } from 'src/ability/keyboard';
import { sleep } from 'src/util';
import { keyMap } from 'src/constants/keymap';
import { walkTo, stopWalk } from 'src/ability/walk';

import { enterCombat as paladinEnterCombat, leaveCombat as paladinLeaveCombat } from 'src/scripts/upgrade/occupation/paladin';
import { TPoint } from 'fishman';

let combatTimes: number = 0;
let notCombatTimes: number = 0;

export async function cycleDoUntilEnterCombat(code: number[], time: number): Promise<void> {
  while (run && 0 === statusValue.combat) {
      await sleep(time);
      if (1 === (statusValue.combat) as any) {
          break;
      }
      for (let i = 0; i < code.length; i++) {
          keyPress(code[i]);
      }
      
  }
}

export async function cycleDoUntilLeaveCombat(code: number[], time: number): Promise<void> {
  while (run && 1 === statusValue.combat) {
      await sleep(time);
      if (0 === (statusValue.combat) as any) {
          break;
      }
      for (let i = 0; i < code.length; i++) {
          keyPress(code[i]);
      }
  }
}

export function combatPress(code: number) {
  if (1 === statusValue.combat) {
    keyPress(code);
  }
}

export function notCombatPress(code: number) {
  if (0 === statusValue.combat) {
    keyPress(code);
  }
}

const occupation: string = 'paladin';

function registerEvents(): void {
  eventBus.on('combat', combatChange);
  eventBus.on('float_xp', xpChange);
}

async function combatChange() {
  if (1 === statusValue.combat) {
    combatTimes++;
    stopWalk();
    enterCombat();
  } else if (0 === statusValue.combat) {
    notCombatTimes++;
    leaveCombat();
  }
}

async function enterCombat(): Promise<void> {
  if ('paladin' === occupation) {
    await paladinEnterCombat();
  }
}

async function leaveCombat(): Promise<void> {
  if ('paladin' === occupation) {
    await paladinLeaveCombat();
  }
  
  console.log('start run to next location');
  await patrolUntilFindATarget();
}

const roads: TPoint[] = [];
let currentIndex = 0;
async function patrolUntilFindATarget(): Promise<void> {
  while (0 === statusValue.combat) {
    combatCheck();
    await walkTo(roads[currentIndex + 1]);
    currentIndex++;
    await tryFindTarget();
  }
}

async function tryFindTarget(): Promise<void> {
  const currentX: number = statusValue.player_x;
  const currentY: number = statusValue.player_y;

  // 1. try to find an target
  notCombatPress(keyMap.tab);

  if (
    1 === statusValue.target_exists &&
    statusValue.target_level >= statusValue.player_level - 5 &&
    statusValue.target_level <= statusValue.player_level + 1
  ) {
    // 2. try to run to target
    notCombatPress(keyMap.f4);
    await sleep(500);
    combatCheck();
    // 2.1 too far away, abandon
    if (currentX === statusValue.player_x && currentY === statusValue.player_y) {
      notCombatPress(keyMap.esc);
    } else {
      // 3. wait into combat
      await sleep(15 * 1000);
    }
  }

}

function combatCheck() {
  if (1 === statusValue.combat) {
    throw 'combating';
  }
}

async function xpChange(): Promise<void> {

}

async function init(): Promise<void> {
  startMonitor();
  registerEvents();
}

init();
