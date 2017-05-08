<template>

  <section @click.stop="toggleShowSummaryInput" v-bind:class="{'bulb' : true, 'bulb-expand' : showSummaryInput}"
           v-bind:uuid="bulb.uuid">

    <header>
      <transition name="fade">
        <p v-if="showInput">
          <input
            v-bind:ref="'bulb-title-' + bulb.uuid"
            type="text"
            name="title"
            placeholder="Give it a title"
            v-model="bulb.title"
            v-focus="showInput"
            v-on:focusout="bulbTitleFocusOutHandler"
          />
        </p>
        <p
          v-if="!showInput"
          @click.stop="toggleShowInput">
          {{bulb.title || "no title"}}
        </p>
      </transition>
    </header>

    <transition name="fade">
      <p v-if="showSummaryInput">
          <textarea
            v-bind:ref="'bulb-summary-' + bulb.uuid"
            type="text"
            name="title"
            placeholder="Give it a summary"
            v-model="bulb.summary"
            v-focus="showSummaryInput"
            v-on:focusout="bulbSummaryFocusOutHandler">
            {{ bulb.summary }}
          </textarea>
      </p>
      <p
        v-if="!showSummaryInput"
        @click="toggleShowSummaryInput">
        {{ bulb.summary | truncate }}
      </p>
    </transition>

    <img v-if="showSummaryInput" v-bind:src="bulb.picture" width="100"/>

  </section>

</template>

<script>

  import Vue from 'vue'
  import {focus} from 'vue-focus';

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
        showInput: false,
        showSummaryInput: false,
        selectedBulb: this.$store.state.selectedBulb,
      }
    },

    methods: {

      toggleShowInput() {
        this.showInput = !this.showInput
      },

      toggleShowSummaryInput() {
        this.showSummaryInput = !this.showSummaryInput
      },

      bulbTitleFocusOutHandler() {
        this.update()
        this.toggleShowInput()
      },

      bulbSummaryFocusOutHandler() {
        this.update()
        this.toggleShowSummaryInput()
      },

      update() {
        this.$store.commit("updateBulb", this.bulb)
      },

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

</style>
