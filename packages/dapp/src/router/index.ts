import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: HomePage,
    },
    {
      path: '/commanders',
      name: 'CommandersPage',
      component: () =>
        import(
          /* webpackChunkName: "commanders" */ '../views/CommandersPage.vue'
        ),
    },
    {
      path: '/knights',
      name: 'KnightsPage',
      component: () =>
        import(/* webpackChunkName: "knights" */ '../views/KnightsPage.vue'),
    },
    {
      path: '/guilds',
      name: 'GuildsPage',
      component: () =>
        import(/* webpackChunkName: "guilds" */ '../views/GuildsPage.vue'),
    },
    {
      path: '/marketplace',
      children: [
        {
          path: 'commanders',
          name: 'MarketCommanders',
          component: () =>
            import(
              /* webpackChunkName: "market-commanders" */ '../views/MarketCommanders.vue'
            ),
        },
        {
          path: 'knights',
          name: 'MarketKnights',
          component: () =>
            import(
              /* webpackChunkName: "market-knights" */ '../views/MarketKnights.vue'
            ),
        },
      ],
      name: 'MarketplacePage',
      component: () =>
        import(
          /* webpackChunkName: "marketplace" */ '../views/MarketplacePage.vue'
        ),
    },
  ],
})

export default router
