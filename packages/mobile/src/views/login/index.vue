<template>
  <div class="container">
    <div class="logo">薄荷糖社区-Mints</div>
    <van-cell-group>
      <van-field
        v-model="form.email"
        clearable
        left-icon="friends"
        placeholder="请输入邮箱"
      />
      <van-field
        v-model="form.password"
        type="password"
        left-icon="lock"
        placeholder="请输入密码"
      />
    </van-cell-group>
    <div class="submit">
      <van-button
        type="primary"
        size="small"
        block
        @click="handleSubmit"
      >登录</van-button>
    </div>
    <div class="action">
      <router-link class="forget-pass" to="/forget_pass">忘记密码?</router-link>
      <router-link class="register" to="/register">注册</router-link>
    </div>
  </div>
</template>

<script>
import { Field, CellGroup, Button, Toast } from 'vant';
import { getUrlParams } from '@/utils/urlParams';

export default {
  name: 'Login',

  components: {
    'van-field': Field,
    'van-cell-group': CellGroup,
    'van-button': Button,
  },

  data() {
    return {
      form: {
        email: '',
        password: '',
      }
    };
  },

  methods: {
    async handleSubmit() {
      if (!this.form.email || !/^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/.test(this.form.email)) {
        Toast('请输入正确的邮箱');
        return;
      } else if (!this.form.password) {
        Toast('密码不能为空');
        return;
      }

      // 获取回跳链接
      const { redirect } = getUrlParams();
      const url = redirect ? unescape(redirect) : '/';

      await this.$store.dispatch('login', this.form);
      await this.$store.dispatch('getUser');
      this.$router.push(url);
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  height: 100vh;
  overflow: hidden;

  .logo {
    margin: 50px auto 20px;
    width: 100px;
    height: 100px;
    font-size: 0;
    background: url(../../assets/logo.png) no-repeat;
    background-size: cover;
  }

  .submit {
    margin: 20px auto 10px;
    padding: 0 20px;
  }

  .action {
    display: flex;
    justify-content: space-between;
    padding: 0 15px;

    a {
      font-size: 14px;
    }

    .forget-pass {
      color: #a1a1a1;
    }

    .register {
      color: #16982b;
    }
  }
}
</style>
