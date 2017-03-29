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
    }

  },

  mutations: {
    add (state, bulb) {
      bulb.id = uid++
      bulb.children = []
      state.bulbs.children.push(bulb)
    }
  }

})
