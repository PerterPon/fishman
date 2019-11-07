
/*
* index.ts
* Author: perterpon<perterpon@gmail.com>
* Create: Mon Oct 21 2019 15:16:59 GMT+0800 (中国标准时间)
*/

import { getTemplate } from "src/model/template";
import * as mouse from 'src/ability/mouse';
import chalk from 'chalk';
import { templateJudge } from 'src/ability/image_id';

import { ETemplate } from "src/constants/enums";

import { TPixel, TPoint, TBitmap, TPointTemplate, TMemory } from "fishman";

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

export function templateBtnClick(lastPoint: TPoint, templateMap: Map<ETemplate, TPoint>, template: ETemplate): TPoint {
  const templatePoint: TPoint = templateMap.get(ETemplate.BN_LOGIN_BUTTON);
  let nowPoint: TPoint = templatePoint || lastPoint;

  if (null === templatePoint) {
    console.error(`trying to do action: [bn_login], but with no template point data!`);
    return;
  }

  const centerPoint: TPoint = getTemplateCenter(ETemplate.BN_LOGIN_BUTTON);
  mouse.moveTo(centerPoint.x + nowPoint.x, centerPoint.y + nowPoint.y);
  humanDelay();
  mouse.leftClick();
  humanDelay();

  return nowPoint;
}

export function imgTemplateJudge(memory: TMemory, template: ETemplate): TPoint {
  const templateInfo: TPointTemplate = getTemplate(template);
  if (undefined === templateInfo) {
    console.log(chalk.red(`trying to judge template: [${template}], but got null`));
    return null;
  }

  const memoryPicture: TBitmap = memory.picture;
  const point: TPoint = templateJudge(memoryPicture, templateInfo);
  return point;
}
