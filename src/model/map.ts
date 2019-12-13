
/*
 * map.ts
 * Author: perterpon<perterpon@gmail.com>
 * Create: Fri Nov 22 2019 17:12:49 GMT+0800 (中国标准时间)
 */


import { ETemplate } from 'src/constants/enums';

import { TPointTemplate } from 'fishman';
import { TMap } from 'fishman/map';

let mapData: {[name: string]: TMap} = require('./map.json');

export async function init(): Promise<void> {
  mapData = require('./map.json');
}

export function getMap(mapName: string): TMap {
  return mapData[mapName];
}

export async function updateMap(): Promise<void> {
  
}
