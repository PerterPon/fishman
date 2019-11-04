
/*
* bn_offline.ts
* Author: perterpon<perterpon@gmail.com>
* Create: Mon Oct 28 2019 21:30:08 GMT+0800 (China Standard Time)
*/

import { TSituation } from "fishman";
import { getAction } from 'src/action';

export async function judge(): Promise<boolean> {
  return false;
}

export const situation: TSituation = {
  name: 'login/bn_offline',
  required: [],
  optional: [],
  action: getAction('login/bn_login'),
};
