
/*
 * config.ts
 * Author: perterpon<perterpon@gmail.com>
 * Create: Sun Dec 22 2019 17:20:53 GMT+0800 (中国标准时间)
 */

import * as fs from 'fs';
import * as path from 'path';

export function initConfig(filePath: string): void {
  const configFile: string = path.join(__dirname, 'paladin.json');
  if (false === fs.existsSync(configFile)) {
    fs.writeFileSync(configFile, '{}');
  }
}

export function readConfig(filePath: string): {[name: string]: any} {
  const content: string = fs.readFileSync(filePath, 'utf-8');
  let config = {};
  try {
    config = JSON.parse(content);
  } catch (e) {}
  return config;
}

export function writeConfig(filePath: string, config: any): void {
  fs.writeFileSync(filePath, JSON.stringify(config));
}
