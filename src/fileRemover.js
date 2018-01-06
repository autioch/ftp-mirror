const { relative, join } = require('path');
const qbLog = require('qb-log');

qbLog({
  removeFs: {
    prefix: 'REMOVE FS',
    formatter: qbLog._chalk.yellow,
    showTime: true
  },
  removeFtp: {
    prefix: 'REMOVE FTP',
    formatter: qbLog._chalk.yellow,
    showTime: false
  },
  removeDone: {
    prefix: 'REMOVE DONE',
    formatter: qbLog._chalk.yellow,
    showTime: true
  },
  removeFail: {
    prefix: 'REMOVE FAIL',
    formatter: qbLog._chalk.bgYellow,
    showTime: true
  },
  removeIgnore: {
    prefix: 'REMOVE IGNORE',
    formatter: qbLog._chalk.gray,
    showTime: true
  }
});

module.exports = function setupFileRemover(client, fsFolder, ftpFolder, regexp) {
  return function fileRemove(fileName) {
    if (!regexp.test(fileName)) {
      qbLog.removeIgnore(fileName);

      return;
    }
    const ftpPath = join(ftpFolder, relative(fsFolder, fileName)).replace(/\\/g, '/');

    qbLog.removeFs(fileName);
    qbLog.removeFtp(ftpPath);

    client.delete(ftpPath, (err) => {
      if (err) {
        qbLog.removeFail(fileName, err.message);
      } else {
        qbLog.removeDone(fileName);
      }
    });
  };
};
