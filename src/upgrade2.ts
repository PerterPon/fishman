
import { capture } from 'src/ability/capture';
import { keyPress, keyDown, keyUp } from 'src/ability/keyboard';

import { sleep, colorAt } from 'src/util';

import { TRect, TBitmap, TPointTemplate, TPoint, TPixel } from 'fishman';

import { init, startMonitor, eventBus, statusValue, stopMonitor } from './monitor';

let run = false;
let targetLocked = false;
let totalExp = 0;
const fence: [TPoint, TPoint] = [{x: 0, y: 0}, {x: 0, y: 0}];

init();
startMonitor();

const keyMap = {
    'f1': 58,
    'f2': 59,
    'f3': 60,
    'f4': 61,
    'f8': 65,
    'f9': 66,
    'f10': 67,
    'f5': 62,
    '2': 31,
    '3': 32,
    '4': 33,
    'a': 4,
    'd': 7,
    'q': 20,
    'e': 8,
    's': 22,
    'w': 26,
    'x': 27,
    'tab': 43,
    'space': 44,
    'esc': 41
};

const cycleDoMap: {[name: string]: boolean} = {

};

function registerEvents(): void {
    eventBus.on('combat', combatChange);
    eventBus.on('player_health', playerHealthChange);
    eventBus.on('attack', attackChange);
    eventBus.on('moving', moveChange);
    eventBus.on('float_xp', xpChange);
    eventBus.on('player_x', positionChange);
    eventBus.on('player_y', positionChange);
}

async function positionChange(): Promise<void> {
    // console.log(statusValue.player_x, statusValue.player_y);
}

const bufferMap: Map<number, number> = new Map();
async function monitorBuffer(code: number, time: number): Promise<void> {
    keyPress(code);
    bufferMap.set(code, Date.now());
    while(run) {
        await sleep(1000);
        const latestTime: number = bufferMap.get(code);
        const now: number = Date.now();
        if (latestTime !== undefined && now - latestTime < time) {
            continue;
        }

        if (0 === statusValue.combat) {
            continue;
        }

        keyPress(code);
        bufferMap.set(code, Date.now());
    }
}
async function attackChange(): Promise<void> {
    
}

async function xpChange(): Promise<void> {
    if (0 === statusValue.float_xp) {
        return;
    }
    totalExp += statusValue.float_xp;
    console.log('get xp: ', totalExp);
}

async function moveChange(): Promise<void> {
    if (1 === statusValue.moving) {
        moved = true;
    }
}

async function combatChange(): Promise<void> {
    if (1 === statusValue.combat) {
        enterCombat();
    } else {
        leaveCombat();
    }
}

async function playerHealthChange(): Promise<void> {
    const value: number = statusValue.player_health;
    if (0 === value) {
        return;
    }
    if (5 > value) {
        console.log('jesus');
        jesus();
    }
    if (10 > value) {
        console.log(`self save because health down to: [${value}]`);
        await selfSave();
    } else if (30 > value) {
        keyPress(keyMap.f8);
        await sleep(200);
        keyPress(keyMap['2']);
        await sleep(2 * 1000);
    }
}

async function targetHealthChange(): Promise<void> {
}

async function selfSave() {
    keyPress(keyMap.esc);
    keyPress(keyMap['4']);
    await sleep(1700);
    keyPress(keyMap.f5);
    await sleep(2.6 * 1000);
    keyPress(keyMap.f5);
    await sleep(2.6 * 1000);
}

async function jesus() {
    keyPress(keyMap['3']);
}

async function enterCombat(): Promise<void> {
    console.log('enter into combat');
    keyPress(keyMap.s);

    keyPress(keyMap.f9);
    await sleep(1000);
    keyPress(keyMap.f4);
    await sleep(300);
    keyPress(keyMap.s);
    await sleep(300);
    keyPress(keyMap.f4);
    await sleep(300);
    keyPress(keyMap.s);

    cycleDoUntilLeaveCombat([keyMap.f4], 500);
}

let looking4Target = false;
let moved = false;
let fighted = false;
async function leaveCombat(): Promise<void> {
    console.log('leave combat');
    // choose latest target
    notCombatPress(keyMap.f10);
    await sleep(1000);
    // search body
    notCombatPress(keyMap.f4);
    await sleep(1000);
    // clear target
    notCombatPress(keyMap.f9);
    let cureTimes: number = 0;
    while(run) {
        if (statusValue.player_health > 85) {
            break;
        }
        notCombatPress(keyMap.f5);
        cureTimes++;
        await sleep(4000);
    }

    if (cureTimes >= 2) {
        // cast too much magic, take a rest
        notCombatPress(keyMap.x);
        await sleep(cureTimes * 5 * 1000);
        notCombatPress(keyMap.x);
    }

    // find new target
    cycleDoUntilEnterCombat([keyMap.f4], 1000);
    while(run && 0 === statusValue.combat) {
        await lockTargetV2();
    }
    console.log('target locked');
    cycleDoUntilLeaveCombat([keyMap.f4], 1000);
}

async function lockTargetV2(): Promise<void> {
    console.log('start lock target');
    moved = false;
    notCombatPress(keyMap.f3);
    await sleep(300);
    // can not found a target
    if (0 === statusValue.target_exists && 0 === statusValue.combat) {
        console.log('can not found a target');
        // turn around and walk away
        await turnAround();
        return;
    }

    // success find a target, try 2 run 2 it
    await waitCombat(3000);
    // too far away, give up
    if (false === moved && 0 === statusValue.combat) {
        console.log('success find a target, but too far away, give up');
        await turnAround();
        return;
    }

    let moveBodyTimes: number = 0;
    while(3 > moveBodyTimes) {
        if (1 === statusValue.combat) {
            return;
        }

        await waitCombat(15 * 1000);
        if (0 === statusValue.combat) {
            // find a target, and distance is ok, but trapped
            console.log('find a target, and distance is ok, but trapped');
            await moveBody();
        }
        moveBodyTimes++;
    }

    if (0 === statusValue.combat) {
        console.log("lock target failed, restart again");
    }
}

async function waitCombat(time: number): Promise<boolean> {
    while(time > 0) {
        await sleep(1000);
        if (1 === statusValue.combat) {
            return true;
        }
        time -= 1000;
    }
}

async function moveBody(): Promise<void> {
    const random: number = Math.random();
    let code: number = 0;

    if (random > 0.5) {
        code = keyMap.q;
    } else {
        code = keyMap.e;
    }
    notCombatKeyDown(keyMap.s);
    await sleep(3000);
    keyUp(keyMap.s);
    notCombatKeyDown(code);
    await sleep(1000);
    keyUp(code);
    await sleep(500);
    notCombatKeyDown(keyMap.w);
    notCombatPress(keyMap.space);
    await sleep(200);
    keyUp(keyMap.w);
    await sleep(1500);
    notCombatKeyDown(keyMap.w);
    notCombatPress(keyMap.space);
    await sleep(200);
    keyUp(keyMap.w);
    await sleep(500);
}

async function turnAround(): Promise<void> {
    // notCombatPress(keyMap.f9);
    // notCombatKeyDown(keyMap.s);
    // await sleep(2000);
    // keyUp(keyMap.s);
    // // turn around and try walk away
    // notCombatKeyDown(keyMap.d);
    // await sleep(150);
    // keyUp(keyMap.d);
    // await sleep(500);
    // notCombatKeyDown(keyMap.w);
    // await sleep(4000);
    // keyUp(keyMap.w);
    await sleep(5000);
}

function notCombatKeyDown(code: number): void {
    if (0 === statusValue.combat) {
        keyDown(code);
    }
}

function notCombatPress(code: number): void {
    if (0 === statusValue.combat) {
        keyPress(code);
    }
}

function combatPress(code: number): void {
    if (1 === statusValue.combat) {
        keyPress(code);
    }
}

async function cycleDoUntilEnterCombat(code: number[], time: number): Promise<void> {
    while (run && 0 === statusValue.combat) {
        await sleep(time);
        if (1 === (statusValue.combat) as any) {
            break;
        }
        for (let i = 0; i < code.length; i++) {
            keyPress(code[i]);
        }
        
    }
}

async function cycleDoUntilLeaveCombat(code: number[], time: number): Promise<void> {
    while (run && 1 === statusValue.combat) {
        await sleep(time);
        if (0 === (statusValue.combat) as any) {
            break;
        }
        for (let i = 0; i < code.length; i++) {
            keyPress(code[i]);
        }
    }
}

async function start() {
    run = true;
    monitorBuffer(keyMap.f1, 30 * 1000);
    await sleep(1600);

    monitorBuffer(keyMap.f2, 4 * 60 * 1000);

    combatChange();
    startMonitor();
}

function stop() {
    run = false;
    looking4Target = false;
    moved = false;
    stopMonitor();
}

registerEvents();

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


