<template>
  <div
    class="location-list"
    v-bind:class="{
      'has-map-location-summary': selectedLocation,
      'has-active-map': mapBoxSupported
    }">

    <location-details
      v-if="selectedLocation"
      v-bind:location="selectedLocation">
    </location-details>
  </div>
</template>

<script>
import LocationMap from '~/components/LocationMap.vue'
import LocationList from '~/components/LocationList.vue'
import LocationListNav from '~/components/LocationListNav.vue'
import LocationDetails from '~/components/LocationDetails.vue'

import findUserLocation from '~/util/findUserLocation.js'
import getLocationFromPageURI from '~/util/getLocationFromPageURI.js'
import getUpdatedQueryString from '~/util/getUpdatedQueryString.js'

let popstateListener

export default {
  head () {
    return {
      title: 'Healthy food in Los Angeles'
    }
  },
  components: {
    LocationMap, LocationList, LocationListNav, LocationDetails
  },
  asyncData: function ({route, app, store}, callback) {
    findUserLocation({route, app, locations: store.state.locations})
      .then(function (youAreHere) {
        let selectedLocation = getLocationFromPageURI({route, locations: store.state.locations})
        let searchArea = (selectedLocation !== null) ? selectedLocation : youAreHere
        let pageNumber = route.query['page']
        if (!pageNumber || selectedLocation) {
          pageNumber = 1
        }
        pageNumber = Number(pageNumber)

        store.commit('sortLocationsByClosest', {
          route: route,
          youAreHere: youAreHere,
          searchArea: searchArea
        })

        callback(null, {
          searchArea: searchArea,
          youAreHere: youAreHere,
          selectedLocation: selectedLocation,
          limitedLocations: store.getters.locations(pageNumber),
          pageNumber: pageNumber
        })
      })
  },
  created () {
    // console.log('created')
    this.searchArea = this.youAreHere // Start out by searching near you

    if (process.browser) {
      popstateListener = this.onPopState.bind(this)
      window.addEventListener('popstate', popstateListener)
    }
  },
  destroyed () {
    // console.log('destroyed')
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
      return this.$store.state.itemsPerPage
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
      if (this.searchArea && this.searchArea.name) {
        return this.searchArea.name
      } else if (this.youAreHere && this.youAreHere.name) {
        return this.youAreHere.name
      } else {
        return 'Los Angeles'
      }
    }
  },
  methods: {
    pageNumberIsInRange (pageNumber) {
      return pageNumber * this.$store.state.itemsPerPage < this.$store.state.locations.length
    },
    onNextPage: function (e) {
      // If the user wants to open the link in a new window, let the browser handle it.
      if (e && (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey)) return

      e.preventDefault()

      this.pushState(this.nextPageURL)

      this.pageNumber++

      // this.$router.push({path: '/locations/', query: {...this.$route.query, page: this.pageNumber}})

      this.$store.commit('sortLocationsByClosest', {
        route: this.$route,
        youAreHere: this.youAreHere,
        searchArea: this.searchArea
      })

      this.limitedLocations = this.$store.getters.locations(this.pageNumber)

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

      this.$store.commit('sortLocationsByClosest', {
        route: this.$route,
        youAreHere: this.youAreHere,
        searchArea: this.searchArea
      })

      this.limitedLocations = this.$store.getters.locations(this.pageNumber)

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

      // console.log('pushState: ' + url)
      // console.dir(state)

      window.history.pushState(state, null, url)
    },
    onPopState: function (event) {
      // console.log('onPopState: ')
      // console.dir(event.state)

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
      // console.log('setSelectedLocation: ' + location.name)
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
