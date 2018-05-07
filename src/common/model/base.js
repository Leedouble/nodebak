module.exports = class extends think.Model {
  getSuccess(data) {
    return { status: true, msg: { code: 2000, msg: '请求成功' }, data }
  }

  getFail(msg) {
    const code = think.config('errno').mysql
    return { status: false, msg: { code, msg }, data: [] }
  }
}
