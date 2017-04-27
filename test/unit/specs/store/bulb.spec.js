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
    expect(store.state.bulbs.title).to.be.equal("Bulbs")
    expect(store.state.bulbs.children.length).to.be.equal(0)
  })

  it('should be able to add elements and return newly created one', () => {
    store.commit("addBulb", {title: "samson"})
    expect(store.state.bulbs.children.length).to.be.equal(1)
    expect(store.state.bulbs.children[0].title).to.be.equal("samson")
    expect(store.state.bulbs.children[0].uuid).to.be.not.null
    expect(store.state.bulbs.children[0].children).to.be.not.null
    expect(store.state.bulbs.children[0].children.length).to.be.equal(0)
  })

  it('should have unique ids for inserted bulbs', () => {
    store.commit("addBulb", {title: "samson"})
    store.commit("addBulb", {title: "tiffy"})
    expect(store.state.bulbs.children[0].uuid).to.be.not.equal(store.state.bulbs.children[1].uuid)
  })

  it('should be able to select a bulb', () => {
    expect(store.state.selectedBulb).to.be.equal(0)
    store.commit("addBulb", {title: "samson"})
    store.commit("select", store.state.bulbs.children[0].uuid)
    expect(store.state.selectedBulb).to.be.equal(store.state.bulbs.children[0].uuid)
    store.commit("addBulb", {title: "child of child"})
    store.commit("select", store.state.bulbs.children[0].children[0].uuid)
    expect(store.state.selectedBulb).to.be.equal(store.state.bulbs.children[0].children[0].uuid)
  })

  it('should select 0 by default if bulb cannot be found', () => {
    store.commit("select", 41983127912379)
    expect(store.state.selectedBulb).to.be.equal(0)
  })

  it('should add a bulb as child of selected bulb', () => {
    store.commit("addBulb", {title: "samson"})
    expect(store.state.bulbs.children[0].uuid).to.be.not.null
    expect(store.state.bulbs.children[0].children.length).to.be.equal(0)

    store.commit("select", store.state.bulbs.children[0].uuid)
    store.commit("addBulb", {title: "child"})
    expect(store.state.bulbs.children[0].children.length).to.be.equal(1)
    expect(store.state.bulbs.children[0].children[0].uuid).to.be.not.null
    expect(store.state.bulbs.children[0].children[0]._parentUuid).to.be.equal(
      store.state.bulbs.children[0].uuid
    )

    store.commit("select", store.state.bulbs.children[0].children[0].uuid)
    store.commit("addBulb", {title: "child of child"})
    expect(store.state.bulbs.children[0].children.length).to.be.equal(1)
    expect(store.state.bulbs.children[0].children[0].children.length).to.be.equal(1)
    expect(store.state.bulbs.children[0].children[0].children[0].uuid).to.be.not.null
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
        data: {
          uuid: "uuid-1",
          title: "Bulbs",
          children: [{
            uuid: "uuid-2",
            title: "Bulbs Child 1",
            children: []
          }, {
            uuid: "uuid-3",
            title: "Bulbs Child 2",
            children: []
          }]
        }
      })
    })

    store.dispatch('loadBulbs')
      .then((bulbs) => {
        expect(bulbs.uuid).to.be.equal("uuid-1")
        expect(bulbs.children.length).to.be.equal(2)
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
        done()
      })
      .catch((error) => {
        done(new Error("this should not have happened"))
      })
  })

})
