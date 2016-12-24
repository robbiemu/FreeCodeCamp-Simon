class SimonAudio {
  constructor() {
    this.soundsrcs = [
      'https://s3.amazonaws.com/freecodecamp/simonSound1.mp3',
      'https://s3.amazonaws.com/freecodecamp/simonSound2.mp3',
      'https://s3.amazonaws.com/freecodecamp/simonSound3.mp3',
      'https://s3.amazonaws.com/freecodecamp/simonSound4.mp3',
      'https://www.soundjay.com/misc/fail-buzzer-01.mp3',
      'http://soundbible.com/grab.php?id=1700&type=mp3'
    ]
    this.players = this.soundsrcs.map(s => {
      let a = document.createElement('audio');
      a.setAttribute('src', s)
      return a
    })
    
    this.players[4].volume = 0.1
    
    this.uiMap = {
      red: 0,
      green: 1,
      amarillo: 2,
      blue: 3,
      fail: 4,
      win: 5
    }

    _.bind(this.play, this)
  }
  play(uiId) {
    this.players[this.uiMap[uiId]].play()
  }
}
