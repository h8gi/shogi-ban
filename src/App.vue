<template>
  <main id="app">
    <p>
      <router-link to="/">ゲーム</router-link>
      <router-link to="/games">棋譜一覧</router-link>
    </p>
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
  font-family: "游明朝", YuMincho, "ヒラギノ明朝 ProN W3", "Hiragino Mincho ProN", "HG明朝E", "ＭＳ Ｐ明朝", "ＭＳ 明朝", serif;
}
</style>
