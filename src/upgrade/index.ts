
/*
 * index.ts
 * Author: perterpon<perterpon@gmail.com>
 * Create: Fri Dec 13 2019 11:28:41 GMT+0800 (中国标准时间)
 */

import { Worker, MessageChannel } from 'worker_threads';
import * as util from 'util';
import { startMonitor, statusValue, stopMonitor, eventBus } from 'src/monitor';
Worker.prototype.terminate = util.promisify(Worker.prototype.terminate);

const config = {
  working: false
};

// const 

const mainChannel: MessageChannel = new MessageChannel();

const workers: Worker[] = [];



mainChannel.port2.on('message', () => {
  
});


async function onNewEvent(): Promise<void> {

}

async function start(): Promise<void> {
  config.working = true;
  startMonitor();
}

async function stop(): Promise<void> {
  config.working = false;
  stopMonitor();
  while (0 < workers.length) {
    await workers.pop().terminate();
  }
}

async function init(): Promise<void> {
  registerEvents();
}

function registerEvents(): void {
  eventBus.on('combat', combatChange);
  eventBus.on('player_health', playerHealthChange);
  eventBus.on('attack', attackChange);
  eventBus.on('moving', moveChange);
  eventBus.on('float_xp', xpChange);
  eventBus.on('player_x', positionChange);
  eventBus.on('player_y', positionChange);
}

process.on('uncaughtException', (e) => {
  console.log(e);
});

process.on('unhandledRejection', (e) => {
  console.log(e);
});

const ioHook = require('iohook');
ioHook.on('keydown', (event:any) => {
//console.log(event); // { type: 'mousemove', x: 700, y: 400 }
if (64 === event.keycode) {
    console.log('start');
    start();
} else if (65 === event.keycode) {
    console.log('stop');
    stop();
}
});

// Register and start hook
ioHook.start();
