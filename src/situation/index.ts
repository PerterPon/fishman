
/*
 * index.ts
 * Author: perterpon<perterpon@gmail.com>
 * Create: Sun Oct 27 2019 23:18:54 GMT+0800 (China Standard Time)
 */

import chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'lodash';

import { TSituation, TMemory, TPoint, TSituationModel, TFeatureMap, TFeature, TFeatureMemory, TFeatureMemories } from 'fishman';
import { EFeature } from 'src/constants/enums';

let allSituations: string[] = [];
let situationMap: Map<string, string[]> = new Map();

const allFolder: string[] = fs.readdirSync(__dirname);
for(let i = 0; i < allFolder.length; i++) {
  const folderName = allFolder[i];
  const state: fs.Stats = fs.statSync(path.join(__dirname, folderName));
  if (false === state.isDirectory()) {
    continue;
  }
  const situations: string[] = fs.readdirSync(path.join(__dirname, folderName));
  for (let j = 0; j < situations.length; j++) {
    const situation: string = situations[j];
    const extName: string = path.extname(situation);
    situations[j] = `${folderName}/${situation.replace(extName, '')}`
  }
  allSituations = allSituations.concat(situations);
  situationMap.set(folderName, situations);
}

export async function init(): Promise<void> {
  console.log('init situation ...');

  console.log('init situation success ...');
}

export function quickSituationJudge(name: string, memory: TMemory[]): boolean {
  let situation;
  try {
    situation = require(`./${name}`);
  } catch (e) {
    return null;
  }

  if (undefined === situation) {
    console.log(chalk.yellow(`no situation found by name: [${name}]`));
    return false;
  }

  // TODO: multi memory support
  const latestMemory: TMemory = memory[memory.length - 1];
  const features: TFeatureMemories = latestMemory.features;
  if (undefined === features) {
    console.log(chalk.yellow(`trying to quick judge situation: [${name}], but with no feature memory!`));
    return false;
  }

  return null === situation.judge(features);
}

export function fullSituationJudge(name: string, memory: TMemory[]): TFeatureMap {
  debugger;
  let situation;
  try {
    situation = require(`./${name}`);
  } catch (e) {
    return null;
  }

  if (undefined === situation) {
    console.log(chalk.yellow(`no situation found by name: [${name}]`));
    return {};
  }

  if (false === _.isFunction(situation.judge)) {
    return null;
  }

  // TODO: multi memory support
  const latestMemory: TMemory = memory[memory.length - 1];

  // global judge, default get the first img of memory
  const features: TFeatureMemories = {
    global: {
      rect: latestMemory.rects[0],
      picture: latestMemory.pictures[0]
    }
  };

  return situation.judge(features);
}

// export async function judgeSituationWay2(name: string, memory: TMemory[], situationModel: TSituationModel): TFeatureMap {
//   const situation = require(`./${name}`);
//   if (undefined === situation) {
//     console.log(chalk.yellow(`no situation found by name: [${name}]`));
//     return {};
//   }

//   if (true === _.isFunction(situation.judge)) {
//     return await situation.judge(memory);
//   }

//   return {};
// }

export async function judgeSituation(name: string, memory: TMemory[]): Promise<{[name: string]: TPoint}> {
  const situationData = require(`./${name}`);
  if (undefined === situationData) {
    console.log(chalk.yellow(`no situation found by name: [${name}]`));
    return {};
  }

  if (true === _.isFunction(situationData.judge)) {
    return await situationData.judge(memory);
  }

  return {};
}

export function getSituation(name: string): TSituation {
  const situationData = require(`./${name}`);
  if (undefined === situationData) {
    console.log(`no situation found by name: [${name}]`);
    return null;
  }

  let situation: TSituation = null;
  if (false === _.isFunction(situationData.getSituation)) {
    console.log(chalk.red(`trying to get situation: [${name}], but has not export!`));
  } else {
    situation = situationData.getSituation();
  }

  return situation;
}

export function getFolderSituation(folderName: string): string[] {
  return situationMap.get(folderName);
}

export function getAllSituation(): string[] {
  return allSituations;
}
