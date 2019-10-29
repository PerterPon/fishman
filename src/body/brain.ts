
/*
 * brain.ts
 * Author: perterpon<perterpon@gmail.com>
 * Create: Mon Oct 21 2019 15:16:48 GMT+0800 (中国标准时间)
 */

import { sleep } from 'src/util';
import chalk from 'chalk';

import { startFish } from 'src/biz/fish';

import { look } from 'src/body/eye';
import { calculateSituation } from 'src/body/mind';
import { executeAction } from 'src/body/limb';
import { remember, rememberContext } from 'src/body/memory';

import { getSituation } from 'src/situation';
import vision from 'src/vision';

import { TAction, TSituation, TMemory, TRect, TPixel } from 'fishman';

export async function initBrain(): Promise<void> {
  vision.situation = getSituation('login/bn_offline');
}

export async function startWork(): Promise<void> {

  while (true) {
    await sleep(vision.lookTime);
    const picture: TPixel[] = await look(vision.view);
    const memory: TMemory = {
      time: Date.now(),
      // data: picture,
      pixel: picture,
      rect: vision.view,
    };
    remember(memory);

    const situation: TSituation = await calculateSituation();
    let situationName: string = '';
    if (null === situation) {
      console.log(chalk.yellow('can not get situation!'));
      continue;
    } else {
      situationName = situation.name;
      console.log(`got situation: [${situationName}]`);
      const action: TAction[] = situation.action;
      await executeAction(action);
    }

    rememberContext(memory, situationName);
  }

}
