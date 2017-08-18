<template>
  <div :class="'board ' + (reverse ? 'reverse' : '')">
    <table class="ban">
      <tr v-for="y in jun">
        <td v-for="x in gyaku" class="masu" :class="masuClass(x, y)"
            :data-x-label="x" :data-y-label="kansuji(y)"
            @click.self="masuClicked({x: x, y: y}, $event)">
          <koma v-if="x !== 0 && y !== 0 && !boardData.isEmptyAt({x: x, y: y})"
                :pos="{x: x, y: y}"
                :contents="boardData.komaAt({x: x, y: y})"
                :class="latestMove && latestMove.to.x === x && latestMove.to.y === y ? 'latest-move' : ''"
                @koma-clicked="komaClicked"
                @koma-up="komaUp"
                @koma-down="komaDown">
          </koma>
        </td>
      </tr>
    </table>    
    <!-- 先手 -->
    <hands :color="0" :turn="boardData.color" :contents="boardData.hands[0]"
           @hands-clicked="handsClicked"
           @hands-koma-clicked="handsKomaClicked"></hands>
    <!-- 後手 -->
    <hands :color="1" :turn="boardData.color" :contents="boardData.hands[1]"
           @hands-clicked="handsClicked"
           @hands-koma-clicked="handsKomaClicked"></hands>
  </div>
</template>

<script>
import shogi from '@/shogi-lib'
import Koma from '@/components/Koma.vue'
import Hands from '@/components/Hands.vue'
import alertify from 'alertifyjs'
export default {
  name: 'board',
  components: {
    Koma,
    Hands
  },
  data () {
    return {
      jun: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      gyaku: [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
      move: new shogi.Move({
        from: {},
        to: {},
        piece: '',
        color: 0,
      }),
      selected: null
    }
  },
  computed: {
    koma () {
      if ( this.move.piece === '' ) {
        return shogi.Koma.empty()
      }
      return new shogi.Koma(this.move.color, this.move.piece)
    },
  },
  props: {
    boardData: shogi.Board,
    reverse: {
      type: Boolean,
      default: false
    },
    showNum: {
      type: Boolean,
      default: true
    },
    latestMove: {
      type: Object,
      default: null
    },
    editMode: {
      type: Boolean,
      default: false
    }
  },
  watch: {
  },
  methods: {
    isHeader (x, y) {
      return x === 0 || y === 0
    },
    masuClass (x, y) {
      let cls = ''
      if (this.isHeader(x, y)) {
        cls += 'header '
        cls += this.showNum ? '' : 'hide '        
        cls += x === 0 ? 'y-header ' : ''
        cls += y === 0 ? 'x-header ' : ''
      } else if (shogi.Board.isEdge({x: x, y: y})) {
        cls += 'edge '        
        cls += x === 1 ? 'right ' : ''
        cls += x === 9 ? 'left ' : ''
        cls += y === 1 ? 'top ' : ''
        cls += y === 9 ? 'bottom ' : ''        
      }
      cls += this.latestMove !== null && this.latestMove.to.x === x && this.latestMove.to.y === y ? 'latest-move' : ''
      return cls
    },
    masuClicked (pos, e) {
      if ( !this.selected ) { // koma is not selected.
        // do nothing
      } else { // koma is already selected.
        if (this.boardData.isEmptyAt(pos)) {
          this.emitMove(pos)
        }
      }
    },
    komaClicked (koma, pos, e) {
      if (this.editMode) {
        // 編集モード
        this.startMove(koma, pos, e)
      } else {
        // 通常の動作
        if ( !this.selected ) { // koma is not selected.
          if ( this.checkTurn(koma) ) { // turn check
            this.startMove(koma, pos, e)
          }
        } else { // koma is already selected.
          if (koma.color === this.move.color) { // 自駒
            this.startMove(koma, pos, e)
          } else {                // 駒をとる
            this.move.capture = koma.kind
            this.emitMove(pos)
          }
        }
      }
    },
    handsClicked (color) {
      if (this.editMode) {
        if ( this.selected ) {
          if ( this.move.isDrop() ) {            
            this.boardData.removeHands(this.koma)
            this.boardData.addHands(this.koma.betray())
          } else {
            let koma = this.boardData.take(this.move.from)
            koma.color = color
            this.boardData.addHands(koma)
          }
          this.clearMove()
        }
      }
    },
    handsKomaClicked (koma, e) {
      if ( this.checkTurn(koma) ) { // turn check
        this.startMove(koma, undefined, e)
      }
    },
    startMove (koma, pos, e) {
      this.clearMove()
      this.move = new shogi.Move({
        from: pos,
        to: {},
        piece: koma.kind,
        color: koma.color
      })
      this.selected = e.target
      this.selected.classList.add('selected')
      
    },
    // clear the data 'move'
    clearMove () {
      this.move = new shogi.Move({
        from: {},
        to: {},
        piece: '',
        color: 0        
      })
      if (this.selected) {
        this.selected.classList.remove('selected')
        this.selected = null
      }      
    },
    emitMove (pos) {
      this.move.to = pos        // set move
      if (this.checkMove(this.move)) {
        if (this.editMode) {
          this.$emit('move', this.move) // emit move
          this.clearMove()          
        } else {
          // if (!this.move.isDrop() && this.koma.isPromotableAt(pos)) {
          if (this.move.isPromotable()) {
            this.askPromote()
          } else {
            this.$emit('move', this.move) // emit move
            this.clearMove()
          }
        }
      } else {
        this.clearMove()
      }
    },
    komaUp (koma, pos, e) {
      if (this.editMode) {
        koma.betrayD()
        this.move.color = koma.color        
      }
    },
    komaDown (koma, pos, e) {
      console.log('hello')
      if (this.editMode) {
        if (koma.isPromotable()) {
          console.log('hello')
          koma.promoteD()
          this.move.piece = koma.kind
        } else if (koma.isPromoted()) {
          koma.demoteD()
          this.move.piece = koma.kind
        }
      }
    },
    checkMove (move) {      
      return this.editMode || this.boardData.isValidMove(move)
    },
    checkTurn (koma) {
      return this.editMode || (this.boardData.color === koma.color)
    },
    askPromote () {
      alertify
        .confirm('成りますか？', () => {
          // yes
          this.move.promote = true
          this.$emit('move', this.move)
          this.clearMove()
        }, () => {
          // no
          this.move.promote = false
          this.$emit('move', this.move)
          this.clearMove()
        }).set({
          closable: false,
          transition: 'fade',
          labels: {ok: 'はい', cancel: 'いいえ'},
          movable: false
        }).setHeader(' ')
    },
    kansuji (i) {
      return shogi.kansuji(i)
    },
    getKomaAt (pos) {
    }
  },
  updated () {
    this.clearMove()
  }
}
</script>

<style lang="scss">
@import '../assets/scss/common.scss';
.board {    
  text-align: center;
  position: relative;
  @include wide;
  &.reverse {
    transform: rotate(180deg);  
  }
  .hands {
    position: absolute;
    /* 先手 */
    &.color-0 {
      right: 180px;
      bottom: 0px;
    }
    /* 後手 */
    &.color-1 {
      left: 180px;
      top: 0px;
    }
  }
}

table.ban {
  border-collapse: collapse;
  text-align: center;
  margin: 0 auto;
  td {
    width: 40px;
    height: 40px;
  }
  td:not(.header) {
    border: 2px #000 solid;
    .play &.latest-move {    
      background: #000;
      color: #fff;
    }
  }
  td.header {
    width: 20px;
    height: 15px;
    pointer-events: none;
    &.x-header:before {
      content: attr(data-x-label);      
    }
    &.y-header:before {
      content: attr(data-y-label);
    }
    &.x-header.y-header:before {
      content: none;
    }
    &.hide {
      visibility: hidden;
    }
    .reverse & {
      transform: rotate(180deg);
    }
  }
  td.edge {    
    &.right {
      border-right: solid 4px #000;
    }
    &.left {
      border-left: solid 4px #000;
    }
    &.top {
      border-top: solid 4px #000;
    }
    &.bottom {
      border-bottom: solid 4px #000;
    }
  }
}

</style>
