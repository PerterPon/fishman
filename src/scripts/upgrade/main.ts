
/*
 * main.ts
 * Author: perterpon<perterpon@gmail.com>
 * Create: Fri Dec 13 2019 15:52:55 GMT+0800 (中国标准时间)
 */

import { init as initMonitor, startMonitor, eventBus, statusValue } from 'src/monitor';

import { keyPress, keyDown, keyUp, releaseAllKey } from 'src/ability/keyboard';
import { releaseAllMouse } from 'src/ability/mouse';
import { keyMap } from 'src/constants/keymap';

import { sleep } from 'src/util';
import { runTo, stopRun } from 'src/ability/walk';

import { enterCombat as paladinEnterCombat, leaveCombat as paladinLeaveCombat } from 'src/scripts/upgrade/occupation/paladin';
import { TPoint } from 'fishman';
import { TRoadPoint } from 'fishman/map';

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
    stopRun();
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

const roads: TRoadPoint[] = [{"x":5608,"y":6021,"facing":4957},{"x":5628,"y":6012,"facing":5315},{"x":5712,"y":5918,"facing":5793},{"x":5712,"y":5918,"facing":5793},{"x":5712,"y":5918,"facing":5793},{"x":5712,"y":5918,"facing":5793},{"x":5712,"y":5918,"facing":5793},{"x":5712,"y":5918,"facing":5793},{"x":5712,"y":5918,"facing":5793},{"x":5808,"y":5631,"facing":47},{"x":5798,"y":5572,"facing":584},{"x":5798,"y":5572,"facing":584},{"x":5798,"y":5572,"facing":584},{"x":5798,"y":5572,"facing":584},{"x":5798,"y":5572,"facing":584},{"x":5798,"y":5572,"facing":584},{"x":5798,"y":5572,"facing":584},{"x":5798,"y":5572,"facing":584},{"x":5798,"y":5572,"facing":584},{"x":5653,"y":5265,"facing":1091},{"x":5558,"y":5201,"facing":1480},{"x":5475,"y":5193,"facing":2045},{"x":5402,"y":5254,"facing":2342},{"x":5341,"y":5342,"facing":2059}]; 
let currentIndex = 0;
async function patrolUntilFindATarget(): Promise<void> {
  while (0 === statusValue.combat) {
    combatCheck();
    const nowFacing: number = roads[currentIndex].facing;
    if (-1 !== currentIndex) {
      for (let i = currentIndex + 1; i < roads.length; i++) {
        if (nowFacing === roads[currentIndex + 1].facing) {
          currentIndex++;
        } else {
          break;
        }
      }
    }

    if (currentIndex >= roads.length) {
      currentIndex = 0;
    }
    await runTo(roads[currentIndex++]);
    // currentIndex++;
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
  initMonitor();
  startMonitor();
  registerEvents();
  await sleep(1000);
  patrolUntilFindATarget();
}

init();


const ioHook = require('iohook');
ioHook.on('keydown', (event:any) => {
  if (64 === event.keycode) {
      console.log('start');
      // start();
  } else if (65 === event.keycode) {
      console.log('stop');
      // stop();
      releaseAllKey();
      releaseAllMouse();
  } else if (66 === event.keycode) {
    console.log('start record');
    // startRecord();
  } else if (67 === event.keycode) {
    console.log('stop record');
    releaseAllMouse();
    releaseAllKey();
    // stopRecord();
  }
});

// Register and start hook
ioHook.start();