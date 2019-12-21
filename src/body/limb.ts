
/*
 * limb.ts
 * Author: perterpon<perterpon@gmail.com>
 * Create: Sat Oct 26 2019 22:04:47 GMT+0800 (China Standard Time)
 */

import { ETemplate } from 'src/constants/enums';

import { executeAction } from 'src/action';

import { TSituation, TFeatureMap } from 'fishman';
import { getSituationFeatureMap } from 'src/model/situation';

export async function doAction(situation: TSituation): Promise<void> {

  const actionName: string = situation.action.name;
  const featureMap: TFeatureMap = getSituationFeatureMap(situation.name);

  executeAction(actionName, featureMap);

}
