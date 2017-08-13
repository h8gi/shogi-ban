<template>
  <div class="home">
    <button @click="invert">盤反転</button>
    <button @click="toggleNum">盤数字</button>
    <button @click="toggleSounds">{{ sounds ? "音量OFF" : "音量ON"}}</button>
    <board :board-data="boardData" :reverse="reverse" :show-num="showNum"
           @move="handleMove"
           :class="'turn-'+turn"
           :turn="turn"
           :latest-move="latestMove"></board>
    <moves :contents="moves"></moves>
  </div>
</template>

<script>
import Board from '@/components/Board'
import Moves from '@/components/Moves'
import syogi from '@/syogi-lib'
export default {
  name: 'home',
  components: {
    Board,
    Moves
  },
  data () {
    return {
      boardData: syogi.boardPresets.HIRATE,
      reverse: false,
      showNum: true,
      moves: [{}],
      turn: 0,
      latestMove: null,
      sounds: true,
      komaoto: new Audio(require('@/assets/mp3/komaoto.mp3')) // https://on-jin.com
    }
  },
  methods: {
    handleMove (move, elem) {
      this.toggleTurn()
      this.moves.push(move)
      this.boardData.runMove(move)
      this.latestMove = move
      if (this.sounds) {
        if (this.komaoto.currentTime) {
          this.komaoto.currentTime = 0
        }
        this.komaoto.play()
      }      
    },
    invert () {
      this.reverse = (!this.reverse)
    },
    toggleNum () {
      this.showNum = (!this.showNum)
    },
    toggleTurn () {
      this.turn = this.turn === 0 ? 1 : 0
    },
    toggleSounds () {
      this.sounds = !this.sounds
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.home {
}
</style>
