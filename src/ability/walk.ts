
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

let running: boolean = false;
export async function walkTo(point: TPoint): Promise<void> {
  const targetAngle: number = getCurrentAngle(point);
  vision.monitor.removeAllListeners('angle');
  vision.monitor.on('angle', onAngleChange.bind(targetAngle));

  keyDown(keyMap.w);

  while (true) {
    await sleep(1000);
    const { player_x, player_y } = vision.monitorValue;
    
  }
}

export async function stopWalk(): Promise<void> {
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
