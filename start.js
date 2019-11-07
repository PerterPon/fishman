
const fs = require('fs-extra');
const path = require('path');
const childProcess = require('child_process');
const os = require('os');
const rimraf = require('rimraf');

const tsc = path.join(__dirname, './node_modules/.bin/tsc');
const buildFolder = path.join(__dirname, './build');

// 1. try to remove build folder

function deleteBuild() {
  console.log('delete build folder');
  if (true === fs.existsSync(buildFolder)) {
    rimraf.sync(buildFolder);
    // fs.rmdirSync(buildFolder);
  }  
}

async function compileTS() {
  console.log('compiling ts ...');
  return new Promise((resolve, reject) => {
    childProcess.exec(tsc, (error, cpstdout, cpstderr) => {
      if (error) {
        console.log('compile ts with error');
        console.log(error);
        console.log(cpstderr);
        reject();
        return;
      }
      console.log('compile ts success!');
      console.log(cpstdout);
      resolve();
    });  
  });

}

async function moveEtc() {
  console.log('move etc files');
  fs.copySync(path.join(__dirname, 'etc'), path.join(buildFolder, 'etc'));
  fs.copySync(path.join(__dirname, 'src/model/situations'), path.join(buildFolder, 'src/model/situations'));
  fs.copySync(path.join(__dirname, 'src/model/template.json'), path.join(buildFolder, 'src/model/template.json'));
}

function run() {
  const platform = os.platform();
  if ('darwin' === platform) {
    const children = childProcess.exec(`NODE_PATH=${buildFolder} DEBUG=* node ${buildFolder}/src/index.js`);
    children.stdout.pipe(process.stdout);
  } else if ('win32' === platform) {
    const children = childProcess.exec(`set NODE_PATH=${buildFolder}&&node ${buildFolder}/src/index.js`);
    children.stdout.pipe(process.stdout);
  }
}

async function start() {
  deleteBuild();
  await compileTS();
  moveEtc();
  run();
}

start();
