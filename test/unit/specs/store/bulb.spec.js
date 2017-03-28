import {store} from '@/store/bulbs.js'

describe('bulbs store', () => {

  it('should have an initial empty root element', () => {
    expect(store.fetch().title).to.be.equal("Bulbs")
    expect(store.fetch().children.length).to.be.equal(0)
  })

  it('should be able to add elements and return newly created one', () => {
    const bulb = store.add({title: "samson"})
    expect(store.fetch().children.length).to.be.equal(1)
    expect(store.fetch().children[0].title).to.be.equal("samson")
    expect(store.fetch().children[0].id).to.be.not.null
    expect(store.fetch().children[0].children).to.be.not.null
    expect(store.fetch().children[0].children.length).to.be.equal(0)
    expect(store.fetch().children[0].title).to.be.equal(bulb.title)
  })


  it('it should have unique ids for inserted bulbs', () => {
    const bulb1 = store.add({title: "samson"})
    const bulb2 = store.add({title: "tiffy"})
    expect(bulb1.id).to.be.not.equal(bulb2.id)
  })

})
