import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '', redirect: '/buy' },
    {
      path: '/buy',
      name: 'buy',
      component: () => import('../views/BuyView.vue'),
      children: [
        { path: '', redirect: '/buy/commanders' },
        {
          path: 'commanders',
          component: () => import('../views/CommandersView.vue'),
        },
        {
          path: 'knights',
          component: () => import('../views/KnightsView.vue'),
        },
        {
          path: 'guilds',
          component: () => import('../views/GuildsView.vue'),
        },
      ],
    },
    {
      path: '/sell',
      component: () => import('../views/SellView.vue'),
      children: [
        { path: '', redirect: '/sell/commanders' },
        {
          path: 'commanders',
          component: () => import('../views/CommandersView.vue'),
        },
        {
          path: 'knights',
          component: () => import('../views/KnightsView.vue'),
        },
        {
          path: 'guilds',
          component: () => import('../views/GuildsView.vue'),
        },
      ],
    },
    {
      path: '/listings',
      component: () => import('../views/ListingsView.vue'),
      children: [
        { path: '', redirect: '/listings/commanders' },
        {
          path: 'commanders',
          component: () => import('../views/CommandersView.vue'),
        },
        {
          path: 'knights',
          component: () => import('../views/KnightsView.vue'),
        },
        {
          path: 'guilds',
          component: () => import('../views/GuildsView.vue'),
        },
      ],
    },
    {
      path: '/shop',
      component: () => import('../views/ShopView.vue'),
    },
  ],
})

export default router
