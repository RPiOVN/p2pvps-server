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
          <form>
            <div class="form-group">
              <label for="exampleInputEmail1">Email address</label>
              <input type="email" class="form-control" v-model="loginEmail" placeholder="Email">
            </div>
            <div class="form-group">
              <label for="exampleInputPassword1">Password</label>
              <input type="password" class="form-control" v-model="loginPassword" placeholder="Password">
            </div>
            
            <button type="button" class="btn btn-default" v-on:click="login()">Login</button>
          </form>
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
        msg: 'This is the rented devices view.',
        loginEmail: '',
        loginPassword: ''
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
      },

      // Allows the user to log into the system
      login: function () {
        // debugger

        // Validation
        if ((this.loginEmail === '') || (this.loginPassword === '')) {
          return
        }

        var obj = {
          email: this.loginEmail,
          password: this.loginPassword
        }

        $.post('/keystone/api/session/signin', obj, function (data) {
          // debugger
        })
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
