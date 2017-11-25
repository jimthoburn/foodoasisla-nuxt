<template>
  <div class="location-summary-container">
    <div v-bind:class="[location.categoryCode, location.parentCategoryCode]">
      <div class="location-summary">
        <img v-bind:src="'/assets/images/home/' + location.categoryCode + '.svg'" width="100" alt="" />
        <h2>{{ location.name }}</h2>
        <p class="address">{{ location.address_1 }}<span v-if="location.address_2"><br />{{ location.address_2 }}</span></p>
        <p class="type">{{ location.category }}</p>
        <p v-show="isOpenNow" class="open">Open Now</p>
        <p class="distance"><span>{{ distance }}</span> <abbr title="miles">mi</abbr></p>
      </div>

      <ul class="options action">
        <li><a href="#shareable-link" v-on:click.prevent="shareableLinkActive = true"><span><img src="/assets/images/icons/share.svg" height="24" class="icon" alt="" /></span> <span>Share</span></a></li>
        <li><a href="#directions" v-on:click.prevent="directionsActive = true"><span><img src="/assets/images/icons/directions.svg" height="24" class="icon" alt="" /></span> <span>Directions</span></a></li>
      </ul><!-- /.options -->

      <div class="shareable-link" id="shareable-link" v-show="shareableLinkActive">
        <h2>Share</h2>
        <p class="copy-paste">
          <label>
            <span>Here’s a link you can copy and paste:</span>
            <input type="text" v-bind:value="shareableLink" onclick="this.setSelectionRange(0, this.value.length)" readonly="readonly" />
          </label>
        </p>
      </div><!-- /.shareable-link -->

      <div class="directions" id="directions" v-show="directionsActive">
        <h2>Directions</h2>
        <p class="copy-paste">
          <label>
            <span>Here’s an address you can copy and paste:</span>
            <textarea onclick="this.setSelectionRange(0, this.value.length)" readonly="readonly">{{ directionsPasteable }}</textarea>
          </label>
        </p>
        
        <p><a v-bind:href="directionsURL">Get Directions on Google Maps</a></p>
      </div>

      <section class="dates" v-if="location.season_open && location.season_close">
        <h2>Dates</h2>
        <p>{{ location.season_open }} - {{ location.season_close }}</p>
      </section>

      <section class="hours" v-if="hasHours">
        <h2>Hours</h2>
        <dl>
          <template v-for="item in location.hours">
            <dt>{{ getFormattedWeekday(item) }}</dt>
            <dd v-bind:class="{ open: isOpenNowOnWeekdays[item.day] }">
              <span v-show="item.open">{{ getFormattedHours(item) }}</span>
              <i v-show="isOpenNowOnWeekdays[item.day]">Open Now</i>
              <i v-show="!item.open">Closed</i>
            </dd>
          </template>
        </dl>
      </section>

      <section class="information">
        <h2>Information</h2>
        <dl>
          <dt class="website" v-if="location.website">Website</dt>
          <dd class="website" v-if="location.website"><a v-bind:href="location.website">{{ location.website }}</a></dd>

          <dt class="phone"   v-if="location.phone">Phone</dt>
          <dd class="phone"   v-if="location.phone">{{ location.phone }}</dd>
        </dl>
      </section>

      <div class="content" v-html="location.content"></div>

      <section class="note">
        <h2>The information on this page may have changed.</h2> 
        <p>{{ confirmationNote }}</p>
      </section>

      <section class="location-details-options">
        <h2>Options</h2>

        <ul class="options action secondary">
          <li><a v-bind:href="claimBusinessURL">Claim Business</a></li>
          <li><a v-bind:href="reportIssueURL">Report Issue</a></li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script>
import isOpenOnDayTime from '~/util/isOpenOnDayTime.js'
import getDistanceForPresentation from '~/util/getDistanceForPresentation.js'

let isOpenNowTimer
function updateIsOpenNow () {
  this.isOpenNow = false
  this.location.hours.forEach(function (hours) {
    let isOpen = isOpenOnDayTime(hours)
    this.isOpenNowOnWeekdays[hours.day] = isOpen
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
      shareableLinkActive: false,
      directionsActive: false,
      isOpenNow: false,
      isOpenNowOnWeekdays: {
        'sun': false,
        'mon': false,
        'tue': false,
        'wed': false,
        'thu': false,
        'fri': false,
        'sat': false
      }
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
    getFormattedWeekday: function (hours) {
      switch (hours.day.trim().toLowerCase()) {
        case 'mon':
          return 'Monday'
        case 'tue':
          return 'Tuesday'
        case 'wed':
          return 'Wednesday'
        case 'thu':
          return 'Thursday'
        case 'fri':
          return 'Friday'
        case 'sat':
          return 'Saturday'
        case 'sun':
          return 'Sunday'
      }

      return hours.day
    },
    getFormattedHours: function (hours) {
      return this.formatTime(hours.open) + ' – ' + this.formatTime(hours.close)
    },
    formatTime: function (timeString) { // Example: 1430 ==> 2:30pm; 0900 ==> 9:00am
      let hours = Number(timeString.substring(0, timeString.length - 2))
      let minutes = timeString.substring(timeString.length - 2)
      let ampm = 'am'
      if (hours >= 12 && hours < 24) {
        ampm = 'pm'
      }
      if (hours >= 13) {
        hours = hours - 12
      }
      return hours + ((minutes !== '00') ? ':' + minutes : '') + ampm
    }
  },
  computed: {
    distance: function () {
      return getDistanceForPresentation(this.location.distanceFromYou)
    },
    confirmationNote: function () {
      // Add a message encouraging the visitor to call ahead before visiting a location.
      if (this.location.phone !== '') {
        return `
          Before you visit, please call this location’s phone number: ${this.location.phone} and ask for their address and hours.
        `
      } else {
        return `
          Before you visit, please contact this location and ask for their address and hours.
        `
      }
    },
    shareableLink: function () {
      return 'https://foodoasis.la' + this.location.uri
    },
    directionsPasteable: function () {
      let directionsPasteable =
        this.location.name + '\r\n' +
        this.location.address_1 + '\r\n'

      if (this.location.address_2 && this.location.address_2 !== '') {
        directionsPasteable += this.location.address_2 + '\r\n'
      }

      directionsPasteable += this.location.city + ', California ' + this.location.zip

      return directionsPasteable
    },
    directionsURL: function () {
      let query =
        this.location.latitude + ',' +
        this.location.longitude + ',' +
        this.location.name + ' ' +
        this.location.address_1

      if (this.location.address_2 && this.location.address_2 !== '') {
        query += ' ' + this.location.address_2
      }

      query += ' ' + this.location.city + ', California ' + this.location.zip

      return 'https://maps.google.com/maps?q=' + encodeURIComponent(query)
    },
    claimBusinessURL: function () {
      let subject = `Claim Business, ${this.location.name}, Food Oasis LA&body=Hello team at Food Oasis LA. I’d like to claim this business… ${this.location.name}: https://foodoasis.la${this.location.uri}`

      return 'mailto:contact@foodoasis.la?subject=' + encodeURIComponent(subject)
    },
    reportIssueURL: function () {
      let params = {
        businessName: this.location.name,
        address: this.location.address,
        category: this.location.category,
        longitude: this.location.longitude,
        latitude: this.location.latitude
      }

      let queryString = []
      for (var key in params) {
        queryString.push(key + '=' + encodeURIComponent(params[key]))
      }

      return 'https://form.jotform.com/62638504761156?' + queryString.join('&')
    },
    hasHours: function () {
      return this.location.hours.length > 0
    }
  }
}
</script>
