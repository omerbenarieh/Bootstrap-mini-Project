// Make sure that document is ready before manipulating the DOM.
$('#board-container').hide();

const options = {
  // starting time
  startValue: 0,

  // max time
  maxValue: 60,

  // in milliseconds
  counter: 1000,

  // should the circles styling alters according to progress level
  triggerPercentage: false,

  // timer, progress or manual

  type: 'timer',

  // the width of the dial

  dialWidth: 5,

  // font size

  fontSize: '20px',

  // font color

  fontColor: 'rgb(135, 206, 235)',

  // skin name

  skin: '',

  // the size of the circle

  size: '150px',
};

$(document).ready(function () {
  /*
  Stages:

  2) Start a timer in game-board.
  
  */
  const startBtn = $('#start');
  const userName = $('#username');
  const pairs = $('#pairs');

  const exitBtn = $('#exit');

  const loginContainer = $('#login-container');
  const boardContainer = $('#board-container');

  // Start Game.
  // 1) Show username on screen
  startBtn.click(e => {
    e.preventDefault();
    if (userName.val().length === 0 || pairs.val().length === 0) {
      return alert('Please enter a valid name and valid number of Pairs.');
    }
    loginContainer.slideUp('slow');
    boardContainer.slideDown('slow');
    $('#name').text(`Hello ${userName.val()}!`);
    $('.myInstance').Circlebar(options);
    clearInputs();
  });

  exitBtn.click(e => {
    e.preventDefault();
    boardContainer.slideUp('slow');
    loginContainer.slideDown('slow');
    clearInputs();
  });
});
