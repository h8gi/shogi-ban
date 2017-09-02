<template>
  <div>
    <ul>
      <li v-for="g in games">
        <router-link :to="'/games/' + g.name">{{g.name}}</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import shogi from '@/shogi-lib'
import db from '@/shogi-lib/database'
export default {
  name: 'game-list',
  components: {
  },
  props: [],
  data () {
    return {
      games: []
    }
  },
  computed: {    
  },
  methods: {    
  },
  mounted () {
    db.kifu.toArray().then(arr => {
      this.games = arr
    }).catch(err => {
      alert(err)
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '../assets/scss/common.scss';
</style>
