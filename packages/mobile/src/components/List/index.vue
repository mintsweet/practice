<template>
  <ul class="topic-list">
    <li class="item" v-for="item in data" :key="item.id">
      <router-link :to="`/detail/${item.id}`">
        <div class="info">
          {{ item.author.nickname }} · {{ item.create_at | moment('from') }} · {{ item.tabName }}
        </div>
        <div class="title">{{ item.title }}</div>
        <div class="bottom">
          <div class="box">
            <van-icon class="icon" name="like" />
            <span>{{ item.like_count }}</span>
          </div>
          <div class="box">
            <van-icon class="icon" name="comment" />
            <span>{{ item.reply_count }}</span>
          </div>
        </div>
      </router-link>
    </li>
  </ul>
</template>

<script>
import { Icon } from 'vant';

export default {
  name: 'Topic',

  components: {
    'van-icon': Icon
  },

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
    color: #333;
  }

  .bottom {
    font-size: 0;

    .box {
      display: inline-block;
      padding: 0 6px;
      width: 30px;
      height: 18px;
      line-height: 18px;
      font-size: 12px;
      color: #b2bac2;
      border: 1px solid #edeeef;
      border-left: 0;
      border-radius: 1px;

      span {
        margin-left: 4px;
        vertical-align: middle;
      }

      .icon {
        vertical-align: middle;
      }

      &:first-child {
        border-left: 1px solid #edeeef;
      }
    }
  }
}
</style>
