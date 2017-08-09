<template>
  <div :class="'h'+color">
    {{contents}}
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
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.h0 {
  &:before {
    content: "先手▲:"
  }
}
.h1 {
  &:before {
    content: "後手△"
  }
}
</style>
