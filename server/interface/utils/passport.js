import passport from 'koa-passport'
import LocalStrategy from 'passport-local'
import UserModel from '../../dbs/models/users' // 查询用户表

passport.use(
  new LocalStrategy(async function(username, password, done) {
    let where = {
      username
    }
    let result = await UserModel.findOne(where)
    if (result != null) {
      if (result.password === password) {
        return done(null, result)
      } else {
        return done(null, false, '密码错误')
      }
    } else {
      return done(null, false, '用户不存在')
    }
  })
)
passport.serializeUser(function(user, done) {
  // 序列化
  done(null, user)
})
passport.deserializeUser(function(user, done) {
  // 反序列化 passport提供的封装好的API 进行session验证
  return done(null, user)
})
export default passport
