<template>
  <div>
    <div class="main">
      <router-view />
    </div>
    <van-tabbar v-model="active" :fixed="true" active-color="#52c41a">
      <van-tabbar-item icon="wap-home" to="/">主页</van-tabbar-item>
      <van-tabbar-item icon="apps-o" to="/tags">分类</van-tabbar-item>
      <van-tabbar-item icon="friends-o" to="/mine">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { Tabbar, TabbarItem } from 'vant';

export default {
  components: {
    'van-tabbar': Tabbar,
    'van-tabbar-item': TabbarItem
  },

  data () {
    return {
      active: 0
    };
  },
};
</script>

<style lang="less" scoped>
.main {
  padding-bottom: 50px;
}
</style>
