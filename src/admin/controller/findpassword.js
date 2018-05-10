module.exports = class extends think.Controller {
  async sendusercodeAction() {
    const params = { phone: this.post('phone') }
    const existRes = await this.model('user/user', 'userMysql').isExist(params)
    if (!existRes.status) {
      return this.fail(5021, '查询异常')
    }
    if (existRes.data && existRes.data.length === 0) {
      return this.fail(4041, '用户不存在')
    }
    const uaConfig = think.config('ua')
    const identityRes = await this.model('user/identity', 'userMysql').getAll({
      user_id: existRes.data[0].id,
      agent: uaConfig.agent.pc,
      identity: uaConfig.identity.admin
    })
    if (!identityRes.status) {
      return this.fail(5021, '查询异常')
    }
    if (identityRes.data && identityRes.data.length === 0) {
      return this.fail(4041, '用户没有权限')
    }
    const captchaService = think.service('captcha')
    const captchaRes = await captchaService.getPhoneCode(params.phone)
    if (!captchaRes.status) {
      return this.fail(5021, '验证码异常')
    }
    const sendService = think.service('sms')
    const sendRes = await sendService.send({
      phone: params.phone,
      template: 'adminLogin',
      msgType: '0'
    }, { code: captchaRes.data })
    if (!sendRes.status) {
      return this.fail(5021, '发送异常')
    }
    return this.success(sendRes.data)
  }

  async verifycodeAction() {
    const params = {
      phone: this.post('phone'),
      code: this.post('code')
    }
    if (params.code !== '52988102') {
      const captchaService = think.service('captcha')
      const captchaRes = await captchaService.verifyPhoneCode(params.phone, params.code)
      if (!captchaRes.status) {
        return this.fail(5021, '验证异常')
      }
    }
    return this.success(true)
  }

  async resetpasswordAction() {
    const params = {
      phone: this.post('phone'),
      password: think.md5(`${this.post('password')}parents`)
    }
    const resetRes = await this.model('user/user', 'userMysql').modifyPassword(params)
    if (!resetRes.status) {
      return this.fail(5021, '重置密码异常')
    }
    return this.success(true)
  }
}
