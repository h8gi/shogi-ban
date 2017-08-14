<template>
  <div class="move-list">
    <div v-for="m in contents">
      {{m}}
    </div>
    <button>&lt;</button>
    <button>&gt;</button>
  </div>
</template>

<script>
import syogi from '@/syogi-lib'
export default {
  name: 'move-list',
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
.move-list {

}
</style>
