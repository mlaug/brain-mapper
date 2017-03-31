import Vue from 'vue'
import Vuex from 'vuex'
import {Eventstore} from './plugins/eventstore'

Vue.use(Vuex)

var uid = 1
var tuid = 1

const protoBulbs = {
  title: "Bulbs",
  children: []
}

export const store = new Vuex.Store({

  plugins: [Eventstore],

  state: {

    topics: [],

    bulbs: {
      title: "Bulbs",
      children: []
    },

    selectedBulb: 0

  },

  mutations: {

    addBulb (state, bulb, topicId) {
      const topicToAddTo = state.topics.find(function (topic) {
        return topic.id == topicId
      })

      const bulbToAddTo = state.bulbs.children.find(function (bulb) {
          return state.selectedBulb == bulb.id
        }) || state.bulbs

      bulb.id = uid++
      bulb.children = []
      bulbToAddTo.children.push(bulb)
    },

    addTopic(state, topic) {
      topic.id = tuid++
      topic.bulbs = Object.assign({}, protoBulbs)
      state.topics.push(topic)
    },

    select (state, bulbId) {
      state.selectedBulb = state.bulbs.children.filter(function (bulb) {
        return bulb.id == bulbId
      }).length == 1 ? bulbId : 0
    }

  }

})
