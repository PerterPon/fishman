
/*
 * vision.ts
 * Author: perterpon<perterpon@gmail.com>
 * Create: Sun Oct 27 2019 18:53:50 GMT+0800 (China Standard Time)
 */

import { TAction, TMemory, TSituation, TRect, TContext } from 'fishman';
import { EGoal } from 'src/constants/enums';
import { TOTAL_VISION, LOOK_DELAY } from './constants';

let currentGoal: EGoal = EGoal.FISH;
let currentLookDelay: number = 0;
let currentAction: TAction = null;
let currentSituation: TSituation = null;
let currentView: TRect = TOTAL_VISION;
let currentLookTime: number = LOOK_DELAY;

let currentMemory: TMemory[] = [];
let currentContext: TContext[] = [];

export default {
  get action(): TAction {
    return currentAction;
  },
  set action(val: TAction) {
    currentAction = val;
  },

  get lookDelay(): number {
    return currentLookDelay;
  },
  set lookDelay(val: number) {
    currentLookDelay = val;
  },

  get situation(): TSituation {
    return currentSituation;
  },
  set situation(val: TSituation) {
    currentSituation = val;
  },

  get view(): TRect {
    return currentView;
  },
  set view(val: TRect) {
    currentView = val;
  },

  get memory(): TMemory[] {
    return currentMemory;
  },
  set memory(val: TMemory[]) {
    currentMemory = val;
  },

  get lookTime(): number {
    return currentLookTime;
  },
  set lookTime(val: number) {
    currentLookTime = val;
  },

  get context(): TContext[] {
    return currentContext;
  },
  set context(val: TContext[]) {
    currentContext = val;
  }

}
