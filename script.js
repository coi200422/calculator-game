let score = 0;
let highscore = localStorage.getItem('calc_highscore') || 0;
let timeLeft = 30;
let currentAnswer = 0;
let timerInterval = null;
let isPlaying = false;
let currentDifficulty = 'easy';

const display = document.getElementById('calc-display');
const questionEl = document.getElementById('question');
const scoreEl = document.getElementById('score');
const highscoreEl = document.getElementById('highscore');
const timerEl = document.getElementById('timer');
const startBtn = document.getElementById('start-btn');
const difficultyBox = document.getElementById('difficulty-box');

// Display saved highscore on load
highscoreEl.textContent = highscore;

function setDifficulty(level) {
  if (isPlaying) return;
  currentDifficulty = level;
  
  // Update active button UI style
  document.querySelectorAll('.diff-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.textContent.toLowerCase() === level) {
      btn.classList.add('active');
    }
  });
}

function startGame() {
  score = 0;
  timeLeft = 30;
  isPlaying = true;
  scoreEl.textContent = score;
  timerEl.textContent = timeLeft;
  startBtn.textContent = 'RESET';
  display.value = '';
  
  // Disable difficulty change while playing
  document.querySelectorAll('.diff-btn').forEach(btn => btn.style.pointerEvents = 'none');

  clearInterval(timerInterval);
  generateQuestion();

  timerInterval = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function generateQuestion() {
  let num1, num2, op;
  const operators = ['+', '-', '*'];
  op = operators[Math.floor(Math.random() * operators.length)];

  if (currentDifficulty === 'easy') {
    num1 = Math.floor(Math.random() * 10) + 1;
    num2 = Math.floor(Math.random() * 10) + 1;
  } else if (currentDifficulty === 'medium') {
    num1 = Math.floor(Math.random() * 20) + 5;
    num2 = Math.floor(Math.random() * 12) + 1;
  } else { // Hard mode
    num1 = Math.floor(Math.random() * 50) + 10;
    num2 = Math.floor(Math.random() * 20) + 5;
    // Introduce division or larger numbers occasionally
    if (Math.random() > 0.5) op = '*';
  }

  if (op === '+') currentAnswer = num1 + num2;
  if (op === '-') {
    // Prevent negative answers on easy mode for simplicity
    if (currentDifficulty === 'easy' && num1 < num2) {
      let temp = num1; num1 = num2; num2 = temp;
    }
    currentAnswer = num1 - num2;
  }
  if (op === '*') currentAnswer = num1 * num2;

  questionEl.textContent = `${num1} ${op} ${num2} = ?`;
}

function appendNum(char) {
  if (!isPlaying) return;
  display.value += char;
}

function clearDisplay() {
  display.value = '';
}

function deleteLast() {
  display.value = display.value.slice(0, -1);
}

function submitAnswer() {
  if (!isPlaying) return;
  const userAnswer = parseInt(display.value, 10);

  if (userAnswer === currentAnswer) {
    score += (currentDifficulty === 'hard' ? 30 : currentDifficulty === 'medium' ? 20 : 10);
    scoreEl.textContent = score;
    display.value = '';
    generateQuestion();
  } else {
    // Flash red error effect
    display.style.borderColor = '#eb455f';
    setTimeout(() => {
      display.style.borderColor = '#292d36';
    }, 250);
    display.value = '';
  }
}

function endGame() {
  clearInterval(timerInterval);
  isPlaying = false;
  
  // Re-enable difficulty selection
  document.querySelectorAll('.diff-btn').forEach(btn => btn.style.pointerEvents = 'auto');

  if (score > highscore) {
    highscore = score;
    localStorage.setItem('calc_highscore', highscore);
    highscoreEl.textContent = highscore;
    questionEl.textContent = `New High Score! (${score})`;
  } else {
    questionEl.textContent = `Time's Up! (${score} pts)`;
  }
  
  startBtn.textContent = 'START';
}

// Keyboard shortcut support
document.addEventListener('keydown', (e) => {
  if (!isPlaying) return;
  if ((e.key >= '0' && e.key <= '9') || e.key === '-') {
    appendNum(e.key);
  } else if (e.key === 'Enter') {
    submitAnswer();
  } else if (e.key === 'Backspace') {
    deleteLast();
  } else if (e.key === 'Escape') {
    clearDisplay();
  }
});