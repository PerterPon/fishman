
/*
 * bn_online.ts
 * Author: perterpon<perterpon@gmail.com>
 * Create: Tue Oct 29 2019 20:58:37 GMT+0800 (中国标准时间)
 */

import { TSituation } from "fishman";

import { getAction } from 'src/action';

export async function judge(): Promise<boolean> {
  return false;
}

export function getSituation(): TSituation {
  return {
    name: 'login/bn_online',
    required: [],
    optional: [],
    action: getAction('login/open_game')
  };
}
