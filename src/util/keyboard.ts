
/*
 * keyboard.ts
 * Author: 王 羽涵<perterpon.wang@bytedance.com>
 * Create: Mon Dec 23 2019 14:45:24 GMT+0800 (中国标准时间)
 */

import { keyMap } from 'src/constants/keymap';
import { keyPress } from 'src/ability/keyboard';
import { sleep } from '.';

export async function keepDo(code: number, target: {[name: string]: any}, key: string, value: any): Promise<void> {
  while (true) {
    keyPress(code);
    await sleep(50);
    if (value === target[key]) {
      break;
    }
  }
}
