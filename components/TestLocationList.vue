<template>
  <ul class="location-list">
    <li is="test-location-list-item"
      v-for="item in locations"
      v-bind:location="item"
      v-bind:key="item.id"
      v-on:selected="onSelected">
    </li>
  </ul>
</template>

<script>
import TestLocationListItem from '~/components/TestLocationListItem.vue'

export default {
  components: {
    TestLocationListItem
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

