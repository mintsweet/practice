<template>
  <div>
    <van-swipe class="swipe" :autoplay="3000">
      <van-swipe-item class="red"></van-swipe-item>
      <van-swipe-item class="blue"></van-swipe-item>
      <van-swipe-item class="red"></van-swipe-item>
      <van-swipe-item class="blue"></van-swipe-item>
    </van-swipe>

    <c-topic :data="data" />
  </div>
</template>

<script>
import { Swipe, SwipeItem } from 'vant';
import Topic from '@/components/Topic';

export default {
  name: 'Home',

  components: {
    'van-swipe': Swipe,
    'van-swipe-item': SwipeItem,
    'c-topic': Topic,
  },

  data() {
    return {
      data: [
        {
          author: '青湛',
          date: '2小时前',
          tag: '精华',
          title: '这是一段标题'
        }
      ]
    };
  }
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
