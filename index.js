const qbLog = require('qb-log')('simple');
const Bluebird = require('bluebird');
const setupFtpClient = require('./src/ftpClient');
const setupFsWatcher = require('./src/fsWatcher');
const setupFileCopier = require('./src/fileCopier');
const setupFileRemover = require('./src/fileRemover');

module.exports = function ftpMirror(config) {
  const { connectionConfig, ftpFolder, fsFolder } = config;

  return Bluebird
    .all([
      setupFtpClient(connectionConfig),
      setupFsWatcher(fsFolder)
    ])
    .then(([ftpClient, fsWatcher]) => {
      const fileCopier = setupFileCopier(ftpClient, fsFolder, ftpFolder);
      const fileRemover = setupFileRemover(ftpClient, fsFolder, ftpFolder);

      fsWatcher.on('add', fileCopier);
      fsWatcher.on('change', fileCopier);
      fsWatcher.on('unlink', fileRemover);

      return function ftpMirrorEnd() {
        fsWatcher.close();
        ftpClient.end();
      };
    });
};

if (require.main === module) {
  module.exports(require('./config'))

    // .then((ftpMirrorEnd) => setTimeout(() => ftpMirrorEnd(), 1000))
    .catch((msg) => {
      qbLog.error(msg);
      process.exit();// eslint-disable-line no-process-exit
    });
}
