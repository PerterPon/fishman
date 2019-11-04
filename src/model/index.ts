
/*
 * index.ts
 * Author: PerterPon<perterpon@gmail.com>
 * Create: Fri Nov 01 2019 20:27:25 GMT+0800 (China Standard Time)
 */

import { init as initSituation } from 'src/model/situation';
import { init as initTemplate } from 'src/model/template';

export async function init(): Promise<void> {
  console.time('load models');
  await initSituation();
  await initTemplate();
  console.timeEnd('load models');
}
