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

    <div id="modal1" class="modal modal-fixed-footer">
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
              <textarea
                class="materialize-textarea"
                v-bind:ref="'bulb-summary-' + bulb.uuid"
                type="text"
                name="title"
                placeholder="Give it a summary"
                v-model="bulb.summary"
                v-on:select="markText">
                {{ bulb.summary }}
              </textarea>
        </div>

        <div class="col s12">
          <div class="collection">
            <div class="row" v-for="reference in bulb.references">
              <div class="col s10">
                <a class="reference collection-item">
                  {{ reference.reference }}
                </a>
              </div>
              <div class="col s2">
                <image-loader class="materialboxed" v-bind:src="'/references/' + reference.uuid + '.png'" retries=3 />
              </div>
            </div>

            <div class="row">
              <div class="col s10">
                <i class="collection-item">
                  <input type="url" v-model="newReference" placeholder="new reference" class="validate" />
                </i>
              </div>
              <div class="col s2">
                <a
                  v-on:click.stop="addReference"
                  class="btn-floating btn-small waves-effect waves-light red right"><i
                  class="material-icons">add</i></a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <div class="card-action">
          <a><i @click.stop="deleteBulb" class="small material-icons left modal-close">delete</i></a>
          <a><i @click.stop="takePicture" class="small material-icons center">videocam</i></a>
          <a><i @click.stop="recordAudio" class="small material-icons center">settings_voice</i></a>
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

  Vue.filter('truncate', function (text, stop, clamp) {
    stop = stop || 80
    clamp = clamp || '...'
    return text.slice(0, stop) + (stop < text.length ? clamp || '...' : '')
  })

  const app = {

    name: 'bulb',

    directives: {focus: focus},

    components: {
      ImageLoader
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
        newReference: ''
      }
    },

    methods: {

      markText(e) {
        console.log(e)
      },

      toggleInputTitle() {
        this.showInputTitle = !this.showInputTitle
      },

      toggleDetails() {
        let self = this
        this.showDetails = !this.showDetails
        // FIXME: jquery should be importet properly and not just expected
        if ( typeof $ === "function" ) {
          $('.modal').modal({
            dismissible: true,
            complete: () => {
              self.update()
            }
          })
          $('#modal1').modal('open')
        }
      },

      bulbTitleFocusOutHandler() {
        this.update()
        this.toggleInputTitle()
      },

      addReference() {
        if (this.newReference.length > 0) {
          this.$store.dispatch("addReference",
            {
              reference: this.newReference,
              bulb: this.bulb
            }
          )
          this.newReference = ''
        }
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

</style>
