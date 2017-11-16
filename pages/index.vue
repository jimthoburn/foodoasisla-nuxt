<template>
  <div
    class="location-list"
    v-bind:class="{
      'has-map-location-summary': selectedLocation,
      'has-active-map': mapBoxSupported
    }">

    <header class="header">

      <div class="primary-nav">

        <h2>
          <a href="https://foodoasis.la/"><img src="/assets/images/fola.svg" width="100" alt="Food Oasis Los Angeles" /></a>
        </h2>
        <p class="tagline">Healthy Food for All Angelenos</p>

        <p class="nav-link">
          <a href="https://foodoasis.la/#navigation">
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
    <location-map
      v-bind:locations="limitedLocations"
      v-bind:selected-location="selectedLocation"
      v-bind:you-are-here="youAreHere"
      v-on:selected="onLocationSelected"
      v-on:search-this-area="onsearchArea"
      token="pk.eyJ1IjoiZm9vZG9hc2lzbGEiLCJhIjoiY2l0ZjdudnN4MDhpYzJvbXlpb3IyOHg2OSJ9.POBdqXF5EIsGwfEzCm8Y3Q">
    </location-map>

    <location-details
      v-if="selectedLocation"
      v-bind:location="selectedLocation">
    </location-details>

    <main>
      <h2><a href="#list-results" id="list-results-title">List Results</a></h2>

      <location-list
        v-bind:locations="limitedLocations"
        v-on:selected="onLocationSelected">
      </location-list>

      <div class="pagination" v-if="nextPageURL">
        <p><a v-bind:href="nextPageURL" v-on:click="onNextPage"><span>Next {{ itemsPerPage }} results</span> <img src="/assets/images/icons/forward.svg" alt="" /></a></p>
      </div>
    </main>
  </div>
</template>

<script>
import LocationMap from '~/components/LocationMap.vue'
import LocationList from '~/components/LocationList.vue'
import LocationListNav from '~/components/LocationListNav.vue'
import LocationDetails from '~/components/LocationDetails.vue'

import findUserLocation from '~/util/findUserLocation.js'
import getLocationFromPageURI from '~/util/getLocationFromPageURI.js'
import getLocationsWithCategories from '~/util/getLocationsWithCategories.js'
import sortByClosest from '~/util/sortByClosest.js'
import getUpdatedQueryString from '~/util/getUpdatedQueryString.js'

import locationsData from '~/data/locations.js'

// TBD: Consider adding this data in locations.js
let locations = getLocationsWithCategories(locationsData)

const itemsPerPage = 20
let popstateListener

function getLimitedLocations (pageNumber) {
  // If we’ve exceeded the size of the list
  // if ((pageNumber - 1) * itemsPerPage >= locations.length) {
  //   return []
  // }

  let offset = (pageNumber - 1) * itemsPerPage
  let limit = itemsPerPage

  let upperBound = offset + limit
  if (upperBound > locations.length) upperBound = locations.length

  return locations.slice(offset, upperBound)

  // return this.locations.slice((pageNumber - 1) * itemsPerPage, itemsPerPage)
}

export default {
  components: {
    LocationMap, LocationList, LocationListNav, LocationDetails
  },
  asyncData: function ({route, app}, callback) {
    findUserLocation({route, app, locations})
      .then(function (youAreHere) {
        let selectedLocation = getLocationFromPageURI({route, locations})
        let searchArea = (selectedLocation !== null) ? selectedLocation : youAreHere
        let pageNumber = route.query['page']
        if (!pageNumber || selectedLocation) {
          pageNumber = 1
        }
        pageNumber = Number(pageNumber)

        locations = sortByClosest({
          route,
          youAreHere,
          searchArea,
          locations: locations
        })
        callback(null, {
          searchArea: searchArea,
          youAreHere: youAreHere,
          selectedLocation: selectedLocation,
          limitedLocations: getLimitedLocations(pageNumber),
          pageNumber: pageNumber
        })
      })
  },
  created () {
    console.log('created')
    this.searchArea = this.youAreHere // Start out by searching near you

    if (process.browser) {
      popstateListener = this.onPopState.bind(this)
      window.addEventListener('popstate', popstateListener)
    }
  },
  destroyed () {
    console.log('destroyed')
    if (process.browser) {
      if (popstateListener) window.removeEventListener('popstate', popstateListener)
    }
  },
  // data () {
  //   return {
  //     pageNumber: 1
  //   }
  // },
  computed: {
    mapBoxSupported () {
      return true // if (process.browser) return window && 'mapboxgl' in window && window.mapboxgl.supported()
    },
    itemsPerPage () {
      return itemsPerPage
    },
    nextPageURL () {
      // if ((data.list_offset + ITEMS_PER_PAGE) < size) {
      //   data.next = '/' + uri + '/page' + (pageNumber + 1) + '/';
      // }

      if (this.pageNumberIsInRange(this.pageNumber)) {
        return '/locations/' + getUpdatedQueryString({route: this.$route, key: 'page', value: (this.pageNumber + 1)})
      }
    },
    searchAreaName () {
      return this.youAreHere ? this.youAreHere.name : null
    }
  },
  methods: {
    pageNumberIsInRange (pageNumber) {
      return pageNumber * itemsPerPage < locations.length
    },
    onNextPage: function (e) {
      // If the user wants to open the link in a new window, let the browser handle it.
      if (e && (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey)) return

      e.preventDefault()

      this.pushState(this.nextPageURL)

      this.pageNumber++

      locations = sortByClosest({
        route: this.$route,
        youAreHere: this.youAreHere,
        searchArea: this.searchArea,
        locations: locations
      })
      this.limitedLocations = getLimitedLocations(this.pageNumber)

      if (process.browser) {
        // Scroll to the top of the list, since the list content has changed.
        document.querySelector('main').scrollTo(0, 0)

        window.scrollTo(0, 0)
      }
    },
    onsearchArea: function (coordinates) {
      this.pageNumber = 1

      this.searchArea = {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude
      }

      locations = sortByClosest({
        route: this.$route,
        youAreHere: this.youAreHere,
        searchArea: this.searchArea,
        locations: locations
      })
      this.limitedLocations = getLimitedLocations(this.pageNumber)

      if (process.browser) {
        // Scroll to the top of the list, since the list content has changed.
        document.querySelector('main').scrollTo(0, 0)

        window.scrollTo(0, 0)
      }

      if (process.browser) {
        this.pushState()
      }
    },
    onBackToList: function (event) {
      this.resetSelectedLocation()
      if (process.browser) {
        this.pushState('/locations/' + window.location.search)
      }
    },
    onLocationSelected: function (location) {
      this.setSelectedLocation(location)
      if (process.browser) {
        this.pushState(location.uri + window.location.search)
      }
    },
    pushState: function (url) {
      let state = {
        searchArea: this.searchArea,
        limitedLocations: this.limitedLocations,
        selectedLocation: this.selectedLocation
      }

      console.log('pushState: ' + url)
      console.dir(state)

      window.history.pushState(state, null, url)
    },
    onPopState: function (event) {
      console.log('onPopState: ')
      console.dir(event.state)

      if (event.state && event.state.locations) {
        this.limitedLocations = event.state.limitedLocations
        this.searchArea = event.state.searchArea
      }

      if (event.state && event.state.selectedLocation) { // Back to location details
        this.setSelectedLocation(event.state.selectedLocation)
      } else { // Back to the list
        this.resetSelectedLocation()
      }

      if (process.browser) {
        // Scroll to the top of the list, since the list content has changed.
        document.querySelector('main').scrollTo(0, 0)

        window.scrollTo(0, 0)
      }
    },
    setSelectedLocation: function (location) {
      console.log('setSelectedLocation: ' + location.name)
      this.selectedLocation = location

      // Scroll to the top of the page, since the page content has changed.
      if (process.browser) {
        window.scrollTo(0, 0)

        setTimeout(function () {
          let locationSummary = document.querySelector('.location-summary-container')
          if (locationSummary) locationSummary.scrollTo(0, 0)
        }, 1)
      }
    },
    resetSelectedLocation: function () {
      this.selectedLocation = null

      // Scroll to the top of the page, since the page content has changed.
      if (process.browser) {
        window.scrollTo(0, 0)
      }
    }
  }
}
</script>
