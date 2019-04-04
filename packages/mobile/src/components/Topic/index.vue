<template>
  <ul class="topic-list">
    <li class="item" v-for="item in data" :key="item.id">
      <div class="info">{{ item.author }} · {{ item.date }} · {{ item.tag }}</div>
      <div class="title">{{ item.title }}</div>
      <div class="bottom">
        <span class="box">33</span>
        <span class="box">22</span>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'Topic',

  props: {
    data: {
      type: Array,
      default: () => [],
    },
  }
};
</script>

<style lang="less" scoped>
.topic-list {
  .item {
    padding: 10px 15px;
    border-bottom: 1px solid rgba(178, 186, 194, .15);
  }

  .info {
    font-size: 12px;
    color: #b2bac2;
  }

  .title {
    margin: 5px 0 10px;
    font-size: 15px;
    font-weight: 600;
  }

  .bottom {
    font-size: 0;

    .box {
      display: inline-block;
      padding: 0 10px;
      width: 30px;
      height: 18px;
      line-height: 18px;
      font-size: 12px;
      color: #b2bac2;
      border: 1px solid #edeeef;
      border-left: 0;
      border-radius: 1px;

      &:first-child {
        border-left: 1px solid #edeeef;
      }
    }
  }
}
</style>
