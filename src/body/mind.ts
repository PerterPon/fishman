
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

import { TSituation, TSituationProbability, TPoint, TPointTemplate, TBitmap } from "fishman";

/**
 * calculate current situation
 *
 * @export
 * @returns {Promise<TSituation>}
 */
export async function calculateSituation(): Promise<TSituation> {
  const currentSituation: TSituation = vision.situation;

  let situation: TSituation = null;
  if (null !== currentSituation) {
    const spData: TSituationProbability[] = getSituationProbability(currentSituation.name);

    for (let i = 0; i < spData.length; i++) {
      const sp: TSituationProbability = spData[i];
      const sName: string = sp.name;
      const rightSituation: boolean = await judgeSituation(sName);
      if (true === rightSituation) {
        situation = getSituation(sName);
        break;
      }
    }
  }

  if (null === situation) {
    console.log(chalk.yellow(`enter full situation scan!`));
    const matchedSName: string = await judgeGloablSituation();
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
  for (let i = 0; i < allSituations.length; i++) {
    const sName: string = allSituations[i];
    const result: boolean = await judgeSituation(sName);
    if (true === result) {
      situationName = sName;
      break;
    }
  }

  return situationName;
}

export function judgeTemplate(template: ETemplate): TPoint {

  const templateInfo: TPointTemplate = getTemplate(template);
  if (undefined === templateInfo) {
    console.log(chalk.red(`trying to judge template: [${template}], but got null`));
    return null;
  }

  const [memory] = recall();
  const memoryPicture: TBitmap = memory.picture;
  const point: TPoint = templateJudge(memoryPicture, templateInfo);
  return point;
}
