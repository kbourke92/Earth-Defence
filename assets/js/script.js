document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("canvas");
    const c = canvas.getContext("2d");

    /* Set the canvas to full screen initially */
    function setCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    setCanvasSize();

    /* DOM Elements */
    const scoreElement = document.getElementById("score");
    const healthElement = document.getElementById("health");
    const gameOverScreen = document.getElementById("game-over-screen");
    const finalScoreText = document.getElementById("final-score");
    const restartButton = document.getElementById("restart-button");
    const startButton = document.getElementById("start-game-button");
    const landingContainer = document.querySelector(".landing-container");
    const gameArea = document.querySelector(".game-area");
    const scoreArea = document.querySelector(".score-area");
    const footer = document.querySelector("footer");

    /* Game state */
    let score = 0;
    let health = 100;
    let gameRunning = false;

    /* Default sizes based on a full-screen canvas */
    let playerWidth = 33;
    let playerHeight = 33;
    let bulletWidth = 7;
    let bulletHeight = 9;
    let enemyWidth = 33;
    let enemyHeight = 33;
    let healthkitWidth = 33;
    let healthkitHeight = 33;

    let playerSpeed = 10;
    const bulletSpeed = 10;

    const playerImg = new Image();
    playerImg.src = "assets/images/spaceship.png";
    const enemyImg = new Image();
    enemyImg.src = "assets/images/alien.png";
    const healthkitImg = new Image();
    healthkitImg.src = "assets/images/healthkit.png";

    let bullets = [];
    let enemies = [];
    let healthkits = [];

    let playerX = canvas.width / 2;
    let playerY = canvas.height - 100;

    /* Player class */
    class Player {
        constructor(width, height) {
            this.width = width;
            this.height = height;
        }

        draw() {
            c.drawImage(playerImg, playerX, playerY, this.width, this.height);
        }

        update() {
            this.draw();
        }
    }

    /* Bullet class */
    class Bullet {
        constructor(x, y, width, height, speed) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.speed = speed;
        }

        draw() {
            c.fillStyle = "purple";
            c.fillRect(this.x, this.y, this.width, this.height);
        }

        update() {
            this.y -= this.speed;
            this.draw();
        }
    }

    /* Enemy class */
    class Enemy {
        constructor(x, y, width, height, speed) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.speed = speed;
        }

        draw() {
            c.drawImage(enemyImg, this.x, this.y, this.width, this.height);
        }

        update() {
            this.y += this.speed;
            this.draw();
        }
    }

    /* Healthkit class */
    class Healthkit {
        constructor(x, y, width, height, speed) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.speed = speed;
        }

        draw() {
            c.drawImage(healthkitImg, this.x, this.y, this.width, this.height);
        }

        update() {
            this.y += this.speed;
            this.draw();
        }
    }

    const player = new Player(playerWidth, playerHeight);

    let enemyInterval, healthkitInterval, shootInterval;

    function spawnEnemies() {
        if (!gameRunning) return;
        for (let i = 0; i < 4; i++) {
            const x = Math.random() * (canvas.width - enemyWidth);
            enemies.push(new Enemy(x, -enemyHeight, enemyWidth, enemyHeight, 1 + Math.random() * 2));
        }
    }

    function spawnHealthkits() {
        if (!gameRunning) return;
        const x = Math.random() * (canvas.width - healthkitWidth);
        healthkits.push(new Healthkit(x, -healthkitHeight, healthkitWidth, healthkitHeight, 1 + Math.random() * 2.5));
    }

    function shoot() {
        if (!gameRunning) return;
        const x = playerX + playerWidth / 2 - bulletWidth / 2;
        bullets.push(new Bullet(x, playerY, bulletWidth, bulletHeight, bulletSpeed));
    }

    function collision(a, b) {
        return (
            a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y
        );
    }

    function gameOver() {
        gameRunning = false;
        finalScoreText.textContent = `Your Score: ${score}`;
        gameOverScreen.style.display = "flex";
        clearInterval(enemyInterval);
        clearInterval(healthkitInterval);
        clearInterval(shootInterval);
    }

    function restartGame() {
        score = 0;
        health = 100;
        bullets = [];
        enemies = [];
        healthkits = [];
        gameOverScreen.style.display = "none";
        gameRunning = true;
        initPlayerPosition();
        startIntervals();
        animate();
    }

    function startIntervals() {
        enemyInterval = setInterval(spawnEnemies, 900);
        healthkitInterval = setInterval(spawnHealthkits, 6500);
        shootInterval = setInterval(shoot, 150);
    }

    function animate() {
        if (!gameRunning) return;
        requestAnimationFrame(animate);
        c.clearRect(0, 0, canvas.width, canvas.height);

        player.update();

        bullets = bullets.filter(b => {
            b.update();
            return b.y + b.height >= 0;
        });

        enemies = enemies.filter(e => {
            e.update();
            if (e.y > canvas.height) {
                health -= 1;
                if (health <= 0) gameOver();
                return false;
            }
            return true;
        });

        for (let i = enemies.length - 1; i >= 0; i--) {
            for (let j = bullets.length - 1; j >= 0; j--) {
                if (collision(enemies[i], bullets[j])) {
                    enemies.splice(i, 1);
                    bullets.splice(j, 1);
                    score++;
                    break;
                }
            }
        }

        healthkits = healthkits.filter(kit => {
            kit.update();
            if (kit.y > canvas.height) return false;
            if (collision(kit, { x: playerX, y: playerY, width: playerWidth, height: playerHeight })) {
                health = Math.min(100, health + 25);
                return false;
            }
            return true;
        });

        scoreElement.textContent = score;
        healthElement.textContent = health;
    }

    function initPlayerPosition() {
        playerX = canvas.width / 2;
        playerY = canvas.height - 100;
    }

    startButton.addEventListener("click", () => {
        landingContainer.style.display = "none";
        gameArea.style.display = "flex";
        scoreArea.style.display = "block";
        if (footer) footer.style.display = "block";

        score = 0;
        health = 100;
        bullets = [];
        enemies = [];
        healthkits = [];
        gameRunning = true;
        initPlayerPosition();
        startIntervals();
        animate();
    });

    restartButton.addEventListener("click", restartGame);

    /* Initial state */
    landingContainer.style.display = "flex";
    gameArea.style.display = "none";
    scoreArea.style.display = "none";
    if (footer) footer.style.display = "none";

    /* Movement using keyboard (Arrow keys/WASD) */
    document.addEventListener("keydown", function (event) {
        if (!gameRunning) return;

        const speed = playerSpeed;

        if (event.key === "ArrowUp" || event.key === "w") {
            playerY = Math.max(0, playerY - speed);
        }
        if (event.key === "ArrowDown" || event.key === "s") {
            playerY = Math.min(canvas.height - playerHeight, playerY + speed);
        }
        if (event.key === "ArrowLeft" || event.key === "a") {
            playerX = Math.max(0, playerX - speed);
        }
        if (event.key === "ArrowRight" || event.key === "d") {
            playerX = Math.min(canvas.width - playerWidth, playerX + speed);
        }
    });
});

