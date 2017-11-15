import sortByClosest from '~/util/sortByClosest.js'

import locations from '~/data/locations.js'

const listOffset = 0
const listLimit = 20

function getSortedLimitedLocations ({route, youAreHere, searchThisArea}) {
  let limitedList = sortByClosest({
    route: route,
    locations: locations,
    offset: listOffset,
    limit: listLimit,
    youAreHere: youAreHere,
    searchThisArea: searchThisArea
  })

  for (let index = 0; index < limitedList.length; index++) {
    let category = limitedList[index].category.toLowerCase().replace(/\s/g, '-') // Example: farmers-market

    limitedList[index].id = index
    limitedList[index].categoryCode = getCategoryCode(category)
    limitedList[index].parentCategoryCode = getParentCategoryCode(category)
  }

  return limitedList
}

function getCategoryCode (category) {
  // SHIM: Should we handle this in the CSS instead?
  switch (category) {
    case 'food-pantry':
    case 'summer-lunch':
    case 'community-garden':
    case 'farmers-market':
    case 'supermarket':
    case 'restaurant':
    case 'orchard':
    case 'pop-up-market':
      return category
    case 'cultivate-la':
      return 'community-garden'
  }

  return 'restaurant'
}

function getParentCategoryCode (category) {
  // SHIM: Should we handle this in the CSS instead?
  switch (category) {
    case 'supermarket':
    case 'restaurant':
    case 'pop-up-market':
    case 'farmers-market':
      return 'buy'
    case 'summer-lunch':
    case 'food-pantry':
    case 'orchard':
      return 'free'
    case 'community-garden':
    case 'cultivate-la':
      return 'grow'
  }

  return 'buy'
}

export default getSortedLimitedLocations
