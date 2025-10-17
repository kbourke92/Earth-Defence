window.onload = function () {
    const canvas = document.getElementById("Canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const c = canvas.getContext("2d");

    // DOM references
    const scoreElement = document.getElementById("score");
    const healthElement = document.getElementById("health");
    const gameOverScreen = document.getElementById("game-over-screen");
    const finalScoreText = document.getElementById("final-score");
    const restartButton = document.getElementById("restart-button");

    // Game state
    let score = 0;
    let health = 100;
    let gameRunning = true;

    const playerWidth = 33;
    const playerHeight = 33;
    const bulletWidth = 7;
    const bulletHeight = 9;
    const bulletSpeed = 10;
    const enemyWidth = 33;
    const enemyHeight = 33;
    const healthkitWidth = 33;
    const healthkitHeight = 33;

    const playerImg = new Image();
    playerImg.src = "assets/images/spaceship.png";
    const enemyImg = new Image();
    enemyImg.src = "assets/images/alien.png";
    const healthkitImg = new Image();
    healthkitImg.src = "assets/images/Healthkit.png";

    let bullets = [];
    let enemies = [];
    let healthkits = [];

    // Player position (keyboard-controlled)
    let playerX = innerWidth / 2;
    let playerY = innerHeight - 100;
    const playerSpeed = 7;

    // Keyboard input tracking
    const keys = {
        ArrowUp: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false,
        w: false,
        a: false,
        s: false,
        d: false
    };

    document.addEventListener("keydown", (e) => {
        if (e.key in keys) keys[e.key] = true;
    });

    document.addEventListener("keyup", (e) => {
        if (e.key in keys) keys[e.key] = false;
    });

    function Player(width, height) {
        this.width = width;
        this.height = height;

        this.draw = function () {
            c.drawImage(playerImg, playerX, playerY, this.width, this.height);
        };

        this.update = function () {
            this.draw();
        };
    }

    function Bullet(x, y, width, height, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;

        this.draw = function () {
            c.fillStyle = "white";
            c.fillRect(this.x, this.y, this.width, this.height);
        };

        this.update = function () {
            this.y -= this.speed;
            this.draw();
        };
    }

    function Enemy(x, y, width, height, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;

        this.draw = function () {
            c.drawImage(enemyImg, this.x, this.y, this.width, this.height);
        };

        this.update = function () {
            this.y += this.speed;
            this.draw();
        };
    }

    function Healthkit(x, y, width, height, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;

        this.draw = function () {
            c.drawImage(healthkitImg, this.x, this.y, this.width, this.height);
        };

        this.update = function () {
            this.y += this.speed;
            this.draw();
        };
    }

    const player = new Player(playerWidth, playerHeight);

    function spawnEnemies() {
        if (!gameRunning) return;
        for (let i = 0; i < 4; i++) {
            const x = Math.random() * (innerWidth - enemyWidth);
            const y = -enemyHeight;
            const speed = 1 + Math.random() * 2;
            enemies.push(new Enemy(x, y, enemyWidth, enemyHeight, speed));
        }
    }
    setInterval(spawnEnemies, 1250);

    function spawnHealthkits() {
        if (!gameRunning) return;
        const x = Math.random() * (innerWidth - healthkitWidth);
        const y = -healthkitHeight;
        const speed = 1 + Math.random() * 2;
        healthkits.push(new Healthkit(x, y, healthkitWidth, healthkitHeight, speed));
    }
    setInterval(spawnHealthkits, 13000);

    function shoot() {
        if (!gameRunning) return;
        const x = playerX + playerWidth / 2 - bulletWidth / 2;
        const y = playerY;
        bullets.push(new Bullet(x, y, bulletWidth, bulletHeight, bulletSpeed));
    }
    setInterval(shoot, 200);

    function collision(a, b) {
        return a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
    }

    function gameOver() {
        gameRunning = false;
        finalScoreText.textContent = "Your Score: " + score;
        gameOverScreen.style.display = "flex";
    }

    function restartGame() {
        score = 0;
        health = 100;
        bullets = [];
        enemies = [];
        healthkits = [];
        gameOverScreen.style.display = "none";
        gameRunning = true;
        animate(); // Restart game loop
    }

    restartButton.addEventListener("click", restartGame);

    function animate() {
        if (!gameRunning) return;
        requestAnimationFrame(animate);
        c.clearRect(0, 0, canvas.width, canvas.height);

        // Move player
        if (keys.ArrowLeft || keys.a) playerX -= playerSpeed;
        if (keys.ArrowRight || keys.d) playerX += playerSpeed;
        if (keys.ArrowUp || keys.w) playerY -= playerSpeed;
        if (keys.ArrowDown || keys.s) playerY += playerSpeed;

        // Clamp player within canvas bounds
        playerX = Math.max(0, Math.min(canvas.width - playerWidth, playerX));
        playerY = Math.max(0, Math.min(canvas.height - playerHeight, playerY));

        player.update();

        for (let i = bullets.length - 1; i >= 0; i--) {
            bullets[i].update();
            if (bullets[i].y + bullets[i].height < 0) bullets.splice(i, 1);
        }

        for (let i = enemies.length - 1; i >= 0; i--) {
            enemies[i].update();
            if (enemies[i].y > canvas.height) {
                enemies.splice(i, 1);
                health -= 10;
                if (health <= 0) {
                    gameOver();
                    return;
                }
            }
        }

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

        for (let i = healthkits.length - 1; i >= 0; i--) {
            healthkits[i].update();
            if (healthkits[i].y > canvas.height) {
                healthkits.splice(i, 1);
                continue;
            }
            if (collision(healthkits[i], { x: playerX, y: playerY, width: playerWidth, height: playerHeight })) {
                health = Math.min(100, health + 20);
                healthkits.splice(i, 1);
            }
        }

        // Update HUD
        scoreElement.textContent = score;
        healthElement.textContent = health;
    }

    animate();
};