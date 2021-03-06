
import { capture } from 'src/ability/capture';
import { keyPress, keyDown, keyUp } from 'src/ability/keyboard';
import { keyMap } from 'src/constants/keymap';

import { sleep, colorAt } from 'src/util';

import { TRect, TBitmap, TPointTemplate, TPoint, TPixel } from 'fishman';

import { init, startMonitor, eventBus, statusValue, stopMonitor } from 'src/monitor';

import { runTo } from 'src/ability/walk';

let run = false;
let targetLocked = false;
let totalExp = 0;
const fence: [TPoint, TPoint] = [{x: 0, y: 0}, {x: 0, y: 0}];

init();
startMonitor();

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
    eventBus.on('player_dead', () => {
        console.log(new Date);
        process.exit();
    });
    // eventBus.on('target_health', targetHealthChange);
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
        if (latestTime !== undefined && now - latestTime < time || 0 === statusValue.target_exists) {
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
        keyPress(keyMap.esc);
        keyPress(keyMap['3']);
        await sleep(1700);
        console.log('jesus');
        jesus();
    }
    if (15 > value) {
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
    const latestCastTime: number = bufferMap.get(keyMap['5']) || 0;
    if (100 > statusValue.target_health && statusValue.target_health > 20 && Date.now() - latestCastTime >= 60 * 1000) {
        console.log(statusValue.target_health);
        keyPress(keyMap['5']);
        bufferMap.set(keyMap['5'], Date.now());
        await sleep(1600);
        keyPress(keyMap['6']);
        await sleep(1600);
        keyPress(keyMap.f1);
        await sleep(1600);
    }
}

let selfSavedTime: number = 0;
async function selfSave() {
    selfSavedTime = Date.now();
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
    // keyPress(keyMap.f1);
    // await sleep(2000);
    // keyPress(keyMap['5']);
    // await sleep(100);
    // keyPress(keyMap['6']);
    // await sleep(2000);
    // keyPress(keyMap.f1);

    keyPress(keyMap.f1);
    await sleep(1600);
    while(run && 1 === statusValue.combat) {
        if (Date.now() - (bufferMap.get(keyMap.f1) || 0) > 60 * 1000) {
            keyPress(keyMap['5']);
            bufferMap.set(keyMap.f1, Date.now());
            await sleep(100);
        }

        keyPress(keyMap['6']);
        await sleep(2000);
        keyPress(keyMap.f1);
        await sleep(10 * 1000 + 200);
    }
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

    // if (cureTimes >= 2) {
        // cast too much magic, take a rest
        notCombatPress(keyMap.x);
        await sleep(10 * 1000);
        await sleep(cureTimes * 15 * 1000);
        notCombatPress(keyMap.x);
    // }

    if (selfSavedTime > 0) {
        notCombatPress(keyMap.x);
        await sleep(5 * 60 * 1000 - Date.now() - selfSavedTime);
        notCombatPress(keyMap.x);
        selfSavedTime = 0;
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
    const randomVal = Math.random();
    if (randomVal > 0.7) {
        console.log('run to 1');
        await runTo({
            x: 3540,
            y: 6340
        });
    } else if (randomVal > 0.4) {
        console.log('run to 2');
        await runTo({
            x: 3980,
            y: 6690
        });
    } else {
        console.log('run to 3');
        await runTo({
            x: 3210,
            y: 5850
        });
    }
    
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
    // monitorBuffer(keyMap.f1, 30 * 1000);
    // await sleep(1600);

    monitorBuffer(keyMap.f2, 4 * 60 * 1000);
    startMonitor();

    // turnAround();
    combatChange();
    
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


