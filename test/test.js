// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

// TODO: Load these from the store and configuration
const itemsPerPage = 20

module.exports = {

  'The locations page exists': function (browser) {
    browser.url('http://localhost:3000/locations/')
  },

  'The locations page has a list of locations': function (browser) {
    browser.waitForElementVisible('ul.location-list', 5000)
  },

  'The list of locations has a length equal to the “itemsPerPage”': function (browser) {
    browser.elements('css selector', 'ul.location-list li', function(res) {
      browser.assert.strictEqual(res.value.length, itemsPerPage)
    })
  },

  'The first location has a name, address, and a type': function (browser) {
    browser.expect.element('ul.location-list h2').to.be.present
    browser.expect.element('ul.location-list h2').text.to.not.equal('')
    browser.expect.element('ul.location-list .address').to.be.present
    browser.expect.element('ul.location-list .address').text.to.not.equal('')
    browser.expect.element('ul.location-list .type').to.be.present
    browser.expect.element('ul.location-list .type').text.to.not.equal('')
  },

  'The first location has a distance indicator that contains a number': function (browser) {
    browser.expect.element('ul.location-list .distance').to.be.present
    browser.expect.element('ul.location-list .distance').text.to.match(/[0-9\.]+.*/)
  },

  // 'The locations are sorted by distance from the search area': function (browser) {
  //   browser.elements('css selector', 'ul.location-list .distance', function(res) {
      
  //   })
  // }

  'Close browser session': function (browser) {
    browser.end()
  }

  // 'If a type parameter is present with a value of “farmers-market”, all of the locations on the page will be farmers markets': function (browser) {
  //   browser
  //     .url('http://localhost:3000/locations/')
  //     .waitForElementVisible('ul.location-list', 5000)
  //     .end()
  // }

  // If an open now parameter is present with a value of 1, all of the locations on the page will be open now
  // If no locations matched the search critera, a special message will show
  // If the current time is nine o’clock in the morning on Thursday, the “L.A. City Hall (Little Tokyo CFM)” location will indicate that it not open
  // If the current time is ten o’clock in the morning on Thursday, the “L.A. City Hall (Little Tokyo CFM)” location will indicate that it is open
  // If Mapbox is supported, a map will be rendered on the page
  // If a map exists on the page, there will be a marker for each location in the list
  // If a list item is pressed, the details for a location will be activated
  // If a list item is pressed, and the map is active the corresponding marker will be activated
  // If a marker is pressed, the details for a location will be activated
  // If a location has been selected, the navigation will switch to “More locations“
  // TODO: Add test descriptions for the details page


}
