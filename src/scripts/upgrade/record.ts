


import { init, startMonitor, eventBus, statusValue } from 'src/monitor';
import { sleep } from 'src/util';
import { TRoadPoint } from 'fishman/map';
import { keyDown, keyUp } from "src/ability/keyboard";
import { keyMap } from 'src/constants/keymap';
import { moveTo2, rightDown, rightUp } from 'src/ability/mouse';

async function start(): Promise<void> {
  init();
  startMonitor();
  keyDown(keyMap.a);
  await sleep(100);
  keyUp(keyMap.a);
  await sleep(10000000);
  record();
}

start();

const roads: TRoadPoint[] = [];

async function record(): Promise<void> {

  let latestPoint: TRoadPoint = {
    x: statusValue.player_x,
    y: statusValue.player_y,
    facing: statusValue.player_facing
  };
  roads.push(latestPoint);
  while (true) {
    await sleep(1000);
    if (statusValue.player_facing !== latestPoint.facing) {
      latestPoint = {
        x: statusValue.player_x,
        y: statusValue.player_y,
        facing: statusValue.player_facing
      }
      roads.push(latestPoint);
      console.log(JSON.stringify(roads));
    } else {
      if (Math.abs(latestPoint.x - statusValue.player_x) < 100 && latestPoint.y - statusValue.player_y < 100) {
        continue;
      }
      roads.push(latestPoint);
      console.log(JSON.stringify(roads));
    }
    
    
  }

}

process.on('SIGKILL', () => {
  console.log(JSON.stringify(roads));
});
