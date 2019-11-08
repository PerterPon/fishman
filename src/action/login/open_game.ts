
/*
 * open_game.ts
 * Author: perterpon<perterpon@gmail.com>
 * Create: Fri Nov 08 2019 18:04:50 GMT+0800 (中国标准时间)
 */

import * as mouse from 'src/ability/mouse';
import * as utils from 'src/util';

import { ETemplate } from "src/constants/enums";
import { TPoint, TAction, TFeatureMap } from "fishman";

export function getAction(): TAction {
  return {
    name: 'login/open_game',
    targetRectTemps: [ETemplate.BN_OPEN_GAME_BTN]
  }
}

export function doAction(templateMap: TFeatureMap): void {
  console.log('do open game');
  // utils.templateBtnClick(templateMap, ETemplate.GAME_LOGIN_BUTTON);
}
