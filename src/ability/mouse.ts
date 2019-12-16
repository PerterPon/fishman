
/*
* mouse.ts
* Author: perterpon<perterpon@gmail.com>
* Create: Fri Oct 25 2019 17:46:53 GMT+0800 (China Standard Time)
*/

import { releaseAllMouse as mReleaseAllMouse, moveTo as mMoveTo, moveTo2 as mMoveTo2, leftClick as mLeftClick, rightClick as mRightClick, rightDown as mRightDown, rightUp as mRightUp } from 'src/core/msdk';
import { TPoint } from 'fishman';

export function moveTo(point: TPoint): void {
  mMoveTo(point.x, point.y);
}

export function moveTo2(point: TPoint): void {
  mMoveTo2(point.x, point.y);
}

export function leftClick(): void {
  
}

export function rightClick(): void {

}

export function leftDown(): void {

}

export function leftUp(): void {
  
}

export function rightDown(): void {
  mRightDown();
}

export function rightUp(): void {
  mRightUp();
}

export function releaseAllMouse(): void {
  mReleaseAllMouse();
}
