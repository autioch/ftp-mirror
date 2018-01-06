const chokidar = require('chokidar');
const onQuit = require('on-quit/src');
const qbLog = require('qb-log');
const pathExists = require('path-exists');
const Bluebird = require('bluebird');

qbLog({
  fs: {
    prefix: 'FS',
    formatter: qbLog._chalk.magenta,
    showTime: true
  }
});

module.exports = function setupFsWatcher(fsFolder) {
  return pathExists(fsFolder).then((exists) => {
    if (!exists) {
      return Bluebird.reject('FS folder does not exist.');
    }

    const watchPath = fsFolder.replace(/\//g, '\\');

    qbLog.fs(fsFolder);

    const watcher = chokidar.watch(watchPath, {
      ignoreInitial: true,
      awaitWriteFinish: true
    });

    onQuit(() => {
      watcher.close();
      qbLog.fs('close');
    });

    return watcher;
  });
};
