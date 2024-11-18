const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const difficultySelect = document.getElementById('difficulty');
const eatSound = document.getElementById('eatSound');
const gameOverSound = document.getElementById('gameOverSound');
const scoreDisplay = document.getElementById('score');
const gameOverMessage = document.getElementById('gameOverMessage');
const finalScore = document.getElementById('finalScore');

let snake = [{ x: 200, y: 200 }];
let food = { x: 0, y: 0 };
let dx = 20;
let dy = 0;
let score = 0;
let gameInterval;
let speed = 100;
let isGameOver = false;

window.onload = function() {
    placeFood();
    drawGame();
    scoreDisplay.innerText = "Score: " + score;
};

startButton.addEventListener('click', startGame);

function startGame() {
    resetGame();
    setDifficulty();
    scoreDisplay.innerText = "Score: " + score;
    gameOverMessage.classList.add("hidden");
    isGameOver = false;
    gameInterval = setInterval(updateGame, speed);
}

function resetGame() {
    snake = [{ x: 200, y: 200 }];
    dx = 20;
    dy = 0;
    score = 0;
    clearInterval(gameInterval);
    scoreDisplay.innerText = "Score: " + score;
}

function setDifficulty() {
    const difficulty = difficultySelect.value;
    switch (difficulty) {
        case 'easy':
            speed = 300;
            break;
        case 'normal':
            speed = 200;
            break;
        case 'hard':
            speed = 100;
            break;
    }
}

function updateGame() {
    if (isGameOver) return;
    if (checkCollision()) {
        gameOverSound.play();
        endGame();
        return;
    }
    moveSnake();
    if (snake[0].x === food.x && snake[0].y === food.y) {
        eatSound.play();
        score++;
        scoreDisplay.innerText = "Score: " + score;
        placeFood();
    } else {
        snake.pop();
    }
    drawGame();
}

function endGame() {
    clearInterval(gameInterval);
    isGameOver = true;
    finalScore.innerText = score;
    gameOverMessage.classList.remove("hidden");
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
}

function checkCollision() {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    if (snake[0].x < 0 || snake[0].x >= canvas.width || snake[0].y < 0 || snake[0].y >= canvas.height) {
        return true;
    }
    return false;
}

function placeFood() {
    food.x = Math.floor(Math.random() * (canvas.width / 20)) * 20;
    food.y = Math.floor(Math.random() * (canvas.height / 20)) * 20;
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    snake.forEach(drawSnakePart);
    drawFood();
}

function drawSnakePart(snakePart) {
    ctx.fillStyle = 'blue';
    ctx.fillRect(snakePart.x, snakePart.y, 20, 20);
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, 20, 20);
}

window.addEventListener('keydown', changeDirection);

function changeDirection(event) {
    const keyPressed = event.key;
    const goingUp = dy === -20;
    const goingDown = dy === 20;
    const goingRight = dx === 20;
    const goingLeft = dx === -20;

    switch (keyPressed) {
        case 'ArrowUp':
            if (!goingDown) {
                dx = 0;
                dy = -20;
            }
            break;
        case 'ArrowDown':
            if (!goingUp) {
                dx = 0;
                dy = 20;
            }
            break;
        case 'ArrowLeft':
            if (!goingRight) {
                dx = -20;
                dy = 0;
            }
            break;
        case 'ArrowRight':
            if (!goingLeft) {
                dx = 20;
                dy = 0;
            }
            break;
    }
}
