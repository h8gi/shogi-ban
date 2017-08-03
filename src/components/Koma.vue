<template>
  <div class="koma"
       :class="className"
       @click="click"
       >
    {{koma.kanji}}
  </div>
</template>

<script>
import syogi from '@/syogi-lib'
export default {
  name: 'koma',
  components: {
  },
  // contents is syogi.Koma.
  props: ['contents', 'reverse', 'pos'],
  data () {
    return {    
    }
  },
  computed: {
    className () {
      let cls = ''
      cls += this.clicked ? 'clicked ' : ''
      cls += this.isReverse(this.contents.color) ? 'reverse ' : ''
      return cls
    },
    koma () {
      return new syogi.Koma(this.contents.color, this.contents.kind)
    }
  },
  methods: {
    isReverse (color) {
      return this.reverse ? color === 0 : color === 1
    },    
    validMove () {
    },
    click (e) {      
      this.$emit('koma-clicked', this.contents, e)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
[draggable] {
  -moz-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  user-select: none;
}
.koma {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently */
  
  cursor: pointer;
  width: 100%;
  height: 100%;
  font-size: 2.1em;
  &.reverse {
    transform: rotate(180deg);  
  }

  &.dragging {
  }

  &.clicked, &.selected {
    font-weight: bold;
    background-color: #eee;
  }
}

</style>
