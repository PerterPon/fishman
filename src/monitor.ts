
/*
 * monitor.ts
 * Author: PerterPon<perterpon@gmail.com>
 * Create: Sun Nov 24 2019 15:05:49 GMT+0800 (中国标准时间)
 */

import { EventEmitter } from 'events';
import * as _ from 'lodash';

import { capture } from "src/ability/capture";
import { getTemplate } from "src/model/template";
import { templateJudge } from "src/ability/image_id";
import { sleep, colorAt, pixelAt } from "src/util";
import vision from 'src/vision';

import { ETemplate } from "src/constants/enums";

import { TPoint, TBitmap, TPointTemplate, TRect, TPixel } from "fishman";

let flagPoint: TPoint = null;
let run: boolean = false;
const pontCount: number = 11;

const rgbValueMap:any = {
"0": "0000",
"26": "0001",
"28": "0010",
"31": "0011",
"33": "0100",
"36": "0101",
"38": "0110",
"41": "0111",
"51": "1000",
"77": "1001",
"102": "1010",
"128": "1011",
"153": "1100",
"179": "1101",
"204": "1110",
"230": "1111",
};

export let statusValue: {[name: string]: any} = {};
export const eventBus: EventEmitter = new EventEmitter();

export function init(): void {
    vision.monitor = eventBus;
    findFlag();
}

export async function startMonitor(): Promise<void> {
    run = true;
    initStatusValue();
    updateStatusValue(statusValue, parsePluginValue());
    // monitorAngle();
    while (run) {
        const newValue = parsePluginValue();
        if (newValue === null) {
            console.log('could not parse data, retry after 10\'s');
            await sleep(10 * 1000);
            findFlag(false);
        }

        const oldValue = Object.assign({}, statusValue);
        updateStatusValue(statusValue, newValue);
        detectValueChange(oldValue, statusValue);
        await sleep(100);
    }
}

export async function stopMonitor(): Promise<void>{
    run = false;
}

const statusIndexMap = [
    "moving",
    'combat',
    'attack',
    'player_health',
    'player_level',
    'player_dead',
    'player_swimming',
    'player_x',
    'player_y',
    'player_facing',
    'target_dead',
    'target_exists',
    'target_health',
    'target_level',
    'target_minDistance',
    'target_maxDistance',
    'float_xp',
    'float_gold' 
];

const statusArray: {[name: string]: any} = {
    moving : 1,
    combat : 1,
    attack : 1,
    player_health : 7,
    player_level : 7,
    player_dead : 1,
    player_swimming: 1,
    player_x : 14,
    player_y : 14,
    player_facing : 14,
    target_dead : 1,
    target_exists : 1,
    target_health : 7,
    target_level : 7,
    target_minDistance : 7,
    target_maxDistance : 7,
    float_xp : 12,
    float_gold : 20
};

function findFlag(exit: boolean = true): void {
    const img: TBitmap = capture();
    const temp: TPointTemplate = getTemplate(ETemplate.PLUGIN_FLAG);
    const point: TPoint = templateJudge(img, temp, 1);
    if (null === point) {
        console.log(`cloud not found flag, exists`);
        if (true === exit) {
            process.exit(1);
        }
    } else {
        console.log('flag point', point);
        flagPoint = point;
    }
}

function parsePluginValue(): {[name: string]: any} {
    const infoRect: TRect = {
        x: flagPoint.x,
        y: flagPoint.y + 1,
        w: pontCount,
        h: 1
    };
    const infoImg: TBitmap = capture(infoRect);
    const binaryArray: string = getBinaryArrayFromImg(infoImg);
    if (null === binaryArray) {
        return null;
    }
    const newValue = parseValueFromBinaryArray(binaryArray);
    return newValue;
}

function parseValueFromBinaryArray(binaryArray: string) {
    let curPos: number = 0;
    let statusValue: {[name: string]: any} = {};
    for (let i = 0; i < statusIndexMap.length; i++) {
        const keyName: string = statusIndexMap[i];
        const keyLength: number = statusArray[keyName];
        const valueBinary: string = binaryArray.substr(curPos, keyLength);
        const value: number = parseInt(valueBinary, 2);
        statusValue[keyName] = value;
        curPos += keyLength;
    }
    return statusValue;
}

function detectValueChange(oldValue: {[name: string]: any}, newValue: {[name: string]: any}): void {
    for(let key in newValue) {
        const nValue = _.get(newValue, key);
        const oValue = _.get(oldValue, key);
        if(nValue !== oValue) {
            eventBus.emit(key, nValue, oValue);
        }
    }
}

function getBinaryArrayFromImg(img: TBitmap): string {
    let binaryArray: string = '';
    for (let i = 0; i < img.width; i ++) {
        const pix: TPixel = pixelAt(img, {x: i, y: 0});
        
        const rValue = rgbValueMap[`${pix[0]}`];
        const gValue = rgbValueMap[`${pix[1]}`];
        const bValue = rgbValueMap[`${pix[2]}`];
        if (undefined === rValue || undefined === gValue || undefined === bValue) {
            return null;
        }
        binaryArray += rValue;
        binaryArray += gValue;
        binaryArray += bValue;
    }
    return binaryArray; 
}

function initStatusValue(): void {
    Object.assign(statusValue, {
        moving: 0,
        combat: 0,
        attack: 0,
        player_health: 0,
        player_level: 0,
        player_dead: 0,
        target_dead: 0,
        target_exists: 0,
        target_health: 0,
        target_level: 0,
        target_minDistance: 0,
        target_maxDistance: 0,
        float_xp: 0,
        float_gold: 0
    });
}

function updateStatusValue(oldValue: any, newValue: any) {
    Object.assign(oldValue, newValue);
    vision.monitorValue = oldValue;
}

let latestPosition: TPoint = null;
async function monitorAngle(): Promise<void> {
    while (run) {
        await sleep(300);
        const { player_x, player_y } = statusValue;
        const newPoint: TPoint = {
            x: player_x,
            y: player_y,
        };
        if (null === latestPosition) {
            latestPosition = {x: player_x, y: player_y};
            return;
        }

        const oldPoint: TPoint = latestPosition;
        const oldAngle: number = statusValue.angle;
        const newAngle: number = calculateAngle(newPoint, oldPoint);
        statusValue.angle = newAngle;
        detectValueChange({angle: oldAngle}, {angle: newAngle});
    }
}

function calculateAngle(newPont: TPoint, oldPoint: TPoint): number {
    return Math.atan2(
        newPont.y - oldPoint.y, newPont.x - oldPoint.x
    );
}
