<template>

  <section class="mapping">

    <div class="row">
      <div v-for="bulb in bulbs"
           draggable="true"
           ref="bulb"
           v-bind:uuid="bulb.uuid"
           v-on:dragstart="startBulbDrag"
           v-on:dragover.prevent="dragBulbOver"
           v-on:dragenter="dragBulbEnter"
           v-on:dragleave="dragBulbLeave"
           v-on:drop.stop="dropBulb"
           v-on:dragend="endBulbDrag">

        <Bulb v-bind:bulb="bulb"/>
      </div>
    </div>

  </section>

</template>

<script>

  import Vue from 'vue'
  import {focus} from 'vue-focus'
  import axios from 'axios'
  import Bulb from './mapping/Bulb.vue'

  const app = {

    name: 'mapping',

    components: {
      Bulb
    },

    directives: {focus: focus},

    data: function () {
      this.$store.dispatch("loadBulbs")
      return {
        bulbs: this.$store.state.bulbs,
      }
    },

    methods: {

      startBulbDrag: (e) => {
        e.target.style.opacity = '0.4'
        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.setData('plain/text', e.target.getAttribute("uuid"))
      },

      endBulbDrag: (e) => {
        e.target.style.opacity = '1'
        let cols = document.querySelectorAll('.bulb');
        [].forEach.call(cols, function (col) {
          col.classList.remove('over')
        })
      },

      dropBulb(e) {
        let uuidDroppedOn = e.target.getAttribute("uuid")
        let uuidDragged = e.dataTransfer.getData("plain/text")

        this.$store.commit("linkBulb", {
          from: uuidDragged,
          to: uuidDroppedOn
        })

        return false
      },

      dragBulbEnter: (e) => {
        e.target.classList.add('over')
      },

      dragBulbLeave: (e) => {
        e.target.classList.remove('over')
      },

      dragBulbOver: (e) => {
        e.dataTransfer.dropEffect = 'move'
      }
    },

  }

  export default app
</script>

<style>

  [draggable] {
    -moz-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    user-select: none;
    /* Required to make elements draggable in old WebKit */
    -khtml-user-drag: element;
    -webkit-user-drag: element;
  }

  .bulb.over {
    border: 2px dashed #000;
  }


</style>
