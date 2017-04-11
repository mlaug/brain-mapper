// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

module.exports = {

  'check if elements are present': function (browser) {
    // automatically uses dev Server port from /config.index.js
    // default: http://localhost:8080
    // see nightwatch.conf.js
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
      .waitForElementVisible('.node', 1000)
      .end()
  },

  'should be able to select a bulb': function (browser) {
    const devServer = browser.globals.devServerURL
    browser
      .url(devServer)
      .waitForElementVisible('#app', 5000)
      .setValue('input.new-bulb', ['this is my new bulb', browser.Keys.ENTER])
      .waitForElementVisible('.node', 1000)
      .click(".node:first")
      .end()
  }

}
