import Vue from 'vue'
import Vuex from 'vuex'
import {Eventstore} from './plugins/eventstore'

Vue.use(Vuex)

// FIXME: is this cool using those ids until a reload
// when they would be replaced with the real IDs generated in the backend
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
      id: 0,
      title: "Bulbs",
      children: []
    },

    selectedBulb: 0

  },

  actions: {

    addBulb({commit}, payload){

      return new Promise((resolve) => {
        commit("addBulb", payload)
        // FIXME: this is weird ...
        resolve(uid-1)
      })

    }

  },

  mutations: {

    reset (state) {
      uid = 1
      tuid = 1
      state.bulbs = {
        id: 0,
        title: "Bulbs",
        children: []
      }
    },

    addBulb (state, bulb) {

      let search = (bulb, searchList) => {
        searchList = searchList.concat(bulb.children)
        if (bulb.id == state.selectedBulb) return bulb
        if (searchList.length == 0) return state.bulbs
        let nextBulb = searchList.pop()
        return search(nextBulb, searchList)
      }

      let bulbToAddTo = search(state.bulbs, [])

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
      let search = bulb => {
        if (bulb.id == bulbId) return bulbId
        if (bulb.children.length == 0) return 0
        return bulb.children.map(search).reduce((a, b) => a + b)
      }
      state.selectedBulb = search(state.bulbs)
    }

  }

})
