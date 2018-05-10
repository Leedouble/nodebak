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

  async isExist(condition, fields = 'id') {
    let res = {}
    try {
      res = this.getSuccess(await this.table('t_user', true).field(fields).where(condition).select())
    } catch (e) {
      res = this.getFail('数据查询异常')
    }
    return res
  }

  async modifyPassword(condition) {
    let res = {}
    try {
      res = this.getSuccess(await this.table('t_user', true).where({ phone: condition.phone }).update({ passwd: condition.password }))
    } catch (e) {
      res = this.getFail('数据更新异常')
    }
    return res
  }
}
