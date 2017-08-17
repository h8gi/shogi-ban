<template>
  <div class="game" tabindex="0"
       :class="editMode ? 'edit' : 'play'"
       @keyup.right="handleForward"
       @keyup.left="handleBackward">
    <button @click="invert">盤反転</button>
    <button @click="toggleNum">盤数字</button>
    <button @click="toggleSounds">音を{{ sounds ? "OFF" : "ON"}}に</button>        
    <button @click="toggleEdit">{{editMode ? "普通へ" : "編集モードへ"}}</button>
    
    <board :board-data="game.board" :reverse="reverse" :show-num="showNum"
           @move="handleMove"
           :class="'turn-'+game.board.color"
           :latest-move="latestMove"
           :edit-mode="editMode"></board>

    <div v-if="editMode" class="editor">
      <button @click="toggleTurn">手番入れ替え</button>
      <button @click="clearBoard">初期化</button>
    </div>
    
    <div v-else class="moves">
      <div class="table">
        <move-list :moves="game.moves"
                   @goto="handleGoto"></move-list>
        <move-info :move="game.moves.currentMove"
                   :index="game.moves.currentIndex"></move-info>
      </div>
      <div class="controller">
        <button @click="handleGotoStart">&lt;&lt;</button>
        <button @click="handleBackward">&lt;</button>
        <button @click="handleForward">&gt;</button>
        <button @click="handleGotoEnd">&gt;&gt;</button>
        <button :class="game.moves.isLast ? 'show' : 'hidden'" @click="handleRemove">一手削除</button>
      </div>      
    </div>

    
  </div>
</template>

<script>
import Board from '@/components/Board'
import MoveList from '@/components/MoveList'
import MoveInfo from '@/components/MoveInfo'
import syogi from '@/syogi-lib'
export default {
  name: 'game',
  components: {
    Board,
    MoveList,
    MoveInfo
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
      if (!this.editMode && this.game.forward()) {
        this.playSounds()
      }
    },
    handleBackward () {
      if (!this.editMode && this.game.backward()) {
        this.playSounds()
      }
    },
    handleGoto (n) {
      this.game.goto(n)
    },
    handleGotoStart () {
      this.game.gotoStart()
    },
    handleGotoEnd () {
      this.game.gotoEnd()
    },
    handleMove (move, elem) {
      if (this.game.moves.isLast) {
        this.playSounds()
        this.game.addMove(move, !this.editMode)
      } else {
        // forks
      }
    },
    handleRemove () {
      if (!this.game.moves.isEmpty() && this.game.moves.lastIndex > 0) {
        if (this.game.moves.isLast) {
          this.playSounds()
        }
        this.game.deleteMove(!this.editMode)
      }      
    },
    invert () {
      this.reverse = (!this.reverse)
    },
    clearBoard () {
      this.game.board = syogi.boardPresets.HIRATE()
    },
    toggleNum () {
      this.showNum = (!this.showNum)
    },
    toggleTurn () {
      this.game.board.toggleTurn()
    },
    toggleSounds () {
      this.sounds = !this.sounds
    },
    toggleEdit () {
      this.editMode = !this.editMode
      this.game.moves = new syogi.MoveList([{}])
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
.game {
  @include wide;
  &:focus {
    outline: none;
  }
  .moves {
    position: relative;
    margin: 20px auto;
    text-align: center;
    .table {
      display: table;
      margin: 0 auto;
      padding-right: 180px;
      .move-list, .move-info {
        vertical-align: top;
        display: table-cell;
        height: 240px;
      }
      .move-list {
      }
    }
    .hidden {
      visibility: hidden;
    }
  }
}


</style>
