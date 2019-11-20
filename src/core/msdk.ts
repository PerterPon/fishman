
/*
* msdk.ts
* Author: perterpon<perterpon@gmail.com>
* Create: Fri Oct 25 2019 17:41:44 GMT+0800 (China Standard Time)
*/

import { TPoint } from "fishman";
const ffi = require('ffi');

var libm = ffi.Library('D:\\wow\\fishman\\src\\core\\msdk.dll', {
  'M_Open': [ 'int', [ 'int' ] ],
  'M_Close': [ 'int', [ 'int' ] ],
  'M_KeyPress': [ 'int', [ 'int', 'int', 'int'] ],
  'M_KeyDown': [ 'int', [ 'int', 'int'] ],
  'M_KeyUp': [ 'int', [ 'int', 'int'] ],
  'M_LeftClick': [ 'int', [ 'int', 'int' ] ]
});

const deviceHandler: number = libm.M_Open(1);
console.log(`msdk got handler: [${deviceHandler}]`);

export async function init(): Promise<void> {

}

export function moveTo(point: TPoint): void {
  
}

export function leftClick(): void {
  libm.M_LeftClick();
}

export function rightClick(): void {
  
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
