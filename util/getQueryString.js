function getQueryString (route) {
  var fullPath = route.fullPath.split('?')
  return (fullPath.length > 1) ? ('?' + fullPath[1]) : ''
}

export default getQueryString
