<template>
  <div :class="'h'+color">
    <div v-for="(count, kind) in contents"
         v-if="count !== 0"
         :class="'hands-'+kind"
         @click="click(color, kind)">
      {{kanji(kind) + " " + count}}
    </div>
  </div>
</template>

<script>
import syogi from '@/syogi-lib'
export default {
  name: 'hands',
  components: {
  },
  props: ['color', 'contents'],
  data () {
    return {    
    }
  },
  computed: {
  },
  methods: {
    kanji (kind) {
      return syogi.Koma.kanji(kind)
    },
    click (color, kind) {
      this.$emit('hands-clicked', new syogi.Koma(color, kind))
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.h0 {
  &:before {
    content: "先手▲"
  }
}
.h1 {
  &:before {
    content: "後手△"
  }
}
</style>
