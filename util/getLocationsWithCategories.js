
function getLocationsWithCategories (locations) {
  for (let index = 0; index < locations.length; index++) {
    let category = locations[index].category.toLowerCase().replace(/\s/g, '-') // Example: farmers-market

    locations[index].id = index
    locations[index].categoryCode = getCategoryCode(category)
    locations[index].parentCategoryCode = getParentCategoryCode(category)
  }

  return locations
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

export default getLocationsWithCategories
