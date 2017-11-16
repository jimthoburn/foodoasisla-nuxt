<template>
  <ul class="location-list">
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

