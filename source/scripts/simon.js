$(function() {
  let uic = new UIController()
  let simonAudio = new SimonAudio()
  let game = new Game(uic, simonAudio)
  
  $('#replay, .non-strict').toggleClass('disabled') 
  
  $('#strict').click(function() {
    game.gameState.strict = !game.gameState.strict
    $(this).toggleClass('toggled')
  })

  $('#restart').click(function() {
    $('.controls .button').removeClass('disabled toggled')
    $('.game-buttons > div').addClass('disabled')
    game.restart();
  })
  
  $('#replay').click(function(){
    uic.clear();
    game.playMoves();
  })

  $('#start').click(function() {
    if (Game.inGame)
      return    

    $(this).addClass('toggled')
    
    $('#strict').addClass('disabled')
    $('.game-buttons > div').removeClass('disabled')
    
    $('#replay, .non-strict').toggleClass('disabled') 
    
    game.start()
  })

   $('.game-buttons > div').hover(function(){
     if (!$(this).hasClass('disabled'))
       return
     $(".controls > div").toggleClass('highlight')
   })
  
  $('.game-buttons > div').addClass('disabled')
    .click(function() {
      if ($(this).hasClass('disabled'))
        return
      let id = $(this).attr('id')
      
      if(game.try(id)){
        uic.animate(id)
        game.audio.play(id)        
      } else {
        game.audio.play('fail')
        game.playerMoves = []
        $('#replay').addClass('highlight').delay(1000).queue(function(){
          $(this).removeClass('highlight').dequeue();
        })
        return true
      }
      if(game.roundDone()) {
        if(game.winState.moves === game.playerMoves.length) {
          game.audio.play('win')
          $('#restart').click()
        } else {
          game.playerMoves = []
          game.move()          
        }
      }
    })
  
})