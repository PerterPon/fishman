
/*
 * bn_open_game_btn.ts
 * Author: perterpon<perterpon@gmail.com>
 * Create: Fri Nov 08 2019 19:45:06 GMT+0800 (China Standard Time)
 */

import { TMemory, TPoint, TBitmap, TFeatureMap, TFeatureMemory, TRect, TSize } from "fishman";
import { ETemplate } from "src/constants/enums";

import * as util from 'src/util';

export function match(featureMemory: TFeatureMemory): TRect {
  
  const img: TBitmap = featureMemory.picture;
  const rect: TRect = featureMemory.rect;

  const area: TRect = util.imgTemplateJudge(img, ETemplate.BN_OPEN_GAME_BTN);
  if (null === area) {
    return null;
  }
  return area;
}
