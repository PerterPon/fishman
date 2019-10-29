
/*
 * index.ts
 * Author: perterpon<perterpon@gmail.com>
 * Create: Sun Oct 27 2019 23:18:54 GMT+0800 (China Standard Time)
 */

import chalk from 'chalk';

import { TSituation } from 'fishman';

export async function judgeSituation(name: string): Promise<boolean> {
  const situationData = require(`./${name}`);
  if (undefined === situationData) {
    console.log(chalk.yellow(`no situation found by name: [${name}]`));
    return false;
  }
  return await situationData.judge();
}

export function getSituation(name: string): TSituation {
  const situationData = require(`./${name}`);
  if (undefined === situationData) {
    console.log(`no situation found by name: [${name}]`);
    return null;
  }

  return situationData.situation;
}
