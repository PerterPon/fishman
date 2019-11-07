
/*
* bn_login_btn.ts
* Author: perterpon<perterpon@gmail.com>
* Create: Wed Nov 06 2019 15:15:20 GMT+0800 (中国标准时间)
*/

import { TMemory, TPoint } from "fishman";
import { ETemplate } from "src/constants/enums";

import * as util from 'src/util';

export function match(memory: TMemory[]): boolean {
  const latestMemory: TMemory = memory.pop();
  const point: TPoint = util.imgTemplateJudge(latestMemory, ETemplate.BN_LOGIN_BUTTON);
  return null !== point;
}
