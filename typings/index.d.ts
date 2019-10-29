
/*
* index.d.ts
* Author: perterpon<perterpon@gmail.com>
* Create: Mon Oct 21 2019 12:04:57 GMT+0800 (中国标准时间)
*/

declare module 'fishman' {
  import { EAction } from "src/constants/enums";

  export interface TPoint {
    x: number;
    y: number;
  }

  export type TPixel = [number, number, number];

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
    action: TAction[];
  }

  export interface TSituationProbability {
    name: string, 
    probability: number, 
    times: number
  }

  export interface TAction {
    type: EAction;
    time: number;
    done: boolean;
    resData: unknown;
  }

  export interface TMemory {
    time: number;
    rect: TRect;
    // data: TPixel[];
    pixel: TPixel[];
  }

  export interface TContext {
    memory: TMemory;
    situation: string;
  }
}
