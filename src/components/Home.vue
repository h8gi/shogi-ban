<template>
  <div class="home">
    <button @click="movetest">test</button>
    <button @click="invert">盤反転</button>
    <button @click="toggleNum">盤数字</button>
    <board :board-data="boardData" :reverse="reverse" :show-num="showNum"></board>
  </div>
</template>

<script>
import Board from '@/components/Board'
import syogi from '@/syogi-lib'
export default {
  name: 'home',
  components: {
    Board
  },
  data () {
    return {
      boardData: syogi.boardPresets.HIRATE,
      reverse: false,
      showNum: true
    }
  },
  methods: {
    runMove (move) {
      let koma = this.boardData.take(move.from)
      this.boardData.put(move.to, koma)
    },
    movetest () {
      this.runMove({from: {x: 3, y: 3}, to: {x: 3, y: 4}})
    },
    invert () {
      this.reverse = (!this.reverse)
    },
    toggleNum () {
      this.showNum = (!this.showNum)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

</style>
