// KUDOS: https://stackoverflow.com/questions/5505085/flatten-a-javascript-object-to-pass-as-querystring#answer-39828481
function toQueryString (paramsObject) {
  return Object
    .keys(paramsObject)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(paramsObject[key])}`)
    .join('&')
}

function getQueryString (route) {
  let queryString = toQueryString(route.query)
  if (queryString !== '') queryString = '?' + queryString
  return queryString
}

export default getQueryString
