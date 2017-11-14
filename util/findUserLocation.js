import getLocationFromPageURI from '~/util/getLocationFromPageURI.js'

// FOLA’s Mapbox Access Token
const MAP_ACCESS_TOKEN = 'pk.eyJ1IjoiZm9vZG9hc2lzbGEiLCJhIjoiY2l0ZjdudnN4MDhpYzJvbXlpb3IyOHg2OSJ9.POBdqXF5EIsGwfEzCm8Y3Q'
const MAPBOX_URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'

const LOS_ANGELES = {
  latitude: 34.052234,
  longitude: -118.243685
}

function findUserLocation ({app, route, locations}) {
  return new Promise(function (resolve, reject) {
    let address = route.query['address']
    // let longitude = route.query['longitude']
    // let latitude = route.query['latitude']

    let location = getLocationFromPageURI({route, locations})

    // If the user passed in an address, and if the Google Maps geocoder is available
    // if (address && process.browser && window && 'google' in window) {
    //   getCoordinatesFromAddress({address, route})
    //     .then(function (location) {
    //       resolve({
    //         latitude: location.latitude,
    //         longitude: location.longitude,
    //         name: location.name
    //       })
    //     })
    //     .catch(function (error) {
    //       if (console && console.error) console.error(error)
    //       resolve({
    //         latitude: LOS_ANGELES.latitude,
    //         longitude: LOS_ANGELES.longitude,
    //         label: 'Downtown Los Angeles'
    //       })
    //     })

    // if (latitude && longitude) {
    //   resolve({
    //     latitude: latitude,
    //     longitude: longitude,
    //     name: address
    //   })
    if (address) {
      getCoordinatesFromAddress({app, route, address})

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

/*
function getCoordinatesFromAddress ({address, route}) {
  return new Promise(function (resolve, reject) {
    // Add Los Angeles to the address
    if (address.indexOf('Los Angeles') < 0) {
      address += ' Los Angeles'
    }

    let geocoder = new window.google.maps.Geocoder()

    geocoder.geocode({'address': address}, function (results, status) {
      if (status === window.google.maps.GeocoderStatus.OK) {
        let latitude = results[0].geometry.location.lat()
        let longitude = results[0].geometry.location.lng()

        resolve({
          latitude: latitude,
          longitude: longitude,
          name: route.query['address']
        })
      } else {
        reject(new Error('Geocode was not successful for the following reason: ' + status))
      }
    })
  })
}
*/

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

function getCoordinatesFromAddress ({app, route, address}) {
  return new Promise(function (resolve, reject) {
    // Add Los Angeles to the address
    let addressForGeocoding = address
    if (address.indexOf('Los Angeles') < 0) {
      addressForGeocoding += ' Los Angeles'
    }

    let url = MAPBOX_URL + encodeURIComponent(addressForGeocoding) + '.json?limit=1&access_token=' + MAP_ACCESS_TOKEN

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

export default findUserLocation
