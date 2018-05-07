'use strict';

import fs from 'fs'

// 短信服务
module.exports = class extends think.Service {
  async upload(fileobj) {
    if (!fileobj.file) {
      return this.getFail('upload', '文件不存在')
    }
    const filepath = fileobj.file.path
    const timePath = `${think.datetime(new Date(), 'YYYY')}/${think.datetime(new Date(), 'MM')}/${think.datetime(new Date(), 'DD')}`
    const uploadPath = `${think.ROOT_PATH}/www/static/upload/${timePath}`
    think.mkdir(uploadPath)
    const uploadConfig = think.config('upload')
    const realName = this.handleFileName(fileobj.file.name)
    fs.renameSync(filepath, `${uploadPath}/${realName}`)
    if (think.env.includes('production')) {
      const uploadRes = await this.uploadTencent(uploadPath, realName, `static/upload/${timePath}`)
      if (!uploadRes.status) {
        return this.getFail('upload', '上传失败')
      }
      return this.getSuccess({
        name: realName,
        url: `${uploadConfig.resourceUrl}/static/upload/${timePath}/${realName}`
      })
    } else {
      return this.getSuccess({ name: realName, url: `${uploadConfig.localUrl}/static/upload/${timePath}/${realName}` })
    }
  }

  handleFileName(fileName) {
    const list = fileName.split('.')
    const type = list[list.length - 1]
    const nowTime = new Date().getTime()
    return `${nowTime}_${parseInt((Math.random() * 10000), 10)}.${type}`
  }

  async uploadTencent(filePath, realName, keyPath) {
    return this.getSuccess('ok')
  }
}
