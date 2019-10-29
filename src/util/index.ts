
/*
 * index.ts
 * Author: perterpon<perterpon@gmail.com>
 * Create: Mon Oct 21 2019 15:16:59 GMT+0800 (中国标准时间)
 */

export async function sleep(time: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

export async function randomSleep(timeMin: number, timeMax: number): Promise<void> {
  return new Promise((resolve) => {
    const randomTime: number = Math.random() * (timeMax - timeMin) + timeMin;
    setTimeout(resolve, randomTime);
  })
}
