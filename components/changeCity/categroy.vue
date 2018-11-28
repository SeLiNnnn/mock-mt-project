<template>
  <div class="">
    <dl class="m-categroy">
      <dt>按拼音首字母选择：</dt>
      <dd
        v-for="item in list"
        :key="item">
        <a :href="'#city-'+item">{{ item }}</a>
      </dd>
    </dl>
    <dl
      v-for="item in block"
      :key="item.title"
      class="m-categroy-section">
      <dt :id="'city-'+item.title">{{ item.title }}</dt>
      <dd>
        <span
          v-for="c in item.city"
          :key="c">{{ c }}</span>
      </dd>
    </dl>
  </div>
</template>

<script>
import pyjs from 'js-pinyin'
export default {
  data(){
    return {
      list:'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
      // block:[{title:'',city:''}] 类似这种结构
      block:[]
    }
  },
  async mounted() {//这里的seo价值不大 可以直接异步获取而不使用ssr
    let self=this;
    let blocks=[]
    let {status,data:{city}}=await self.$axios.get('/geo/city')
    if(status===200){
      let p 
      let c
      let d={}
      city.forEach(item => {
        p=pyjs.getFullChars(item.name).toLocaleLowerCase().slice(0,1)//转小写 分割 只获取首字母
        c=p.charCodeAt(0)//拿到对应的code值
        if(c>96&&c<123){//a-z:97-122 A-Z:65-90 在96-123范围内说明是小写
          if(!d[p]){//如果不存在就声明一个数组
            d[p]=[]
          }
          d[p].push(item.name)
        }
      })
      for(let [k,v] of Object.entries(d)){//对象转数组 循环遍历d对象
        blocks.push({
          title:k.toUpperCase(),//转大写
          city:v//d中存的结果
        })
      }
      //排序
      blocks.sort((a,b)=>a.title.charCodeAt(0)-b.title.charCodeAt(0))
      self.block=blocks//临时数组blocks传给data里的block
    }
  },
}
</script>

<style lang="scss">
  @import "@/assets/css/changeCity/categroy.scss";
</style>
