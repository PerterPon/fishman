
/*
 * template.ts
 * Author: PerterPon<perterpon@gmail.com>
 * Create: Fri Nov 01 2019 20:30:12 GMT+0800 (China Standard Time)
 */

import { ETemplate } from 'src/constants/enums';

import { TPointTemplate } from 'fishman';

let templateData: {[name: string]: TPointTemplate} = require('./template.json');

export async function init(): Promise<void> {
  templateData = require('./template.json');
}

export function getTemplate(templateName: ETemplate): TPointTemplate {
  return templateData[templateName];
}
