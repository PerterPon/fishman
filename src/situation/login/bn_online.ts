
/*
 * bn_online.ts
 * Author: perterpon<perterpon@gmail.com>
 * Create: Tue Oct 29 2019 20:58:37 GMT+0800 (中国标准时间)
 */

import { TSituation, TFeatureMap, TFeatureMemory, TFeatureMemories, TRect } from "fishman";

import { getAction } from 'src/action';
import { EFeature } from "src/constants/enums";
import { matchFeature } from "src/feature";

export function judge(featuresMap: TFeatureMemories): TFeatureMap {
  const featureMemory: TFeatureMemory = featuresMap[EFeature.BN_OPEN_GAME_BTN] || featuresMap.global;
  const point: TRect = matchFeature(EFeature.BN_OPEN_GAME_BTN, featureMemory);
  if (null === point) {
    return null;
  }

  return {
    [EFeature.BN_LOGIN_BTN]: point
  }
}

export function getSituation(): TSituation {
  return {
    name: 'login/bn_online',
    required: [EFeature.BN_OPEN_GAME_BTN],
    optional: [],
    action: getAction('login/open_game')
  };
}
