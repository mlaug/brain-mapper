<template>
  <div>loading</div>
</template>

<script>

  export default {
    name: 'callback',
    props: ['auth'],
    data () {
      this.auth.handleAuthentication()
      return {}
    }
  }

</script>
