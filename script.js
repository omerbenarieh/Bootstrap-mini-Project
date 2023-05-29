// Make sure that document is ready before manipulating the DOM.
$('#board-container').hide();
$('#winner-container').hide();

$(document).ready(function () {
  // Start Game Button
  $('#start').click(e => {
    e.preventDefault();
    const game = new Game(
      $('#username').val(),
      $('#pairs').val(),
      $('#game-board')
    );
    game.start();
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
      this.restartGame = this.restartGame.bind(this);
      this.updateClock = this.updateClock.bind(this);
      this.exitGame = this.exitGame.bind(this);

      this.containers = {
        loginContainer: $('#login-container'),
        boardContainer: $('#board-container'),
        winnerContainer: $('#winner-container'),
      };
    }

    start() {
      if (this.checkUserInput(this.userName, this.numOfPairs)) {
        this.setUpGame();
      }
      this.setContainer($('#name'), `Hello ${this.userName} Good Luck`);
    }

    setUpGame() {
      this.cardList = this.createCards();
      this.arrangeBoard(this.cardList);
      this.startClock();
      this.showBoard();
    }

    createCards() {
      const symbols = this.generateSymbols(this.numOfPairs);

      symbols.forEach(sym => {
        const card_1 = new Card(this.generateCardId(), sym, this.cardClicked);
        this.cardList.push(card_1);
        const card_2 = new Card(this.generateCardId(), sym, this.cardClicked);
        this.cardList.push(card_2);
      });
      return this.cardList;
    }

    arrangeBoard(cards) {
      const shuffeledCards = this.shuffle(cards);
      this.renderCards(shuffeledCards);
    }

    startClock() {
      this.clockInterval;
      this.totalSeconds = 0;
      this.clockInterval = setInterval(this.updateClock, 1000);
    }

    showBoard() {
      this.hideContainer(this.containers.loginContainer);
      this.hideContainer(this.containers.winnerContainer);
      this.displayContainer(this.containers.boardContainer);
      $('#exit').click(this.exitGame);
    }
    // Returns the card object instance based on the event.
    generateSymbols(symNumber) {
      const emojis = [
        '🍕',
        '🍔',
        '🌭',
        '🍟',
        '🍗',
        '🍖',
        '🌮',
        '🌯',
        '🍝',
        '🍜',
        '🍲',
        '🍛',
        '🍣',
        '🍱',
        '🥟',
        '🍤',
        '🍙',
        '🍚',
        '🍘',
        '🍥',
        '🍧',
        '🍨',
        '🍦',
        '🍰',
        '🎂',
        '🍫',
        '🍩',
        '🍪',
        '🍮',
        '🍭',
      ];
      const symbols = [];
      for (let i = 0; i < symNumber; i++) {
        let emoji = this.getRandomEmoji(emojis);
        while (symbols.includes(emoji)) {
          emoji = this.getRandomEmoji(emojis);
        }
        symbols.push(emoji);
      }
      return symbols;
    }

    getRandomEmoji(emojis) {
      const index = Math.floor(Math.random() * emojis.length);
      return emojis[index];
    }

    generateCardId() {
      return this.cardList.length + 1;
    }

    shuffle(cards) {
      for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
      }
      return cards;
    }

    renderCards(shuffeledCards) {
      shuffeledCards.forEach(card => {
        card.render(this.divToRenderInside);
      });
    }

    stopClock() {
      clearInterval(this.clockInterval);
    }

    resetClock() {
      this.stopClock();
      this.totalSeconds = 0;
      this.updateClock();
    }

    checkUserInput(userName, numOfPairs) {
      if (
        userName.length === 0 ||
        numOfPairs.length === 0 ||
        numOfPairs < 2 ||
        numOfPairs > 31
      ) {
        return alert('Please enter a valid name and valid number of Pairs.');
      }
      return true;
    }
    updateClock() {
      const minutes = Math.floor(this.totalSeconds / 60);
      const seconds = this.totalSeconds % 60;
      const formattedTime = `${this.formatTime(minutes)}:${this.formatTime(
        seconds
      )}`;
      $('#clock').text(formattedTime);
      this.totalSeconds++;
    }

    formatTime(time) {
      return time < 10 ? '0' + time : time;
    }

    exitGame(e) {
      e.preventDefault();
      this.clearDOM();
      this.showLoginForm();
      this.resetClock();
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
            setTimeout(this.finishedGame, 700);
          }
          this.addOutLine(card.cardElement, this.openedCard.cardElement);
        } else {
          // Flip them back
          setTimeout(() => {
            card.flip();
            this.openedCard.flip();
            this.openedCard = null;
          }, 700);
        }
      } else {
        this.openedCard = card;
      }

      this.inMiddleOfTurn = !this.inMiddleOfTurn;
    }

    addOutLine(card1, card2) {
      card1.classList.add('big-card');
      card2.classList.add('big-card');
    }

    removeCardEffect(card1, card2) {
      card1.classList.remove('big-card');
      card2.classList.remove('big-card');
    }

    finishedGame() {
      this.hideContainer(this.containers.boardContainer);
      this.setContainer($('#winner-name'), `${this.userName} is The Winner!`);
      this.setContainer(
        $('#winner-time'),
        `Your time is: ${$('#clock').text()}`
      );
      this.displayContainer(this.containers.winnerContainer);
      $('#play-again').click(this.restartGame);
    }

    displayContainer(container) {
      container.slideDown('slow');
    }
    hideContainer(container) {
      container.slideUp('fast');
    }

    setContainer(container, text) {
      container.text(text);
    }

    restartGame(e) {
      e.preventDefault();
      this.clearDOM();
      this.showLoginForm();
      this.resetClock();
    }

    clearDOM() {
      this.divToRenderInside.empty();
      // Clear user inputs
      $('#username').val('');
      $('#pairs').val('');
      this.resetClock();
    }

    showLoginForm() {
      this.hideContainer(this.containers.winnerContainer);
      this.hideContainer(this.containers.boardContainer);
      this.displayContainer(this.containers.loginContainer);
    }

    gameEnded() {
      for (let i = 0; i < this.cardList.length; i++) {
        if (!this.cardList[i].flipped) {
          return false;
        }
      }
      return true;
    }

    getRandomSymbol() {
      return Math.floor(Math.random() * 30) + 1;
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
      const card = document.createElement('div');
      card.innerText = '❓';
      card.id = this.id;
      card.style.cursor = 'pointer';
      card.className = 'card';
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
        this.cardElement.innerText = '❓';
      }
      this.cardElement.classList.toggle('flipped');
    }
  }
});
