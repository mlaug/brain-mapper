<template>
  <section>
    <img v-if="imageAvailable" @error="reloadImage" v-bind:src="src"/>
    <div v-if="!imageAvailable" class="preloader-wrapper small active">
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
      }
    },

    data: function () {
      return {
        retryCount: this.retries,
        imageAvailable: true
      }
    },

    methods: {
      reloadImage(e) {
        const self = this
        self.imageAvailable = false
        axios.head(this.src).then(() => {
          self.imageAvailable = true
        }).catch(() => {
          self.retryCount = self.retryCount - 1
          if (self.retryCount > 0)
            setTimeout(self.reloadImage, 2000)
        })
      }
    }

  }

  export default app
</script>

<style>

</style>
