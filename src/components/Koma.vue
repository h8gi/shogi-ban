<template>
  <div class="koma"
       :class="className"
       @click.self="click">
    {{contents.kanji}}
  </div>
</template>

<script>
import syogi from '@/syogi-lib'
export default {
  name: 'koma',
  components: {
  },
  // contents is syogi.Koma.
  props: ['contents', 'pos'],
  data () {
    return {    
    }
  },
  computed: {
    className () {
      let cls = 'color-' + this.contents.color + ' '
      cls += this.clicked ? 'clicked ' : ''
      cls += this.isReverse(this.contents.color) ? 'reverse ' : ''
      return cls
    }
  },
  methods: {
    isReverse (color) {         // 後手は逆さま
      return color === 1
    },    
    validMove () {
    },
    click (e) {      
      this.$emit('koma-clicked', this.contents, this.pos, e)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.koma {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently */
  cursor: default;
  /* pointer-events: none; */
  width: 100%;
  height: 100%;
  font-size: 2em;
  &.reverse {
    transform: rotate(180deg);  
  }  
}

.turn-0 .color-0, .turn-1 .color-1{
  cursor: pointer;
  &.selected {
    font-weight: bold;
    background-color: #eee;
  }  
  &:hover {
  }
}

</style>
