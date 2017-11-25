<template>
  <li v-bind:class="[location.categoryCode, location.parentCategoryCode]">
    <img v-bind:src="'/assets/images/home/' + location.categoryCode + '.svg'" width="100" alt="" />
    <h2>{{ location.name }}</h2>
    <p v-if="isOpenNow" class="open">Open Now</p>
  </li>
</template>

<script>
import isOpenOnDayTime from '~/util/isOpenOnDayTime.js'
import getQueryString from '~/util/getQueryString.js'
import getDistanceForPresentation from '~/util/getDistanceForPresentation.js'

export default {
  props: {
    location: {
      type: Object,
      required: true
    }
  },
  methods: {
    showLocationDetails: function (e) {
      // If the user wants to open the link in a new window, let the browser handle it.
      if (e && (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey)) return

      this.$emit('selected', this.location)

      e.preventDefault()
    }
  },
  computed: {
    distance: function () {
      return getDistanceForPresentation(this.location.distanceFromYou)
    },
    locationURI: function () {
      return this.location.uri + getQueryString(this.$route)
    },
    isOpenNow: function () {
      for (let index = 0; index < this.location.hours.length; index++) {
        if (isOpenOnDayTime(this.location.hours[index])) {
          return true
        }
      }
      return false
    }
  }
}
</script>

