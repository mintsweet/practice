<template>
  <div class="page">
    <van-nav-bar
      class="header"
      :title="detail.topic && detail.topic.title"
      left-arrow
      :fixed="true"
    />
    <van-markdown
      class="markdown"
      :source="detail.topic && detail.topic.content"
    />
    <div class="author">
      <div class="title">作者</div>
      <div class="content">
        <div class="avatar">
          <img
            :src="detail.author && detail.author.avatar"
            :alt="detail.author && detail.author.nickname"
          >
        </div>
        <div class="detail">
          <div class="nickname">
            <strong>{{ detail.author && detail.author.nickname }}</strong>
            <span>
              <van-icon name="location" />{{ detail.author && detail.author.location || '未知' }}
            </span>
          </div>
          <div class="signature">
            {{ (detail.author && detail.author.signature) || '这个用户什么都没有留下' }}
          </div>
        </div>
      </div>
    </div>
    <div class="comment">
      <div class="title">评论</div>
      <div class="content">
        <div class="item" v-for="item in detail.replies" :key="item.id">
          <div class="author-info">
            <div class="avatar">
              <img
                :src="item.author && item.author.avatar"
                :alt="item.author && item.author.nickname"
              >
            </div>
            <div class="nickname">{{ item.author && item.author.nickname }}</div>
            <div class="date">{{ item.create_at_ago }}</div>
          </div>
          <div class="detail">{{ item.content }}</div>
          <div class="other"><van-icon name="youzan-shield" />{{ item.ups.length }}</div>
        </div>
      </div>
    </div>
    <div class="info">
      <div class="action">
        <van-icon :name="detail.like ? 'like' : 'like-o'" />
          ·
        <van-icon :name="detail.collect ? 'star' : 'star-o'" />
      </div>
      <div class="count">
        {{ detail.topic && detail.topic.like_count }} 喜欢
         ·
        {{ detail.topic && detail.topic.collect_count }} 收藏
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { NavBar, Icon } from 'vant';
import VueMarkdown from 'vue-markdown';

export default {
  name: 'Detail',

  components: {
    'van-nav-bar': NavBar,
    'van-icon': Icon,
    'van-markdown': VueMarkdown,
  },

  created() {
    this.getData();
  },

  computed: {
    ...mapGetters(['detail'])
  },

  methods: {
    async getData() {
      this.$store.dispatch('getTopic', this.$route.params.id);
    },
  },
};
</script>

<style lang="less" scoped>
@import '../../styles/variable.less';

.page {
  padding: 40px 10px 60px;

  .info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 0 10px;
    height: 36px;
    background: #fff;
    box-shadow: 0 -1px 10px rgba(0, 0, 0, .1);

    .action {
      color: @gray;
    }

    .count {
      font-size: 12px;
      color: @gray;
    }
  }

  .author,
  .comment {
    .title {
      position: relative;
      font-size: 18px;
      line-height: 2;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        width: 40px;
        height: 4px;
        background: @theme-color;
      }
    }

    .content {
      margin-top: 10px;
    }
  }

  .author {
    margin: 20px 0;
    padding-top: 10px;
    border-top: 1px dashed @light-gray;

    .content {
      display: flex;
    }

    .avatar {
      flex: 0 0 50px;
      margin-right: 20px;
      width: 50px;
      height: 50px;
      border-radius: 50%;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }

    .nickname {
      strong {
        font-size: 16px;
      }

      span {
        margin-left: 6px;
        font-size: 13px;
        color: @gray;
      }
    }

    .signature {
      margin-top: 8px;
      font-size: 12px;
      color: @gray;
    }
  }

  .comment {
    .item {
      padding: 10px 0;
      border-bottom: 1px dashed @light-gray;
    }

    .author-info {
      display: flex;
      align-items: center;
    }

    .avatar {
      flex: 0 0 20px;
      width: 20px;
      height: 20px;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .nickname {
      flex: auto;
      margin-left: 5px;
      font-size: 14px;
      color: @dark-gray;
    }

    .date {
      flex: 0 0 100px;
      text-align: right;
      font-size: 12px;
      color: @gray;
    }

    .detail {
      padding: 10px 25px 0;
      font-size: 14px;
    }

    .other {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      font-size: 13px;
      color: @dark-gray;

      .van-icon {
        margin-right: 4px;
      }
    }
  }
}
</style>

