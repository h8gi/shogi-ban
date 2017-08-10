<template>
  <div :class="'board ' + (reverse ? 'reverse' : '')">
    <table class="ban">
      <tr v-for="y in jun">
        <td v-for="x in gyaku" class="masu" :class="masuClass(x, y)"
            :data-x="x" :data-y="y"
            :data-x-label="x" :data-y-label="kansuji(y)"
            @click.self="masuClicked({x: x, y: y}, $event)"
            >
          <koma v-if="x !== 0 && y !== 0 && !boardData.isEmptyAt({x: x, y: y})"
                :pos="{x: x, y: y}"
                :contents="boardData.komaAt({x: x, y: y})"
                @koma-clicked="komaClicked">
          </koma>
        </td>
      </tr>
    </table>
    <!-- 先手 -->
    <hands :color="0" :contents="boardData.hands[0]"
           @hands-clicked="handsClicked"></hands>
    <!-- 後手 -->
    <hands :color="1" :contents="boardData.hands[1]"
           @hands-clicked="handsClicked"></hands>
  </div>
</template>

<script>
import syogi from '@/syogi-lib'
import Koma from '@/components/Koma.vue'
import Hands from '@/components/Hands.vue'
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
      move: {
        from: {},
        to: {},
        piece: '',
        color: 0,
      },
      selected: null
    }
  },
  computed: {
    koma () {
      if ( this.move.piece === '' ) {
        return syogi.Koma.empty()
      }
      return new syogi.Koma(this.move.color, this.move.piece)
    },
  },
  props: {
    boardData: syogi.Board,
    reverse: {
      type: Boolean,
      default: false
    },
    showNum: {
      type: Boolean,
      default: true
    },
    checked: Object,
    turn: {
      type: Number,
      default: 0
    }
  },
  watch: {
    checked (val) {
      if (val.valid) {
        this.boardData.runMove(val.move)        
      } else {
        console.log('invalid move!', val.move)
      }
    }
  },
  methods: {
    isHeader (x, y) {
      return x === 0 || y === 0
    },
    masuClass (x, y) {
      if (this.isHeader(x, y)) {
        let cls = 'header '
        cls += this.showNum ? '' : 'hide '
        cls += x === 0 ? 'y-header ' : ''
        cls += y === 0 ? 'x-header ' : ''
        return cls
      } else if (syogi.Board.isEdge({x: x, y: y})) {
        let cls = 'edge '        
        cls += x === 1 ? 'right ' : ''
        cls += x === 9 ? 'left ' : ''
        cls += y === 1 ? 'top ' : ''
        cls += y === 9 ? 'bottom ' : ''
        return cls
      } else {
        return ''
      }
    },
    masuClicked (pos, e) {
      if ( this.move.piece === '' ) { // koma is not selected.
        // do nothing
      } else { // koma is already selected.
        this.emitMove(pos)
      }
    },
    komaClicked (koma, pos, e) {
      if ( this.move.piece === '' ) { // koma is not selected.
        if ( koma.color === this.turn ) { // turn check
          this.move = {
            from: pos,
            to: {},
            piece: koma.kind,
            color: koma.color
          }
          this.selected = e.target
          this.selected.classList.add('selected')
        }
      } else { // koma is already selected.
        this.emitMove(pos)
      }
    },
    handsClicked (koma, e) {
      console.log('hands:', koma)
      if ( this.move.piece === '' ) { // koma is not selected.
        if ( koma.color === this.turn ) { // turn check
          this.move = {
            to: {},
            piece: koma.kind,
            color: koma.color
          }
          this.selected = e.target
          this.selected.classList.add('selected')
        }
      } else { // koma is already selected
        // do nothing
      }
    },
    // clear the data 'move'
    clearMove () {
      this.move = {
        from: {},
        to: {},
        piece: '',
        color: 0        
      },
      this.selected.classList.remove('selected')
      this.selected = null
    },
    emitMove (pos) {
      this.move.to = pos            // set move
      this.$emit('move', this.move) // emit move
      this.clearMove()      
    },
    kansuji (i) {
      return syogi.kansuji(i)
    }
  }
}
</script>

<style lang="scss">
.board {
  text-align: center;
  position: relative;
  &.reverse {
    transform: rotate(180deg);  
  }
  .hands {
    position: absolute;
  }
}

table.ban {
  border-collapse: collapse;
  text-align: center;
  margin: 0 auto;
  td {
    width: 50px;
    height: 50px;
  }
  td:not(.header) {
    border: 1px #000 solid;
    &.over, &.over1 {
      background: #eee;
    }
  }
  td.header {
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
      border-right: solid 2px #000;
    }
    &.left {
      border-left: solid 2px #000;
    }
    &.top {
      border-top: solid 2px #000;
    }
    &.bottom {
      border-bottom: solid 2px #000;
    }
  }
}

</style>
