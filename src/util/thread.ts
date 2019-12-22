
import { Worker } from 'worker_threads';
import { capture } from 'src/ability/capture';
import * as util from 'util';
import { TBitmap } from 'fishman';

export async function startThread(file: string, workerData: {[name: string]: any}): Promise<Worker> {
    const worker: Worker = new Worker(file, {
        workerData
    });
    worker.on('message', onMessage);
    return worker;
}

export async function stopThread(worker: Worker): Promise<void> {
    if (worker) {
        worker.terminate = util.promisify(worker.terminate);
        await worker.terminate();
    }
}

async function onMessage(this: Worker, message: any): Promise<void> {
    if ('capture' === message.event) {
        const rect = message.data;
        const img: TBitmap = await capture(rect);
        this.postMessage({
            event: 'capture',
            data: img
        });
    }
}
