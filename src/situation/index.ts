
/*
 * index.ts
 * Author: perterpon<perterpon@gmail.com>
 * Create: Sun Oct 27 2019 23:18:54 GMT+0800 (China Standard Time)
 */

import chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'lodash';

import { TSituation, TMemory } from 'fishman';

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

export async function judgeSituation(name: string, memory: TMemory[]): Promise<boolean> {
  debugger;
  const situationData = require(`./${name}`);
  if (undefined === situationData) {
    console.log(chalk.yellow(`no situation found by name: [${name}]`));
    return false;
  }

  if (true === _.isFunction(situationData.judge)) {
    return await situationData.judge(memory);
  }

  return false;
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
