
/*
 * enums.ts
 * Author: perterpon<perterpon@gmail.com>
 * Create: Fri Oct 25 2019 18:28:08 GMT+0800 (China Standard Time)
 */

export enum ESituation {
  
}

export enum EAction {
  BN_LOGIN
}

export enum EGoal {
  FISH,
  AUCTION,
  ALCHEMY
}

export enum ETemplate {
  BN_LOGIN_BTN = 'login/bn_login_btn',
  BN_OPEN_GAME_BTN = 'login/bn_open_game_btn',

  BATTLING = 'battling',
  OUT_BATTLE = 'out_battle'
}

export enum ETemplateJudgeType {
  FROM_ORIGIN,
  FROM_CENTER
}

export enum EFeature {
  BN_LOGIN_BTN = 'login/bn_login_btn',
  BN_OPEN_GAME_BTN = 'login/bn_open_game_btn',

  ROLE_BATTLING = 'role/battling',
  ROLE_OUT_BATTLE = 'role/out_battle',
}

export enum EBiz {
  FISH = 'fish',
  UPGRADE = 'upgrade',
}
