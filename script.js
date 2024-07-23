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
  const crosshairColorInput = document.getElementById('crosshairColor');
  const crosshairSizeInput = document.getElementById('crosshairSize');
  const crosshairThicknessInput = document.getElementById('crosshairThickness');
  const crosshairPreview = document.getElementById('crosshairPreview');
  const clickSound = new Audio('Sounds/cs_go-awp-sound.mp3');
  
  let score = 0;
  let sensitivity = localStorage.getItem('sensitivity') || 1;
  let boxSize = localStorage.getItem('boxSize') || 20;
  let shape = localStorage.getItem('shape') || 'square';
  let targetColor = localStorage.getItem('targetColor') || '#ff0000';
  let civilianColor = localStorage.getItem('civilianColor') || '#0000ff';
  let difficulty = localStorage.getItem('difficulty') || 5000;
  let crosshairColor = localStorage.getItem('crosshairColor') || '#00ff00';
  let crosshairSize = localStorage.getItem('crosshairSize') || 50;
  let crosshairThickness = localStorage.getItem('crosshairThickness') || 2;
  let gameInterval;
  let gameRunning = false;

  // Set initial values
  sensitivityInput.value = sensitivity;
  boxSizeInput.value = boxSize;
  shapeSelect.value = shape;
  targetColorInput.value = targetColor;
  civilianColorInput.value = civilianColor;
  difficultySelect.value = difficulty;
  crosshairColorInput.value = crosshairColor;
  crosshairSizeInput.value = crosshairSize;
  crosshairThicknessInput.value = crosshairThickness;

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
  crosshairColorInput.addEventListener('input', (e) => {
    crosshairColor = e.target.value;
    localStorage.setItem('crosshairColor', crosshairColor);
    updateCrosshairPreview();
  });
  crosshairSizeInput.addEventListener('input', (e) => {
    crosshairSize = e.target.value;
    localStorage.setItem('crosshairSize', crosshairSize);
    updateCrosshairPreview();
  });
  crosshairThicknessInput.addEventListener('input', (e) => {
    crosshairThickness = e.target.value;
    localStorage.setItem('crosshairThickness', crosshairThickness);
    updateCrosshairPreview();
  });

  function startGame() {
    score = 0;
    scoreBoard.innerText = score;
    gameOverDiv.classList.add('hidden');
    gameRunning = true;
    gameInterval = setInterval(spawnTargets, 1000 / sensitivity);
    gameArea.addEventListener('click', handleClick);
    gameArea.addEventListener('mousemove', updateCrosshairPosition);
    updateCrosshair(); // Set the crosshair on game start
  }

  function endGame() {
    clearInterval(gameInterval);
    gameRunning = false;
    gameArea.removeEventListener('click', handleClick);
    gameArea.removeEventListener('mousemove', updateCrosshairPosition);
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

  function updateCrosshair() {
    // Remove old crosshair elements
    document.querySelectorAll('.crosshair').forEach(el => el.remove());

    // Create new crosshair elements
    const horizontalLine = document.createElement('div');
    horizontalLine.className = 'crosshair horizontal';
    horizontalLine.style.backgroundColor = crosshairColor;
    horizontalLine.style.width = `${crosshairSize}px`;
    horizontalLine.style.height = `${crosshairThickness}px`;
    horizontalLine.style.position = 'absolute';

    const verticalLine = document.createElement('div');
    verticalLine.className = 'crosshair vertical';
    verticalLine.style.backgroundColor = crosshairColor;
    verticalLine.style.height = `${crosshairSize}px`;
    verticalLine.style.width = `${crosshairThickness}px`;
    verticalLine.style.position = 'absolute';

    gameArea.appendChild(horizontalLine);
    gameArea.appendChild(verticalLine);

    gameArea.crosshairHorizontal = horizontalLine;
    gameArea.crosshairVertical = verticalLine;

    updateCrosshairPosition({ clientX: gameArea.clientWidth / 2, clientY: gameArea.clientHeight / 2 });
  }

  function updateCrosshairPosition(e) {
    const rect = gameArea.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const horizontalLine = gameArea.crosshairHorizontal;
    const verticalLine = gameArea.crosshairVertical;

    if (horizontalLine && verticalLine) {
      horizontalLine.style.left = `${x - crosshairSize / 2}px`;
      horizontalLine.style.top = `${y - crosshairThickness / 2}px`;

      verticalLine.style.left = `${x - crosshairThickness / 2}px`;
      verticalLine.style.top = `${y - crosshairSize / 2}px`;
    }
  }

  function updateCrosshairPreview() {
    // Remove old crosshair elements from preview
    while (crosshairPreview.firstChild) {
      crosshairPreview.removeChild(crosshairPreview.firstChild);
    }

    // Create new crosshair elements for preview
    const horizontalLine = document.createElement('div');
    horizontalLine.className = 'crosshair horizontal';
    horizontalLine.style.backgroundColor = crosshairColor;
    horizontalLine.style.width = `${crosshairSize}px`;
    horizontalLine.style.height = `${crosshairThickness}px`;

    const verticalLine = document.createElement('div');
    verticalLine.className = 'crosshair vertical';
    verticalLine.style.backgroundColor = crosshairColor;
    verticalLine.style.height = `${crosshairSize}px`;
    verticalLine.style.width = `${crosshairThickness}px`;

    crosshairPreview.appendChild(horizontalLine);
    crosshairPreview.appendChild(verticalLine);
  }

  // Initialize crosshair preview
  updateCrosshairPreview();
});
