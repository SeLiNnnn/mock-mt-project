import Router from 'koa-router'
import Redis from 'koa-redis'
import nodeMailer from 'nodemailer'
import User from '../dbs/models/users'
import Passport from './utils/passport'
import Email from '../dbs/config'
import axios from './utils/axios'
import { promises } from 'fs';
import { Promise } from 'mongoose';

let router = new Router({
  prefix: '/users'
})
let Store = new Redis().client
router.post('/signup', async ctx => {
  const {
    username,
    password,
    email,
    code
  } = ctx.request.body //这里使用es6解构复制写法 等于  ctx.request.body
  if (code) {
    const saveCode = await Store.hget(`nodemail:${username}`, 'code') // 关联用户名和验证码
    const saveExpire = await Store.hget(`nodemail:${username}`, 'expire')
    if (code === saveCode) {
      if (new Date().getTime() - saveExpire > 0) {
        ctx.body = {
          code: -1,
          msg: '验证码已过期，请重新尝试'
        }
        return false
      }
    } else {
      // 验证码不相等
      ctx.body = {
        code: -1,
        msg: '请填写正确的验证码'
      }
    }
  } else {
    // 如果没有填写验证码就把数据发上来了 拦截并返回
    ctx.body = {
      code: -1,
      msg: '请填写验证码'
    }
  }
  let user = await User.find({
    username
  })
  if (user.length) {
    ctx.body = {
      code: -1,
      msg: '已被注册'
    }
    return
  }
  // 写入数据库
  let nuser = await User.create({
    username,
    password,
    email
  })
  //检查是否成功写库
  if (nuser) {
    let res = await axios.post('/users/signin', {
      // 成功就自动登录
      username,
      password
    })
    if (res.data && res.data.code === 0) {
      ctx.body = {
        code: 0,
        msg: '注册成功',
        user: res.data.user
      }
    } else {
      ctx.body = {
        code: -1,
        msg: 'error'
      }
    }
  } else {
    // 写库失败
    ctx.body = {
      code: -1,
      msg: '注册失败'
    }
  }
})
// 登录
router.post('/signin', async (ctx, next) => {
  return Passport.authenticate('local', function (err, user, info, status) {
    // 调用passport-local
    if (err) {
      ctx.body = {
        code: -1,
        msg: err
      }
    } else {
      if (user) {
        ctx.body = {
          code: 0,
          msg: '登录成功',
          user
        }
        return ctx.login(user) // 登录的动作
      } else {
        ctx.body = {
          code: 1,
          msg: info
        }
      }
    }
  })(ctx, next) // 一定要传递 这是固定用法
})
// 验证码
router.post('/verify', async (ctx, next) => {
  let username = ctx.request.body.username // 因为只获取username所以就没有使用解构赋值
  const saveExpire = await Store.hget(`nodemail:${username}`, 'expire')
  if (saveExpire && new Date().getTime - saveExpire < 0) {
    // 如果在有限时间内再次发送验证 拦截请求
    ctx.body = {
      code: -1,
      msg: '验证请求过于频繁，1分钟内1次'
    }
    return false
  }
  let transporter = nodeMailer.createTransport({
    host: Email.smtp.host,
    port: 587,
    secure: false, // true监听465端口 false是监听其他端口
    auth: {
      user: Email.smtp.user,
      pass: Email.smtp.pass
    }
  })
  let ko = {
    code: Email.smtp.code(),
    expire: Email.smtp.expire(), // 设置过期时间
    email: ctx.request.body.email,
    user: ctx.request.body.username
  }
  let mailOptions = {
    from: `"认证邮件" <${Email.smtp.user}>`,
    to: ko.email, // 接收方
    subject: '《高仿美团实战》注册码',
    html: `您在《高仿美团实战》中注册，您的邀请码是${ko.code}`
  }
  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log('error')
    } else {
      Store.hmset(
        `nodemail:${ko.user}`,
        'code',
        ko.code,
        'expire',
        ko.expire,
        'email',
        ko.email
      )
    }
  })
  ctx.body = {
    code: 0,
    msg: '验证码已发送，可能会有延迟，有效期1分钟'
  }
})
//退出
router.get('/exit', async (ctx, next) => {
  await ctx.logout()
  if (!ctx.isAuthenticated()) {
    // 检查现在是不是登录状态
    ctx.body = {
      code: 0
    }
  } else {
    ctx.body = {
      code: -1 // 退出失败
    }
  }
})
router.get('/getUser', async ctx => {
  if (ctx.isAuthenticated()) {
    const {
      username,
      email
    } = ctx.session.passport.user
    ctx.body = {
      user: username,
      email
    }
  } else {
    // 不是登录状态
    ctx.body = {
      user: '',
      email: ''
    }
  }
})
export default router
