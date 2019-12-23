
/*
* patrol.ts
* Author: perterpon<perterpon@gmail.com>
* Create: Sun Dec 22 2019 12:34:04 GMT+0800 (中国标准时间)
*/

import { workerData } from 'worker_threads';
import * as path from 'path';

import { init as coreInit } from 'src/scripts/upgrade/multi-thread/init';
import { runTo, aiRunTo, stopRun } from 'src/ability/run';
import { keyPress } from 'src/ability/keyboard';
import { keyMap } from 'src/constants/keymap';

import { sleep } from 'src/util';

import vision from 'src/vision';

import { TRoadPoint } from "fishman/map";

const roads: TRoadPoint[] = [{"x":4370,"y":5227,"facing":1694},{"x":4289,"y":5245,"facing":2022},{"x":4179,"y":5336,"facing":2481},{"x":4174,"y":5367,"facing":2973},{"x":4163,"y":5426,"facing":2436},{"x":4145,"y":5440,"facing":1927},{"x":4105,"y":5457,"facing":1392},{"x":4085,"y":5450,"facing":1020},{"x":3980,"y":5347,"facing":438},{"x":3978,"y":5317,"facing":6187},{"x":3988,"y":5290,"facing":5515},{"x":4007,"y":5277,"facing":5096},{"x":4024,"y":5258,"facing":5425},{"x":4040,"y":5238,"facing":5185},{"x":4061,"y":5233,"facing":4620},{"x":4082,"y":5233,"facing":4813},{"x":4123,"y":5233,"facing":4410},{"x":4139,"y":5253,"facing":4007},{"x":4139,"y":5253,"facing":4007},{"x":4269,"y":5412,"facing":4426},{"x":4290,"y":5415,"facing":4785},{"x":4331,"y":5405,"facing":5023}];

export async function start(): Promise<void> {
  await init();
  tryFindTarget();
  startPatrol();
}

async function init(): Promise<void> {
  await coreInit();
}

async function tryFindTarget(): Promise<void> {
  while (true) {
    await sleep(1000);
    keyPress(keyMap.f4);
    await sleep(100);
    const { target_exists, target_maxDistance } = vision.monitorValue;
    if (1 === target_exists && 45 < target_maxDistance) {
      await stopPatrol();
      await tryAttack();
      // failed to find a target, restart
      keyPress(keyMap.esc);
      startPatrol();
      // reset 5's
      await sleep(5 * 1000);
    }
  }
}

async function tryAttack(): Promise<void> {
  const attackFile: string = path.join(__dirname, 'attack', `${vision.occupation}.js`);
  // wait until enter into combat
  await require(attackFile).tryAttack();
}

let currentIndex: number = -1;
let patroling: boolean = false;
async function startPatrol(): Promise<void> {
  currentIndex = findNearestPoint(roads);
  patroling = true;
  while (true === patroling) {
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
  }
}

async function stopPatrol(): Promise<void> {
  patroling = false;
  await stopRun();
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
