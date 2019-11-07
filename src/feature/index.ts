
/*
* index.ts
* Author: perterpon<perterpon@gmail.com>
* Create: Wed Nov 06 2019 15:15:42 GMT+0800 (中国标准时间)
*/

import { EFeature } from "src/constants/enums";

import { TMemory } from "fishman";

export function matchFeature(featureName: EFeature, memory: TMemory[]): boolean {

  const feature = require(`./${featureName}`);
  return feature.match(memory);

}
