
/*
* eye.ts
* Author: perterpon<perterpon@gmail.com>
* Create: Fri Oct 25 2019 17:51:57 GMT+0800 (China Standard Time)
*/

import { TRect, TBitmap } from "fishman";

import { capture } from 'src/ability/capture';

export function look(rect: TRect): TBitmap {
  return capture(rect);
}

export async function read(rect: TRect): Promise<string[]> {
  return ['0'];
}
