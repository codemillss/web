import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  },
  routes: [
    {
      path: '/practice-ref',
      name: 'practice-ref',
      component: () => import('../components/practices/basic/PracticeRef.vue'),
    },
    {
      path: '/practice-reactive',
      name: 'practice-reactive',
      component: () => import('../components/practices/basic/PracticeReactive.vue'),
    },
    {
      path: '/practice-computed',
      name: 'practice-computed',
      component: () => import('../components/practices/basic/PracticeComputed.vue'),
    },
    {
      path: '/practice-watch',
      name: 'practice-watch',
      component: () => import('../components/practices/basic/PracticeWatch.vue'),
    },
    {
      path: '/practice-watch-multiple',
      name: 'practice-watch-multiple',
      component: () => import('../components/practices/basic/PracticeWatchMultiple.vue'),
    },
    {
      path: '/practice-watch-ref-deep',
      name: 'practice-watch-ref-deep',
      component: () => import('../components/practices/basic/PracticeWatchRefDeep.vue'),
    },
    {
      path: '/practice-watch-reactive',
      name: 'practice-watch-reactive',
      component: () => import('../components/practices/basic/PracticeWatchReactive.vue'),
    },
    {
      path: '/practice-watch-effect',
      name: 'practice-watch-effect',
      component: () => import('../components/practices/basic/PracticeWatchEffect.vue'),
    },
    {
      path: '/practice-lifecycle',
      name: 'practice-lifecycle',
      component: () => import('../components/practices/basic/PracticeLifecycle.vue'),
    },
    {
      path: '/practice-props-emits',
      name: 'practice-props-emits',
      component: () => import('../components/practices/basic/PropsEmitsParent.vue'),
    },
    {
      path: '/practice-slot-default',
      name: 'practice-slot-default',
      component: () => import('../components/practices/basic/SlotDefaultParent.vue'),
    },
    {
      path: '/practice-slot-named',
      name: 'practice-slot-named',
      component: () => import('../components/practices/basic/SlotNamedParent.vue'),
    },
    {
      path: '/practice-slot-scoped',
      name: 'practice-slot-scoped',
      component: () => import('../components/practices/basic/SlotScopedParent.vue'),
    },
    {
      path: '/practice-store',
      name: 'practice-store',
      component: () => import('../components/practices/basic/PracticeStore.vue'),
    },
    {
      path: '/practice-axios-weather',
      name: 'practice-axios-weather',
      component: () => import('../components/practices/basic/PracticeAxiosWeather.vue'),
    },
    {
      path: '/practice-axios-crud',
      name: 'practice-axios-crud',
      component: () => import('../components/practices/basic/PracticeAxiosCrud.vue'),
    },
    {
      path: '/practice-element-form',
      name: 'practice-element-form',
      component: () => import('../components/practices/basic/PracticeElementForm.vue'),
    },
    {
      path: '/practice-element-commerce',
      name: 'practice-element-commerce',
      component: () => import('../components/practices/basic/PracticeElementCommerce.vue'),
    },
    {
      path: '/practice-element-feedback',
      name: 'practice-element-feedback',
      component: () => import('../components/practices/basic/PracticeElementFeedback.vue'),
    },
    {
      path: '/sampleone',
      name: 'sampleone',
      component: () => import('../components/practices/basic/SampleOne.vue'),
    },
    {
      path: '/sampletwo',
      name: 'sampletwo',
      component: () => import('../components/practices/basic/SampleTwo.vue'),
    },
    {
      path: '/samplethree',
      name: 'samplethree',
      component: () => import('../components/practices/basic/SampleThree.vue'),
    },
    {
      path: '/samplefour',
      name: 'samplefour',
      component: () => import('../components/practices/basic/SampleFour.vue'),
    },
    {
      path: '/samplefive',
      name: 'samplefive',
      component: () => import('../components/practices/basic/SampleFive.vue'),
    },
    {
      path: '/samplesix',
      name: 'samplesix',
      component: () => import('../components/practices/basic/SampleSix.vue'),
    },
    {
      path: '/sampleseven',
      name: 'sampleseven',
      component: () => import('../components/practices/basic/SampleSeven.vue'),
    },
    {
      path: '/sampleeight',
      name: 'sampleeight',
      component: () => import('../components/practices/basic/SampleEight.vue'),
    },
    {
      path: '/samplenine',
      name: 'samplenine',
      component: () => import('../components/practices/basic/SampleNine.vue'),
    },
    {
      path: '/sampleten',
      name: 'sampleten',
      component: () => import('../components/practices/basic/SampleTen.vue'),
    },
    {
      path: '/sampleeleven',
      name: 'sampleeleven',
      component: () => import('../components/practices/basic/SampleEleven.vue'),
    },
    {
      path: '/sampletwelve',
      name: 'sampletwelve',
      component: () => import('../components/practices/basic/SampleTwelve.vue'),
    },
    {
      path: '/samplethirteen',
      name: 'samplethirteen',
      component: () => import('../components/practices/basic/SampleThirteen.vue'),
    },
    {
      path: '/samplefourteen',
      name: 'samplefourteen',
      component: () => import('../components/practices/basic/SampleFourteen.vue'),
    },
    {
      path: '/samplefifteen',
      name: 'samplefifteen',
      component: () => import('../components/practices/basic/SampleFifteen.vue'),
    },
    {
      path: '/weather-mockup',
      name: 'weather-mockup',
      component: () => import('../components/practices/basic/Weather_Mockup.vue'),
    },
    {
      path: '/samplesixteen',
      name: 'samplesixteen',
      component: () => import('../components/practices/basic/SampleSixteen.vue'),
    },
    {
      path: '/weather-composition',
      name: 'weather-composition',
      component: () => import('../components/practices/basic/Weather_Composition.vue'),
    },
    {
      path: '/hw3',
      name: 'hw3-component',
      component: () => import('../components/hw3/WeatherParent.vue'),
    },
    {
      path: '/hw4',
      component: () => import('../views/hw4/Layout.vue'),
      children: [
        {
          path: '',
          name: 'hw4-home',
          component: () => import('../views/hw4/WeatherHomeView.vue'),
          meta: { title: '날씨 대시보드' }
        },
        {
          path: 'about',
          name: 'hw4-about',
          component: () => import('../views/hw4/WeatherAboutView.vue'),
          meta: { title: '서비스 소개' }
        },
        {
          path: 'weather/:cityId',
          name: 'hw4-detail',
          component: () => import('../views/hw4/WeatherDetailView.vue'),
          meta: { title: '상세 날씨 정보' }
        },
        {
          path: ':pathMatch(.*)*',
          name: 'hw4-notfound',
          component: () => import('../views/hw4/NotFoundView.vue'),
          meta: { title: '페이지를 찾을 수 없습니다' }
        }
      ]
    },
    {
      path: '/hw5',
      component: () => import('../views/hw5/Layout.vue'),
      children: [
        {
          path: '',
          name: 'hw5-home',
          component: () => import('../views/hw5/WeatherHomeView.vue'),
        },
        {
          path: 'about',
          name: 'hw5-about',
          component: () => import('../views/hw5/WeatherAboutView.vue'),
        },
        {
          path: 'weather/:cityId',
          name: 'hw5-detail',
          component: () => import('../views/hw5/WeatherDetailView.vue'),
        }
      ]
    },
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
        }
      ]
    },
    {
      path: '/',
      redirect: '/hw5'
    }
  ],
})

// 간단한 가짜 MOCK DB (상세 페이지 가드용 - hw4)
const VALID_CITIES = ['city_01', 'city_02', 'city_03']

router.beforeEach((to, from, next) => {
  // 1. 동적 브라우저 타이틀 변경
  if (to.meta.title) {
    document.title = `${to.meta.title} | 과제 4`
  } else {
    document.title = 'Skala Vue'
  }

  // 2. hw4 상세 페이지 접근 가드 로직
  if (to.name === 'hw4-detail') {
    const cityId = to.params.cityId
    if (!VALID_CITIES.includes(cityId)) {
      alert('존재하지 않는 도시 정보입니다. (Router Guard 차단)')
      return next('/hw4') // 잘못된 접근 시 대시보드로 강제 이동
    }
  }

  next()
})

export default router
