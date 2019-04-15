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
  margin-top: 46px;
}
</style>

