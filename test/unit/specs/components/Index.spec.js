import Vue from 'vue'
import Index from '@/components/Index'

describe('Index.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(Index)
    const vm = new Constructor().$mount()
    expect(vm.$el.querySelector('.header h1').textContent).to.equal('Bulbs')
    expect(vm.$el.querySelector('input.new-bulb').value).to.equal('')
  })
})
