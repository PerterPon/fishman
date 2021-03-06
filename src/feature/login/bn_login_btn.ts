
/*
* bn_login_btn.ts
* Author: perterpon<perterpon@gmail.com>
* Create: Wed Nov 06 2019 15:15:20 GMT+0800 (中国标准时间)
*/

import { TMemory, TPoint, TBitmap, TFeatureMap, TFeatureMemory, TRect, TSize } from "fishman";
import { ETemplate } from "src/constants/enums";

import * as util from 'src/util';

export function match(featureMemory: TFeatureMemory): TRect {
  
  const img: TBitmap = featureMemory.picture;
  const rect: TRect = featureMemory.rect;

  const area: TRect = util.imgTemplateJudge(img, ETemplate.BN_LOGIN_BTN);
  if (null === area) {
    return null;
  }
  debugger;
  area.x += rect.x;
  area.y += rect.y;
  return area;
}
