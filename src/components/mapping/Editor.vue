<template>
  <section>
    <bulb-media v-on:reference="composeReferenceIntoText"
                v-show="isTextMarked"
                v-bind:bulb="bulb"/>
    <div ref="editor" contenteditable="true" @mouseup="select" @input="update"></div>
  </section>
</template>

<script>

  import Vue from 'vue'
  import BulbMedia from './Media.vue'
  import uuid from '../../common/uuid'

  const app = {

    name: 'bulb-editor',

    props: {
      bulb: {
        type: Object,
        required: true
      },
      content: {
        type: String,
        required: true
      }
    },

    components: {
      BulbMedia
    },

    mounted: function () {
      this.$refs.editor.innerHTML = this.content;
    },

    data: function () {
      this.setupReferences()
      return {
        highlightedTextRange: null,
        isTextMarked: false
      }
    },

    methods: {

      update: function () {
        let content = this.$refs.editor.innerHTML
        this.$emit("update", this.$refs.editor.innerHTML)
      },

      select: function (e) {
        let start = document.getSelection().getRangeAt(0).startOffset,
          end = document.getSelection().getRangeAt(0).endOffset
        if (end > start)
          this.isTextMarked = true
        this.highlightedTextRange = [start, end]
      },

      composeReferenceIntoText(reference) {
        let content = this.$refs.editor.innerHTML
        let selectedText = content.slice(this.highlightedTextRange[0], this.highlightedTextRange[1]),
          before = content.slice(0, this.highlightedTextRange[0]),
          after = content.slice(this.highlightedTextRange[1])
        this.$refs.editor.removeEventListener('input', this.update)
        this.$refs.editor.innerHTML = before + '<a reference="' + reference.uuid + '">' + selectedText + "</a>" + after
        this.update()
        this.isTextMarked = false
        this.$refs.editor.addEventListener('input', this.update)
        this.setupReferences()
      },

      setupReferences() {
        let references = document.querySelectorAll('[reference]')
        for (let i = 0; i < references.length; i++) {
          let a = references[i]
          a.addEventListener('mouseover', this.showReference)
        }
      },

      showReference: (e) => {
        let img = document.createElement("img")
        img.src = "/references/" + e.target.getAttribute("reference") + ".png"
        Materialize.toast(img, 4000)
      },

    },

  }

  export default app
</script>

<style>
  [contenteditable]:focus {
    outline: 0px solid transparent;
  }

  img {
    width: 200px;
  }
</style>
