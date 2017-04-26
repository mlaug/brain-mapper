import Vue from 'vue'
import Mapping from '@/components/Mapping'
import { store } from '../../../../src/store/bulbs'
import axios from 'axios'

describe('Mapping.vue', () => {

  let sandbox

  beforeEach(function () {
    sandbox = sinon.sandbox.create()
  });

  afterEach(function () {
    sandbox.restore()
  })

  it('should render correct contents', () => {

    let knowledgeApi = sandbox.stub(axios, "get", () => {
      return Promise.resolve({
        data : {
          uuid: "uuid-1",
          title: "Bulbs",
          children: []
        }
      })
    })

    const Constructor = Vue.extend(Mapping)
    const vm = new Constructor({store}).$mount()
    expect(vm.$el.querySelector('.mapping-canvas')).to.exist
    sinon.assert.calledOnce(knowledgeApi)
  })

})
