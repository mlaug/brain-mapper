export const STORAGE_KEY = 'bulbs'

// for testing
if (navigator.userAgent.indexOf('PhantomJS') > -1) {
  window.localStorage.clear()
}

export const state = {
  bulbs: JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]')
}


const
  initalBulbSetup = JSON.stringify({
    title: "Bulbs",
    children: []
  })

export const bulbs = JSON.parse(localStorage.getItem(STORAGE_KEY) || initalBulbSetup)

var uid = 0

export const store = {

  add: function (bulb) {
    bulb.id = uid++
    bulb.children = []
    bulbs.children.push(bulb)

    this.save(bulbs)
    return bulb
  },

  fetch: function () {
    return bulbs
  },

  save: function () {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bulbs))
  }

}
