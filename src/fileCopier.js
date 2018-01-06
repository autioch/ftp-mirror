const { relative, join } = require('path');
const qbLog = require('qb-log');

qbLog({
  copyFs: {
    prefix: 'COPY FS',
    formatter: qbLog._chalk.green,
    showTime: true
  },
  copyFtp: {
    prefix: 'COPY FTP',
    formatter: qbLog._chalk.green,
    showTime: false
  },
  copyDone: {
    prefix: 'COPY DONE',
    formatter: qbLog._chalk.green,
    showTime: true
  },
  copyFail: {
    prefix: 'COPY FAIL',
    formatter: qbLog._chalk.bgGreen,
    showTime: true
  }
});

module.exports = function setupFileCopier(client, fsFolder, ftpFolder) {
  return function fileCopier(fileName) {
    const ftpPath = join(ftpFolder, relative(fsFolder, fileName)).replace(/\\/g, '/');

    qbLog.copyFs(fileName);
    qbLog.copyFtp(ftpPath);

    client.put(fileName, ftpPath, (err) => {
      if (err) {
        qbLog.copyFail(fileName, err.message);
      } else {
        qbLog.copyDone(fileName);
      }
    });
  };
};
