<template>
  <div class=""/>
</template>

<script>
export default {
  layout: 'blank',
  middleware: async (ctx) => {//查nuxt工作流中的middlerware 用中间件是因为到达退出页面时需要自动执行而不需要用户再点击按钮
    let {status,data}=await ctx.$axios.get('/users/exit')
    if(status===200&&data&&data.code===0){
      window.location.href='/'
    }
  }
}
</script>
