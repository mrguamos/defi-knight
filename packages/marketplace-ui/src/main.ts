import './index.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useWeb3 } from './stores/web3-store'
import App from './App.vue'

import router from './router'
;(async () => {
  const app = createApp(App)

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
