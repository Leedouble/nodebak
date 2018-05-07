'use strict'

// 验证码服务
module.exports = class extends think.Service {
  async getPhoneCode(phone, expireTime = 3) {
    let code = parseInt((Math.random() * 1000000), 10)
    if (code < 100000) {
      code += 100000
    }
    await think.cache(`phoneCaptcha-${phone}`, code, { timeout: expireTime * 60 * 1000 })
    return this.getSuccess(code)
  }

  async verifyPhoneCode(phone, code) {
    if (!/^1[34578]\d{9}$/.test(phone)) {
      return this.getFail('captcha', '手机号码不正确')
    }
    if (!code) {
      return this.getFail('captcha', '验证码不能为空')
    }
    const sendCode = await think.cache(`phoneCaptcha-${phone}`)
    if (parseInt(sendCode, 10) !== parseInt(code, 10)) {
      return this.getFail('captcha', '验证码不正确')
    }
    return this.getSuccess(true)
  }
}
