import Router from 'koa-router'
import axios from './utils/axios'
import Poi from '../dbs/models/poi'

let router = new Router({
  prefix: '/search'
})

const sign = 'c6a3d36c8d43371e21550e1420f0d19e'

router.get('/top', async (ctx) => {
  // try {
  //   let top = await Poi.find({
  //     'name': new RegExp(ctx.query.input),
  //     city: ctx.query.city
  //   })
  //   ctx.body = {
  //     code: 0,
  //     top: top.map(item => {
  //       return {
  //         name: item.name,
  //         type: item.type
  //       }  
  //     }),
  //     type: top.length ? top[0].type : ''
  //   }
  // } catch (e) {
  //   ctx.body = {
  //     code: -1,
  //     top: []
  //   }
  // }
  let {
    status,
    data: {
      top
    }
  } = await axios.get(`http://cp-tools.cn/search/top`, {
    params: { //使用postman时需要输入params
      input: ctx.query.input, //get方式获取输入框的值使用query
      city: ctx.query.city,
      sign
    }
  })
  ctx.body = {
    top: status === 200 ? top : [] //在这里进行显示条数限制也可以
  }
})

router.get('/hotPlace', async (ctx) => {
  // let city = ctx.store ? ctx.store.geo.position.city : ctx.query.city
  // try {
  //   let result = await Poi.find({
  //     city,
  //     type: ctx.query.type || '景点'
  //   }).limit(10)
  //
  //   ctx.body = {
  //     code: 0,
  //     result: result.map(item => {
  //       return {
  //         name: item.name,
  //         type: item.type
  //       }
  //     })
  //   }
  // } catch (e) {
  //   ctx.body = {
  //     code: -1,
  //     result: []
  //   }
  // }
  let city = ctx.store ? ctx.store.geo.position.city : ctx.query.city //服务端和客户端共享 如果没有数据才去查询
  //console.log(ctx.store,city);//undefined '成都'因为此时吧不是客户端发的 而是postman发起的http请求

  let {
    status,
    data: {
      result
    }
  } = await axios.get(`http://cp-tools.cn/search/hotPlace`, {
    params: {
      sign,
      // city:encodeURIComponent(city)//服务端没有做编码的要求 所以这样查询不到
      city
    }
  })
  ctx.body = {
    result: status === 200 ? result : []
  }
})

router.get('/resultsByKeywords', async (ctx) => {
  const {
    city,
    keyword
  } = ctx.query;
  let {
    status,
    data: {
      count,
      pois
    }
  } = await axios.get('http://cp-tools.cn/search/resultsByKeywords', {
    params: {
      city,
      keyword,
      sign
    }
  })
  ctx.body = {
    count: status === 200 ? count : 0,
    pois: status === 200 ?
      pois : []
  }
})

export default router
