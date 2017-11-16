// KUDOS: https://stackoverflow.com/questions/5505085/flatten-a-javascript-object-to-pass-as-querystring#answer-39828481
function convertObjectToString (queryObject) {
  return Object
    .keys(queryObject)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryObject[key])}`)
    .join('&')
}

function getUpdatedQueryString ({route, key, value}) {
  // Make a copy of route.query
  let queryObject = {...route.query}

  // Add the new value
  queryObject[key] = value

  let queryString = convertObjectToString(queryObject)
  if (queryString !== '') queryString = '?' + queryString

  return queryString
}

export default getUpdatedQueryString
