<template>
  <ul class="location-list">
    <li is="test-location-list-item-three"
      v-for="item in locations"
      v-bind:location="item"
      v-bind:key="item.id"
      v-on:selected="onSelected">
    </li>
  </ul>
</template>

<script>
import TestLocationListItemThree from '~/components/TestLocationListItemThree.vue'

export default {
  components: {
    TestLocationListItemThree
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

