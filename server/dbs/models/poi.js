import mongoose from 'mongoose'
const Schema = mongoose.Schema
const Poi = new Schema({
  name: {//景点名称
    type: String,
  },
  province: {
    type: String,
  },
  city:{
    type:String
  },
  county:{//区县
    type:String
  },
  areaCode:{//区号
    type:String
  },
  tel:{
    type:String
  },
  area:{//商圈地区
    type:String
  },
  addr:{//所在地址
    type:String
  },
  type:{//类型：景点，餐饮，美食
    type:String
  },
  module:{//子分类
    type:String
  },
  longitude:{//经度
    type:Number
  },
  latitude:{//纬度
    type:Number
  }

})

export default mongoose.model('Poi', Poi)
