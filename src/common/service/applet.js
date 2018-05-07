'use strict'

module.exports = class extends think.Service {
  constructor(args) {
    super()
    this.opts = think.config(args)
  }

  /**
   * 通过code向微信后端换取openid，session_key
   */
  async getSession(code) {
    const url = `${this.opts.host}/sns/jscode2session`
    const res = await this.httpGet(url, {
      appid: this.opts.appid,
      secret: this.opts.secret,
      js_code: code,
      grant_type: 'authorization_code'
    })
    if (res.errcode) {
      return this.getFail('applet', res.errmsg)
    }
    return this.getSuccess(res)
  }
}
