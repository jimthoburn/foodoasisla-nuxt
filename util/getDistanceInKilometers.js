// http://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula/27943#answer-27943
function getDistanceInKilometers (lat1, lon1, lat2, lon2) {
  const R = 6371 // Radius of the earth in km
  let dLat = deg2rad(lat2 - lat1)
  let dLon = deg2rad(lon2 - lon1)
  let a =
  Math.sin(dLat / 2) * Math.sin(dLat / 2) +
  Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
  Math.sin(dLon / 2) * Math.sin(dLon / 2)

  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  let d = R * c // Distance in km
  return d
}

// Convert Degress to Radians
function deg2rad (deg) {
  return deg * (Math.PI / 180)
}

export default getDistanceInKilometers
