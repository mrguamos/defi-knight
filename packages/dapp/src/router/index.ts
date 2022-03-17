import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '',
      name: 'HomePage',
      component: HomePage,
    },
    {
      path: '/marketplace',
      children: [
        {
          path: '',
          name: 'MarketHome',
          component: () =>
            import(
              /* webpackChunkName: "market-home" */ '../views/MarketHome.vue'
            ),
        },
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
        // {
        //   path: 'guilds',
        //   name: 'MarketGuilds',
        //   component: () =>
        //     import(
        //       /* webpackChunkName: "market-guilds" */ '../views/MarketGuilds.vue'
        //     ),
        // },
      ],
      name: 'MarketplacePage',
      component: () =>
        import(
          /* webpackChunkName: "marketplace" */ '../views/MarketplacePage.vue'
        ),
    },
    {
      path: '/inventory',
      children: [
        {
          path: '',
          name: 'InventoryHome',
          component: () =>
            import(
              /* webpackChunkName: "inventory-home" */ '../views/InventoryHome.vue'
            ),
        },
        {
          path: 'commanders',
          name: 'Commanders',
          component: () =>
            import(
              /* webpackChunkName: "commanders" */ '../views/CommandersPage.vue'
            ),
        },
        {
          path: 'knights',
          name: 'Knights',
          component: () =>
            import(
              /* webpackChunkName: "knights" */ '../views/KnightsPage.vue'
            ),
        },
        {
          path: 'guilds',
          name: 'Guilds',
          component: () =>
            import(/* webpackChunkName: "guilds" */ '../views/GuildsPage.vue'),
        },
      ],
      name: 'InventoryPage',
      component: () =>
        import(
          /* webpackChunkName: "inventory" */ '../views/InventoryPage.vue'
        ),
    },
  ],
})

export default router
