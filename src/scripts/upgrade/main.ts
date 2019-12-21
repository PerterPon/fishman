
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
import { runTo, stopRun, aiRunTo } from 'src/ability/walk';

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
7
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

const roads: TRoadPoint[] = [{"x":5251,"y":4434,"facing":5812},{"x":5251,"y":4434,"facing":5812},{"x":5251,"y":4434,"facing":5812},{"x":5251,"y":4434,"facing":5812},{"x":5251,"y":4434,"facing":5812},{"x":5251,"y":4434,"facing":5812},{"x":5251,"y":4434,"facing":5812},{"x":5251,"y":4434,"facing":5812},{"x":5356,"y":4126,"facing":5901},{"x":5359,"y":4096,"facing":6170},{"x":5363,"y":3976,"facing":320},{"x":5354,"y":3918,"facing":6170},{"x":5366,"y":3895,"facing":5468},{"x":5372,"y":3867,"facing":94},{"x":5366,"y":3839,"facing":572},{"x":5325,"y":3735,"facing":214},{"x":5324,"y":3705,"facing":6273},{"x":5324,"y":3675,"facing":6125},{"x":5329,"y":3646,"facing":6050},{"x":5344,"y":3591,"facing":5632},{"x":5354,"y":3565,"facing":6259},{"x":5349,"y":3537,"facing":765},{"x":5332,"y":3543,"facing":2436},{"x":5323,"y":3570,"facing":2808},{"x":5321,"y":3600,"facing":3136},{"x":5323,"y":3721,"facing":3329},{"x":5330,"y":3748,"facing":3671},{"x":5344,"y":3770,"facing":3970},{"x":5358,"y":3792,"facing":3477},{"x":5366,"y":3850,"facing":3074},{"x":5359,"y":3879,"facing":2733},{"x":5352,"y":3907,"facing":3091},{"x":5351,"y":3937,"facing":3388},{"x":5360,"y":3996,"facing":3136},{"x":5359,"y":4178,"facing":2853},{"x":5342,"y":4265,"facing":2945},{"x":5325,"y":4351,"facing":2587},{"x":5302,"y":4401,"facing":2243}]; 
let currentIndex = 0;
async function patrolUntilFindATarget(): Promise<void> {
  await aiRunTo({
    x: 5096,
    y: 4123
  });
  return;
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