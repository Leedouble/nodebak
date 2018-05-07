module.exports = class extends think.Controller {
  async phoneAction() {
    const params = {
      phone: this.post('phone'),
      passwd: this.post('passwd')
    }
    const res = await this.model('user/user', 'userMysql').login(params)
    if (!res.status) {
      return this.fail(5021, '登录异常')
    }
    if (res.data && res.data.length === 0) {
      return this.fail(4041, '用户名或者密码不正确')
    }
    const adminInfo = this._handleLoginInfo(res.data[0])
    await this.session('adminInfo', adminInfo)
    return this.success(adminInfo)
  }

  _handleLoginInfo(data) {
    return {
      id: data.id,
      realName: data.real_name,
      phone: data.phone
    }
  }
}
