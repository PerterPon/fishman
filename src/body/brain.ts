
/*
 * brain.ts
 * Author: perterpon<perterpon@gmail.com>
 * Create: Mon Oct 21 2019 15:16:48 GMT+0800 (中国标准时间)
 */

import chalk from 'chalk';
import { debug } from 'debug';

import vision from 'src/vision';
import { getConfig } from 'src/core/config';

import { calculateGlobalSituation, calculateNextSituation } from 'src/body/mind';
import { doAction } from 'src/body/limb';

import { TSituation } from 'fishman';
import { sleep } from 'src/util';
import { LOOK_DELAY } from 'src/constants';

const debugLog: debug.Debugger = debug("brain");
const config = getConfig();

export async function startWorkWay2(): Promise<void> {
  const config = getConfig();
  vision.biz = config.biz;
  await sleep(3000);
  console.log('start working...');

  debugger;
  while (true) {
    let situation: TSituation = vision.situation;

    if (null === situation) {
      console.log(chalk.yellow('enter global situation judge'));

      situation = calculateGlobalSituation();
      if (null === situation) {
        console.log(chalk('could not judge current situation, exit!'));
        process.exit(99);
      }

      vision.situation = situation;
      continue;
    }

    await doAction(situation);
    await sleep(situation.delay || LOOK_DELAY);

    const nextSituation: TSituation = calculateNextSituation(situation);
    vision.situation = nextSituation;

  }
}
