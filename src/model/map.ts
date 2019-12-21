
/*
 * map.ts
 * Author: perterpon<perterpon@gmail.com>
 * Create: Fri Nov 22 2019 17:12:49 GMT+0800 (中国标准时间)
 */


import { ETemplate } from 'src/constants/enums';
import * as _ from 'lodash';
import * as fs from 'fs';
import * as path from 'path';

import { TPointTemplate, TPoint } from 'fishman';
import { TMap } from 'fishman/map';

let mapData: {[name: string]: TMap} = require('./map.json');

export async function init(): Promise<void> {
  const mapDataString: string = fs.readFileSync(path.join('D:\\wow\\fishman\\model', 'map.json'), 'utf-8');
  mapData = JSON.parse(mapDataString);
}

export function getMap(mapName: string): TMap {
  return mapData[mapName];
}

export async function updateMap(name: string, point: TPoint): Promise<void> {
  const map: TMap = mapData[name];
  if (undefined === map) {
    throw new Error(`map: [${name}] did not exists!`);
  }

  const exists: TPoint = _.find(map.area.obstacle, point);
  if (undefined === exists) {
    map.area.obstacle.push(point);
  }

  fs.writeFileSync(path.join(__dirname, 'map.json'), JSON.stringify(mapData, '' as any, 4));
}
