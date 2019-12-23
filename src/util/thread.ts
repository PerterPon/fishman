
import { Worker } from 'worker_threads';
import * as util from 'util';
import * as path from 'path';
import vision from 'src/vision';

export async function startThread(file: string, workerData: {[name: string]: any} = {}): Promise<Worker> {
    const workerFile: string = path.join(__dirname, 'worker.js');
    const worker: Worker = new Worker(workerFile, {
        workerData: {
            file,
            deviceHandler: vision.deviceHandler,
            occupation: vision.occupation,
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
