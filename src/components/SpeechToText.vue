<template>
  <i @click.stop="startRecording" class="small material-icons center">mic_none</i>
</template>

<script>

  import Vue from 'vue'

  const app = {

    name: 'speech-to-text',

    data: function () {
      return {}
    },

    methods: {
      startRecording(e){
        let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)()
        recognition.lang = 'en-US'
        recognition.interimResults = false
        recognition.maxAlternatives = 5
        recognition.start()

        let self = this

        recognition.onresult = function (event) {
          self.$emit("text", event.results[0][0].transcript)
          recognition.stop()
        };
      }
    }

  }

  export default app
</script>

<style>

</style>
