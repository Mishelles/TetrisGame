const loginSection = document.getElementById('login-section');
const gameSection = document.getElementById('game-section');
const recordsSection = document.getElementById('records-section');

const usernameInput = document.getElementById('username-form__username');
const playerNameSpan = document.getElementById('player-name');
const currentResultSpan = document.getElementById('current-result');

const scoreTableBody = document.getElementById('score-table-body');

const mainAudio = new Audio("audio/tetris-main.mp3");
const buttonAudio = new Audio("audio/buttonBeep.wav");

const buttons = document.getElementsByClassName("btn");

function stopAudio(sound) {
    sound.pause();
    sound.currentTime = 0;
}

function storeRecord(username, score) {
    let recordsTable = getRecords();
    if ((username in recordsTable) && (recordsTable[username] < score) ||
        (!(username in recordsTable))) {
        recordsTable[username] = score;
        localStorage.setItem("tetris.recordsTable", JSON.stringify(recordsTable));
    }
}

function getRecords() {
    let recordsTable = localStorage.getItem('tetris.recordsTable');
    if (!recordsTable) return new Object;
    return JSON.parse(recordsTable);
}

function storeUser(username) {
    localStorage["tetris.username"] = username;
}

function sortScores() {
    let recordsTable = getRecords();

    let items = Object.keys(recordsTable).map(function(key) {
        return [key, recordsTable[key]];
    });

    // Сортируем по количеству очков
    items.sort(function(first, second) {
        return second[1] - first[1];
    });

    return items;
}

function updateScoresTable() {
    let scores = sortScores();
    let tableContent = "";
    scores.forEach(function (record) {
        tableContent += `<tr><td>${record[1]}</td><td>${record[0]}</td></tr>`;
    });
    scoreTableBody.innerHTML = tableContent;
}

function hideElement(element) {
    element.style.display = 'none';
}

function showElement(element) {
    element.style.display = 'block';
}

function initializeGame() {
    playerNameSpan.innerText = localStorage["tetris.username"];
    gameOver = false;
    showElement(gameSection);
    mainAudio.loop = true;
    mainAudio.play();
    drop();
}

function endGameAndShowRecords() {
    stopAudio(mainAudio);
    hideElement(gameSection);
    showElement(recordsSection);
    currentResultSpan.innerText = score;
    storeRecord(localStorage["tetris.username"], score);
    updateScoresTable();
}

function initializeLoginSection() {
    if (localStorage['tetris.username'] != undefined) {
        usernameInput.value = localStorage['tetris.username'];
    }
}

// Звук при нажатии на кнопку
for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('mouseover', function () {
        buttonAudio.play();
    });
}

document.getElementById('username-form').addEventListener('submit', function(event) {
    event.preventDefault();
    storeUser(usernameInput.value);
    hideElement(loginSection);
    initializeGame();
});


document.getElementById('start-new-game').addEventListener('click', function () {
    location.reload();
});

document.getElementById('reset').addEventListener('click', function () {
    location.reload();
});

document.getElementById('show-records').addEventListener('click', function () {
    hideElement(loginSection);
    endGameAndShowRecords();
});

window.onload = function () {
    showElement(loginSection);
    initializeLoginSection();
};