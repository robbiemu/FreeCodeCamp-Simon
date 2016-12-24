class UIController {
  constructor() {
    this.animation_stack = []
    _.bindAll(this, ['clear', 'animate', 'toggleGameState'])
  }
  clear() {
    this.animation_stack.forEach(a => clearTimeout(a))
    this.animation_stack = []
  }
  animate(uiId) {
    $(`#${uiId}`).addClass('highlight')
    this.animation_stack.push(setTimeout(function() {
      $(`#${uiId}`).removeClass('highlight')
    }, 333))
  }
  toggleGameState(target, prop, value, receiver) {
    console.log("called: " + prop + " = " + value);
    if (prop[0] === '_')
      throw new Error(`Invalid attempt to set private "${prop}" property`)

    target[prop]=value
    
    if(prop === 'now' && !target.strict)
        $('#replay, .non-strict').toggleClass('disabled') 
    
    return true
  }
}
