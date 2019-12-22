
/*
* run.ts
* Author: perterpon<perterpon@gmail.com>
* Create: Sun Dec 22 2019 16:08:26 GMT+0800 (中国标准时间)
*/

import * as _ from 'lodash';
const pf = require('pathfinding');

import { keyPress, keyDown, keyUp, releaseAllKey } from 'src/ability/keyboard';
import { keyMap } from 'src/constants/keymap';
import vision from 'src/vision';

import { FACING_PER_MS, FULL_FACING } from 'src/constants';
import { sleep, fatCoorNumber } from 'src/util';
import { getMap, updateMap } from 'src/model/map';

import { TPoint } from "fishman";
import { TMap } from 'fishman/map';

let running: boolean = false;
const finder = new pf.BestFirstFinder({
  allowDiagonal: true
});

export async function stopRun(): Promise<void> {
  running = false;
  releaseAllKey();
  keyPress(keyMap.s);
}

export async function aiRunTo(targetPoint: TPoint): Promise<void> {
  const grid = new pf.Grid(1000, 1000);
  const map: TMap = getMap('test');
  const { obstacle } = map.area;
  for (let i = 0; i < obstacle.length; i++) {
    const obstaclePoint: TPoint = obstacle[i];
    const x: number = Math.floor(obstaclePoint.x / 10);
    const y: number = Math.floor(obstaclePoint.y / 10);
    grid.setWalkableAt(x, y, false);
  }
  const { player_x, player_y } = vision.monitorValue;
  console.time('find path take');
  const results:[number, number][] = finder.findPath(
    fatCoorNumber(player_x),
    fatCoorNumber(player_y),
    fatCoorNumber(targetPoint.x),
    fatCoorNumber(targetPoint.y),
    grid
  );
  console.timeEnd('find path take');
  const polyedPoints: TPoint[] = polyPoints(results);
  while(0 < polyedPoints.length && true === running) {
    const nextPoint: TPoint  = polyedPoints.shift();
    try {
      console.log('run to : ', nextPoint);
      await runTo({
        x: nextPoint.x * 10,
        y: nextPoint.y * 10
      });
    } catch (e) {
      if (0 === e.message.indexOf('Obstacle')) {
        const { player_x, player_y } = vision.monitorValue;
        console.log('ai run with a obstacle! regenerating path');
        updateMap('test', { x: player_x, y: player_y });
        await aiRunTo(targetPoint);
        return;
      }
    }
  }

  console.log(`ai run to end!`);
}

export async function runTo(point: TPoint): Promise<void> {
  console.log('run to point: ', point.x, point.y);
  keyPress(keyMap.dot);
  running = true;

  let times: number = 0;
  let latestPont: TPoint = {
    x: 0,
    y: 0
  };

  while (true === running) {
    await sleep(50);
    times++;
    const { player_x, player_y } = vision.monitorValue;
    if (22 === times) {
      times = 0;
      // find a obstacle
      if (player_x === latestPont.x && player_y === latestPont.y) {
        const error: Error = new Error(`Obstacle!, x: [${player_x}], y: [${player_y}]`);
        keyPress(keyMap.s);
        if (false === running as any) {
          return;
        }

        await sleep(100);
        throw error;
      }
      latestPont = {
        x: player_x,
        y: player_y
      }
      microAdjustFacing(point);
    }
    if (Math.abs(player_x - point.x) <= 15 && Math.abs(player_y - point.y) <= 15) {
      break;
    }
  }
}

function polyPoints(points: [number, number][]): TPoint[] {
  const result: TPoint[] = [];
  let latestFace: number = 0;
  const playerPoint: TPoint = {
    x: vision.monitorValue.player_x,
    y: vision.monitorValue.player_y
  }
  let latestPoint: TPoint = _.clone(playerPoint);
  for (let i = 0; i < points.length; i++) {
    const [x, y] = points[i];
    const face: number = parseInt(`${calculateFacing(latestPoint, { x, y })}`);
    if (face !== latestFace) {
      result.push({x, y});
      latestFace = face;
      latestPoint = {x, y}
    } else if(i === points.length - 1) {
      result.pop();
      result.push({x, y});
    }
  }

  return result;

}

async function microAdjustFacing(targetPoint: TPoint): Promise<void> {
  const { player_facing: playFacing, player_x, player_y } = vision.monitorValue;
  const targetFacing: number = calculateFacing(targetPoint, { x: player_x, y: player_y });
  const facingDis: number = Math.abs(targetFacing - playFacing);

  let code: number;
  if (playFacing < targetFacing) {
    if (targetFacing - playFacing > FULL_FACING / 2) {
      code = keyMap.d;
    } else {
      code = keyMap.a;
    }
  } else {
    if (playFacing - targetFacing > FULL_FACING / 2) {
      code = keyMap.a;
    } else {
      code = keyMap.d;
    }
  }

  keyDown(code);
  let adjustTime: number = facingDis / FACING_PER_MS;
  if (adjustTime > 1000) {
    adjustTime = 1000;
  }
  await sleep(adjustTime);
  keyUp(code);
}


function calculateFacing(targetPoint: TPoint, playerPoint: TPoint): number {
  const cycleNumber = Math.atan2(targetPoint.y - playerPoint.y, targetPoint.x - playerPoint.x) * 180 / Math.PI;
  let finalAngle = 0;
  if (0 > cycleNumber && -90 < cycleNumber) {
    finalAngle = 360 - (cycleNumber + 90);
  } else if (-90 > cycleNumber && -180 <= cycleNumber) {
    finalAngle = -1 * (cycleNumber + 90);
  } else if (0 <= cycleNumber && 90 > cycleNumber) {
    finalAngle = 360 - (cycleNumber + 90);
  } else if (90 < cycleNumber && 180 >= cycleNumber) {
    finalAngle = 180 - (cycleNumber - 90);
  }
  return finalAngle / 360 * FULL_FACING;
}
