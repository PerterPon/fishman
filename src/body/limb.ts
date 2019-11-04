
/*
 * limb.ts
 * Author: perterpon<perterpon@gmail.com>
 * Create: Sat Oct 26 2019 22:04:47 GMT+0800 (China Standard Time)
 */

import { ETemplate } from 'src/constants/enums';

import { executeAction } from 'src/action';

import { TAction, TPoint } from 'fishman';

export async function doAction(action: TAction, templateData: Map<ETemplate, TPoint>): Promise<void> {

  executeAction(action.name, templateData);

}