
/*
* index.ts
* Author: perterpon<perterpon@gmail.com>
* Create: Fri Oct 25 2019 18:57:06 GMT+0800 (China Standard Time)
*/

import { TRect } from "fishman";

export const LOOK_DELAY: number = 500;

export const MEMORY_VOLUME: number = 100;

export const WIN_TITLE_HEIGHT: number = 30;

export const WIN_WIDTH: number = 1280;
export const WIN_HEIGHT: number = 960;

export const TOTAL_VISION: TRect = {
  x: 0,
  y: 0,
  w: WIN_WIDTH,
  h: WIN_HEIGHT,
};

export const FULL_FACING: number = 6282;

export const FACING_PER_MS: number = 3.4;

export const MONITOR_POINT: number = 14;

export const MSDK_DLL: string = 'D:\\wow\\fishman\\src\\core\\msdk.dll';
