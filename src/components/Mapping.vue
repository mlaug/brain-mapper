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
          <p v-if="showInput[bulb.uuid]">
            <input
              v-bind:ref="'bulb-title-' + bulb.uuid"
              type="text"
              name="title"
              placeholder="Give it a title"
              v-model="bulb.title"
              v-focus="showInput[bulb.uuid]"
              v-on:focusout="bulbTitleFocusOutHandler(bulb.uuid)"
            />
          </p>
          <p
            v-if="!showInput[bulb.uuid]"
            @click="toggleShowInput(bulb.uuid)">
            {{bulb.title||"no title"}}
          </p>
        </transition>

      </header>

      <transition name="fade">
        <p  v-if="showSummaryInput[bulb.uuid]">
          <textarea
            v-bind:ref="'bulb-summary-' + bulb.uuid"
            type="text"
            name="title"
            placeholder="Give it a summary"
            v-model="bulb.summary"
            v-focus="showSummaryInput[bulb.uuid]"
            v-on:focusout="bulbSummaryFocusOutHandler(bulb.uuid)"
          >{{ bulb.summary }}</textarea>
        </p>
        <p
          v-if="!showSummaryInput[bulb.uuid]"
          @click="toggleShowSummaryInput(bulb.uuid)">
          {{ bulb.summary }}
        </p>
      </transition>

    </div>

  </section>

</template>

<script>

  import Vue from 'vue'
  import { focus } from 'vue-focus';

  const app = {

    name: 'mapping',

    directives: { focus: focus },

    data: function () {
      return {
        bulbs: this.$store.state.bulbs,
        dragSrcEl: null,
        showInput: {},
        showSummaryInput: {}
      }
    },

    mounted: function () {
      const self = this
      this.$store.dispatch("loadBulbs").then(() => {

      })
    },

    watch: {},

    methods: {

      toggleShowInput(uuid) {
        this.showInput[uuid] = !this.showInput[uuid]
        this.showInput = Object.assign({}, this.showInput)
        this.$refs["bulb-title-" - uuid].focus()
      },

      bulbTitleFocusOutHandler(uuid) {
        this.update(uuid)
        this.toggleShowInput(uuid)
      },

      toggleShowSummaryInput(uuid) {
        this.showSummaryInput[uuid] = !this.showSummaryInput[uuid]
        this.showSummaryInput = Object.assign({}, this.showSummaryInput)
        this.$refs["bulb-summary-" - uuid].focus()
      },

      bulbSummaryFocusOutHandler(uuid) {
        this.update(uuid)
        this.toggleShowSummaryInput(uuid)
      },

      update(uuid) {
        this.bulbs.filter((bulb) => {
            return bulb.uuid === uuid
        }).map((bulb) => {
            this.$store.commit("updateBulb", bulb)
        })
      },

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

  .bulb textarea {
    background: white;
    margin: 0;
    width: 120px;
    height: 80px;
  }

</style>
