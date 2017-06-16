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
    let bulb = store.state.bulbs.shift()
    expect(bulb.title).to.be.equal("samson")
    expect(bulb.references.length).to.be.equal(0)
  })

  it('should have unique ids for inserted bulbs', () => {
    store.commit("addBulb", {title: "samson"})
    store.commit("addBulb", {title: "tiffy"})
    expect(store.state.bulbs.length).to.be.equal(2)
    expect(store.state.bulbs.shift().uuid).to.be.not.equal(store.state.bulbs.shift().uuid)
  })

  it('should store a bulb via action to retrieve id asynchronously', (done) => {
    store.dispatch('addBulb', {title: "samson"})
      .then((bulb) => {
        expect(bulb.uuid).to.be.not.null
        expect(bulb.title).to.be.equal("samson")
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
      .then((bulb) => {
        expect(store.state.bulbs[0].title).to.be.equal("samson")
        store.commit("updateBulb", {uuid: bulb.uuid, title: "tiffy"})
        expect(store.state.bulbs[0].title).to.be.equal("tiffy")
        done()
      })
      .catch((e) => {
        done(e)
      })
  })

  it('should be able to add a link to a bulb', () => {
    store.commit("addBulb", {title: "samson"})
    store.commit("addBulb", {title: "tiffy"})
    let linkFromUuid = store.state.bulbs[0].uuid
    let linkToUuid = store.state.bulbs[1].uuid
    expect(store.state.bulbs[0].links.length).to.be.equal(0)
    store.commit("linkBulb", {
      from: linkFromUuid,
      to: linkToUuid
    })
    expect(store.state.bulbs[0].links.length).to.be.equal(1)
  })

  it('should be able to create link list if not present', () => {
    store.commit("addBulb", {title: "samson"})
    store.commit("addBulb", {title: "tiffy"})
    let linkFromUuid = store.state.bulbs[0].uuid
    let linkToUuid = store.state.bulbs[1].uuid
    // this can happen if called from the API
    store.state.bulbs[0].links = null
    store.commit("linkBulb", {
      from: linkFromUuid,
      to: linkToUuid
    })
    expect(store.state.bulbs[0].links.length).to.be.equal(1)
  })

  it('should NOT be able to add a link to a bulb which does not exist', () => {
    store.commit("addBulb", {title: "samson"})
    let linkFromUuid = store.state.bulbs[0].uuid
    let linkToUuid = "not existing"
    expect(store.state.bulbs[0].links.length).to.be.equal(0)
    store.commit("linkBulb", {
      from: linkFromUuid,
      to: linkToUuid
    })
    expect(store.state.bulbs[0].links.length).to.be.equal(0)
  })

  it('should be able to store reference', () => {
    store.commit("addBulb", {title: "samson"})
    expect(store.state.bulbs[0].references.length).to.be.equal(0)
    store.commit("addReference", {
      bulb: store.state.bulbs[0],
      reference: {
        uuid: "123-123-123",
        reference: "http://www.google.de"
      }
    })
    expect(store.state.bulbs[0].references.length).to.be.equal(1)
    expect(store.state.bulbs[0].references[0].reference).to.be.equal("http://www.google.de")
  })

  it('should be able to create reference list if not present', () => {
    store.commit("addBulb", {title: "samson"})
    expect(store.state.bulbs[0].references.length).to.be.equal(0)
    // this can happen if called from the API
    store.state.bulbs[0].references = null
    store.commit("addReference", {
      bulb: store.state.bulbs[0],
      reference: {
        uuid: "123-123-123",
        reference: "http://www.google.de"
      }
    })
    expect(store.state.bulbs[0].references.length).to.be.equal(1)
    expect(store.state.bulbs[0].references[0].reference).to.be.equal("http://www.google.de")
  })

  it('should be able to remove a bulb', (done) => {
    store.dispatch('addBulb', {title: "samson"})
      .then((bulb) => {
        expect(store.state.bulbs.length).to.be.equal(1)
        store.commit("deleteBulb", bulb)
        expect(store.state.bulbs.length).to.be.equal(0)
        done()
      })
      .catch((e) => {
        done(e)
      })
  })

  it('should not be able to remove a non existing bulb', () => {
    store.commit("addBulb", {title: "samson"})
    expect(store.state.bulbs.length).to.be.equal(1)
    store.commit("deleteBulb", "something not present")
    expect(store.state.bulbs.length).to.be.equal(1)
  })

})
