import Vue from 'vue'
import Vuex from 'vuex'
import {Eventstore} from './plugins/eventstore'
import axios from 'axios'
import uuid from '../common/uuid'

Vue.use(Vuex)

const protoBulbs = []

export const store = new Vuex.Store({

  plugins: [Eventstore],

  state: {

    bulbs: protoBulbs,

  },

  actions: {

    addBulb({commit}, payload){
      return new Promise((resolve) => {
        payload.uuid = uuid()
        commit("addBulb", payload)
        resolve(payload)
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
            resolve(protoBulbs)
          })
      })

    }

  },

  mutations: {

    reset (state) {
      state.bulbs = []
    },

    loadBulbs(state, bulbs) {
      bulbs.forEach((bulb) => {
        state.bulbs.push(bulb)
      })
    },

    addBulb (state, bulb) {
      bulb.uuid = bulb.uuid || uuid()
      state.bulbs.push(bulb)
    },

    updateBulb (state, bulbToUpdate) {
      state.bulbs.filter((bulb) => {
        return bulb.uuid === bulbToUpdate.uuid
      }).map((bulb) => {
        // FIXME: this seems to be broken for update propagation
        bulb = Object.assign(bulb, bulbToUpdate)
      })
    },

    select (state, bulbUuid) {
      state.selectedBulb = bulbUuid
    },

  }

})
