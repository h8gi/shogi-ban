<template>
  <div class="koma"
       :class="className"
       @click.self="click">
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
      let cls = 'k' + this.contents.color + ' '
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
      this.$emit('koma-clicked', this.contents, this.pos, e)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.koma {
  cursor: pointer;
  width: 100%;
  height: 100%;
  font-size: 2em;
  &.reverse {
    transform: rotate(180deg);  
  }

  &.dragging {
  }  
}

.t0 .k0.selected, .t1 .k1.selected {
  font-weight: bold;
  background-color: #eee;
}

</style>
