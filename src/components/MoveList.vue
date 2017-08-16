<template>
  <div class="move-list">
    <ul>
      <li v-for="(m, i) in moves.contents"
          v-if="i !== 0"
          :class="moves.currentIndex === i ? 'current' : ''"
          tabindex="0"
          @click="handleClick(i)">
        {{i}} : {{m.toString()}}
      </li>
    </ul>
    <div class="move-info">
      <div :class="moves.currentIndex !== 0 ? 'show' : 'hidden'">
        {{moves.currentIndex}}手目: {{moves.currentMove.toString()}}
      </div>
      <textarea cols="30" id="" name="" rows="10"
                v-model.lazy.trim="moves.currentMove.comments">
      </textarea>
      </div>
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
    handleClick (i) {
      this.$emit('goto', i)      
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
    overflow: scroll;
    li {
      list-style: none;
      cursor: pointer;
      @include no-select;
      padding-left: 1px;
      display: inline-block;
      width: 100%;
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
  .move-info {
    .hidden {
      visibility: hidden;
    }
  }
}
</style>
