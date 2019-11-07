
/*
 * brain.ts
 * Author: perterpon<perterpon@gmail.com>
 * Create: Mon Oct 21 2019 15:16:48 GMT+0800 (中国标准时间)
 */

import chalk from 'chalk';
import { debug } from 'debug';

import { startFish } from 'src/biz/fish';
import vision from 'src/vision';
import { sleep } from 'src/util';
import { getConfig } from 'src/core/config';

import { look } from 'src/body/eye';
import { calculateSituation, judgeTemplate } from 'src/body/mind';
import { doAction } from 'src/body/limb';
import { remember, rememberContext } from 'src/body/memory';

import { LOOK_DELAY, TOTAL_VISION } from 'src/constants';

import { TAction, TSituation, TMemory, TBitmap, TRect, TPoint, TPointTemplate } from 'fishman';
import { ETemplate } from 'src/constants/enums';

const debugLog: debug.Debugger = debug("brain");
const config = getConfig();

export async function startWork(): Promise<void> {
  const config = getConfig();
  vision.biz = config.biz;
  console.log('start working ...');

  while (true) {
    await sleep(vision.nextLookTime || LOOK_DELAY);
    const memory: TMemory = await doLook(vision.nextView || TOTAL_VISION);
    const situation: TSituation = await calculateSituation();
    let situationName: string = '';

    if (null === situation) {
      console.log(chalk.yellow('can not get situation!'));
      continue;
    } else {
      situationName = situation.name;
      vision.situation = situation;
      // if situation need ask look time and view rect
      if (situation.nextLookTime) {
        vision.nextLookTime = situation.nextLookTime;
      }
      if (situation.nextView) {
        vision.nextView = situation.nextView;
      }
      console.log(`got situation: [${situationName}]`);
      const action: TAction = situation.action;
      let templatePoints: Map<ETemplate, TPoint> = new Map();

      // if action need review, look another picture
      if (true === action.review || true === config.intelligence) {
        let view: TRect = null;

        // action did not provide view, use the default view
        if(undefined === action.view) {
          view = TOTAL_VISION;
          console.log(chalk.yellow(`action: [${action.name}] need review, but did not provide view rect! Using the default view`));
        }

        await doLook(view);
        templatePoints = findActionTemplate(view, action.targetRectTemps);
      }

      await doAction(action, templatePoints);
    }

    rememberContext(memory, situationName);
  }

}

function findActionTemplate(view: TRect, templates: ETemplate[]): Map<ETemplate, TPoint> {
  const templateMap: Map<ETemplate, TPoint> = new Map();
  for (let i = 0; i < templates.length; i++) {
    const template: ETemplate = templates[i];
    const point: TPoint = judgeTemplate(template);
    // transform to global coordinate
    point.x += view.x;
    point.y += view.y;
    templateMap.set(template, point);
  }
  return templateMap;
}

async function doLook(rect: TRect): Promise<TMemory> {
  const picture: TBitmap = look(rect);
  const memory: TMemory = {
    time: Date.now(),
    picture,
    rect: rect,
  };
  remember(memory);
  return memory;
}