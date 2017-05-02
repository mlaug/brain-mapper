<template>

  <section class="mapping">

    <div class="bulb"
         v-for="bulb in bulbs"
         draggable="true"
         ref="bulb"
         v-on:dragstart="startBulbDrag"
         v-on:dragover="dragBulbOver"
         v-on:dragenter="dragBulbEnter"
         v-on:dragleave="dragBulbLeave"
         v-on:drop="dropBulb"
         v-on:dragend="endBulbDrag">
      <header>

        <transition name="fade">
          <p v-if="showInput">
            <input
              type="text"
              name="title"
              placeholder="Give it a title"
              v-model="bulb.title"
              v-on:focusout="showInput = !showInput"
            />
          </p>
          <p
            v-if="!showInput"
            v-on:click="showInput = !showInput">
            {{bulb.title||"no title"}}
          </p>
        </transition>

      </header>
      {{ bulb.summary }}
    </div>

  </section>

</template>

<script>

  import * as d3 from 'd3'

  const app = {

    name: 'mapping',

    data: function () {
      return {
        bulbs: this.$store.state.bulbs,
        dragSrcEl: null,
        showInput: false
      }
    },

    mounted: function () {
      const self = this
      this.$store.dispatch("loadBulbs").then(() => {

      })
    },

    watch: {},

    methods: {

      startBulbDrag: (e) => {
        e.target.style.opacity = '0.4';
        this.dragSrcEl = e.target;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.target.innerHTML)
      },

      endBulbDrag: (e) => {
        e.target.style.opacity = '1';
        let cols = document.querySelectorAll('.bulb');
        [].forEach.call(cols, function (col) {
          col.classList.remove('over');
        });
      },

      dropBulb: (e) => {
        if (e.stopPropagation) {
          e.stopPropagation(); // stops the browser from redirecting.
        }

        if (this.dragSrcEl != e.target) {
          // Set the source column's HTML to the HTML of the columnwe dropped on.
          this.dragSrcEl.innerHTML = e.target.innerHTML;
          e.target.innerHTML = e.dataTransfer.getData('text/html');
        }

        return false
      },

      dragBulbEnter: (e) => {
        e.target.classList.add('over');
      },

      dragBulbLeave: (e) => {
        e.target.classList.remove('over');
      },

      dragBulbOver: (e) => {
        if (e.preventDefault) {
          e.preventDefault(); // Necessary. Allows us to drop.
        }

        e.dataTransfer.dropEffect = 'move';
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

  .bulb.over {
    border: 2px dashed #000;
  }

</style>
