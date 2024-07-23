document.addEventListener('DOMContentLoaded', () => {
  const gameArea = document.getElementById('gameArea');
  const startGameButton = document.getElementById('startGame');
  const scoreBoard = document.getElementById('score');
  const gameOverDiv = document.getElementById('gameOver');
  const sensitivityInput = document.getElementById('sensitivity');
  const boxSizeInput = document.getElementById('boxSize');
  const shapeSelect = document.getElementById('shape');
  const targetColorInput = document.getElementById('targetColor');
  const civilianColorInput = document.getElementById('civilianColor');
  const difficultySelect = document.getElementById('difficulty');
  const clickSound = new Audio('Sounds/cs_go-awp-sound.mp3');
  
  let score = 0;
  let sensitivity = localStorage.getItem('sensitivity') || 1;
  let boxSize = localStorage.getItem('boxSize') || 20;
  let shape = localStorage.getItem('shape') || 'square';
  let targetColor = localStorage.getItem('targetColor') || '#ff0000';
  let civilianColor = localStorage.getItem('civilianColor') || '#0000ff';
  let difficulty = localStorage.getItem('difficulty') || 5000;
  let gameInterval;
  let gameRunning = false;

  // Set initial values
  sensitivityInput.value = sensitivity;
  boxSizeInput.value = boxSize;
  shapeSelect.value = shape;
  targetColorInput.value = targetColor;
  civilianColorInput.value = civilianColor;
  difficultySelect.value = difficulty;

  startGameButton.addEventListener('click', startGame);
  sensitivityInput.addEventListener('input', (e) => {
    sensitivity = e.target.value;
    localStorage.setItem('sensitivity', sensitivity);
  });
  boxSizeInput.addEventListener('input', (e) => {
    boxSize = e.target.value;
    localStorage.setItem('boxSize', boxSize);
  });
  shapeSelect.addEventListener('change', (e) => {
    shape = e.target.value;
    localStorage.setItem('shape', shape);
  });
  targetColorInput.addEventListener('input', (e) => {
    targetColor = e.target.value;
    localStorage.setItem('targetColor', targetColor);
  });
  civilianColorInput.addEventListener('input', (e) => {
    civilianColor = e.target.value;
    localStorage.setItem('civilianColor', civilianColor);
  });
  difficultySelect.addEventListener('change', (e) => {
    difficulty = e.target.value;
    localStorage.setItem('difficulty', difficulty);
  });

  function startGame() {
    score = 0;
    scoreBoard.innerText = score;
    gameOverDiv.classList.add('hidden');
    gameRunning = true;
    gameInterval = setInterval(spawnTargets, 1000 / sensitivity);
    gameArea.addEventListener('click', handleClick);
  }

  function endGame() {
    clearInterval(gameInterval);
    gameRunning = false;
    gameArea.removeEventListener('click', handleClick);
    gameOverDiv.classList.remove('hidden');
    clearGameArea();
  }

  function spawnTargets() {
    if (!gameRunning) return;
    const target = document.createElement('div');
    target.classList.add(Math.random() < 0.8 ? 'target' : 'civilian');
    target.style.width = `${boxSize}px`;
    target.style.height = `${boxSize}px`;
    target.style.top = `${Math.random() * (gameArea.clientHeight - boxSize)}px`;
    target.style.left = `${Math.random() * (gameArea.clientWidth - boxSize)}px`;
    target.style.borderRadius = shape === 'circle' ? '50%' : '0';
    target.style.backgroundColor = target.classList.contains('target') ? targetColor : civilianColor;
    gameArea.appendChild(target);

    setTimeout(() => {
      if (gameArea.contains(target) && target.classList.contains('target')) {
        endGame();
      } else {
        target.remove();
      }
    }, difficulty);
  }

  function handleClick(event) {
    const element = document.elementFromPoint(event.clientX, event.clientY);
    clickSound.currentTime = 0; // Reset sound to start
    clickSound.play(); // Play sound on click
    if (element.classList.contains('target')) {
      score++;
      scoreBoard.innerText = score;
      element.remove();
    } else if (element.classList.contains('civilian')) {
      endGame();
    }
  }

  function clearGameArea() {
    while (gameArea.firstChild) {
      gameArea.removeChild(gameArea.firstChild);
    }
  }
});
