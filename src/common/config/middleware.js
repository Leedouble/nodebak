const path = require('path')
const cors = require('kcors')
const isDev = think.env === 'development'

module.exports = [
  {
    handle: 'meta',
    options: {
      logRequest: isDev,
      sendResponseTime: isDev
    }
  },
  {
    handle: 'resource',
    enable: isDev,
    options: {
      root: path.join(think.ROOT_PATH, 'www'),
      publicPath: /^\/(static|favicon\.ico)/
    }
  },
  {
    handle: 'trace',
    enable: !think.isCli,
    options: {
      debug: isDev
    }
  },
  {
    handle: 'payload',
    options: {}
  },
  {
    handle: 'router',
    options: {}
  },
  {
    handle: cors,
    options: {
      origin: function(ctx) {
        const corsReg = new RegExp(think.config('allowCORS'))
        if (ctx.header.origin && corsReg.test(ctx.header.origin)) {
          return ctx.header.origin
        }
        return false
      },
      credentials: true,
      allowMethods: 'GET,PUT,POST,DELETE',
      allowHeaders: 'x-requested-with,withCredentials'
    }
  },
  'logic',
  'controller'
];
