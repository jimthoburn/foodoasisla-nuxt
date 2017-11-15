import getLocationFromPageURI from '~/util/getLocationFromPageURI.js'

const LOS_ANGELES = {
  latitude: 34.052234,
  longitude: -118.243685
}

// Los Angeles County boundaries
const MAP_BOUNDS = [
  [-119.9442369, 32.7089729], // Southwest coordinates
  [-116.63282912, 35.8275538] // Northeast coordinates
]

// FOLA’s Mapbox Access Token
const MAP_ACCESS_TOKEN = 'pk.eyJ1IjoiZm9vZG9hc2lzbGEiLCJhIjoiY2l0ZjdudnN4MDhpYzJvbXlpb3IyOHg2OSJ9.POBdqXF5EIsGwfEzCm8Y3Q'
const MAPBOX_URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'

function findUserLocation ({route, app, locations}) {
  return new Promise(function (resolve, reject) {
    let address = route.query['address']
    let location = getLocationFromPageURI({route, locations})

    if (address) {
      getLocationFromAddress({app, address})
        .then(function (location) {
          resolve(location)
        })
        .catch(function (error) {
          console.error(error)
          resolve({
            latitude: LOS_ANGELES.latitude,
            longitude: LOS_ANGELES.longitude,
            name: 'Downtown Los Angeles'
          })
        })

    // If we’re on a location detail page, use that location’s coordinates as the user’s location
    } else if (location) {
      resolve({
        latitude: location.latitude,
        longitude: location.longitude,
        name: location.name
      })

    // Else if automatic geolocation is available
    // } else if ("geolocation" in navigator) {

      // getCoordinatesFromDevice(callback);
    } else {
      resolve({
        latitude: LOS_ANGELES.latitude,
        longitude: LOS_ANGELES.longitude,
        name: 'Downtown Los Angeles'
      })
    }
  })
}

function getLocationFromAddress ({app, address}) {
  return new Promise(function (resolve, reject) {
    // Add the words “Los Angeles” to the address
    let addressForGeocoding = address
    if (address.indexOf('Los Angeles') < 0) {
      addressForGeocoding += ' Los Angeles'
    }

    // OPTIONAL: Limit the search to a “bounding box” around Los Angeles County
    let bbox = `${MAP_BOUNDS[0][0]},${MAP_BOUNDS[0][1]},${MAP_BOUNDS[1][0]},${MAP_BOUNDS[1][1]}`

    // https://www.mapbox.com/api-documentation/#request-format
    let url = MAPBOX_URL + encodeURIComponent(addressForGeocoding) + '.json?limit=1&bbox=' + bbox + '&access_token=' + MAP_ACCESS_TOKEN

    // const response = await app.$axios.$get(url)

    app.$axios.$get(url)
      .then(function (response) {
        resolve({
          latitude: response.features[0].center[1],
          longitude: response.features[0].center[0],
          name: address
        })
      })
      .catch(function (error) {
        reject(error)
      })
  })
}

/*
function getCoordinatesFromDevice (callback) {
  navigator.geolocation.getCurrentPosition(function (position) {
    setLastUserLocation({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      name: 'you',
      wasFound: true
    })
    if (callback) callback(getLastUserLocation())
  }, function () {
    console.error('Unable to retrieve your location')

    setLastUserLocation({
      latitude: LOS_ANGELES.latitude,
      longitude: LOS_ANGELES.longitude,
      name: 'Downtown Los Angeles'
    })
    if (callback) callback(getLastUserLocation())
  })
}
*/

export default findUserLocation
