import Vue from 'vue'
import ImageLoader from '@/components/ImageLoader.vue'
import axios from 'axios'

describe('ImageLoader.vue', () => {

  let sandbox

  beforeEach(function () {
    sandbox = sinon.sandbox.create()
  });

  afterEach(function () {
    sandbox.restore()
  })

  it('should be succesfully load and stop calling', (done) => {

    let axiosStub = sandbox.stub(axios, "head", () => {
      return Promise.resolve()
    })

    const Constructor = Vue.extend(ImageLoader)
    const vm = new Constructor({propsData: {src: "http://www.google.de/wrongpage", retries: 3}}).$mount()
    expect(vm.retryCount).to.be.equal(3)
    expect(vm.imageAvailable).to.be.true
    vm.reloadImage()
    expect(vm.retryCount).to.be.equal(2)
    expect(vm.imageAvailable).to.be.true

  })

  it('should retry load and stop calling after three times', (done) => {

    let axiosStub = sandbox.stub(axios, "head", () => {
      return Promise.resolve()
    })

    const Constructor = Vue.extend(ImageLoader)
    const vm = new Constructor({propsData: {src: "http://i.imgur.com/LKlkxZH.jpg", retries: 3}}).$mount()
    expect(vm.retryCount).to.be.equal(3)
    expect(vm.imageAvailable).to.be.true
    vm.reloadImage()
    expect(vm.retryCount).to.be.equal(2)
    expect(vm.imageAvailable).to.be.false
    setImmediate(() => {
      expect(vm.retryCount).to.be.equal(0)
      expect(vm.imageAvailable).to.be.false
    })

  })

})
