
/*
* mind.ts
* Author: perterpon<perterpon@gmail.com>
* Create: Fri Oct 25 2019 18:27:22 GMT+0800 (China Standard Time)
*/

import chalk from 'chalk';

import vision from 'src/vision';

import { judgeSituation, getSituation, getAllSituation } from 'src/situation';
import { getSituationProbability, updateSituationModel } from 'src/model';

import { TSituation, TSituationProbability } from "fishman";


/**
 * calculate current situation
 *
 * @export
 * @returns {Promise<TSituation>}
 */
export async function calculateSituation(): Promise<TSituation> {
  const currentSituation: TSituation = vision.situation;
  
  const spData: TSituationProbability[] = getSituationProbability(currentSituation.name);
  let situation: TSituation = null;

  for (let i = 0; i < spData.length; i++) {
    const sp: TSituationProbability = spData[i];
    const sName: string = sp.name;
    const rightSituation: boolean = await judgeSituation(sName);
    if (true === rightSituation) {
      situation = getSituation(sName);
      break;
    }
  }

  if (null === situation) {
    debugger;
    console.log(chalk.yellow(`enter full situation scan!`));
    const allSituations: string[] = getAllSituation();
    for (let i = 0; i < allSituations.length; i++) {
      const sName: string = allSituations[i];
      debugger;
      const result: boolean = await judgeSituation(sName);
      if (true === result) {
        situation = getSituation(sName);
        break;
      }
    }
  }

  if (null !== situation) {
    updateSituationModel(currentSituation.name, situation.name);
  }

  return situation;
}
