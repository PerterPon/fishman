
/*
* index.ts
* Author: perterpon<perterpon@gmail.com>
* Create: Fri Oct 25 2019 18:57:06 GMT+0800 (China Standard Time)
*/

import { TRect } from "fishman";

export const LOOK_DELAY: number = 500;

export const MEMORY_VOLUME: number = 100;

export const WIN_TITLE_HEIGHT: number = 30;

export const WIN_WIDTH: number = 1280;
export const WIN_HEIGHT: number = 960;

export const TOTAL_VISION: TRect = {
  x: 0,
  y: 0,
  w: WIN_WIDTH,
  h: WIN_HEIGHT,
};

export const FULL_FACING: number = 6282;

export const FACING_PER_MS: number = 3.4;

export const MONITOR_POINT: number = 14;

export const MSDK_DLL: string = 'D:\\wow\\fishman\\src\\core\\msdk.dll';

export const MONITOR_STATUS_LENGTH: {[name: string]: number} = {
  moving : 1,
  combat : 1,
  attack : 1,
  player_health : 7,
  player_energy : 7,
  player_level : 7,
  player_dead : 1,
  player_ghost : 1,
  player_swimming : 1,
  player_can_resurrection : 1,
  player_x : 14,
  player_y : 14,
  player_facing : 14,
  player_corpse_x : 14,
  player_corpse_y : 14,
  player_casting : 1,
  target_dead : 1,
  target_exists : 1,
  target_health : 7,
  target_level : 7,
  target_minDistance : 7,
  target_maxDistance : 7,
  float_xp : 12,
  float_gold : 20
};

export const MONITOR_STATUS_INDEX: string[] = Object.keys(MONITOR_STATUS_LENGTH);
