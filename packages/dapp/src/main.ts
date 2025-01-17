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
  faTag,
  faGift,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
;(async () => {
  library.add(
    faAngleDown,
    faDollarSign,
    faExternalLinkAlt,
    faAngleRight,
    faAngleLeft,
    faBars,
    faTag,
    faGift
  )
  const app = createApp(App)
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
