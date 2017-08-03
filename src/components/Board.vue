<template>
  <div>
    <table class="board">
      <tr v-for="y in (reverse ? gyaku : jun)">
        <td v-for="x in (reverse ? jun : gyaku)" class="masu" :class="masuClass(x, y)"
            :data-x="x" :data-y="y"
            :data-x-label="x" :data-y-label="kansuji(y)"
            @click="masuClicked({x: x, y: y}, $event)"
            >
          <koma v-if="x !== 0 && y !== 0 && !boardData.isEmptyAt({x: x, y: y})"
                :pos="{x: x, y: y}"
                :contents="boardData.komaAt({x: x, y: y})" :reverse="reverse"
                @koma-clicked="komaClicked">
          </koma>
        </td>
      </tr>
    </table>
    <p>
      selected: {{ selectedKoma }}
    </p>
  </div>
</template>

<script>
import syogi from '@/syogi-lib'
import Koma from '@/components/Koma.vue'
export default {
  name: 'board',
  components: {
    Koma
  },
  data () {
    return {
      jun: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      gyaku: [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
      selectedKoma: syogi.Koma.empty(),
      selectedMasu: {},
      turn: 0
    }
  },
  props: ['boardData', 'reverse', 'showNum'],
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
      if ( syogi.Koma.isEmpty(this.selectedKoma) ) { // koma is not selected.
        if ( !this.boardData.isEmptyAt(pos) ) { // there are koma at pos.
          this.selectedKoma = this.boardData.komaAt(pos)
          this.selectedMasu = pos
          e.target.classList.add('selected')
        }
      } else { // koma is already selected.
        if ( this.boardData.isEmptyAt(pos) ) {
          // remove koma from the old position.
          this.boardData.take(this.selectedMasu)
          
          // put koma at the new position.
          this.boardData.put(pos, this.selectedKoma)
          
          // clear the selected koma & masu.
          this.selectedKoma = syogi.Koma.empty()
          this.selectedMasu = {}
          // the move is done.
          this.turn = syogi.changeTurn(this.turn)
        }
      }
    },
    komaClicked (contents, e) {
      console.log(contents, e.target)
    },
    hoge () {
      console.log('hoge')
    },
    kansuji (i) {
      return syogi.kansuji(i)
    }
  }
}
</script>

<style lang="scss" scoped>
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
</style>
