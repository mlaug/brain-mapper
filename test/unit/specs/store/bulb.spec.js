import {store} from '@/store/bulbs.js'
import axios from 'axios'

describe('bulbs store', () => {

  let axiosPostStub,
    sandbox

  beforeEach(function () {
    store.commit("reset")
    sandbox = sinon.sandbox.create()
  });

  afterEach(function () {
    sandbox.restore()
  })

  it('should have an initial empty root element', () => {
    expect(store.state.bulbs.length).to.be.equal(0)
  })

  it('should be able to add elements and return newly created one', () => {
    store.commit("addBulb", {title: "samson"})
    expect(store.state.bulbs.length).to.be.equal(1)
    expect(store.state.bulbs.shift().title).to.be.equal("samson")
  })

  it('should have unique ids for inserted bulbs', () => {
    store.commit("addBulb", {title: "samson"})
    store.commit("addBulb", {title: "tiffy"})
    expect(store.state.bulbs.length).to.be.equal(2)
    expect(store.state.bulbs.shift().uuid).to.be.not.equal(store.state.bulbs.shift().uuid)
  })

  it('should store a bulb via action to retrieve id asynchronously', (done) => {
    store.dispatch('addBulb', {title: "samson"})
      .then((uuid) => {
        expect(uuid).to.be.not.null
        done()
      })
      .catch((e) => {
        done(e)
      })
  })

  it('should be able to collect initial state from knowledge api', (done) => {

    axiosPostStub = sandbox.stub(axios, "get", () => {
      return Promise.resolve({
        data: [1, 2, 3]
      })
    })

    store.dispatch('loadBulbs')
      .then((bulbs) => {
        expect(store.state.bulbs.length).to.be.equal(3)
        done()
      })
      .catch((error) => {
        done(error)
      })
  })

  it('should load default bulb structure on failure loading', (done) => {
    axiosPostStub = sandbox.stub(axios, "get", () => {
      return Promise.reject(new Error("something went terrible wrong"))
    })

    store.dispatch('loadBulbs')
      .then(() => {
        expect(store.state.bulbs).to.be.not.null
        expect(store.state.bulbs.length).to.be.equal(0)
        done()
      })
      .catch((error) => {
        done(new Error("this should not have happened"))
      })
  })

  it('should update a bulb if exists', (done) => {
    store.dispatch('addBulb', {title: "samson"})
      .then((uuid) => {
        expect(store.state.bulbs[0].title).to.be.equal("samson")
        store.commit("updateBulb", {uuid: uuid, title: "tiffy"})
        expect(store.state.bulbs[0].title).to.be.equal("tiffy")
        done()
      })
      .catch((e) => {
        done(e)
      })
  })

})
