import Vue from 'vue'
import Router from 'vue-router'
import ActiveView from '@/components/ActiveView'
import marketplace from '@/components/views/marketplace.vue'
import dashboard from '@/components/views/dashboard'
import ownedDevices from '@/components/views/ownedDevices.vue'
import rentedDevices from '@/components/views/rentedDevices.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: dashboard,
      children: [
        {
          path: 'marketplace',
          component: marketplace,
          name: 'Marketplace',
          meta: {description: 'The Marketplace'}
        }, {
          path: 'ownedDevices',
          component: ownedDevices,
          name: 'Owned Devices',
          meta: {description: 'Owned Devices page'}
        }, {
          path: 'rentedDevices',
          component: rentedDevices,
          name: 'Rented Devices',
          meta: {description: 'Rented Devices page'}
        }
      ]
    },
    {
      path: '/market',
      name: 'ActiveView',
      component: ActiveView
    }
  ]
})
