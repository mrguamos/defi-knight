import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import router from './router'
import { createPinia } from 'pinia'
import { useWeb3 } from './stores/web3-store'
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
