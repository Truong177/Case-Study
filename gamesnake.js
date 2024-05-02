const cvs = document.getElementById('cvs');
const ctx = cvs.getContext('2d');
const width = cvs.width;
const height = cvs.height;
let boardcolor = '#000000';
let headcolor = '#FFF';
let bodycolor = '#999';
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
function frame() {
    drawBoard();
    drawFood();
    drawSnake();
}
frame();
