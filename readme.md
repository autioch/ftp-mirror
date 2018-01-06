# Ftp mirror

Watches given folder and copies any changes in it on the given folder in an ftp.

## Installation
Right now only direct download. When package is mature enough, it will be published on the npm.

## Standalone usage

If used as standalone package ( `require.main === module` ), it will look for a `config.js` file in the folder of the package.

## Usage as a module

Package exposes single method that accepts configuration object:

```javascript

const ftpMirror = require('ftp-mirror');

//  configuration object
const config ={
  connectionConfig: {
    host: 'ftp.domain.com',
    port: 21,
    secure: false,
    secureOptions: null,
    user: 'login',
    password: 'pass',
    connTimeout: 10000,
    pasvTimeout: 10000,
    keepalive: 6000
  },
  fsFolder: '.',
  ftpFolder: '.'
}

ftpMirror(config).then((ftpMirrorEnd) => {
  /* Do stuff, then close ftp connection and stop watching fs. */
});
```

## TODO
1. Mirror folders. If there's no folder to copy into, create one.
2. Enable starting synchronization.
3. Enable watching only specific files.
