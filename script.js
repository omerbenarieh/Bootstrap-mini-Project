// Make sure that document is ready before manipulating the DOM.

// $('#login-container').hide();

$('#board-container').hide();
$('#winner-container').hide();
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
    // close login form
    loginContainer.slideUp('fast');

    $('#name').text(`Good Luck ${nameInserted}!`);

    const game = new Game(nameInserted, numOfPairs, gameBoard);
    game.start();
  });

  // Exit Game Button
  exitBtn.click(e => {
    e.preventDefault();
    boardContainer.slideUp('fast');
    loginContainer.slideDown('slow');
    resetTimer();
    clearInputs();
  });

  class Game {
    constructor(userName, numOfPairs, divToRenderInside) {
      this.userName = userName;
      this.numOfPairs = numOfPairs;
      this.divToRenderInside = divToRenderInside;
      this.inMiddleOfTurn = false;
      this.openedCard = null;
      this.cardList = [];
      this.determinedCard = this.determinedCard.bind(this);
      this.generateCardId = this.generateCardId.bind(this);
      this.cardClicked = this.cardClicked.bind(this);
      this.finishedGame = this.finishedGame.bind(this);
    }

    start() {
      this.setUpGame();
    }

    setUpGame() {
      this.cardList = this.createCards();
      this.arrangeBoard(this.cardList);
      $('#login-container').slideUp('fast');
      $('#board-container').slideDown('slow');
    }

    createCards() {
      const symbols = this.generateSymobls(this.numOfPairs);

      symbols.forEach(sym => {
        const card_1 = new Card(this.generateCardId(), sym, this.cardClicked);
        this.cardList.push(card_1);
        const card_2 = new Card(this.generateCardId(), sym, this.cardClicked);
        this.cardList.push(card_2);
      });
      return this.cardList;
    }

    generateCardId() {
      return this.cardList.length + 1;
    }

    determinedCard(e) {
      for (let i = 0; i < this.cardList.length; i++) {
        if (e.srcElement.id == this.cardList[i].id) {
          return this.cardList[i];
        }
      }

      alert(`Unknown card id ${e.srcElement.id}`);
    }

    cardClicked(e) {
      const card = this.determinedCard(e);
      if (card.flipped) return;
      card.flip();

      if (this.inMiddleOfTurn) {
        if (card.sym === this.openedCard.sym) {
          if (this.gameEnded()) {
            setTimeout(this.finishedGame, 500);
          }
        } else {
          // Flip them back
          card.flip();
          this.openedCard.flip();
        }
        // Reset state
        this.openedCard = null;
      } else {
        this.openedCard = card;
      }

      this.inMiddleOfTurn = !this.inMiddleOfTurn;
    }

    finishedGame() {
      $('#board-container').slideUp('fast');
      $('#winner-name').text(`${this.userName} is The Winner!`);
      $('#winner-time').text(`Your time is: ${$('#clock').text()}`);
      $('#winner-container').slideDown('slow');
    }

    gameEnded() {
      for (let i = 0; i < this.cardList.length; i++) {
        if (!this.cardList[i].flipped) {
          return false;
        }
      }
      return true;
    }

    // Returns the card object instance based on the event.
    generateSymobls(symNumber) {
      const symbols = [];
      for (let i = 0; i < symNumber; i++) {
        let symbol = this.getRandomSymbol();
        while (symbols.includes(symbol)) {
          symbol = this.getRandomSymbol();
        }
        symbols.push(symbol);
      }
      return symbols;
    }

    getRandomSymbol() {
      return Math.floor(Math.random() * 30) + 1;
    }

    arrangeBoard(cards) {
      const shuffeledCards = this.shuffle(cards);
      this.renderCards(shuffeledCards);
    }

    renderCards(shuffeledCards) {
      shuffeledCards.forEach(card => {
        card.render(this.divToRenderInside);
      });
    }

    shuffle(cards) {
      for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
      }
      return cards;
    }
  }

  class Card {
    constructor(id, sym, cardClickedHandler) {
      this.id = id;
      this.sym = sym;
      this.cardClickedHandler = cardClickedHandler;
      this.flipped = false;
      this.cardElement = this.createCardElement();
    }

    createCardElement() {
      const card = document.createElement('text');
      card.innerText = '?';
      card.id = this.id;
      card.addEventListener('click', this.cardClickedHandler);
      return card;
    }

    render(divToRenderInside) {
      divToRenderInside.append(this.cardElement);
    }

    flip() {
      this.flipped = !this.flipped;
      if (this.flipped) {
        this.cardElement.innerText = this.sym;
      } else {
        this.cardElement.innerText = '?';
      }
    }
  }

  // Handler Functions

  //////////////////////
  /// Timer functions //
  //////////////////////
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
