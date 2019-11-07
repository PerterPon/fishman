
/*
* bn_offline.ts
* Author: perterpon<perterpon@gmail.com>
* Create: Mon Oct 28 2019 21:30:08 GMT+0800 (China Standard Time)
*/

import { getAction } from 'src/action';

import { matchFeature } from 'src/feature';

import { TSituation, TMemory } from "fishman";
import { EFeature } from 'src/constants/enums';

export async function judge(memory: TMemory[]): Promise<boolean> {
  const hasBnLoginBtn: boolean = matchFeature(EFeature.BN_LOGIN_BTN, memory);
  return hasBnLoginBtn;
}

export function getSituation(): TSituation {
  return {
    name: 'login/bn_offline',
    required: [],
    optional: [],
    action: getAction('login/bn_login'),
  }
}
