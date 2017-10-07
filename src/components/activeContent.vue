<template>
  <div style="border: 1px solid green;">
    <p v-if="{{ dashboard }}">The dashboard is being shown</p>
    <dashboard></dashboard>
  </div>
</template>

<script>
  import dashboard from './views/dashboard'
  import ownedDevices from './views/ownedDevices.vue'
  import rentedDevices from './views/rentedDevices.vue'
  import marketplace from './views/marketplace.vue'
  
  export default {
    name: 'active-content',
    data () {
      return {
        msg: 'This is the active content.'
      }
    },
    components: {
      dashboard,
      ownedDevices,
      rentedDevices,
      marketplace
    },
    computed: {
      dashboard() {
        return store.menuState.dashboard
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  /*
  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
  */
</style>
