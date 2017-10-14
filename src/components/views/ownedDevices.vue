<template>
  <section class="content">
    <div class="container">
      <device-listing-item></device-listing-item>

      <hr style="border-top: 2px solid #000;">

      <div class="row">
        <div class="col-md-12">
          <button v-on:click="showForm = !showForm" type="button" class="btn btn-success" id="addNewDeviceBtn" style="margin-top: 10px; margin-bottom: 20px;">+ Add New Device</button>
        </div>
      </div>
      
      <transition name="fade">
        <div v-if="showForm" class="row addNewDeviceForm">
          <div class="col-sm-12">
            <form>
              <div class="form-group">
                <label for="deviceName">Device Name</label>
                <input type="text" class="form-control" id="deviceName" placeholder="">
              </div>
              <div class="form-group">
                <label for="deviceDescription">Description</label>
                <textarea class="form-control" id="deviceDescription" rows="6"></textarea>
              </div>

              <button type="button" class="btn btn-default" id="submitButton">Submit</button>
            </form>
          </div>
        </div>
      </transition>
      
    </div>

  </section>
</template>

<script>
  import deviceListingItem from './ownedDevicesComponents/deviceListingItem.vue'
  
  export default {
    name: 'ownedDevices',
    data () {
      return {
        msg: 'This is the owned devices view.',
        showForm: false
      }
    },
    components: {
      deviceListingItem
    },
    methods: {
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
