// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage
// http://nightwatchjs.org/api

// TODO: Load these from the store and configuration
const itemsPerPage = 20

module.exports = {

  'The locations page exists': function (browser) {
    browser.url('http://localhost:3000/locations/')
  },

  'The locations page has a list of locations': function (browser) {
    browser.waitForElementPresent('ul.location-list', 5000)
  },

  'The list of locations has a length equal to the “itemsPerPage”': function (browser) {
    browser.elements('css selector', 'ul.location-list li', function(res) {
      browser.assert.strictEqual(res.value.length, itemsPerPage)
    })
  },

  'The number of map markers is the same as the number of locations in the list': function (browser) {
    browser.waitForElementPresent('#map', 5000)
    browser.elements('css selector', '#map .marker', function(res) {
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
    browser.expect.element('ul.location-list .distance').text.to.match(/[0-9]+.*/) // a number followed by anything
  },

  'The locations are sorted by distance from the search area': function (browser) {
    browser.elements('css selector', 'ul.location-list .distance span', function(res) {
      let lastDistance = 0
      res.value.forEach((location, index) => {
        browser.elementIdText(location.ELEMENT, textResult => {
          let nextDistance = Number(textResult.value)

          // console.log('nextDistance: ' + nextDistance)
          // console.log('lastDistance: ' + lastDistance)

          browser.assert.ok(nextDistance >= lastDistance)

          lastDistance = nextDistance
        })
      })
    })
  },

  'If a list item is pressed, the details for that location will be visible': function (browser) {
    browser.url('http://localhost:3000/locations/?type=farmers-market')
      .waitForElementPresent('ul.location-list', 5000)
    browser.getText("ul.location-list a h2", function(result) {
      let name = result.value
      browser.click('ul.location-list a', function(response) {
        browser.expect.element('.location-summary h2').text.to.equal(name)
      })
    })
  },

  'If a location has been selected, the navigation will switch to “More locations“': function (browser) {
    browser.url('http://localhost:3000/locations/?type=farmers-market')
      .waitForElementPresent('ul.location-list', 5000)
    browser.click('ul.location-list a', function(response) {
      browser.expect.element('nav .search').to.not.be.visible
      browser.expect.element('nav .back').to.be.visible
    })
  },

  'After the back button is pressed, the navigation will show the search button again': function (browser) {
    browser.click('.back a', function(response) {
      browser.expect.element('nav .search').to.be.visible
      browser.expect.element('nav .back').to.not.be.visible
    })
  },

  'If a list item is pressed, then the corresponding marker in the map will be activated': function (browser) {
    browser.url('http://localhost:3000/locations/?type=farmers-market')
      .waitForElementPresent('ul.location-list', 5000)
      .waitForElementPresent('#map', 5000)
    browser.getText("ul.location-list a h2", function(result) {
      let name = result.value
      browser.click('ul.location-list a', function(response) {
        browser.expect.element('#map .active .marker-label').text.to.equal(name)
      })
    })
  },

  'If a marker is pressed, the details for a location will be activated': function (browser) {
    browser.url('http://localhost:3000/locations/?type=farmers-market')
      .waitForElementPresent('ul.location-list', 5000)
      .waitForElementPresent('#map .marker', 5000)
    browser.click('#map .marker', function(response) {
      browser.getText("#map .marker .marker-label", function(result) {
        let name = result.value
        browser.expect.element('.location-summary h2').text.to.equal(name)
      })
    })
  },

  'If a type parameter is present with a value of “farmers-market”, all of the locations on the page will have type of “Farmers Market”': function (browser) {
    browser.url('http://localhost:3000/locations/?type=farmers-market').waitForElementPresent('ul.location-list', 5000)
    browser.elements('css selector', 'ul.location-list .type', function(res) {
      res.value.forEach((location, index) => {
        browser.elementIdText(location.ELEMENT, textResult => {
          browser.assert.strictEqual(textResult.value, 'Farmers Market')
        })
      })
    })
  },

  'If an open now parameter is present with a value of 1, all of the locations on the page will be open now': function (browser) {
    browser.url('http://localhost:3000/locations/?open=1').waitForElementPresent('ul.location-list', 5000)
    browser.elements('css selector', 'ul.location-list .open', function(res) {
      browser.assert.strictEqual(res.value.length, itemsPerPage)
    })
  },

  'If no locations matched the search critera, a special message will show': function (browser) {
    browser.url('http://localhost:3000/locations/?open=1&type=community-garden').waitForElementPresent('main', 5000)
    browser.expect.element('main ul.location-list').to.not.be.present
    browser.expect.element('main .message').to.be.present
    browser.expect.element('main .message h1').text.to.contain('We couldn’t find any matching locations.')
  },

  // If the current time is nine o’clock in the morning on Thursday, the “L.A. City Hall (Little Tokyo CFM)” location will indicate that it not open
  // If the current time is ten o’clock in the morning on Thursday, the “L.A. City Hall (Little Tokyo CFM)” location will indicate that it is open
  // If Mapbox is supported, a map will be rendered on the page
  // 
  // TODO: Add test descriptions for the details page


  'Close browser session': function (browser) {
    browser.end()
  }

}
