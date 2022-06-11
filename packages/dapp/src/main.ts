import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import router from './router'
import { createPinia } from 'pinia'
import { useWeb3 } from './stores/web3-store'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faAngleDown,
  faDollarSign,
  faExternalLinkAlt,
  faAngleRight,
  faAngleLeft,
  faBars,
  faGift,
  faEdit,
  faStar as fasStar,
  faUsers,
  faGem,
  faBan,
  faShoppingCart,
  faCoins,
  faSort,
  faCheck,
} from '@fortawesome/free-solid-svg-icons'
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import VueGtag from 'vue-gtag'
;(async () => {
  library.add(
    faAngleDown,
    faDollarSign,
    faExternalLinkAlt,
    faAngleRight,
    faAngleLeft,
    faBars,
    faGift,
    faEdit,
    fasStar,
    farStar,
    faUsers,
    faGem,
    faBan,
    faShoppingCart,
    faCoins,
    faSort,
    faCheck
  )

  const app = createApp(App)

  app.use(VueGtag, {
    config: { id: 'G-9JVRHW9TRZ' },
  })
  app.component('FontAwesomeIcon', FontAwesomeIcon)
  app.use(createPinia())
  app.use(router)
  try {
    const eth = useWeb3()
    await eth.connect()
  } catch (error) {
    console.log(error)
  } finally {
    app.mount('#app')
  }
})()
