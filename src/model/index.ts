
/*
 * index.ts
 * Author: perterpon<perterpon@gmail.com>
 * Create: Fri Oct 25 2019 18:53:19 GMT+0800 (China Standard Time)
 */

import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'lodash';

import { TSituation, TSituationProbability } from 'fishman';

type TSituationData = {
  [name: string]: TSituationProbability[];
}

export const situations: Map<string, TSituation> = new Map();

export function getSituationModel(): TSituationData {
  const situationPath: string = path.join(__dirname, './situation.json');
  const situationContent: string = fs.readFileSync(situationPath, 'utf-8');
  let situationData: TSituationData;
  try {
    situationData = JSON.parse(situationContent);
  } catch (e) {
    console.log(e);
  }

  return situationData;
}

export function getSituationProbability(name: string): TSituationProbability[] {
  const situationData: TSituationData = getSituationModel();
  return situationData[name] || [];
}

export function updateSituationModel(name: string, nextSituation: string): void {
  const situationData: TSituationData = getSituationModel();
  let situation = situationData[name];
  // 1. get situation data
  if (undefined === situation) {
    console.log(`new situation: [${situation}]`);
    situationData[name] = [];
    situation = situationData[name];
  }

  let nextSituationData: any = _.find(situationData, {name: nextSituation} as any);
  if (undefined === nextSituationData) {
    nextSituationData = {
      name: nextSituation,
      probability: 0,
      times: 0
    };
    situation.push(nextSituationData);
  }

  nextSituationData.times++;
  // 2. cal probability
  let totalTimes: number = _.sumBy(nextSituationData, 'times');
  for (let i = 0; i < nextSituationData.length; i++) {
    const item = nextSituationData[i];
    item.probability = Number((item.times / totalTimes).toFixed(4));
  }

  // 3. sort by probability
  situationData[name] = _.sortBy(situation, 'probability').reverse();

  // 4. write to file
  const situationPath: string = path.join(__dirname, './situation.json');
  fs.writeFileSync(situationPath, JSON.stringify(situationData, [' '], 4));
}
