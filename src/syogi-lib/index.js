// https://github.com/na2hiro/json-kifu-format
class Board {
  constructor (contents) {
    this.contents = contents
  }
  // get koma @ pos
  // pos: {x: x, y: y}
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
}

const komaMap = {
  FU: {kanji: '歩'},
  KY: {kanji: '香'},
  KE: {kanji: '桂'},
  GI: {kanji: '銀'},
  KI: {kanji: '金'},
  KA: {kanji: '角'},
  HI: {kanji: '飛'},
  OU: {kanji: '玉'},
  TO: {kanji: 'と'},
  NY: {kanji: '杏'},
  NK: {kanji: '圭'},
  NG: {kanji: '全'},
  UM: {kanji: '馬'},
  RY: {kanji: '竜'}
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

  static isEmpty (koma) {
    return Object.keys(koma).length === 0
  }

  static empty () {
    return {}
  }
}

const boardPresets = {
  HIRATE: new Board([
    [{"color":1, "kind":"KY"}, {                      },{"color":1, "kind":"FU"}, {}, {}, {}, {"color":0, "kind":"FU"}, {                      }, {"color":0, "kind":"KY"}],
    [{"color":1, "kind":"KE"}, {"color":1, "kind":"KA"},{"color":1, "kind":"FU"}, {}, {}, {}, {"color":0, "kind":"FU"}, {"color":0, "kind":"HI"}, {"color":0, "kind":"KE"}],
    [{"color":1, "kind":"GI"}, {                      },{"color":1, "kind":"FU"}, {}, {}, {}, {"color":0, "kind":"FU"}, {                      }, {"color":0, "kind":"GI"}],
    [{"color":1, "kind":"KI"}, {                      },{"color":1, "kind":"FU"}, {}, {}, {}, {"color":0, "kind":"FU"}, {                      }, {"color":0, "kind":"KI"}],
    [{"color":1, "kind":"OU"}, {                      },{"color":1, "kind":"FU"}, {}, {}, {}, {"color":0, "kind":"FU"}, {                      }, {"color":0, "kind":"OU"}],
    [{"color":1, "kind":"KI"}, {                      },{"color":1, "kind":"FU"}, {}, {}, {}, {"color":0, "kind":"FU"}, {                      }, {"color":0, "kind":"KI"}],
    [{"color":1, "kind":"GI"}, {                      },{"color":1, "kind":"FU"}, {}, {}, {}, {"color":0, "kind":"FU"}, {                      }, {"color":0, "kind":"GI"}],
    [{"color":1, "kind":"KE"}, {"color":1, "kind":"HI"},{"color":1, "kind":"FU"}, {}, {}, {}, {"color":0, "kind":"FU"}, {"color":0, "kind":"KA"}, {"color":0, "kind":"KE"}],
    [{"color":1, "kind":"KY"}, {                      },{"color":1, "kind":"FU"}, {}, {}, {}, {"color":0, "kind":"FU"}, {                      }, {"color":0, "kind":"KY"}]
  ])
}

export default {  
  boardPresets,
  Board,
  Koma,
  kansuji (i) {
    return '〇一二三四五六七八九'[i]
  },

  // color: 手番
  // board: 現在の盤
  // from: 移動元のマス
  // to: 移動先のマス
  isValidMove (color, board, from, to) {
    let srckoma = board.komaAt(from)
    let dstkoma = board.komaAt(to)
    if (srckoma.color !== color) { // 手番でない
      return false
    }
    if (srckoma.color === dstkoma.color) { // 自駒同士
      return false
    }
    return true
  },

  changeTurn (turn) {
    return turn === 0 ? 1 : 0
  }
}
