import Vue from 'vue'
import Editor from '@/components/mapping/Editor.vue'

describe('Media.vue', () => {

  let sandbox

  let bulbExample = {uuid: '123', title: 'title', summary: 'summary', references: []}

  let storeStubDispatch

  beforeEach(function () {
    sandbox = sinon.sandbox.create()
  });

  afterEach(function () {
    sandbox.restore()
  })

  it('should be able to compose a reference into an existing text', (done) => {
    const Constructor = Vue.extend(Editor)
    const vm = new Constructor({propsData: {bulb: bulbExample, content: "summary"}}).$mount()

    let expectedContent = "[reference:123]s[/reference]ummary"

    vm.$on('update', (content) => {
      expect(content).to.be.equal(expectedContent)
      done()
    })

    vm.highlightedTextRange = [0,1]
    vm.composeReferenceIntoText({
      uuid: '123'
    })
    expect(vm.$refs.editor.innerHTML).to.be.equal(expectedContent)
  })

  it('should not be able to overwrite an existing reference with another', () => {

  })

})
