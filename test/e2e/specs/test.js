module.exports = {

  'check if elements are present': function (browser) {
    const devServer = browser.globals.devServerURL
    browser
      .url(devServer)
      .waitForElementVisible('#app', 5000)
      .assert.elementPresent('.header')
      .assert.containsText('.header h1', 'Bulbs')
      .assert.containsText('input.new-bulb', '')
      .end()
  },

  'should be able to show camera only if input field has focus': function (browser) {
    const devServer = browser.globals.devServerURL
    browser
      .url(devServer)
      .waitForElementVisible('#app', 5000)
      .click("input.new-bulb")
      .waitForElementVisible('.media', 1000)
      .end()
  },

  'should be able to insert new bulb': function (browser) {
    const devServer = browser.globals.devServerURL
    browser
      .url(devServer)
      .waitForElementVisible('#app', 5000)
      .setValue('input.new-bulb', ['this is my new bulb', browser.Keys.ENTER])
      .waitForElementVisible('.bulb', 1000)
      .end()
  },

  'should be able to preload elements from api': function (browser) {

  },

  'should be able to update title': function (browser) {

  },

  'should be able to select bulb to update summary': function (browser) {

  },

  'should be able to drag and drop to link two bulbs': function (browser) {
    // https://www.robertkehoe.com/2014/10/nightwatchjs-drag-and-drop-example/
  }

}
