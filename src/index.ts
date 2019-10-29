
/*
 * index.ts
 * Author: perterpon<perterpon@gmail.com>
 * Create: Mon Oct 21 2019 12:06:27 GMT+0800 (中国标准时间)
 */

import { init as msdkInit } from 'src/core/msdk';

import { initBrain, startWork } from 'src/body/brain';

async function init(): Promise<void> {
  await msdkInit();
  await initBrain();
}

async function start(): Promise<void> {
  await init();
  await startWork();
}

start();


process.on('uncaughtException', (error) => {
  console.log('-------------------------------------');
  console.log(`uncaughtException: [${error.message}]`);
  console.log(error.stack);
  console.log('-------------------------------------');
});

process.on('unhandledRejection', (error: any) => {
  console.log('=====================================');
  console.log(`unhandledRejection: [${error.message }]`);
  console.log(error.stack);
  console.log('=====================================');
});
