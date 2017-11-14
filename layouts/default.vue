<template>
  <div class="only-list">
    <nuxt/>
  </div>
</template>

<style>
/* SHIM: To work around new HTML structure without changing the CSS for now */
.location-list main > h2:first-child {
  /* @hidden-accessible */
  position: absolute;
  left: -9999px;
}
</style>
