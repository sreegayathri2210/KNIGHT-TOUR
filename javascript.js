const BOARD_SIZE = 8;
let board = [];
let currentPosition = null;
let moveCount = 0;
let timerInterval = null;
let startTime = null;

const rowMoves = [2, 1, -1, -2, -2, -1, 1, 2];
const colMoves = [1, 2, 2, 1, -1, -2, -2, -1];

function initializeBoard() {
    const chessboard = document.getElementById('chessboard');
    chessboard.innerHTML = '';
    board = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(0));

    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', cellClick);
            chessboard.appendChild(cell);
        }
    }

    currentPosition = null;
    moveCount = 0;
    updateMoveCounter();
    resetTimer();
    startTimer();
}

function cellClick(event) {
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);

    if (!currentPosition) {
        // First move
        currentPosition = { row, col };
        board[row][col] = ++moveCount;
        updateBoard();
    } else if (isValidMove(row, col)) {
        // Valid next move
        board[row][col] = ++moveCount;
        currentPosition = { row, col };
        updateBoard();

        if (isGameWon()) {
            showWinMessage();
        } else if (!hasValidMoves()) {
            showGameOverMessage();
        }
    }
}

function isValidMove(row, col) {
    if (board[row][col] !== 0) return false;
    
    for (let i = 0; i < 8; i++) {
        if (currentPosition.row + rowMoves[i] === row && currentPosition.col + colMoves[i] === col) {
            return true;
        }
    }
    return false;
}

function hasValidMoves() {
    for (let i = 0; i < 8; i++) {
        const newRow = currentPosition.row + rowMoves[i];
        const newCol = currentPosition.col + colMoves[i];
        if (newRow >= 0 && newRow < BOARD_SIZE && newCol >= 0 && newCol < BOARD_SIZE && board[newRow][newCol] === 0) {
            return true;
        }
    }
    return false;
}

function isGameWon() {
    return moveCount === BOARD_SIZE * BOARD_SIZE;
}

function showGameOverMessage() {
    const gameOverDiv = document.createElement('div');
    gameOverDiv.id = 'game-over';
    gameOverDiv.textContent = 'Game Over! Click to retry.';
    gameOverDiv.addEventListener('click', () => {
        document.body.removeChild(gameOverDiv);
        initializeBoard();
    });
    document.body.appendChild(gameOverDiv);
    stopTimer();
}

function showWinMessage() {
    const winDiv = document.createElement('div');
    winDiv.id = 'win-message';

    const winText = document.createElement('h2');
    winText.textContent = 'Congratulations! You Won!';
    winDiv.appendChild(winText);

    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    winDiv.appendChild(confetti);

    winDiv.addEventListener('click', () => {
        document.body.removeChild(winDiv);
        initializeBoard();
    });

    document.body.appendChild(winDiv);
    stopTimer();

    // Add confetti animation
    for (let i = 0; i < 100; i++) {
        const confettiPiece = document.createElement('div');
        confettiPiece.className = 'confetti-piece';
        confetti.appendChild(confettiPiece);
    }
}

function updateBoard() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        
        cell.classList.remove('visited', 'current', 'possible-move');
        cell.textContent = '';
        
        if (board[row][col] > 0) {
            cell.classList.add('visited');
            cell.textContent = board[row][col];
        }
        
        if (currentPosition && row === currentPosition.row && col === currentPosition.col) {
            cell.classList.add('current');
        }
        
        if (isPossibleMove(row, col)) {
            cell.classList.add('possible-move');
        }
    });
    
    updateMoveCounter();
}

function isPossibleMove(row, col) {
    if (!currentPosition || board[row][col] !== 0) return false;
    
    for (let i = 0; i < 8; i++) {
        if (currentPosition.row + rowMoves[i] === row && currentPosition.col + colMoves[i] === col) {
            return true;
        }
    }
    return false;
}

function updateMoveCounter() {
    document.getElementById('move-counter').textContent = `Moves: ${moveCount}`;
}

function startTimer() {
    startTime = new Date();
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    const now = new Date();
    const elapsedTime = Math.floor((now - startTime) / 1000);
    const minutes = Math.floor(elapsedTime / 60).toString().padStart(2, '0');
    const seconds = (elapsedTime % 60).toString().padStart(2, '0');
    document.getElementById('timer').textContent = `Time: ${minutes}:${seconds}`;
}

function stopTimer() {
    clearInterval(timerInterval);
}

function resetTimer() {
    clearInterval(timerInterval);
    document.getElementById('timer').textContent = 'Time: 00:00';
}

document.getElementById('reset-btn').addEventListener('click', initializeBoard);

initializeBoard();