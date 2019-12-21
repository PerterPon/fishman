const pf = require('pathfinding');

const grid = new pf.Grid(1000, 1000);

// grid.setWalkableAt(500, 500, false);
// grid.setWalkableAt(540, 540, false);
// grid.setWalkableAt(539, 540, false);
// grid.setWalkableAt(538, 540, false);
grid.setWalkableAt(507, 345, false);


var finder = new pf.BestFirstFinder({
  allowDiagonal: false
});

console.time('start');
const paths = finder.findPath(507, 345, 509, 412, grid);
console.timeEnd('start');

console.log(paths);
