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

  var w = 800,
    h = 800,
    r = 720,
    vis

  const app = {

    name: 'mapping',

    data: function () {
      return {
        bulbs: this.$store.state.bulbs,
        selectedNode: undefined
      }
    },

    mounted: function () {
      vis = d3.select("svg")
        .attr("width", w)
        .attr("height", h)
        .append("svg:g")
        .attr("transform", "translate(" + (w - r) / 2 + "," + (h - r) / 2 + ")");
      const self = this
      this.$store.dispatch("loadBulbs").then(() => {
        self.drawMap()
      })
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

        var x = d3.scaleLinear().range([0, r]),
          y = d3.scaleLinear().range([0, r]),
          node,
          root,
          self = this

        var pack = d3.pack().size([r, r])

        var nodes = root = d3.hierarchy(this.bulbs).sum(function (d) {
          return 10
        })

        vis.selectAll("circle")
          .data(pack(nodes).descendants())
          .attr("cx", function (d) {
            return d.x;
          })
          .attr("cy", function (d) {
            return d.y;
          })
          .attr("r", function (d) {
            return d.r;
          })
          .enter()
          .append("svg:circle")
          .attr("fill", function (d) {
            return "url(#bulbBackground-" + d.data.uuid + ")"
          })
          .attr("class", function (d) {
            return d.children ? "parent" : "child";
          })
          .attr("cx", function (d) {
            return d.x;
          })
          .attr("cy", function (d) {
            return d.y;
          })
          .attr("r", function (d) {
            return d.r;
          })
          .on("click", function (d) {
            self.$store.commit("select", d.data.uuid)
            return zoom(node == d ? root : d);
          });

        /*vis.selectAll("text")
          .data(pack(nodes).descendants())
          .attr("x", function (d) {
            return d.x;
          })
          .attr("y", function (d) {
            return d.y;
          })
          .enter().append("svg:text")
          .attr("class", function (d) {
            return d.children ? "parent" : "child";
          })
          .attr("x", function (d) {
            return d.x;
          })
          .attr("y", function (d) {
            return d.y;
          })
          .attr("dy", ".35em")
          .attr("text-anchor", "middle")
          .style("opacity", function (d) {
            return d.r > 20 ? 1 : 0;
          })
          .text(function (d) {
            return d.data.title;
          });

        /*d3.select(window).on("click", function () {
         self.$store.commit("select", 0)
         zoom(root);
         })*/

        function zoom(d, duration) {

          duration = duration === undefined ? 750 : duration

          var k = r / d.r / 2;
          x.domain([d.x - d.r, d.x + d.r]);
          y.domain([d.y - d.r, d.y + d.r]);

          var t = vis.transition()
            .duration(duration);

          t.selectAll("circle")
            .attr("cx", function (d) {
              return x(d.x);
            })
            .attr("cy", function (d) {
              return y(d.y);
            })
            .attr("r", function (d) {
              return k * d.r;
            });

          t.selectAll("text")
            .attr("x", function (d) {
              return x(d.x);
            })
            .attr("y", function (d) {
              return y(d.y);
            })
            .style("opacity", function (d) {
              return k * d.r > 20 ? 1 : 0;
            });

          node = self.selectedNode = d;
          d3.event ? d3.event.stopPropagation() : undefined;
        }

        zoom(this.selectedNode ? this.selectedNode : root, 0)

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
