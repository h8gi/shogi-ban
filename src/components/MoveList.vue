<template>
  <ul class="move-list">
    <li v-for="(m, i) in moves.contents"
        v-if="i !== 0"
        :class="moves.currentIndex === i ? 'current' : ''"
        tabindex="0"
        @click="handleClick(i)">
      {{i}} : {{m.toString()}}
    </li>
  </ul>   
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
    console.log(this)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '../assets/scss/common.scss';
ul.move-list {
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
      padding-left: 3px;
    }
  }
}
</style>
