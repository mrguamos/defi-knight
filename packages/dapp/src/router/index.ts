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
      component: () =>
        import(/* webpackChunkName: "guilds" */ '../views/GuildsPage.vue'),
    },
    {
      path: '/guilds/manage/:id',
      name: 'ManageGuild',
      component: () =>
        import(/* webpackChunkName: "manage" */ '../views/ManageGuildPage.vue'),
    },
    {
      path: '/conquer',
      name: 'Conquer',
      component: () =>
        import(/* webpackChunkName: "conquer" */ '../views/ConquerPage.vue'),
    },
  ],
})

export default router
