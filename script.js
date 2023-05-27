// Make sure that document is ready before manipulating the DOM.
// $('#board-container').hide();
$(document).ready(function () {
  // Varibales declarations
  const startBtn = $('#start');
  const userName = $('#username');
  const pairs = $('#pairs');
  const exitBtn = $('#exit');
  const loginContainer = $('#login-container');
  const boardContainer = $('#board-container');
  const gameBoard = $('#game-board');

  // Start Game Button
  startBtn.click(e => {
    e.preventDefault();
    const nameInserted = userName.val();
    const numOfPairs = pairs.val();
    if (
      nameInserted.length === 0 ||
      pairs.val().length === 0 ||
      numOfPairs < 2 ||
      numOfPairs > 21
    ) {
      return alert('Please enter a valid name and valid number of Pairs.');
    }

    startTimer(updateTimer);
    loginContainer.slideUp('fast');
    boardContainer.slideDown('slow');
    $('#name').text(`Good Luck ${nameInserted}!`);
    createBoard(numOfPairs);
    clearInputs();
  });

  // Exit Game Button
  exitBtn.click(e => {
    e.preventDefault();
    boardContainer.slideUp('fast');
    loginContainer.slideDown('slow');
    resetTimer();
    clearInputs();
  });

  // Handler Functions
  // Timer functions
  const clearInputs = () => {
    userName.val('');
    pairs.val('');
  };

  let timerInterval;
  let totalSeconds = 0;

  const startTimer = () => {
    timerInterval = setInterval(updateTimer, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerInterval);
  };

  const resetTimer = () => {
    stopTimer();
    totalSeconds = 0;
    updateTimer();
  };

  const updateTimer = () => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const formattedTime = formatTime(minutes) + ':' + formatTime(seconds);
    $('#clock').text(formattedTime);
    totalSeconds++;
  };

  const formatTime = time => {
    return time < 10 ? '0' + time : time;
  };

  // Create board functions.

  /*
  TODO
    1) Shuffle the amount of  cards (random number 0-20)
    // the user ask for.

    2) Display closed cards

    3) Make the Cards Responsive when Play 

  TODO

  */
  // Create Board:

  const createBoard = numOfPairs => {
    for (let i = 0; i < 21; i++) {
      const img = document.createElement('img');
      img.src = `./Cards/card-${i}.jpeg`;
      img.width = 100;
      img.height = 100;
      gameBoard.append(img);
    }
  };

  //
});
