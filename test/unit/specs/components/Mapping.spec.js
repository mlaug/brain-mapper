import Vue from 'vue'
import Mapping from '@/components/Mapping'

describe('Mapping.vue', () => {

  it('should render correct contents', () => {
    const Constructor = Vue.extend(Mapping)
    const vm = new Constructor().$mount()
    expect(vm.$el.querySelector('.mapping-canvas')).to.exist
    expect(vm.$el.querySelector('.node')).to.exist
    expect(vm.$el.querySelector('.node')).to.have.lengthOf(1)
  })

})
