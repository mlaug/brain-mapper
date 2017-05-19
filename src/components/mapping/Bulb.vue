<template>

  <section v-bind:class="{'bulb' : true, 'bulb-expand' : showDetails}"
           v-bind:uuid="bulb.uuid">

    <header>
      <transition name="fade">
        <p v-if="showInputTitle">
          <input
            v-bind:ref="'bulb-title-' + bulb.uuid"
            type="text"
            name="title"
            placeholder="Give it a title"
            v-model="bulb.title"
            v-focus="showInputTitle"
            v-on:focusout="bulbTitleFocusOutHandler"
          />
        </p>
        <p
          v-if="!showInputTitle"
          @click.stop="toggleInputTitle">
          {{bulb.title || "no title"}}
        </p>
      </transition>
    </header>

    <transition name="fade">
      <div v-if="showDetails">

        <p @click.stop="toggleDetails">close</p>

        <p @click.stop="deleteBulb">delete</p>

        <textarea
          v-bind:ref="'bulb-summary-' + bulb.uuid"
          type="text"
          name="title"
          placeholder="Give it a summary"
          v-model="bulb.summary"
          v-on:focusout="update">
            {{ bulb.summary }}
          </textarea>

        <div class="references">
          <div class="reference"
               v-for="reference in bulb.references">
            {{ reference.raw }}
          </div>
          <div class="new-reference">
            <input type="text" v-model="newReference" placeholder="new reference"/>
            <span v-on:click.stop="addReference">save</span>
          </div>
        </div>
      </div>

      <div
        v-if="!showDetails"
        @click.stop="toggleDetails">

        <p @click="toggleDetails">details</p>

        <p>{{ bulb.summary | truncate }}</p>

        <div class="link blue"
             v-bind:linkTo="link.uuid"
             v-for="link in bulb.links"
             v-on:mouseover="highlightLinks"
             v-on:mouseout="dehighlightLinks"
        ></div>

      </div>

    </transition>

    <img v-if="showDetails" v-bind:src="bulb.picture" width="100"/>


  </section>

</template>

<script>

  import Vue from 'vue'
  import {focus} from 'vue-focus';
  import uuid from '../../common/uuid'

  Vue.filter('truncate', function (text, stop, clamp) {
    stop = stop || 80
    clamp = clamp || '...'
    return text.slice(0, stop) + (stop < text.length ? clamp || '...' : '')
  })

  const app = {

    name: 'bulb',

    directives: {focus: focus},

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

      toggleInputTitle() {
        this.showInputTitle = !this.showInputTitle
      },

      toggleDetails() {
        this.showDetails = !this.showDetails
      },

      bulbTitleFocusOutHandler() {
        this.update()
        this.toggleInputTitle()
      },

      addReference() {
        if (this.newReference.length > 0) {
          this.$store.commit("addReference",
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

  .bulb {
    height: 150px;
    width: 150px;
    float: left;
    border: 2px solid #666666;
    background-color: #ccc;
    margin: 8px;
    -webkit-border-radius: 10px;
    -ms-border-radius: 10px;
    -moz-border-radius: 10px;
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 3px #000;
    -ms-box-shadow: inset 0 0 3px #000;
    box-shadow: inset 0 0 3px #000;
    text-align: center;
    cursor: move;
  }

  .bulb-expand {
    position: absolute;
    height: 100%;
    width: 98%;
  }

  .bulb header {
    color: #fff;
    text-shadow: #000 0 1px;
    box-shadow: 5px;
    padding: 5px;
    background: -moz-linear-gradient(left center, rgb(0, 0, 0), rgb(79, 79, 79), rgb(21, 21, 21));
    background: -webkit-gradient(linear, left top, right top,
    color-stop(0, rgb(0, 0, 0)),
    color-stop(0.50, rgb(79, 79, 79)),
    color-stop(1, rgb(21, 21, 21)));
    background: -webkit-linear-gradient(left center, rgb(0, 0, 0), rgb(79, 79, 79), rgb(21, 21, 21));
    background: -ms-linear-gradient(left center, rgb(0, 0, 0), rgb(79, 79, 79), rgb(21, 21, 21));
    border-bottom: 1px solid #ddd;
    -webkit-border-top-left-radius: 10px;
    -moz-border-radius-topleft: 10px;
    -ms-border-radius-topleft: 10px;
    border-top-left-radius: 10px;
    -webkit-border-top-right-radius: 10px;
    -ms-border-top-right-radius: 10px;
    -moz-border-radius-topright: 10px;
    border-top-right-radius: 10px;
  }

  .bulb textarea {
    background: white;
    margin: 0;
  }

  .link {
    float: left;
    width: 20px;
    height: 20px;
    margin: 5px;
    border: 1px solid rgba(0, 0, 0, .2);
  }

  .blue {
    background: #13b4ff;
  }

  .purple {
    background: #ab3fdd;
  }

  .wine {
    background: #ae163e;
  }

  .link-highlight {
    background: #ae163e;
  }

</style>
