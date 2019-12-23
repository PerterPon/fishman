
/*
 * thread.ts
 * Author: perterpon<perterpon@gmail.com>
 * Create: Mon Dec 23 2019 17:38:47 GMT+0800 (中国标准时间)
 */

import { Worker } from 'worker_threads';
import * as util from 'util';
import * as path from 'path';
import vision from 'src/vision';

export function startThread(file: string, workerData: {[name: string]: any} = {}): Worker {
    const workerFile: string = path.join(__dirname, 'worker.js');
    const worker: Worker = new Worker(workerFile, {
        workerData: {
            file,
            deviceHandler: vision.deviceHandler,
            occupation: vision.occupation,
            sharedValue: vision.sharedValue,
            ...workerData
        }
    });
    worker.postMessage({event: 'start'});
    return worker;
}

export async function stopThread(worker: Worker): Promise<void> {
    if (worker) {
        worker.terminate = util.promisify(worker.terminate);
        await worker.terminate();
    }
}
