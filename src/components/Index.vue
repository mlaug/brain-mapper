<template>
  <section class="brain" v-if="authenticated">

    <section class="header">

      <h1>Bulbs</h1>

      <div class="row">
        <div class="col s10">
          <input class="new-bulb"
                 autocomplete="off"
                 placeholder="What did you discover"
                 v-model="newBulb"
                 v-on:focus="showMedia = !showMedia"
                 v-on:focusout="showMedia = !showMedia"
                 @keyup="search"
                 @keyup.enter="addBulb">
        </div>
        <div class="col s2">
          <transition name="fade">
            <section class="media" ref="media" v-if="showMedia">
              <video ref="video" style="width:50px;height:50px"/>
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
        media: {
          src: null,
          stream: null,
          hasUserMedia: false
        },

        newBulb: ''

      }
    },

    watch: {

      showMedia: {
        handler: function (show) {
          if (show) {
            this.video = this.$refs.video
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia
            if (navigator.getUserMedia) {
              navigator.getUserMedia({video: true}, (stream) => {
                this.media.stream = stream
                this.$refs.video.src = window.URL.createObjectURL(stream)
              }, (error) => {
                console.log(error)
              })
            }
          }
          else {
            this.media.stream.getTracks().forEach(track => track.stop());
            this.$refs.video.src = null;
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
          summary: self.newBulb
        }).then((bulb) => {

          let canvas = document.createElement("canvas")
          canvas.width = 600
          canvas.height = 600
          let ctx = canvas.getContext("2d")
          ctx.drawImage(self.$refs.video, 0, 0, canvas.width, canvas.height)

          let dataUrl = canvas.toDataURL("image/png")
          let blobBin = atob(dataUrl.split(',')[1]);
          let array = [];
          for (let i = 0; i < blobBin.length; i++) {
            array.push(blobBin.charCodeAt(i));
          }

          let file = new Blob([new Uint8Array(array)], {type: 'image/png'});
          let data = new FormData();
          data.append('file', file, bulb.uuid + ".png");
          axios.post(process.env.media.image.url, data)
            .then(() => {
              console.log("upload ok")
              bulb.picture = process.env.media.image.url + "/" + bulb.uuid + ".png"
              self.$store.commit("updateBulb", bulb)
            })
            .catch(() => console.log("upload fail"))

        })

        this.newBulb = ''

      }

    },
  }

  export default app
</script>

<style>

</style>
