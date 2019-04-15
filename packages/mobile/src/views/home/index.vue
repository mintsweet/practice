<template>
  <div>
    <van-swipe class="swipe" :autoplay="3000">
      <van-swipe-item class="red"></van-swipe-item>
      <van-swipe-item class="blue"></van-swipe-item>
      <van-swipe-item class="red"></van-swipe-item>
      <van-swipe-item class="blue"></van-swipe-item>
    </van-swipe>
    <c-list :data="topics" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { Swipe, SwipeItem } from 'vant';
import List from '@/components/List';

export default {
  name: 'Home',

  components: {
    'van-swipe': Swipe,
    'van-swipe-item': SwipeItem,
    'c-list': List,
  },

  created() {
    this.getData();
  },

  computed: {
    ...mapGetters(['topics'])
  },

  methods: {
    getData() {
      this.$store.dispatch('getTopics');
    }
  },
};
</script>

<style lang="less" scoped>
.swipe {
  height: 150px;

  .red {
    background: red;
  }

  .blue {
    background: blue;
  }
}
</style>
