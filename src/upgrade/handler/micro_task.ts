
/*
 * base-handler.ts
 * Author: perterpon<perterpon@gmail.com>
 * Create: Fri Dec 13 2019 14:28:18 GMT+0800 (中国标准时间)
 */

import { MessageChannel, Worker } from 'worker_threads';
import * as path from 'path';
import * as monitor from 'src/monitor';
import { EChannelEvent } from 'src/constants/enums';

const taskStatus: Map<string, boolean> = new Map();
const taskWorker: Map<string, Worker> = new Map();
// const workerChannel: Map<string, MessageChannel> = new Map();

export async function init(): Promise<void> {
  monitor.eventBus.on('all', (statusName: string, key: string, value: string) => {
    const allStatus = monitor.allStatus;

  });
}

export async function startMicroTask(taskName: string): Promise<void> {
  const task: string = path.join(__dirname, taskName);
  const worker: Worker = new Worker(task);

  taskStatus.set(taskName, true);
  taskWorker.set(taskName, worker);
}

export async function stopMicroTask(taskName: string): Promise<void> {
  const task: string = path.join(__dirname, taskName);
  const worker: Worker = taskWorker.get(task);

  await new Promise((resolve) => {
    worker.terminate(resolve);
  });

  taskWorker.delete(taskName);
  taskStatus.delete(taskName);
}

export async function stopAllTask(): Promise<void> {
  const allTasks: [string, Worker][] = Array.from(taskWorker);
  for (let i = 0; i < allTasks.length; i++) {
    const taskName: string = allTasks[i][0];
    await stopMicroTask(taskName);
  }
}

export function syncStatus(key: string, newValue: string, oldValue: string): void {
  const allTasks: [string, Worker][] = Array.from(taskWorker);
  for (let i = 0; i < allTasks.length; i++) {
    const task: Worker = allTasks[i][1];
    task.postMessage(JSON.stringify({
      event: EChannelEvent.Status,
      data: {
        allStatus: monitor.allStatus,
        key, newValue, oldValue
      }
    }));
  }
}
