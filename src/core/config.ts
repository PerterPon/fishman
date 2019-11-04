
/*
 * config.ts
 * Author: perterpon<perterpon@gmail.com>
 * Create: Sun Nov 03 2019 16:01:18 GMT+0800 (China Standard Time)
 */

import * as yaml from 'yaml';
import * as path from 'path';
import * as fs from 'fs';

const configPath: string = path.join(__dirname, '../../etc/default.yaml');
const configString: string = fs.readFileSync(configPath, 'utf-8');

const config = yaml.parse(configString);
export function getConfig() {
  return config;
}
