<template>
  <section class="brain">

    <section class="header">

      <h1>Bulbs</h1>

      <input class="new-bulb"
             autocomplete="off"
             placeholder="What did you discover"
             v-model="newBulb"
             v-on:focus="showMedia = !showMedia"
             v-on:focusout="showMedia = !showMedia"
             @keyup="search"
             @keyup.enter="addBulb">

      <transition name="fade">
        <section class="media" ref="media" v-if="showMedia">
          <video ref="video" style="width:50px;height:50px"/>
        </section>
      </transition>

    </section>

    <mapping></mapping>

  </section>
</template>

<script>

  import Mapping from './Mapping'
  import * as d3 from 'd3'

  const app = {

    name: 'brain',

    components: {
      Mapping
    },

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
        }).then((uuid) => {

          let canvas = document.createElement("canvas")
          canvas.width = 600
          canvas.height = 600
          let ctx = canvas.getContext("2d")
          ctx.drawImage(self.$refs.video, 0, 0, canvas.width, canvas.height)

          let defs = d3.select("defs")
          defs.append("pattern")
            .attr("id", "bulbBackground-" + uuid)
            .attr("x", 0)
            .attr("y", 0)
            .attr("patternContentUnits", "objectBoundingBox")
            .attr("height", "100%")
            .attr("width", "100%")
            .append("image")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 1)
            .attr("height", 1)
            .attr("xlink:href", canvas.toDataURL("image/png"))

        })

        this.newBulb = ''

      }

    },
  }

  export default app
</script>

<style>
  html,
  body {
    margin: 0;
    padding: 0;
  }

  button {
    margin: 0;
    padding: 0;
    border: 0;
    background: none;
    font-size: 100%;
    vertical-align: baseline;
    font-family: inherit;
    font-weight: inherit;
    color: inherit;
    -webkit-brainearance: none;
    brainearance: none;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font: 14px 'Helvetica Neue', Helvetica, Arial, sans-serif;
    line-height: 1.4em;
    background: #f5f5f5;
    color: #4d4d4d;
    min-width: 230px;
    max-width: 850px;
    margin: 0 auto;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-weight: 300;
  }

  :focus {
    outline: 0;
  }

  .hidden {
    display: none;
  }

  .brain {
    background: #fff;
    margin: 130px 0 40px 0;
    position: relative;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2),
    0 25px 50px 0 rgba(0, 0, 0, 0.1);
  }

  .brain input::-webkit-input-placeholder {
    font-style: italic;
    font-weight: 300;
    color: #e6e6e6;
  }

  .brain input::-moz-placeholder {
    font-style: italic;
    font-weight: 300;
    color: #e6e6e6;
  }

  .brain input::input-placeholder {
    font-style: italic;
    font-weight: 300;
    color: #e6e6e6;
  }

  .brain h1 {
    position: absolute;
    top: -155px;
    width: 100%;
    font-size: 100px;
    font-weight: 100;
    text-align: center;
    color: rgba(175, 47, 47, 0.15);
    -webkit-text-rendering: optimizeLegibility;
    -moz-text-rendering: optimizeLegibility;
    text-rendering: optimizeLegibility;
  }

  .new-bulb {
    position: relative;
    margin: 0px;
    width: 80%;
    font-size: 24px;
    font-family: inherit;
    font-weight: inherit;
    line-height: 1.4em;
    border: 0;
    color: inherit;
    padding: 6px;
    border: 1px solid #999;
    box-shadow: inset 0 -1px 5px 0 rgba(0, 0, 0, 0.2);
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .new-bulb {
    padding: 16px 16px 16px 60px;
    border: none;
    background: rgba(0, 0, 0, 0.003);
    box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03);
  }

  textarea {
    margin-top: 10px;
    margin-left: 50px;
    width: 80%;
    height: 100px;
    -moz-border-bottom-colors: none;
    -moz-border-left-colors: none;
    -moz-border-right-colors: none;
    -moz-border-top-colors: none;
    background: none repeat scroll 0 0 rgba(0, 0, 0, 0.003);
    box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03);
    color: #555555;
    font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
    font-size: 1em;
    line-height: 1.4em;
    padding: 5px 8px;
    transition: background-color 0.2s ease 0s;
  }


  .media {
    position: relative;
    float: right;
    margin: 0px;
  }

  label[for='toggle-all'] {
    display: none;
  }

  .footer {
    color: #777;
    padding: 10px 15px;
    height: 20px;
    text-align: center;
    border-top: 1px solid #e6e6e6;
  }

  .footer:before {
    content: '';
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 50px;
    overflow: hidden;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2),
    0 8px 0 -3px #f6f6f6,
    0 9px 1px -3px rgba(0, 0, 0, 0.2),
    0 16px 0 -6px #f6f6f6,
    0 17px 2px -6px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 430px) {
    .footer {
      height: 50px;
    }

    .filters {
      bottom: 10px;
    }
  }

</style>
