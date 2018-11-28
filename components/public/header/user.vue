<template>
  <div class="m-user">
    <template v-if="user">
      欢迎您,<span class="username">{{ user }}</span>
      <nuxt-link to="/exit">退出</nuxt-link>
    </template>
    <template v-else>
      <nuxt-link 
        to="/login" 
        class="login">立即登录</nuxt-link>
      <nuxt-link 
        to="/register" 
        class="register">注册</nuxt-link>
    </template>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: '',
    }
  },
  async mounted() {//这里适用mounted异步获取 等页面加载完 这里用vuex也可以
    const {status,data:{user}} = await this.$axios.get('/users/getUser')//status和data都是axios里最外层对象 必须对应
    if(status===200){
      this.user=user
    }
  },
}
</script>

<style>

</style>
