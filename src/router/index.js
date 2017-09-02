import Vue from 'vue'
import Router from 'vue-router'
import Game from '@/components/Game'
import GameList from '@/components/GameList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/games',
      name: 'GameList',
      component: GameList
    },
    {
      path: '/games/:name',
      name: 'Game',
      component: Game
    }
  ]
})
