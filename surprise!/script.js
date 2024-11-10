const canvas = document.getElementById("breakout");
const context = canvas.getContext("2d");

const paddleWidth = 100;
const paddleHeight = 10;
const ballSize = 10;
const brickRowCount = 5;
const brickColumnCount = 7;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

let paddleX = (canvas.width - paddleWidth) / 2;
let paddleY = canvas.height - paddleHeight - 10;
let paddleSpeed = 7;
let ballX = canvas.width / 2;
let ballY = canvas.height - 30;
let ballSpeedX = 4;
let ballSpeedY = -4;

let score = 0;
let bricks = [];

for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

let rightPressed = false;
let leftPressed = false;
let gameOver = false;

// Draw the ball
function drawBall() {
  context.beginPath();
  context.arc(ballX, ballY, ballSize, 0, Math.PI * 2);
  context.fillStyle = "#FF5733";
  context.fill();
  context.closePath();
}

// Draw the paddle
function drawPaddle() {
  context.beginPath();
  context.rect(paddleX, paddleY, paddleWidth, paddleHeight);
  context.fillStyle = "#00FF00";
  context.fill();
  context.closePath();
}

// Draw bricks
function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status == 1) {
        let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;

        context.beginPath();
        context.rect(brickX, brickY, brickWidth, brickHeight);
        context.fillStyle = "#0095DD";
        context.fill();
        context.closePath();
      }
    }
  }
}

// Handle keyboard input
document.addEventListener("keydown", (event) => {
  if (event.key === "Right" || event.key === "ArrowRight") {
    rightPressed = true;
  } else if (event.key === "Left" || event.key === "ArrowLeft") {
    leftPressed = true;
  }
});
document.addEventListener("keyup", (event) => {
  if (event.key === "Right" || event.key === "ArrowRight") {
    rightPressed = false;
  } else if (event.key === "Left" || event.key === "ArrowLeft") {
    leftPressed = false;
  }
});

// Collision detection
function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      let b = bricks[c][r];
      if (b.status == 1) {
        if (ballX > b.x && ballX < b.x + brickWidth && ballY > b.y && ballY < b.y + brickHeight) {
          ballSpeedY = -ballSpeedY;
          b.status = 0;
          score++;
          if (score == brickRowCount * brickColumnCount) {
            document.getElementById("winner").textContent = "You Win!";
            document.getElementById("game-over").style.display = "block";
            gameOver = true;
          }
        }
      }
    }
  }
}

// Draw the game elements
function draw() {
  if (gameOver) return;
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  collisionDetection();

  // Ball movement
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Ball boundary conditions
  if (ballX + ballSpeedX > canvas.width - ballSize || ballX + ballSpeedX < ballSize) {
    ballSpeedX = -ballSpeedX;
  }
  if (ballY + ballSpeedY < ballSize) {
    ballSpeedY = -ballSpeedY;
  } else if (ballY + ballSpeedY > canvas.height - ballSize) {
    if (ballX > paddleX && ballX < paddleX + paddleWidth) {
      ballSpeedY = -ballSpeedY;
    } else {
      document.getElementById("winner").textContent = "Game Over!";
      document.getElementById("game-over").style.display = "block";
      gameOver = true;
    }
  }

  // Paddle movement
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += paddleSpeed;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= paddleSpeed;
  }

  document.getElementById("score").textContent = "Score: " + score;

  if (!gameOver) {
    requestAnimationFrame(draw);
  }
}

// Restart the game
function restartGame() {
  score = 0;
  ballX = canvas.width / 2;
  ballY = canvas.height - 30;
  ballSpeedX = 4;
  ballSpeedY = -4;
  gameOver = false;
  bricks = [];
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
  }
  document.getElementById("game-over").style.display = "none";
  draw();
}

// Start the game
draw();