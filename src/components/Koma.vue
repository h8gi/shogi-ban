<template>
  <div class="koma"
       :class="className"
       @click="click"
       >
    {{komas[contents.kind].kanji}}
  </div>
</template>

<script>
export default {
  name: 'koma',
  components: {
  },
  props: ['contents', 'reverse', 'x', 'y'],
  data () {
    return {
      komas: {
        'FU': {kanji: '歩'},
        'KY': {kanji: '香'},
        'KE': {kanji: '桂'},
        'GI': {kanji: '銀'},
        'KI': {kanji: '金'},
        'KA': {kanji: '角'},
        'HI': {kanji: '飛'},
        'OU': {kanji: '玉'},
        'TO': {kanji: 'と'},
        'NY': {kanji: '杏'},
        'NK': {kanji: '圭'},
        'NG': {kanji: '全'},
        'UM': {kanji: '馬'},
        'RY': {kanji: '竜'}
      },
      clicked: false
    }
  },
  computed: {
    className () {
      let cls = ''
      cls += this.clicked ? 'clicked ' : ''
      cls += this.isReverse(this.contents.color) ? 'reverse ' : ''
      return cls
    }
  },
  methods: {
    isReverse (color) {
      return this.reverse ? color === 0 : color === 1
    },    
    validMove () {
    },
    click (e) {      
      this.$emit('koma-clicked', this.contents)
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
  width: 50px;
  height: 50px;
  font-size: 2.1em;
  &.reverse {
    transform: rotate(180deg);  
  }

  &.dragging {
  }

  &.clicked {
    font-weight: bold;
    background-color: #eee;
  }
}

</style>
