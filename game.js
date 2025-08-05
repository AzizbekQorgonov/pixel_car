const gameArea = document.getElementById("gameArea");
const startBtn = document.getElementById("startBtn");
const mainMenu = document.getElementById("mainMenu");
const player = document.getElementById("player");
const fog = document.getElementById("fog");
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");
const restartBtn = document.getElementById("restartBtn");
const menuBtn = document.getElementById("menuBtn");

let score = 0;
let highScore = 0;
let obstacles = [];
let lanes = [25, 50, 75];
let currentLaneIndex = 1;
let gameInterval, obstacleInterval;

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", () => {
    resetGame();
    startGame();
});
menuBtn.addEventListener("click", () => {
    resetGame();
    gameArea.style.display = "none";
    mainMenu.style.display = "flex";
});

function startGame() {
    mainMenu.style.display = "none";
    gameArea.style.display = "block";
    score = 0;
    updateScore(0);
    player.style.left = lanes[currentLaneIndex] + "%";
    fog.style.opacity = 1;

    restartBtn.style.display = "none";
    menuBtn.style.display = "none";

    gameInterval = setInterval(() => {
        score++;
        updateScore(score);
    }, 300);

    obstacleInterval = setInterval(createObstacle, 1000);
}

function updateScore(val) {
    scoreEl.textContent = val;
    if (val > highScore) {
        highScore = val;
        highScoreEl.textContent = highScore;
    }
}

function createObstacle() {
    const obs = document.createElement("div");
    obs.classList.add("obstacle");
    let lane = lanes[Math.floor(Math.random() * lanes.length)];
    obs.style.left = lane + "%";
    gameArea.appendChild(obs);
    obstacles.push(obs);

    let topPos = -80;
    const move = setInterval(() => {
        topPos += 5;
        obs.style.top = topPos + "px";

        const playerRect = player.getBoundingClientRect();
        const obsRect = obs.getBoundingClientRect();
        if (
            obsRect.bottom > playerRect.top &&
            obsRect.top < playerRect.bottom &&
            obsRect.left < playerRect.right &&
            obsRect.right > playerRect.left
        ) {
            crash();
            clearInterval(move);
        }

        if (topPos > window.innerHeight) {
            clearInterval(move);
            gameArea.removeChild(obs);
            obstacles = obstacles.filter(o => o !== obs);
        }
    }, 30);
}

function crash() {
    clearInterval(gameInterval);
    clearInterval(obstacleInterval);
    fog.style.opacity = 0;
    gameArea.classList.add("crash");

    setTimeout(() => {
        restartBtn.style.display = "block";
        menuBtn.style.display = "block";
    }, 500);
}

function resetGame() {
    clearInterval(gameInterval);
    clearInterval(obstacleInterval);
    obstacles.forEach(obs => obs.remove());
    obstacles = [];
    currentLaneIndex = 1;
    player.style.left = lanes[currentLaneIndex] + "%";
    fog.style.opacity = 1;
    score = 0;
    updateScore(score);
    gameArea.classList.remove("crash");
    restartBtn.style.display = "none";
    menuBtn.style.display = "none";
}

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" && currentLaneIndex > 0) {
        currentLaneIndex--;
        player.style.left = lanes[currentLaneIndex] + "%";
    }
    if (e.key === "ArrowRight" && currentLaneIndex < lanes.length - 1) {
        currentLaneIndex++;
        player.style.left = lanes[currentLaneIndex] + "%";
    }
});
