<template>
  <div>
    <nav>
      <div class="nav-wrapper">
        <ul id="nav-mobile" class="right hide-on-med-and-down">
          <li><a v-if="!authenticated" @click.stop="login()">Login</a></li>
          <li><a v-if="authenticated" @click.stop="logout()">Logout</a></li>
        </ul>
      </div>
    </nav>
    <div id="app">
      <router-view
        :auth="auth"
        :authenticated="authenticated">
      </router-view>
    </div>
  </div>
</template>

<script>

  import AuthService from './auth/AuthService'
  const auth = new AuthService()
  const {login, logout, authenticated, authNotifier} = auth

  export default {
    name: 'app',
    data () {
      authNotifier.on('authChange', authState => {
        this.authenticated = authState.authenticated
      })
      return {
        auth,
        authenticated
      }
    },
    methods: {
      login,
      logout
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
