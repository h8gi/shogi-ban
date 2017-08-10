<template>
  <div class="moves">
    <div v-for="m in contents">
      {{m}}
    </div>
  </div>
</template>

<script>
import syogi from '@/syogi-lib'
export default {
  name: 'moves',
  components: {
  },
  props: {
    contents: {
      type: Array
    }
  },
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
<style lang="scss" scoped>
.moves {

}
</style>
