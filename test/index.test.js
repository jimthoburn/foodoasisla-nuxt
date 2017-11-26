// https://nuxtjs.org/guide/development-tools#end-to-end-testing
import test from 'ava'
import { Nuxt, Builder } from 'nuxt'
import { resolve } from 'path'

// We keep the nuxt and server instance
// So we can close them at the end of the test
let nuxt = null

// Init Nuxt.js and create a server listening on localhost:4000
test.before('Init Nuxt.js', async t => {
  const rootDir = resolve(__dirname, '..')
  let config = {}
  try { config = require(resolve(rootDir, 'nuxt.config.js')) } catch (e) {}
  config.rootDir = rootDir // project folder
  config.dev = true // false = production build
  nuxt = new Nuxt(config)
  await new Builder(nuxt).build()
  await nuxt.listen(4000, 'localhost')
})

test('Route /locations/ exists and has this text in the rendered HTML: Healthy food in Los Angeles', async t => {
  let context = {}
  const { html } = await nuxt.renderRoute('/locations/', context)
  t.true(html.includes('Healthy food in Los Angeles'))
})

test('Route /locations/ exists and has this text in the <title> element: Healthy food in Los Angeles', async t => {
  const window = await nuxt.renderAndGetWindow('http://localhost:4000/locations/')
  const element = window.document.querySelector('title')
  t.not(element, null)
  t.is(element.textContent, 'Healthy food in Los Angeles')
})

test('Route /locations/ contains a list of locations with a length equal to the itemsPerPage in the store', async t => {
  const window = await nuxt.renderAndGetWindow('http://localhost:4000/locations/')
  const locationList = window.document.querySelector('.location-list')
  const locationListItems = window.document.querySelectorAll('.location-list li')
  const itemsPerPage = locationList.__vue__.$store.state.itemsPerPage
  t.true(locationListItems.length === itemsPerPage) // TBD: JSDOM seems to produce four extra empty nodes at the start of the list
})

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


// Close server and ask nuxt to stop listening to file changes
test.after('Closing server and nuxt.js', t => {
  nuxt.close()
})
