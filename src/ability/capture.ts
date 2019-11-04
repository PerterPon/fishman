
/*
 * capture.ts
 * Author: perterpon<perterpon@gmail.com>
 * Create: Sun Nov 03 2019 18:24:42 GMT+0800 (China Standard Time)
 */

import { screen, Bitmap } from "robotjs";

import { TRect, TBitmap } from "fishman";

export function capture(rect: TRect): TBitmap {
  const bitmap: Bitmap = screen.capture(rect.x, rect.y, rect.w, rect.h);
  // const pixel: Uint8Array = new Uint8Array(bitmap.image);

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
