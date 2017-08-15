<template>
  <div class="home" tabindex="0"
       :class="editMode ? 'edit' : 'play'"
       @keyup.right="handleForward"
       @keyup.left="handleBackward"
       @contextmenu.prevent>
    <button @click="invert">盤反転</button>
    <button @click="toggleNum">盤数字</button>
    <button @click="toggleSounds">音を{{ sounds ? "OFF" : "ON"}}に</button>
    <button @click="remove">一手削除</button>    
    <board :board-data="game.board" :reverse="reverse" :show-num="showNum"
           @move="handleMove"
           :class="'turn-'+game.board.color"
           :latest-move="latestMove"
           :edit-mode="editMode"></board>
    <move-list :moves="game.moves"
               @back="handleBackward"
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
      game: new syogi.Game({}),
      reverse: false,
      showNum: true,
      editMode: false,
      sounds: true,
      komaoto: new Audio(require('@/assets/mp3/komaoto.mp3')) // https://on-jin.com
    }
  },
  computed: {
    latestMove () {
      if (this.game.moves.currentIndex > 0) {
        return this.game.moves.currentMove
      } else {
        return null
      }      
    }
  },
  methods: {
    handleForward () {
      this.game.forward()
    },
    handleBackward () {
      this.game.backward()
    },
    handleMove (move, elem) {
      this.playSounds()
      this.game.addMove(move)
    },
    remove () {
      if (!this.editMode && !this.game.moves.isEmpty()) {
        this.playSounds()
        this.game.deleteMove()
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
    toggleEdit () {
      this.editMode = !this.editMode
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
<style lang="scss">
@import '../assets/scss/common.scss';
.home {
  @include wide;
  &:focus {
    outline: none;
  }
}
</style>
