const words = ["tanisha", "mansha", "ishita", "roshni", "shaurya", "kshirja"];
let score = 0;
let timeLeft = 60;
let wpm = 0;
let typedWords = 0;
let currentWord;
let timer;

const scoreDisplay = document.getElementById("score");
const wpmDisplay = document.getElementById("wpm");
const timeLeftDisplay = document.getElementById("time-left");
const wordDisplay = document.getElementById("word-display");
const inputBox = document.getElementById("input-box");
const startScreen = document.getElementById("start-screen");
const stats = document.getElementById("stats");
const gameOverDisplay = document.getElementById("game-over");
const finalScoreDisplay = document.getElementById("final-score");
const finalWPMDisplay = document.getElementById("final-wpm");

function startGame() {
    score = 0;
    timeLeft = 60;
    wpm = 0;
    typedWords = 0;
    scoreDisplay.textContent = "Score: 0";
    timeLeftDisplay.textContent = "Time Left: 60s";
    wpmDisplay.textContent = "WPM: 0";

    startScreen.classList.add("hidden");
    stats.classList.remove("hidden");
    wordDisplay.classList.remove("hidden");
    inputBox.classList.remove("hidden");
    gameOverDisplay.classList.add("hidden");

    inputBox.value = "";
    inputBox.disabled = false;
    inputBox.focus();

    timer = setInterval(updateTimer, 1000);
    generateWord();
}

function generateWord() {
    currentWord = words[Math.floor(Math.random() * words.length)];
    wordDisplay.textContent = currentWord;
}

function checkInput() {
    const typedWord = inputBox.value.trim();

    if (typedWord === currentWord) {
        score += 10;
        typedWords++;
        scoreDisplay.textContent = `Score: ${score}`;

        const elapsedTime = 60 - timeLeft;
        wpm = elapsedTime > 0 ? Math.floor((typedWords / elapsedTime) * 60) : 0;
        wpmDisplay.textContent = `WPM: ${wpm}`;

        inputBox.value = "";
        generateWord();
    }
}

function updateTimer() {
    timeLeft--;
    timeLeftDisplay.textContent = `Time Left: ${timeLeft}s`;

    if (timeLeft <= 0) {
        clearInterval(timer);
        endGame();
    }
}

function endGame() {
    inputBox.disabled = true;
    gameOverDisplay.classList.remove("hidden");
    stats.classList.add("hidden");
    wordDisplay.classList.add("hidden");
    inputBox.classList.add("hidden");

    finalScoreDisplay.textContent = `Final Score: ${score}`;
    finalWPMDisplay.textContent = `Final WPM: ${wpm}`;
}

inputBox.addEventListener("input", checkInput);
