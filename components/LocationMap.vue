<template>
  <div>
    <p class="action search-this-area"><a href="" v-on:click.prevent="searchThisArea">Search this area</a></p>
    <div id="map" class="map-container mapboxgl-map active" v-if="mapBoxSupported"></div>
    <section role="status" class="message" v-else>
      <h1>Oops! Our map isn’t working.</h1>
      <p><a href="https://www.mapbox.com/help/mapbox-browser-support/">Learn more on the Mapbox web site</a>.</p>
    </section>
  </div>
</template>

<script>
import mapOptions from '~/util/mapOptions.js'

let oasisMap = null

export default {
  props: {
    youAreHere: Object,
    selectedLocation: Object,
    locations: {
      type: Array,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  },
  mounted: function () {
    /* SHIM: Wait a moment before rendering the map, so the size will be correct */
    setTimeout(function () {
      this.mapBoxSupported = 'mapboxgl' in window && window.mapboxgl.supported()

      this.createMap()

      if (this.locations && this.locations.length) {
        this.addMarkers(this.locations, this.youAreHere)
        if (this.selectedLocation) {
          this.updateCurrentMarker(this.selectedLocation)
          let coordinates = {
            lng: this.selectedLocation.longitude,
            lat: this.selectedLocation.latitude
          }

          if (oasisMap) oasisMap.setCenter(coordinates)
        }
      }
    }.bind(this), 1)
  },
  data: function () {
    return {
      map: null,
      dragging: false, // SHIM: Avoid activing a marker while moving the map
      skipNextMoveMap: false, // SHIM: Avoid moving the map when clicking on markers
      markers: [],
      currentMarker: null,
      initializingMarkers: true,
      mapBoxSupported: true
    }
  },
  watch: {

    // Update the markers if the locations data changes
    locations: function () {
      this.hideSearchThisArea()
      this.resetCurrentMarker()
      this.updateMarkers()
    },

    // Deselect the current marker on the map if the detail page has become inactive
    selectedLocation: function () {
      // console.log('selectedLocation changed')
      if (!this.selectedLocation) {
        this.resetCurrentMarker()
      } else {
        this.updateCurrentMarker(this.selectedLocation)
        if (!this.skipNextMoveMap) oasisMap.flyTo({ center: [this.selectedLocation.longitude, this.selectedLocation.latitude] })
        this.skipNextMoveMap = false
      }
    }
  },
  methods: {
    showSearchThisArea () {
      document.body.classList.add('has-search-this-area')
    },
    hideSearchThisArea () {
      document.body.classList.remove('has-search-this-area')
    },
    searchThisArea (event) {
      // this.updateMarkers()
      this.hideSearchThisArea()
      this.resetCurrentMarker()

      let center = oasisMap.getCenter().toArray()
      this.$emit('search-this-area', { latitude: center[1], longitude: center[0] })
    },
    createMap () {
      if (process.browser && this.mapBoxSupported && this.$el.querySelector('#map')) {
        window.mapboxgl.accessToken = this.token

        oasisMap = new window.mapboxgl.Map({
          container: this.$el.querySelector('#map'),
          style: mapOptions.MAP_STYLE,
          maxBounds: mapOptions.MAP_BOUNDS
        })

        oasisMap.on('load', function () {
          // Add a zoom control
          oasisMap.addControl(new window.mapboxgl.NavigationControl({ position: 'top-right' })) // position is optional

          // Draw food desert census tracts
          if (this.$route.query['deserts'] === '1') {
            oasisMap.addSource('Food Deserts', mapOptions.FOOD_DESERTS_SOURCE)
            oasisMap.addLayer(mapOptions.FOOD_DESERTS_LAYER)
          }
          // oasisMap.resize()
        }.bind(this))

        oasisMap.on('dragstart', function () {
          this.dragging = true
        }.bind(this))
        oasisMap.on('dragend', function () {
          setTimeout(function () {
            this.dragging = false
          }.bind(this), 10)
        }.bind(this))

        oasisMap.on('dragend', this.showSearchThisArea.bind(this))
      }
    },
    updateMarkers: function () {
      this.removeAllMarkers()

      this.addMarkers(this.locations)
    },
    addYouAreHere: function (coordinates) {
      let template = '<div class="you-are-here"><span>You are here</span></div>'

      let marker = document.createElement('div')
      marker.innerHTML = template

      return new window.mapboxgl.Marker(marker)
        .setLngLat(coordinates)
        .addTo(oasisMap)
    },
    createMarker: function (options, data) {
      let marker = document.createElement('div')
      marker.className = 'marker ' + options.className
      let span = document.createElement('span')
      span.textContent = data.name
      span.className = 'marker-label'
      marker.appendChild(span)
      return marker
    },
    updateMarkerLabels: function () {
      if (oasisMap.getZoom() > 14) { // Zoomed In
        document.body.classList.remove('hidden-marker-labels')
      } else { // Zoomed Out
        document.body.classList.add('hidden-marker-labels')
      }
    },
    resetCurrentMarker: function () {
      if (this.currentMarker) this.currentMarker.classList.remove('active')
    },
    updateCurrentMarker: function (location) {
      // console.log('updateCurrentMarker: ' + location.name)

      if (this.currentMarker) this.currentMarker.classList.remove('active')

      this.currentMarker = this.getMarkerFromLocation(location)
      if (this.currentMarker) this.currentMarker.classList.add('active')
    },
    getMarkerFromLocation: function (location) {
      // Assume that the markers array is in the same order as the locations array
      for (let index = 0; index < this.markers.length; index++) {
        if (this.locations[index].name === location.name &&
          this.locations[index].longitude === location.longitude &&
          this.locations[index].latitude === location.latitude) {
          return this.markers[index]
        }
      }
    },
    addMarker: function (location) {
      let coordinates = [
        location.longitude,
        location.latitude
      ]

      let options = mapOptions.MARKER_OPTIONS[location.category]

      if (!options) {
        options = {

          // Specify a class name we can refer to in CSS.
          className: '',

          // Set marker width and height
          iconSize: [30, 46],
          iconAnchor: [15, 40],
          popupAnchor: [0, -23]
        }
      }

      let marker = this.createMarker(options, location)

      new window.mapboxgl.Marker(marker)
        .setLngLat(coordinates)
        .addTo(oasisMap)

      let handleMapClick = function (e) {
        if (this.dragging) return

        this.skipNextMoveMap = true // Avoid moving the map while the user pressing different points

        this.$emit('selected', location)
      }.bind(this)

      marker.addEventListener('click', handleMapClick)

      this.markers.push(marker)

      return coordinates
    },
    removeAllMarkers: function () {
      while (this.markers.length > 0) {
        this.markers.pop().remove()
      }
    },
    addMarkers: function (locations) {
      if (!oasisMap) return

      document.body.classList.add('hidden-marker-labels')

      let bounds = []

      // Loop through the locations
      for (let index = 0; index < locations.length; index++) {
        // Add a marker
        let coordinates = this.addMarker(locations[index])

        bounds.push(coordinates)
      }

      if (this.initializingMarkers && this.youAreHere && this.youAreHere.latitude && this.youAreHere.longitude) {
        // Add a “You are here” marker
        let coordinates = [this.youAreHere.longitude, this.youAreHere.latitude]
        this.addYouAreHere(coordinates)
        bounds.unshift(coordinates)
      }

      // Increase the size of the viewport to fit the markers
      if (this.initializingMarkers) this.fitMarkers(bounds)

      let updateMarkerLabels = this.updateMarkerLabels.bind(this)

      // Show the marker labels
      setTimeout(updateMarkerLabels, 1000)
      if (this.initializingMarkers) oasisMap.on('zoomend', updateMarkerLabels)

      this.initializingMarkers = false

      // console.dir(this.markers);
    },
    fitMarkers: function (bounds) {
      if (!oasisMap) return

      oasisMap.setZoom(15)

      let mapLngLatBounds = new window.mapboxgl.LngLatBounds()

      let limit = 10
      for (let index = 0; index < limit && index < bounds.length; index++) {
        mapLngLatBounds.extend(bounds[index])
      }

      oasisMap.fitBounds(mapLngLatBounds, { padding: 10, easing: function () { return 1 } })
    }
  }
}
</script>
