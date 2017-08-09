<template>
  <div class="home">
    <button @click="movetest">test</button>
    <button @click="invert">盤反転</button>
    <button @click="toggleNum">盤数字</button>
    <board :board-data="boardData" :reverse="reverse" :show-num="showNum"
           :checked="checked"
           @move="runMove"
           :class="'t'+turn"
           :turn="turn"></board>
    {{moves}}
  </div>
</template>

<script>
import Board from '@/components/Board'
import syogi from '@/syogi-lib'
export default {
  name: 'home',
  components: {
    Board
  },
  data () {
    return {
      boardData: syogi.boardPresets.HIRATE,
      reverse: false,
      showNum: true,
      checked: {valid: false, move: {}},
      moves: [{}],
      turn: 0
    }
  },
  methods: {
    runMove (move) {
      let valid = this.checkMove(move)
      if (valid) {
        this.toggleTurn()
        this.moves.push(move)
      }
      this.checked = {
        valid: valid,
        move: move
      }
    },
    checkMove (move) {      
      if (move.color !== this.turn) {
        return false
      }
      return !(move.from.x === move.to.x && move.from.y === move.to.y)
    },
    movetest () {
      this.runMove({from: {x: 3, y: 3}, to: {x: 3, y: 4}})
    },
    invert () {
      this.reverse = (!this.reverse)
    },
    toggleNum () {
      this.showNum = (!this.showNum)
    },
    toggleTurn () {
      this.turn = this.turn === 0 ? 1 : 0
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

</style>
