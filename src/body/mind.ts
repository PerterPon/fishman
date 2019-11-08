
/*
* mind.ts
* Author: perterpon<perterpon@gmail.com>
* Create: Fri Oct 25 2019 18:27:22 GMT+0800 (China Standard Time)
*/

import chalk from 'chalk';
import { Bitmap } from 'robotjs';

import vision from 'src/vision';

import { judgeSituation, getSituation, getAllSituation } from 'src/situation';
import { getSituationProbability, updateSituationModel, situations } from 'src/model/situation';
import { recall } from 'src/body/memory';
import { getTemplate } from 'src/model/template';
import { templateJudge } from 'src/ability/image_id';

import { ETemplate } from 'src/constants/enums';

import { TSituation, TSituationProbability, TPoint, TPointTemplate, TBitmap, TMemory } from "fishman";
import { imgTemplateJudge } from 'src/util';

/**
 * calculate current situation
 *
 * @export
 * @returns {Promise<TSituation>}
 */
export async function calculateSituation(): Promise<TSituation> {
  const currentSituation: TSituation = vision.situation;

  let situation: TSituation = null;
  const memory: TMemory[] = recall(10);
  if (null !== currentSituation) {
    const spData: TSituationProbability[] = getSituationProbability(currentSituation.name);

    for (let i = 0; i < spData.length; i++) {
      const sp: TSituationProbability = spData[i];
      const sName: string = sp.name;
      if (undefined === sName) {
        console.log(chalk.yellow(`trying to visit situation model with current situation: [${currentSituation.name}], but data has no name!`));
        continue;
      }
      const rightSituation: boolean = await judgeSituation(sName, memory);
      if (true === rightSituation) {
        situation = getSituation(sName);
        break;
      }
    }
  } else {
    console.log(chalk.yellow(`enter full situation scan!`));
    const matchedSName: string = await judgeGloablSituation();
    if (null === matchedSName) {
      console.log(chalk.red(`could not get current situation from global scan! Check the situation manual!`));
      return null;
    }

    situation = getSituation(matchedSName);
  }

  if (null !== situation && null !== currentSituation) {
    updateSituationModel(currentSituation.name, situation.name);
  }

  return situation;
}

export async function judgeGloablSituation(): Promise<string> {
  const allSituations: string[] = getAllSituation();
  let situationName: string = null;
  debugger;
  const memory: TMemory[] = recall(10);
  for (let i = 0; i < allSituations.length; i++) {
    const sName: string = allSituations[i];
    const result: boolean = await judgeSituation(sName, memory);
    if (true === result) {
      situationName = sName;
      break;
    }
  }

  return situationName;
}

export function judgeTemplate(template: ETemplate): TPoint {
  const [memory] = recall();
  return imgTemplateJudge(memory, template);
}
