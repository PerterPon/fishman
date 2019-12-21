
/*
* msdk.ts
* Author: perterpon<perterpon@gmail.com>
* Create: Fri Oct 25 2019 17:41:44 GMT+0800 (China Standard Time)
*/

import { TPoint } from "fishman";
import * as path from 'path';
const ffi = require('ffi');

var libm = ffi.Library('D:\\wow\\fishman\\src\\core\\msdk.dll', {
  'M_Open': [ 'int', [ 'int' ] ],
  'M_Close': [ 'int', [ 'int' ] ],
  'M_KeyPress': [ 'int', [ 'int', 'int', 'int'] ],
  'M_KeyDown': [ 'int', [ 'int', 'int'] ],
  'M_KeyUp': [ 'int', [ 'int', 'int'] ],
  'M_LeftClick': [ 'int', [ 'int', 'int' ] ],
  'M_MoveTo' : [ 'int', [ 'int', 'int', 'int' ]],
  'M_MoveTo2' : [ 'int', [ 'int', 'int', 'int' ]],
  'M_LeftDown' : [ 'int', [ 'int' ] ],
  'M_LeftUp' : [ 'int', [ 'int' ] ],
  'M_RightDown' : [ 'int', [ 'int' ] ],
  'M_RightUp' : [ 'int', [ 'int' ] ],
  'M_RightClick': [ 'int', [ 'int', 'int' ] ],
  'M_ReleaseAllMouse': [ 'int', ['int'] ],
  'M_ReleaseAllKey': [ 'int', ['int'] ],
});

const deviceHandler: number = libm.M_Open(1);
releaseAllKey();
console.log(`msdk got handler: [${deviceHandler}]`);

export async function init(): Promise<void> {

}

export function moveTo(x: number, y: number): void {
  libm.M_MoveTo(deviceHandler, x, y);
}

export function moveTo2(x: number, y: number): void {
  libm.M_MoveTo2(deviceHandler, x, y);
}

export function leftClick(): void {
  libm.M_LeftClick(deviceHandler);
}

export function rightClick(): void {
  libm.M_RightClick(deviceHandler);
}

export function leftDown(): void {
  libm.M_LeftDown(deviceHandler);
}

export function leftUp(): void {
  libm.M_LeftUp(deviceHandler);
}

export function rightDown(): void {
  libm.M_RightDown(deviceHandler);
}

export function rightUp(): void {
  libm.M_RightUp(deviceHandler);
}

export function keyPress(keyCode: number): void {
  libm.M_KeyPress(deviceHandler, keyCode, 1);
}

export function keyDown(keyCode: number): void {
  libm.M_KeyDown(deviceHandler, keyCode);
}

export function keyUp(keyCode: number): void {
  libm.M_KeyUp(deviceHandler, keyCode);
}

export function releaseAllKey(): void {
  libm.M_ReleaseAllKey(deviceHandler);
}

export function releaseAllMouse(): void {
  libm.M_ReleaseAllMouse(deviceHandler);
}
