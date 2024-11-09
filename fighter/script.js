const gameContainer = document.getElementById('game-container');
const fighterPlane = document.getElementById('fighter-plane');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const mainMenu = document.getElementById('main-menu');
const startButton = document.getElementById('start-button');

let score = 0;
let lives = 3;
let bullets = [];
let ufos = [];
let gameInterval;
let ufoSpawnInterval;
let difficulty = 'medium';  // Default difficulty

// Difficulty settings
const difficultySettings = {
    easy: { planeSpeed: 30, ufoSpeed: 1, spawnInterval: 2500 },
    medium: { planeSpeed: 25, ufoSpeed: 2, spawnInterval: 2000 },
    hard: { planeSpeed: 20, ufoSpeed: 3, spawnInterval: 1500 }
};

// Set difficulty
function setDifficulty(level) {
    difficulty = level;
    const buttons = document.querySelectorAll('#difficulty-options button');
    buttons.forEach(button => {
        if (button.innerText.toLowerCase() === difficulty) {
            button.style.backgroundColor = '#0066cc';
        } else {
            button.style.backgroundColor = '#00aaff';
        }
    });
}

// Move the fighter plane
document.addEventListener('keydown', (event) => {
    const planeRect = fighterPlane.getBoundingClientRect();
    const planeSpeed = difficultySettings[difficulty].planeSpeed;

    if (event.key === 'ArrowLeft' && planeRect.left > 0) {
        fighterPlane.style.left = `${fighterPlane.offsetLeft - planeSpeed}px`;
    } else if (event.key === 'ArrowRight' && planeRect.right < gameContainer.offsetWidth) {
        fighterPlane.style.left = `${fighterPlane.offsetLeft + planeSpeed}px`;
    } else if (event.key === ' ' && bullets.length < 5) {
        shootBullet();
    }
});

// Shoot a bullet (beam) with multiple dashes
function shootBullet() {
    const dashCount = 5; // Number of dashes in the beam
    const dashHeight = 4; // Height of each dash in pixels
    const dashSpacing = 2; // Space between dashes in pixels

    const bulletContainer = document.createElement('div');
    bulletContainer.classList.add('bullet-container');
    bulletContainer.style.left = `${fighterPlane.offsetLeft + 22}px`; 
    bulletContainer.style.bottom = '70px';
    gameContainer.appendChild(bulletContainer);

    for (let i = 0; i < dashCount; i++) {
        const dash = document.createElement('div');
        dash.classList.add('dash');
        dash.style.bottom = `${i * (dashHeight + dashSpacing)}px`;
        bulletContainer.appendChild(dash);
    }

    bullets.push(bulletContainer);

    let bulletInterval = setInterval(() => {
        if (bulletContainer) {
            bulletContainer.style.bottom = `${bulletContainer.offsetTop + 10}px`;

            if (bulletContainer.offsetTop < 0) {
                clearInterval(bulletInterval);
                bulletContainer.remove();
                bullets = bullets.filter(b => b !== bulletContainer);
            } else {
                ufos.forEach((ufo, ufoIndex) => {
                    if (isColliding(bulletContainer, ufo)) {
                        score++;
                        scoreDisplay.innerText = `Score: ${score}`;

                        ufo.style.backgroundColor = 'orange';

                        clearInterval(bulletInterval);
                        bulletContainer.remove();
                        bullets = bullets.filter(b => b !== bulletContainer);
                        ufo.remove();
                        ufos.splice(ufoIndex, 1);
                    }
                });
            }
        }
    }, 20);

    setTimeout(() => {
        if (bulletContainer) {
            bulletContainer.remove();
            bullets = bullets.filter(b => b !== bulletContainer);
        }
    }, 3000);
}

// Spawn UFOs
function spawnUFO() {
    if (ufos.length >= 5) return;

    const ufo = document.createElement('div');
    ufo.classList.add('ufo');
    ufo.style.left = `${Math.random() * (gameContainer.offsetWidth - 50)}px`;
    ufo.style.top = '-50px';
    gameContainer.appendChild(ufo);
    ufos.push(ufo);
}

// Game loop
function gameLoop() {
    ufos.forEach((ufo, ufoIndex) => {
        ufo.style.top = `${ufo.offsetTop + difficultySettings[difficulty].ufoSpeed}px`;
        if (ufo.offsetTop > gameContainer.offsetHeight) {
            lives--;
            livesDisplay.innerText = `Lives: ${lives}`;
            ufo.remove();
            ufos.splice(ufoIndex, 1);
            if (lives <= 0) {
                endGame();
            }
        }
    });
}

// Check for collision between bullet container and UFO
function isColliding(bulletContainer, ufo) {
    const bulletRect = bulletContainer.getBoundingClientRect();
    const ufoRect = ufo.getBoundingClientRect();
    return !(bulletRect.top > ufoRect.bottom || bulletRect.bottom < ufoRect.top || bulletRect.left > ufoRect.right || bulletRect.right < ufoRect.left);
}

// End the game
function endGame() {
    clearInterval(gameInterval);
    clearInterval(ufoSpawnInterval);
    alert(`Game Over! Your score: ${score}`);
    resetGame();
}

// Reset the game
function resetGame() {
    score = 0;
    lives = 3;
    scoreDisplay.innerText = `Score: ${score}`;
    livesDisplay.innerText = `Lives: ${lives}`;
    ufos.forEach(ufo => ufo.remove());
    ufos = [];
    bullets.forEach(bullet => bullet.remove());
    bullets = [];
    mainMenu.style.display = 'flex';
    gameContainer.style.display = 'none';
}

// Start the game
function startGame() {
    mainMenu.style.display = 'none';
    gameContainer.style.display = 'block';
    gameInterval = setInterval(gameLoop, 20);
    ufoSpawnInterval = setInterval(spawnUFO, difficultySettings[difficulty].spawnInterval);
}
