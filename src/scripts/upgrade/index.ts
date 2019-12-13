
/*
 * index.ts
 * Author: perterpon<perterpon@gmail.com>
 * Create: Fri Dec 13 2019 15:48:05 GMT+0800 (中国标准时间)
 */

import { fork, ChildProcess } from 'child_process';
import * as path from 'path';
import './main';

let mainProcess: ChildProcess;

function start() {
  const main: string = path.join(__dirname, 'main.js');
  mainProcess = fork(main);
  mainProcess.stderr.pipe(process.stderr);
  mainProcess.stdout.pipe(process.stdout);
}

function stop() {
  mainProcess.kill();
  mainProcess = null;
}

let recordProcess: ChildProcess;
function startRecord() {
  const record: string = path.join(__dirname, 'record.js');
  recordProcess = fork(record);
  recordProcess.stderr.pipe(process.stderr);
  recordProcess.stdout.pipe(process.stdout);
}

function stopRecord() {
  recordProcess.kill();
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
    stop();
  }
});

// Register and start hook
ioHook.start();
