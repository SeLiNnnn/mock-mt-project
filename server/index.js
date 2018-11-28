import Koa from 'koa'
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')

import mongoose from 'mongoose'
import bodyParser from 'koa-bodyparser' // 处理post请求
import session from 'koa-generic-session' // 处理cookie
import Redis from 'koa-redis'
import json from 'koa-json' // 格式化json
import dbConfig from './dbs/config'
import passport from './interface/utils/passport'
import users from './interface/users'
import geo from './interface/geo'
import search from './interface/search'

const app = new Koa()
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

app.keys = ['mt', 'keyskeys']
app.proxy = true
app.use(
  session({//cookie中可以查看到这里设置的前缀
    key: 'mt',
    prefix: 'mt:uid',
    store: new Redis()
  })
)
app.use(
  bodyParser({
    extendTypes: ['json', 'form', 'text'] // 处理数据
  })
)
app.use(json())

// 连接数据库
mongoose.connect(
  dbConfig.dbs,
  {
    useNewUrlParser: true
  }
)
// 处理passport和session相关配置
app.use(passport.initialize())
app.use(passport.session())

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(app.env === 'production')

async function start() {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)

  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }
  // 挂载路由 必须放在这之前
  app.use(users.routes()).use(users.allowedMethods())
  app.use(geo.routes()).use(geo.allowedMethods())
  app.use(search.routes()).use(search.allowedMethods())

  app.use(ctx => {
    ctx.status = 200 // koa defaults to 404 when it sees that status is unset

    return new Promise((resolve, reject) => {
      ctx.res.on('close', resolve)
      ctx.res.on('finish', resolve)
      nuxt.render(ctx.req, ctx.res, promise => {
        // nuxt.render passes a rejected promise into callback on error.
        promise.then(resolve).catch(reject)
      })
    })
  })

  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

start()
