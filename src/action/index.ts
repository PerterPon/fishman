
/*
* index.ts
* Author: perterpon<perterpon@gmail.com>
* Create: Fri Oct 25 2019 20:06:57 GMT+0800 (China Standard Time)
*/

import { EAction, ETemplate } from "src/constants/enums";
import { TAction, TPoint } from "fishman";

export async function executeAction(name: string, templateData: Map<ETemplate, TPoint>): Promise<void> {
  const actionData = require(`./${name}`);
  if (undefined === actionData) {
    console.log(`no action found by name: [${name}]`);
    return null;
  }

  await actionData.doAction(templateData);
}

export function getAction(name: string): TAction {
  const actionData = require(`./${name}`);
  if (undefined === actionData) {
    console.log(`no action found by name: [${name}]`);
    return null;
  }

  const situation: TAction = actionData.getAction();
  return situation;
}
