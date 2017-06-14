<template>

  <section v-bind:class="{'bulb' : true, 'bulb-expand' : showDetails}"
           v-bind:uuid="bulb.uuid">

    <div class="col s12 m4">
      <div class="card blue-grey darken-1">
        <div class="card-content white-text">

          <transition name="fade">
              <span class="card-title" v-if="showInputTitle">
                <input
                  v-bind:ref="'bulb-title-' + bulb.uuid"
                  type="text"
                  name="title"
                  placeholder="Give it a title"
                  v-model="bulb.title"
                  v-focus="showInputTitle"
                  v-on:focusout="bulbTitleFocusOutHandler"
                />
              </span>
            <span
              class="card-title"
              v-if="!showInputTitle"
              @click.stop="toggleInputTitle">
                {{bulb.title || "no title"}}
              </span>
          </transition>

          <div
            @click.stop="toggleDetails">
            <p>{{ bulb.summary | truncate }}</p>
          </div>

        </div>
        <div class="card-action">
          <a><i @click.stop="deleteBulb" class="small material-icons left">delete</i></a>
          <a><i @click.stop="toggleDetails" class="small material-icons right">mode_edit</i></a>
          <i>&nbsp;</i>
        </div>
      </div>
    </div>

    <div v-bind:id="'modal-' + bulb.uuid" class="modal modal-fixed-footer">
      <div class="modal-content">

        <div class="col s12 m4">
          <span class="card-title">
            <input
              v-bind:ref="'bulb-title-' + bulb.uuid"
              type="text"
              name="title"
              placeholder="Give it a title"
              v-model="bulb.title"
            />
          </span>
        </div>

        <div class="col s12">
          <bulb-editor ref="editor"
                       v-bind:content="bulb.summary"
                       v-bind:bulb="bulb"
                       v-on:update="updateSummaryFromEditor"
          />
        </div>

      </div>
      <div class="modal-footer">
        <div class="card-action">
          <a><i @click.stop="deleteBulb" class="small material-icons left modal-close">delete</i></a>
          <a>
            <speech-to-text v-on:text="appendVoiceText"></speech-to-text>
          </a>
          <a><i @click.stop="toggleDetails" class="small material-icons right modal-close">done</i></a>
          <i>&nbsp;</i>
        </div>
      </div>
    </div>

  </section>

</template>

<script>

  import Vue from 'vue'
  import {focus} from 'vue-focus';
  import uuid from '../../common/uuid'
  import ImageLoader from '../ImageLoader.vue'
  import SpeechToText from '../SpeechToText.vue'
  import BulbEditor from './Editor.vue'

  Vue.filter('truncate', function (text, stop, clamp) {
    stop = stop || 80
    clamp = clamp || '...'
    return text.slice(0, stop) + (stop < text.length ? clamp || '...' : '')
  })

  const app = {

    name: 'bulb',

    directives: {focus: focus},

    components: {
      ImageLoader, SpeechToText, BulbEditor
    },

    props: {
      bulb: {
        type: Object,
        required: true
      }
    },

    data: function () {

      return {
        showInputTitle: false,
        showDetails: false,
        highlightedText: null
      }

    },

    methods: {

      updateSummaryFromEditor(content) {
        this.bulb.summary = content
      },

      appendVoiceText(text) {
        this.bulb.summary += "\n" + text
      },

      toggleInputTitle() {
        this.showInputTitle = !this.showInputTitle
      },

      toggleDetails() {
        let self = this
        this.showDetails = !this.showDetails
        // FIXME: jquery should be importet properly and not just expected
        if (typeof $ === "function") {
          $('.modal').modal({
            dismissible: true,
            complete: () => {
              self.update()
            }
          })
          $('#modal-' + this.bulb.uuid).modal('open')
        }
      },

      bulbTitleFocusOutHandler() {
        this.update()
        this.toggleInputTitle()
      },

      update() {
        this.$store.commit("updateBulb", this.bulb)
      },

      deleteBulb() {
        this.$store.commit("deleteBulb", this.bulb)
        this.toggleDetails()
      },

      highlightLinks(e) {
        let uuidToHighlight = e.target.getAttribute("linkTo")
        let sectionToHighlight = document.querySelector('section[uuid="' + uuidToHighlight + '"]')
        sectionToHighlight.classList.add("link-highlight")
      },

      dehighlightLinks(e) {
        let uuidToHighlight = e.target.getAttribute("linkTo")
        let sectionToHighlight = document.querySelector('section[uuid="' + uuidToHighlight + '"]')
        sectionToHighlight.classList.remove("link-highlight")
      }

    },

  }

  export default app
</script>

<style>

  textarea.materialize-textarea {
    min-height: 10rem;
  }


</style>
