import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store';

Vue.use(VueRouter);

const router = new VueRouter({
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
          meta: {
            requiredLogin: true,
          },
        },
      ]
    },
    {
      path: '/detail/:id',
      component: () => import('@/views/detail/index'),
    },
  ]
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiredLogin && !store.getters.token) {
    next(`/login?redirect=${to.path}`);
  } else {
    next();
  }
});

export default router;
