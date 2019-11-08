
/*
* index.ts
* Author: perterpon<perterpon@gmail.com>
* Create: Wed Nov 06 2019 15:15:42 GMT+0800 (中国标准时间)
*/

import { EFeature, ETemplate } from "src/constants/enums";

import { TMemory, TPoint, TFeatureMemory, TFeature, TPointTemplate, TRect } from "fishman";
import { getTemplate } from "src/model/template";

export function matchFeature(featureName: EFeature, featureMemory: TFeatureMemory): TRect {
  const feature = require(`./${featureName}`);
  return feature.match(featureMemory);
}

export function getFeature(featureName: string): TFeature {
  const template: TPointTemplate = getTemplate(featureName as ETemplate);
  return {
    size: {
      w: template.width,
      h: template.height
    }
  }
}
