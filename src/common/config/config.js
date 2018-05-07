// default config
module.exports = {
  port: 10073,
  workers: 1,
  allowCORS: '(api.me|api.me:443|api.org|api.com)$',
  headerWxCode: 'x-wx-code',
  errno: {
    mysql: 4001,
    redis: 4002,
    sms: 4003,
    http: 4004,
    captcha: 4005,
    applet: 4006,
    upload: 4007,
    wxweb: 4008
  },
  ua: {
    identity: {
      admin: '1'
    },
    agent: {
      pc: '1'
    }
  },
  sms: {
    sdkappid: '',
    appkey: '',
    singleSmsUrl: 'https://yun.tim.qq.com/v5/tlssmssvr/sendsms',
    multiSmsUrl: 'https://yun.tim.qq.com/v5/tlssmssvr/sendmultisms2',
    nationCode: '86'
  },
  smsTemplate: {
    adminLogin: '设置内部门户登录密码，验证码code，请妥善保管，切勿泄露。',
    userLogin: '你的验证码为：code，请于3分钟内填写。如非本人操作，请忽略本短信。'
  },
  server: '',
  redis: {
    port: 6379,
    host: '',
    password: ''
  },
  wechatService: {
    appid: '',
    secret: '',
    redirectUrl: '//dev.api.org',
    host: 'https://open.weixin.qq.com',
    apiHost: 'https://api.weixin.qq.com'
  },
  userApplet: {
    appid: '',
    secret: '',
    host: 'https://api.weixin.qq.com'
  },
  upload: {
    src: '//dev.api.com/upload',
    appletSrc: 'http://dev.api.com/upload',
    key: 'file',
    resourceUrl: '//resource.org',
    localUrl: '//dev.api.com'
  },
  templateMsg: {
    notice: ''
  }
}
