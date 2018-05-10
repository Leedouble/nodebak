module.exports = class extends think.Logic {
  phoneAction() {
    this.allowMethods = 'post'
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
