import Vue from 'vue'
import Vuex from 'vuex'
import {Eventstore} from './plugins/eventstore'
import axios from 'axios'
import uuid from '../common/uuid'

Vue.use(Vuex)

const ROOT_ELEMENT = 0
const protoBulbs = {
  uuid: ROOT_ELEMENT,
  title: "Bulbs",
  children: []
}

export const store = new Vuex.Store({

  plugins: [Eventstore],

  state: {

    topics: [],

    bulbs: protoBulbs,

    selectedBulb: ROOT_ELEMENT

  },

  actions: {

    addBulb({commit}, payload){
      return new Promise((resolve) => {
        payload.uuid = uuid()
        commit("addBulb", payload)
        resolve(payload.uuid)
      })
    },

    loadBulbs({commit}){
      return new Promise((resolve, reject) => {
        axios.get(process.env.knowledge.url + '/bulbs')
          .then((response) => {
            commit("loadBulbs", response.data)
            resolve(response.data)
          })
          .catch((error) => {
            console.log(error)
            // TODO: is this a good idea, how about later syncs?
            resolve(protoBulbs)
          })
      })

    }

  },

  mutations: {

    reset (state) {
      tuid = 1
      state.bulbs = {
        uuid: ROOT_ELEMENT,
        title: "Bulbs",
        children: []
      }
    },

    loadBulbs(state, bulbs) {
      // FIXME: this doesnt look to smart ...
      // FIXME: apparently overwritting the initial state kills the overserver and no handler is triggered anymore
      state.bulbs.children = []
      state.bulbs.children.push(bulbs)
      state.selectedBulb = bulbs.uuid
    },

    addBulb (state, bulb) {
      bulb.uuid = bulb.uuid || uuid()

      let search = (bulb, searchList) => {
        searchList = searchList.concat(bulb.children)
        if (bulb.uuid === state.selectedBulb) return bulb
        if (searchList.length == 0) return state.bulbs
        let nextBulb = searchList.pop()
        return search(nextBulb, searchList)
      }

      let bulbToAddTo = search(state.bulbs, [])

      bulb.children = []
      bulb._parentUuid = state.selectedBulb
      bulbToAddTo.children.push(bulb)
    },

    select (state, bulbId) {
      let search = bulb => {
        if (bulb.uuid == bulbId) return bulbId
        if (bulb.children.length == 0) return 0
        return bulb.children.map(search).reduce((a, b) => a + b)
      }
      state.selectedBulb = search(state.bulbs)
    },

  }

})
