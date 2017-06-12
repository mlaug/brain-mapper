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

    addReference({commit}, {bulb, reference}){
      return new Promise((resolve) => {
        let payload = {
          bulb: bulb,
          reference : {
            uuid : uuid(),
            reference: reference
          }
        }
        commit("addReference", payload)
        resolve(payload)
      })
    },

    loadBulbs({commit}){
      return new Promise((resolve, reject) => {
        axios.get(process.env.knowledge.url + '/' + localStorage.getItem('id_user') + '/bulbs')
          .then((response) => {
            commit("loadBulbs", response.data)
            resolve(response.data)
          })
          .catch((error) => {
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

    addReference (state, {bulb, reference}) {
      state.bulbs.filter((_bulb) => {
        return _bulb.uuid === bulb.uuid
      }).map((bulb) => {
        if (bulb.references === null) {
          Vue.set(bulb, "references", [])
        }
        bulb.references.push(reference)
      })
    },

    addBulb (state, bulb) {
      // FIXME: adding this at a later point is wrong and is not shoing up in the event log
      // FIXME: how to make sure this function can only be called via dispather?
      bulb.uuid = bulb.uuid || uuid()
      bulb.references = []
      bulb.links = []
      state.bulbs.push(bulb)
    },

    linkBulb (state, link) {
      state.bulbs.filter((bulb) => {
        return bulb.uuid === link.from
      }).map((bulb) => {
        [state.bulbs.find((_bulb) => {
          return _bulb.uuid === link.to
        })].filter(toAdd => toAdd !== undefined)
          .map((toAdd) => {
            if (bulb.links === null) {
              Vue.set(bulb, "links", [])
            }
            bulb.links.push(toAdd)
          })
      })
    },

    updateBulb (state, bulbToUpdate) {
      state.bulbs.filter((bulb) => {
        return bulb.uuid === bulbToUpdate.uuid
      }).map((bulb) => {
        bulb = Object.assign(bulb, bulbToUpdate)
      })
    },

    deleteBulb(state, bulbToDelete) {
      let index = state.bulbs.findIndex((bulb) => bulb.uuid === bulbToDelete.uuid)
      if (index >= 0)
        state.bulbs.splice(index, 1)
    },

    select (state, bulbUuid) {
      state.selectedBulb = bulbUuid
    },

  }

})
