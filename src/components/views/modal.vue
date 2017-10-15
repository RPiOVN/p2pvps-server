<template>
  <!-- backdrop=static prevents dismissing the modal by clicking outside of it. -->
  <!-- keyboard=true allows dismissing of the modal with the Esc key -->
  <div class="modal appModal" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title">{{this.$store.state.modal.title}}</h4>
        </div>
        <div class="modal-body">
          <p>{{this.$store.state.modal.body}}</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" v-on:click="btn1Func" v-if="this.$store.state.modal.button1Show">{{this.$store.state.modal.button1Text}}</button>
          <button type="button" class="btn btn-primary" v-on:click="btn2Func" v-if="this.$store.state.modal.button2Show">{{this.$store.state.modal.button2Text}}</button>
        </div>
      </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
  </div><!-- /.modal -->
</template>

<script>
  export default {
    name: 'modalView',
    data () {
      return {
        msg: 'This is the rented devices view.'
      }
    },

    methods: {
      // Execute the function assigned to this button.
      btn1Func: function () {
        if (this.$store.state.modal.button1Func !== null) {
          this.$store.state.modal.button1Func()
        }
      },

      // Execute the function assigned to this button.
      btn2Func: function () {
        if (this.$store.state.modal.button2Func !== null) {
          this.$store.state.modal.button2Func()
        }
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
