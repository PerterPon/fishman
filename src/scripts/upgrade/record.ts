


import { startMonitor, eventBus, statusValue } from 'src/monitor';
import { sleep } from 'src/util';
import { TPoint } from 'fishman';

async function start(): Promise<void> {
  startMonitor();
  record();
}

const roads: TPoint[] = [];

async function record(): Promise<void> {

  let latestPoint: TPoint = {
    x: statusValue.player_x,
    y: statusValue.player_y
  };
  roads.push(latestPoint);
  while (true) {
    await sleep(5000);
    if (Math.abs(latestPoint.x - statusValue.player_x) < 200 && latestPoint.y - statusValue.player_y < 200) {
      continue;
    }
    latestPoint = {
      x: latestPoint.x,
      y: latestPoint.y
    }
    roads.push(latestPoint);
  }

}

process.on('exit', () => {
  console.log(JSON.stringify(roads));
});
