let cardValues = [];
let cardElements = [];
let flippedCards = [];
let matchedPairs = 0;
let totalPairs = 6; // Set to 6 pairs for level 1
let timer;
let timeLeft;
let playerName = '';
let currentLevel = 1;
let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

// Generate card values based on the level
function generateCardValues(pairsPerLevel) {
    const values = [];
    const candies = ['🍬', '🍭', '🍫', '🍩', '🍪', '🍰', '🍦', '🍧', '🍨', '🍡']; // Candy-themed emojis

    for (let i = 0; i < pairsPerLevel; i++) {
        values.push(candies[i % candies.length], candies[i % candies.length]); // Create pairs
    }

    return values;
}

// Start the game
function startGame() {
    playerName = document.getElementById('player-name').value.trim() || 'Player'; // Use 'Player' if name is empty
    document.getElementById('start-button').style.display = 'none';
    document.getElementById('restart-button').style.display = 'inline-block';
    document.getElementById('message').innerText = '';
    document.getElementById('level-display').innerText = `Level: ${currentLevel}`;
    matchedPairs = 0;
    timeLeft = 30; // Start with 30 seconds
    cardValues = generateCardValues(totalPairs);
    cardValues = shuffle(cardValues);
    createCards();
    startTimer();
}

// Create card elements
function createCards() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = ''; // Clear the board
    const gridSize = Math.ceil(Math.sqrt(totalPairs * 2)); // Calculate grid size
    gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`; // Set column count

    // Generate cards with values
    cardElements = [];
    cardValues.forEach((value, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.setAttribute('data-value', value);
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
        cardElements.push(card);
    });
}

// Flip card function
function flipCard() {
    if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
        this.classList.add('flipped');
        this.innerText = this.getAttribute('data-value');
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            setTimeout(checkMatch, 1000);
        }
    }
}

// Check for a match
function checkMatch() {
    const [firstCard, secondCard] = flippedCards;

    if (firstCard.getAttribute('data-value') === secondCard.getAttribute('data-value')) {
        matchedPairs++;
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        if (matchedPairs === totalPairs) {
            clearInterval(timer);
            document.getElementById('message').innerText = 'You won this level! 🎉';
            recordScore();
            setTimeout(nextLevel, 2000); // Move to the next level after 2 seconds
        }
    } else {
        firstCard.classList.remove('flipped');
        firstCard.innerText = '';
        secondCard.classList.remove('flipped');
        secondCard.innerText = '';
    }

    flippedCards = [];
}

// Start the timer
function startTimer() {
    document.getElementById('timer').innerText = `Time left: ${timeLeft} seconds`;
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').innerText = `Time left: ${timeLeft} seconds`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            document.getElementById('message').innerText = 'Time is up! You lost! 😢';
            disableCards();
        }
    }, 1000);
}

// Disable cards after game over
function disableCards() {
    cardElements.forEach(card => {
        card.removeEventListener('click', flipCard);
    });
}

// Shuffle function
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Record score in localStorage
function recordScore() {
    const score = timeLeft; // Score is based on time left
    leaderboard.push({ name: playerName, score: score });
    leaderboard.sort((a, b) => b.score - a.score); // Sort by score (descending)
    leaderboard = leaderboard.slice(0, 10); // Keep top 10 scores
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    updateLeaderboard();
}

// Update the leaderboard display
function updateLeaderboard() {
    const leaderboardList = document.getElementById('leaderboard-list');
    leaderboardList.innerHTML = ''; // Clear previous leaderboard

    leaderboard.forEach(entry => {
        const listItem = document.createElement('li');
        listItem.innerText = `${entry.name}: ${entry.score} seconds`;
        leaderboardList.appendChild(listItem);
    });
}

// Move to the next level
function nextLevel() {
    currentLevel++;
    totalPairs += 2; // Increase pairs for the next level
    timeLeft = Math.max(30, timeLeft + 10); // Add more time per level, minimum 30 seconds
    document.getElementById('level-display').innerText = `Level: ${currentLevel}`;
    document.getElementById('game-board').innerHTML = ''; // Clear the game board
    matchedPairs = 0; // Reset matched pairs
    cardValues = generateCardValues(totalPairs); // Generate new card values
    cardValues = shuffle(cardValues);
    createCards();
    startTimer();
}

// Restart the game
document.getElementById('restart-button').addEventListener('click', () => {
    document.getElementById('restart-button').style.display = 'none';
    document.getElementById('start-button').style.display = 'inline-block';
    localStorage.removeItem('leaderboard'); // Clear leaderboard on restart
    leaderboard = []; // Reset leaderboard array
    document.getElementById('leaderboard-list').innerHTML = ''; // Clear leaderboard display
    currentLevel = 1; // Reset level
    totalPairs = 6; // Reset pairs for level 1
    startGame(); // Start a new game immediately after restart
});

// Event listener for the start button
document.getElementById('start-button').addEventListener('click', startGame);

// Initialize leaderboard display on page load
updateLeaderboard();
