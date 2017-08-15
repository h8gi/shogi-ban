<template>
  <div class="home" tabindex="0"
       :class="editMode ? 'edit' : 'play'"
       @keyup.right="handleForward"
       @keyup.left="handleBackward"
       @contextmenu.prevent>
    <button @click="invert">盤反転</button>
    <button @click="toggleNum">盤数字</button>
    <button @click="toggleEdit">{{editMode ? "" : "盤面を編集"}}</button>
    <button @click="toggleSounds">音を{{ sounds ? "OFF" : "ON"}}に</button>
    <button @click="remove">一手削除</button>    
    <board :board-data="boardData" :reverse="reverse" :show-num="showNum"
           @move="handleMove"
           :class="'turn-'+boardData.color"
           :latest-move="latestMove"
           :edit-mode="editMode"></board>
    <move-list :contents="moves"
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
      boardData: syogi.boardPresets.HIRATE(),
      reverse: false,
      showNum: true,
      editMode: false,
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
    handleForward () {
      console.log('forward')
    },
    handleBackward () {
      console.log('backward')
    },
    handleMove (move, elem) {
      if (!this.editMode) {
        this.moves.push(move)
        this.playSounds()        
      }
      this.boardData.runMove(move)
    },
    remove () {
      if (!this.editMode) {
        if (this.moves.length > 0) {        
          let move = this.moves.pop()
          this.playSounds()
          this.boardData.revMove(move)      
        }      
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
      this.moves = []
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
