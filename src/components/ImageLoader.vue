<template>
  <section>
    <img v-if="!error && imageAvailable" @error="reloadImage" v-bind:src="src" width="100"/>
    <div v-if="!error && !imageAvailable" class="preloader-wrapper small active">
      <div class="spinner-layer spinner-green-only">
        <div class="circle-clipper left">
          <div class="circle"></div>
        </div>
        <div class="gap-patch">
          <div class="circle"></div>
        </div>
        <div class="circle-clipper right">
          <div class="circle"></div>
        </div>
      </div>
    </div>
    <i v-if="error" class="material-icons" title="Image could not be loaded">error</i>
  </section>
</template>

<script>

  import axios from 'axios'
  import Vue from 'vue'
  const app = {

    name: 'image-loader',

    props: {
      retries: {
        type: [String, Number],
        required: true
      },
      src: {
        type: String,
        required: true
      },
      retryInterval: {
        type: [String, Number],
        default: 2000
      }
    },

    data: function () {
      return {
        retryCount: this.retries,
        imageAvailable: true,
        error: false
      }
    },

    methods: {
      reloadImage() {
        this.retryCount = this.retryCount - 1
        this.imageAvailable = false

        const self = this
        axios.head(this.src).then(() => {
          self.imageAvailable = true
        }).catch(() => {
          if (self.retryCount >= 0)
            setTimeout(self.reloadImage, self.retryInterval)
          else
            self.error = true
        })
      }
    }

  }

  export default app
</script>

<style>

</style>
