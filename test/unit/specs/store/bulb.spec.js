import {store} from '@/store/bulbs.js'

describe('bulbs store', () => {

  it('should be able to add a topic', () => {
    expect(store.state.topics.length).to.be.equal(0)
    store.commit("addTopic", {title: "myTopic"})
    expect(store.state.topics.length).to.be.equal(1)
    expect(store.state.topics[0].title).to.be.equal("myTopic")
    expect(store.state.topics[0].bulbs.children.length).to.be.equal(0)
  })

  it('should have an initial empty root element', () => {
    expect(store.state.bulbs.title).to.be.equal("Bulbs")
    expect(store.state.bulbs.children.length).to.be.equal(0)
  })

  it('should be able to add elements and return newly created one', () => {
    store.commit("addBulb", {title: "samson"})
    expect(store.state.bulbs.children.length).to.be.equal(1)
    expect(store.state.bulbs.children[0].title).to.be.equal("samson")
    expect(store.state.bulbs.children[0].id).to.be.not.null
    expect(store.state.bulbs.children[0].children).to.be.not.null
    expect(store.state.bulbs.children[0].children.length).to.be.equal(0)
  })

  it('should have unique ids for inserted bulbs', () => {
    store.commit("addBulb", {title: "samson"})
    store.commit("addBulb", {title: "tiffy"})
    expect(store.state.bulbs.children[0].id).to.be.not.equal(store.state.bulbs.children[1].id)
  })

  it('should be able to select a bulb', () => {
    expect(store.state.selectedBulb).to.be.equal(0)
    store.commit("addBulb", {title: "samson"})
    store.commit("select", 1)
    expect(store.state.selectedBulb).to.be.equal(1)
    store.commit("select", 41983127912379)
    expect(store.state.selectedBulb).to.be.equal(0)
  })

  it('should add a bulb as child of selected bulb', () => {
    store.state.bulbs = {
      title: "Bulbs",
        children: []
    }
    store.commit("addBulb", {title: "samson"})
    expect(store.state.bulbs.children[0].id).to.be.equal(5)
    store.commit("select", 5)
    expect(store.state.bulbs.children[0].children.length).to.be.equal(0)
    store.commit("addBulb", {title: "child"})
    expect(store.state.bulbs.children[0].children.length).to.be.equal(1)
    expect(store.state.bulbs.children[0].children[0].id).to.be.equal(6)
  })

})
