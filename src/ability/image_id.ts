
/*
* image_id.ts
* Author: perterpon<perterpon@gmail.com>
* Create: Fri Nov 01 2019 20:38:29 GMT+0800 (China Standard Time)
*/

import { Bitmap } from "robotjs";

import { ETemplateJudgeType } from 'src/constants/enums';

import { hex2rgb, colorAt } from 'src/util';

import { TPointTemplate, TPoint, THEXPoint, TPixel, TBitmap } from "fishman";

import { debug } from 'debug';

const debugLog: debug.Debugger = debug("iid");

export function templateJudge(img: TBitmap, template: TPointTemplate, type?: ETemplateJudgeType): TPoint {
  let targetPoint: TPoint = null;
  type = type || template.type || ETemplateJudgeType.FROM_ORIGIN;

  const start: Date = new Date();
  switch (type) {
    case ETemplateJudgeType.FROM_ORIGIN:
      targetPoint = originTemplateJudge(img, template);
      break;
    case ETemplateJudgeType.FROM_CENTER:
      targetPoint = centerTemplateJudge(img, template);
      break;
    default:
      break;
  }

  const end: Date = new Date();
  debugLog(`template judge, method: [${type}], template: [${template.name}], time: [${+end - +start}]ms`);
  return targetPoint;
}

/**
 * calculate distance between the given two colors
 *
 * @export
 * @param {string} color1
 * @param {string} color2
 * @param {number} [fidelity=1]
 * @returns {boolean}
 */
export function compareColor(color1: string, color2: string, fidelity: number = 1): boolean {
  if (1 === fidelity) {
    return color1.toLowerCase() === color2.toLowerCase();
  }
  const color1Pixel: TPixel = hex2rgb(color1);
  const color2Pixel: TPixel = hex2rgb(color2);

  const rDis: number = Math.abs(color1Pixel[0] - color2Pixel[0]);
  const gDis: number = Math.abs(color1Pixel[1] - color2Pixel[1]);
  const bDis: number = Math.abs(color1Pixel[2] - color2Pixel[2]);

  return 1 - ((rDis / 255 + gDis / 255 + bDis / 255) / 3) >= fidelity;
}

function originTemplateJudge(img: TBitmap, template: TPointTemplate): TPoint {
  let targetPoint: TPoint = null;
  const { width, height } = img;
  let matched: boolean = false;

  const firstPointColor: string = template.points[0].color;

  // 1. find the left/top origin point
  for (let i = 0; i < height; i++) {
    if (height - i < template.height || true === matched) {
      break;
    }
    for (let j = 0; j < width; j++) {
      if (width - j < template.width || true === matched) {
        break;
      }
      const color: string = colorAt(img, { x: j, y: i });
      const now: Date = new Date();
      // 2. begin match the template
      if (true === compareColor(color, firstPointColor)) {
        targetPoint = {
          x: j,
          y: i,
        };
        matched = doOriginAccurateJudge(targetPoint, img, template);
      }
    }
  }
  return targetPoint;
}

function doOriginAccurateJudge(startPoint: TPoint, img: TBitmap, template: TPointTemplate): boolean {
  let matched: boolean = true;
  const templatePoints: THEXPoint[] = template.points;
  for (let i = 0; i < templatePoints.length; i++) {
    const point: THEXPoint = templatePoints[i];
    const templateColor: string = point.color;
    const targetPoint: TPoint = {
      x: startPoint.x + point.point.x,
      y: startPoint.y + point.point.y
    };
    const imgColor: string = colorAt(img, targetPoint);
    if (false === compareColor(imgColor, templateColor)) {
      matched = false;
      break;
    }
  }

  return matched;
}

function centerTemplateJudge(img: Bitmap, template: TPointTemplate): TPoint {
  let targetPoint: TPoint = null;

  return targetPoint;
}
