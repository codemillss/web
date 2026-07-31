import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
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
  ],
})

export default router
