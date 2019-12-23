
/*
 * micro_task.ts
 * Author: perterpon<perterpon@gmail.com>
 * Create: Sun Dec 22 2019 17:49:33 GMT+0800 (中国标准时间)
 */

const taskMap: Map<Promise<unknown>, Function> = new Map();

export function startMicroTask(task: Promise<unknown>): Promise<void> {
  let stop: Function = null;
  const microTask: Promise<void> = new Promise(async (resolve, reject) => {
    stop = reject;
    await task;
    resolve();
  });
  microTask.catch(() => {});

  // open new promise to store the handler.
  new Promise((resolve) => {
    taskMap.set(microTask, stop);
    resolve();
  });

  return microTask;
}

export function stopMicroTask(task: Promise<unknown>): void {
  const stopHandler: Function = taskMap.get(task);
  if (stopHandler) {
    stopHandler();
    taskMap.delete(task);
  }
  
}

