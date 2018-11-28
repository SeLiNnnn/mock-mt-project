export default {
  dbs: 'mongodb://127.0.0.1:27017/dbs',
  redis: {
    get host() {
      return '127.0.0.1'
    },
    get port() {
      return 6379 // 默认端口
    }
  },
  smtp: {
    get host() {
      return 'smtp.qq.com' // qq邮箱的主机
    },
    get user() {
      return '475665128@qq.com'
    },
    get pass() {
      return 'qmvqanmxivatbgcj' // 邮箱授权码 需保密
    },
    get code() {
      return () => {
        return Math.random()
          .toString(16)
          .slice(2, 6)
          .toUpperCase() // 给邮箱发送验证码 随机数转16位进制拆分再转大写
      }
    },
    get expire() {
      return () => {
        return new Date().getTime() + 60 * 60 * 1000 // 有限时间1分钟 每次生成的验证码不相同
      }
    }
  }
}
