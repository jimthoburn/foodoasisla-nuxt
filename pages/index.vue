<template>
  <div
    class="location-list"
    id="vue-location-list"
    v-bind:class="{
      'has-map-location-summary': selectedLocation,
      'has-active-map': mapBoxSupported
    }">

    <header class="header">

      <div class="primary-nav">

        <h2>
          <a href="/"><img src="/assets/images/fola.svg" width="100" alt="Food Oasis Los Angeles" /></a>
        </h2>
        <p class="tagline">Healthy Food for All Angelenos</p>

        <p class="nav-link">
          <a href="/#navigation">
            <svg width="22" height="19" viewBox="0 0 22 19">
            <switch>
              <g>
                <polygon points="0.450127877 18.1050725 21.5498721 18.1050725 21.5498721 13.9746377 0.450127877 13.9746377"></polygon>
                <polygon points="0.450127877 5.02536232 21.5498721 5.02536232 21.5498721 0.894927536 0.450127877 0.894927536"></polygon>
                <polygon points="0.450127877 11.5652174 21.5498721 11.5652174 21.5498721 7.43478261 0.450127877 7.43478261"></polygon>
              </g>
              <foreignobject>
                Menu
              </foreignobject>
            </switch>
          </svg>
          </a>
        </p>

      </div>
      <!-- /.primary -->

      <location-list-nav v-bind:search-area-name="searchAreaName" v-on:back="onBackToList"></location-list-nav>

    </header>

    <!-- FOLA’s Mapbox API key (token) -->
<!--     <location-map
      v-bind:locations="locations"
      v-bind:selected-location="selectedLocation"
      v-bind:you-are-here="youAreHere"
      v-on:selected="onLocationSelected"
      v-on:search-this-area="onSearchThisArea"
      token="pk.eyJ1IjoiZm9vZG9hc2lzbGEiLCJhIjoiY2l0ZjdudnN4MDhpYzJvbXlpb3IyOHg2OSJ9.POBdqXF5EIsGwfEzCm8Y3Q">
    </location-map> -->

    <location-details
      v-if="selectedLocation"
      v-bind:location="selectedLocation"
      id="map-location-summary">
    </location-details>

    <main>
      <h2><a href="#list-results" id="list-results-title">List Results</a></h2>

      <location-list
        v-bind:locations="locations"
        v-on:selected="onLocationSelected"
        id="list-results">
      </location-list>

      <!--
      <div class="pagination">
        <p><a href="/locations/page3/"><span>Next 20 results</span> <img src="/assets/images/icons/forward.svg" alt="" /></a></p>
      </div>
      -->
    </main>

  </div>
</template>

<script>
/*
import LocationMap from '~/components/LocationMap.vue'
*/
import LocationList from '~/components/LocationList.vue'
import LocationListNav from '~/components/LocationListNav.vue'
import LocationDetails from '~/components/LocationDetails.vue'

import sortByClosest from '~/util/sortByClosest.js'
import findUserLocation from '~/util/findUserLocation.js'
// import getLocationFromPageURI from '~/util/getLocationFromPageURI.js'

import locations from '~/data/locations.js'

let listOffset = 0
const listLimit = 20

function getSortedLimitedLocations ({route, youAreHere, searchThisArea = {}}) {
  if (!searchThisArea.latitude || !searchThisArea.longitude) {
    searchThisArea.latitude = youAreHere.latitude
    searchThisArea.longitude = youAreHere.longitude
  }

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

/*
let locationsPromise
if (process.browser) {
  locationsPromise = System.import('~/data/locations.js')
} else {
  locationsPromise = Promise.resolve(require('~/data/locations.js'))
}
*/

export default {
  name: 'foodoasis-la',
  components: {
    // LocationMap, LocationList, LocationListNav, LocationDetails
    LocationList, LocationListNav, LocationDetails
  },
  data: function () {
  },
  asyncData: function ({ route }, callback) {
    findUserLocation({route, locations})
      .then(function (youAreHere) {
        let sortedLocations = getSortedLimitedLocations({route, youAreHere})

        // let selectedLocation = getLocationFromPageURI({route, sortedLocations})

        callback(null, {
          locations: sortedLocations,
          youAreHere: youAreHere,
          searchThisArea: youAreHere,
          searchAreaName: youAreHere.name,
          selectedLocation: null // selectedLocation
        })
      })
  },
  // async asyncData () {
  //   let locations = await locationsPromise
  //   return { locations }
  // },
  computed: {
    mapBoxSupported () {
      // return window && 'mapboxgl' in window && window.mapboxgl.supported()
    }
  },
  created: function () {
    // if (console && console.dir) console.dir(this.$root)

    // window.addEventListener('popstate', this.onPopState.bind(this))
    // if (console && console.dir) console.dir(this.locations)
  },
  methods: {
    onSearchThisArea: function (coordinates) {
      this.searchThisArea = {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude
      }

      this.locations = getSortedLimitedLocations({
        route: this.$route,
        searchThisArea: this.searchThisArea,
        youAreHere: this.youAreHere
      })

      // Scroll to the top of the list, since the list content has changed.
      document.querySelector('main').scrollTo(0, 0)

      // this.pushState()
    },
    onBackToList: function (event) {
      this.resetSelectedLocation()
      this.pushState('/locations/')
    },
    onLocationSelected: function (location) {
      this.setSelectedLocation(location)
      this.pushState(location.uri)
    },
    pushState: function (url) {
      // let state = {
      //   locations: this.locations,
      //   selectedLocation: this.selectedLocation
      // }

      // url += window.location.search

      console.log('pushState: ' + url)

      // window.history.pushState(state, null, url)
    },
    onPopState: function (event) {
      console.log('onPopState: ')
      console.dir(event.state)

      if (event.state && event.state.locations) {
        this.locations = event.state.locations
      }

      if (event.state && event.state.selectedLocation) { // Back to location details
        this.setSelectedLocation(event.state.selectedLocation)
      } else { // Back to the list
        this.resetSelectedLocation()
      }
    },
    setSelectedLocation: function (location) {
      console.log('setSelectedLocation: ' + location.name)
      this.selectedLocation = location

      // Scroll to the top of the page, since the page content has changed.
      // window.scrollTo(0, 0)

      setTimeout(function () {
        let locationSummary = document.querySelector('.location-summary-container')
        if (locationSummary) locationSummary.scrollTo(0, 0)
      }, 1)
    },
    resetSelectedLocation: function () {
      this.selectedLocation = null

      // Scroll to the top of the page, since the page content has changed.
      // window.scrollTo(0, 0)
    }
  }
}
</script>

