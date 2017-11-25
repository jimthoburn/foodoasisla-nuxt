<template>
  <li v-bind:class="[location.categoryCode, location.parentCategoryCode]">
    <a v-on:click="showLocationDetails" v-bind:href="locationURI" class="location-summary">
      <img v-bind:src="'/assets/images/home/' + location.categoryCode + '.svg'" width="100" alt="" />
      <h2>{{ location.name }}</h2>
      <p class="address">{{ location.address_1 }}<span v-if="location.address_2"><br />{{ location.address_2 }}</span></p>
      <p class="type">{{ location.category }}</p>
      <p v-if="isOpenNow" class="open">Open Now</p>
      <p class="distance"><span>{{ distance }}</span> <abbr title="miles">mi</abbr></p>
    </a>
  </li>
</template>

<script>
import isOpenOnDayTime from '~/util/isOpenOnDayTime.js'
import getQueryString from '~/util/getQueryString.js'
import getDistanceForPresentation from '~/util/getDistanceForPresentation.js'

let isOpenNowTimer
function updateIsOpenNow () {
  this.isOpenNow = false
  this.location.hours.forEach(function (hours) {
    let isOpen = isOpenOnDayTime(hours)
    // this.isOpenNowOnWeekdays[hours.day] = isOpen
    if (isOpen === true) this.isOpenNow = isOpen
  }.bind(this))
}

export default {
  props: {
    location: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isOpenNow: false
      // isOpenNowOnWeekdays: {
      //   'sun': false,
      //   'mon': false,
      //   'tue': false,
      //   'wed': false,
      //   'thu': false,
      //   'fri': false,
      //   'sat': false
      // }
    }
  },
  created () {
    updateIsOpenNow.call(this)

    if (process.browser) {
      setTimeout(updateIsOpenNow.bind(this), 1000)
      isOpenNowTimer = setInterval(updateIsOpenNow.bind(this), 60 * 1000) // update once per minute
    }
  },
  destroyed () {
    if (process.browser) {
      if (isOpenNowTimer) clearInterval(isOpenNowTimer)
      isOpenNowTimer = undefined
    }
  },
  watch: {
    location: function () {
      updateIsOpenNow.call(this)
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
    }
  }
}
</script>

