<template>
  <div>
    <nav class="secondary-nav location-list-nav">
        
      <ul class="options" id="search-views">
        <li class="filter">
          <a v-bind:href="'https://foodoasis.la/filters/' + queryString" id="filters-link">
            <svg viewBox="0 0 20 15" width="15" height="15">
              <path d="M6.6,2.6C6.2,1.2,4.9,0.1,3.4,0.1c-1.8,0-3.3,1.5-3.3,3.3c0,1.8,1.5,3.3,3.3,3.3c1.5,0,2.8-1.1,3.1-2.5h13.2 V2.6H6.6z M3.4,5.1c-0.9,0-1.7-0.7-1.7-1.7c0-0.9,0.7-1.7,1.7-1.7c0.9,0,1.7,0.7,1.7,1.7C5.1,4.3,4.3,5.1,3.4,5.1z"></path>
              <path d="M10.4,8.1c-1.5,0-2.8,1.1-3.1,2.5H1v1.6h6.2c0.4,1.4,1.6,2.5,3.1,2.5c1.5,0,2.8-1.1,3.1-2.5h6.2v-1.6h-6.2 C13.2,9.1,11.9,8.1,10.4,8.1z M10.4,13c-0.9,0-1.7-0.7-1.7-1.7c0-0.9,0.7-1.7,1.7-1.7c0.9,0,1.7,0.7,1.7,1.7 C12.1,12.3,11.3,13,10.4,13z"></path>
            </svg>
            Filter
          </a>
        </li>
        <li class="search">
          <a v-bind:href="'https://foodoasis.la/search/' + queryString" id="search-link">
            <img src="/assets/images/icons/search-black.svg" width="50" alt="Search">
            <span id="search-type" style="text-transform: capitalize;">{{ searchType }}</span> near <em id="search-location" style="font-style: normal;">{{ searchAreaName }}</em>
          </a>
        </li>

        <!-- SHIM: These buttons aren’t in use any longer, but help keep the search button centered -->
        <li class="view" id="list-button" style="display: none;"><a href="">List</button></a></li>
        <li class="view" id="map-button" style="display: block;"><a href="">Map</button></a></li>
      </ul>

    </nav>

    <nav class="secondary-nav back-nav" style="display: none">
      <!--
      <nuxt-link to="/locations/">
        <img src="/assets/images/icons/back.svg" />
        <span>Back to all results</span>
      </nuxt-link>
      -->
      <p class="back"><a href="" v-on:click="goBack"><img src="/assets/images/icons/back.svg"> <span>Back to all results</span></a></p>
    </nav>
  </div>
</template>

<script>
import getQueryString from '~/util/getQueryString.js'

export default {
  props: {
    searchAreaName: String
  },
  methods: {
    goBack: function (e) {
      // If the user wants to open the link in a new window, let the browser handle it.
      if (e && (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey)) return

      this.$emit('back')

      e.preventDefault()
    }
  },
  computed: {
    queryString: function () {
      return getQueryString(this.$route)
    },
    searchType: function () {
      let type = this.$route.query['type']

      if (type) {
        let types = type.split('|')

        if (types.length === 1 || types.length === 2) {
          // SHIM: Translate to a human readable version of the “type”.
          let formattedTypes = []
          for (let index = 0; index < types.length; index++) {
            formattedTypes.push(
              (types[index] === 'food-pantry') ? 'food pantries'
                : (types[index] === 'summer-lunch') ? 'summer lunch for kids'
                  : types[index].replace(/-/g, ' ') + 's'
            )
          }
          return formattedTypes.join(', ')
        }
      }
      return 'Everything'
    }
  }
}
</script>

