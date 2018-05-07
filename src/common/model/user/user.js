import Base from '../base'

module.exports = class extends Base {
  async login(condition, fields = 'id,real_name') {
    let res = {}
    try {
      condition.status = 1
      res = this.getSuccess(await this.table('t_user', true).field(fields).where(condition).select())
    } catch (e) {
      console.log(e)
      res = this.getFail('数据查询异常')
    }
    return res
  }
}
