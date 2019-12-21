
/*
* eye.ts
* Author: perterpon<perterpon@gmail.com>
* Create: Fri Oct 25 2019 17:51:57 GMT+0800 (China Standard Time)
*/

import { TRect, TBitmap, TMemory } from "fishman";

import { capture } from 'src/ability/capture';
import { remember } from "./memory";

export function look(rects: TRect[]): TMemory {
  const pictures: TBitmap[] = [];
  for (let i = 0; i < rects.length; i++) {
    const picture: TBitmap = capture(rects[i]);
    pictures.push(picture);
  }
  const memory: TMemory = {
    time: Date.now(),
    pictures,
    rects,
  };
  remember(memory);
  return memory;
}

export async function read(rect: TRect): Promise<string[]> {
  return ['0'];
}
