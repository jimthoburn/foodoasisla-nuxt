<template>
  <ul class="location-list">
    <!--
      Now we provide each location-item with the location object
      it's representing, so that its content can be dynamic.
      We also need to provide each component with a "key",
      which will be explained later.
    -->
    <li is="location-list-item"
      v-for="item in locations"
      v-bind:location="item"
      v-bind:key="item.id"
      v-on:selected="onSelected">
    </li>
  </ul>
</template>

<script>
import LocationListItem from '~/components/LocationListItem.vue'

export default {
  components: {
    LocationListItem
  },
  props: {
    locations: {
      type: Array,
      required: true
    }
  },
  methods: {
    onSelected: function (location) {
      this.$emit('selected', location)
    }
  }
}
</script>

