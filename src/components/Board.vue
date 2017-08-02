<template>
  <table class="board">
    <tr v-for="y in (reverse ? gyaku : jun)">
      <td v-for="x in (reverse ? jun : gyaku)" class="masu" :class="masuClass(x, y)"
          :data-x="x" :data-y="y"
          :data-x-label="x" :data-y-label="kansuji[y]"
          @click="put">
        <koma v-if="x !== 0 && y !== 0 && boardData[x-1][y-1].kind"
              :x="x" :y="y"
              :contents="boardData[x-1][y-1]" :reverse="reverse"
              @koma-clicked="komaClicked">
        </koma>
      </td>
    </tr>
  </table>
</template>

<script>
import Koma from '@/components/Koma.vue'
export default {
  name: 'board',
  components: {
    Koma
  },
  data () {
    return {
      kansuji: ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九'],
      jun: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      gyaku: [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
      selectedCount: 0
    }
  },
  props: ['boardData', 'reverse', 'showNum'],
  methods: {
    isEdge (x, y) {
      return x === 1 || x === 9 || y === 1 || y === 9
    },
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
      } else if (this.isEdge(x, y)) {
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
    put () {
      console.log('put')
    },
    hoge () {
      console.log('hoge')
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
