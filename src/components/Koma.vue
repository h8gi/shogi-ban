<template>
  <div class="koma"
       :class="className"
       @click.self="click"
       @keyup.down="down"
       @keyup.up="up"
       tabindex="0">
    {{contents.kanji}}
  </div>
</template>

<script>
import shogi from '@/shogi-lib'
export default {
  name: 'koma',
  components: {
  },
  // contents is shogi.Koma.
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
    },
    down (e) {
      this.$emit('koma-down', this.contents, this.pos, e)
    },
    up (e) {
      this.$emit('koma-up', this.contents, this.pos, e)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '../assets/scss/common.scss';
.koma {
  @include no-select;    
  cursor: default;
  /* pointer-events: none; */
  width: 100%;
  height: 100%;
  font-size: 1.6em;
  line-height: 160%;
  &.reverse {
    transform: rotate(180deg);  
  }
  &:focus {
    outline: none;
  }
}

.play .turn-0 .color-0, .play .turn-1 .color-1{
  cursor: pointer;
  &.selected {
    font-weight: bold;
    background-color: #eee;
  }
  &:hover {
  }
}
.edit .koma{
  cursor: pointer; 
  &.selected, &:focus {
    font-weight: bold;
    background-color: #eee;
  }
}

</style>
