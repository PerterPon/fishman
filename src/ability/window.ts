
/*
* window.ts
* Author: perterpon<perterpon@gmail.com>
* Create: Fri Oct 25 2019 17:46:09 GMT+0800 (China Standard Time)
*/

import { screen, Bitmap } from "robotjs";

import { capture } from 'src/ability/capture';

import { TRect } from 'fishman';

let windowHandler: number = -1;
let winRect: TRect = null;

export function initWindow(): void {
  
}

export function captureWindow(): Bitmap {
  return capture(winRect);
}
