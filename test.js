const pf = require('pathfinding');

const grid = new pf.Grid(10000, 10000);

grid.setWalkableAt(500, 500, false);
grid.setWalkableAt(540, 540, false);
grid.setWalkableAt(539, 540, false);
grid.setWalkableAt(538, 540, false);
grid.setWalkableAt(997, 998, false);


var finder = new pf.BestFirstFinder({
  allowDiagonal: true
});

console.time('start');
const paths = finder.findPath(322, 322, 998, 998, grid);
console.timeEnd('start');

console.log(paths);
