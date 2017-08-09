<template>
  <div>
    <table class="board">
      <tr v-for="y in (reverse ? gyaku : jun)">
        <td v-for="x in (reverse ? jun : gyaku)" class="masu" :class="masuClass(x, y)"
            :data-x="x" :data-y="y"
            :data-x-label="x" :data-y-label="kansuji(y)"
            @click.self="masuClicked({x: x, y: y}, $event)"
            >
          <koma v-if="x !== 0 && y !== 0 && !boardData.isEmptyAt({x: x, y: y})"
                :pos="{x: x, y: y}"
                :contents="boardData.komaAt({x: x, y: y})" :reverse="reverse"
                @koma-clicked="komaClicked">
          </koma>
        </td>
      </tr>
    </table>
    <!-- 先手 -->
    <hands color="0" :contents="boardData.hands[0]"></hands>
    <!-- 後手 -->
    <hands color="1" :contents="boardData.hands[1]"></hands>
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
  props: ['boardData', 'reverse', 'showNum', 'checked'],
  watch: {
    checked (val) {
      if (val.valid) {
        console.log('valid move!:', JSON.stringify(val.move) )
        this.boardData.runMove(val.move)
      } else {
        console.log('invalid move!')        
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
        cls += this.showNum ? 'hide ' : ''
        cls += x === 0 ? 'y-header ' : ''
        cls += y === 0 ? 'x-header ' : ''
        return cls
      } else if (syogi.Board.isEdge({x: x, y: y})) {
        let cls = 'edge '
        if (this.reverse) {
          cls += x === 9 ? 'right ' : ''
          cls += x === 1 ? 'left ' : ''
          cls += y === 9 ? 'top ' : ''
          cls += y === 1 ? 'bottom ' : ''
        } else {
          cls += x === 1 ? 'right ' : ''
          cls += x === 9 ? 'left ' : ''
          cls += y === 1 ? 'top ' : ''
          cls += y === 9 ? 'bottom ' : ''
        }
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
        this.move = {
          from: pos,
          to: {},
          piece: koma.kind,
          color: koma.color
        }
        this.selected = e.target
        this.selected.classList.add('selected')
      } else { // koma is already selected.
        this.emitMove(pos)
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
table.board {
  border-collapse: collapse;
  text-align: center;
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
    border: 1px #fff solid;
    background-color: #fff;
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
      display: none;
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
.t0 {
  .h0 { font-weight: bold; }
}
.t1 {
  .h1 { font-weight: bold; }
}
</style>
