import unity1 from './com/Unity2019.vue'
import unity2 from './com/Unity2021.vue'
// import LoadScript from './lib'

const install = Vue => {
  // Vue.use(LoadScript)
  Vue.component('unity2019', unity1)
  Vue.component('unity2021', unity2)
}
unity.install = install
// export const Unity = unity
export default unity
