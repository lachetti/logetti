const fs = require('fs');
const promisify = require('util').promisify;

const appendFile = promisify(fs.appendFile);

const fontColors = {
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  crimson: '\x1b[38m'
};

function _padTime(x) {
  return x.toString().padStart(2, '0');
}

function _getNiceDateTime() {
  const date = new Date();
  const timezoneOffset = date.getTimezoneOffset() / 60;

  return '[' +
    _padTime(date.getDay()) + '.' +
    _padTime(date.getMonth() + 1) + '.' +
    _padTime(date.getFullYear()) + ' ' +
    _padTime(date.getHours()) + ':' +
    _padTime(date.getMinutes()) + ':' +
    _padTime(date.getSeconds()) + ':' +
    _padTime(date.getMilliseconds()) +
    ` UTC${timezoneOffset > 0 ? '+' + timezoneOffset : timezoneOffset}` +
  ']';
}

function _colorize(str, color) {
  return fontColors[color] + str + fontColors.white;
}

function _getPrefix(level) {
  return `${_getNiceDateTime()} ${level}: `.padEnd(40, ' ');
}

function _writeLog(logFilePath, prefix, ...args) {
  const log = args
    .map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg)
    .join(' ');

  appendFile(logFilePath, prefix + log + '\n')
    .catch(e => console.error(e.message));
}

class Logger {

  logFilePath = `${__dirname}/.log`;
  allowConsole = true;

  log(...args) {
    const prefix = _getPrefix('LOG');

    console.log(_colorize(prefix, 'green'), ...args);
  }

  write(...args) {
    const prefix = _getPrefix('WRITE');

    _writeLog(this.logFilePath, prefix, ...args);
  }

  info(...args) {
    const prefix = _getPrefix('INFO');

    console.log(_colorize(prefix, 'cyan'), ...args);
    _writeLog(this.logFilePath, prefix, ...args);
  }

  warn(...args) {
    const prefix = _getPrefix('WARN');

    console.warn(_colorize(prefix, 'yellow'), ...args);
    _writeLog(this.logFilePath, prefix, ...args);
  }

  error(...args) {
    const prefix = _getPrefix('ERROR');

    console.error(_colorize(prefix, 'red'), ...args);
    _writeLog(this.logFilePath, prefix, ...args);
  }
}

module.exports = new Logger();