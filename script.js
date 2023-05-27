// Make sure that document is ready before manipulating the DOM.
$('#board-container').hide();

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
    clearInputs();
  });

  exitBtn.click(e => {
    e.preventDefault();
    boardContainer.slideUp('slow');
    loginContainer.slideDown('slow');
    clearInputs();
  });

  const clearInputs = () => {
    userName.val('');
    pairs.val('');
  };
});
