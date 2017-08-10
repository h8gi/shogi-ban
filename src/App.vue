<template>
  <main id="app">
    <router-view></router-view>
  </main>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="scss">
@import '../node_modules/alertifyjs/build/css/alertify.min.css';
@import '../node_modules/alertifyjs/build/css/themes/default.min.css';
.alertify .ajs-dimmer, .alertify .ajs-modal {
  -webkit-transition-duration: 80ms;
  transition-duration: 80ms;
}
#app {
}
</style>
