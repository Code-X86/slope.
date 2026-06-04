const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const restartBtn = document.getElementById('restart');
const modePvP = document.getElementById('modePvP');
const modePvAI = document.getElementById('modePvAI');
const difficultiesEl = document.getElementById('difficulties');
const diffEasy = document.getElementById('diffEasy');
const diffMedium = document.getElementById('diffMedium');
const diffHard = document.getElementById('diffHard');

let board = Array(9).fill(null);
let current = 'X';
let running = true;
let mode = 'pvp'; // 'pvp' or 'pvc' (player vs computer)
const AI_PLAYER = 'O';
const HUMAN_PLAYER = 'X';
let difficulty = 'medium'; // 'easy' | 'medium' | 'hard'

function createBoard(){
  boardEl.innerHTML = '';
  for(let i=0;i<9;i++){
    const cell = document.createElement('button');
    cell.className = 'cell';
    cell.setAttribute('data-index', i);
    cell.addEventListener('click', onCellClick);
    cell.textContent = board[i] || '';
    boardEl.appendChild(cell);
  }
}

function onCellClick(e){
  if(!running) return;
  const i = Number(e.currentTarget.dataset.index);
  if(board[i]) return;
  board[i] = current;
  render();
  const winner = checkWinner();
  if(winner){
    statusEl.textContent = winner === 'draw' ? "It's a draw" : `Player ${winner} wins!`;
    running = false;
    highlightWinning(winner);
    return;
  }
  // switch turn
  current = current === 'X' ? 'O' : 'X';
  statusEl.textContent = `Player ${current}'s turn`;

  // if mode is PvAI and it's AI's turn, let AI play
  if (mode === 'pvc' && current === AI_PLAYER && running) {
    statusEl.textContent = `AI's turn`;
    setTimeout(() => { aiMove(); }, 220);
  }
}

function render(){
  Array.from(boardEl.children).forEach((cell, idx) => {
    cell.textContent = board[idx] || '';
  });
}

function checkWinner(){
  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for(const [a,b,c] of lines){
    if(board[a] && board[a] === board[b] && board[a] === board[c]){
      return board[a];
    }
  }
  if(board.every(Boolean)) return 'draw';
  return null;
}

function highlightWinning(winner){
  if(winner === 'draw') return;
  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for(const [a,b,c] of lines){
    if(board[a] && board[a] === board[b] && board[a] === board[c]){
      [a,b,c].forEach(i => boardEl.children[i].classList.add('win'));
      break;
    }
  }
}

restartBtn.addEventListener('click',()=>{
  board = Array(9).fill(null);
  current = 'X';
  running = true;
  statusEl.textContent = `Player ${current}'s turn`;
  Array.from(boardEl.children).forEach(c=>c.classList.remove('win'));
  render();
});

createBoard();

// Mode buttons
if (modePvP && modePvAI) {
  modePvP.addEventListener('click', () => {
    mode = 'pvp';
    modePvP.classList.add('on');
    modePvAI.classList.remove('on');
    // hide difficulties when PvP
    if (difficultiesEl) difficultiesEl.style.display = 'none';
    statusEl.textContent = `Player ${current}'s turn`;
  });
  modePvAI.addEventListener('click', () => {
    mode = 'pvc';
    modePvAI.classList.add('on');
    modePvP.classList.remove('on');
    // show difficulty controls when PvAI
    if (difficultiesEl) difficultiesEl.style.display = '';
    statusEl.textContent = current === AI_PLAYER ? `AI's turn` : `Player ${current}'s turn`;
    // if AI starts (current is O), make AI move
    if (current === AI_PLAYER && running) setTimeout(() => aiMove(), 220);
  });
}

// Difficulty buttons
if (diffEasy && diffMedium && diffHard) {
  diffEasy.addEventListener('click', () => {
    difficulty = 'easy';
    diffEasy.classList.add('on'); diffMedium.classList.remove('on'); diffHard.classList.remove('on');
  });
  diffMedium.addEventListener('click', () => {
    difficulty = 'medium';
    diffMedium.classList.add('on'); diffEasy.classList.remove('on'); diffHard.classList.remove('on');
  });
  diffHard.addEventListener('click', () => {
    difficulty = 'hard';
    diffHard.classList.add('on'); diffEasy.classList.remove('on'); diffMedium.classList.remove('on');
  });
}

// AI logic (minimax)
function checkWinnerBoard(b) {
  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for (const [a,bIdx,c] of lines) {
    if (b[a] && b[a] === b[bIdx] && b[a] === b[c]) return b[a];
  }
  if (b.every(Boolean)) return 'draw';
  return null;
}

function minimax(newBoard, player) {
  const avail = newBoard.map((v,i)=> v ? null : i).filter(i=>i!==null);
  const winner = checkWinnerBoard(newBoard);
  if (winner === AI_PLAYER) return {score: 10};
  if (winner === HUMAN_PLAYER) return {score: -10};
  if (winner === 'draw') return {score: 0};

  const moves = [];
  for (let i of avail) {
    const move = {index: i};
    newBoard[i] = player;
    const result = minimax(newBoard, player === AI_PLAYER ? HUMAN_PLAYER : AI_PLAYER);
    move.score = result.score;
    newBoard[i] = null;
    moves.push(move);
  }

  let bestMove = null;
  if (player === AI_PLAYER) {
    let bestScore = -Infinity;
    for (const m of moves) if (m.score > bestScore) { bestScore = m.score; bestMove = m; }
  } else {
    let bestScore = Infinity;
    for (const m of moves) if (m.score < bestScore) { bestScore = m.score; bestMove = m; }
  }
  return bestMove;
}

function aiMove() {
  if (!running) return;
  // choose move based on difficulty
  let chosen = null;
  const avail = board.map((v,i)=> v ? null : i).filter(i=>i!==null);
  if (difficulty === 'easy') {
    // random
    chosen = avail[Math.floor(Math.random() * avail.length)];
  } else if (difficulty === 'medium') {
    // try win, then block, else random
    const win = findWinningMove(AI_PLAYER);
    if (typeof win === 'number') chosen = win;
    else {
      const block = findWinningMove(HUMAN_PLAYER);
      if (typeof block === 'number') chosen = block;
      else chosen = avail[Math.floor(Math.random() * avail.length)];
    }
  } else {
    const best = minimax(board.slice(), AI_PLAYER);
    chosen = best && typeof best.index === 'number' ? best.index : null;
  }
  if (typeof chosen === 'number') {
    board[chosen] = AI_PLAYER;
    render();
    const winner = checkWinner();
    if (winner) {
      statusEl.textContent = winner === 'draw' ? "It's a draw" : `Player ${winner} wins!`;
      running = false;
      highlightWinning(winner);
      return;
    }
    current = HUMAN_PLAYER;
    statusEl.textContent = `Player ${current}'s turn`;
  }
}

function findWinningMove(player) {
  const avail = board.map((v,i)=> v ? null : i).filter(i=>i!==null);
  for (const i of avail) {
    board[i] = player;
    const winner = checkWinner();
    board[i] = null;
    if (winner === player) return i;
  }
  return null;
}

