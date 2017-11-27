// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

// module.exports = {
//   'Demo test Google' : function (browser) {
//     browser
//       .url('http://localhost:3000')
//       .waitForElementVisible('body', 1000)
//       .setValue('input[type=text]', 'nightwatch')
//       .waitForElementVisible('button[name=btnG]', 1000)
//       .click('button[name=btnG]')
//       .pause(1000)
//       .assert.containsText('#main', 'Night Watch')
//       .end();
//   }
// };

module.exports = {

  // The locations page has a list of locations equal to the itemsPerPage
  'The locations page has a list of locations equal to the “itemsPerPage”': function (browser) {
    // automatically uses dev Server port from /config.index.js
    // default: http://localhost:8080
    // see nightwatch.conf.js
    // const devServer = browser.globals.devServerURL

    browser
      .url('http://localhost:3000/locations/')
      .waitForElementVisible('.location-list', 5000)
      .assert.elementPresent('li')
      .assert.elementCount('img', 1)
      .end()
  }
}

// The locations page has a list of locations equal to the itemsPerPage

// test('Route /locations/ contains a list of locations with a length equal to the itemsPerPage in the store', async t => {
//   const window = await nuxt.renderAndGetWindow('http://localhost:4000/locations/')
//   const locationList = window.document.querySelector('.location-list')
//   const locationListItems = window.document.querySelectorAll('.location-list li')
//   const itemsPerPage = locationList.__vue__.$store.state.itemsPerPage
//   t.true(locationListItems.length === itemsPerPage) // TBD: JSDOM seems to produce four extra empty nodes at the start of the list
// })


// The locations page has a list of locations equal to the itemsPerPage
// The locations are sorted by distance from the search area
// If a type parameter is present with a value of “farmers-market”, all of the locations on the page will be farmers markets
// If an open now parameter is present with a value of 1, all of the locations on the page will be open now
// If no locations matched the search critera, a special message will show
// Each location has a name, address, and a type
// Each location has a distance indicator
// If the current time is nine o’clock in the morning on Thursday, the “L.A. City Hall (Little Tokyo CFM)” location will indicate that it not open
// If the current time is ten o’clock in the morning on Thursday, the “L.A. City Hall (Little Tokyo CFM)” location will indicate that it is open
// If Mapbox is supported, a map will be rendered on the page
// If a map exists on the page, there will be a marker for each location in the list
// If a list item is pressed, the details for a location will be activated
// If a list item is pressed, and the map is active the corresponding marker will be activated
// If a marker is pressed, the details for a location will be activated
// If a location has been selected, the navigation will switch to “More locations“
// TODO: Add test descriptions for the details page
