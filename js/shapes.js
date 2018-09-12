const shapeI = [
    [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ],
    [
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
    ],
    [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
    ],
    [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
    ]
];

const shapeJ = [
    [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    [
        [0, 1, 1],
        [0, 1, 0],
        [0, 1, 0]
    ],
    [
        [0, 0, 0],
        [1, 1, 1],
        [0, 0, 1]
    ],
    [
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0]
    ]
];

const shapeL = [
    [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
    ],
    [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1]
    ],
    [
        [0, 0, 0],
        [1, 1, 1],
        [1, 0, 0]
    ],
    [
        [1, 1, 0],
        [0, 1, 0],
        [0, 1, 0]
    ]
];

const shapeO = [
    [
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0],
    ]
];

const shapeS = [
    [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ],
    [
        [0, 1, 0],
        [0, 1, 1],
        [0, 0, 1]
    ],
    [
        [0, 0, 0],
        [0, 1, 1],
        [1, 1, 0]
    ],
    [
        [1, 0, 0],
        [1, 1, 0],
        [0, 1, 0]
    ]
];

const shapeT = [
    [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    [
        [0, 1, 0],
        [0, 1, 1],
        [0, 1, 0]
    ],
    [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0]
    ],
    [
        [0, 1, 0],
        [1, 1, 0],
        [0, 1, 0]
    ]
];

const shapeZ = [
    [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ],
    [
        [0, 0, 1],
        [0, 1, 1],
        [0, 1, 0]
    ],
    [
        [0, 0, 0],
        [1, 1, 0],
        [0, 1, 1]
    ],
    [
        [0, 1, 0],
        [1, 1, 0],
        [1, 0, 0]
    ]
];

// Фигуры и соответствующие им цвета
const SHAPES = [
    [shapeZ, "red", "Z"],
    [shapeS, "green", "S"],
    [shapeT, "yellow", "T"],
    [shapeO, "blue", "O"],
    [shapeL, "purple", "L"],
    [shapeI, "cyan", "I"],
    [shapeJ, "orange", "J"]
];

// Генерация случайной фигуры
function randomShape(){
    let r = Math.floor(Math.random() * SHAPES.length);
    return new Shape(SHAPES[r][0],SHAPES[r][1]);
}

// Объект фигуры
function Shape(tetromino, color) {
    this.tetromino = tetromino;
    this.color = color;

    this.tetrominoN = 0;
    this.activeTetromino = this.tetromino[this.tetrominoN];

    this.x = 3;
    this.y = -2;
}

// Заполнение фигуры
Shape.prototype.fill = function(color){
    for(i = 0; i < this.activeTetromino.length; i++) {
        for(j = 0; j < this.activeTetromino.length; j++) {
            // Рисуем только "заполненные" клетки
            if(this.activeTetromino[i][j]) {
                drawSquare(this.x + j,this.y + i, color);
            }
        }
    }
}

// Отрисовка фигуры в стакане
Shape.prototype.draw = function() {
    this.fill(this.color);
}

// "Стирание" фигуры
Shape.prototype.unDraw = function() {
    this.fill(EMPTY);
}

// Перемещение фигуры вниз
Shape.prototype.moveDown = function() {
    if(!this.collision(0, 1, this.activeTetromino)) {
        this.unDraw();
        this.y++;
        this.draw();
    } else {
        // Блокируем движение фигуры и генерируем новую
        this.lock();
        s = randomShape();
    }

}

// Перемещение фигуры вправо
Shape.prototype.moveRight = function() {
    if(!this.collision(1, 0, this.activeTetromino)) {
        this.unDraw();
        this.x++;
        this.draw();
    }
}

// Перемещение фигуры влево
Shape.prototype.moveLeft = function() {
    if(!this.collision(-1, 0, this.activeTetromino)) {
        this.unDraw();
        this.x--;
        this.draw();
    }
}

// Поворот фигуры
Shape.prototype.rotate = function() {
    let nextPattern = this.tetromino[(this.tetrominoN + 1) % this.tetromino.length];
    let kick = 0;

    if(this.collision(0, 0, nextPattern)) {
        if(this.x > COL/2) {
            // Если стена справа, нам нужно сдвинуть фигуру влево
            kick = -1;
        } else {
            // Если стена слева, нам нужно сдвинуть фигуру вправо
            kick = 1;
        }
    }

    if(!this.collision(kick, 0, nextPattern)) {
        this.unDraw();
        this.x += kick;
        this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length;
        this.activeTetromino = this.tetromino[this.tetrominoN];
        this.draw();
    }
}

let score = 0;

Shape.prototype.lock = function() {
    for(i = 0; i < this.activeTetromino.length; i++) {
        for(j = 0; j < this.activeTetromino.length; j++) {
            // Пропускаем свободные клетки
            if(!this.activeTetromino[i][j]) {
                continue;
            }
            // Фигура остановилась у верхней границы - конец игры
            if(this.y + i < 0){
                gameOver = true;
                endGameAndShowRecords();
                break;
            }
            // Блокируем фигуру
            board[this.y+i][this.x+j] = this.color;
        }
    }
    // Осуществляем удаление заполненных строк
    for(i = 0; i < ROW; i++) {
        let isRowFull = true;
        for(j = 0; j < COL; j++) {
            isRowFull = isRowFull && (board[i][j] != EMPTY);
        }
        if(isRowFull) {
            // Если строка заполнена, нужно сдвинуть вниз все строки выше
            for(y = i; y > 1; y--){
                for(j = 0; j < COL; j++){
                    board[y][j] = board[y-1][j];
                }
            }
            // Самая верхняя строка не имеет строк выше, значит делаем её пустой
            for(j = 0; j < COL; j++){
                board[0][j] = EMPTY;
            }
            // Увеличиваем количество очков
            score += 100;
            // Уменьшаем интервал передвижения фигур
            interval -= 100;
        }
    }
    // Перерисовываем стакан
    drawBoard();

    // Обновляем отображение очков на странице
    scoreElement.innerHTML = score;
}

// Обработка столкновений
Shape.prototype.collision = function(x, y, shape) {
    for(i = 0; i < shape.length; i++) {
        for(j = 0; j < shape.length; j++) {
            // Если фигура пустая, пропускаем
            if(!shape[i][j]) {
                continue;
            }
            // Координаты фигуры после перемещения
            let newX = this.x + j + x;
            let newY = this.y + i + y;

            // Условия на стены
            if(newX < 0 || newX >= COL || newY >= ROW) {
                return true;
            }

            if(newY < 0) {
                continue;
            }
            // Проверка, есть ли на этом месте уже заблокированная фигура
            if(board[newY][newX] != EMPTY) {
                return true;
            }
        }
    }
    return false;
}