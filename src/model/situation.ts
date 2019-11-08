
/*
 * index.ts
 * Author: perterpon<perterpon@gmail.com>
 * Create: Fri Oct 25 2019 18:53:19 GMT+0800 (China Standard Time)
 */

import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'lodash';
import chalk from 'chalk';

import { getConfig } from 'src/core/config';
import { sleep } from 'src/util';

import { TSituation, TSituationProbabilityModel, TSituationModel, TPointTemplate, TPoint, TFeatureMap } from 'fishman';
import { EFeature } from 'src/constants/enums';

type TSituationData = {
  [name: string]: TSituationModel;
}

const modelDir = path.resolve(__dirname, '../../../', './src/model');
const config = getConfig();
const situationPath: string = path.join(modelDir, 'situations', `${config.biz}.json`);
let situationData: TSituationData = null;

export const situations: Map<string, TSituation> = new Map();

export async function init(): Promise<void> {
  situationData = getAllSituationModel();
}

export function getAllSituationModel(): TSituationData {
  const situationContent: string = fs.readFileSync(situationPath, 'utf-8');
  let situationData: TSituationData;
  try {
    situationData = JSON.parse(situationContent);
  } catch (e) {
    console.log(e);
  }

  return situationData;
}

export function getSituationModel(name: string): TSituationModel {
  return situationData[name];
}

export function getSituationProbability(name: string): TSituationProbabilityModel[] {
  return _.get(situationData, `${name}.probability`) as any || [];
}

export function getSituationFeatureMap(name: string): TFeatureMap {
  return _.get(situationData, `${name}.featureMap`) as any || [];
}

export function updateSituationProbability(name: string, nextSituation: string): void {
  debugger;
  let situation: TSituationModel = situationData[name];
  // 1. get situation data
  if (undefined === situation) {
    console.log(chalk.green(`new situation: [${name}]`));
    situationData[name] = {
      name: name,
      probability: [],
      featureMap: {},
    };
    situation = situationData[name];
  }

  const probability: TSituationProbabilityModel[] = situation.probability;
  let nextSituationData: any = _.find(situation.probability, {name: nextSituation} as any);
  if (undefined === nextSituationData) {
    nextSituationData = {
      name: nextSituation,
      probability: 0,
      times: 0
    };
    situation.probability.push(nextSituationData);
  }

  nextSituationData.times++;
  // 2. cal probability
  let totalTimes: number = _.sumBy(probability, 'times');
  for (let i = 0; i < probability.length; i++) {
    const item = probability[i];
    item.probability = Number((item.times / totalTimes).toFixed(4));
  }

  // 3. sort by probability
  situationData[name].probability = _.sortBy(probability, 'probability').reverse();
}

export function updateSituationFeatureMap(name: string, featureMap: TFeatureMap): void {
  let situation: TSituationModel = situationData[name];
  // 1. get situation data
  if (undefined === situation) {
    console.log(chalk.green(`new situation: [${name}]`));
    situationData[name] = {
      name: name,
      probability: [],
      featureMap: {},
    };
    situation = situationData[name];
  }

  // 2. get feature map
  situation.featureMap = Object.assign({}, situation.featureMap, featureMap);
}

async function intervalSync(): Promise<void> {

  while (true) {
    await sleep(10 * 1000);
    fs.writeFileSync(situationPath, JSON.stringify(situationData, '' as any, 4));
  }

}

intervalSync();
