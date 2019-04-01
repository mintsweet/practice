import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    {
      path: '/login',
      component: () => import('@/views/login/index')
    },
    {
      path: '/',
      component: () => import('@/views/layout/index'),
      redirect: '/home',
      children: [
        {
          path: '/home',
          component: () => import('@/views/home/index'),
        },
        {
          path: '/tags',
          component: () => import('@/views/tags/index'),
        },
        {
          path: '/mine',
          component: () => import('@/views/mine/index'),
        },
      ]
    },
  ]
});
