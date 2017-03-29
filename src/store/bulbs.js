import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const STORAGE_KEY = 'bulbs'

// for testing
if (navigator.userAgent.indexOf('PhantomJS') > -1) {
  window.localStorage.clear()
}

var uid = 1;

export const store = new Vuex.Store({

  state: {

    bulbs: {
      title: "Bulbs",
      children: []
    },

    selectedBulb: 0

  },

  mutations: {
    
    add (state, bulb) {
      const bulbToAddTo = state.bulbs.children.filter(function(bulb) {
        return state.selectedBulb == bulb.id
      }).pop() || state.bulbs
      bulb.id = uid++
      bulb.children = []
      bulbToAddTo.children.push(bulb)
    },

    select (state, bulbId) {
      state.selectedBulb = state.bulbs.children.filter(function(bulb) {
        return bulb.id == bulbId
      }).length == 1 ? bulbId : 0
    }

  }

})
