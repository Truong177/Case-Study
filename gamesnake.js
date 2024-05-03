const cvs = document.getElementById('cvs');
const ctx = cvs.getContext('2d');
const width = cvs.width;
const height = cvs.height;
let boardcolor = '#000000';
let headcolor = '#FFF';
let bodycolor = '#999';
let gameStarted = false;
const FPS = 1000 / 10;
let gameLoop;
let score = 0;
let maxScore = 0;
function drawBoard() {
    ctx.fillStyle = boardcolor;
    ctx.fillRect(0, 0, width, height);
}
const squareSize = 20;
function drawSquare(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * squareSize, y * squareSize, squareSize, squareSize);
    ctx.strokeStyle = boardcolor;
    ctx.strokeRect(x * squareSize, y * squareSize, squareSize, squareSize);
}
let snake = [
    {x: 2, y: 0},
    {x: 1, y: 0},
    {x: 0, y: 0}
]
function drawSnake() {
    for (let i = 0; i < snake.length; i++) {
        const square = snake[i];
        let color;
        if (i === 0) {
            color = headcolor;
        } else {
            color = bodycolor;
        }
        drawSquare(square.x, square.y, color);
    }
}
const horizontalSq = width / squareSize;
const verticalSq = height / squareSize;
function createFood() {
    let food = {
        x: Math.floor(Math.random() * horizontalSq),
        y: Math.floor(Math.random() * verticalSq),
    };
    let isOverlap = false;
    for (const square of snake) {
        if (square.x === food.x && square.y === food.y) {
            isOverlap = true;
            break;
        }
    }
    return food;
}
let food = createFood();
function drawFood() {
    drawSquare(food.x, food.y, '#F95700');
}
let currentDirection = '';
let directionsQueue = [];
const directions = {
    RIGHT: 'ArrowRight',
    LEFT: 'ArrowLeft',
    UP: 'ArrowUp',
    DOWN: 'ArrowDown',
};
function moveSnake() {
    if (!gameStarted) return;
    const head = { x: snake[0].x, y: snake[0].y };
    if (directionsQueue.length){
        currentDirection = directionsQueue.shift();
    }
    switch (currentDirection) {
        case directions.RIGHT:
            head.x += 1;
            break;
        case directions.LEFT:
            head.x -= 1;
            break;
        case directions.UP:
            head.y -= 1;
            break;
        case directions.DOWN:
            head.y += 1;
            break;
    }
    if (hasEatenFood()) {
        increaseScore();
        food = createFood();
    } else {
        snake.pop();
    }
    snake.unshift(head);
}
function hasEatenFood() {
    const head = snake[0];
    return head.x === food.x && head.y === food.y;
}
document.addEventListener('keyup', setDirection);
function setDirection(event) {
    const newDirection = event.key;
    const oldDirection = currentDirection;

    if (
        (newDirection === directions.LEFT &&
            oldDirection !== directions.RIGHT) ||
        (newDirection === directions.RIGHT &&
            oldDirection !== directions.LEFT) ||
        (newDirection === directions.UP &&
            oldDirection !== directions.DOWN) ||
        (newDirection === directions.DOWN &&
            oldDirection !== directions.UP)
    ) {
        if (!gameStarted) {
            gameStarted = true;
            gameLoop = setInterval(frame, FPS);
        }
        directionsQueue.push(newDirection);
    }
}
function hitWall() {
    const head = snake[0];
    return (
        head.x < 0 || head.x >= horizontalSq || head.y < 0 || head.y >= verticalSq
    );
}
function hitSelf() {
    const snakeBody = snake.slice();
    const head = snakeBody.shift();
    let found = false;
    for (let square of snakeBody) {
        if (square.x === head.x && square.y === head.y) {
            found = true;
            break;
        }
    }
    return found;
}
function increaseScore() {
    score++;
    document.getElementById('score').innerHTML = '⭐ Score ' +score;
}
function highScore() {
    if (score > maxScore){
        maxScore = score;
        document.getElementById('high-score').innerHTML ='🏆 High Score ' +maxScore;
    }
}
document.getElementById('high-score').innerHTML = '🏆 High Score: ' + maxScore;
function gameOver(message) {
    clearInterval(gameLoop);
    showGameOver(message);
}

function showGameOver(message) {
    ctx.fillStyle = '#FFF';
    ctx.font = '30px Arial';
    ctx.fillText(message, width / 2 - 80, height / 2);
    gameStarted = false;
    resetGame();
}
function resetGame() {
    score = 0;
    document.getElementById('score').innerHTML = '⭐ Score ' +score;
    snake = [
        { x: 2, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: 0 },
    ];
    currentDirection = '';
    directionsQueue = [];
    food = createFood();
}
const playAgainBtn = document.getElementById('play-again-button');
playAgainBtn.addEventListener('click', function() {
    clearInterval(gameLoop);
    resetGame();
    gameLoop = setInterval(frame, FPS);
});
function frame() {
    drawBoard();
    drawFood();
    drawSnake();
    moveSnake();
    highScore()
    if (hitWall() || hitSelf()) {
        clearInterval(gameLoop);
        gameOver('Game Over!');
    }
}
frame();
