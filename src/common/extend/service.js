// add service function
import Axios from 'axios'

const serviceDomain = think.config('server')

const serializeUrl = function(query, type = '?') {
  let urlText = ''
  if (typeof query === 'object') {
    Object.keys(query).forEach((key) => {
      if (typeof query[key] !== 'undefined' && query[key] !== 'undefined' && query[key] !== '') {
        if (type === '?') {
          urlText += `&${key}=${encodeURIComponent(query[key])}`
        } else {
          urlText += `/${key}/${encodeURIComponent(query[key])}`
        }
      }
    })
  }
  return urlText.replace(/^&/, '?')
}

module.exports = {
  getSuccess(data) {
    return { status: true, msg: { code: 2000, msg: '请求成功' }, data }
  },
  getFail(type, msg) {
    const code = think.config('errno')[type] || 4000
    return { status: false, msg: { code, msg }, data: [] }
  },
  httpGet(url, opt = {}, fields = []) {
    if (url.indexOf('/service') === 0) {
      url = url.replace('/service', serviceDomain)
    } else if (url.indexOf('http') !== 0) {
      url = serviceDomain + url
    }
    console.log(url)
    console.log(opt)
    if (fields && fields.length > 0) {
      opt.needFields = fields.join(',')
    }
    return Axios.get(url + (opt ? serializeUrl(opt) : '')).then((res) => {
      if (!res.status) {
        console.error('服务返回错误')
        console.error(res)
      }
      return res.data
    }, (res) => {
      console.error('请求出错了')
      console.error(res)
      const code = think.config('errno').http
      return { status: false, msg: { code, msg: '网络暂时出现问题' }, data: {} }
    })
  },
  httpPost(url, data = {}, fields = []) {
    if (url.indexOf('/service') === 0) {
      url = url.replace('/service', serviceDomain)
    } else if (url.indexOf('http') !== 0) {
      url = serviceDomain + url
    }
    Object.keys(data).forEach((key) => {
      if (data[key] === '' || typeof data[key] === 'undefined') {
        delete data[key]
      } else if (data[key] === null) {
        data[key] = ''
      }
    })
    if (fields && fields.length > 0) {
      data.needFields = fields.join(',')
    }
    return Axios.post(url, data).then((res) => {
      if (!res.status) {
        console.error('服务返回错误')
        console.error(res)
      }
      return res.data
    }, (res) => {
      console.error('请求出错了')
      console.error(res)
      const code = think.config('errno').http
      return { status: false, msg: { code, msg: '网络暂时出现问题' }, data: {} }
    })
  }
}
