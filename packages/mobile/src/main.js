import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import moment from 'moment';
import 'moment/locale/zh-cn';

Vue.config.productionTip = false;

Vue.use(require('vue-moment'), {
  moment
});

// eslint-disable-next-line
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
});
