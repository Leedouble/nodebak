module.exports = class extends think.Controller {
  async __before() {
    let adminInfo = {}
    // 微信小程序调用
    // attention: 在小程序模拟器里，HTTP头部均自动转成小写
    const code = this.ctx.wxAppletCode
    if (!think.isEmpty(code)) {
      adminInfo = await think.cache(`wxAdminInfo-${code}`)
    } else {
      adminInfo = await this.session('adminInfo')
    }
    if (think.isEmpty(adminInfo)) {
      return this.fail(4011, '用户未登录')
    }
    this.adminInfo = adminInfo
  }
}
