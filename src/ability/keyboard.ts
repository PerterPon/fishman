
/*
 * keyboard.ts
 * Author: perterpon<perterpon@gmail.com>
 * Create: Fri Oct 25 2019 17:56:42 GMT+0800 (China Standard Time)
 */

import { keyPress as mKeyPress, keyDown as mKeyDown, keyUp as mKeyUp } from 'src/core/msdk';

export function keyPress(code: number): void {
    mKeyPress(code);
}

export function keyDown(code: number): void {
    mKeyDown(code);
}

export function keyUp(code: number): void {
    mKeyUp(code);
}
