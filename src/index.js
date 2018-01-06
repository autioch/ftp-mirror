const Client = require('ftp');
const qbLog = require('qb-log')('simple');
const Bluebird = require('bluebird');
const fs = Bluebird.promisifyAll(require('fs'));
const path = require('path');

const SECOND = 10000;
const DEFAULT_INTERVAL = 10 * SECOND;

function setup() {
  const client = new Client();

  client.on('greeting', (msg) => qbLog.info(msg));
  client.on('ready', () => qbLog.debug('ready'));
  client.on('close', () => qbLog.debug('close'));
  client.on('end', () => qbLog.debug('end'));
  client.on('error', (err) => qbLog.error(err.message, err.code));

  return client;
}

function mapToObj(array) {
  return array.reduce((map, item) => {
    map[item] = true;

    return map;
  }, {});
}

function putsToPromises(client, fsFolder, ftpFolder, filesToCopy) {
  return Bluebird.all(filesToCopy.map((fileToCopy) => new Bluebird((resolve, reject) => {
    client.put(path.join(fsFolder, fileToCopy), `${ftpFolder}/${fileToCopy}`, (err) => {
      qbLog.warn(fileToCopy);

      if (err) {
        reject(err.message);

        return;
      }
      resolve();
    });
  })));
}

function synchronize(client, fsFolder, ftpFolder, fileNameRegex) {
  client.list(ftpFolder, (err, ftpAllFiles) => {
    if (err) {
      qbLog.error(err.message, err.code);

      return;
    }

    const ftpFiles = ftpAllFiles.filter((file) => fileNameRegex.test(file.name));

    fs.readdirAsync(fsFolder).then((fsAllFiles) => {
      const fsFiles = fsAllFiles.filter((file) => fileNameRegex.test(file));
      const ftpMap = mapToObj(ftpFiles.map((ftpFile) => ftpFile.name));
      const filesToCopy = fsFiles.filter((fsFile) => !ftpMap[fsFile]);

      qbLog.debug('Files to copy');
      filesToCopy.forEach((fileToCopy) => qbLog.empty(fileToCopy));

      putsToPromises(client, fsFolder, ftpFolder, filesToCopy).catch((msg) => qbLog.error(msg));
    });
  });
}

module.exports = function ftpMirror(config) {
  const {
    fsFolder = '.',
    ftpFolder = '.',
    connectionConfig,

    interval = DEFAULT_INTERVAL,
    fileNameRegex = /./
  } = config;

  const client = setup();
  let intervalId = null;

  function stopMirroring() {
    clearInterval(intervalId);
    client.end();
  }

  client.on('ready', () => {
    synchronize(client, fsFolder, ftpFolder, fileNameRegex);

    /* TODO Instead of interval, just watch the directory... */
    intervalId = setInterval(() => synchronize(client, fsFolder, ftpFolder, fileNameRegex), interval);
  });

  client.connect(connectionConfig);

  return stopMirroring;
};
