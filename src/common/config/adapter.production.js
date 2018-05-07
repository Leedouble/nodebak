const redisCache = require('think-cache-redis')
const redisSession = require('think-session-redis')
const mysql = require('think-model-mysql')
const { Console, File, DateFile } = require('think-logger3')
const path = require('path')
const isDev = think.env === 'development'

/**
 * cache adapter config
 * @type {Object}
 */
exports.cache = {
  type: 'redis',
  common: {
    timeout: 7 * 24 * 3600 * 1000 // millisecond
  },
  redis: {
    handle: redisCache,
    port: 6379,
    host: '',
    password: ''
  }
}

/**
 * model adapter config
 * @type {Object}
 */
exports.model = {
  type: 'mysql',
  common: {
    logConnect: isDev,
    logSql: isDev,
    logger: msg => think.logger.info(msg)
  },
  userMysql: {
    handle: mysql,
    database: 'user',
    prefix: 't_',
    encoding: 'utf8',
    host: '',
    port: '',
    user: '',
    password: '',
    dateStrings: true
  }
}

/**
 * session adapter config
 * @type {Object}
 */
exports.session = {
  type: 'redis',
  common: {
    cookie: {
      name: 'nodebak',
      // maxAge: '',
      // expires: '',
      path: '/',
      // domain: '',
      // secure: false,
      // keys: [],
      httpOnly: true,
      sameSite: false,
      signed: false,
      overwrite: false
    }
  },
  redis: {
    handle: redisSession,
    port: 6379,
    host: '',
    password: '',
    maxAge: 3600 * 1000 * 24 * 7, // session timeout, if not set, session will be persistent.
    autoUpdate: false // update expired time when get session, default is false
  }
}

/**
 * logger adapter config
 * @type {Object}
 */
exports.logger = {
  type: 'console',
  console: {
    handle: Console
  },
  file: {
    handle: File,
    backups: 10, // max chunk number
    absolute: true,
    maxLogSize: 50 * 1024, // 50M
    filename: path.join(think.ROOT_PATH, 'logs/app.log')
  },
  dateFile: {
    handle: DateFile,
    level: 'ALL',
    absolute: true,
    pattern: '-yyyy-MM-dd',
    alwaysIncludePattern: true,
    filename: path.join(think.ROOT_PATH, 'logs/app.log')
  }
}
