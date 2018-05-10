import Base from '../base'

module.exports = class extends Base {
  async getList(params, pages = { page: 1, perpage: 10 }, fields = 'user_id') {
    const page = pages.page || 1
    const perpage = pages.perpage || 10
    const condition = this.handleSelectCondition(params)
    let res = {}
    try {
      res = this.getSuccess(await this.table('t_identity', true).field(fields).where(condition).page(
        page, perpage).countSelect())
    } catch (e) {
      console.log(e)
      res = this.getFail('数据查询异常')
    }
    return res
  }

  async getAll(params, fields = 'id,open_id,user_id') {
    const condition = this.handleSelectCondition(params)
    let res = {}
    try {
      res = this.getSuccess(await this.table('t_identity', true).field(fields).where(condition).select())
    } catch (e) {
      console.log(e)
      res = this.getFail('数据查询异常')
    }
    return res
  }

  handleSelectCondition(params) {
    const data = {}
    for (const key in params) {
      switch (key) {
        case 'user_id':
          data.user_id = ['in', params[key]]
          break
        case 'identity':
          data.identity = params[key]
          break
        case 'agent':
          data.agent = params[key]
          break
        case 'open_id':
          data.open_id = params[key]
          break
        case 'union_id':
          data.union_id = params[key]
          break
        default:
          break
      }
    }
    return data
  }

  async addManyData(condition) {
    if (condition.length === 0) {
      return this.getSuccess([])
    }
    let res = {}
    try {
      res = this.getSuccess(await this.table('t_identity', true).addMany(condition))
    } catch (e) {
      console.log(e)
      res = this.getFail('数据新增异常')
    }
    return res
  }
}
