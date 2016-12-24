class Game {
  constructor(uic, audio) {
    this.uic = uic
    this.audio = audio
    this.uiMap = {
      red: 0,
      green: 1,
      amarillo: 2,
      blue: 3
    }
    this.dexUi = ['red', 'green', 'amarillo', 'blue']
    this.states = ['SHOWINGCHALLENGE', 'LISTENING']
    this.winState = { moves: 20 }
    this.moves = []
    this.playerMoves = []
    this.gameStack = []
    this.inGame = false
    this.gameState = new Proxy({}, { set: this.uic.toggleGameState })
    this.gameState.strict = false
    _.bindAll(this, ['start', 'restart', 'playMoves', 'move', 'chooseAtRandom', 'try', 'roundDone'])
  }

  start() {
    this.inGame = true
    this.gameStack.push(setTimeout(this.move, parseInt((Math.random() + 1) * 1000)))
  }
  restart() {
    this.moves = []
    this.playerMoves = []
    this.gameStack.forEach(a => {
      clearTimeout(a)
    })
    this.gameStack = []
    this.inGame = false
  }
  playMoves() {
    let self = this;
    let elf = this.uic;
    let audio = this.audio;
    
    this.gameState.now = 'SHOWINGCHALLENGE'
    
    let pause = 0;
    this.moves.forEach((m, i) => {
      let play_move = (i === self.moves.length -1)?
          function() { elf.animate(m); audio.play(m); self.gameState.now = 'LISTENING' }
          : function() { elf.animate(m); audio.play(m) }
      this.gameStack.push(
        setTimeout(play_move, pause += parseInt((Math.random() + 1) * 750)))
    })
  }
  move() {
    let move = this.chooseAtRandom()
    this.moves.push(move)
    this.playMoves()
  }
  chooseAtRandom() {
    return this.dexUi[parseInt(Math.random() * 4)]
  }
  try (uiId) {
    let i = this.playerMoves.length
    this.playerMoves.push(uiId)
    
    console.log('[Game] trying %s', uiId)
    console.dir([this.playerMoves.slice(), this.moves.slice(), (this.playerMoves[i] === this.moves[i])])

    return (this.playerMoves[i] === this.moves[i])
  }
  roundDone() {
    let self = this
    if(this.moves.length !== this.playerMoves.length)
      return false
    return !this.moves.some((m,i) => self.playerMoves[i] !== m)
  }
}