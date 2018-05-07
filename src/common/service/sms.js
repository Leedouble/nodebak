'use strict'

const crypto = require('crypto')

// 短信服务
module.exports = class extends think.Service {
  constructor() {
    super()
    this.smsConf = think.config('sms')
    this.smsTemplate = think.config('smsTemplate')
  }

  /**
   * 单发短信接口
   * @param {number} msgType 短信类型，0 普通短信，1 营销短信，请严格按照相应的类型填写
   * @param {string} phoneNumber 手机号
   * @param {string} msg 短信正文，如果需要带签名，签名请使用【】标注
   * @param {string} extend 扩展字段，如无需要请填空字符串
   * @param {string} ext 此字段腾讯云后台服务器会按原样在应答中
   */
  async send({ phone, template, msgType }, opt = {}, extend = '', ext = '') {
    if (!/^1[34578]\d{9}$/.test(phone)) {
      return this.getFail('sms', '手机号码不正确')
    }
    if (!template) {
      return this.getFail('sms', '模版不能为空')
    }
    if (!msgType) {
      return this.getFail('sms', '短信类型不能为空')
    }
    const rand = Math.round(Math.random() * 99999)
    const curTime = Math.floor(Date.now() / 1000)
    const msgContent = this.handleMsgContent(opt, template)
    const reqObj = {
      tel: { nationcode: this.smsConf.nationCode, mobile: phone },
      type: parseInt(msgType, 10),
      msg: msgContent,
      sig: await this.getSmsSig(rand, curTime, [phone], this.smsConf.appkey),
      time: curTime,
      extend,
      ext
    }
    if (think.env.includes('production')) {
      const url = `${this.smsConf.singleSmsUrl}?sdkappid=${this.smsConf.sdkappid}&random=${rand}`
      const sendRes = await this.httpPost(url, reqObj)
      if (sendRes.result !== 0) {
        return this.getFail('sms', '发送失败')
      }
    } else {
      console.log(reqObj)
    }
    return this.getSuccess({})
  }

  /**
   * 群发短信接口
   * @param {number} msgType 短信类型，0 普通短信，1 营销短信，请严格按照相应的类型填写
   * @param {string} phoneNumber 手机号
   * @param {string} msg 短信正文，如果需要带签名，签名请使用【】标注
   * @param {string} extend 扩展字段，如无需要请填空字符串
   * @param {string} ext 此字段腾讯云后台服务器会按原样在应答中
   */
  async sendMulti({ list, template, msgType }, opt = {}, extend = '', ext = '') {
    if (!template) {
      return this.getFail('sms', '模版不能为空')
    }
    if (!msgType) {
      return this.getFail('sms', '短信类型不能为空')
    }
    const phoneList = []
    const telList = []
    const config = think.config('tx-message', undefined, 'common')
    for (let i = 0; i < list.length; i += 1) {
      if (/^1[34578]\d{9}$/.test(list[i])) {
        phoneList.push(list[i])
        telList.push({ nationcode: config.nationCode, mobile: list[i] })
      }
    }
    const rand = Math.round(Math.random() * 99999)
    const curTime = Math.floor(Date.now() / 1000)
    const msgContent = this.handleMsgContent(opt, template)
    const reqObj = {
      tel: telList,
      type: parseInt(msgType, 10),
      msg: msgContent,
      sig: await this.getSmsSig(rand, curTime, phoneList, this.smsConf.appkey),
      time: curTime,
      extend,
      ext
    }
    if (think.env.includes('production')) {
      const url = `${this.smsConf.multiSmsUrl}?sdkappid=${this.smsConf.sdkappid}&random=${rand}`
      const sendRes = await this.httpPost(url, reqObj)
      if (sendRes.result !== 0) {
        return this.getFail('sms', '发送失败')
      }
    } else {
      console.log(reqObj)
    }
    return this.getSuccess({})
  }

  getSmsSig(rand, curTime, phoneList, appkey) {
    const phoneStr = phoneList.join(',')
    const paramsStr = `appkey=${appkey}&random=${rand}&time=${curTime}&mobile=${phoneStr}`
    return crypto.createHash('sha256').update(paramsStr, 'utf-8').digest('hex')
  }

  handleMsgContent(opt, template) {
    if (!this.smsTemplate[template]) {
      return ''
    }
    let content = ''
    let code = ''
    switch (template) {
      case 'adminLogin':
        code = opt.code || ''
        content = this.smsTemplate[template].replace('code', code)
        break
      case 'userLogin':
        code = opt.code || ''
        content = this.smsTemplate[template].replace('code', code)
        break
      default:
        break
    }
    return content
  }
}
