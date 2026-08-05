import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    // 동일한 페이지에서 쿼리 파라미터만 변경(예: 검색)될 때는 상단으로 스크롤하지 않음
    if (to.path === from.path) {
      return false
    }
    return { top: 0, behavior: 'smooth' }
  },
  routes: [
    {
      path: '/hw6',
      component: () => import('../views/hw6/Layout.vue'),
      children: [
        {
          path: '',
          name: 'hw6-home',
          component: () => import('../views/hw6/WeatherHomeView.vue'),
        },
        {
          path: 'forecast',
          name: 'hw6-forecast',
          component: () => import('../views/hw6/ForecastView.vue'),
        },
        {
          path: 'air-pollution',
          name: 'hw6-air-pollution',
          component: () => import('../views/hw6/AirPollutionView.vue'),
        },
        {
          path: 'about',
          name: 'hw6-about',
          component: () => import('../views/hw6/WeatherAboutView.vue'),
        },
        {
          path: 'weather/:cityId',
          name: 'hw6-detail',
          component: () => import('../views/hw6/WeatherDetailView.vue'),
        },
      ],
    },
    {
      path: '/',
      redirect: '/hw6',
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/hw6',
    },
  ],
})

router.beforeEach((to, from, next) => {
  document.title = '🌤️ Global Weather Station'
  next()
})

export default router
