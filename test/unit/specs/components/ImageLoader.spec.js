import Vue from 'vue'
import ImageLoader from '@/components/ImageLoader.vue'
import eventual from '../helper/eventual'
import axios from 'axios'

describe('ImageLoader.vue', () => {

  let sandbox

  beforeEach(function () {
    sandbox = sinon.sandbox.create()
  });

  afterEach(function () {
    sandbox.restore()
  })

  it('should stop trying once it succeeds', (done) => {

    let axiosStub = sandbox.stub(axios, "head", () => {
      return Promise.resolve()
    })

    const Constructor = Vue.extend(ImageLoader)
    const vm = new Constructor({
      propsData: {
        src: "http://www.google.de/wrongpage",
        retries: 3,
        retryInterval: 100
      }
    }).$mount()
    vm.reloadImage()

    setImmediate(() => {
      expect(vm.retryCount).to.be.equal(2)
      expect(vm.error).to.be.false
      expect(vm.imageAvailable).to.be.true
      done()
    })
  })

  it('should count down retries until zero and fail if the image keep being unavailable', (done) => {

    let axiosStub = sandbox.stub(axios, "head", () => {
      return Promise.reject()
    })

    const Constructor = Vue.extend(ImageLoader)
    const vm = new Constructor({
      propsData: {
        src: "http://www.google.de/wrongpage",
        retries: 3,
        retryInterval: 100
      }
    }).$mount()

    eventual.waitFor(vm, "retryCount").toBe(0).then(done).catch((err) => done(new Error(err)))
    eventual.waitFor(vm, "error").toBe(true).then(done).catch((err) => done(new Error(err)))
    vm.reloadImage()

  })

})
