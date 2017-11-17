import Vuex from 'vuex'

import sortByClosest from '~/util/sortByClosest.js'
import getLocationsWithCategories from '~/util/getLocationsWithCategories.js'

import communityGardens from '~/data/community-garden.min.js'
// import farmersMarkets from '~/data/farmers-market.min.js'
// import foodPantries from '~/data/food-pantry.min.js'
// import summerPrograms from '~/data/summer-lunch.min.js'
// import supermarkets from '~/data/supermarket.min.js'

// TBD: Consider adding this data in the data files ahead of time
let locations = getLocationsWithCategories([
  ...communityGardens
  // ...farmersMarkets,
  // ...foodPantries,
  // ...summerPrograms,
  // ...supermarkets
])

const itemsPerPage = 20

// https://vuex.vuejs.org/en/core-concepts.html
const createStore = () => {
  return new Vuex.Store({
    state: {
      locations: locations,
      itemsPerPage: itemsPerPage
      // selectedLocation: null
    },
    getters: {
      locations: (state, getters) => (pageNumber) => {
        let offset = (pageNumber - 1) * itemsPerPage
        let limit = itemsPerPage

        let upperBound = offset + limit
        if (upperBound > locations.length) upperBound = locations.length

        return state.locations.slice(offset, upperBound)
      }
    },
    mutations: {
      sortLocationsByClosest (state, payload) {
        state.locations = sortByClosest({
          route: payload.route,
          youAreHere: payload.youAreHere,
          searchArea: payload.searchArea,
          locations: state.locations
        })
      }
      // setSelectedLocation (state, selectedLocation) {
      //   state.selectedLocation = selectedLocation
      // },
      // resetSelectedLocation (state) {
      //   state.selectedLocation = null
      // }
    }
  })
}

export default createStore
