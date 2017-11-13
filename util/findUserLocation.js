import getLocationFromPageURI from '~/util/getLocationFromPageURI.js'

const LOS_ANGELES = {
  latitude: 34.052234,
  longitude: -118.243685
}

function findUserLocation ({route, locations}) {
  return new Promise(function (resolve, reject) {
    // let address = route.query['address']
    let location = getLocationFromPageURI({route, locations})

    // If the user passed in an address, and if the Google Maps geocoder is available
    // if (address && 'google' in window) {
    //   // getCoordinatesFromAddress({address, callback})
    //   resolve({
    //     latitude: location.latitude,
    //     longitude: location.longitude,
    //     name: location.name
    //   })

    // If we’re on a location detail page, use that location’s coordinates as the user’s location
    if (location) {
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
function getCoordinatesFromAddress ({address, callback}) {
  // Add Los Angeles to the address
  if (address.indexOf('Los Angeles') < 0) {
    address += ' Los Angeles'
  }

  let geocoder = new google.maps.Geocoder()

  geocoder.geocode({'address': address}, function (results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      let latitude = results[0].geometry.location.lat()
      let longitude = results[0].geometry.location.lng()

      setLastUserLocation({
        latitude: latitude,
        longitude: longitude,
        name: window.oasis.getParameterByName('address'),
        wasFound: true
      })
      if (callback) callback(getLastUserLocation())
    } else {
      console.error('Geocode was not successful for the following reason: ' + status)
      setLastUserLocation({
        latitude: LOS_ANGELES.latitude,
        longitude: LOS_ANGELES.longitude,
        label: 'Downtown Los Angeles'
      })
      if (callback) callback(getLastUserLocation())
    }
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

export default findUserLocation
