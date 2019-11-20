
import { capture } from 'src/ability/capture';
import { keyPress, keyDown, keyUp } from 'src/ability/keyboard';

import * as util from 'src/util';

import { TRect, TBitmap } from 'fishman';

let run = false;
let targetLocked = false;

async function sleep(time: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    });
}

const keyMap = {
    'f1': 58,
    'f2': 59,
    'f3': 60,
    'f4': 61,
    'f9': 66,
    'f10': 67,
    'f5': 62,
    'q': 20,
    'e': 8,
    's': 22,
    'w': 26,
    'tab': 43,
    'space': 44,
    'esc': 41
};

const statusMap = {
    dead: false,
    combat: false,
    attack: false,
    move: false
};

async function monitorStatus(): Promise<void> {
    const monitorArea: TRect = {
        x: 0,
        y: 130,
        w: 40,
        h: 10
    };

    while(run) {
        const img: TBitmap = capture(monitorArea);
        const combat: boolean = '00ff00' === util.colorAt(img, {x: 5, y: 5});
        const attack: boolean = '00ff00' === util.colorAt(img, {x: 15, y: 5});
        const dead: boolean = '00ff00' === util.colorAt(img, {x: 25, y: 5});
        const move: boolean = '00ff00' === util.colorAt(img, {x: 35, y: 5});
        if (statusMap.attack !== attack) {
            statusMap.attack = attack;
            attackChange();
        }

        if (statusMap.combat !== combat) {
            statusMap.combat = combat;
            combatChange();
        }

        statusMap.dead = dead;
        statusMap.move = move;
        await sleep(100);
    }
}

const bufferMap: Map<number, number> = new Map();

async function monitorBuffer(code: number, time: number): Promise<void> {
    while(run) {
        await sleep(1000);
        const latestTime: number = bufferMap.get(code);
        const now: number = Date.now();
        if (latestTime !== undefined && now - latestTime < time) {
            continue;
        }

        if (false === statusMap.combat) {
            continue;
        }

        keyPress(code);
        bufferMap.set(code, Date.now());
    }
}

async function attackChange(): Promise<void> {
    if (true === statusMap.attack) {
        await sleep(100);
        if (false === statusMap.combat && false === statusMap.move) {
            console.log('clear target becaure too far away');
            cycleDoUntilLeaveCombat([keyMap.f9], 500);
        }
    } else if (false === statusMap.attack) {
        if (true === statusMap.combat) {
            keyPress(keyMap.f4);
        }
    }
}

async function combatChange(): Promise<void> {
    if (true === statusMap.combat) {
        console.log('enter into combat');
        keyPress(keyMap.s);

        keyPress(keyMap.esc);
        await sleep(1000);
        keyPress(keyMap.f4);
        await sleep(300);
        keyPress(keyMap.s);
        await sleep(300);
        keyPress(keyMap.f4);
        await sleep(300);
        keyPress(keyMap.s);

        cycleDoUntilLeaveCombat([keyMap.f4], 500);
    } else if (false === statusMap.combat) {
        console.log('leave combat');
        // choose latest target
        keyPress(keyMap.f10);
        await sleep(200);
        // search body
        keyPress(keyMap.f4);
        await sleep(1000);
        // clear target
        keyPress(keyMap.f9);
        // add blood
        keyPress(keyMap.f5);
        await sleep(3000);
        // find new target
        cycleDoUntilEnterCombat([keyMap.space, keyMap.w], 5 * 1000);
        const targetLockedTime: number = Date.now();

        while(run) {
            console.log('searching for target');
            keyPress(keyMap.f3);
            keyPress(keyMap.f4);
            if (Date.now() - targetLockedTime > 10 * 1000) {
                await sleep(1000);
                const random: number = Math.random();
                let code: number = 0;
                if (random > 0.5) {
                    code = keyMap.q;
                } else {
                    code = keyMap.e;
                }
                keyPress(keyMap.s);
                keyPress(keyMap.s);
                keyPress(code);
                keyPress(code);
                keyPress(code);
            }

            // wait 2 seconds
            await sleep(500);
            if (true === statusMap.move || true === (statusMap.combat as any)) {
                console.log('target locked');
                break;
            }
        }

        cycleDoUntilEnterCombat([keyMap.f4], 1000);
        
        // deal role stack

    }
}

async function cycleDoUntilEnterCombat(code: number[], time: number): Promise<void> {
    while (run && false === statusMap.combat) {
        await sleep(time);
        if (true === (statusMap.combat) as any) {
            break;
        }
        for (let i = 0; i < code.length; i++) {
            keyPress(code[i]);
        }
        
    }
}

async function cycleDoUntilLeaveCombat(code: number[], time: number): Promise<void> {
    while (run && true === statusMap.combat) {
        await sleep(time);
        if (false === (statusMap.combat) as any) {
            break;
        }
        for (let i = 0; i < code.length; i++) {
            keyPress(code[i]);
        }
    }
}

function start() {
    run = true;
    monitorStatus();
    monitorBuffer(keyMap.f1, 30 * 1000);
    monitorBuffer(keyMap.f2, 4 * 60 * 1000);
    
    combatChange();
}

function stop() {
    run = false;
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

