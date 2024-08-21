let blockSize = 25;
let total_row = 17; // total number of rows
let total_col = 17; // total number of columns
let board;
let context;

let snakeX = blockSize * 5;
let snakeY = blockSize * 5;

let speedX = 0; // speed of snake in x-coordinate
let speedY = 0; // speed of snake in y-coordinate

let snakeBody = [];

let foodX;
let foodY;

let score = 0;
let highScore = 0;
let gameOver = false;
let isPaused = false;

let gradientX = blockSize * 5; // Default center
let gradientY = blockSize * 5;

window.onload = function () {
    board = document.getElementById("board");
    board.height = total_row * blockSize;
    board.width = total_col * blockSize;
    context = board.getContext("2d");

    placeFood();
    document.addEventListener("keyup", handleInput);
    
    // Set the speed of the snake; updates the game 5 times per second (slower speed)
    setInterval(update, 1000 / 5);
}

function update() {
    if (gameOver) {
        context.fillStyle = "red";
        context.font = "50px Arial";
        context.fillText("Game Over", board.width / 4, board.height / 2);
        context.font = "30px Arial";
        context.fillText("Press any key to restart", board.width / 6, board.height / 1.5);

        document.addEventListener("keydown", restartGame);
        return;
    }

    if (isPaused) {
        context.fillStyle = "rgba(0, 0, 0, 0.5)";
        context.fillRect(0, 0, board.width, board.height);
        context.fillStyle = "white";
        context.font = "30px Arial";
        context.fillText("Paused", board.width / 2.5, board.height / 2);
        return;
    }

    // Draw the gradient glow
    drawGlow();

    // Background of the game
    context.fillStyle = "#282c34";
    context.fillRect(0, 0, board.width, board.height);

    // Set food color and position
    context.fillStyle = "#e63946";
    context.beginPath();
    context.arc(foodX + blockSize / 2, foodY + blockSize / 2, blockSize / 2, 0, 2 * Math.PI);
    context.fill();

    if (snakeX === foodX && snakeY === foodY) {
        snakeBody.push([foodX, foodY]);
        score++;
        if (score > highScore) {
            highScore = score;
        }
        updateScore();
        placeFood();
    }

    // Move the snake body
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    if (snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY];
    }

    // Update the snake's position
    snakeX += speedX * blockSize;
    snakeY += speedY * blockSize;

    // Draw the snake head as a circle
    context.fillStyle = "#61dafb";
    context.beginPath();
    context.arc(snakeX + blockSize / 2, snakeY + blockSize / 2, blockSize / 2, 0, 2 * Math.PI);
    context.fill();

    // Draw the snake body as circles
    for (let i = 0; i < snakeBody.length; i++) {
        context.beginPath();
        context.arc(snakeBody[i][0] + blockSize / 2, snakeBody[i][1] + blockSize / 2, blockSize / 2, 0, 2 * Math.PI);
        context.fill();
    }

    // Check for collisions with walls
    if (snakeX < 0 || snakeX >= total_col * blockSize || snakeY < 0 || snakeY >= total_row * blockSize) {
        gameOver = true;
    }

    // Check for collisions with the snake's body
    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeX === snakeBody[i][0] && snakeY === snakeBody[i][1]) {
            gameOver = true;
        }
    }
}

function handleInput(e) {
    if (e.code === "KeyP"|| e.code === "27") {
        togglePause();
    } else {
        changeDirection(e);
    }
}

function changeDirection(e) {
    if (e.code === "ArrowUp" && speedY !== 1) {
        speedX = 0;
        speedY = -1;
        gradientX = board.width / 2; // Center gradient for Up
        gradientY = blockSize * 2; // Top side of the canvas
    } else if (e.code === "ArrowDown" && speedY !== -1) {
        speedX = 0;
        speedY = 1;
        gradientX = board.width / 2; // Center gradient for Down
        gradientY = board.height - blockSize * 2; // Bottom side of the canvas
    } else if (e.code === "ArrowLeft" && speedX !== 1) {
        speedX = -1;
        speedY = 0;
        gradientX = blockSize * 2; // Left side of the canvas
        gradientY = board.height / 2; // Center gradient for Left
    } else if (e.code === "ArrowRight" && speedX !== -1) {
        speedX = 1;
        speedY = 0;
        gradientX = board.width - blockSize * 2; // Right side of the canvas
        gradientY = board.height / 2; // Center gradient for Right
    }
}

function drawGlow() {
    const gradient = context.createRadialGradient(gradientX, gradientY, 10, gradientX, gradientY, board.width / 2);
    gradient.addColorStop(0, "rgba(255, 255, 255, 0.8)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

    context.fillStyle = gradient;
    context.fillRect(0, 0, board.width, board.height);
}

// Randomly place food
function placeFood() {
    foodX = Math.floor(Math.random() * total_col) * blockSize;
    foodY = Math.floor(Math.random() * total_row) * blockSize;
}

function updateScore() {
    document.getElementById("score").innerText = "Score: " + score;
    document.getElementById("highScore").innerText = "High Score: " + highScore;
}

function restartGame() {
    // Reset game variables
    snakeX = blockSize * 5;
    snakeY = blockSize * 5;
    speedX = 0;
    speedY = 0;
    snakeBody = [];
    score = 0;
    gameOver = false;
    isPaused = false; // Ensure the game is not paused on restart
    updateScore();
    placeFood();

    // Remove the event listener to prevent multiple restarts
    document.removeEventListener("keydown", restartGame);
}

function togglePause() {
    isPaused = !isPaused;
}
