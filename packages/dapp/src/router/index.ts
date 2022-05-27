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
      path: '/commanders',
      name: 'Commanders',
      component: () =>
        import(
          /* webpackChunkName: "commanders" */ '../views/CommandersPage.vue'
        ),
    },
    {
      path: '/knights',
      name: 'Knights',
      component: () =>
        import(/* webpackChunkName: "knights" */ '../views/KnightsPage.vue'),
    },
    {
      path: '/guilds',
      name: 'Guilds',
      children: [
        {
          path: '/manage',
          name: 'Manage Guild',
          component: () =>
            import(
              /* webpackChunkName: "manage-guild" */ '../views/ManageGuild.vue'
            ),
        },
      ],
      component: () =>
        import(/* webpackChunkName: "guilds" */ '../views/GuildsPage.vue'),
    },
  ],
})

export default router
