'use strict'

module.exports = class extends think.Service {
  constructor() {
    super()
    const config = think.config('wechatService')
    this.opts = {
      appid: config.appid,
      secret: config.secret,
      host: config.apiHost,
      cachePre: 'wx-web-cache-bdkt'
    }
  }

  async getOauthToken(code) {
    const params = {
      appid: this.opts.appid,
      secret: this.opts.secret,
      grant_type: 'authorization_code',
      code
    }
    const url = `${this.opts.host}/sns/oauth2/access_token`
    const res = await this.httpGet(url, params)
    return this.getSuccess(res)
  }

  async getUnionId(accessToken, openId) {
    const params = {
      access_token: accessToken,
      openid: openId,
      lang: 'zh_CN'
    }
    const url = `${this.opts.host}/sns/userinfo`
    const res = await this.httpGet(url, params)
    return this.getSuccess(res)
  }

  /**
   * 获取  access_token
   */
  async getToken() {
    const cacheKey = `${this.opts.cachePre}-token`
    const cacheData = await think.cache(cacheKey)
    if (!think.isEmpty(cacheData)) {
      return this.getSuccess(cacheData)
    }
    const params = {
      grant_type: 'client_credential',
      appid: this.opts.appid,
      secret: this.opts.secret
    }
    const url = `${this.opts.host}/cgi-bin/token`
    const tokenRes = await this.httpGet(url, params)
    let token = ''
    if (tokenRes.access_token) {
      token = tokenRes.access_token
      await think.cache(cacheKey, tokenRes.access_token, { timeout: 3600 * 1000 })
    }
    return this.getSuccess(token)
  }

  async sendTemplateMsg(openId, templateId, miniprogram, data) {
    const tokenRes = await this.getToken()
    if (!tokenRes.status) {
      return this.getFail('wxweb', 'token异常')
    }
    const token = tokenRes.data
    const params = {
      touser: openId,
      template_id: templateId,
      miniprogram,
      data
    }
    const url = `${this.opts.host}/cgi-bin/message/template/send?access_token=${token}`
    const sendRes = await this.httpPost(url, params)
    if (sendRes.errcode !== '0') {
      console.log(sendRes)
    }
    return this.getSuccess(true)
  }

  async multiSendTemplateMsg(templateId, openList) {
    const tokenRes = await this.getToken()
    if (!tokenRes.status) {
      return this.getFail('wxweb', 'token异常')
    }
    const token = tokenRes.data
    const url = `${this.opts.host}/cgi-bin/message/template/send?access_token=${token}`
    const tmpList = []
    let params = {}
    for (let i = 0; i < openList.length; i += 1) {
      params = {
        touser: openList[i].openId,
        template_id: templateId,
        miniprogram: openList[i].miniprogram,
        data: openList[i].data
      }
      tmpList.push(this.httpPost(url, params))
    }
    const list = await Promise.all(tmpList)
    for (let i = 0; i < list.length; i += 1) {
      if (list[i].errcode !== '0') {
        console.log(list[i])
      }
    }
    return this.getSuccess(true)
  }

  /**
   * 通过 token 获取 ticket 用于 js-sdk
   */
  async getTicketByJs() {
    const cacheKey = `${this.opts.cachePre}-ticket-js`
    const cacheData = await think.cache(cacheKey)
    if (!think.isEmpty(cacheData)) {
      return cacheData
    }

    const tokenData = await this.getToken()
    if (!tokenData.status) {
      console.error('无法获取 ticketJs - 获取 token 出错')
      return tokenData
    }
    const token = tokenData.data.access_token
    const url = `${this.opts.host}/cgi-bin/ticket/getticket?access_token=${token}&type=jsapi`
    const TicketJsData = await this.fetchData(url)

    if (TicketJsData.status) {
      think.cache(cacheKey, TicketJsData, { timeout: 7200 / 2 })
    }
    return TicketJsData
  }

  async getTicketJSSing(url) {
    const TicketJsData = await this.getTicketByJs()
    if (!TicketJsData.status) {
      console.error('无法获取 getTicketJSSing - 获取 TicketJs 出错')
      return TicketJsData
    }
    const ticket = TicketJsData.data.ticket
    const timestamp = parseInt(new Date().getTime() / 1000, 10).toString()
    const nonceStr = Math.random().toString(36).substr(2, 15)
    const ret = {
      jsapi_ticket: ticket,
      nonceStr,
      timestamp,
      url
    }
    let keys = Object.keys(ret)
    keys = keys.sort()
    const newArgs = {};
    keys.forEach((key) => {
      newArgs[key.toLowerCase()] = ret[key]
    })

    let string = ''
    Object.keys(newArgs).forEach((k) => {
      string += `&${k}=${newArgs[k]}`
    })
    string = string.substr(1)

    const crypto = require('crypto')
    const shasum = crypto.createHash('sha1')
    shasum.update(string)
    const signature = shasum.digest('hex')
    return {
      status: true, data: { timestamp, nonceStr, signature }
    }
  }

  async createQrTicket(strOrId, expire = 2592000) {
    const tokenData = await this.getToken()
    if (!tokenData.status) {
      console.error('无法获取 ticketJs - 获取 token 出错')
      return tokenData
    }
    const token = tokenData.data.access_token
    const url = `${this.opts.host}/cgi-bin/qrcode/create?access_token=${token}`
    const opts = {}

    if (typeof strOrId === 'number') {
      opts.action_info = { scene: { scene_id: strOrId } }

      if (expire > 0) {
        opts.expire_seconds = expire
        opts.action_name = 'QR_SCENE'
      } else {
        opts.action_name = 'QR_LIMIT_SCENE'
      }
    } else {
      opts.action_info = { scene: { scene_str: strOrId } }

      if (expire > 0) {
        opts.expire_seconds = expire
        opts.action_name = 'QR_STR_SCENE'
      } else {
        opts.action_name = 'QR_LIMIT_STR_SCENE'
      }
    }
    return this.fetchData(url, 'post', opts)
  }
}
