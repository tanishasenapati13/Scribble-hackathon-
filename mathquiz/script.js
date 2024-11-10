let score = 0;
let timeLeft = 10;
let timer;
let questionCount = 0;
let currentQuestion;
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const questionDisplay = document.getElementById("question");
const answerInput = document.getElementById("answer");
const startButton = document.getElementById("startBtn");
const submitButton = document.getElementById("submitBtn");
const progressBar = document.getElementById('progress');

// Background sound when game ends
const gameOverSound = new Audio('https://example.com/scary-sound.mp3');

// Function to generate math questions
function generateQuestion() {
  const maxNum = 10 + questionCount;
  const num1 = Math.floor(Math.random() * maxNum) + 1;
  const num2 = Math.floor(Math.random() * maxNum) + 1;
  const operator = Math.random() > 0.5 ? "+" : "-";
  const question = `${num1} ${operator} ${num2}`;
  const answer = operator === "+" ? num1 + num2 : num1 - num2;
  
  return { question, answer };
}

// Function to start the game
function startGame() {
  score = 0;
  timeLeft = 10;
  questionCount = 0;
  scoreDisplay.textContent = score;
  timeDisplay.textContent = timeLeft;
  startButton.disabled = true;
  answerInput.disabled = false;
  submitButton.disabled = false;
  answerInput.value = "";
  answerInput.focus();

  nextQuestion();

  // Timer countdown
  timer = setInterval(() => {
    timeLeft--;
    timeDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

// Function to generate and display the next question
function nextQuestion() {
  if (timeLeft > 0) {
    currentQuestion = generateQuestion();
    questionDisplay.textContent = `Solve: ${currentQuestion.question}`;
  }
}

// Function to check the answer
function checkAnswer() {
  const playerAnswer = parseInt(answerInput.value);
  const feedbackElement = questionDisplay;

  // Check if the answer is correct
  if (playerAnswer === currentQuestion.answer) {
    score++;
    feedbackElement.classList.remove("incorrect");
    feedbackElement.classList.add("correct");
    feedbackElement.textContent = `Correct! ${currentQuestion.question}`;
    timeLeft += 3; // Add 3 extra seconds for a correct answer
  } else {
    feedbackElement.classList.remove("correct");
    feedbackElement.classList.add("incorrect");
    feedbackElement.textContent = `Incorrect! ${currentQuestion.question}`;
    timeLeft -= 2; // Deduct 2 seconds for an incorrect answer
  }

  scoreDisplay.textContent = score;
  timeDisplay.textContent = timeLeft;
  answerInput.value = "";
  questionCount++;

  // Update progress bar
  updateProgressBar();

  // Only call nextQuestion if there's still time left
  if (timeLeft > 0) {
    nextQuestion();
  }
}

// Function to stop the game and show the final score
function endGame() {
  clearInterval(timer);
  startButton.disabled = false;
  answerInput.disabled = true;
  submitButton.disabled = true;
  questionDisplay.textContent = `Game Over! Your score is ${score}`;
  gameOverSound.play();  // Play the game-over sound
}

// Function to update the progress bar
function updateProgressBar() {
  let progress = (questionCount / 10) * 100;  // Update based on question count or another metric
  progressBar.style.width = `${progress}%`;
}

// Event listeners for starting the game and submitting answers
startButton.addEventListener("click", startGame);
submitButton.addEventListener("click", checkAnswer);
answerInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    checkAnswer();
  }
});
