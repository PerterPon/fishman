import { runTo } from 'src/ability/walk';
import { sleep } from './util';

import { startMonitor } from './monitor';

async function start() {
    startMonitor();
    await sleep(3000);
    console.log('start');
    await runTo({
        x: 37.9,
        y: 64.7
    });
}

start();
