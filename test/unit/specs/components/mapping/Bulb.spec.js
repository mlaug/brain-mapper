import Vue from 'vue'
import Bulb from '@/components/mapping/Bulb.vue'
import { store } from '../../../../../src/store/bulbs'

describe('Bulb.vue', () => {

  let sandbox

  let storeStub

  let bulbExample = {uuid: '123', title: 'title', summary: 'summary'}

  beforeEach(function () {
    sandbox = sinon.sandbox.create()
    storeStub = sandbox.stub(store, "commit")
  });

  afterEach(function () {
    sandbox.restore()
  })

  it('should be able to toggle the array indicating visibility of the input fields for the title of a bulb', () => {

    const Constructor = Vue.extend(Bulb)
    const vm = new Constructor({store, propsData: {bulb: bulbExample}}).$mount()

    expect(vm.showInput).to.be.false
    vm.toggleShowInput()
    expect(vm.showInput).to.be.true
    vm.toggleShowInput()
    expect(vm.showInput).to.be.false

    expect(vm.showSummaryInput).to.be.false
    vm.toggleShowSummaryInput()
    expect(vm.showSummaryInput).to.be.true
    vm.toggleShowSummaryInput()
    expect(vm.showSummaryInput).to.be.false
  })

  it('should commit updates if element is found', () => {
    const Constructor = Vue.extend(Bulb)
    const vm = new Constructor({store, propsData: {bulb: bulbExample}}).$mount()
    vm.update()
    sinon.assert.calledOnce(storeStub)
  })

})
