<template>

  <section class="mapping">

    <div v-for="bulb in bulbs"
         draggable="true"
         ref="bulb"
         v-bind:uuid="bulb.uuid"
         v-on:dragstart="startBulbDrag"
         v-on:dragover="dragBulbOver"
         v-on:dragenter="dragBulbEnter"
         v-on:dragleave="dragBulbLeave"
         v-on:drop="dropBulb"
         v-on:dragend="endBulbDrag">

      <Bulb v-bind:bulb="bulb"/>

    </div>

  </section>

</template>

<script>

  import Vue from 'vue'
  import {focus} from 'vue-focus';
  import Bulb from './mapping/Bulb.vue'

  const app = {

    name: 'mapping',

    components: {
      Bulb
    },

    directives: {focus: focus},

    data: function () {
      return {
        bulbs: this.$store.state.bulbs,
      }
    },

    mounted: function () {
      const self = this
      this.$store.dispatch("loadBulbs").then(() => {

      })
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
        });
      },

      dropBulb(e) {
        if (e.stopPropagation) {
          e.stopPropagation(); // stops the browser from redirecting.
        }

        let uuidDroppedOn = e.target.getAttribute("uuid")
        let uuidDragged = e.dataTransfer.getData("plain/text")
        console.log(uuidDroppedOn, uuidDragged)

        let bulbIndexDroppedOn = this.bulbs.findIndex((bulb) => {
            return bulb.uuid === uuidDroppedOn
        })

        let bulbIndexDragged = this.bulbs.findIndex((bulb) => {
          return bulb.uuid === uuidDragged
        })

        let tmpBulb = Object.assign({}, this.bulbs[bulbIndexDroppedOn])
        console.log(tmpBulb)
        console.log(bulbIndexDragged, bulbIndexDroppedOn)
        this.bulbs[bulbIndexDroppedOn] = this.bulbs[bulbIndexDragged]
        this.bulbs[bulbIndexDragged] = tmpBulb

        // FIXME: it seems like the code above is not triggering a rerender?
        this.bulbs.sort()

        return false
      },

      dragBulbEnter: (e) => {
        e.target.classList.add('over')
      },

      dragBulbLeave: (e) => {
        e.target.classList.remove('over')
      },

      dragBulbOver: (e) => {
        if (e.preventDefault) {
          e.preventDefault() // Necessary. Allows us to drop.
        }

        e.dataTransfer.dropEffect = 'move'
      }
    },

  }

  export default app
</script>

<style>

  .mapping {
    height: 800px;
  }

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
