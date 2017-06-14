import Vue from 'vue'
import Media from '@/components/mapping/Media.vue'
import {store} from '@/store/bulbs'

describe('Media.vue', () => {

  let sandbox

  let bulbExample = {uuid: '123', title: 'title', summary: 'summary', references: []}

  let storeStubDispatch

  beforeEach(function () {
    sandbox = sinon.sandbox.create()
    storeStubDispatch = sandbox.stub(store, "dispatch", () => {
      return Promise.resolve({
        payload: {
          reference: "samson"
        }
      })
    })
  });

  afterEach(function () {
    sandbox.restore()
  })

  it('should be able to add reference and emit an new event', (done) => {
    const Constructor = Vue.extend(Media)
    const vm = new Constructor({store, propsData: {bulb: bulbExample}}).$mount()

    vm.$on("reference", () => {
      done()
    })

    vm.newReference = "my new reference"
    expect(vm.bulb.references.length).to.be.equal(0)
    vm.addReference()
    sinon.assert.calledWith(storeStubDispatch, "addReference", {
      bulb: vm.bulb,
      reference: "my new reference"
    })
    expect(vm.newReference).to.be.equal('')
  })

})
