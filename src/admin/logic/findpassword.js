module.exports = class extends think.Logic {
  sendusercodeAction() {
    this.allowMethods = 'post'
    this.rules = {
      phone: {
        required: true,
        mobile: 'zh-CN'
      }
    }
  }

  verifycodeAction() {
    this.allowMethods = 'post'
    this.rules = {
      phone: {
        required: true,
        mobile: 'zh-CN'
      },
      code: {
        required: true,
        string: true
      }
    }
  }

  resetpasswordAction() {
    this.allowMethods = 'post'
    this.rules = {
      phone: {
        required: true,
        mobile: 'zh-CN'
      },
      password: {
        required: true,
        string: true
      }
    }
  }
}
