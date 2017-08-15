<template>
  <div class="move-list">
    {{moves.currentIndex}}
    <ul>
      <li v-for="(m, i) in moves.contents"
          :class="moves.currentIndex === i ? 'current' : ''"
          tabindex="0">
        {{i}} : {{i !== 0 ? m.toString() : ""}}
      </li>
    </ul>
    <div class="comment">
      {{moves.currentMove}}
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
  },
  updated () {
    console.log('upd')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '../assets/scss/common.scss';
.move-list {
  ul {
    border: 2px solid #000;
    padding: 0;
    width: 140px;
    height: 160px;
    overflow: auto;
    li {
      list-style: none;
      cursor: pointer;
      @include no-select;
      padding-left: 1px;
      &:focus {
        outline: none;
      }
      
      &.current {
        background: #eee;
        font-weight: bold;
        padding-left: 2px;
      }
    }
  }
}
</style>
