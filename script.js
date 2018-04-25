let player = {
  cards: [],
  total: 0,
  bank: 2500
};
let dealer = {
  cards: [],
  total: 0
};
let drawnCards = [];
let pot = 0;

function deal() {
  // resets everything before play
  player.cards = [];
  dealer.cards = [];
  player.total = 0;
  dealer.total = 0;
  drawnCards = [];
  document.getElementById("winner").innerHTML = "";
  // clears the player cards from the board
  let playerCards = document.getElementById("player-cards");
  while (playerCards.firstChild) {
    playerCards.removeChild(playerCards.firstChild);
  }
  // clears the dealer cards from the board
  let dealerCards = document.getElementById("dealer-cards");
  while (dealerCards.firstChild) {
    dealerCards.removeChild(dealerCards.firstChild);
  }
  draw(player);
  draw(player);
  draw(dealer);
  play();
  // hides the deal button
  document.getElementById("deal").style.visibility = "hidden";
  document.getElementById("hit").style.visibility = "visible";
  document.getElementById("stand").style.visibility = "visible";
  document.getElementById("place").style.visibility = "hidden";
}

function draw(person) {
  const number = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'];
  const suit = ["♠", "♦", "♥", "♣"];
  const randomSuit = Math.floor(Math.random() * suit.length);
  const randomNumber = Math.floor(Math.random() * number.length);
  let newCard = number[randomNumber] + " " + suit[randomSuit];
  // checks to see if the new card is not a duplicate of a card thats already been drawn
  drawnCards.forEach(card => {
    if (card == newCard) {
      newCard = '';
      draw(person);
    }
  });
  // makes sure the card isnt a blank before pushing the card
  if (newCard != '') {
    // Updates the total of all face cards
    if (number[randomNumber] == 'K' || number[randomNumber] == 'Q' || number[randomNumber] == 'J') {
      person.total = person.total + 10;
    } else if (number[randomNumber] == 'A' && person.total < 11) {
      person.total = person.total + 11;
    } else if (number[randomNumber] == 'A' && person.total > 10) {
      person.total = person.total + 1;
    } else {
      person.total = person.total + number[randomNumber];
    }
    drawnCards.push(newCard);
    person.cards.push(newCard);
  }
}

function play() {
  player.cards.forEach(card => {
    let div = document.createElement("div");
    div.className = "card slide mx-1";
    div.innerHTML = card;
    document.getElementById("player-cards").appendChild(div);
  });
  dealer.cards.forEach(card => {
    let div = document.createElement("div");
    div.className = "card slide mx-1";
    div.innerHTML = card;
    document.getElementById("dealer-cards").appendChild(div);
  });
  // creates the second dealer card which appears "flipped over"
  let div = document.createElement("div");
  div.className = "card slide mx-1";
  div.id = "flip";
  document.getElementById("dealer-cards").appendChild(div);
  document.getElementById("coins").style.visibility = 'hidden';
  total();
  // checks if the player got 21 off the first 2 drawn cards 
  if (player.total == 21) {
    stand();
  }
}

function hit() {
  draw(player);
  let newCard = document.createElement("div");
  newCard.className = "card slide mx-1";
  newCard.innerHTML = player.cards[player.cards.length - 1];
  document.getElementById("player-cards").appendChild(newCard);
  total();
  if (player.total > 21) {
    stand();
  }
}
//updates the total on the board of the player and dealer
function total() {
  document.getElementById("player-total").innerHTML = " Your Total: " + player.total;
  document.getElementById("dealer-total").innerHTML = " Dealer Total: " + dealer.total;
}

function stand() {
  draw(dealer);
  document.getElementById("flip").style = "display:none";
  let newCard = document.createElement("div");
  newCard.className = "card slide mx-1";
  newCard.innerHTML = dealer.cards[dealer.cards.length - 1];
  document.getElementById("dealer-cards").appendChild(newCard);
  total();
  // dealer draws card until he beats player or busts
  while (player.total > dealer.total && dealer.total < 21 && player.total <= 21) {
    stand();
  }
  checkWinner();
}

function checkWinner() {
  if (dealer.total > 21) {
    winner(player);
  } else if (player.total > 21) {
    winner(dealer);
  } else if (player.total == 21 && dealer.total != 21) {
    winner(player);
  } else if (dealer.total == 21 && player.total != 21) {
    winner(dealer);
  } else if (dealer.total == player.total) {
    winner(draw);
  } else {
    if (player.total < dealer.total) {
      winner(dealer);
    } else {
      winner(player);
    }
  }
}
// if the amount isnt stated, then it will be all of the players bank
function bet(amount = player.bank) {
  // checks to see if the player has the amount passed
  if (amount <= player.bank) {
    pot = pot + amount;
    player.bank = player.bank - amount;
    document.getElementById("bet").innerHTML = "Bet: $" + pot;
    document.getElementById("player-bank").innerHTML = "Your Bank: $" + player.bank;
    newPot();
  }
}

function winner(person) {
  switch (person) {
    case dealer:
      pot = 0;
      document.getElementById("bet").innerHTML = "Bet: $" + pot;
      document.getElementById("player-bank").innerHTML = "Your bank: $" + player.bank;
      document.getElementById("winner").innerHTML = "Dealer Wins!!!!";
      document.getElementById("place").style.visibility = "visible";
      document.getElementById("coins").style.visibility = 'visible';
      newPot();
      break;
    case player:
      player.bank = player.bank + (pot * 2);
      pot = 0;
      document.getElementById("bet").innerHTML = "Bet: $" + pot;
      document.getElementById("player-bank").innerHTML = "Your bank: $" + player.bank;
      document.getElementById("winner").innerHTML = "You Win!!!!";
      document.getElementById("place").style.visibility = "visible";
      document.getElementById("coins").style.visibility = 'visible';
      newPot();
      break;
    case draw:
      document.getElementById("bet").innerHTML = "Bet: $" + pot;
      document.getElementById("player-bank").innerHTML = "Your bank: $" + player.bank;
      document.getElementById("winner").innerHTML = "Draw!!!!";
      document.getElementById("place").style.visibility = "visible";
      document.getElementById("hit").style.visibility = 'hidden';
      document.getElementById("stand").style.visibility = 'hidden';
      document.getElementById("deal").style.visibility = 'visible';
      document.getElementById("coins").style.visibility = 'visible';
      break;
  }
}

function newPot() {
  if (pot == 0) {
    document.getElementById("hit").style.visibility = "hidden";
    document.getElementById("stand").style.visibility = "hidden";
    document.getElementById("deal").style.visibility = "hidden";
  } else {
    document.getElementById("deal").style.visibility = "visible";
  }
}

function newGame() {
  document.getElementById("winner").innerHTML = "";
  document.getElementById("place").style.visibility = "visible";
  document.getElementById("player-bank").innerHTML = "Your bank: $" + player.bank;
  document.getElementById("bet").innerHTML = "Bet: $" + pot;
  newPot();
}