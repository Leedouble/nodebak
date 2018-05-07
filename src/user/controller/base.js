module.exports = class extends think.Controller {
  async __before() {
    let userInfo = {}
    // 微信小程序调用
    const code = this.ctx.wxAppletCode
    if (!think.isEmpty(code)) {
      userInfo = await think.cache(`wxUserInfo-${code}`)
    } else {
      userInfo = await this.session('userInfo')
    }
    if (think.isEmpty(userInfo)) {
      return this.fail(4011, '用户未登录')
    }
    this.userInfo = userInfo
  }
}
