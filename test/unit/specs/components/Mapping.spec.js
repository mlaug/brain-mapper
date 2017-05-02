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

  it('should render correct contents and load initial bulbs', (done) => {

    let knowledgeApi = sandbox.stub(axios, "get", () => {
      return Promise.resolve({
        data : [{
          title: "my title",
          summary: "my summary"
        }]
      })
    })

    const Constructor = Vue.extend(Mapping)
    const vm = new Constructor({store}).$mount()

    setImmediate(() => {
      try{
        sinon.assert.calledOnce(knowledgeApi)
        expect(vm.bulbs.length).to.be.equal(1)
        expect(vm.$el.querySelectorAll('div.bulb').length).to.equal(1)
        done()
      }
      catch(err){
        done(err)
      }
    })
  })

})
