<template>
  <ul class="location-list">
    <li is="test-location-list-item-two"
      v-for="item in locations"
      v-bind:location="item"
      v-bind:key="item.id"
      v-on:selected="onSelected">
    </li>
  </ul>
</template>

<script>
import TestLocationListItemTwo from '~/components/TestLocationListItemTwo.vue'

export default {
  components: {
    TestLocationListItemTwo
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

