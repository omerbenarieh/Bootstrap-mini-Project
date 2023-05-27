// Make sure that document is ready before manipulating the DOM.
$('#board-container').hide();
$(document).ready(function () {
  // Varibales declarations
  const startBtn = $('#start');
  const userName = $('#username');
  const pairs = $('#pairs');
  const exitBtn = $('#exit');
  const loginContainer = $('#login-container');
  const boardContainer = $('#board-container');

  // Start Game Button
  startBtn.click(e => {
    e.preventDefault();
    if (userName.val().length === 0 || pairs.val().length === 0) {
      return alert('Please enter a valid name and valid number of Pairs.');
    }
    startTimer(updateTimer);
    loginContainer.slideUp('fast');
    boardContainer.slideDown('slow');
    $('#name').text(`Hello ${userName.val()}!`);
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
});
