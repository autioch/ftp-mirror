/* eslint no-magic-numbers: 0 */
const path = require('path');

module.exports = {
  connectionConfig: {
    host: '',
    port: 21,
    secure: false,
    secureOptions: null,
    user: '',
    password: '',
    connTimeout: 10000,
    pasvTimeout: 10000,
    keepalive: 6000
  },
  interval: 6000,
  fileNameRegex: /^motion .+\.webm/,
  fsFolder: '',
  ftpFolder: ''
};
