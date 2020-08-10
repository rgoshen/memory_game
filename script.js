const gameContainer = document.getElementById("game");
const colorInput = document.getElementById("colorNoInput");
const startButton = document.getElementById("start");
const resetButton = document.getElementById("reset");
const secondsLabel = document.getElementById("seconds");
const currentScore = document.getElementById("current-score");
const lowestScore = document.getElementById("lowest-score");
let lowestScores = JSON.parse(localStorage.getItem("lowestScores")) || [];

let card1, card2;
let hasFlippedCard = false;
let lockBoard = false;
let cardsFlipped = 0;
let colors = [];
let allowReset = false;
let totalSeconds = 0;
let totalClicks = 0;

lowestScore.innerHTML = lowestScores[0];

// EVENT HANDLERS
startButton.addEventListener("click", function (e) {
  e.preventDefault();
  let noOfColors = colorInput.value;

  for (let i = 0; i < noOfColors; i++) {
    let addColor = "#" + generateRandomColor();
    colors.push(addColor);
    colors.push(addColor);
  }
  let shuffledColors = shuffle(colors);
  createDivsForColors(shuffledColors);
  gameTimer = setInterval(function () {
    secondsLabel.innerHTML = totalSeconds++;
  }, 1000);
});

resetButton.addEventListener("click", function () {
  if (allowReset) {
    allowReset = false;
    totalSeconds = 0;
    totalClicks = 0;
    lowestScores = JSON.parse(localStorage.getItem("lowestScores")) || [];
    lowestScore.innerHTML = lowestScores[0];
    secondsLabel.innerHTML = totalSeconds;
    currentScore.innerHTML = totalClicks;
    while (gameContainer.firstChild) {
      gameContainer.removeChild(gameContainer.firstChild);
      resetButton.classList.add("disabled");
    }
    document.location.reload(true);
  }
});

// FUNCTIONS
function generateRandomColor() {
  let randomColor = Math.floor(Math.random() * 16777215).toString(16);
  return randomColor;
}

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attributes for the value we are looping over
    newDiv.classList.add(color);
    newDiv.classList.add("memory-card");

    // give it a data attribute for the value we are looping over
    newDiv.setAttribute("data-color", color);

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}

function handleCardClick(e) {
  if (lockBoard) return;
  if (e.target.classList.contains("flipped")) return;

  let currentCard = e.target;
  currentCard.style.backgroundColor = currentCard.classList[0];

  currentCard.classList.add("flipped");

  totalClicks++;
  currentScore.innerHTML = totalClicks;

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    card1 = currentCard;
    return;
  }

  card2 = currentCard;

  checkForMatch();
}

function checkForMatch() {
  let isMatch = card1.dataset.color === card2.dataset.color;
  isMatch ? disableCards() : unflipCards();

  if (cardsFlipped === colors.length) gameOver();

  function disableCards() {
    card1.removeEventListener("click", handleCardClick);
    card1.removeEventListener("click", handleCardClick);
    cardsFlipped += 2;
    resetBoard();
  }
}

function unflipCards() {
  lockBoard = true;

  setTimeout(function () {
    card1.removeAttribute("style");
    card2.removeAttribute("style");
    card1.classList.remove("flipped");
    card2.classList.remove("flipped");
    card1 = null;
    card2 = null;
    resetBoard();
  }, 1000);
}

function resetBoard() {
  hasFlippedCard = false;
  lockBoard = false;
  card1 = null;
  card2 = null;
}

function saveScore(cScore) {
  lowestScores.push(cScore);
  lowestScores.sort((a, b) => a - b);
  lowestScores.splice(5);
  localStorage.setItem("lowestScores", JSON.stringify(lowestScores));
  lowestScores = JSON.parse(localStorage.getItem("lowestScores")) || [];
  let bestScore = (lowestScore.innerHTML = lowestScores[0]);
  return bestScore;
}

function gameOver() {
  setTimeout(function () {
    clearInterval(gameTimer);
    let score = totalClicks;
    saveScore(score);
    alert("GAME OVER!");
    resetButton.classList.remove("disabled");
    allowReset = true;
  }, 500);
}
