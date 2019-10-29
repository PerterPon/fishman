
/*
* index.ts
* Author: perterpon<perterpon@gmail.com>
* Create: Fri Oct 25 2019 20:06:57 GMT+0800 (China Standard Time)
*/

import { EAction } from "src/constants/enums";

type Action = Function;

export const actionMap: Map<EAction, Action> = new Map([
  
]);

export async function executeAction(): Promise<void> {
  
}
