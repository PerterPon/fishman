
declare module "fishman/map" {

  import { TPoint } from 'fishman';
  import { ERegion } from 'src/constants/map';

  export type TWorldMap = Map<ERegion, TMap>;

  export interface TMapArea {
    obstacle: TPoint[];
    water: TPoint[];
    road: TPoint[];
  }

  type Level = number;
  export type TMapMonster = Map<Level, TPoint[]>;

  export interface TMapNpc {
    repair: Map<TPoint, string>;
  }

  export interface TMap {
    area: TMapArea;
    monster: TMapMonster;
    nps: TMapNpc;
  }

  export interface TRoadPoint extends TPoint {
    facing: number;
  }
}
