<template>
  <locations
    v-bind:locations="locations" 
    v-bind:you-are-here="youAreHere"
    v-bind:selected-location="selectedLocation">
  </locations>
</template>

<script>
import Locations from '~/components/Locations.vue'

import findUserLocation from '~/util/findUserLocation.js'
import getLocationFromPageURI from '~/util/getLocationFromPageURI.js'
import getSortedLimitedLocations from '~/util/getSortedLimitedLocations.js'

import locations from '~/data/locations.js'

export default {
  components: { Locations },
  asyncData: function ({route, app}, callback) {
    findUserLocation({route, app, locations})
      .then(function (youAreHere) {
        let sortedLocations = getSortedLimitedLocations({route, youAreHere})
        let selectedLocation = getLocationFromPageURI({route, locations})
        callback(null, {
          locations: sortedLocations,
          youAreHere: youAreHere,
          selectedLocation: selectedLocation
        })
      })
  }
}
</script>
