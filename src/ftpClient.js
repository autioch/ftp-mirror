const Bluebird = require('bluebird');
const qbLog = require('qb-log');
const Client = require('ftp');
const onQuit = require('on-quit/src');

qbLog({
  ftp: {
    prefix: 'FTP',
    formatter: qbLog._chalk.cyan,
    showTime: true
  },
  ftpGreet: {
    prefix: 'FTP GREET',
    formatter: qbLog._chalk.cyan,
    showTime: true
  },
  ftpError: {
    prefix: 'FTP ERROR',
    formatter: qbLog._chalk.bgCyan,
    showTime: true
  }
});

module.exports = function setupFtpClient(connectionConfig) {
  return new Bluebird((resolve) => {
    const client = new Client();

    client.on('close', () => qbLog.ftp('close'));
    client.on('end', () => qbLog.ftp('end'));

    client.on('greeting', (msg) => qbLog.ftpGreet(msg));
    client.on('error', (err) => qbLog.ftpError(err.message, err.code));

    client.on('ready', () => {
      qbLog.ftp('ready');
      onQuit(() => {
        client.end();
        qbLog.ftp('end');
      });
      resolve(client);
    });

    client.connect(connectionConfig);
  });
};
