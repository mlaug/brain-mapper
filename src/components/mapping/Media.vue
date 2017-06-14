<template>

  <!-- this is weird, that I have to stop this here -->
  <section @click.stop="">

    <div class="fab">

      <div class="row">
        <div class="input-field col s8">
          <input type="url" v-model="newReference" placeholder="new reference" class="validate"/>
        </div>
        <div class="col s4">
          <a v-on:click.stop="addReference"
             class="btn-floating btn-small waves-effect waves-light red">
            <i class="material-icons">add</i>
          </a>
        </div>
      </div>

    </div>

  </section>

</template>

<script>

  import Vue from 'vue'
  import uuid from '../../common/uuid'

  const app = {

    name: 'bulb-media',

    props: {
      bulb: {
        type: Object,
        required: true
      }
    },

    data: function () {
      return {
        newReference: '',
      }
    },

    methods: {

      addReference() {
        if (this.newReference.length > 0) {
          this.$store.dispatch("addReference",
            {
              reference: this.newReference,
              bulb: this.bulb
            }
          ).then((payload) => {
              this.$emit("reference", payload.reference)
          })
          this.newReference = ''
        }
      },

    },

  }

  export default app
</script>

<style>

  .fab {
    z-index: 50000;
    cursor: default;
    background: #FFF;
    border-radius: .125em;
    width: 300px;
    height: 100px;
    box-shadow: 0 25px 35px 0 rgba(0, 0, 0, 0.35);
    position: fixed;
    right: 10px;
    top: 10px;
  }

</style>
