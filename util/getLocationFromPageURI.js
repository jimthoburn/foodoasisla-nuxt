function getLocationFromPageURI ({route, locations}) {
  let pathName = route.path

  // Add a leading slash
  if (pathName[0] !== '/') { pathName = '/' + pathName }

  // Add a trailing slash
  if (pathName[pathName.length - 1] !== '/') { pathName = pathName + '/' }

  if (pathName !== '/locations/') {
    let location = locations.find(location => {
      return (location.uri === pathName)
    })
    if (location) return location
  }

  return null
}

export default getLocationFromPageURI
