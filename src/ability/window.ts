
/*
* window.ts
* Author: perterpon<perterpon@gmail.com>
* Create: Fri Oct 25 2019 17:46:09 GMT+0800 (China Standard Time)
*/

import { screen, Bitmap } from "robotjs";

import { capture } from 'src/ability/capture';

import { TRect } from 'fishman';

// const user32 = U.load();
// const title = '魔兽世界\0';
// const lpszWindow = Buffer.from(title, 'ucs2')
// const hWnd = user32.FindWindowExW(null, null, null, lpszWindow);
// let windowHandler: number = hWnd;
let winRect: TRect = null;

export function initWindow(): void {
  
}

export function captureWindow(): Bitmap {
  return capture(winRect);
}
