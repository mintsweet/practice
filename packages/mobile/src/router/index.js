import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    {
      path: '/',
      component: () => import('@/views/home'),
    },
    {
      path: '/tags',
      component: () => import('@/views/tags'),
    },
    {
      path: '/mine',
      component: () => import('@/views/mine')
    }
  ]
});
