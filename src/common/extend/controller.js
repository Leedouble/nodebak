// add controller function
module.exports = {
  getSuccess(data) {
    return { status: true, msg: { code: 2000, msg: '请求成功' }, data }
  },
  getFail(code, msg) {
    return { status: false, msg: { code, msg }, data: [] }
  },
  listToMap(list, key = 'id') {
    const map = {}
    for (let i = 0; i < list.length; i += 1) {
      map[list[i][key]] = list[i]
    }
    return map;
  },
  getIdsByList(list, key = 'id') {
    const idList = []
    for (let i = 0; i < list.length; i += 1) {
      idList.push(list[i][key])
    }
    return idList.join(',')
  }
}
