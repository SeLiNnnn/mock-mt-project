<template>
  <div class="m-menu">
    <dl 
      class="nav" 
      @mouseleave="mouseleave">
      <dt>全部分类</dt>
      <dd 
        v-for="(item,idx) in $store.state.home.menu" 
        :key="idx" 
        @mouseenter="enter">
        <i :class="item.type"/>{{ item.name }}<span class="arrow"/>
      </dd>
    </dl>
    <div 
      v-if="kind" 
      class="detail" 
      @mouseenter="sover" 
      @mouseleave="sout">
      <template v-for="(item,idx) in curdetail.child">
        <h4 :key="idx">{{ item.title }}</h4>
        <span 
          v-for="v in item.child" 
          :key="v">{{ v }}</span>
      </template>
      
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      kind: '',//默认为空 表示鼠标悬浮在哪个列表
      menu: [
        {
          type: "food", //每个列表的图标不同 所以动态绑定不同类名
          name: "美食",
          child: [{
            title: '美食',
            child: ['代金券','甜点','饮品','火锅','自助餐','小吃快餐']//span循环这里的child
          }]
        },
        {
          type: "takeout",
          name: "外卖",
          child: [{
            title: '外卖',
            child: ['美团外卖']
          }]
        },
        {
          type: "hotel",
          name: "酒店",
          child: [{
            title: '酒店',
            child :['经济型','舒适/三星','高档/四星','豪华/五星']
          }]
        },
        {
          type: "food",
          name: "美食"
        },
        {
          type: "takeout",
          name: "外卖"
        },
        {
          type: "hotel",
          name: "酒店"
        },
      ]
    }
  },
  computed: {
    curdetail: function() {
      //console.log(this.menu.filter((item) => item.type===this.kind)[0]);
      return this.$store.state.home.menu.filter((item) => item.type===this.kind)[0]// 这里输出的是一个对象 对象里的第0个才是child 而curdetail.child也就是child里的child才是name
    }
  },
  methods: {
    mouseleave: function() {
      let self = this
      self._timer=setTimeout(function(){
        self.kind = ''
      },150)
    },
    enter: function(e) {
      this.kind = e.target.querySelector('i').className//hover时获取当前i标签的class名
      //console.log(this.kind); // food takeout
    },
    sover: function () {
      clearTimeout(this._timer)// 当鼠标移至右侧菜单时移除定时器 防止kind被清除掉
    },
    sout: function(){
      this.kind = ''//当鼠标也没有移至右侧时彻底清除kind
    }
  }
};
</script>

<style>
</style>
