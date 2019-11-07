
/*
* index.ts
* Author: perterpon<perterpon@gmail.com>
* Create: Mon Nov 04 2019 16:56:20 GMT+0800 (China Standard Time)
*/

import * as mouse from 'src/ability/mouse';
import * as utils from 'src/util';

import { ETemplate } from "src/constants/enums";
import { TPoint, TAction } from "fishman";

let loginBtnPoint: TPoint = null;

export function getAction(): TAction {
  debugger;
  let review: boolean = null === loginBtnPoint;
  return {
    name: 'login/bn_login',
    review,
    targetRectTemps: [ETemplate.BN_LOGIN_BUTTON]
  }
}

export function doAction(templateMap: Map<ETemplate, TPoint>): void {
  debugger;
  loginBtnPoint = utils.templateBtnClick(loginBtnPoint, templateMap, ETemplate.BN_LOGIN_BUTTON);
}
