
/*
* index.d.ts
* Author: perterpon<perterpon@gmail.com>
* Create: Mon Oct 21 2019 12:04:57 GMT+0800 (中国标准时间)
*/

declare module 'fishman' {
  import { EAction, ETemplateJudgeType, ETemplate } from "src/constants/enums";
  import { Bitmap } from "robotjs";

  export interface TPoint {
    x: number;
    y: number;
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
    images: TPicture[];
    texts: TText[];
  }

  export interface TSituation {
    name: string;
    required: TFeature[];
    optional?: TFeature[];
    action: TAction;
    nextLookTime?: number;
    nextView?: TRect;
  }

  export interface TSituationProbability {
    name: string, 
    probability: number, 
    times: number
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

  export interface TMemory {
    time: number;
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

}
