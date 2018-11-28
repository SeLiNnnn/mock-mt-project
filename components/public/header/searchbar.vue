<template>
  <div class="search-panel">
    <el-row class="m-header-searchbar">
      <el-col 
        :span="3" 
        class="left">
        <img
          src="//s0.meituan.net/bs/fe-web-meituan/e5eeaef/img/logo.png"
          alt="美团">
      </el-col>
      <el-col 
        :span="5" 
        class="center">
        <div class="wrapper">
          <el-input 
            v-model="search" 
            placeholder="搜索商家或地点"
            @focus="focus"
            @blur="blur"
            @input="input"
          />
          <button class="el-button el-button--primary"><i class="el-icon-search"/></button>
          <!-- 以下是聚焦不输入 -->
          <dl 
            v-if="isHotPlace"
            class="hotPlace">
            <dt>热门搜索</dt>
            <dd 
              v-for="(item,idx) in $store.state.home.hotPlace.slice(0,5)" 
              :key="idx">{{ item.name }}</dd>
          </dl>
          <!-- 以下是相关搜索 聚焦且输入 -->
          <dl 
            v-if="isSearchList"
            class="searchList">
            <dd 
              v-for="(item,idx) in searchList" 
              :key="idx">{{ item.name }}</dd>
          </dl>
        </div>
        <p class="suggest">
          <a 
            v-for="(item,idx) in $store.state.home.hotPlace.slice(0,5)" 
            :key="idx" 
            href="#">{{ item.name }}</a>
            <!-- <a href="#">北京欢乐谷</a>
          <a href="#">故宫珍宝馆</a>
          <a href="#">八达岭长城</a>
          <a href="#">尚隐·泉都市生活馆</a>
          <a href="#">北京野生动物园</a> -->
        </p> 
        <ul class="nav">
          <li>
            <nuxt-link 
              to="/" 
              class="takeout">美团外卖</nuxt-link>
          </li>
          <li>
            <nuxt-link 
              to="/" 
              class="movie">猫眼电影</nuxt-link>
          </li>
          <li>
            <nuxt-link 
              to="/" 
              class="hotel">美团酒店</nuxt-link>
          </li>
          <li>
            <nuxt-link 
              to="/" 
              class="apartment">民宿公寓</nuxt-link>
          </li>
          <li>
            <nuxt-link 
              to="/" 
              class="business">商家入驻</nuxt-link>
          </li>
        </ul> 
      </el-col>
      <el-col 
        :span="6" 
        class="right">
        <ul class="security">
          <li><i class="refund"/><p class="txt">随时退</p></li>
          <li><i class="single"/><p class="txt">不满意免单</p></li>
          <li><i class="overdue"/><p class="txt">过期退</p></li>
        </ul>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data () {
    return {
      search: '',//当前输入框是否有值
      isFocus: false,//聚焦状态
      // hotPlace:['故宫博物院','北京欢乐谷','故宫珍宝馆','八达岭长城','尚隐·泉都市生活馆'],//有接口后 直接替换这里的数据即可
      searchList:['火锅','烧烤','酸菜鱼','美蛙鱼头','纸包鱼'],
    }
  },
  computed: {
    isHotPlace: function() {
      return this.isFocus&&!this.search// 聚焦且值为空
    },
    isSearchList: function() {
      return this.isFocus&&this.search
    }
  },
  methods: {
    focus: function() {
      this.isFocus = true
    },
    blur: function() {
      let self = this
      setTimeout(function(){
        self.isFocus = false
      },200)// 做延迟 防止点击热门搜索时会先触发blur事件
    },
    // input: function() {// 留着后端有接口后直接调用
    //   // console.log('input')

    // }
    input:_.debounce(async function(){
      let self = this
      let city = self.$store.state.geo.position.city.replace('市','')//去掉市这个字
      self.searchList=[]
      let{status,data:{top}}=await self.$axios.get('/search/top',{
        params:{
          input:self.search,
          city
        }
      })
      self.searchList=top.slice(0,10)//截取10条 也可以在后端进行截取 返回时加上top.slice
    },300)//延迟函数
  }
}
</script>

<style>
</style>
