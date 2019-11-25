
/*
* index.d.ts
* Author: perterpon<perterpon@gmail.com>
* Create: Mon Oct 21 2019 12:04:57 GMT+0800 (中国标准时间)
*/

declare module 'ffi' {
  export function Library(arg1?: any, arg2?: any): any;
}

declare module 'fishman' {
  import { EAction, ETemplateJudgeType, ETemplate, EFeature } from "src/constants/enums";
  import { Bitmap } from "robotjs";

  export interface TPoint {
    x: number;
    y: number;
  }

  export interface TSize {
    w: number;
    h: number;
  }

  export type TPixel = [number, number, number];

  export interface THEXPoint {
    point: TPoint;
    color: string;
  }

  export interface TPointTemplate {
    name: ETemplate;
    width: number;
    height: number;
    points: THEXPoint[];
    type: ETemplateJudgeType;
  }

  export interface TRect {
    x: number;
    y: number;
    w: number;
    h: number;
  }

  export interface TImagePoint {
    point: TPoint;
    color: TPixel;
  }

  export interface TPicture {
    rect: TRect;
    value: number;
    content: TImagePoint[];
  }

  export interface TText {
    rect: TRect;
    content: string;
  }

  export interface TFeature {
    size: TSize;
  }

  export interface TSituation {
    name: string;
    required: EFeature[];
    optional?: EFeature[];
    action: TAction;
    delay?: number;
    // views: TRect[];
    // nextLookTime?: number;
    // nextView?: TRect;
  }

  export interface TSituationProbabilityModel {
    name: string;
    probability: number;
    times: number;
  }

  export interface TFeatureMap {
    [name: string]: TRect;
  }

  export interface TSituationModel {
    name: string;
    featureMap?: TFeatureMap;
    probability?: TSituationProbabilityModel[];
  }

  export interface TAction {
    name: string;
    time?: number;
    done?: boolean;
    view?: TRect;
    review?: boolean;
    resData?: unknown;
    targetRectTemps?: ETemplate[];
  }

  export interface TFeatureMemories {
    [name: string]: TFeatureMemory;
  }

  export interface TMemory {
    time: number;
    rects: TRect[];
    pictures: TBitmap[];
    features?: TFeatureMemories;
  }

  export interface TFeatureMemory {
    rect: TRect;
    picture: TBitmap;
  }

  export interface TContext {
    memory: TMemory;
    situation: string;
  }

  export interface TScreenShort {
    image: Buffer;
    colorAt(x: number, y: number) : [number, number, number];
  }

  export interface TBitmap extends Bitmap {
    pixel: Uint8Array;
    image: Buffer;
  }

  export interface TMap {
    obstacle: TPoint[];
    water: TPoint[];
    road: TPoint[];
  }

  export interface TMonitorInfo {
    
  }

}
