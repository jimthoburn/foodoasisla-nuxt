<template>
  <div
    class="location-list"
    v-bind:class="{
      'has-map-location-summary': yourSelectedLocation,
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
    <location-map
      v-bind:locations="searchAreaLocations"
      v-bind:selected-location="yourSelectedLocation"
      v-bind:you-are-here="youAreHere"
      v-on:selected="onLocationSelected"
      v-on:search-this-area="onSearchThisArea"
      token="pk.eyJ1IjoiZm9vZG9hc2lzbGEiLCJhIjoiY2l0ZjdudnN4MDhpYzJvbXlpb3IyOHg2OSJ9.POBdqXF5EIsGwfEzCm8Y3Q">
    </location-map>

    <location-details
      v-if="yourSelectedLocation"
      v-bind:location="yourSelectedLocation">
    </location-details>

    <main>
      <h2><a href="#list-results" id="list-results-title">List Results</a></h2>

      <location-list
        v-bind:locations="searchAreaLocations"
        v-on:selected="onLocationSelected">
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
import LocationMap from '~/components/LocationMap.vue'
import LocationList from '~/components/LocationList.vue'
import LocationListNav from '~/components/LocationListNav.vue'
import LocationDetails from '~/components/LocationDetails.vue'

import getSortedLimitedLocations from '~/util/getSortedLimitedLocations.js'

export default {
  components: {
    LocationMap, LocationList, LocationListNav, LocationDetails
  },
  props: {
    locations: {
      type: Array,
      required: true
    },
    youAreHere: {
      type: Object,
      required: true
    },
    selectedLocation: {
      type: Object
    }
  },
  data: function () {
    return {
      searchThisArea: null,
      searchAreaName: null,
      searchAreaLocations: null,
      yourSelectedLocation: null
    }
  },
  watch: {
    locations: function (value) {
      // Save the locations passed to this view
      this.searchAreaLocations = value
    },
    selectedLocation: function (value) {
      // Save the selected location passed to this view
      this.yourSelectedLocation = value
    }
  },
  computed: {
    mapBoxSupported () {
      return true // if (process.browser) return window && 'mapboxgl' in window && window.mapboxgl.supported()
    }
  },
  created: function () {
    // Save the location passed to this view
    this.searchAreaLocations = this.locations

    // Save the selected location passed to this view
    this.yourSelectedLocation = this.selectedLocation

    this.searchThisArea = this.youAreHere // Start out by searching near you
    this.searchAreaName = this.searchThisArea.name
    if (process.browser) {
      window.addEventListener('popstate', this.onPopState.bind(this))
    }
  },
  methods: {
    onSearchThisArea: function (coordinates) {
      this.searchThisArea = {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude
      }

      this.searchAreaLocations = getSortedLimitedLocations({
        route: this.$route,
        searchThisArea: this.searchThisArea,
        youAreHere: this.youAreHere
      })

      // Scroll to the top of the list, since the list content has changed.
      document.querySelector('main').scrollTo(0, 0)

      if (process.browser) {
        this.pushState()
      }
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
      let state = {
        locations: this.searchAreaLocations,
        selectedLocation: this.yourSelectedLocation
      }

      url += window.location.search

      console.log('pushState: ' + url)
      console.dir(state)

      window.history.pushState(state, null, url)
    },
    onPopState: function (event) {
      console.log('onPopState: ')
      console.dir(event.state)

      if (event.state && event.state.locations) {
        this.searchAreaLocations = event.state.locations
      }

      if (event.state && event.state.selectedLocation) { // Back to location details
        this.setSelectedLocation(event.state.selectedLocation)
      } else { // Back to the list
        this.resetSelectedLocation()
      }
    },
    setSelectedLocation: function (location) {
      console.log('setSelectedLocation: ' + location.name)
      this.yourSelectedLocation = location

      // Scroll to the top of the page, since the page content has changed.
      if (process.browser) {
        window.scrollTo(0, 0)
      }

      setTimeout(function () {
        let locationSummary = document.querySelector('.location-summary-container')
        if (locationSummary) locationSummary.scrollTo(0, 0)
      }, 1)
    },
    resetSelectedLocation: function () {
      this.yourSelectedLocation = null

      // Scroll to the top of the page, since the page content has changed.
      if (process.browser) {
        window.scrollTo(0, 0)
      }
    }
  }
}
</script>
