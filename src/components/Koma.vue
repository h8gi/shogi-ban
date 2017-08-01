<template>
  <div class="koma"
       :class="isReverse(info.color) ? 'reverse' : ''"
       draggable="true"
       @click="toggleClick"
       @mousemove="move">
    {{komas[info.kind].kanji}}
  </div>
</template>

<script>
export default {
  name: 'koma',
  components: {
  },
  props: ['info', 'reverse', 'x', 'y'],
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
  methods: {
    isReverse (color) {
      return this.reverse ? color === 0 : color === 1
    },
    validMove () {
    },
    toggleClick (e) {
      e.target.classList.toggle('clicked')
      this.clicked = !this.clicked
    },
    move (e) {
      if (this.clicked) {
        console.log(e)
      }
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
  cursor: pointer;
  width: 50px;
  height: 37px;
  padding-top: 13px;
  &.reverse {
    transform: rotate(180deg);  
  }

  &.dragging {
  }

  &.clicked {
    position: absolute;
  }
}

</style>
