
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

// import { enterCombat as paladinEnterCombat, leaveCombat as paladinLeaveCombat, findTarget as paladinFindTarget } from 'src/scripts/upgrade/occupation/paladin';
import { TPoint } from 'fishman';
import { TRoadPoint } from 'fishman/map';
import vision from 'src/vision';

let combatTimes: number = 0;
let notCombatTimes: number = 0;

export async function cycleDoUntilEnterCombat(code: number[], time: number): Promise<void> {
  while (0 === statusValue.combat) {
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
  while (1 === statusValue.combat) {
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
  await require(`src/scripts/upgrade/occupation/${occupation}`).enterCombat();
  // if ('paladin' === occupation) {
  //   await paladinEnterCombat();
  // }
}

async function leaveCombat(): Promise<void> {
  await require(`src/scripts/upgrade/occupation/${occupation}`).leaveCombat();

  // if ('paladin' === occupation) {
  //   await paladinLeaveCombat();
  // }
  
  console.log('start run to next location');
  await patrolUntilFindATarget();
}

const roads: TRoadPoint[] = [{"x":4370,"y":5227,"facing":1694},{"x":4289,"y":5245,"facing":2022},{"x":4179,"y":5336,"facing":2481},{"x":4174,"y":5367,"facing":2973},{"x":4163,"y":5426,"facing":2436},{"x":4145,"y":5440,"facing":1927},{"x":4105,"y":5457,"facing":1392},{"x":4085,"y":5450,"facing":1020},{"x":3980,"y":5347,"facing":438},{"x":3978,"y":5317,"facing":6187},{"x":3988,"y":5290,"facing":5515},{"x":4007,"y":5277,"facing":5096},{"x":4024,"y":5258,"facing":5425},{"x":4040,"y":5238,"facing":5185},{"x":4061,"y":5233,"facing":4620},{"x":4082,"y":5233,"facing":4813},{"x":4123,"y":5233,"facing":4410},{"x":4139,"y":5253,"facing":4007},{"x":4139,"y":5253,"facing":4007},{"x":4269,"y":5412,"facing":4426},{"x":4290,"y":5415,"facing":4785},{"x":4331,"y":5405,"facing":5023}];

let currentIndex = 0;
async function patrolUntilFindATarget(): Promise<void> {
  currentIndex = findNearestPoint(roads);
  console.log('currentIndex', currentIndex);
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

    if (currentIndex >= roads.length - 1) {
      currentIndex = 0;
    }
    const nextPoint: TRoadPoint = roads[currentIndex++];
    try {
      await runTo(nextPoint);
    } catch (e) {
      keyPress(keyMap.s);
      await sleep(1000);
      await aiRunTo(nextPoint);
    }

    // currentIndex++;
    await require(`src/scripts/upgrade/occupation/${occupation}`).findTarget();
    // await tryFindTarget();
  }
}

function findNearestPoint(points: TRoadPoint[]): number {
  const { player_x, player_y } = vision.monitorValue;
  let nearestDistance: number = Number.MAX_VALUE;
  let nearestIndex: number = -1;
  for(let i = 0; i < points.length; i++) {
    const point: TRoadPoint = points[i];
    const distance: number = Math.abs(
      Math.sqrt(
        Math.pow(point.x - player_x, 2) + Math.pow(point.y - player_y, 2)
      )
    );
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestIndex = i;
    }
  }
  return nearestIndex;
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