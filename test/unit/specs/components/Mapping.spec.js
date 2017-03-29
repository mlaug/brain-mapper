import Vue from 'vue'
import Mapping from '@/components/Mapping'
import { store } from '../../../../src/store/bulbs'

describe('Mapping.vue', () => {

  it('should render correct contents', () => {
    const Constructor = Vue.extend(Mapping)
    const vm = new Constructor({store}).$mount()
    expect(vm.$el.querySelector('.mapping-canvas')).to.exist
  })

})
