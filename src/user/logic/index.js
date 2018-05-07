module.exports = class extends think.Logic {
  indexAction() {
    this.allowMethods = 'get'
    this.rules = {
      phone: {
        required: true,
        mobile: 'zh-CN'
      },
      passwd: {
        required: true,
        string: true
      }
    }
  }
}
