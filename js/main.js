const loginSection = document.getElementById('login-section');
const gameSection = document.getElementById('game-section');
const recordsSection = document.getElementById('records-section');

const usernameInput = document.getElementById('username-form__username');
const playerNameSpan = document.getElementById('player-name');

function storeRecord(username, score) {
    localStorage["tetris.username"]["score"] = score;
}

function storeUser(username) {
    localStorage["tetris.username"] = username;
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
    drop();
}

function endGameAndShowRecords() {
    hideElement(gameSection);
    showElement(recordsSection);
}

function initializeLoginSection() {
    if (localStorage['tetris.username'] != undefined) {
        usernameInput.value = localStorage['tetris.username'];
    }
}

document.getElementById('username-form').addEventListener('submit', function(event) {
    event.preventDefault();
    storeUser(usernameInput.value);
    hideElement(loginSection);
    initializeGame();
});

document.getElementById('start-new-game').addEventListener('click', function () {
    location.reload();
})

document.addEventListener('DOMContentLoaded', function() {
    showElement(loginSection);
    initializeLoginSection();
});