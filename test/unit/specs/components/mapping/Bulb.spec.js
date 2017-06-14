import Vue from 'vue'
import Bulb from '@/components/mapping/Bulb.vue'
import { store } from '../../../../../src/store/bulbs'

describe('Bulb.vue', () => {

  let sandbox

  let storeStubCommit

  let storeStubDispatch

  let bulbExample = {uuid: '123', title: 'title', summary: 'summary', references: []}

  beforeEach(function () {
    sandbox = sinon.sandbox.create()
    storeStubCommit = sandbox.stub(store, "commit")
    storeStubDispatch = sandbox.stub(store, "dispatch")
  });

  afterEach(function () {
    sandbox.restore()
  })

  it('should be able to toggle the array indicating visibility of the input fields for the title of a bulb', () => {

    const Constructor = Vue.extend(Bulb)
    const vm = new Constructor({store, propsData: {bulb: bulbExample}}).$mount()

    expect(vm.showInputTitle).to.be.false
    vm.toggleInputTitle()
    expect(vm.showInputTitle).to.be.true
    vm.toggleInputTitle()
    expect(vm.showInputTitle).to.be.false

    expect(vm.showDetails).to.be.false
    vm.toggleDetails()
    expect(vm.showDetails).to.be.true
    vm.toggleDetails()
    expect(vm.showDetails).to.be.false
  })

  it('should commit updates if element is found', () => {
    const Constructor = Vue.extend(Bulb)
    const vm = new Constructor({store, propsData: {bulb: bulbExample}}).$mount()
    vm.update()
    sinon.assert.calledOnce(storeStubCommit)
  })

})
