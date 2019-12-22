
/*
 * vision.ts
 * Author: perterpon<perterpon@gmail.com>
 * Create: Sun Oct 27 2019 18:53:50 GMT+0800 (China Standard Time)
 */

import { TAction, TMemory, TSituation, TRect, TContext } from 'fishman';
import { EGoal, EBiz } from 'src/constants/enums';
import { TOTAL_VISION, LOOK_DELAY } from 'src/constants';
import { EventEmitter } from 'events';

let currentGoal: EGoal = EGoal.FISH;
let currentAction: TAction = null;
let currentSituation: TSituation = null;
let currentView: TRect = null;
let currentLookTime: number = 0;

let currentMemory: TMemory[] = [];
let currentContext: TContext[] = [];
let currentBiz: EBiz = null;
let currentOccupation: string = null;

let monitorValue: {[name: string]: any} = null;
let monitor: EventEmitter;

export default {
  get action(): TAction {
    return currentAction;
  },
  set action(val: TAction) {
    currentAction = val;
  },

  get situation(): TSituation {
    return currentSituation;
  },
  set situation(val: TSituation) {
    currentSituation = val;
  },

  get nextView(): TRect {
    const value: TRect = currentView;
    currentView = null;
    return value;
  },
  set nextView(val: TRect) {
    currentView = val;
  },

  get memory(): TMemory[] {
    return currentMemory;
  },
  set memory(val: TMemory[]) {
    currentMemory = val;
  },

  get nextLookTime(): number {
    const value: number = currentLookTime;
    currentLookTime = 0;
    return value;
  },
  set nextLookTime(val: number) {
    currentLookTime = val;
  },

  get context(): TContext[] {
    return currentContext;
  },
  set context(val: TContext[]) {
    currentContext = val;
  },

  get biz(): EBiz {
    return currentBiz;
  },
  set biz(val: EBiz) {
    currentBiz = val;
  },

  get monitorValue(): any {
    return monitorValue;
  },
  set monitorValue(val) {
    monitorValue = val;
  },

  get monitor(): EventEmitter {
    return monitor;
  },
  set monitor(val) {
    monitor = val;
  },

  get occupation(): string {
    return currentOccupation;
  },
  set occupation(val: string) {
    currentOccupation = val;
  }


}
