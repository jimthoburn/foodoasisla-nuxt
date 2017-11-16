<template>
  <locations
    v-bind:locations="locations" 
    v-bind:you-are-here="youAreHere"
    v-bind:selected-location="selectedLocation"
    v-bind:page-number="pageNumber"
    v-bind:items-per-page="itemsPerPage"
    v-bind:next-page-url="nextPageURL"
    v-on:next-page="onNextPage">
  </locations>
</template>

<script>
import Locations from '~/components/Locations.vue'

import findUserLocation from '~/util/findUserLocation.js'
import getLocationFromPageURI from '~/util/getLocationFromPageURI.js'
import getSortedLimitedLocations from '~/util/getSortedLimitedLocations.js'
import getUpdatedQueryString from '~/util/getUpdatedQueryString.js'

import locations from '~/data/locations.js'

const itemsPerPage = 20

function getPageNumberFromRoute (route) {
  let page = route.query['page']
  if (!page) {
    page = 1
  }
  return Number(page)
}

export default {
  components: { Locations },
  asyncData: function ({route, app}, callback) {
    findUserLocation({route, app, locations})
      .then(function (youAreHere) {
        let selectedLocation = getLocationFromPageURI({route, locations})
        let searchThisArea = (selectedLocation !== null) ? selectedLocation : youAreHere
        let pageNumber = getPageNumberFromRoute(route)
        let sortedLocations = getSortedLimitedLocations({
          route,
          youAreHere,
          searchThisArea,
          pageNumber: getPageNumberFromRoute(route),
          itemsPerPage: itemsPerPage
        })
        callback(null, {
          locations: sortedLocations,
          youAreHere: youAreHere,
          selectedLocation: selectedLocation,
          pageNumber: pageNumber,
        })
      })
  },
  computed: {
    itemsPerPage () {
      return itemsPerPage
    },
    listOffset () {
      return (this.pageNumber - 1) * itemsPerPage
    },
    pageNumberIsInRange (pageNumber) {
      return pageNumber * itemsPerPage < locations.length
    },
    nextPageURL () {
      // if ((data.list_offset + ITEMS_PER_PAGE) < size) {
      //   data.next = '/' + uri + '/page' + (pageNumber + 1) + '/';
      // }

      if (this.pageNumberIsInRange(this.pageNumber)) {
        return '/locations/' + getUpdatedQueryString({route: this.$route, key: 'page', value: (this.pageNumber + 1)})
      }
    }
  },
  methods {
    onNextPage: function () {
      if (this.pageNumberIsInRange(this.pageNumber + 1)) {
        this.pageNumber++
      }
    }
  }
}
</script>
