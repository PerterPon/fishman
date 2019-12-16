
/*
 * walk.ts
 * Author: 王 羽涵<perterpon.wang@bytedance.com>
 * Create: Sun Nov 24 2019 15:02:46 GMT+0800 (中国标准时间)
 */

import vision from 'src/vision';
import { keyDown, keyUp, keyPress } from 'src/ability/keyboard';
import { keyMap } from 'src/constants/keymap';
import * as _ from 'lodash';
const pf = require('pathfinding');

const grid = new pf.Grid(100, 100);

import { TPoint } from 'fishman';
import { sleep } from 'src/util';
import { FULL_FACING } from 'src/constants';
import { getMap, updateMap } from 'src/model/map';
import { moveTo2, moveTo, rightDown, rightUp, releaseAllMouse } from 'src/ability/mouse';
import { TMap } from 'fishman/map';

let running: boolean = false;
const currentMap: string = '';

const finder = new pf.BestFirstFinder({
  allowDiagonal: true
});



export async function aiRunTo(point: TPoint): Promise<void> {
  const grid = new pf.grid(1000, 1000);
  const map: TMap = getMap('test');
  const { obstacle } = map.area;
  for (let i = 0; i < obstacle.length; i++) {
    const obstaclePoint: TPoint = obstacle[i];
    const x: number = Math.floor(obstaclePoint.x / 10);
    const y: number = Math.floor(obstaclePoint.y / 10);
    grid.setWalkableAt(x, y, false);
  }
  const { player_x, player_y } = vision.monitorValue;
  const results:[number, number][] = finder.findPath(player_x, player_y, point.x, point.y);
  console.log('find path:', results);
  const polyedPoints: TPoint[] = polyPoints(results);
  console.log('polyed path', polyPoints);
  while(0 < polyedPoints.length) {
    const points: TPoint  = polyedPoints.shift();
    try {
      await runTo(points);
    } catch (e) {
      if (0 === e.message.indexOf('Obstacle')) {
        const { player_x, player_y } = vision.monitorValue;
        console.log('ai run with a obstacle! regenerating path');
        updateMap('test', { x: player_x, y: player_y });
        await aiRunTo(point); 
        break;
      }
    }
    
  }
}

export async function runTo(point: TPoint): Promise<void> {
  await adjustFacing(point);

  keyDown(keyMap.w);

  let times: number = 0;
  let latestPont: TPoint = {
    x: 0,
    y: 0
  };

  while (0 === vision.monitorValue.combat) {
    await sleep(50);
    times++;
    const { player_x, player_y } = vision.monitorValue;
    if (20 === times) {
      times = 0;
      // find a obstacle
      if (player_x === latestPont.x && player_y === latestPont.y) {
        const error: Error = new Error(`Obstacle!, x: [${player_x}], y: [${player_y}]`);
        throw error;
      }
      microAdjustFacing(point);
    }

    if (Math.abs(player_x - point.x) <= 50 && Math.abs(player_y - point.y) <= 50) {
      break;
    }
  }

  keyUp(keyMap.w);
  keyUp(keyMap.w);
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
    const face: number = calculateFacing(latestPoint, { x, y });
    if (face !== latestFace) {
      result.push({x, y});
      latestFace = face;
    }
  }

  return result;

}

function microAdjustFacing(targetPoint: TPoint): Promise<void> {
  const { player_facing: playFacing, player_x, player_y } = vision.monitorValue;
  const targetFacing: number = calculateFacing(targetPoint, { x: player_x, y: player_y });
  if (Math.abs(targetFacing - playFacing) <= 10) {
    return;
  }

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

  keyPress(code);
} 

async function adjustFacing(targetPoint: TPoint): Promise<void> {
  const { player_facing: playFacing, player_x, player_y } = vision.monitorValue;
  const targetFacing: number = calculateFacing(targetPoint, { x: player_x, y: player_y });
  if (Math.abs(targetFacing - playFacing) <= 100) {
    return;
  }

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

  return new Promise(async (resolve) => {
    keyDown(code);
    while(0 === vision.monitorValue.combat) {
      await sleep(50);
      if (Math.abs(targetFacing - vision.monitorValue.player_facing) <= 100) {
        keyUp(code);
        keyUp(code);
        // vision.monitor.removeListener('player_facing', listenFacing);
        resolve();
        break;
      }
    }
  });
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

export async function stopRun(): Promise<void> {
  running = false;
}

function moveChange(): void {
  if (false === vision.monitorValue.moving) {
    // 
  }
}

function onAngleChange(targetAngle: number): void {
  const { angle } = vision.monitorValue;

}

function getCurrentAngle(point: TPoint): number {
  const { monitorValue } = vision;
  const { player_x, player_y } = monitorValue;
  const playerPoint: TPoint = {
    x: player_x,
    y: player_y,
  };
  const targetAngle: number = Math.atan(
    (point.x - player_x) / (point.y - player_y)
  );
  return targetAngle;
}
