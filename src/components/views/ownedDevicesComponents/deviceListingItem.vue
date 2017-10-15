<template>
  
  <div class="container">
    <div id="deviceList">
      <!-- Device list will populate this div -->

      <!-- Template scaffold -->
      <div class="row deviceScaffold" style="margin: 10px; border-radius: 25px; border: 1px solid black;">
        <h3>Device ID: 
          <span class="deviceId">{{ device._id }}</span> 
          <span class="pull-right">
            <button class="btn btn-danger deviceDelete" style="margin-right: 30px;" v-on:click="showDeleteModal()">Delete</button>
          </span>
        </h3>
        <div class="col-md-4 col-sm-6 col-xs-12">
          <div class="nice-border">
            <h4><strong>Status:</strong> <span style="color: red;" class="deviceConnectionStatus">Not Connected</span></h4>
            <button class="btn btn-primary btn-sm center-block" disabled>Submit to Market</button>
          </div>
          <div class="nice-border">
            <h4><u>Device Specs:</u></h4>
            <ul>
              <li><strong>Memory:</strong> <span class="deviceMemory">{{ device.memory }}</span></li>
              <li><strong>Disk Space:</strong> <span class="deviceDiskSpace">{{ device.diskSpace }}</span></li>
              <li><strong>Internet Speed:</strong> <span class="deviceInternetSpeed">{{ device.internetSpeed }}</span></li>
              <li><strong>Processor: <span class="deviceProcessor">{{ device.processor }}</span></strong></li>
            </ul>
          </div>
        </div>

        <div class="col-md-4 col-sm-6 col-xs-12">
          <div class="nice-border" style="min-height: 230px;">
            <div>
              <h4><u>Name:</u> <span class="deviceName">{{ device.deviceName }}</span></h4>
              <h4><u>Description:</u></h4>
              <div class="deviceDescription">
                <p>{{ device.deviceDesc }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-4 col-sm-6 col-xs-12">
          <div class="nice-border" style="max-height: 300px; overflow-y: scroll; min-height: 230px;">
            <div>
              <h4><u>Reviews:</u></h4>
              <div class="deviceReviews">
                <p>3/5 - Randy</p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent odio enim, tempus et venenatis non, sagittis sit amet augue. 
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'deviceListingItem',
    data () {
      return {
        msg: 'This is a listed device item.'
      }
    },
    props: ['device'],
    methods: {
      showDeleteModal: function () {
        // debugger

        var modalState = this.$store.state.modal

        // Display a modal to the user
        modalState = {
          show: true,
          title: 'Are you sure?',
          body: 'Are you sure you want to delete this device entry?',
          button1Text: 'No',
          button1Func: function () { $('.appModal').modal('hide') },
          button1Show: true,
          button2Text: 'Yes',
          button2Func: this.deleteDevice,
          button2Show: true
        }

        this.$store.commit('UPDATE_MODAL', modalState)
      },

      deleteDevice: function () {
        // debugger

        // Hide the modal
        $('.appModal').modal('hide')

        // Delete the device on the server
        this.$store.dispatch('deleteDevice', this.device._id)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .nice-border {
    border: 1px solid black;
    border-radius: 25px;
    padding: 5px;
    margin-top: 5px;
    margin-bottom: 5px;
  }
  .nice-border ul {
    list-style: none;
  }
  .nice-border button {
    margin-top: 5px;
    margin-bottom: 5px;
  }
  .nice-border p {
    font-size: 16px;
  }
</style>
