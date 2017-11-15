import findUserLocation from '~/util/findUserLocation.js'
import getLocationFromPageURI from '~/util/getLocationFromPageURI.js'
import getSortedLimitedLocations from '~/util/getSortedLimitedLocations.js'

import locations from '~/data/locations.js'

function getLocationsData ({route, app}, callback) {
  findUserLocation({route, app, locations})
    .then(function (youAreHere) {
      let sortedLocations = getSortedLimitedLocations({route, youAreHere})
      let selectedLocation = getLocationFromPageURI({route, locations})
      callback(null, {
        locations: sortedLocations,
        youAreHere: youAreHere,
        searchThisArea: youAreHere,
        searchAreaName: youAreHere.name,
        selectedLocation: selectedLocation
      })
    })
}

/*
let locationsPromise
if (process.browser) {
  locationsPromise = System.import('~/data/locations.js')
} else {
  locationsPromise = Promise.resolve(require('~/data/locations.js'))
}
*/

export default getLocationsData
