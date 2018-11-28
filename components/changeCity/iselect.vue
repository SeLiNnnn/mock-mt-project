<template>
  <div class="m-iselect">
    <span class="name">按省份选择:</span>
    <el-select 
      v-model="pvalue" 
      placeholder="省份">
      <el-option
        v-for="item in province"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-select 
      v-model="cvalue" 
      :disabled="!city.length" 
      placeholder="城市">
      <el-option 
        v-for="item in city" 
        :key="item.value" 
        :label="item.label" 
        :value="item.value"/>
    </el-select>
    <el-autocomplete
      v-model="input"
      :fetch-suggestions="querySearchAsync"
      placeholder="请输入城市中文或拼音"
      @select="handleSelect"
    />
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data() {
    return {
      province:[],//当前选中省份列表
      pvalue:'',//当前选中省份
      city:[],//当前选中省份的城市列表
      cvalue:'',//当前选中城市
      input:'',
      cities:[],//全国城市列表
    }
  },
  watch:{
    pvalue:async function(newPvalue){
      let self=this;
      let {status,data:{city}}=await self.$axios.get(`/geo/province/${newPvalue}`)
      if(status===200){
        self.city=city.map(item=>{
          return {
            value:item.id,
            label:item.name
          }
        })
        self.cvalue=''
      }
    }
  },
  mounted:async function() {
    let self = this
    let {status,data:{province}} = await self.$axios.get('/geo/province')
    if(status===200){
      self.province = province.map(item => {
        return {
          value: item.id,
          label: item.name
        }
      })
    }
  },
  methods: {
    querySearchAsync:_.debounce(async function(query,cb){//用户输入的值 和回调 必须有这2个参数
      let self=this;
      if(self.cities.length){
        cb(self.cities.filter(item => item.value.indexOf(query)>-1))
      }else{//第一次加载
        let {status,data:{city}}=await self.$axios.get('/geo/city')
        if(status===200){
          self.cities=city.map(item=>{return {
            value:item.name
          }})
          cb(self.cities.filter(item => item.value.indexOf(query)>-1))
        }else{//请求失败直接返回空
          cb([])
        }
      }
    },200),
    handleSelect: function(item) {
      console.log(item.value);
      //let self = this
      // store.state.geo.position.city = item.value
      //localtion.href = 
      
    }
  }
}
</script>
<style lang="scss">
@import "@/assets/css/changecity/iselect.scss";
</style>

