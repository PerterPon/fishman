
/*
* bn_offline.ts
* Author: perterpon<perterpon@gmail.com>
* Create: Mon Oct 28 2019 21:30:08 GMT+0800 (China Standard Time)
*/

import { getAction } from 'src/action';

import { matchFeature } from 'src/feature';

import { TSituation, TMemory, TPoint, TFeatureMap, TFeatureMemories, TFeatureMemory, TFeature, TRect } from "fishman";
import { EFeature } from 'src/constants/enums';

export function judge(featuresMap: TFeatureMemories): TFeatureMap {
  const featureMemory: TFeatureMemory = featuresMap[EFeature.BN_LOGIN_BTN] || featuresMap.global;
  const point: TRect = matchFeature(EFeature.BN_LOGIN_BTN, featureMemory);
  if (null === point) {
    return null;
  }

  return {
    [EFeature.BN_LOGIN_BTN]: point
  }
}

export function getSituation(): TSituation {
  return {
    name: 'login/bn_offline',
    required: [EFeature.BN_LOGIN_BTN],
    optional: [],
    delay: 1000,
    action: getAction('login/bn_login'),
  }
}
