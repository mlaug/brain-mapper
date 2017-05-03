import Vue from 'vue'
import Mapping from '@/components/Mapping'
import { store } from '../../../../src/store/bulbs'
import axios from 'axios'

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
    const vm = new Constructor({store}).$mount()

    setImmediate(() => {
      try{
        sinon.assert.calledOnce(knowledgeApiStub)
        expect(vm.bulbs.length).to.be.equal(1)
        expect(vm.$el.querySelectorAll('div.bulb').length).to.equal(1)
        done()
      }
      catch(err){
        done(err)
      }
    })
  })

  it('should be able to toggle the array indicating visibility of the input fields for the title of a bulb', () => {

    const Constructor = Vue.extend(Mapping)
    const vm = new Constructor({store}).$mount()

    expect(vm.showInput['123']).to.be.undefined
    vm.toggleShowInput('123')
    expect(vm.showInput['123']).to.be.true
    vm.toggleShowInput('123')
    expect(vm.showInput['123']).to.be.false

  })

  it('should commit updates if element is found', () => {
    const Constructor = Vue.extend(Mapping)
    const vm = new Constructor({store}).$mount()
    vm.update("456")
    sinon.assert.notCalled(storeStub)
    vm.update("123")
    sinon.assert.calledOnce(storeStub)
  })

})
