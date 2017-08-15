<template>
  <div class="home" tabindex="0"
       @keyup.right="forward"
       @keyup.left="backward">
    <button @click="invert">盤反転</button>
    <button @click="toggleNum">盤数字</button>
    <button @click="toggleSounds">{{ sounds ? "音量OFF" : "音量ON"}}</button>
    <button @click="remove">一手削除</button>
    <board :board-data="boardData" :reverse="reverse" :show-num="showNum"
           @move="handleMove"
           :class="'turn-'+boardData.color"
           :latest-move="latestMove"></board>
    <move-list :contents="moves"
               @back="handleBack"
               @forward="handleForward"></move-list>
  </div>
</template>

<script>
import Board from '@/components/Board'
import MoveList from '@/components/MoveList'
import syogi from '@/syogi-lib'
export default {
  name: 'home',
  components: {
    Board,
    MoveList
  },
  data () {
    return {
      boardData: syogi.boardPresets.HIRATE,
      reverse: false,
      showNum: true,
      moves: [],
      currentPos: -1,
      sounds: true,
      komaoto: new Audio(require('@/assets/mp3/komaoto.mp3')) // https://on-jin.com
    }
  },
  computed: {
    latestMove () {
      return this.moves[this.moves.length-1]
    }
  },
  methods: {
    forward () {
      console.log('forward')
    },
    backward () {
      console.log('backward')
    },
    handleForward () {      
    },
    handleBack () {
    },
    handleMove (move, elem) {
      this.moves.push(move)
      this.playSounds()
      this.boardData.runMove(move)
    },
    remove () {
      if (this.moves.length > 0) {        
        let move = this.moves.pop()
        this.playSounds()
        this.boardData.revMove(move)      
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
    },
    playSounds () {
      if (this.sounds) {
        if (this.komaoto.currentTime) {
          this.komaoto.currentTime = 0
        }
        this.komaoto.play()
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '../assets/scss/common.scss';
.home {
  @include wide;
  &:focus {
    outline: none;
  }
}
</style>
