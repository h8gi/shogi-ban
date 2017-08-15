<template>
  <div class="move-list">
    <ul>
      <li v-for="m in moves.contents">
        <a>{{m.toString()}}</a>
      </li>
    </ul>
    <div class="comment">
      コメントエリア
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
    moves: {
      type: syogi.MoveList
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
  ul {
    border: 2px solid #000;
    padding: 0;
    width: 140px;
    height: 160px;
    overflow: auto;
    li {
      list-style: none;
    }
  }
}
</style>
