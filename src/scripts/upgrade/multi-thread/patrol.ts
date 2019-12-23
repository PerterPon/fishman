
/*
* patrol.ts
* Author: perterpon<perterpon@gmail.com>
* Create: Sun Dec 22 2019 12:34:04 GMT+0800 (中国标准时间)
*/

import * as path from 'path';

import { runTo, aiRunTo, stopRun } from 'src/ability/run';
import { keyPress } from 'src/ability/keyboard';
import { keyMap } from 'src/constants/keymap';

import { sleep } from 'src/util';

import vision from 'src/vision';

import { TRoadPoint } from "fishman/map";

const roads: TRoadPoint[] = [{"x":4643,"y":4481,"facing":6158},{"x":4646,"y":4448,"facing":5965},{"x":4657,"y":4423,"facing":5680},{"x":4682,"y":4375,"facing":5515},{"x":4719,"y":4305,"facing":6021},{"x":4714,"y":4277,"facing":320},{"x":4700,"y":4255,"facing":827},{"x":4681,"y":4253,"facing":2241},{"x":4670,"y":4278,"facing":2686},{"x":4649,"y":4329,"facing":2165},{"x":4587,"y":4403,"facing":2837},{"x":4584,"y":4432,"facing":3181},{"x":4588,"y":4461,"facing":3598},{"x":4602,"y":4482,"facing":4222},{"x":4622,"y":4486,"facing":4894},{"x":4641,"y":4477,"facing":5280},{"x":4655,"y":4457,"facing":5714},{"x":4660,"y":4428,"facing":147},{"x":4657,"y":4412,"facing":580}];

export async function start(): Promise<void> {
  await init();
  // await rest();
  // tryFindTarget();
  startPatrol();
}

async function rest(): Promise<void> {
  const targetRestFile: string = path.join(__dirname, 'rest', `${vision.occupation}.js`);
  const restWay = require(targetRestFile);
  await restWay.start();
}

async function init(): Promise<void> {
  // await coreInit();
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
