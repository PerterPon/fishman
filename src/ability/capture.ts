
/*
 * capture.ts
 * Author: perterpon<perterpon@gmail.com>
 * Create: Sun Nov 03 2019 18:24:42 GMT+0800 (China Standard Time)
 */

// import { screen, Bitmap } from "robotjs";

import { TRect, TBitmap } from "fishman";

import { debug } from 'debug';

const debugLog: debug.Debugger = debug("capture");
// const debugLog = console.log as any;
export function capture(rect?: TRect): TBitmap {
  const robotjs = require('robotjs');
  const start: Date = new Date();
  let bitmap: any;
  if (undefined === rect) {
    bitmap = robotjs.screen.capture();
  } else {
    bitmap = robotjs.screen.capture(rect.x, rect.y, rect.w, rect.h);
  }
  const end: Date = new Date();
  debugLog(`capture take time: [${+end - +start}]ms with area: [${bitmap.width}, ${bitmap.height}]`);

  return {
    width: bitmap.width,
    height: bitmap.height,
    byteWidth: bitmap.byteWidth,
    bytesPerPixel: bitmap.bytesPerPixel,
    image: bitmap.image,
    bitsPerPixel: bitmap.bitsPerPixel,
    pixel: null,
    colorAt: bitmap.colorAt,
  }
}
