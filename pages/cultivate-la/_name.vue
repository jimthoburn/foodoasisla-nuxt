<template>
  <locations
    v-bind:locations="locations" 
    v-bind:you-are-here="youAreHere"
    v-bind:selected-location="selectedLocation">
  </locations>
</template>

<script>
import Locations from '~/components/Locations.vue'

import getLocationsData from '~/util/getLocationsData.js'

export default {
  components: { Locations },
  asyncData: getLocationsData
}
</script>
