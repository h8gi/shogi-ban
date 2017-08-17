<template>
  <div class="move-list">
    <ul id="scroll-area">
      <li v-for="(m, i) in moves.contents"
          v-if="i !== 0"
          :class="moves.currentIndex === i ? 'current' : ''"
          tabindex="0"
          @click="handleClick(i)">
        {{i}} : {{m.toString()}}
      </li>
    </ul>
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
    let ul = document.getElementById('scroll-area')
    let li = ul.getElementsByClassName('current')[0]
    if (li) {
      ul.scrollTo(0, (this.moves.currentIndex - 1) * li.offsetHeight )
    } else {
      ul.scrollTo(0, 0)
    }
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
    margin-top: 18px;
    margin-right: 15px;
    width: 140px;
    height: 202px;
    overflow-y: scroll;
    overflow-x: hidden;
    text-align: left;
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
        padding-left: 3px;
      }
    }
  }
}
</style>
