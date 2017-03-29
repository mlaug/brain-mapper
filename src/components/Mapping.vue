<template>

  <section class="mapping">

    <svg width="960" height="960" class="mapping-canvas">
      <defs>
        <pattern id="add" x="0" y="0" patternContentUnits="objectBoundingBox" height="100%" width="100%">
          <image x="0" y="0"
                 xlink:href="https://cdn2.iconfinder.com/data/icons/ios-7-tab-bar-icons/500/plus-512.png"
                 preserveAspectRatio="none" width="1" height="1"></image>
        </pattern>
      </defs>
    </svg>

  </section>

</template>

<script>

  import * as d3 from 'd3'

  const app = {

    name: 'mapping',

    data: function () {
      return {
        bulbs: this.$store.state.bulbs
      }
    },

    mounted: function () {
      this.drawMap()
    },

    // watch bulbs change for localStorage persistence
    watch: {

      bulbs: {
        handler: function () {
          this.drawMap()
        },
        deep: true
      }

    },

    // methods that implement data logic.
    // note there's no DOM manipulation here at all.
    methods: {

      drawMap: function () {

        const self = this

        // I guess this can be done more performant
        d3.select("svg").selectAll("g").remove()

        var svg = d3.select("svg"),
          diameter = +svg.attr("width"),
          g = svg.append("g").attr("transform", "translate(2,2)"),
          format = d3.format(",d")

        var pack = d3.pack()
          .size([diameter - 414, diameter - 414])

        var rootElement = d3.hierarchy(this.bulbs).sum(function (d) {
          return (d.id || 0) + 10;
        })

        var node = g.selectAll(".node")
          .data(pack(rootElement).descendants())
          .enter()
          .append("g")
          .attr("class", function (d) {
            return d.children ? "node" : "leaf node";
          })
          .attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
          });

        node.append("title")
          .text(function (d) {
            return d.data.title + "\n" + format(d.data.id || 0);
          });

        node.append("circle")
          .attr("r", function (d) {
            return d.r;
          })
          .on("click", function (d) {
            self.$store.commit("select", d.data.id)
          })

        node.filter(function (d) {
          return !d.children;
        }).append("text")
          .attr("dy", "0.3em")
          .text(function (d) {
            return d.data.title.substring(0, d.r / 3);
          });

        var gInner = node.filter(function (d) {
          return d.depth <= 2 && (!d.children || d.children.length < 4)
        }).append("g");

        gInner.append("title")
          .append("text")
          .text(function (d) {
            return "Add new element to " + d.data.title
          })

        gInner.append("circle")
          .attr("fill", "url(#add)")
          .attr("cy", function (d) {
            return d.r - 10
          })
          .attr("r", function (d) {
            return 10
          })
          .on("click", function () {
            alert("adding new item")
          })
      }

    },

  }

  export default app
</script>

<style>

  circle {
    fill-opacity: .25;
    stroke: rgb(31, 119, 180);
    stroke-width: 1px;
  }

  .leaf circle {
    fill-opacity: 0.5;
  }

  text {
    font: 10px sans-serif;
    text-anchor: middle;
  }

</style>
