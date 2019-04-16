<template>
  <div class="detail">
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { NavBar } from 'vant';
import VueMarkdown from 'vue-markdown';

export default {
  name: 'Detail',

  components: {
    'van-nav-bar': NavBar,
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

<style lang="less">
.markdown {
  margin-top: 60px;
  padding: 0 10px;
  font-size: 14px;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-top: 24px;
    margin-bottom: 16px;
    font-weight: 600;
    line-height: 1.25;
  }

  h1,
  h2,
  h3 {
    padding-left: 10px;
    border-left: 4px solid #16982b;
  }

  h1 {
    font-size: 1.4em;
  }

  h2 {
    font-size: 1.2em;
  }

  h3 {
    font-size: 1em;
  }

  h4 {
    font-size: .875em;
  }

  h5 {
    font-size: .85em;
  }

  h6 {
    font-size: .6em;
  }

  ul,
  ol {
    padding-left: 2em;
  }

  ol > li {
    list-style-type: decimal;
  }

  ul > li {
    list-style-type: disc;
  }

  p {
    margin: 10px 0;
  }

  a {
    color: #16982b;
  }

  table {
    display: block;
    width: 100%;
    overflow: auto;

    tr {
      background-color: #f5f5f5;
      border-top: 1px solid #e6e6e6;

      &:nth-child(2n) {
        background-color: #f1f1f1;
      }
    }

    th,
    td {
      padding: 6px 13px;
      border: 1px solid #e6e6e6;
    }
  }

  blockquote {
    padding: 0 1em;
    color: #8a8a8a;
    border-left: 4px solid #e6e6e6;
  }
}
</style>

