import {store} from '@/store/bulbs.js'

describe('bulbs store', () => {

  it('should have an initial empty root element', () => {
    expect(store.state.bulbs.title).to.be.equal("Bulbs")
    expect(store.state.bulbs.children.length).to.be.equal(0)
  })

  it('should be able to add elements and return newly created one', () => {
    store.commit("add", {title: "samson"})
    expect(store.state.bulbs.children.length).to.be.equal(1)
    expect(store.state.bulbs.children[0].title).to.be.equal("samson")
    expect(store.state.bulbs.children[0].id).to.be.not.null
    expect(store.state.bulbs.children[0].children).to.be.not.null
    expect(store.state.bulbs.children[0].children.length).to.be.equal(0)
  })

  it('it should have unique ids for inserted bulbs', () => {
    store.commit("add", {title: "samson"})
    store.commit("add", {title: "tiffy"})
    expect(store.state.bulbs.children[0].id).to.be.not.equal(store.state.bulbs.children[1].id)
  })

})
