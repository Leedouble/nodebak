'use strict'

const Redis = require('ioredis')
let client = null
// redis服务
module.exports = class extends think.Service {
  constructor() {
    super()
    this.redisConf = think.config('redis')
    if (!client) {
      client = new Redis(this.redisConf)
      console.log('open redis')
    }
  }

  async set(key, value) {
    let res = {}
    try {
      res = this.getSuccess(await client.set(key, value))
    } catch (e) {
      res = this.getFail('redis', e.message)
    }
    return res
  }

  async get(key) {
    let res = {}
    try {
      res = this.getSuccess(await client.get(key))
    } catch (e) {
      res = this.getFail('redis', e.message)
    }
    return res
  }

  async incr(key) {
    let res = {}
    try {
      res = this.getSuccess(await client.incr(key))
    } catch (e) {
      res = this.getFail('redis', e.message)
    }
    return res
  }

  async decr(key) {
    let res = {}
    try {
      res = this.getSuccess(await client.decr(key))
    } catch (e) {
      res = this.getFail('redis', e.message)
    }
    return res
  }

  async mSet(obj) {
    let res = {}
    try {
      res = this.getSuccess(await client.mset(obj))
    } catch (e) {
      res = this.getFail('redis', e.message)
    }
    return res
  }

  async mGet(list) {
    let res = {}
    try {
      res = this.getSuccess(await client.mget(list))
    } catch (e) {
      res = this.getFail('redis', e.message)
    }
    return res
  }

  async lPush(key, list) {
    let res = {}
    try {
      res = this.getSuccess(await client.lpush(key, list))
    } catch (e) {
      res = this.getFail('redis', e.message)
    }
    return res
  }

  async lPop(key) {
    let res = {}
    try {
      res = this.getSuccess(await client.lpop(key))
    } catch (e) {
      res = this.getFail('redis', e.message)
    }
    return res
  }

  async lLen(key) {
    let res = {}
    try {
      res = this.getSuccess(await client.llen(key))
    } catch (e) {
      res = this.getFail('redis', e.message)
    }
    return res
  }

  async zAdd(key, list) {
    let res = {}
    try {
      res = this.getSuccess(await client.zadd(key, list))
    } catch (e) {
      res = this.getFail('redis', e.message)
    }
    return res
  }

  async zRem(key, member) {
    let res = {}
    try {
      res = this.getSuccess(await client.zrem(key, member))
    } catch (e) {
      res = this.getFail('redis', e.message)
    }
    return res
  }

  async zRange(key, start, end, opt = 'WITHSCORES') {
    let params = [key, start, end, opt]
    if (opt === false) {
      params = [key, start, end]
    }
    let res = {}
    try {
      res = this.getSuccess(await client.zrange(params))
    } catch (e) {
      res = this.getFail('redis', e.message)
    }
    return res
  }

  async zRangeByScore(key, start, end, opt = 'WITHSCORES', limit = 'LIMIT', offset, count) {
    let params = [key, start, end, opt, limit, offset, count]
    if (opt === false) {
      params = [key, start, end, limit, offset, count]
    }
    let res = {}
    try {
      res = this.getSuccess(await client.zrangebyscore(params))
    } catch (e) {
      res = this.getFail('redis', e.message)
    }
    return res
  }

  async zRevrangeByScore(key, start, end, opt = 'WITHSCORES', limit = 'LIMIT', offset, count) {
    let params = [key, start, end, opt, limit, offset, count]
    if (opt === false) {
      params = [key, start, end, limit, offset, count]
    }
    let res = {}
    try {
      res = this.getSuccess(await client.zrevrangebyscore(params))
    } catch (e) {
      res = this.getFail('redis', e.message)
    }
    return res
  }
}
