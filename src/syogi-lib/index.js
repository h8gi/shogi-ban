import _ from 'lodash'
// https://github.com/na2hiro/json-kifu-format
class Board {
  constructor (contents, hands, color = 0) {
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
    this.color = color    // 初手の手番 (先手、後手どちらからの局面か)
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
  // 持駒処理
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
  // 手番変更
  toggleTurn () {
    this.color = changeColor(this.color)
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
    this.toggleTurn()
  }
  // 逆
  revMove (move) {
    this.take(move.to)  // remove koma from `to` position.
    let koma = move.koma
    if (move.isDrop()) { // 打つ     
      this.addHands(koma)       // return koma to hands.
    } else {
      if (move.capture !== undefined) { // capture
        let captured = new Koma(koma.color, move.capture)
        if (captured.kind !== 'OU') {
          this.removeHands(captured.isPromoted() ? captured.demote() : captured)
        }        
        this.put(move.to, captured.betray())
      }
      this.put(move.from, koma)
    }
    this.toggleTurn()
  }

  isValidMove (move, nifucheck = true) {
    if (move.isDrop()) { // 打つ
      if (!this.isEmptyAt(move.to)) { // もう駒あるよ
        return false
      }
      
      if (nifucheck && move.piece === 'FU') {
        // 二歩チェック
        return _.range(1, 10).map(y => {
          return {x: move.to.x, y: y}
        }).every(pos => {
          if (this.isEmptyAt(pos)) {
            return true
          }
          let koma = this.komaAt(pos)
          // 自分の歩があるかどうか
          return !( (koma.kind === 'FU') && (koma.color === move.color) )
        })
      }
      // 打てる!
      return true
    } else {                    // 普通に
      let koma = this.komaAt(move.from)      
      if (!koma.isValidMove(move)) { // 駒の動きとして正しいか
        return false
      }
      if (move.info.long && !this.isValidLongMove(move)) {     // 長距離移動として正しいか
        return false
      }
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

  // 飛車や角の動きで、間に駒が無いかどうか
  isValidLongMove (move) {
    let [minX, maxX] = [move.from.x, move.to.x].sort((a,b) => a > b)
    let [minY, maxY] = [move.from.y, move.to.y].sort((a,b) => a > b)
    switch (true) {
    case /^(U|D)$/.test(move.info.direction):
      // 上下
      return _.range(minY+1, maxY).map(y => {
        return {x: move.from.x, y: y}
      }).every(pos => {
        return this.isEmptyAt(pos)
      })      
    case /^(R|L)$/.test(move.info.direction):
      // 左右
      return _.range(minX+1, maxX).map(x => {
        return {x: x, y: move.from.y}
      }).every(pos => {
        return this.isEmptyAt(pos)
      })
    default:
      // 斜め
      let xrange = _.range(move.from.x+(/L/.test(move.info.direction)?1:-1), move.to.x)
      let yrange = _.range(move.from.y+(/D/.test(move.info.direction)?1:-1), move.to.y)      
      return _.zipWith(xrange, yrange, (x, y) => {
        return {x: x, y: y}
      }).every(pos => {
        return this.isEmptyAt(pos)
      })
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
    return [{FU: 0, KY: 0, KE: 0, GI: 0, KI: 0, KA: 0, HI: 0, OU: 0},
            {FU: 0, KY: 0, KE: 0, GI: 0, KI: 0, KA: 0, HI: 0, OU: 0}]
  }
}



const komaMap = {
  FU: {
    kanji: '歩',
    promote: 'TO'
  },
  KY: {
    kanji: '香',
    promote: 'NY'
  },
  KE: {
    kanji: '桂',
    promote: 'NK'
  },
  GI: {
    kanji: '銀',
    promote: 'NG'
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
  betray () {
    return new Koma(changeColor(this.color), this.kind)
  }
  promoteD () {
    this.kind = komaMap[this.kind].promote
  }
  demoteD () {
    this.kind = komaMap[this.kind].demote
  }
  betrayD () {
    this.color = changeColor(this.color)
  }
  isPromotable () {
    return komaMap[this.kind].promote !== undefined
  }  
  // Can I promote at the pos?
  isPromotableAt (pos) {
    // そもそも成れない駒
    if (!this.isPromotable()) {
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

  isValidMove (move) {
    switch (this.kind) {
    case 'FU':
      if (this.color === 0) { // 先手
        return move.info.direction === 'U' && move.info.dy === -1
      } else {                // 後手        
        return move.info.direction === 'D' && move.info.dy === 1
      }
    case 'KY':
      if (this.color === 0) { // 先手
        return move.info.direction === 'U'
      } else {
        return move.info.direction === 'D'
      }
    case 'KE':
      if (this.color === 0) {
        return (move.info.dx === 1 || move.info.dx === -1) && (move.info.dy === -2)
      } else {
        return (move.info.dx === 1 || move.info.dx === -1) && (move.info.dy === 2)
      }
    case 'GI':
      if (this.color === 0) {   // 先手
        // _.inRange(number, start, end) start <= number < end
        if (move.info.dy === -1) { // 前方向3マス
          return _.inRange(move.info.dx, -1, 2)
        } else if (move.info.dy === 1) { // 後ろ2マス
          return move.info.dx === -1 || move.info.dx === 1
        } else {
          return false
        }
      } else {                    // 後手
        if (move.info.dy === 1) { // 前方向3マス
          return _.inRange(move.info.dx, -1, 2)
        } else if (move.info.dy === -1) { // 後ろ2マス
          return move.info.dx === -1 || move.info.dx === 1
        } else {
          return false
        }      
      }
    case 'KI':
    case 'TO':
    case 'NY':
    case 'NK':
    case 'NG':
      if (this.color === 0) {   // 先手
        if (move.info.dy === -1) { // 前方向3マス
          return _.inRange(move.info.dx, -1, 2)
        } else if (move.info.dy === 0) { // 横方向2マス
          return move.info.dx === -1 || move.info.dx === 1
        } else if (move.info.dy === 1) { // 後ろ1マス
          return move.info.dx === 0
        }
      } else {                  // 後手
        if (move.info.dy === 1) { // 前方向3マス
          return _.inRange(move.info.dx, -1, 2)
        } else if (move.info.dy === 0) { // 横方向2マス
          return move.info.dx === -1 || move.info.dx === 1
        } else if (move.info.dy === -1) { // 後ろ1マス
          return move.info.dx === 0
        }
      }
    case 'KA':
      // 角
      // 方向が斜めで、変則ジャンプでなければよい
      return (move.info.direction.length === 2) && (!move.info.jump)
    case 'UM':
      if (move.info.long) {
        return (move.info.direction.length === 2) && (!move.info.jump)
      } else {
        // 周り全部
        return !move.info.jump
      }
    case 'HI':
      // 方向が縦横で、変則ジャンプでなければよい
      return (move.info.direction.length === 1) && (!move.info.jump)
    case 'RY':
      if (move.info.long) {
        return (move.info.direction.length === 1) && (!move.info.jump)
      } else {
        return !move.info.jump
      }
    case 'OU':
      // 長距離でも変則ジャンプでもなければよい
      return (!move.info.long) && (!move.info.jump)
    default:
      return false
    }
  }
  
  movablePosArray (from) {
    return komaMap[this.kind].togo(this.color, from)    
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
    // comments:
    // move: 
    //   color
    //   from
    //   to
    //   piece
    //   same
    //   promote
    //   capture
    //   relative
    // time:
    // special:
    // forks:
    Object.assign(this, params)    
  }
  
  isDrop () {
    return this.from === undefined
  }

  get info () {
    if (this.isDrop()) {
      return undefined
    }
    let dobj = {
      dx: this.to.x - this.from.x,
      dy: this.to.y - this.from.y,
      direction: '',            // 方向 (Left,Right,Down,Up)
      jump: false,              // 変則(桂)
      long: false               // 2以上の移動(香飛角竜馬)
    }
    switch (Math.sign(dobj.dx)) {
    case 1:
      dobj.direction += 'L'
      break
    case -1:
      dobj.direction += 'R'
      break
    }
    switch (Math.sign(dobj.dy)) {
    case 1:
      dobj.direction += 'D'
      break
    case -1:
      dobj.direction += 'U'
      break
    }       
    if (dobj.direction.length === 2) {  // 斜めの動きかどうかチェック
      if (Math.abs(dobj.dx) !== Math.abs(dobj.dy)) { // 斜めではない = 変則ジャンプ
        dobj.jump = true
        return dobj
      }
      // 距離チェック
      dobj.long = Math.abs(dobj.dx) > 1
    } else { // 縦横
      // 横(LR)ならdxが2以上かどうか
      // 縦(DU)ならdyが2以上かどうか
      dobj.long = 'LR'.includes(dobj.direction) ? (Math.abs(dobj.dx) > 1) : (Math.abs(dobj.dy) > 1)
    }
    return dobj
  }

  get koma () {
    return new Koma(this.color, this.piece)
  }

  toString () {
    let str = color2kigou(this.color) + this.to.x + kansuji(this.to.y) + komaMap[this.piece].kanji
    if (this.promote === true) {
      str += '成'
    } else if (this.promote === false) {
      str += '不成'
    }
    
    if (!this.isDrop()) {
      str += '(' + this.from.x + kansuji(this.from.y) + ')'
    } else {
      str += '(打)'
    }
    
    return str
    
  }
}

class MoveList {
  constructor (array) {
    this.contents = array
    this.currentIndex = 0
  }
  push (move) {
    this.contents.push(move)    
    return this.contents.length
  }
  pop () {
    return this.contents.pop()
  }
  get currentMove () {
    return this.contents[this.currentIndex]
  }
  get lastIndex () {
    return this.contents.length-1
  }
  get lastMove () {
    return this.contents[this.lastIndex]
  }
  isEmpty () {
    return this.contents.length === 0
  }
  backward () {
    if (this.currentIndex > 0) {
      let move = this.currentMove
      this.currentIndex -= 1
      return move
    } else {
      return false
    }
  }
  forward () {
    if (this.currentIndex < this.contents.length - 1) {
      this.currentIndex += 1
      return true
    } else {
      return false
    }
  }
}

class Game {
  constructor (jkf) {
    // board:
    // moves:
    if (jkf.hasOwnProperty('initial')) {      
      if (jkf.initial.preset === 'OTHER') {
        this.board = new Board(jkf.initial.data.board,
                               jkf.initial.data.hands,
                               jkf.initial.data.color)
      } else {
        this.board = boardPresets[jkf.initial.preset]()
      }
    } else {
      this.board = boardPresets['HIRATE']()
    }
    this.moves = new MoveList([{}])
  }

  addMove (move) {
    this.moves.push(move)
    this.board.runMove(move)
    this.moves.currentIndex = this.moves.lastIndex
  }

  deleteMove () {
    let move = this.moves.pop()
    this.board.revMove(move)
    this.moves.currentIndex = this.moves.lastIndex
  }

  forward () {
    if (this.moves.forward()) {
      this.board.runMove(this.moves.currentMove)
    }    
  }

  backward () {
    let move = this.moves.backward()
    if (move) {
      this.board.revMove(move)    
    }
  }
}

const boardPresets = {
  HIRATE () {
    return new Board([
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
}

function changeColor (color) {
  return color === 0 ? 1 : 0
}
function kansuji (i) {
  return '〇一二三四五六七八九'[i]
}
function color2kigou (color) {
  return '☗☖'[color]
}

export default {
  Game,
  boardPresets,
  Board,
  Koma,
  Move,
  MoveList,
  kansuji,
  changeColor
}
