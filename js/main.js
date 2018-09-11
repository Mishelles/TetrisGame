const numOfCols = 10;
const numOfRows = 20;

const glassWidth = 300;
const glassHeight = 600;

const blockWidth = glassWidth / numOfCols;
const blockHeight = glassHeight / numOfRows;

const loginSection = document.getElementById('login-section');
const gameSection = document.getElementById('game-section');
const usernameInput = document.getElementById('username-form__username');
const playerNameSpan = document.getElementById('player-name');
const nextTeraminoCanvas = document.getElementById('next-teramino');
const glassCanvas = document.getElementById('glass');
var glassCtx = glassCanvas.getContext('2d');


const shapes = [
    [ 1, 1, 1, 1 ],
    [ 1, 1, 1, 0, 1 ],
    [ 1, 1, 1, 0, 0, 0, 1 ],
    [ 1, 1, 0, 0, 1, 1 ],
    [ 1, 1, 0, 0, 0, 1, 1 ],
    [ 0, 1, 1, 0, 1, 1 ],
    [ 0, 1, 0, 0, 1, 1, 1 ]
];
const colors = [
    'cyan', 'orange', 'blue', 'yellow', 'red', 'green', 'purple'
];

var currentShape;
var moving;
var board = [];
var lose;
var interval;
var intervalRender;
var currentX;
var currentY;

// draw a single square at (x, y)
function drawBlock(x, y) {
    glassCtx.fillRect(blockWidth * x, blockHeight * y, blockWidth - 1 , blockHeight - 1);
    glassCtx.strokeRect(blockWidth * x, blockHeight * y, blockWidth - 1 , blockHeight - 1 );
}

// draws the board and the moving shape
function render() {
    glassCtx.clearRect(0, 0, glassWidth, glassHeight);

    glassCtx.strokeStyle = 'black';
    for (let x = 0; x < numOfCols; x++) {
        for (let y = 0; y < numOfRows; y++) {
            if (board[y][x]) {
                glassCtx.fillStyle = colors[board[y][x] - 1];
                drawBlock(x, y);
            }
        }
    }

    glassCtx.fillStyle = 'red';
    glassCtx.strokeStyle = 'black';
    glassCtx.shadowBlur = 10;
    glassCtx.shadowColor = 'brown';
    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            if (currentShape[y][x]) {
                glassCtx.fillStyle = colors[currentShape[y][x] - 1];
                drawBlock(currentX + x, currentY + y);
            }
        }
    }
}

function newShape() {
    let id = Math.floor(Math.random() * shapes.length);
    let shape = shapes[id];

    currentShape = [];
    for (let y = 0; y < 4; y++) {
        currentShape[y] = [];
        for (let x = 0; x < 4; x++) {
            let i = 4 * y + x;
            if (typeof shape[i] != 'undefined' && shape[i]) {
                currentShape[y][x] = id + 1;
            } else {
                currentShape[y][x] = 0;
            }
        }
    }

    // Новая фигура начинает двигаться
    moving = true;

    currentX = 5;
    currentY = 0;
}

function clearBoard() {
    for (let y = 0; y < numOfRows; y++) {
        board[y] = [];
        for (let x = 0; x < numOfCols; x++) board[y][x] = 0;
    }
}

function tick() {
    if (isValid(0,1)) {
        ++currentY;
    } else {
        stopMoving();
        isValid(0, 1);
        clearLines();
        if (lose) {
            clearAllIntervals();
            return false;
        }
        newShape();
    }
}

function stopMoving() {
    for (let y = 0; y < 4; ++y) {
        for (let x = 0; x < 4; ++x) {
            if (currentShape[y][x]) {
                board[y + currentY][x + currentX] = currentShape[y][x];
            }
        }
    }
    moving = false;
}

function rotate(currentShape) {
    var newCurrentShape = [];
    for (let y = 0; y < 4; y++) {
        newCurrentShape[y] = [];
        for (let x = 0; x < 4; x++) {
            newCurrentShape[y][x] = currentShape[3 - x][y];
        }
    }

    return newCurrentShape;
}

function clearLines() {
    for (let y = numOfRows - 1; y >= 0; y--) {
        var rowFilled = true;
        for (let x = 0; x < numOfCols; x++) {
            if (board[y][x] == 0) {
                rowFilled = false;
                break;
            }
        }
        if (rowFilled) {
            for (let j = y; j > 0; j-- ) {
                for (let x = 0; x < numOfCols; x++ ) {
                    board[j][x] = board[j - 1][x];
                }
            }
            y++;
        }
    }
}

function keyPress(key) {
    switch (key) {
        case 'left':
            if (isValid(-1)) {
                --currentX;
            }
            break;
        case 'right':
            if (isValid(1)) {
                ++currentX;
            }
            break;
        case 'down':
            if (isValid(0, 1)) {
                ++currentY;
            }
            break;
        case 'rotate':
            var rotated = rotate(currentShape);
            if (isValid(0, 0, rotated)) {
                currentShape = rotated;
            }
            break;
        case 'drop':
            while(isValid(0, 1)) {
                ++currentY;
            }
            tick();
            break;
    }
}

function isValid(offsetX, offsetY, newCurrentShape) {
    offsetX = offsetX || 0;
    offsetY = offsetY || 0;
    offsetX = currentX + offsetX;
    offsetY = currentY + offsetY;
    newCurrentShape = newCurrentShape || currentShape;

    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            if (newCurrentShape[y][x]) {
                if (typeof board[y + offsetY] == 'undefined'
                    || typeof board[y + offsetY][x + offsetX] == 'undefined'
                    || board[y + offsetY][x + offsetX]
                    || x + offsetX < 0
                    || y + offsetY >= numOfRows
                    || x + offsetX >= numOfCols ) {
                    if (offsetY == 1 && !moving) {
                        lose = true;
                    }
                    return false;
                }
            }
        }
    }
    return true;
}

function clearAllIntervals() {
    clearInterval(interval);
    clearInterval(intervalRender);
}

function store(source) {
    localStorage["tetris.username"] = source.value;
}

function read(source) {
    source.value = localStorage["tetris.username"];
    if (source.value == undefined) {
        source.value = '';
    }
}

function hideElement(element) {
    element.style.display = 'none';
}

function showElement(element) {
    element.style.display = 'block';
}

function initializeGame() {
    playerNameSpan.innerText = localStorage["tetris.username"];
    showElement(gameSection);
    clearAllIntervals();
    intervalRender = setInterval(render, 30);
    clearBoard();
    newShape();
    lose = false;
    interval = setInterval(tick, 400);
}

document.getElementById('username-form').addEventListener('submit', function(event) {
    event.preventDefault();
    store(usernameInput);
    hideElement(loginSection);
    initializeGame();
});

document.body.onkeydown = function(e) {
    const keys = {
        37: 'left',
        39: 'right',
        40: 'down',
        38: 'rotate',
        32: 'drop'
    };
    if (typeof keys[e.keyCode] != 'undefined') {
        keyPress(keys[e.keyCode]);
        render();
    }
};

document.addEventListener('DOMContentLoaded', function() {
    showElement(loginSection);
    read(usernameInput);
});