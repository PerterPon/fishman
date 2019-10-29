
/*
* mind.ts
* Author: perterpon<perterpon@gmail.com>
* Create: Fri Oct 25 2019 18:27:22 GMT+0800 (China Standard Time)
*/

import vision from 'src/vision';

import { judgeSituation, getSituation } from 'src/situation';
import { getSituationProbability } from 'src/model';

import { TSituation, TSituationProbability } from "fishman";

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
    // TODO: add situation global judge logic
  }
  return situation;
}
