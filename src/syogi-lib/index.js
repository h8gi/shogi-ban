import _ from 'lodash'
// https://github.com/na2hiro/json-kifu-format
class Board {
  constructor (contents, hands) {
    this.contents = contents.map(arr => {
      return arr.map(pair => {
        if (pair.kind === undefined) {
          return Koma.empty()
        } else {
          return new Koma(pair.color, pair.kind)
        }
      })
    })
    this.hands = hands
  }
  // get koma @ pos
  // pos: {x: x, y: y} or {color: 0|1}
  // 1 <= x <= 9
  // 1 <= y <= 9
  komaAt (pos) {   
    return this.contents[pos.x-1][pos.y-1]
  }  
  // put koma at pos
  put (pos, koma) {
    this.contents[pos.x-1].splice(pos.y-1, 1, koma)
    return [pos, koma]
  }
  take (pos) {
    let koma = this.komaAt(pos)
    this.put(pos, Koma.empty())
    return koma
  }
  addHands (koma) {
    let kind = koma.kind
    if (koma.isPromoted()) {
      kind = koma.demote().kind
    }
    this.hands[koma.color][kind] += 1
  }
  removeHands (koma) {
    this.hands[koma.color][koma.kind] -= 1
  }
  
  runMove (move) {
    let koma = new Koma(move.color, move.piece)
    if (move.isDrop()) { // 打つ
      this.removeHands(koma)    // remove koma from `from` position.
    } else {
      this.take(move.from)      // remove koma from `from` position.
      if (!this.isEmptyAt(move.to)) { // take koma from `to` position.
        let target = this.take(move.to)  
        target.color = koma.color
        if (target.kind !== 'OU') {
          this.addHands(target)  // capture target
        }
      }
    }
    if (move.promote) {
      koma = koma.promote()
    }
    this.put(move.to, koma)
  }
  // 逆
  revMove (move) {
    let koma = this.take(move.to)  // remove koma from `to` position.
    if (move.isDrop()) { // 打つ     
      this.addHands(koma)          // return koma to hands.
    } else {
      if (move.capture !== undefined) { // capture
        let captured = new Koma(changeTurn(koma.color), move.capture)
        this.put(move.to, captured)
      }
      if (move.promote) {
        koma = koma.demote()
      }
      this.put(move.from, koma)
    }
  }

  isValidMove (move) {
    if (move.isDrop()) { // 打つ
      if (!this.isEmptyAt(move.to)) { // もう駒あるよ
        return false
      }
      // 打てる!
      return true
    } else {                    // 普通に
      let koma = this.komaAt(move.from)       
      if (this.isEmptyAt(move.to)) { // 行き先空
        // 動かせる!
        return true
      } else {                  // 行き先に駒
        let target = this.komaAt(move.to)
        if (koma.color === target.color) { // 自駒
          return false
        }
        // 動かせる!
        return true
      }
    }
  }

  // 駒はそこにあるか
  isEmptyAt (pos) {
    return Koma.isEmpty(this.komaAt(pos))
  }
  // 将棋盤の端かどうか
  static isEdge (pos) {
    return pos.x === 1 || pos.x === 9 || pos.y === 1 || pos.y === 9
  }
  // 将棋盤からはみでていないか
  static isValidPos (pos) {
    return 1 <= pos.x && pos.x <= 9 && 1 <= pos.y && pos.y <= 9
  }

  static emptyHands () {
    return [{FU: 0, KY: 0, KE: 0, GI: 0, KI: 0, KA: 0, HI: 0},
            {FU: 0, KY: 0, KE: 0, GI: 0, KI: 0, KA: 0, HI: 0}]
  }
}



const komaMap = {
  FU: {
    kanji: '歩',
    promote: 'TO',
    togo (color, pos) {
      let {x, y} = pos
      y = color === 0 ? (y-1) : (y+1)
      return [{x: x, y: y}]
    }
  },
  KY: {
    kanji: '香',
    promote: 'NY',
    togo (color, pos) {
      let {x, y} = pos
      let yarr = color === 0 ? _.range(y-1, 0) : _.range(y+1, 10)
      return yarr.map(y => {
        return {x: x, y: y}
      })
    }
  },
  KE: {
    kanji: '桂',
    promote: 'NK',
    togo (color, pos) {
      let {x, y} = pos
      return [x+1, x-1].map(x => {
        return {x: x, y: color === 0 ? y-2 : y+2}
      })   
    }
  },
  GI: {
    kanji: '銀',
    promote: 'NG',
    togo (color, pos) {
      
    }
  },
  KI: {
    kanji: '金'
  },
  KA: {
    kanji: '角',
    promote: 'UM'
  },
  HI: {
    kanji: '飛',
    promote: 'RY'
  },
  OU: {
    kanji: '王'
  },
  TO: {
    kanji: 'と',
    demote: 'FU'
  },
  NY: {
    kanji: '杏',
    demote: 'KY'
  },
  NK: {
    kanji: '圭',
    demote: 'KE'
  },
  NG: {
    kanji: '全',
    demote: 'GI'
  },
  UM: {
    kanji: '馬',
    demote: 'KA'
  },
  RY: {
    kanji: '竜',
    demote: 'HI'
  }
}

class Koma {
  // color:
  //   先手: 0
  //   後手: 1
  // kind:
  // 'FU', 'KY', 'KE', 'GI', 'KI', 'KA', 'HI', 'OU', 'TO', 'NY', 'NK', 'NG', 'UM', 'RY'  
  constructor (color, kind) {
    this.color = color
    this.kind = kind
  }

  get kanji () {
    return komaMap[this.kind].kanji
  }
  promote () {
    return new Koma(this.color, komaMap[this.kind].promote)
  }
  demote () {
    return new Koma(this.color, komaMap[this.kind].demote)
  }
  // Can I promote at the pos?
  isPromotableAt (pos) {
    // そもそも成れない駒
    if (komaMap[this.kind].promote === undefined) {
      return false
    }
    // 先手
    if (this.color === 0) {
      return 1 <= pos.y && pos.y <= 3
    }
    // 後手
    return 7 <= pos.y && pos.y <= 9
  }
  // 成ってる
  isPromoted () {  
    return ['TO', 'NY', 'NK', 'NG', 'UM', 'RY'].includes(this.kind)
  }
  movablePosArray (from) {
    return komaMap[this.kind].togo(this.color, from)    
  }
  // destructive! 
  betray () {
    this.color = this.color === 0 ? 1 : 0
  }
  static isEmpty (koma) {
    return Object.keys(koma).length === 0
  }

  static kind2kanji (kind) {
    return komaMap[kind].kanji
  }

  static empty () {
    return {}
  }
}

class Move {
  constructor (params) {
    Object.assign(this, params)
  }

  isDrop () {
    return this.from === undefined
  }

  direction () {
    
  }
}

const boardPresets = {
  HIRATE: new Board([
    [{color:1, kind:'KY'}, {                    },{color:1, kind:'FU'}, {}, {}, {}, {color:0, kind:'FU'}, {                  }, {color:0, kind:'KY'}],
    [{color:1, kind:'KE'}, {color:1, 'kind':'KA'},{color:1, kind:'FU'}, {}, {}, {}, {color:0, kind:'FU'}, {color:0, kind:'HI'}, {color:0, kind:'KE'}],
    [{color:1, kind:'GI'}, {                    },{color:1, kind:'FU'}, {}, {}, {}, {color:0, kind:'FU'}, {                  }, {color:0, kind:'GI'}],
    [{color:1, kind:'KI'}, {                    },{color:1, kind:'FU'}, {}, {}, {}, {color:0, kind:'FU'}, {                  }, {color:0, kind:'KI'}],
    [{color:1, kind:'OU'}, {                    },{color:1, kind:'FU'}, {}, {}, {}, {color:0, kind:'FU'}, {                  }, {color:0, kind:'OU'}],
    [{color:1, kind:'KI'}, {                    },{color:1, kind:'FU'}, {}, {}, {}, {color:0, kind:'FU'}, {                  }, {color:0, kind:'KI'}],
    [{color:1, kind:'GI'}, {                    },{color:1, kind:'FU'}, {}, {}, {}, {color:0, kind:'FU'}, {                  }, {color:0, kind:'GI'}],
    [{color:1, kind:'KE'}, {color:1, 'kind':'HI'},{color:1, kind:'FU'}, {}, {}, {}, {color:0, kind:'FU'}, {color:0, kind:'KA'}, {color:0, kind:'KE'}],
    [{color:1, kind:'KY'}, {                    },{color:1, kind:'FU'}, {}, {}, {}, {color:0, kind:'FU'}, {                  }, {color:0, kind:'KY'}]
  ], Board.emptyHands())
}

export default {  
  boardPresets,
  Board,
  Koma,
  Move,
  kansuji (i) {
    return '〇一二三四五六七八九'[i]
  },
  changeTurn (turn) {
    return turn === 0 ? 1 : 0
  }
}
