<template>
  <section class="brain" v-if="authenticated">

    <section class="header">

      <h1>Bulbs</h1>

      <div class="row">
        <div class="col s12">
          <input class="new-bulb"
                 autocomplete="off"
                 placeholder="What did you discover"
                 v-model="newBulb"
                 v-on:focus="showMedia = !showMedia"
                 v-on:focusout="showMedia = !showMedia"
                 @keyup="search"
                 @keyup.enter="addBulb">
        </div>
      </div>

      <div class="row">
        <div class="col s12">
          <transition name="fade">
            <section class="media" ref="media" v-show="showMedia">
              <div id="camera"></div>
            </section>
          </transition>
        </div>
      </div>

    </section>

    <mapping></mapping>

  </section>
</template>

<script>

  import Mapping from './Mapping'
  import Webcam from 'webcamjs'
  import axios from 'axios'

  const app = {

    name: 'brain',

    components: {
      Mapping
    },

    props: ['authenticated', 'auth'],

    data: function () {
      return {
        bulbs: this.$store.state.bulbs,
        showMedia: false,
        newBulb: ''
      }
    },

    watch: {

      showMedia: {
        handler: function (show) {
          if (show) {
            Webcam.set({
              width: 200,
              height: 200,
              image_format: "png"
            })
            Webcam.attach('#camera')
          }
          else {
            Webcam.reset()
          }
        }
      }

    },

    methods: {

      search: function () {

      },

      addBulb: function () {

        if (this.newBulb.length == 0) {
          return
        }

        var self = this
        this.$store.dispatch("addBulb", {
          title: self.newBulb,
          summary: ""
        }).then((bulb) => {

          Webcam.snap(function (dataUrl) {
              console.log(dataUrl)
            let blobBin = atob(dataUrl.split(',')[1])
            let array = [];
            for (let i = 0; i < blobBin.length; i++) {
              array.push(blobBin.charCodeAt(i))
            }

            let file = new Blob([new Uint8Array(array)], {type: 'image/png'})
            let data = new FormData()
            data.append('file', file, bulb.uuid + ".png")
            axios.post(process.env.media.image.url, data)
              .then(() => {
                console.log("upload ok")
                bulb.picture = process.env.media.image.url + "/" + bulb.uuid + ".png"
                self.$store.commit("updateBulb", bulb)
              })
              .catch(() => console.log("upload fail"))
          })

        })

        this.newBulb = ''

      }

    },
  }

  export default app
</script>

<style>

</style>
