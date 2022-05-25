import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '', redirect: '/buy' },
    {
      path: '/buy',
      name: 'buy',
      component: () => import('../views/MarketplaceView.vue'),
      children: [
        { path: '', redirect: '/buy/commanders' },
        {
          path: 'commanders',
          component: () => import('../views/CommandersBuyView.vue'),
        },
        {
          path: 'knights',
          component: () => import('../views/KnightsBuyView.vue'),
        },
        {
          path: 'guilds',
          component: () => import('../views/GuildsBuyView.vue'),
        },
      ],
    },
    {
      path: '/sell',
      component: () => import('../views/MarketplaceView.vue'),
      children: [
        { path: '', redirect: '/sell/commanders' },
        {
          path: 'commanders',
          component: () => import('../views/CommandersSellView.vue'),
        },
        {
          path: 'knights',
          component: () => import('../views/KnightsSellView.vue'),
        },
        {
          path: 'guilds',
          component: () => import('../views/GuildsSellView.vue'),
        },
      ],
    },
    {
      path: '/listings',
      component: () => import('../views/MarketplaceView.vue'),
      children: [
        { path: '', redirect: '/listings/commanders' },
        {
          path: 'commanders',
          component: () => import('../views/CommandersListingsView.vue'),
        },
        {
          path: 'knights',
          component: () => import('../views/KnightsListingsView.vue'),
        },
        {
          path: 'guilds',
          component: () => import('../views/GuildsListingsView.vue'),
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
