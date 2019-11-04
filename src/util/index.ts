
/*
* index.ts
* Author: perterpon<perterpon@gmail.com>
* Create: Mon Oct 21 2019 15:16:59 GMT+0800 (中国标准时间)
*/

import { TPixel, TPoint, TBitmap, TPointTemplate } from "fishman";
import { Bitmap } from "robotjs";
import { getTemplate } from "src/model/template";
import { ETemplate } from "src/constants/enums";

export async function sleep(time: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

export async function randomSleep(timeMin: number, timeMax: number): Promise<void> {
  return new Promise((resolve) => {
    const randomTime: number = Math.random() * (timeMax - timeMin) + timeMin;
    setTimeout(resolve, randomTime);
  })
}

export function hex2rgb(hexColor: string): TPixel {
  return [
    Number((parseInt(hexColor.substr(0, 2), 16)).toString(10)),
    Number((parseInt(hexColor.substr(2, 2), 16)).toString(10)),
    Number((parseInt(hexColor.substr(4, 2), 16)).toString(10))
  ];
}

export function rgb2hex(pixel: TPixel): string {
  return ((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).substr(1);
}

export function colorAt(bmpImg: TBitmap, point: TPoint): string {
  const position: number = bmpImg.byteWidth * point.y + bmpImg.bytesPerPixel * point.x;
  const rgb: TPixel = [bmpImg.image.readUInt8(position + 2), bmpImg.image.readUInt8(position + 1), bmpImg.image.readUInt8(position + 0)];
  return rgb2hex(rgb);
}

export async function humanDelay(): Promise<void> {
  await randomSleep(300, 800);
}

export function getTemplateCenter(templateName: ETemplate): TPoint {
  const template: TPointTemplate = getTemplate(templateName);
  const { width, height } = template;
  return {
    x: Math.floor(width / 2),
    y: Math.floor(height / 2),
  }
}
