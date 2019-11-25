
/*
 * walk.ts
 * Author: 王 羽涵<perterpon.wang@bytedance.com>
 * Create: Sun Nov 24 2019 15:02:46 GMT+0800 (中国标准时间)
 */

import vision from 'src/vision';
import { keyDown, keyUp } from 'src/ability/keyboard';
import { keyMap } from 'src/constants/keymap';
const pf = require('pathfinding');

const grid = new pf.Grid(100, 100);

import { TPoint } from 'fishman';
import { sleep } from 'src/util';
import { FULL_FACING } from 'src/constants';

let running: boolean = false;
const currentMap: string = '';
export async function walkTo(point: TPoint): Promise<void> {
  const { player_x, player_y } = vision.monitorValue;
  const targetFacing: number = calculateFacing(point, {x: player_x, y: player_y});

  keyDown(keyMap.w);

  while (true) {
    await sleep(200);
    const { player_x, player_y } = vision.monitorValue;
    
  }
}

function calculateFacing(targetPoint: TPoint, nowPoint: TPoint): number {
  const cycleNumber = Math.atan2(nowPoint.y - targetPoint.y, nowPoint.x - targetPoint.x);
  let finalAngle = 0;
  if (0 > cycleNumber && -90 < cycleNumber) {
    finalAngle = 360 - (cycleNumber + 90);
  } else if (-90 > cycleNumber && -180 < cycleNumber) {
    finalAngle = -1 * (cycleNumber + 90);
  } else if (0 <= cycleNumber && 90 > cycleNumber) {
    finalAngle = 360 - (cycleNumber + 90);
  } else if (90 < cycleNumber && 180 > cycleNumber) {
    finalAngle = 180 - (cycleNumber - 90);
  }
  return finalAngle / 360 * FULL_FACING;
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
