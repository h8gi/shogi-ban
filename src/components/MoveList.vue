<template>
  <div class="move-list">
    <div v-for="m in contents">
      {{m}}
    </div>
    <button @click="back">&lt;</button>
    <button @click="forward">&gt;</button>
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
    back () {
      this.$emit('back')
    },
    forward () {
      this.$emit('forward')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.move-list {

}
</style>
