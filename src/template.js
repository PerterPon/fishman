
/*
 * template.js
 * Author: perterpon<perterpon@gmail.com>
 * Create: Sun Nov 03 2019 15:56:34 GMT+0800 (China Standard Time)
 */

const robotjs = require('robotjs');
const path = require('path');
const fs = require('fs');
const _ = require('lodash');

// const model = require('./model/template.json');
const modelString = fs.readFileSync(path.join(__dirname, './model/template.json'), 'utf-8');

const name = 'login/bn_open_game_btn';
const startX = 100;
const startY = 300;
const endX = 400;
const endY = 400;
const width = endX - startX;
const height = endY - startY;
console.time('template');
const image = robotjs.screen.capture(startX, startY, width, height);
const stepX = 6;
const stepY = 6;

const points = [];
for (let i = 0; i < height; i+=stepY) {
  for (let j = 0; j < width; j+=stepX) {
    const color = image.colorAt(j, i);
    points.push({
      point: {
        x: j,
        y: i,
      },
      color
    });
  }
}
const template = {
  name,
  width,
  height,
  points,
};

const lines = modelString.split('\n');
lines.shift();

_.remove(lines, (val) => {
  return -1 < val.indexOf(`"${name}": `);
});

lines.unshift(`  "${name}": ${JSON.stringify(template)},`);
lines.unshift('{');

fs.writeFileSync(path.join(__dirname, './model/template.json'), lines.join('\n'));
console.timeEnd('template');
