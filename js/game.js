const cvs = document.getElementById("board");
const ctx = cvs.getContext("2d");
const scoreElement = document.getElementById("score");

// Количество строк
const ROW = 20;

// Количество столбцов
const COL = 10;

// Размер клетки
const SQUARE_SIZE = 20;

// Цвет пустой клетки
const EMPTY = "white";

let gameOver = true;

// Отрисовка квадрата
function drawSquare(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * SQUARE_SIZE, y * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);

    ctx.strokeStyle = "black";
    ctx.strokeRect(x * SQUARE_SIZE, y * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
}

// Создание "Стакана"
let board = [];
for(i = 0; i <ROW; i++) {
    board[i] = [];
    for(j = 0; j < COL; j++) {
        board[i][j] = EMPTY;
    }
}

// Отрисовка "Стакана"
function drawBoard(){
    for(i = 0; i <ROW; i++) {
        for(j = 0; j < COL; j++) {
            drawSquare(j, i, board[i][j]);
        }
    }
}

drawBoard();

let s = randomShape();

// Управление с клавиатуры
document.addEventListener("keydown", function (event) {
    if(event.keyCode == 37) {
        s.moveLeft();
        dropStart = Date.now();
    } else if(event.keyCode == 38) {
        s.rotate();
        dropStart = Date.now();
    } else if(event.keyCode == 39) {
        s.moveRight();
        dropStart = Date.now();
    } else if((event.keyCode == 40) || (event.keyCode == 32)) {
        s.moveDown();
    }
});

// Опускаем фигуры через определенные интервалы (начальный интервал - 1000мс)
let interval = 1000;
let dropStart = Date.now();
function drop() {
    let now = Date.now();
    let delta = now - dropStart;
    if(delta > interval) {
        s.moveDown();
        dropStart = Date.now();
    }
    if (!gameOver) {
        requestAnimationFrame(drop);
    }
}