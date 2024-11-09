function startGame(game) {
    switch (game) {
        case 'memoryMatch':
            window.location.href = 'memory/index.html'; // Path to Memory Match game
            break;
        case 'fighterUFO':
            window.location.href = 'fighter/index.html'; // Path to Fighter UFO game
            break;
        default:
            console.error('Game not found!');
    }
  }
  
  