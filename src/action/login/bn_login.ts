
/*
* index.ts
* Author: perterpon<perterpon@gmail.com>
* Create: Mon Nov 04 2019 16:56:20 GMT+0800 (China Standard Time)
*/


import { getTemplate } from 'src/model/template';

import * as mouse from 'src/ability/mouse';
import * as utils from 'src/util';

import { ETemplate } from "src/constants/enums";
import { TPoint, TAction, TPointTemplate } from "fishman";

let loginBtnPoint: TPoint = null; 

export function getAction(): TAction {
  let review: boolean = null === loginBtnPoint;
  return {
    name: 'login/bn_login',
    review,
    targetRectTemps: [ETemplate.BN_LOGIN_BUTTON]
  }
}

export function doAction(templateMap: Map<ETemplate, TPoint>): void {
  const btnPoint: TPoint = templateMap.get(ETemplate.BN_LOGIN_BUTTON);
  if (undefined !== btnPoint) {
    loginBtnPoint = btnPoint;
  }
  if (null === loginBtnPoint) {
    console.error(`trying to do action: [bn_login], but with no template point data!`);
    return;
  }

  const centerPoint: TPoint = utils.getTemplateCenter(ETemplate.BN_LOGIN_BUTTON);

  mouse.moveTo(centerPoint.x + btnPoint.x, centerPoint.y + btnPoint.y);
  utils.humanDelay();
  mouse.leftClick();
  utils.humanDelay();

}
