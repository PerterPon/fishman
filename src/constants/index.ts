
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
  y: WIN_TITLE_HEIGHT,
  w: WIN_WIDTH,
  h: WIN_TITLE_HEIGHT + WIN_HEIGHT,
};
