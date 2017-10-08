<template>
  <section class="content">
    <div class="container">

      <div class="row">
        <div class="col-md-12">
          <button type="button" class="btn btn-success" id="addNewDeviceBtn" style="margin-top: 10px; margin-bottom: 20px;">+ Add New Device</button>
        </div>
      </div>

      <hr style="border-top: 2px solid #000;">

    </div>
    <device-listing-item></device-listing-item>
  </section>
</template>

<script>
  import deviceListingItem from './ownedDevicesComponents/deviceListingItem.vue'
  
  export default {
    name: 'ownedDevices',
    data () {
      return {
        msg: 'This is the owned devices view.'
      }
    },
    components: {
      deviceListingItem
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
