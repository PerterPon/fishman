
/*
 * index.ts
 * Author: perterpon<perterpon@gmail.com>
 * Create: Fri Dec 13 2019 15:48:05 GMT+0800 (中国标准时间)
 */

import { fork, exec, ChildProcess } from 'child_process';
import * as path from 'path';

let mainProcess: ChildProcess;

function start() {
  const main: string = path.join(__dirname, 'multi-thread', 'index.js');
  mainProcess = exec(`node --experimental-worker ${main}`);
  mainProcess.stderr.pipe(process.stderr);
  mainProcess.stdout.pipe(process.stdout);
}

function stop() {
  if (null === mainProcess) {
    return;
  }
  console.log('main process stopped');
  exec('taskkill /pid ' + mainProcess.pid + ' /T /F')
  mainProcess = null;
}

let recordProcess: ChildProcess;
function startRecord() {
  const record: string = path.join(__dirname, 'record.js');
  recordProcess = exec(`node ${record}`);
  recordProcess.stderr.pipe(process.stderr);
  recordProcess.stdout.pipe(process.stdout);
}

function stopRecord() {
  if (null === recordProcess) {
    return;
  }
  const pid = recordProcess.pid;
  setTimeout(() => {
    exec('taskkill /pid ' + pid + ' /T /F')  
  }, 1000);

  recordProcess = null;
}

process.on('uncaughtException', (e) => {
  console.log(e);
});

process.on('unhandledRejection', (e) => {
  console.log(e);
});

const ioHook = require('iohook');
ioHook.on('keydown', (event:any) => {
  if (64 === event.keycode) {
      console.log('start');
      start();
  } else if (65 === event.keycode) {
      console.log('stop');
      stop();
  } else if (66 === event.keycode) {
    console.log('start record');
    startRecord();
  } else if (67 === event.keycode) {
    console.log('stop record');
    stopRecord();
  }
});

// Register and start hook
ioHook.start();
