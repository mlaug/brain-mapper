import Vue from 'vue'
import Mapping from '@/components/Mapping'
import { store } from '../../../../src/store/bulbs'
import axios from 'axios'

const Mock = Vue.component("bulb", {
  template: "<div class='bulb'></div>"
})

describe('Mapping.vue', () => {

  let sandbox

  let knowledgeApiStub

  let storeStub

  beforeEach(function () {
    sandbox = sinon.sandbox.create()
    knowledgeApiStub = sandbox.stub(axios, "get", () => {
      return Promise.resolve({
        data : [{
          uuid: "123",
          title: "my title",
          summary: "my summary"
        }]
      })
    })
    storeStub = sandbox.stub(store, "commit")
  });

  afterEach(function () {
    sandbox.restore()
  })

  it('should render correct contents and load initial bulbs', (done) => {

    const Constructor = Vue.extend(Mapping)
    const vm = new Constructor({store, components: {Mock}}).$mount()

    setImmediate(() => {
      try{
        sinon.assert.calledOnce(knowledgeApiStub)
        expect(vm.bulbs.length).to.be.equal(1)
        done()
      }
      catch(err){
        done(err)
      }
    })
  })

})
