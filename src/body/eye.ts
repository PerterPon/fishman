
/*
* eye.ts
* Author: perterpon<perterpon@gmail.com>
* Create: Fri Oct 25 2019 17:51:57 GMT+0800 (China Standard Time)
*/

import { TRect, TPixel } from "fishman";

const watchingArea: TRect = {
  x: 0,
  y: 0,
  w: 0,
  h: 0
};

export async function look(rect: TRect): Promise<TPixel[]> {
  return [];
}

export async function read(rect: TRect): Promise<string[]> {
  return ['0'];
}
